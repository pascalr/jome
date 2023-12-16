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

// An abstract syntax tree (AST) node
class ASTNode {
  constructor(token) {
    this.raw = compileTokenRaw(token.children)
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
    this.children = []
    if (token.children && !(token.children.length === 1 && typeof token.children[0] === "string")) {
      this.children = parse(token.children)
    }
    this.compile = data.compile ? () => {
      if (data.validate) {
        let err = data.validate(this)
        if (err) {
          throw new Error(err)
        }
      }
      return data.compile(this)
    } : null
  }
}

// function filterSpaces(array) {
//   return array.filter(e => !/^\s*$/.test(e))
// }
function filterStrings(array) {
  return array.filter(e => typeof e !== 'string')
}

// Create an abstract syntax tree (AST) from tokens. Returns a list of ASTNode.
function parse(tokens) {

  // All the tokens converted to nodes
  let nodes = filterStrings(tokens).map(tok => new ASTNode(tok))
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

// const validateChildren = (nb, types) => (node) => {
//   if (node.children.length !== nb) {
//     return "Invalid number of children for node."
//   } else if (!node.children.every(child => types.includes(child.type))) {
//     return `Invalid children type for node ${node.type}. Was: ${node.type}`
//   }
// }

function validateOperator(node) {
  // return validateChildren(2, OPERAND_TYPES)(node)
  if (node.children.length !== 2) {
    return "A binary operator must have a two operands"
  } else if (!node.children.every(child => OPERAND_TYPES.includes(child.type))) {
    return `Invalid operand type for operator ${node.type}. Was: ${node.type}`
  }
}

function compileOperator(node) {
  return `${node.children[0].compile()} ${node.raw} ${node.children[1].compile()}`
}

function compileRaw(node) {
  return node.raw
}

function compileUtility(node) {
  let raw = node.raw.slice(1)
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

const regular = (compile) => ({
  precedence: 100,
  compile
})

function compileArgs(node) {
  let children = node.children.slice(1, -1) // remove vertical bars
  //let args = 
  //let todo = 10
  return `(${children.map(c => c.compile()).join('')})`
}

const TOKENS = {
  'meta.args.jome': ignoreToken,
  'punctuation.vertical-bar.begin.jome': ignoreToken,
  'punctuation.vertical-bar.end.jome': ignoreToken,
  'comment.block.jome': ignoreToken,
  'keyword.control.jome': ignoreToken,
  'keyword.control.conditional.jome': ignoreToken,
  'punctuation.definition.comment.jome': ignoreToken,
  'punctuation.paren.open': ignoreToken,
  'punctuation.paren.close': ignoreToken,
  'punctuation.definition.string.begin.jome': ignoreToken,
  'punctuation.definition.string.end.jome': ignoreToken,
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
  "meta.function.do.end.jome": regular((node) => {
    let args = node.children.find(c => c.type === 'meta.args.jome')
    return `function ${args ? compileArgs(args) : '()'} {${node.children.map(c => c.compile()).join('')}}`
  }),
  'constant.language.jome': tokenAsIs,
  'expression.group': tokenAsIs,
  'variable.other.jome': tokenAsIs,
  'variable.assignment.jome': tokenAsIs,
  'constant.numeric.integer.jome': tokenAsIs,
  'constant.numeric.float.jome': tokenAsIs,
  'meta.if-block.jome': regular((node) => {
    let cs = node.children.slice(1, -1) // remove if and end
    return `if (${cs[0].compile()}) {${cs.slice(1).map(c => c.compile()).join('')}}`
  }),
  // js uses more specifically:
  // keyword.operator.arithmetic.jome
  // keyword.operator.logical.jome
  // + - * / ^
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
  // =>
  'keyword.arrow.jome': {
    precedence: 300,
    captureLeft: true,
    captureRight: true,
    // validate: TODO validate that left arg is an arg
    compile: (node) => {
      let args = node.children.find(c => c.type === 'meta.args.jome')
      return `${args ? compileArgs(args) : '()'} => (${node.children.map(c => c.compile()).join('')})`
    },
  },
  // ==, !=, ===, !===
  'keyword.operator.comparison.jome': {
    precedence: 500,
    captureLeft: true,
    captureRight: true,
    validate: validateOperator,
    compile: compileOperator,
  },
  // statement if cond
  'keyword.control.inline-conditional.jome': {
    precedence: 200,
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
      return `if (${node.children[1].compile()}) {${node.children[0].compile()}}`
    },
  },
  // =
  'keyword.operator.assignment.jome': {
    precedence: 250,
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
  // // if
  // 'keyword.control.conditional.jome': {
  //   precedence: 200,
  //   captureRight: 2,
  //   validate: (node) => {
  //     if (node.children.length !== 2) {
  //       return "An if statement must have a condition and a value"
  //     }
  //   },
  //   compile(node) {
  //     return `if (${node.children[0].compile()}) { ${node.children[1].compile()} }`
  //   }
  // },
  // let
  'keyword.control.declaration.jome': {
    precedence: 5000,
    captureRight: true,
    compile(node) {
      return `let ${node.children[0].raw}`
    }
    // allowedChildren: [
    //   'variable.other.jome',
    //   'variable.assigment.jome'
    // ]
  },
  // def
  'keyword.control.declaration.def.jome': {
    precedence: 5000,
    captureRight: 2,
    compile(node) {
      return `let ${node.children[0].raw} = ${node.children[1].compile()}`
    }
  },
  // #log
  'entity.name.function.utility.jome': {
     ...tokenAsIs,
     compile: compileUtility,
  }
}

// That a list of ASTNode and return js code
function compilePP(nodes) {
  return nodes.map(node => {
    let compFunc = node.compile
    if (!compFunc) {
      throw new Error("Error cannot compile node no function available to compile: "+node.type)
    }
    return compFunc()
  }).join('')
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