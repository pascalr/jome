const {OPERAND_TYPES, filterSpaces, filterStrings, compileTokenRaw} = require("./parser.js")

// TODO: Rename this to analyzer and give this file the responsability too of building the lexical environment.
// Because I need the lexical environment for the language server too without generating code.

function pushError(node, message) {
  // this.suggestions = []
  // this.uid = null // A four or five digits number? See Language Server Diagnostic source
  let error = {
    lineNb: node.token.lineNb,
    startIndex: node.token.chStartIdx,
    endIndex: node.token.chStartIdx + node.raw.length,
    message
  }
  node.ctxFile.errors.push(error)
  return error
}

// TODO: Make sure no infinite loop
function analyzeNodes(nodes, throwError = true) {
  nodes.forEach(node => {
    let analyzer = ANALYZERS[node.type]
    if (analyzer) {
      let err = analyzer(node)
      if (err || node.errors.length) {
        if (throwError) {throw new Error(err?.message || err || node.errors[0])}
      }
    }
    if (node.operands?.length) {
      analyzeNodes(node.operands)
    }
    if (node.parts?.length) {
      analyzeNodes(node.parts)
    }
  });
  return nodes[0]?.ctxFile.errors
}

function ensureLhsOperand(node) {
  // return validateoperands(2, OPERAND_TYPES)(node)
  if (node.operands.length !== 1) {
    throw new Error(`Missing left hand side operand for token ${node.type}`)
  }
  if (node.operands.length && !OPERAND_TYPES.includes(node.operands[0].type)) {
    throw new Error(`Invalid operand type for operator ${node.type}. Was: ${node.operands[0].type}`)
  }
}
function ensureStartRaw(node, str) {
  if (node.parts[0]?.raw !== str) {
    throw new Error(`Internal error. ${node.type} should always start with token ${str}. Was ${node.parts[0]?.raw}`)
  }
}
function ensureStartType(node, str) {
  if (node.parts[0]?.type !== str) {
    throw new Error(`Internal error. ${node.type} should always start with token of type ${str}. Was ${node.parts[0]?.type}`)
  }
}
function ensureEndRaw(node, str) {
  let s = node.parts[node.parts.length-1]?.raw
  if (s !== str) {
    throw new Error(`Internal error. ${node.type} should always end with token ${str}. Was ${s}`)
  }
}
function ensureEndType(node, str) {
  let s = node.parts[node.parts.length-1]?.type
  if (s !== str) {
    throw new Error(`Internal error. ${node.type} should always end with token of type ${str}. Was ${s}`)
  }
}
function ensureAllType(node, list, str) {
  list.forEach(el => {
    if (el.type !== str) {
      throw new Error(`Error. ${node.type} should only contain tokens of type ${str}. Was ${el.type}`)
    }
  })
}
function ensureAllTypeIn(node, list, arr) {
  list.forEach(el => {
    if (!arr.includes(el.type)) {
      throw new Error(`Error. ${node.type} malformed expression. Unexpected children token type ${el.type}`)
    }
  })
}

function ensureListSeparatedByCommas(node, items) {
  // All the even index operands should be punctuation.separator.delimiter.jome
  if (items.some((c,i) => (i % 2 === 1) && (c.type !== 'punctuation.separator.delimiter.jome'))) {
    throw new Error("Syntax error. Expecting commas between every element inside a list")
  }
}

function filterNewlines(list) {
  return list.filter(el => el.type !== 'newline')
}

function filterCommas(list) { // 'commas'?
  return list.filter(el => el.type !== 'commas' && el.type !== 'punctuation.separator.delimiter.jome')
}

// const validateoperands = (nb, types) => (node) => {
//   if (node.operands.length !== nb) {
//     return "Invalid number of operands for node."
//   } else if (!node.operands.every(child => types.includes(child.type))) {
//     return `Invalid operands type for node ${node.type}. Was: ${node.type}`
//   }
// }

// Depreacted: Use ensureLhsOperand instead.
function validateOperatorUnary(node) {
  // return validateoperands(2, OPERAND_TYPES)(node)
  if (node.operands.length !== 1) {
    return pushError(node, "A unary operator must have a single operand")
  }
  if (!OPERAND_TYPES.includes(node.operands[0].type)) {
    return pushError(node, `Invalid operand type for operator ${node.type}. Was: ${node.operands[0].type}`)
  }
}

function validateOperator(node) {
  let op = node.raw
  // return validateoperands(2, OPERAND_TYPES)(node)
  if (node.operands.length !== 2) {
    return pushError(node, `Binary operator ${op} must have two operands`)
  }

  for (let i = 0; i < node.operands.length; i++) {
    let child = node.operands[i]
    if (!OPERAND_TYPES.includes(child.type)) {
      return pushError(node, `Invalid operand type for operator ${op}. Was: ${child.type}`)
    }
  }
}

