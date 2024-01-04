const {OPERAND_TYPES} = require("./parser.js")

// TODO: Make sure no infinite loop
function validateAllNodes(nodes) {
  nodes.forEach(node => {
    let validator = VALIDATORS[node.type]
    if (validator) {
      let err = validator(node)
      if (err || node.errors.length) {
        throw new Error(err || node.errors[0])
      }
    }
    if (node.children?.length) {
      validateAllNodes(node.children)
    }
    if (node.parts?.length) {
      validateAllNodes(node.parts)
    }
  });
}

function ensureStartRaw(node, str) {
  if (node.parts[0]?.raw !== str) {
    node.errors.push(`Internal error. ${node.type} should always start with token ${str}`)
  }
}
function ensureStartType(node, str) {
  if (node.parts[0]?.type !== str) {
    node.errors.push(`Internal error. ${node.type} should always start with token of type ${str}`)
  }
}
function ensureEndRaw(node, str) {
  if (node.parts[node.parts.length-1]?.raw !== str) {
    node.errors.push(`Internal error. ${node.type} should always end with token ${str}`)
  }
}
function ensureEndType(node, str) {
  if (node.parts[node.parts.length-1]?.type !== str) {
    node.errors.push(`Internal error. ${node.type} should always end with token of type ${str}`)
  }
}
function ensureAllType(node, list, str) {
  list.forEach(el => {
    if (el.type !== str) {
      node.errors.push(`Error. ${node.type} should only contain tokens of type ${str}`)
    }
  })
}

function filterNewlines(list) {
  return list.filter(el => el.type !== 'newline')
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

const VALIDATORS = {
  "meta.function.jome": (node) => {
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
  "meta.block.jome": (node) => {
    if (node.parts[0].type !== 'punctuation.curly-braces.open') {
      return "Internal error. meta.block.jome should always start with punctuation.curly-braces.open"
    }
    if (node.parts[node.parts.length-1].type !== 'punctuation.curly-braces.close') {
      return "Internal error. meta.block.jome should always end with punctuation.curly-braces.close"
    }
  },
  // obj->callFunc
  "meta.caller.jome": (node) => {
    if (node.children.length !== 1) {
      return "Missing operand before getter"
    }
  },
  // obj.property
  "meta.getter.jome": (node) => {
    if (node.children.length !== 1) {
      return "Missing operand before getter"
    }
  },
  // let foo
  // var bar
  'meta.declaration.jome': (node) => {
    let keyword = node.parts[0].raw
    if (node.parts.length !== 2) {
      return "Missing variable name after keyword "+keyword
    }
  },
  // do |args| /* ... */ end
  'meta.do-end.jome': (node) => {
    if (node.parts[0].raw !== 'do') {
      return "Internal error. meta.do-end.jome should always start with keyword do"
    }
    if (node.parts[node.parts.length-1].raw !== 'end') {
      return "Internal error. meta.def.jome should always end with keyword end"
    }
    // Arguments, if present, should always be right after the function name
    if (node.parts.slice(2,-1).find(c => c.type === 'meta.args.jome')) {
      return "Syntax error. Arguments should always be at the beginning of the function block."
    }
  },
  // def someFunc end
  'meta.def.jome': (node) => {
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
  // js uses more specifically:
  // keyword.operator.arithmetic.jome
  // keyword.operator.logical.jome
  // + - * / ^
  'keyword.operator.jome': validateOperator,
  'keyword.operator.existential.jome': validateOperator,
  //'keyword.operator.nullish-coalescing.jome'
  'keyword.operator.colon.jome': (node) => {
    if (node.children.length !== 2) {
      return "A colon operator must have a two operands"
    }
    if (node.children[0].type !== 'keyword.operator.existential.jome') {
      return `Expecting ? before : in ternary expression.`
    }
    let child = node.children[1]
    if (!OPERAND_TYPES.includes(child.type)) {
      return `Invalid operand type for operator ${node.type}. Was: ${child.type}`
    }
  },
  // =>
  'keyword.arrow.jome': (node) => {
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
  // !
  "keyword.operator.logical.unary.jome": validateOperatorUnary,
  // || &&
  "keyword.operator.logical.jome": validateOperator,
  // ==, !=, ===, !===
  'keyword.operator.comparison.jome': validateOperator,
  // statement if cond
  'keyword.control.inline-conditional.jome': (node) => {
    if (node.children.length !== 2) {
      return "An inline condition must have a two operands"
    // } else if (!OPERAND_TYPES.includes(node.children[1].type)) {
    //   return `Invalid value for assignement ${node.type}. Was: ${node.type}`
    }
  },
  // [1,2,3]
  // x[0]
  // called square-bracket because it can be an array or an operator
  "meta.square-bracket.jome": (node) => {
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
  // =
  'keyword.operator.assignment.jome': (node) => {
    if (node.children.length !== 2) {
      return "An assignment must have a two operands"
    // } else if (!['keyword.control.declaration.jome'].includes(node.children[0].type)) {
    //   return `Invalid left hand side for assignement ${node.type}. Was: ${node.type}`
    // } else if (!OPERAND_TYPES.includes(node.children[1].type)) {
    //   return `Invalid value for assignement ${node.type}. Was: ${node.type}`
    }
  },
  // exec
  //   someFunc()
  //   someOtherFunc()
  // end
  "meta.exec.jome": (node) => {
    ensureStartRaw(node, 'exec')
    ensureStartType(node, 'keyword.control.jome')
    ensureEndRaw(node, 'end')
    ensureEndType(node, 'keyword.control.jome')
    let parts = filterNewlines(node.parts.slice(1,-1)) // remove exec, end keyword, and remove newlines
    ensureAllType(node, parts, ['support.function-call.WIP.jome', 'support.function-call.jome'])
    node.data = {calls: parts}
  },
}

module.exports = {
  validateAllNodes
}