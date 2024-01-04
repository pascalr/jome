/*
The function responsible for constructing the AST is commonly known as the "parser." The parser takes
a sequence of tokens as input and builds a tree structure based on the grammar rules of the programming language.

The name of the function can vary, but it is often named something like parse or buildAST. For example:

You may also want to consider incorporating error handling in your parser to report syntax errors or other
issues found during the parsing process.

Overall, breaking down the compilation process into distinct phases, such as lexical analysis (tokenization)
and syntax analysis (parsing), helps in creating a modular and maintainable compiler design.
*/

const OPERAND_TYPES = [
  "constant.numeric.integer.jome",
  "keyword.operator.jome",
  "keyword.operator.logical.unary.jome",
  "keyword.operator.existential.jome",
  "constant.numeric.float.jome",
  "meta.group.jome",
  "meta.square-bracket.jome",
  "meta.block.jome",
  "variable.other.jome",
  "constant.language.jome"
]

function compileTokenRaw(token) {
  if (Array.isArray(token)) {
    return token.map(n => compileTokenRaw(n)).join('')
  } else if (token.type === 'newline') {
    return '\n'
  } else if (typeof token === 'string') {
    return token
  } else {
    return token.children.map(n => compileTokenRaw(n)).join('')
  }
}

function compileNode(node) {
  if (!node.compile) {
    throw new Error("Can't compile node of type "+node.type)
  }
  return node.compile(node)
}

// An abstract syntax tree (AST) node
class ASTNode {
  constructor(token) {
    this.raw = compileTokenRaw(token.children)
    this.type = token.type
    this.token = token
    let prec = PRECEDENCES[this.type]
    this.precedence = (typeof prec === 'function') ? prec(token) : (prec || 0)
    // Children is used for AST nodes by handling captures and precedence
    this.children = []
    if (token.children && !(token.children.length === 1 && typeof token.children[0] === "string")) {
      // Parts represent the inner components of the node
      this.parts = parse(token.children)
    }
    let data = TOKENS[this.type]
    if (data) {
      this.captureLeft = data.captureLeft
      this.captureRight = data.captureRight
      this.minRequiredChildren = data.minRequiredChildren
      this.allowedChildren = data.allowedChildren
      this.compile = data.compile
      this.validate = data.validate
    }
  }
}

// function filterSpaces(array) {
//   return array.filter(e => !/^\s*$/.test(e))
// }
function filterStrings(array) {
  return array.filter(e => typeof e !== 'string')
}

// someFunc(someVal)[someIndex].someProp.#someFunc // These should all be merged into a single node
function mergeChainables(nodes) {
  let merged = []
  let current = nodes[0]
  for (let i = 0; i < nodes.length; i++) {
    let lookahead = nodes[i+1]
    if (lookahead && CHAINABLE_TYPES.includes(lookahead.type) && OPERAND_TYPES.includes(current.type)) {
      lookahead.children.push(current)
    } else {
      merged.push(current)
    }
    current = lookahead
  }
  return merged
}

// Create an abstract syntax tree (AST) from tokens. Returns a list of ASTNode.
function parse(tokens) {

  // All the tokens converted to nodes
  let allNodes = filterStrings(tokens).map(tok => new ASTNode(tok))
  // Only the top nodes
  let topNodes = []

  // As a first pass, merge all the chainable nodes together. They have highest precedence.
  let nodes = mergeChainables(allNodes)

  // lhs === left hand side
  // rhs === right hand side
  const parseExpression1 = (lhs, minPrecedence) => {
    if (lhs.captureRight) {
      if (typeof lhs.captureRight === "number" && Number.isInteger(lhs.captureRight)) {
        lhs.children = nodes.splice(0, lhs.captureRight)
      } else {
        lhs.children.push(nodes.shift())
      }
    }
    let lookahead = nodes[0]
    while (
      lookahead &&
      lookahead.precedence >= minPrecedence &&
      lookahead.captureLeft
    ) {
      const op = lookahead;
      // TODO: Check if capture right
      nodes.shift()
      let rhs = nodes[0]
      nodes.shift();
      lookahead = nodes[0]
      while (
        lookahead &&
        ((lookahead.precedence > op.precedence) ||
          (lookahead.precedence === op.precedence &&
            lookahead.rightAssociative)) // right associative is not used yet
      ) {
        rhs = parseExpression1(rhs, op.precedence + (lookahead.precedence > op.precedence ? 1 : 0));
        lookahead = nodes[0];
      }
      op.children = [lhs, rhs];
      lhs = op;
    }
    return lhs;
  };

  while (nodes.length) {
    topNodes.push(parseExpression1(nodes.shift(), 0))
  }

  return topNodes
}

