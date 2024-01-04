function transpile(node) {
  let transpiler = TRANSPILERS[node.type]
  if (!transpiler) {
    throw new Error("Can't compile node of type "+node.type)
  }
  return transpiler(node)
}

function compileOperatorUnary(node) {
  return `${node.raw}${transpile(node.operands[0])}`
}

function compileOperator(node) {
  return `${transpile(node.operands[0])} ${node.raw} ${transpile(node.operands[1])}`
}

function compileRaw(node) {
  return node.raw
}

function _compileUtility(name) {
  switch (name) {
    case 'log': return 'console.log'
  }
}

function compileUtility(node, isInline) {
  let name = node.raw.slice(isInline ? 2 : 1)
  let val = _compileUtility(name)
  if (node.operands) {
    if (isInline) {
      return `${val}(${node.operands.map(c => transpile(c)).join('')})`
    }
    return `${val}${node.operands.map(c => transpile(c)).join('')}`
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
  return `(${cs.map(c => transpile(c)).join('')})`
}

function compileEntry(node) {
  let name = node.parts[0].raw
  let value = transpile(node.operands[0])
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
    return `${compileArgs(args)} => (${node.operands.slice(1).map(c => transpile(c)).join('')})`
  } else {
    return `() => (${transpile(node.operands[0])})`
  }
}

// A def inside a class
function compileMethod(node) {
  let name = node.parts[1].raw
  let cs = node.parts.slice(2,-1) // Remove keywords def, end, and function name
  let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
  if (args) {
    return `${name} = ${compileArgs(args)} => {\n${cs.slice(1).map(c => transpile(c)).join('')}\n}`
  } else {
    return `${name} = () => {\n${cs.map(c => transpile(c)).join('')}\n}`
  }
}

// A def outside a class
function compileDefFunction(node) {
  let name = node.parts[1].raw
  let cs = node.parts.slice(2,-1) // Remove keywords def, end, and function name
  let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
  if (args) {
    return `function ${name}${compileArgs(args)} {${cs.slice(1).map(c => transpile(c)).join('')}}`
  } else {
    return `function ${name}() {${cs.map(c => transpile(c)).join('')}}`
  }
}

function compileStandaloneFunction(node) {
  let cs = node.parts.slice(1,-1) // Remove keywords do and end
  let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
  if (args) {
    return `function ${compileArgs(args)} {${cs.slice(1).map(c => transpile(c)).join('')}}`
  } else {
    return `function () {${cs.map(c => transpile(c)).join('')}}`
  }
}

function compileFuncCall(node) {
  let hasDot = node.parts[0].type === 'punctuation.dot.jome'
  let parts = hasDot ? node.parts.slice(1) : node.parts
  let called = transpile(parts[0])
  let args = parts.slice(1).filter(p => p.type !== 'punctuation.separator.delimiter.jome').map(p => transpile(p)).join(', ')
  //let args = parts.slice(1).map(p => compileNode(p)).join('')//.filter(p => p && p.length).join(', ')
  return `${hasDot ? '.' : ''}${called}(${args})`
}

// Chainable types have the highest precedence and are all equal
const CHAINABLE_TYPES = [
  "meta.group.jome",
  "meta.square-bracket.jome",
  "entity.name.function.utility-inline.jome",
  "meta.getter.jome",
  "meta.caller.jome"
]

const PRECEDENCES = {
  // square brackets are higher than arithmetic operators: x[0] + 10 < y - 20
  'keyword.operator.jome': (token => {
    let op = token.text()
    if (op === '+' || op === '-') {
      return 1000
    } else if (op === '*' || op === '/') {
      return 1100
    } else if (op === '^') {
      return 1200
    }
  }),
  // arithmetic operators are higher than comparison: x + 10 < y - 20
  'keyword.operator.comparison.jome': 500,
  // Comparison is higher than nullish coalescing: x ?? y > z
  'keyword.operator.nullish-coalescing.jome': 450,
  // In javascript, nullish coalescing has higher precedence than ternary.
  'keyword.operator.existential.jome': 400,
  'keyword.operator.colon.jome': 399,
  // Ternary is higher than arrow function: inspectTruthness = |x| => x ? 'truthy' : 'falsy'
  'keyword.arrow.jome': 300,
  // Arrow function is higher than assignment: add5 = |x| => x + 5
  'keyword.operator.assignment.jome': 250,
  // Assigment and dictionary key have the same precedence. (They should never be used together)
  'meta.dictionary-key.jome': 250,
  // Assignment is higher than inline conditional: x = 10 if true
  'keyword.control.inline-conditional.jome': 200,
}

const TRANSPILERS = {
  'comment.block.jome': () => "",
  'newline': () => '\n',
  'punctuation.terminator.statement.jome': compileRaw,
  'punctuation.separator.delimiter.jome': compileRaw,
  "string.quoted.backtick.verbatim.jome": (node) => `\`${node.token.children[1]}\``,
  "string.quoted.double.verbatim.jome": (node) => `"${node.token.children[1]}"`,
  "string.quoted.single.jome": (node) => `'${node.token.children[1]}'`,
  "string.quoted.double.jome": (node) => `"${node.token.children[1]}"`,
  "string.quoted.backtick.jome": (node) => `\`${node.token.children[1]}\``,
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
    return `${transpile(node.operands[0])}.${funcName}()`
  },
  // obj.property
  "meta.getter.jome": (node) => {
    return `${transpile(node.operands[0])}${node.raw}`
  },
  'meta.group.jome': (node) => {
    // If a function call
    if (node.operands) {
      return `${node.operands.map(c => transpile(c)).join('')}${node.raw}`
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
  'meta.if-block.jome': (node) => {
    let cs = node.parts.slice(1, -1) // remove if and end
    return `if (${transpile(cs[0])}) {${cs.slice(1).map(c => transpile(c)).join('')}}`
  },
  "support.function-call.WIP.jome": compileFuncCall,
  "support.function-call.jome": compileFuncCall,
  // js uses more specifically:
  // keyword.operator.arithmetic.jome
  // keyword.operator.logical.jome
  // + - * / ^
  'keyword.operator.jome': compileOperator,
  'keyword.operator.existential.jome': (node) => {
    return `${transpile(node.operands[0])} ? ${transpile(node.operands[1])} : null`
  },
  //'keyword.operator.nullish-coalescing.jome'
  'keyword.operator.colon.jome': (node) => {
    return `${transpile(node.operands[0].operands[0])} ? ${transpile(node.operands[0].operands[1])} : ${transpile(node.operands[1])}`
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
    return `if (${transpile(node.operands[1])}) {${transpile(node.operands[0])}}`
  },
  // [1,2,3]
  // x[0]
  // called square-bracket because it can be an array or an operator
  "meta.square-bracket.jome": (node) => {
    let elems = node.parts.slice(1,-1).filter((e, i) => i % 2 === 0)
    return `[${elems.map(c => transpile(c)).join(', ')}]`
  },
  // exec
  //   someFunc()
  //   someOtherFunc()
  // end
  "meta.exec.jome": (node) => {
    throw new Error("TODO: meta.exec.jome")
  },
  // =
  'keyword.operator.assignment.jome': compileOperator,
  // let
  'keyword.control.declaration.jome': (node) => `let ${node.operands[0].raw}`,
  // <...>.#log
  "entity.name.function.utility-inline.jome": (node) => compileUtility(node, true),
  // #log
  'entity.name.function.utility.jome': (node) => compileUtility(node, false),
}

module.exports = {
  transpile
}