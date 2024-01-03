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
  if (node.validate) {
    let err = node.validate(node)
    if (err) {
      throw new Error(err)
    }
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

// const validateChildren = (nb, types) => (node) => {
//   if (node.children.length !== nb) {
//     return "Invalid number of children for node."
//   } else if (!node.children.every(child => types.includes(child.type))) {
//     return `Invalid children type for node ${node.type}. Was: ${node.type}`
//   }
// }

function validateOperatorUnary(node) {
  // return validateChildren(2, OPERAND_TYPES)(node)
  if (node.children.length !== 1) {
    return "A unary operator must have a single operand"
  }
  if (!OPERAND_TYPES.includes(node.children[0].type)) {
    return `Invalid operand type for operator ${node.type}. Was: ${node.children[0].type}`
  }
}

function validateOperator(node) {
  // return validateChildren(2, OPERAND_TYPES)(node)
  if (node.children.length !== 2) {
    return "A binary operator must have a two operands"
  }

  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i]
    if (!OPERAND_TYPES.includes(child.type)) {
      return `Invalid operand type for operator ${node.type}. Was: ${child.type}`
    }
  }
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
  // TODO: Validate args!
  let cs = node.parts.slice(1, -1) // remove vertical bars
  //let args = 
  //let todo = 10
  return `(${cs.map(c => compileNode(c)).join('')})`
}