function compileOperatorUnary(node) {
  return `${node.raw}${compileNode(node.children[0])}`
}

function compileOperator(node) {
  return `${compileNode(node.children[0])} ${node.raw} ${compileNode(node.children[1])}`
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
  if (node.children) {
    if (isInline) {
      return `${val}(${node.children.map(c => compileNode(c)).join('')})`
    }
    return `${val}${node.children.map(c => compileNode(c)).join('')}`
  }
  return val
}

const tokenAsIs = {
  compile: compileRaw
}

const ignoreToken = {
  compile: () => ""
}

const regular = (compile) => ({
  compile
})

function compileArgs(node) { 
  if (node.type === 'variable.other.jome') {
    return node.raw
  }
  let cs = node.parts.slice(1, -1) // remove vertical bars
  //let args = 
  //let todo = 10
  return `(${cs.map(c => compileNode(c)).join('')})`
}

function compileEntry(node) {
  let name = node.parts[0].raw
  let value = compileNode(node.children[0])
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
  if (node.children.length > 1) {
    let args = node.children[0]
    return `${compileArgs(args)} => (${node.children.slice(1).map(c => compileNode(c)).join('')})`
  } else {
    return `() => (${compileNode(node.children[0])})`
  }
}

// A def inside a class
function compileMethod(node) {
  let name = node.parts[1].raw
  let cs = node.parts.slice(2,-1) // Remove keywords def, end, and function name
  let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
  if (args) {
    return `${name} = ${compileArgs(args)} => {\n${cs.slice(1).map(c => compileNode(c)).join('')}\n}`
  } else {
    return `${name} = () => {\n${cs.map(c => compileNode(c)).join('')}\n}`
  }
}

// A def outside a class
function compileDefFunction(node) {
  let name = node.parts[1].raw
  let cs = node.parts.slice(2,-1) // Remove keywords def, end, and function name
  let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
  if (args) {
    return `function ${name}${compileArgs(args)} {${cs.slice(1).map(c => compileNode(c)).join('')}}`
  } else {
    return `function ${name}() {${cs.map(c => compileNode(c)).join('')}}`
  }
}

function compileStandaloneFunction(node) {
  let cs = node.parts.slice(1,-1) // Remove keywords do and end
  let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
  if (args) {
    return `function ${compileArgs(args)} {${cs.slice(1).map(c => compileNode(c)).join('')}}`
  } else {
    return `function () {${cs.map(c => compileNode(c)).join('')}}`
  }
}

