// An abstract syntax tree (AST) node
class ASTNode {
  constructor(token) {
    this.raw = token.text()
    this.type = token.type
    this.token = token
    let data = TOKENS[this.type]
    if (!data) {
      throw new Error("TODO: token not implemented yet: "+token.type)  
    }
    this.precedence = (typeof data.precedence === 'function') ? data.precedence(token) : data.precedence
    this.captureLeft = data.captureLeft
    this.captureRight = data.captureRight
    this.minRequiredChildren = data.minRequiredChildren
    this.allowedChildren = data.allowedChildren
    if (token.children && !(token.children.length === 1 && typeof token.children[0] === "string")) {
      this.children = parse(token.children)
    }
    this.children = []
    this.compile = data.compile ? () => data.compile(this) : null
  }
}

function filterSpaces(array) {
  return array.filter(e => !/^\s*$/.test(e)) // filter spaces
}

// Create an abstract syntax tree (AST) from tokens. Returns a list of ASTNode.
function parse(tokens) {

  // All the tokens converted to nodes
  let nodes = filterSpaces(tokens).map(tok => new ASTNode(tok))
  // Only the top nodes
  let topNodes = []

  // lhs === left hand side
  // rhs === right hand side
  const parseExpression1 = (lhs, minPrecedence) => {
    if (lhs.captureRight) {
      if (typeof lhs.captureRight === "number" && Number.isInteger(lhs.captureRight)) {
        lhs.children = nodes.splice(0, lhs.captureRight)
      } else {
        lhs.children.push(nodes.shift())
      }
      return lhs
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
            lookahead.rightAssociative))
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

const OPERAND_TYPES = [
  'constant.numeric.integer.jome',
  'keyword.operator.jome'
]

function validateOperator(node) {
  if (node.children.length !== 2) {
    return "A binary operator must have a two operands"
  } else if (!node.children.every(child => OPERAND_TYPES.includes(child.type))) {
    return `Invalid operand type for operator ${node.type}. Was: ${child.type}`
  }
}

function compileOperator(node) {
  return `${node.children[0].compile()} ${node.raw} ${node.children[1].compile()}`
}

function compileRaw(node) {
  return node.raw
}

function compileUtility(node) {
  let raw = node.raw
  switch (raw) {
    case 'log': return 'console.log'
  }
}

const tokenAsIs = {
  precedence: 100,
  compile: compileRaw
}

const ignoreToken = {
  precedence: 100,
  compile: () => ""
}

const TOKENS = {
  'punctuation.paren.open': ignoreToken,
  'punctuation.paren.close': ignoreToken,
  'punctuation.terminator.statement.jome': tokenAsIs,
  'expression.group': tokenAsIs,
  'variable.other.jome': tokenAsIs,
  'variable.assignment.jome': tokenAsIs,
  'constant.numeric.integer.jome': tokenAsIs,
  // js uses more specifically:
  // keyword.operator.arithmetic.jome
  // keyword.operator.logical.jome
  'keyword.operator.jome': {
    precedence: (token => {
      let op = token.text()
      if (op === '+' || op === '-') {
        return 1000
      } else if (op === '*' || op === '/') {
        return 1100
      } else if (op === '^') {
        return 1200
      }
    }),
    validate: validateOperator,
    compile: compileOperator,
    captureLeft: true,
    captureRight: true,
  },
  'keyword.control.declaration.jome': {
    precedence: 5000,
    captureRight: true,
    // allowedChildren: [
    //   'variable.other.jome',
    //   'variable.assigment.jome'
    // ]
  },
  'keyword.control.declaration.def.jome': {
    precedence: 5000,
    captureRight: 2,
    compile(node) {
      return `let ${node.children[0].raw} = ${node.children[1].compile()}`
    }
  },
  'entity.name.function.utility.jome': {
     ...tokenAsIs,
     compile: compileUtility,
  },
  'keyword.operator.comparison.jome': {
    precedence: 500,
    captureLeft: true,
    captureRight: true,
    validate: validateOperator,
    compile: compileOperator,
  }
}

// That a list of ASTNode and return js code
function compilePP(nodes) {
  return nodes.map(node => {
    let compFunc = node.compile
    if (!compFunc) {
      throw new Error("Error cannot compile node no function available to compile")
    }
    let validateFunc = node.validate
    if (validateFunc) {
      err = validateFunc(node)
      if (err) {
        throw new Error(err)
      }
    }
    return compFunc()
  }).join('\n')
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