function compileEntry(node) {
  // TODO: Validate entry!
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

// Chainable types have the highest precedence and are all equal
const CHAINABLE_TYPES = [
  "meta.group.jome",
  "meta.square-bracket.jome",
  "entity.name.function.utility-inline.jome",
  "meta.getter.jome"
]

const OPERAND_TYPES = [
  "constant.numeric.integer.jome",
  "keyword.operator.jome",
  "keyword.operator.logical.unary.jome",
  "constant.numeric.float.jome",
  "meta.group.jome",
  "meta.square-bracket.jome",
  "meta.block.jome",
  "variable.other.jome",
  "constant.language.jome"
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
  // Comparison is higher than arrow function: isEqual = |x, y| => x == y
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
  "meta.function.jome": {
    validate: (node) => {
      if (node.parts[0].raw !== 'function') {
        return "Internal error. meta.function.jome should always start with keyword function"
      }
      if (node.parts[node.parts.length-1].raw !== 'end') {
        return "Internal error. meta.function.jome should always end with keyword end"
      }
      // Arguments, if present, should always be at the beginning
      if (node.parts.slice(2,-1).find(c => c.type === 'meta.args.jome')) {
        return "Syntax error. Arguments should always be at the beginning of the function block."
      }
    },
    compile(node) {
      let cs = node.parts.slice(1,-1) // Remove keywords do and end
      let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
      if (args) {
        return `function ${compileArgs(args)} {${cs.slice(1).map(c => compileNode(c)).join('')}}`
      } else {
        return `function () {${cs.map(c => compileNode(c)).join('')}}`
      }
    }
  },
  // foo:
  "meta.dictionary-key.jome": {
    captureRight: true,
    validate: (node) => {
    },
    compile: (node) => {
      let foo = "bar"
      return `${node.parts[0].raw} ${node.parts[1].raw}`
    },
  },
  "meta.block.jome": {
    validate: (node) => {
      if (node.parts[0].type !== 'punctuation.curly-braces.open') {
        return "Internal error. meta.block.jome should always start with punctuation.curly-braces.open"
      }
      if (node.parts[node.parts.length-1].type !== 'punctuation.curly-braces.close') {
        return "Internal error. meta.block.jome should always end with punctuation.curly-braces.close"
      }
    },
    compile: compileBlock
  },
  'constant.language.jome': tokenAsIs,
  "meta.getter.jome": {
    validate: (node) => {
      if (node.children.length !== 1) {
        return "Missing operand before getter"
      }
    },
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
  'constant.numeric.integer.jome': tokenAsIs,
  'constant.numeric.float.jome': tokenAsIs,
  // let foo
  // var bar
  'meta.declaration.jome': {
    validate: (node) => {
      let keyword = node.parts[0].raw
      if (node.parts.length !== 2) {
        return "Missing variable name after keyword "+keyword
      }
    },
    compile: (node) => {
      return `${node.parts[0].raw} ${node.parts[1].raw}`
    },
  },
  // def someFunc end
  'meta.def.jome': {
    validate: (node) => {
      if (node.parts[0].raw !== 'def') {
        return "Internal error. meta.def.jome should always start with keyword def"
      }
      if (node.parts[1].type !== 'entity.name.function.jome') {
        return "Syntax error. Missing function name after keyword def."
      }
      if (node.parts[node.parts.length-1].raw !== 'end') {
        return "Internal error. meta.def.jome should always end with keyword end"
      }
      // Arguments, if present, should always be right after the function name
      if (node.parts.slice(3,-1).find(c => c.type === 'meta.args.jome')) {
        return "Syntax error. Arguments should always be at the beginning of the function block."
      }
    },
    compile: (node) => {
      let name = node.parts[1].raw
      let cs = node.parts.slice(2,-1) // Remove keywords def, end, and function name
      let args = cs[0].type === 'meta.args.jome' ? cs[0] : null
      if (args) {
        return `function ${name}${compileArgs(args)} {${cs.slice(1).map(c => compileNode(c)).join('')}}`
      } else {
        return `function ${name}() {${cs.map(c => compileNode(c)).join('')}}`
      }
    },
  },
  'meta.if-block.jome': regular((node) => {
    let cs = node.parts.slice(1, -1) // remove if and end
    return `if (${compileNode(cs[0])}) {${cs.slice(1).map(c => compileNode(c)).join('')}}`
  }),
  // js uses more specifically:
  // keyword.operator.arithmetic.jome
  // keyword.operator.logical.jome
  // + - * / ^
  'keyword.operator.jome': {
    validate: validateOperator,
    compile: compileOperator,
    captureLeft: true,
    captureRight: true,
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
    validate: (node) => {
      if (node.children.length === 1) {
        // No args
        // TODO: Validate right side
      } else if (node.children.length === 2) {
        // With args
        let t = node.children[0].type
        if (!(t === 'meta.group.jome' || t === 'variable.other.jome')) {
          return "Syntax error. Arrow function expects arguments at it's left side."
        }
        // TODO: Validate right side
      } else {
        return "Syntax error. Arrow function expects one or two operands."
      }
    },
    compile: (node) => {
      if (node.children.length > 1) {
        let args = node.children[0]
        return `${compileArgs(args)} => (${node.children.slice(1).map(c => compileNode(c)).join('')})`
      } else {
        return `() => (${compileNode(node.children[0])})`
      }
    },
  },
  // !
  "keyword.operator.logical.unary.jome": {
    captureRight: true,
    validate: validateOperatorUnary,
    compile: compileOperatorUnary,
  },
  // || &&
  "keyword.operator.logical.jome": {
    captureLeft: true,
    captureRight: true,
    validate: validateOperator,
    compile: compileOperator,
  },
  // ==, !=, ===, !===
  'keyword.operator.comparison.jome': {
    captureLeft: true,
    captureRight: true,
    validate: validateOperator,
    compile: compileOperator,
  },
  // statement if cond
  'keyword.control.inline-conditional.jome': {
    captureLeft: true,
    captureRight: true,
    validate: (node) => {
      if (node.children.length !== 2) {
        return "An inline condition must have a two operands"
      // } else if (!OPERAND_TYPES.includes(node.children[1].type)) {
      //   return `Invalid value for assignement ${node.type}. Was: ${node.type}`
      }
    },
    compile: (node) => {
      return `if (${compileNode(node.children[1])}) {${compileNode(node.children[0])}}`
    },
  },
  // [1,2,3]
  // x[0]
  // called square-bracket because it can be an array or an operator
  "meta.square-bracket.jome": {
    validate: (node) => {
      if (node.parts[0].type !== 'punctuation.definition.square-bracket.begin.jome') {
        return "Internal error. meta.square-bracket.jome should always start with punctuation.definition.square-bracket.begin.jome"
      }
      if (node.parts[node.parts.length-1].type !== 'punctuation.definition.square-bracket.end.jome') {
        return "Internal error. meta.square-bracket.jome should always end with punctuation.definition.square-bracket.end.jome"
      }
      // All the even index children should be punctuation.separator.delimiter.jome
      if (node.parts.slice(1,-1).some((c,i) => (i % 2 === 1) && (c.type !== 'punctuation.separator.delimiter.jome'))) {
        return "Syntax error. Expecting commas between every element inside an array"
      }
    },
    compile: (node) => {
      let elems = node.parts.slice(1,-1).filter((e, i) => i % 2 === 0)
      return `[${elems.map(c => compileNode(c)).join(', ')}]`
    },
  },
  // =
  'keyword.operator.assignment.jome': {
    captureLeft: true,
    captureRight: true,
    validate: (node) => {
      if (node.children.length !== 2) {
        return "An assignment must have a two operands"
      // } else if (!['keyword.control.declaration.jome'].includes(node.children[0].type)) {
      //   return `Invalid left hand side for assignement ${node.type}. Was: ${node.type}`
      // } else if (!OPERAND_TYPES.includes(node.children[1].type)) {
      //   return `Invalid value for assignement ${node.type}. Was: ${node.type}`
      }
    },
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

// That a list of ASTNode and return js code
function compilePP(nodes) {
  return nodes.map(node => compileNode(node)).join('')
}

module.exports = {
  parse,
  compilePP
}

/*
  Tant qu'à faire des test de compilation correctement, j'aimerais faire un compilateur correctement.

  Mon idée est de créer une fonction analyze qui prend en entrée tous les tokens du fichiers et crée
  un arbre avec les tokens.

  For my programming language compiler, I already have a function that converts a file into tokens.
  Now I am thinking of writing a function that converts the tokens furthermore into a tree structure.
  Is it usual? What would the name of the function be?
ChatGPT

Yes, it is common to have a separate phase in a compiler that converts tokens into a tree structure.
This phase is often referred to as the "parsing" or "syntax analysis" phase. The resulting tree is
typically called the "abstract syntax tree" (AST). The AST represents the syntactic structure of the
source code in a hierarchical manner.

The function responsible for constructing the AST is commonly known as the "parser." The parser takes
a sequence of tokens as input and builds a tree structure based on the grammar rules of the programming language.

The name of the function can vary, but it is often named something like parse or buildAST. For example:

You may also want to consider incorporating error handling in your parser to report syntax errors or other
issues found during the parsing process.

Overall, breaking down the compilation process into distinct phases, such as lexical analysis (tokenization)
and syntax analysis (parsing), helps in creating a modular and maintainable compiler design.
*/ 