const { compileUtility } = require("jome-lib/compileUtility")
const {compileTokenRaw} = require("./parser.js")

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
    let def = ctxFile.defaultImportsByFile[file]
    let named = ctxFile.namedImportsByFile[file]
    if (compilerOptions.useCommonJS) {
      if (def) {
        result += `const ${def} = require("${file}");\n`
      } else {
        result += `const {${[...named].join(', ')}} = require("${file}");\n`
      }
    } else {
      if (def) {
        result += `import ${def} from "${file}";\n`
      } else {
        result += `import {${[...named].join(', ')}} from "${file}";\n`
      }
    }
  })
  return result
}

function escapeBackticks(inputString) {
  return inputString.replace(/`/g, '\u005c`').replace(/\$\{/g, '\u005c\$\{').replace(/\\\\`/g, '\\\\\\`')
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
    return str.slice(1,-1)
  }

  throw new Error("TODO fas02934n890fhsn0n1")
}

// Combine all the named parameters given into a single object
function mergeNamedParameters(args) {
  let merged = []
  let obj = {}
  args.forEach(arg => {
    if (arg.type === 'keyword.operator.colon.jome') {
      obj[arg.operands[0].raw] = toPrimitive(genCode(arg.operands[1]))
    } else {
      merged.push(arg)
    }
  })
  if (Object.keys(obj).length) {
    merged.push({type: "plain", raw: JSON.stringify(obj)})
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
  let args = mergeNamedParameters(node.data.args)
  let str = args.map(p => genCode(p)).join(', ')
  return `${called}(${str})`
}

// With a dot before the func call
function compileMetaFuncCall(node) {
  return `${genCode(node.operands[0])}.${compileFuncCall(node)}`
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

  let format = node.data.format
  if (format) {
    let mods = format.slice(1).split('%')
    mods.forEach(mod => {
      if (mod.includes('l')) {
        // A line modifier
        if (mod === 'xl') {
          lines = lines.map(l => l.trimLeft())
        } else if (mod === 'lx') {
          lines = lines.map(l => l.trimRight())
        } else if (mod === 'xlx') {
          lines = lines.map(l => l.trim())
        } else {
          throw new Error("Unkown string format %"+mod)
        }
      } else if (mod.includes('s')) {
        // The whole string modifier
        if (!(mod === 'xs' || mod === 'sx' || mod === 'xsx')) {
          throw new Error("Unkown string format %"+mod)
        }
        if (mod[0] === 'x' && !(lines[0]?.length)) {
          lines = lines.slice(1)
        }
        if (mod.slice(-1) === 'x' && !(lines[lines.length-1]?.length)) {
          lines = lines.slice(0, -1)
        }
      } else if (mod.includes('j')) {
        // A join modifier
        throw new Error("sf8h902340ij0sdfsd")
      } else if (mod.includes('i')) {
        // An indent modifier
        throw new Error("93845h978sgh789fg3")
      }
    })
  }

  let result = lines.join('\n')
  return isTemplateLiteral ? `\`${result}\`` : `"${result}"`
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
  "string.quoted.single.jome": compileString,
  "string.quoted.double.jome": compileString,
  //"string.quoted.backtick.jome": (node) => compileTokenRaw(node.token),
  "string.quoted.backtick.jome": (node) => {throw new Error("Backtick strings not supported for now.")},
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
  'variable.assignment.jome': compileRaw,
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
    let parts = node.parts.slice(2,-1)
    let methods = parts.filter(p => p.type === 'meta.def.jome')
    let compiledMethods = methods.map(m => compileMethod(m)).join('\n')
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
    node.lexEnv.ctxFile.addImport(defaultImport, namedImports, file)
    // ctx.addBinding(defaultImport, {type: 'default-import'}) TODO!!!!!!!!!!!!!!!!
    // ctx.addBinding(name, {type: 'named-import'})
  },

  // #.
  // #./
  // #./some_file.ext
  // #/path/to/file.ext
  // #cwd/some_file.ext
  "string.other.path.jome": (node) => {
    let p = node.raw.slice(1)
    if (p === '.' || p === './') {
      if (!node.lexEnv.ctxFile.compilerOptions.useCommonJS) {
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
    if (!node.lexEnv.ctxFile.compilerOptions.useCommonJS) {
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
  "meta.embedded.block.shell": (node) => {
    node.lexEnv.ctxFile.addImport('execSh', null, 'jome-lib/execSh')
    return "execSh(`"+escapeBackticks(node.data.command)+"`);"
  },
  // <html></html>
  "meta.embedded.block.html": (node) => {
    //   let args = parseScriptTagArgs(node.children[0])
    //   let b = ''
    //   let a = ''
    //   if ('root' in args) {
    //     b = '<!DOCTYPE html>\n<html>'
    //     a = '</html>'
    //   }
    //   return '`'+b+compileInterpolate(compileRaw(node.children.slice(1,-1)), ctx)+a+'`'
    let content = compileTokenRaw(node.parts.slice(1,-1))
    return '`'+content+'`'
  },

  "meta.with-args.jome": (node) => {
    if (node.data.isFileArguments) {
      node.lexEnv.ctxFile.fileArguments = node.data.args
    } else {
      throw new Error("sfn3478f7hs9078r3")
    }
    return ''
  },
}

module.exports = {
  genImports,
  genCode
}
