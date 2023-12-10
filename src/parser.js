// An abstract syntax tree (AST) node
class ASTNode {
  constructor(token, children=[]) {
    this.raw = token.text()
    this.token = token
    let data = TOKENS[token.type]
    if (!data) {
      throw new Error("TODO: token not implemented yet: "+token.type)  
    }
    this.precedence = (typeof data.precedence === 'function') ? data.precedence(token) : data.precedence
    this.captureLeft = data.captureLeft
    this.captureRight = data.captureRight
    this.minRequiredChildren = data.minRequiredChildren
    this.allowedChildren = data.allowedChildren
    this.children = children
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
  let start = 0;

  // lhs === left hand side
  // rhs === right hand side
  const parseExpression1 = (lhs, minPrecedence) => {
    start += 1
    for (let i = start; i < nodes.length-1; i++) {
      let lookahead = nodes[i]
      while (
        lookahead &&
        lookahead.precedence >= minPrecedence &&
        lookahead.captureLeft
      ) {
        const op = lookahead;
        i += 1
        // TODO: Check if capture right
        let rhs = nodes[i]
        lookahead = nodes[i+1]
        while (
          lookahead &&
          ((lookahead.precedence > op.precedence) ||
            (lookahead.precedence === op.precedence &&
              lookahead.rightAssociative))
        ) {
          start += 1
          rhs = parseExpression1(rhs, op.precedence + (lookahead.precedence > op.precedence ? 1 : 0));
          i += 1
          lookahead = nodes[i+1];
        }
  
        op.children = [lhs, rhs]
        lhs = op;
        start += 2
      }
    }
    return lhs;
  };

  topNodes.push(parseExpression1(nodes[0], 0))

  return topNodes
}

const OPERAND_TYPES = [
  'constant.numeric.integer.jome',
  'keyword.operator.jome'
]

const TOKENS = {
  'constant.numeric.integer.jome': {
    precedence: 100
  },
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
    captureLeft: true,
    captureRight: true,
    minRequiredChildren: 2,
    allowedChildren: OPERAND_TYPES
  },
  'keyword.operator.comparison.jome': {
    precedence: 500,
    captureLeft: true,
    captureRight: true,
    minRequiredChildren: 2,
    allowedChildren: OPERAND_TYPES
  }
}

module.exports = {
  parse
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