function validateString(node, char) {
  let last = node.parts[node.parts.length-1]
  let format;
  if (last.type === 'keyword.other.string-format.jome') {
    format = last.raw
  }
  ensureStartRaw(node, char)
  ensureStartType(node, 'punctuation.definition.string.begin.jome')
  // ensureEndRaw(node, char)
  // ensureEndType(node, 'punctuation.definition.string.end.jome')
  let parts = node.parts.slice(1, format ? -2 : -1)
  node.data = {parts, format}
}

function validateFuncCall(node, hasDot) {
  if (hasDot && node.parts[0].type !== "punctuation.dot.jome") {
    throw new Error("Internal error. Expected dot before function call in this circonstance.")
  }
  if (hasDot && node.operands.length !== 1) {
    throw new Error("Internal error. A function call with a dot should have a left operand.")
  }
  let nameTok = node.parts[hasDot ? 1 : 0]
  if (nameTok.type !== 'entity.name.function.jome' && nameTok.type !== "entity.name.function.utility.jome") {
    throw new Error("Internal error. Function calls should always start with a name.")
  }
  let parts = node.parts.slice(hasDot ? 2 : 1)
  let args = [];
  if (parts.length && parts[parts.length-1].type === 'meta.do-end.jome') {
    args.push(parts[parts.length-1])
    parts = parts.slice(0, -1)
  }
  parts = filterNewlines(parts)
  ensureListSeparatedByCommas(node, parts)
  args = [...parts.filter((e, i) => i % 2 === 0), ...args]

  node.data = {nameTok, args}
}

function validateTag(node) { // A generic version of the heredoc. It is not yet clear how to call those things.
  if (node.type !== "meta.tag.jome") {
    throw new Error(`Internal error. A tag should always start with type meta.embedded.block. Was ${node.type}`)
  }
  ensureStartType(node, 'punctuation.definition.tag.begin.jome')
  if (node.parts[1].type !== "entity.name.tag.jome") {
    throw new Error(`Internal error. A tag have a name of type entity.name.tag.jome. Was ${node.parts[1].type}`)
  }
  let openingTagName = node.parts[1].raw
  let closingTagName = node.parts[node.parts.length-2].raw;
  if (openingTagName !== closingTagName) {
    throw new Error(`Internal error. Heredoc should always have a matching closing tage. Opening: ${openingTagName}. Closing: ${closingTagName}`)
  }
  let contentStartIdx = node.parts.findIndex(p => p.type === 'punctuation.definition.tag.end.jome')+1
  // TODO: Parse attributes
  let content = compileTokenRaw(node.parts.slice(contentStartIdx,-3))
  node.data = {content, tagName: openingTagName}
}

