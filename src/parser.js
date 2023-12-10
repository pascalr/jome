// An abstract syntax tree (AST) node
class ASTNode {
  constructor(token, children=[]) {
    this.token = token
    this.precedence = getPrecedence(token)
    this.children = children
  }

  static createRoot() {
    let node = new ASTNode(null)
    node.isRoot = true
    return node
  }

  raw() {
    return this.token.value
  }
}

function parseExpression(tokens) {

  let nodes = tokens.map(tok => new ASTNode(tok))
  let consumedIdx = 0;

  // lhs === left hand side
  // rhs === right hand side
  const parseExpression1 = (start, lhs, minPrecedence) => {
    for (let i = start; i < nodes.length-1; i++) {
      let lookahead = nodes[i+1]
      while (
        lookahead &&
        lookahead.precedence >= minPrecedence
      ) {
        const op = lookahead;
        i += 1
        let rhs = nodes[i+1]
        lookahead = nodes[i+2]
        while (
          lookahead &&
          ((lookahead.precedence > op.precedence) ||
            (lookahead.precedence === op.precedence &&
              lookahead.rightAssociative))
        ) {
          rhs = parseExpression1(i+1, rhs, op.precedence + (lookahead.precedence > op.precedence ? 1 : 0));
          lookahead = nodes[0];
        }
  
        lhs = new TreeNode(op, lhs, rhs);
        lookahead = nodes[0];
      }
    }
    return lhs;
  };

  return parseExpression1(0, nodes[0], 0);
}

const TOKENS = {
  'constant.numeric.integer.jome': {
    precedence: 100
  },
  // js uses:
  // keyword.operator.comparison.jome
  // keyword.operator.arithmetic.jome
  // keyword.operator.logical.jome
  'keyword.operator.jome': {
    precedence: (token => {
      let op = token.text()
      if (op === '+' || op === '-') {
        return 1000 - 1
      } else if (op === '*' || op === '/') {
        return 1100
      } else if (op === '^') {
        return 1200
      }
    }),
    captureLeft: true,
    captureRight: true,
    allowedChildren: [
      'constant.numeric.integer.jome'
    ]
  }
}

function getPrecedence(tok) {
  if (!tok) {return -1}
  let data = TOKENS[tok.type]
  if (data) {
    return (typeof data.precedence === 'function') ? data.precedence(tok) : data.precedence
  }
  throw new Error("TODO: token not implemented yet: "+tok.type)
}

// Create an abstract syntax tree (AST) from tokens. Returns a list of ASTNode.
function parse(toks) {
  let root = ASTNode.createRoot()
  /* TODO */
  return []
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