function compileFuncCall(node) {
  let hasDot = node.parts[0].type === 'punctuation.dot.jome'
  let parts = hasDot ? node.parts.slice(1) : node.parts
  let called = compileNode(parts[0])
  let args = parts.slice(1).filter(p => p.type !== 'punctuation.separator.delimiter.jome').map(p => compileNode(p)).join(', ')
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

const TOKENS = {
  'comment.block.jome': ignoreToken,
  'newline': {compile: () => '\n'},
  'punctuation.terminator.statement.jome': tokenAsIs,
  'punctuation.separator.delimiter.jome': tokenAsIs,
  "string.quoted.backtick.verbatim.jome": regular((node) => `\`${node.token.children[1]}\``),
  "string.quoted.double.verbatim.jome": regular((node) => `"${node.token.children[1]}"`),
  "string.quoted.single.jome": regular((node) => `'${node.token.children[1]}'`),
  "string.quoted.double.jome": regular((node) => `"${node.token.children[1]}"`),
  "string.quoted.backtick.jome": regular((node) => `\`${node.token.children[1]}\``),
  // "string.quoted.backtick.jome": (node, ctx) => {
  //   return '`'+node.children.slice(1,-1).map(c => c.type === 'newline' ? '\n' : c).map(
  //     c => typeof c === 'string' ? c : '${'+compileJsBlock(c.children.slice(1,-1), ctx)+'}'
  //   ).join('')+'`'
  // },
  // function(arg) end
  "meta.function.jome": {
    compile: compileStandaloneFunction
  },
  // foo:
  "meta.dictionary-key.jome": {
    captureRight: true,
    compile: (node) => {
      let foo = "bar"
      return `${node.parts[0].raw} ${node.parts[1].raw}`
    },
  },
  "meta.block.jome": {
    compile: compileBlock
  },
  'constant.language.jome': tokenAsIs,
  // obj->callFunc
  "meta.caller.jome": {
    compile: (node) => {
      let funcName = node.parts[1].raw
      return `${compileNode(node.children[0])}.${funcName}()`
    },
  },
  // obj.property
  "meta.getter.jome": {
    compile: (node) => {
      return `${compileNode(node.children[0])}${node.raw}`
    },
  },
  'meta.group.jome': {
    compile: (node) => {
      // If a function call
      if (node.children) {
        return `${node.children.map(c => compileNode(c)).join('')}${node.raw}`
      }
      // If simply a group
      return node.raw
    },
  },
  'variable.other.jome': tokenAsIs,
  'variable.assignment.jome': tokenAsIs,
  'support.variable.jome': tokenAsIs,
  'entity.name.function.jome': tokenAsIs,
  'constant.numeric.integer.jome': tokenAsIs,
  'constant.numeric.float.jome': tokenAsIs,
  "string.regexp.js": tokenAsIs,
  // let foo
  // var bar
  'meta.declaration.jome': {
    compile: (node) => {
      return `${node.parts[0].raw} ${node.parts[1].raw}`
    },
  },
  // do |args| /* ... */ end
  'meta.do-end.jome': {
    compile: compileStandaloneFunction,
  },
  // def someFunc end
  'meta.def.jome': {
    compile: compileDefFunction,
  },
  'meta.if-block.jome': regular((node) => {
    let cs = node.parts.slice(1, -1) // remove if and end
    return `if (${compileNode(cs[0])}) {${cs.slice(1).map(c => compileNode(c)).join('')}}`
  }),
  "support.function-call.WIP.jome": {
    compile: compileFuncCall
  },
  "support.function-call.jome": {
    compile: compileFuncCall
  },
  // js uses more specifically:
  // keyword.operator.arithmetic.jome
  // keyword.operator.logical.jome
  // + - * / ^
  'keyword.operator.jome': {
    compile: compileOperator,
    captureLeft: true,
    captureRight: true,
  },
  'keyword.operator.existential.jome': {
    compile: (node) => {
      return `${compileNode(node.children[0])} ? ${compileNode(node.children[1])} : null`
    },
    captureLeft: true,
    captureRight: true,
  },
  //'keyword.operator.nullish-coalescing.jome'
  'keyword.operator.colon.jome': {
    compile: (node) => {
      return `${compileNode(node.children[0].children[0])} ? ${compileNode(node.children[0].children[1])} : ${compileNode(node.children[1])}`
    },
    captureLeft: true,
    captureRight: true,
  },
  // class
  "meta.class.jome": {
    compile: (node) => {
      let name = node.parts[1].raw
      let parts = node.parts.slice(2,-1)
      let methods = parts.filter(p => p.type === 'meta.def.jome')
      let compiledMethods = methods.map(m => compileMethod(m)).join('\n')
      return `class ${name} {\n${compiledMethods}\n}`
    }
  },
  // interface
  "meta.interface.jome": {
    compile: (node) => {
      // TODO: Parser les interfaces simplement une ligne à la fois. Un item par ligne.
      // interface GlobalAttributes
      //   accesskey?
      //   autocapitalize?
      //   autofocus?
      //   class?
      // end
      throw new Error("TODO interface")
    }
  },
  // =>
  'keyword.arrow.jome': {
    captureLeft: true, // TODO: Allow to optionnally capture left, so allow no arguments
    captureRight: true,
    compile: compileArrowFunction,
  },
  // !
  "keyword.operator.logical.unary.jome": {
    captureRight: true,
    compile: compileOperatorUnary,
  },
  // || &&
  "keyword.operator.logical.jome": {
    captureLeft: true,
    captureRight: true,
    compile: compileOperator,
  },
  // ==, !=, ===, !===
  'keyword.operator.comparison.jome': {
    captureLeft: true,
    captureRight: true,
    compile: compileOperator,
  },
  // statement if cond
  'keyword.control.inline-conditional.jome': {
    captureLeft: true,
    captureRight: true,
    compile: (node) => {
      return `if (${compileNode(node.children[1])}) {${compileNode(node.children[0])}}`
    },
  },
  // [1,2,3]
  // x[0]
  // called square-bracket because it can be an array or an operator
  "meta.square-bracket.jome": {
    compile: (node) => {
      let elems = node.parts.slice(1,-1).filter((e, i) => i % 2 === 0)
      return `[${elems.map(c => compileNode(c)).join(', ')}]`
    },
  },
  // =
  'keyword.operator.assignment.jome': {
    captureLeft: true,
    captureRight: true,
    compile: compileOperator,
  },
  // let
  'keyword.control.declaration.jome': {
    compile(node) {
      return `let ${node.children[0].raw}`
    }
    // allowedChildren: [
    //   'variable.other.jome',
    //   'variable.assigment.jome'
    // ]
  },
  // <...>.#log
  "entity.name.function.utility-inline.jome": {
    compile: (node) => compileUtility(node, true),
  },
  // #log
  'entity.name.function.utility.jome': {
     compile: (node) => compileUtility(node, false),
  }
}

module.exports = {
  parse,
  compileNode,
  OPERAND_TYPES
}