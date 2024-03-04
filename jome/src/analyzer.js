const {OPERAND_TYPES, filterSpaces, filterStrings, compileTokenRaw} = require("./parser.js")

const {FileImports, BindingKind} = require("./context.js")

const fs = require("fs")
const path = require("path")

function nodePositionData(node) {
  return {
    lineNb: node.token.lineNb,
    startIndex: node.token.chStartIdx,
    endIndex: node.token.chStartIdx + node.raw.length,
  }
}

function pushError(node, message) {
  // this.suggestions = []
  // this.uid = null // A four or five digits number? See Language Server Diagnostic source
  let error = {
    ...nodePositionData(node),
    message
  }
  //throw new Error(message)
  node.ctxFile.errors.push(error)
  return error
}

function pushBinding(node, bindingName, data) {
  node.lexEnv.addBinding(bindingName, {
    ...nodePositionData(node),
    ...data
  })
}

function pushOccurence(node, data) {
  node.ctxFile.occurences.push({...nodePositionData(node), ...data})
}

function pushFileLink(node, file, data={}) {
  node.ctxFile.filesLinks.push({file, ...nodePositionData(node), ...data})
}

// TODO: Make sure no infinite loop
function analyzeNodes(nodes, throwError = true) {
  nodes.forEach(node => {
    // Analyze the operands first
    if (node.operands?.length) {
      analyzeNodes(node.operands)
    }
    let analyzer = ANALYZERS[node.type]
    if (analyzer) {
      let err = analyzer(node)
      if (err || node.errors.length) {
        if (throwError) {
          throw new Error(err?.message || err || node.errors[0])
        }
      }
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

// Allow commas or newlines as separator
function parseList(items) {
  let modified = []
  let itemBefore = false
  items.forEach(item => {
    if (item.type === 'punctuation.separator.delimiter.jome') {
      modified.push(item)
      itemBefore = false
    } else if (item.type === 'newline') {
      if (itemBefore) {
        // Insert a comma
        modified.push({...item, type: 'punctuation.separator.delimiter.jome', raw: ','})
        itemBefore = false
      }
    } else if (itemBefore) {
      throw new Error("Syntax error. Expecting commas or newlines between every element inside a list")
    } else {
      modified.push(item)
      itemBefore = true
    }
  })
  return modified
}

function ensureListSeparatedByCommasOrNewlines(node, items) {
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
  ensureStartRaw(node, char)
  ensureStartType(node, 'punctuation.definition.string.begin.jome')
  ensureEndRaw(node, char)
  ensureEndType(node, 'punctuation.definition.string.end.jome')
  let parts = node.parts.slice(1, -1)
  node.data = {parts}
}

function validateFuncCall(node, hasDot) {
  if (hasDot && node.parts[0].type !== "punctuation.dot.jome") {
    throw new Error("Internal error. Expected dot before function call in this circonstance.")
  }
  if (hasDot && node.operands.length !== 1) {
    throw new Error("Internal error. A function call with a dot should have a left operand.")
  }
  let nameTok = node.parts[hasDot ? 1 : 0]
  if (nameTok.type !== 'entity.name.function.jome' && nameTok.type !== "support.function.builtin.jome") {
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
    // TODO: If the getter is an optional bracket getter (obj?.[0]), than validate what is inside the bracket too
    if (node.operands.length !== 1) {
      return pushError(node, "Missing operand before getter")
    }
  },
  // let foo
  // var bar
  'meta.declaration.jome': (node) => {
    let keyword = 'let'
    if (node.parts[0].type === 'keyword.control.declaration.jome') {
      keyword = node.parts[0].raw.trimLeft()
    }
    if (node.parts.length < 2) {
      return pushError(node, "Missing variable name after keyword "+keyword)
    }
    let name = node.parts[1].raw
    let variableType
    if (node.parts.length === 4) {
      variableType = node.parts[3].raw
    } else if (node.parts[0].type === 'storage.type.primitive.jome') {
      variableType = node.parts[0].raw
    }
    pushBinding(node, name, {type: 'declaration', keyword, variableType, kind: BindingKind.Variable})
    node.data = {keyword, name, variableType}
  },
  // do |args| /* ... */ end
  'meta.do-end.jome': (node) => {
    if (node.parts[0].raw !== 'do') {
      return "Internal error. meta.do-end.jome should always start with keyword do"
    }
    if (node.parts[node.parts.length-1].raw !== 'end') {
      return "Internal error. meta.do-end.jome should always end with keyword end"
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
    if (node.parts[1]?.type !== 'entity.name.function.jome') {
      return pushError(node, "Syntax error. Missing function name after keyword def.")
    }
    // Arguments, if present, should always be right after the function name
    if (node.parts.slice(3,-1).find(c => c.type === 'meta.args.jome')) {
      return pushError(node, "Syntax error. Arguments should always be at the beginning of the function block.")
    }
    if (!node.operands.length && node.parts[node.parts.length-1].raw !== 'end') {
      return pushError(node, "Missing colon or end statement after keyword def")
    }

    let name = node.parts[1].raw
    pushBinding(node, name, {type: 'def', kind: BindingKind.Function})
    pushOccurence(node.parts[1], {name, kind: 'function'})
    let args = node.parts[2]?.type === 'meta.args.jome' ? node.parts[2] : null

    if (node.operands.length) {
      node.data = {name, expressions: node.operands, args}
      return
    }

    let expressions = node.parts.slice((args ? 3 : 2), -1) // Remove keywords def, end, and function name
    node.data = {name, expressions, args}
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
    // A colon can we used for the else of a ternary, but also for creating an entry for a function call

    let t = node.operands[0].type
    if (t !== 'keyword.operator.existential.jome' && !t.startsWith("string") && t !== 'variable.other.jome') {
      return pushError(node, `Invalid use of colon. Wrong left operand: `+t)
    }

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
    if (isOperator) {
      let items = filterNewlines(node.parts.slice(1,-1))
      if (items.length !== 1) {
        pushError(node, "Syntax error. Square bracket operator expects one and only one expression.")
      }
      node.data = {isOperator, operand: node.operands[0], expression: items[0]}
    } else {
      let elems = parseList(node.parts.slice(1,-1))
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
    
    if (node.operands[0].type === 'meta.declaration.jome') {
      // Try to determine the type implicitely
      let binding = node.lexEnv.getBinding(node.operands[0].parts[1].raw)
      if (node.operands[1].type === 'constant.numeric.integer.jome') {
        binding.variableType = 'int'
      } else if (node.operands[1].type === 'constant.numeric.float.jome') {
        binding.variableType = 'float'
      } else if (node.operands[1].type.startsWith("string")) {
        binding.variableType = 'string'
      } else if (node.operands[1].type === 'constant.language.boolean.jome') {
        binding.variableType = 'bool'
      }
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
    ensureAllTypeIn(node, parts, ['support.function-call.WIP.jome', 'support.function-call.jome', 'keyword.operator.assignment.jome'])
    node.data = {items: parts}
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
  
  // handles all lines starting with keyword import
  "meta.statement.import.jome": (node) => {
    ensureStartRaw(node, 'import')
    ensureStartType(node, 'keyword.control.jome')

    let getName = (name) => {
      if (name[0] === "&") {
        node.ctxFile.classIdentifiers.add(name.slice(1))
      }
      return (name[0] === "&") ? name.slice(1) : name
    }

    let bindings = []
    let list = filterStrings(node.parts.slice(1)) // remove import keyword
    let importFile = list.find(o => o.type === 'meta.import-file.jome')
    if (!importFile) {
      return pushError(node, "Missing filename in import statement.")
    }
    let cs = filterSpaces(importFile.parts)
    let filenameToken = cs[cs.length-1]
    let filename = filenameToken.raw.slice(1,-1)
    if (!filename) {
      return pushError(node, "Missing filename in import statement.")
    }
    let useCjsStyle = (importFile.parts[0].raw === ':') || (importFile.parts[0].raw === 'of')
    list.forEach(item => {
      if (item.type === 'meta.named-imports.jome') {
        filterCommas(filterSpaces(item.parts)).forEach(namedImport => {
          if (namedImport.type === 'variable.other.named-import.jome') {
            bindings.push({name: getName(namedImport.raw), type: 'named-import'})
          } else if (namedImport.type === 'meta.import-alias.jome') {
            let original = namedImport.parts[0].raw
            let name = namedImport.parts[2].raw
            //fileImports.addAliasImport(namedImport.parts[0].raw, namedImport.parts[2].raw)
            bindings.push({name: getName(name), type: 'alias-import', original})
          } else {
            throw new Error("sfj9234hr9h239rhrf923h3r")
          }
        })
        //   } else if (imp.type === 'meta.import-alias.jome') {
        //     throw new Error("TODO: import {foo as bar} syntax")
        //   }
      } else if (item.type === 'meta.import-file.jome') {
        // already handled
      } else if (item.type === 'variable.other.default-import.jome') {
        if (useCjsStyle) {
          bindings.push({name: getName(item.raw), type: 'cjs-import'})
        } else {
          bindings.push({name: getName(item.raw), type: 'default-import'})
        }
      } else if (item.type === 'meta.namespace-import.jome') {
        bindings.push({name: getName(item.parts[2].raw), type: 'namespace-import'})
      } else {
        throw new Error("Error 234j90s7adfg1")
      }
    })

    bindings.forEach(binding => {
      pushFileLink(filenameToken, filename)
      // FIXME: The kind is not always variable, it could be function or class too...
      pushBinding(node, binding.name, {...binding, file: filename, kind: BindingKind.Variable})
    })

    // let relPath = getRelativePath(file, ctx)
    // let ext = path.extname(relPath)
    // if (ext === '.jome') {
    //   ctx.dependencies.push(relPath)
    //   relPath = relPath.slice(0, relPath.length-4)+"built.js"
    //   // relPath = relPath.slice(0, relPath.length-4)+(ctx.useESM ? 'built.js' : 'built.cjs')
    // }
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

  "meta.trycatch.jome": (node) => {
    ensureStartRaw(node, 'try')
    ensureStartType(node, 'keyword.control.trycatch.jome')
    ensureEndRaw(node, 'end')
    ensureEndType(node, 'keyword.control.jome')
    let tryParts = []
    let catchParts = []
    let finallyParts = []
    let exceptionVar = null
    let catchKeywordFound = false
    let finallyKeywordFound = false
    let parts = filterNewlines(node.parts.slice(1,-1))
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i]
      // TODO: Assert that a single catch keyword and a single finally keyword found
      if (part.type === 'keyword.control.trycatch.jome') {
        if (part.raw === 'catch') {
          let next = parts[i+1]
          if (next.type === 'meta.group.jome' && next.parts[1].type === 'variable.other.jome') {
            exceptionVar = next.parts[1].raw
            i += 1
          }
          catchKeywordFound = true
        } else if (part.type === 'keyword.control.trycatch.jome' && part.raw === 'finally') {
          finallyKeywordFound = true
        }
      } else if (finallyKeywordFound) {
        finallyParts.push(part)
      } else if (catchKeywordFound) {
        catchParts.push(part)
      } else {
        tryParts.push(part)
      }
    }
    // TODO: Assert that catch of finally is found
    node.data = {tryParts, catchParts, finallyParts, exceptionVar}
  },

  "meta.tag.jome": validateTag,

  "meta.include.jome": (node) => {
    let parts = node.parts.slice(2,-1) // Remove #, (, )
    let file = parts[0].raw.slice(1,-1) // Remove quotes
    let absPath = file;
    if (file[0] === '.') {
      absPath = path.resolve(node.ctxFile.absPath, '..', file)
    }
    if (!fs.existsSync(absPath)) {
      return pushError(node, "Missing file "+absPath)
    }
    // TODO: Try catch
    let content = fs.readFileSync(absPath)
    node.data = {content}
  },

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
