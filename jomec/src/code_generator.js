const { compileTokenRaw } = require("./parser")

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
        throw new Error("TODO: 23489ashdf89h23")
        result += ""
      }
    } else {
      if (def) {
        result += `import ${def} from "${file}";\n`
      } else {
        throw new Error("TODO: 23498s9dfh98i2")
        result += ""
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

const UTILS = {
  log: () => "console.log",
  PI: () => "Math.PI",
  argv: () => "process.argv",
  // argv: () => {
  //   // TODO: Add import {argv} from "jome-lib"
  //   return `argv()`
  // }
}

function _compileUtility(name) {
  let utils = UTILS[name]
  if (!utils) {
    throw new Error("Unkown util "+name)
  }
  return utils()
}

function compileUtility(node, isInline) {
  let name = node.raw.slice(isInline ? 2 : 1)
  let val = _compileUtility(name)
  if (node.operands) {
    if (isInline) {
      return `${val}(${node.operands.map(c => genCode(c)).join('')})`
    }
    return `${val}${node.operands.map(c => genCode(c)).join('')}`
  }
  return val
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

function compileFuncCall(node) {
  let hasDot = node.parts[0].type === 'punctuation.dot.jome'
  let parts = hasDot ? node.parts.slice(1) : node.parts
  let called = genCode(parts[0])
  let args = parts.slice(1).filter(p => p.type !== 'punctuation.separator.delimiter.jome').map(p => genCode(p)).join(', ')
  //let args = parts.slice(1).map(p => compileNode(p)).join('')//.filter(p => p && p.length).join(', ')
  return `${hasDot ? '.' : ''}${called}(${args})`
}

const CODE_GENERATORS = {
  "comment.line.documentation.jome": (node) => `// ${node.raw.slice(2)}`,
  'comment.block.jome': () => "",
  'comment.line.double-slash.jome': () => "",
  'newline': () => '\n',
  'punctuation.terminator.statement.jome': compileRaw,
  'punctuation.separator.delimiter.jome': compileRaw,
  "string.quoted.backtick.verbatim.jome": (node) => `\`${node.token.children[1]}\``,
  "string.quoted.double.verbatim.jome": (node) => `"${node.token.children[1]}"`,
  "string.quoted.single.jome": (node) => `'${node.token.children[1]}'`,
  "string.quoted.double.jome": (node) => `"${node.token.children[1]}"`,
  "string.quoted.backtick.jome": (node) => compileTokenRaw(node.token),
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
  "support.function-call.WIP.jome": compileFuncCall,
  "support.function-call.jome": compileFuncCall,
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
    let elems = node.parts.slice(1,-1).filter((e, i) => i % 2 === 0)
    return `[${elems.map(c => genCode(c)).join(', ')}]`
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
  // let
  'keyword.control.declaration.jome': (node) => `let ${node.operands[0].raw}`,
  // <...>.#log
  "entity.name.function.utility-inline.jome": (node) => compileUtility(node, true),
  // #log
  'entity.name.function.utility.jome': (node) => compileUtility(node, false),
  // #PI
  "variable.other.constant.utility.jome": (node) => compileUtility(node, false),
  // <sh></sh>
  "meta.embedded.block.shell": (node) => {
    node.lexEnv.ctxFile.addImport('jome-lib/execSh', 'execSh')
    return "execSh(`"+escapeBackticks(node.data.command)+"`);"
  }
}

module.exports = {
  genImports,
  genCode
}