const ANALYZERS = {
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
    if (node.operands.length !== 1) {
      return pushError(node, "Missing operand before arrow getter")
    }
  },
  // obj.property
  "meta.getter.jome": (node) => {
    if (node.operands.length !== 1) {
      return pushError(node, "Missing operand before getter")
    }
  },
  // let foo
  // var bar
  'meta.declaration.jome': (node) => {
    let keyword = node.parts[0].raw
    if (node.parts.length !== 2) {
      return pushError(node, "Missing variable name after keyword "+keyword)
    }
    let name = node.parts[1].raw
    node.lexEnv.addBinding(name, {type: 'declaration', keyword})
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
      return pushError(node, "Syntax error. Arguments should always be at the beginning of the function block.")
    }
  },
  // def someFunc end
  'meta.def.jome': (node) => {
    if (node.parts[0].raw !== 'def') {
      throw new Error("Internal error. meta.def.jome should always start with keyword def")
    }
    if (node.parts[1].type !== 'entity.name.function.jome') {
      return pushError(node, "Syntax error. Missing function name after keyword def.")
    }
    if (node.parts[node.parts.length-1].raw !== 'end') {
      throw new Error("Internal error. meta.def.jome should always end with keyword end")
    }
    // Arguments, if present, should always be right after the function name
    if (node.parts.slice(3,-1).find(c => c.type === 'meta.args.jome')) {
      return pushError(node, "Syntax error. Arguments should always be at the beginning of the function block.")
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
    if (node.operands.length !== 2) {
      return pushError(node, "A colon operator must have a two operands")
    }
    // A colon can we used for the else of a ternary, but also for creating en entry
    // if (node.operands[0].type !== 'keyword.operator.existential.jome') {
    //   return `Expecting ? before : in ternary expression.`
    // }
    let child = node.operands[1]
    if (!OPERAND_TYPES.includes(child.type)) {
      return pushError(node, `Invalid operand type for operator ${node.type}. Was: ${child.type}`)
    }
    // node.data = {
    //   isTernary: node.operands[0].type === 'keyword.operator.existential.jome'
    // }
  },
  // =>
  'keyword.arrow.jome': (node) => {
    if (node.operands.length === 1) {
      // No args
      // TODO: Validate right side
    } else if (node.operands.length === 2) {
      // With args
      let t = node.operands[0].type
      if (!(t === 'meta.group.jome' || t === 'variable.other.jome')) {
        return pushError(node, "Syntax error. Arrow function expects arguments at it's left side.")
      }
      // TODO: Validate right side
    } else {
      return pushError(node, "Syntax error. Arrow function expects one or two operands.")
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
    if (node.operands.length !== 2) {
      return pushError(node, "An inline condition must have a two operands")
    // } else if (!OPERAND_TYPES.includes(node.operands[1].type)) {
    //   return `Invalid value for assignement ${node.type}. Was: ${node.type}`
    }
  },
  // [1,2,3]
  // x[0]
  // called square-bracket because it can be an array or an operator
  "meta.square-bracket.jome": (node) => {
    if (node.parts[0].type !== 'punctuation.definition.square-bracket.begin.jome') {
      throw new Error("Internal error. meta.square-bracket.jome should always start with punctuation.definition.square-bracket.begin.jome")
    }
    if (node.parts[node.parts.length-1].type !== 'punctuation.definition.square-bracket.end.jome') {
      throw new Error("Internal error. meta.square-bracket.jome should always end with punctuation.definition.square-bracket.end.jome")
    }
    let isOperator = node.operands.length
    let items = node.parts.slice(1,-1)
    if (isOperator) {
      if (items.length !== 1) {
        pushError(node, "Syntax error. Square bracket operator expects one and only one expression.")
      }
      node.data = {isOperator, operand: node.operands[0], expression: items[0]}
    } else {
      ensureListSeparatedByCommas(node, items)
      let elems = node.parts.slice(1,-1).filter((e, i) => i % 2 === 0)
      node.data = {elems}
    }
  },
  // =
  'keyword.operator.assignment.jome': (node) => {
    if (node.operands.length !== 2) {
      return pushError(node, "An assignment must have a two operands")
    // } else if (!['keyword.control.declaration.jome'].includes(node.operands[0].type)) {
    //   return `Invalid left hand side for assignement ${node.type}. Was: ${node.type}`
    // } else if (!OPERAND_TYPES.includes(node.operands[1].type)) {
    //   return `Invalid value for assignement ${node.type}. Was: ${node.type}`
    }
  },
  // chain
  //   someFunc()
  //   someOtherFunc()
  // end
  "meta.chain.jome": (node) => {
    ensureStartRaw(node, 'chain')
    ensureStartType(node, 'keyword.control.jome')
    ensureEndRaw(node, 'end')
    ensureEndType(node, 'keyword.control.jome')
    ensureLhsOperand(node)
    let parts = filterNewlines(node.parts.slice(1,-1)) // remove chain, end keyword, and remove newlines
    ensureAllTypeIn(node, parts, ['support.function-call.WIP.jome', 'support.function-call.jome'])
    node.data = {calls: parts}
  },
  // if ... end
  "meta.if-block.jome": (node) => {
    ensureStartRaw(node, 'if')
    ensureStartType(node, 'keyword.control.conditional.jome')
    ensureEndRaw(node, 'end')
    ensureEndType(node, 'keyword.control.jome')
    let parts = filterNewlines(node.parts.slice(1,-1)) // remove if, end keyword, and remove newlines

    // TODO: Make sure that if and the elsifs have one operand (the condition)
    let currentSection = {keyword: 'if', cond: node.parts[0].operands[0], statements: []}
    let sections = [currentSection] // an if, or an elsif, or an else
    parts.forEach(p => {
      if (p.type === 'keyword.control.conditional.jome') {
        // TODO: Make sure that if and the elsifs have one operand (the condition)
        currentSection = {keyword: 'else if', cond: p.operands[0], statements: []}
        sections.push(currentSection)
      } else if (p.type === 'keyword.control.conditional.else.jome') {
        if (currentSection.keyword === 'else') {
          return pushError(node, "A condition block can only have a single else statement.")
        }
        currentSection = {keyword: 'else', statements: []}
        sections.push(currentSection)
      } else {
        currentSection.statements.push(p)
      }
    })
    node.data = {sections}
  },
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
    ensureStartRaw(node, 'import')
    ensureStartType(node, 'keyword.control.jome')

    let file;
    let defaultImport = ''
    let namedImports = []
    let namespaceImport = null // * as namespace_name
    let list = filterStrings(node.parts.slice(1)) // remove import keyword
    list.forEach(item => {
      if (item.type === 'meta.named-imports.jome') {
        filterCommas(filterSpaces(item.parts)).forEach(namedImport => {
          if (namedImport.type === 'variable.other.named-import.jome') {
            namedImports.push(namedImport.raw)
          } else if (namedImport.type === 'meta.import-alias.jome') {
            throw new Error("TODO 98hr92gh9du23")
            // namedImports.push(namedImport.raw)
          } else {
            throw new Error("sfj9234hr9h239rhrf923h3r")
          }
        })
        //   } else if (imp.type === 'meta.import-alias.jome') {
        //     throw new Error("TODO: import {foo as bar} syntax")
        //   }
      } else if (item.type === 'meta.import-file.jome') {
        let cs = filterSpaces(item.parts)
        file = cs[cs.length-1].raw.slice(1,-1)
      } else if (item.type === 'variable.other.default-import.jome') {
        defaultImport = item.raw
      } else if (item.type === 'meta.namespace-import.jome') {
        namespaceImport = item.parts[2].raw
      } else {
        throw new Error("Error 234j90s7adfg1")
      }
    })

    // let relPath = getRelativePath(file, ctx)
    // let ext = path.extname(relPath)
    // if (ext === '.jome') {
    //   ctx.dependencies.push(relPath)
    //   relPath = relPath.slice(0, relPath.length-4)+"built.js"
    //   // relPath = relPath.slice(0, relPath.length-4)+(ctx.useESM ? 'built.js' : 'built.cjs')
    // }
    node.data = {file, defaultImport, namedImports, namespaceImport}
  },

  "string.quoted.double.jome": (node) => validateString(node, '"'),
  "string.quoted.single.jome": (node) => validateString(node, "'"),
  "string.quoted.multi.jome": (node) => validateString(node, "'''"),
  "string.quoted.backtick.jome": (node) => validateString(node, '`'),

  "meta.string-template-literal.jome": (node) => {
    ensureStartRaw(node, '{')
    ensureStartType(node, 'punctuation.definition.template-expression.begin.jome')
    ensureEndRaw(node, '}')
    ensureEndType(node, 'punctuation.definition.template-expression.end.jome')
    if (node.parts.length !== 3) {
      return pushError(node, "Error a template literal should only contain a single expression inside template.")
    }
    let code = node.parts[1]
    node.data = {code}
  },

  "support.function-call.WIP.jome": (node) => validateFuncCall(node, false,),
  "support.function-call.jome": (node) => validateFuncCall(node, false),
  "meta.function-call.WIP.jome": (node) => validateFuncCall(node, true),
  "meta.function-call.jome": (node) => validateFuncCall(node, true),

  "meta.with-args.jome": (node) => {
    ensureStartRaw(node, 'with')
    ensureStartType(node, 'keyword.control.jome')
    let parts = node.parts.slice(1) // Remove 'with' keyword
    // Whether is is a with ... end block to define file arguments
    let isFileArguments = false
    let args = []
    if (node.parts[node.parts.length-1]?.raw === 'end') {
      isFileArguments = true
      parts = parts.slice(0, -1) // Remove 'end' keyword
    }
    parts = filterCommas(filterNewlines(parts))
    node.data = {isFileArguments, argsToken: parts}
  },

  "meta.tag.jome": validateTag,

  "meta.forall.jome": (node) => {
    ensureStartRaw(node, 'forall')
    ensureStartType(node, 'keyword.control.jome')
    ensureEndRaw(node, 'end')
    ensureEndType(node, 'keyword.control.jome')
    let tagName = node.parts[1].raw
    let parts = node.parts.slice(2,-1) // skip 2 keywords and tag name
    let chainFunctions = []
    let wrapFunctions = []
    parts.forEach(part => {
      if (part.type === 'meta.forall-chain.jome') {
        ensureStartRaw(part, 'chain')
        ensureStartType(part, 'keyword.control.jome')
        let funcs = part.parts.slice(1) // skip keyword chain
        funcs.forEach(func => {
          if (func.type !== 'entity.name.function.jome') {
            throw new Error("sdf890230r23j0fj230f230ih")
          }
          chainFunctions.push(func.raw)
        })
      } else if (part.type === 'meta.forall-wrap.jome') {
        ensureStartRaw(part, 'wrap')
        ensureStartType(part, 'keyword.control.jome')
        let funcs = part.parts.slice(1) // skip keyword wrap
        funcs.forEach(func => {
          if (func.type !== 'entity.name.function.jome') {
            throw new Error("df9h2890fh92uu9sbdf1sdlf")
          }
          wrapFunctions.push(func.raw)
        })
      }
    })
    node.data = {tagName, chainFunctions, wrapFunctions}
  },
}

module.exports = {
  analyzeNodes,
  filterCommas,
  filterNewlines,
  filterSpaces
}
