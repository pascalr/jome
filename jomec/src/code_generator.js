const { compileUtility } = require("jome-lib/compileUtility")
const {compileTokenRaw} = require("./parser.js")
const {filterCommas, filterNewlines} = require("./validator.js")
const Argument = require("./argument")
const crypto = require('crypto');

const GLOBAL_PREFIX = 'g_'

function genCode(node) {
  let generator = CODE_GENERATORS[node.type]
  if (!generator) {
    throw new Error("Can't compile node of type "+node.type)
  }
  return generator(node)
}

function genImports(ctxFile, compilerOptions) {
  let result = ""
  let files = new Set([...Object.keys(ctxFile.namedImportsByFile), ...Object.keys(ctxFile.defaultImportsByFile)])
  files.forEach(file => {
    let jsfile = file
    if (file.endsWith('.jomm') || file.endsWith('.jome')) {
      ctxFile.addDependency(file)
      jsfile = file.slice(0,-5)+'.js' // remove .jome and replace extension with js
    }
    let def = ctxFile.defaultImportsByFile[file]
    let named = ctxFile.namedImportsByFile[file]
    if (compilerOptions.useCommonJS) {
      if (def) {
        result += `const ${def} = require("${jsfile}");\n`
      } else {
        result += `const {${[...named].join(', ')}} = require("${jsfile}");\n`
      }
    } else {
      if (def) {
        result += `import ${def} from "${jsfile}";\n`
      } else {
        result += `import {${[...named].join(', ')}} from "${jsfile}";\n`
      }
    }
  })
  return result
}

function escapeTemplateLiteral(inputString) {
  return inputString.replace(/\$\{/g, '\u005c\$\{')
}

function escapeBackticks(inputString) {
  return inputString.replace(/`/g, '\u005c`').replace(/\\\\`/g, '\\\\\\`')
}

function escapeDoubleQuotes(inputString) {
  return inputString.replace(/"/g, '\\"')
}

function compileOperatorUnary(node) {
  return `${node.raw}${genCode(node.operands[0])}`
}

function compileOperator(node) {
  return `${genCode(node.operands[0])} ${node.raw} ${genCode(node.operands[1])}`
}

function compileRaw(node) {
  return node.raw
}

function compileArgs(node) { 
  if (node.type === 'variable.other.jome') {
    return node.raw
  }
  let cs = node.parts.slice(1, -1) // remove vertical bars
  //let args = 
  //let todo = 10
  return `(${cs.map(c => genCode(c)).join('')})`
}

function compileEntry(node) {
  let name = node.parts[0].raw
  let value = genCode(node.operands[0])
  return `${name}: ${value}`
}

function compileBlock(node) {
  let cs = node.parts.slice(1, -1) // remove curly braces
  if (cs.every(c => c.type === 'meta.dictionary-key.jome')) {
    return `{${cs.map(c => compileEntry(c))}}`
  }
  // A value is only on a single line, except if using parentheses.
  return '{}'
}

function compileArrowFunction(node) {
  if (node.operands.length > 1) {
    let args = node.operands[0]
    return `${compileArgs(args)} => (${node.operands.slice(1).map(c => genCode(c)).join('')})`
  } else {
    return `() => (${genCode(node.operands[0])})`
  }
}

function compileConstrutor(node) {
  let args = node.ctxFile.currentArguments
  if (args) {
    return `constructor(${args.map(a => a.compile()).join(', ')}) {
      ${args.filter(a => a.isClassProperty).map(a => {
        return `this.${a.name} = ${a.name}`
      }).join('\n')}  
    }\n`
    node.ctxFile.currentArguments = null
  }
  return ''
}

// A def inside a class
function compileMethod(node) {
  let name = node.parts[1].raw
  let cs = node.parts.slice(2,-1) // Remove keywords def, end, and function name
  let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
  if (args) {
    return `${name} = ${compileArgs(args)} => {\n${cs.slice(1).map(c => genCode(c)).join('')}\n}`
  } else {
    return `${name} = () => {\n${cs.map(c => genCode(c)).join('')}\n}`
  }
}

// A def outside a class
function compileDefFunction(node) {
  let name = node.parts[1].raw
  let cs = node.parts.slice(2,-1) // Remove keywords def, end, and function name
  let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
  if (args) {
    return `function ${name}${compileArgs(args)} {${cs.slice(1).map(c => genCode(c)).join('')}}`
  } else {
    return `function ${name}() {${cs.map(c => genCode(c)).join('')}}`
  }
}

function compileStandaloneFunction(node) {
  let cs = node.parts.slice(1,-1) // Remove keywords do and end
  let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
  if (args) {
    return `function ${compileArgs(args)} {${cs.slice(1).map(c => genCode(c)).join('')}}`
  } else {
    return `function () {${cs.map(c => genCode(c)).join('')}}`
  }
}

function compileInterpolate(node, str, escSeqBeg = '${', escSeqEnd = '}') {
  // FIXME: This is a simplify method that does not allow "%>" to be for example inside a string
  // FIXME: <html><%= "%>" %></html> // DOES NOT WORK
  // A proper solution would be to have all the tmLanguage files to tokenize properly, and inject
  // into the grammar files my interpolation tag.
  // But this does not fix the problem that syntax highlighting does not work...
  // So keep it simple for now

  // One part of the solution I think is to tokenize and check that if all the groups were close
  // In order to handle <% if (true) ( %> Blah blah <% ) %>
  // TODO: Checker comment ils font dans eta.js

  return str.replace(/(?<!\\)<%=((.|\n)*?)%>/g, (match, group) => {
    let raw = group.trim()
    let out = node.ctxFile.compiler.compileCode(raw, {inline: true})
    return escSeqBeg+out+escSeqEnd
  });
}

function toPrimitive(str) {
  // Check if the string represents an integer
  if (/^-?\d+$/.test(str)) {
    return parseInt(str, 10);
  }

  // Check if the string represents a floating-point number
  if (/^-?\d+\.\d+$/.test(str)) {
    return parseFloat(str);
  }

  // Check if the string is a string
  if (str.startsWith('"') || str.startsWith("'")) {
    //return str.slice(1,-1)
    return str
  }

  if (str === 'true') {return true}
  if (str === 'false') {return false}

  throw new Error("TODO fas02934n890fhsn0n1")
}

function parseArgument(node) {
  if (node.type === 'variable.other.jome') {
    return new Argument(node.raw)
  } else if (node.type === 'keyword.operator.assignment.jome') {
    let arg = parseArgument(node.operands[0])
    arg.defaultValue = genCode(node.operands[1])
    return arg
  } else if (node.type === 'meta.deconstructed-arg.jome') {
    let parts = filterCommas(filterNewlines(node.parts.slice(1,-1))) // Remove curly braces
    let arg = new Argument()
    parts.forEach(part => {
      arg.deconstructed.push(parseArgument(part))
    })
    return arg
  } else if (node.type === 'support.type.property-name.attribute.jome') {
    let arg = new Argument(node.raw.slice(1))
    arg.isClassProperty = true
    return arg
  } else {
    throw new Error("sf8923jr890shf89h2389r2h")
  }
}

// Combine all the named parameters given into a single object
function mergeNamedParameters(args) {
  let merged = []
  let obj = {}
  args.forEach(arg => {
    if (arg.type === 'keyword.operator.colon.jome') {
      obj[arg.operands[0].raw] = toPrimitive(genCode(arg.operands[1]))
    } else if (arg.type === 'variable.symbol.jome') {
      let name = arg.raw.slice(1)
      obj[name] = name
    } else {
      merged.push(arg)
    }
  })
  if (Object.keys(obj).length) {
    merged.push({type: "plain", raw: `{${Object.keys(obj).map(k => `${k}: ${obj[k]}`)}}`})
  }
  return merged
}

function compUtility(node) {
  let name = node.raw.slice(1)
  return compileUtility(name, node)
}

function compInlineUtility(node) {
  let name = node.raw.slice(2)
  let args = node.operands.map(c => genCode(c));
  return compileUtility(name, node, args)
}

// No dot before the func call
function compileFuncCall(node) {
  let tok = node.data.nameTok
  let isInlineUtil = tok.type === 'entity.name.function.utility-inline.jome' // .#
  if (tok.type === 'entity.name.function.utility.jome' || isInlineUtil) {
    let name = tok.raw.slice(isInlineUtil ? 2 : 1)
    let args = [...node.operands, ...mergeNamedParameters(node.data.args)].map(c => genCode(c));
    return compileUtility(name, node, args)
  }
  let called = genCode(node.data.nameTok)
  if (node.ctxFile.classIdentifiers.has(called)) {
    called = `new ${called}`
  }
  let args = mergeNamedParameters(node.data.args)
  let str = args.map(p => genCode(p)).join(', ')
  return `${called}(${str})`
}

// With a dot before the func call
function compileMetaFuncCall(node) {
  return `${genCode(node.operands[0])}.${compileFuncCall(node)}`
}

function formatLines(node, lines, format, isTemplateLiteral=true, escapeTemplateLit) {
  let _lines = [...lines]
  let transformers = []
  if (format) {
    let mods = format.slice(1).split('%')
    mods.forEach(mod => {
      if (mod.includes(':')) {
        // A transformer
        transformers.push(mod.slice(1))
      } else if (mod.includes('l')) {
        // A line modifier
        if (mod === 'xl') {
          _lines = _lines.map(l => l.trimLeft())
        } else if (mod === 'lx') {
          _lines = _lines.map(l => l.trimRight())
        } else if (mod === 'xlx') {
          _lines = _lines.map(l => l.trim())
        } else if (mod === 'l') { // do nothing
        } else {
          throw new Error("Unkown string format %"+mod)
        }
      } else if (mod.includes('s')) {
        // The whole string modifier
        if (!(mod === 'xs' || mod === 'sx' || mod === 'xsx' || mod === 's')) {
          throw new Error("Unkown string format %"+mod)
        }
        if (mod[0] === 'x' && !(_lines[0]?.length)) {
          _lines = _lines.slice(1)
        }
        if (mod.slice(-1) === 'x' && !(_lines[_lines.length-1]?.length)) {
          _lines = _lines.slice(0, -1)
        }
      } else if (mod.includes('j')) {
        // A join modifier
        throw new Error("sf8h902340ij0sdfsd")
      } else if (mod.includes('i')) {
        // An indent modifier
        throw new Error("93845h978sgh789fg3")
      } else {
        throw new Error("fsj8932h897w0gf0792g3b4")
      }
    })
  }
  let result = _lines.join('\n')
  if (isTemplateLiteral) {
    if (escapeTemplateLit) {result = escapeTemplateLiteral(result)}
    result = `\`${escapeBackticks(result)}\``
  } else {
    result = `"${escapeDoubleQuotes(result)}"`
  }
  transformers.forEach(transfo => {
    if (transfo[0] === '#') {
      result = compileUtility(transfo.slice(1), node, [result])
    } else {
      result = `${transfo}(${result})`
    }
  })
  return result
}

function mergeFormat(format, defaultFormat) {
  // Keep every part of the default format, than only modify those that are specified by format
  // Let's say: default: %xsx%xl
  // And format is %l
  // This means we don't want to trim the lines
  // The merge should be %xsx%l
  // Use %0 to reset (don't use default format)
  let mods = {}
  let formats = format?.includes('%0') ? [format] : [defaultFormat, format].filter(f => f)
  formats.forEach(f => {
    let parts = f.split('%').slice(1)
    parts.forEach(part => {
      if (part[0] === ':') {
        mods[':'] = part
      } else if (part.includes('s')) { // Careful this is dangerous this must be put at the end, because it catches a lot (ex: :s, which is wrong should be :, not s)
        mods['s'] = part
      } else if (part.includes('l')) { // Careful this is dangerous this must be put at the end, because it catches a lot (ex: :l, which is wrong should be :, not l)
        mods['l'] = part
      }
    })
  })
  if (!Object.keys(mods).length) {return null}
  let result = Object.keys(mods).map(m => `%${mods[m]}`).join('')
  return result
}

function compileHeredoc(node) {
  let raw = node.data.content
  let substitutions = {}
  let withSubs = raw.replace(/(?<!\\)<%s\s+(\w+)\s*%>/g, (match, group) => {
    let hash = crypto.createHash('md5').update(group).digest("hex")
    substitutions[hash] = group
    return hash
  });
  let lines = withSubs.split('\n')
  let format = mergeFormat(node.data.format, node.ctxFile.defaultFormatByTagName[node.data.tagName])
  let content = formatLines(node, lines, format, true, true)
  let result = compileInterpolate(node, content)
  Object.keys(substitutions).forEach(hash => {
    result = result + `.replace('${hash}', ${substitutions[hash]})`
  })
  return result
}

function compileString(node) {
  let currentLine = ""
  let lines = []
  let isTemplateLiteral = false
  node.data.parts.forEach(part => {
    if (part.type === 'raw') {
      currentLine += part.raw
    } else if (part.type === 'meta.string-template-literal.jome') {
      isTemplateLiteral = true
      currentLine += "${"+genCode(part.data.code)+"}"
    } else if (part.type === 'newline') {
      isTemplateLiteral = true
      lines.push(currentLine)
      currentLine = ""
    }
  })
  lines.push(currentLine)
  let format = mergeFormat(node.data.format, node.ctxFile.defaultMultilineFormat)
  let result = formatLines(node, lines, format, isTemplateLiteral)
  return result
}

function compileStringSingleQuote(node) {
  let content = node.raw.startsWith("'''") ? (node.raw.slice(3,-3)) : (node.raw.slice(1,-1))
  let lines = content.split('\n')
  let format = mergeFormat(node.data.format, node.ctxFile.defaultMultilineFormat)
  let result = formatLines(node, lines, format, lines.length > 1)
  return result
}

// Convert the node (string.quoted...) to an array of array for formats to chain.
function prepareFormatting(node) {
  if (node.type === 'variable.other.jome') {
    return [[{code: node.raw}]]
  }
  let currentLine = []
  let lines = []
  node.data.parts.forEach(part => {
    if (part.type === 'raw') {
      currentLine.push(part.raw)
    } else if (part.type === 'meta.string-template-literal.jome') {
      currentLine.push({code: part.data.code})
    } else if (part.type === 'newline') {
      lines.push(currentLine)
      currentLine = []
    }
  })
  lines.push(currentLine)
  return lines
}

// Convert the array of array for formats into a string
function printFormatting(lines) {
  // If pure code
  if (lines.length === 1 && lines[0].length === 1 && typeof lines[0][0] !== 'string') {
    return lines[0][0].code
  }
  // Otherwise it is a string
  let strIsTemplateLiteral = lines.length > 1;
  let content = lines.map(line => {
    return line.map(part => {
      let isTemplateLiteral = (typeof part !== 'string')
      strIsTemplateLiteral = strIsTemplateLiteral || isTemplateLiteral
      return isTemplateLiteral ? ("${"+genCode(part.code)+"}") : part
    }).join('')
  }).join('\n')
  return strIsTemplateLiteral ? `\`${content}\`` : `"${content}"`
}

const CODE_GENERATORS = {
  "plain": (node) => node.raw,
  "comment.line.documentation.jome": (node) => `// ${node.raw.slice(2)}`,
  'comment.block.jome': () => "",
  'comment.line.double-slash.jome': () => "",
  'newline': () => '\n',
  'punctuation.terminator.statement.jome': compileRaw,
  'punctuation.separator.delimiter.jome': compileRaw,
  "string.quoted.backtick.verbatim.jome": (node) => `\`${node.token.children[1]}\``,
  "string.quoted.double.verbatim.jome": (node) => `"${node.token.children[1]}"`,
  "string.quoted.single.jome": compileStringSingleQuote,
  "string.quoted.double.jome": compileString,
  "string.quoted.multi.jome": compileStringSingleQuote,
  //"string.quoted.backtick.jome": (node) => compileTokenRaw(node.token),
  "string.quoted.backtick.jome": compileStringSingleQuote,
  // "string.quoted.backtick.jome": (node, ctx) => {
  //   return '`'+node.children.slice(1,-1).map(c => c.type === 'newline' ? '\n' : c).map(
  //     c => typeof c === 'string' ? c : '${'+compileJsBlock(c.children.slice(1,-1), ctx)+'}'
  //   ).join('')+'`'
  // },
  // function(arg) end
  "meta.function.jome": compileStandaloneFunction,
  // foo:
  "meta.dictionary-key.jome": (node) => {
    let foo = "bar"
    return `${node.parts[0].raw} ${node.parts[1].raw}`
  },
  "meta.block.jome": compileBlock,
  'constant.language.jome': compileRaw,
  // obj->callFunc
  "meta.caller.jome": (node) => {
    let funcName = node.parts[1].raw
    return `${genCode(node.operands[0])}.${funcName}()`
  },
  // obj.property
  "meta.getter.jome": (node) => {
    return `${genCode(node.operands[0])}${node.raw}`
  },
  'meta.group.jome': (node) => {
    // If a function call
    if (node.operands) {
      return `${node.operands.map(c => genCode(c)).join('')}${node.raw}`
    }
    // If simply a group
    return node.raw
  },
  'variable.other.jome': compileRaw,
  'variable.assignment.jome': (node) => {
    if (node.raw[0] === '$') {
      return `global.${GLOBAL_PREFIX}${node.raw.slice(1)}`
    }
    return node.raw
  },
  'support.variable.jome': compileRaw,
  'entity.name.function.jome': compileRaw,
  'constant.numeric.integer.jome': compileRaw,
  'constant.numeric.float.jome': compileRaw,
  "string.regexp.js": compileRaw,
  // let foo
  // var bar
  'meta.declaration.jome': (node) => {
    return `${node.parts[0].raw} ${node.parts[1].raw}`
  },
  // do |args| /* ... */ end
  'meta.do-end.jome': compileStandaloneFunction,
  // def someFunc end
  'meta.def.jome': compileDefFunction,
  // if ... end
  'meta.if-block.jome': (node) => {
    return node.data.sections.map(sect => {
      return `${sect.keyword} ${sect.cond ? `(${genCode(sect.cond)})` : ''} {${sect.statements.map(c => genCode(c)).join('')}}`
    }).join(' ');
  },
  "entity.name.function.utility-inline.jome": (node) => compInlineUtility(node), // "Hello".#log  
  'entity.name.function.utility.jome': (node) => compUtility(node), // #log
  "variable.other.constant.utility.jome": (node) => compUtility(node), // #PI
  "support.function-call.WIP.jome": compileFuncCall, // someFunc "some arg"
  "support.function-call.jome": compileFuncCall, // someFunc("some arg")
  "meta.function-call.WIP.jome": compileMetaFuncCall, // .someFunc "some arg"
  "meta.function-call.jome": compileMetaFuncCall, // .someFunc("some arg")
  // js uses more specifically:
  // keyword.operator.arithmetic.jome
  // keyword.operator.logical.jome
  // + - * / ^
  'keyword.operator.jome': compileOperator,
  'keyword.operator.existential.jome': (node) => {
    return `${genCode(node.operands[0])} ? ${genCode(node.operands[1])} : null`
  },
  //'keyword.operator.nullish-coalescing.jome'
  'keyword.operator.colon.jome': (node) => {
    return `${genCode(node.operands[0].operands[0])} ? ${genCode(node.operands[0].operands[1])} : ${genCode(node.operands[1])}`
  },
  // class
  "meta.class.jome": (node) => {
    let name = node.parts[1].raw
    node.ctxFile.classIdentifiers.add(name)
    let parts = node.parts.slice(2,-1)
    let methods = parts.filter(p => p.type === 'meta.def.jome')
    let compiledMethods = compileConstrutor(node)
    compiledMethods += methods.map(m => compileMethod(m)).join('\n')
    return `class ${name} {\n${compiledMethods}\n}`
  },
  // interface
  "meta.interface.jome": (node) => {
    // TODO: Parser les interfaces simplement une ligne à la fois. Un item par ligne.
    // interface GlobalAttributes
    //   accesskey?
    //   autocapitalize?
    //   autofocus?
    //   class?
    // end
    throw new Error("TODO interface")
  },
  // =>
  'keyword.arrow.jome': compileArrowFunction,
  // !
  "keyword.operator.logical.unary.jome": compileOperatorUnary,
  // || &&
  "keyword.operator.logical.jome": compileOperator,
  // ==, !=, ===, !===
  'keyword.operator.comparison.jome': compileOperator,
  // statement if cond
  'keyword.control.inline-conditional.jome': (node) => {
    return `if (${genCode(node.operands[1])}) {${genCode(node.operands[0])}}`
  },
  // [1,2,3]
  // x[0]
  // called square-bracket because it can be an array or an operator
  "meta.square-bracket.jome": (node) => {
    let {isOperator, operand, expression, elems} = node.data
    if (isOperator) {
      return `${genCode(operand)}[${genCode(expression)}]`
    } else {
      return `[${elems.map(c => genCode(c)).join(', ')}]`
    }
  },
  // exec
  //   someFunc()
  //   someOtherFunc()
  // end
  "meta.chain.jome": (node) => {

    let calls = node.data.calls
    if (calls.length < 1) {
      return genCode(node.operands[0])
    }
    if (calls.length === 1) {
      return genCode(node.operands[0])+'.'+genCode(calls[0])
    }
    
    let lastCall = calls[calls.length-1]
    let otherCalls = calls.slice(0, -1)

    return `(() => {
  let __chain = ${genCode(node.operands[0])}
  ${otherCalls.map(call => '__chain.'+genCode(call))}
  return __chain.${genCode(lastCall)}
})()`
  },
  // =
  'keyword.operator.assignment.jome': compileOperator,
  //'keyword.operator.assignment.jome': (node) => (compileOperator(node)+";"),
  // let
  'keyword.control.declaration.jome': (node) => `let ${node.operands[0].raw}`,
  // import defaultExport from "module-name";
  // import * as name from "module-name";
  // import { export1 } from "module-name";
  // import { export1 as alias1 } from "module-name";
  // import { default as alias } from "module-name";
  // import { export1, export2 } from "module-name";
  // import { export1, export2 as alias2, /* … */ } from "module-name";
  // import { "string name" as alias } from "module-name";
  // import defaultExport, { export1, /* … */ } from "module-name";
  // import defaultExport, * as name from "module-name";
  // // import "module-name"; TODO: Not written yet in the parser
  "meta.statement.import.jome": (node) => {
    let {file, defaultImport, namedImports} = node.data
    if (defaultImport) {
      node.lexEnv.addBinding(defaultImport, {type: 'default-import', file})
    }
    namedImports.forEach(namedImport => {
      node.lexEnv.addBinding(namedImport, {type: 'named-import', file})
    })
    node.ctxFile.addImport(defaultImport, namedImports, file)
  },

  // #.
  // #./
  // #./some_file.ext
  // #/path/to/file.ext
  // #cwd/some_file.ext
  "string.other.path.jome": (node) => {
    let p = node.raw.slice(1)
    if (p === '.' || p === './') {
      if (!node.compilerOptions.useCommonJS) {
        throw new Error("sf823yf78902y30f9823323f")
      }
      return '__dirname'
    }
    if (p[0] === '/') {
      return `"${p}"`
    }
    if (p.startsWith('cwd/')) {
      return `path.resolve("./${p.slice(4)}")`
    }
    if (!node.compilerOptions.useCommonJS) {
      throw new Error("fu3h7f23h98rfha07hd0237230u")
    }
    if (p.startsWith('..')) {
      return `path.join(__dirname, "${p}")`
    }
    return `path.join(__dirname, "${p.slice(2)}")`
  },

  "keyword.control.return.jome": (node) => {
    if (node.raw === 'return') {
      return 'return '+genCode(node.operands[0])+';'
    }
  },

  // <sh></sh>
  "meta.embedded.block.shell": compileHeredoc,
  // <html></html>
  "meta.embedded.block.html": compileHeredoc,
  // <md></md>
  "meta.embedded.block.markdown": compileHeredoc,
  // <css></css>
  "meta.embedded.block.css": compileHeredoc,

  "meta.with-args.jome": (node) => {
    let current; let args = []
    node.data.argsToken.forEach(a => {
      // TODO: Allow two ways of commenting, either a single inline after, or multiple lines before
      // # Some doc
      // # For arg
      // arg
      // OR
      // arg # Some doc
      // I am only supporting the single inline after for now
      if (a.type === 'comment.line.documentation.jome') {
        if (current) {
          current.docComment = a.raw.slice(2)
        }
      } else {
        current = parseArgument(a);
        args.push(current)
      }
    })
    if (node.data.isFileArguments) {
      node.ctxFile.fileArguments = args
    } else {
      node.ctxFile.currentArguments = args
      if (args.length) {
        return `/**
${args.map(a => `* @param {*} ${a.name} ${a.docComment||''}`).join('\n')}
*/`
      }   
    }
    return ''
  },

  "keyword.control.main.jome": (node) => {
    if (node.compilerOptions.useCommonJS) {
      return `module.exports = ${genCode(node.operands[0])}`
    } else {
      return `export default ${genCode(node.operands[0])}`
    }
  },

  "support.type.property-name.attribute.jome": (node) => {
    return `this.${node.raw.slice(1)}`
  },

  // $GLOBAL_VARIABLE
  "variable.other.global.jome": (node) => {
    // Adding an underscore so the name does not collide with Node.js default variables (ex: URL)
    // https://nodejs.org/api/globals.html#url
    return `global.${GLOBAL_PREFIX}${node.raw.slice(1)}`
  },

  "meta.with-format.jome": (node) => {
    node.ctxFile.defaultMultilineFormat = node.parts[1].raw
    return ''
  },

  "meta.with-format-for.jome": (node) => {
    node.ctxFile.defaultFormatByTagName[node.parts[3].raw] = node.parts[1].raw
    return ''
  },

  "keyword.other.string-format.jome": (node) => {
    let format = node.raw.slice(1)
    let forall = node.ctxFile.foralls[format]
    let lines = prepareFormatting(node.operands[0])
    if (forall?.chain?.length) {
      forall.chain.forEach(chainFunc => {
        lines = chainFunc(lines)
      })
    }
    let str = printFormatting(lines)
    if (forall?.wrap?.length) {
      forall.wrap.forEach(wrapFunc => {
        str = `${wrapFunc}(${str})`
      })
    }
    Object.keys(forall?.imports||{}).forEach(impName => {
      let imp = forall.imports[impName]
      if (imp.default) {
        node.ctxFile.addImport(impName, [], imp.from)
      } else {
        node.ctxFile.addImport(null, [impName], imp.from)
      }
    })
    return str
  },

  "meta.forall.jome": (node) => {
    let {tagName, chainFunctions, wrapFunctions} = node.data
    // Get the actual referenced function
    let chainFuncs = (chainFunctions||[]).map(chainFunc => {
      let binding = node.lexEnv.getBindingValue(chainFunc)
      if (!binding) {
        throw new Error("Missing forall chain function "+chainFunc)
      }
      if (binding.type === 'named-import') {
        let required = require(binding.file)
        return required[chainFunc]
      } else {
        throw new "sfh80h23f023hf0hw0irhf230"
      }
    })
    // TODO: get the source of the chain and wrap functions and add to the forall import list.
    node.ctxFile.addForall(tagName, chainFuncs, wrapFunctions)
    return ''
  },

}

module.exports = {
  genImports,
  genCode
}
