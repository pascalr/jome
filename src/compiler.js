import { POST_PROCESSES, tokenize } from './tokenizer.js'
import { CompileContext } from './compile_context.js'

import fs from 'fs'
import path from 'path'
import compileMarkdown from './compilers/markdown.js'
import { analyze } from './analyzer.js'

const JOME_LIB = 'jome'
const JOME_ROOT = '$'
const JOME_ATTRS = '$'

// TODO: I should use a nesting index for params __params__, __params1__, __params2__, ...

// FIXME: Mon truc de prev ne fonctionne pas avec: meta.square-bracket.jome
// Parce que je ne sais pas si square-bracket est pour un array ou pour l'opérateur
// Donc je devrais regarder le précédent, mais je ne devrais pas nécessairement
// le capturer...
// list[0].x => (list[0])(.x)
// et non (list) ([0].x)

/*

TODO:
tokenizer
obj.func() => func devrait être tokenizer comme un meta.function_call.jome

Si tu fais func => (
  x = 10
), je ne veux pas retourne 10
Tu dois faire func => (
  x = 10
  x
)
Mais tu peux faire func => (
  10 + 30
)

Pour pouvoir faire func => (
  10 + (x = 20) + 30
), le plus simple serait de faire comme typescript et mettre les déclarations de variables dans le haut du scope
function func() {
  let x
  return 10 + (x = 20) + 30
}

Les unités vont être géré lors de la compilation. Les unitées restent des chiffres.
Pouvoir voir les unités avec le keyword unit.
weight = 100g => weight = 100 // g
getCost = |weight·kg| => (...)
ou bien
getCost = |weight : kg| => (...) // Comme typescript, permettre les types comme typescript plus tard

class Titre |texte| => (
  console.log('%c' + texte, 'color: yellow')
)
// Peut-être permettre cette syntaxe qui se traduit par:
class Titre {
  constructor: |texte| => (
    console.log('%c' + texte, 'color: yellow')
  )
}

Être capable de faire
if true execute()
ET
execute() if true() // le true doit être inline pour avoir cette 
execute()
if true // PAS VALIDE
*/

function compileKey(key) {
  return /-/.test(key) ? `"${key}"` : key
}

export function compileRaw(node) {
  if (Array.isArray(node)) {
    return node.map(n => compileRaw(n)).join('')
  } else if (node.type === 'newline') {
    return '\n'
  } else if (typeof node === 'string') {
    return node
  } else {
    return node.children.map(n => compileRaw(n)).join('')
  }
}

function compileAsIs(node, ctx) {
  return node.text()
}

function compileWithSpaces(node, ctx) {
  return ' '+node.text()+' '
}

// arc-en-ciel => arc__en__ciel
function compileName(name) {
  return name.replace(/-/g, '__').replace(/\@/g, '__at__').replace(/\~/g, '__signal__')
}

// TODO: Handle the return if required
// In jome, { ... } is always a dict and never a block
// This function compile a jome statement into a javascript block
function jsBlock(node, ctx, addReturnStatement = false) {
  if (!node) {
    throw new Error("Error 607127593")
  }
  ctx.depth += 1
  let r = `{\n${'  '.repeat(ctx.depth)}`
  if (node.type === 'expression.group') {
    r += compileScope(node, node.children.slice(1,-1), ctx, addReturnStatement)
  } else if (node.type === 'source.jome') { // Used by require
    r += compileScope(node, node.children, ctx, addReturnStatement)
  } else {
    r += (addReturnStatement ? 'return ' : '')+compileToken(node, ctx)
  }
  ctx.depth -= 1
  r += `\n${'  '.repeat(ctx.depth)}}`
  return r
}

function compileScope(node, array, ctx, addReturnStatement = false) {
  let prev = ctx.currentScopeNode
  ctx.currentScopeNode = node
  node.declarations = new Set()
  let r = compileJsBlock(array, ctx, addReturnStatement)
  if (node.declarations.size) {
    return 'var '+Array.from(node.declarations).join(', ')+'\n'+r
  }
  ctx.currentScopeNode = prev
  return r
}

function filterSpaces(array) {
  return array.filter(e => !/^\s*$/.test(e)) // filter spaces
}

function filterStrings(array) {
  return array.filter(e => typeof e !== 'string')
}

function compileJsBlock(array, ctx, addReturnStatement = false) {
  let r = []
  array = filterSpaces(array)
  for (let i = 0; i < array.length; i++) {
    if (array[i].captured) {continue} // skip already processed
    if (array[i].type === 'newline' && (r[r.length-1]?.slice(-1) === '\n' || i === 0 || i === array.length-1)) {
      // Ignore double newlines, starting and ending newlines
    // } else if (r0 === '\n') {
      //r += '  '.repeat(ctx.depth)+r0
    } else {
      if (POST_PROCESSES.has(array[i+1]?.type)) {
        // Ignore will be handled by post process
      } else {
        let r1 = compileToken(array[i], ctx)
        if (r1 && r1.length) {r.push(r1)}
      }
    }
  }
  if (!r.length) {
    return ''
  } else if (addReturnStatement) {
    let t;
    const lastIndex = r.lastIndexOf('\n');
    if (lastIndex !== -1) {
      r.splice(lastIndex+1, 0, 'return ');
      t = r
    } else if (!r[0].startsWith('return') && !r[0].startsWith('if')) {
      t = ['return ', ...r]
    } else {
      t = r
    }
    let res = t.join('')
    return res
  } else {
    return r.join('')
  }
}

function compileJsValue(v) {
  if (typeof v === 'string') {
    //return '"'+v+'"'
    return v
  } else if (Array.isArray(v)) {
    return '['+v.map(e => compileJsValue(e)).join(', ')+']'
  } else if (typeof v === 'object') {
    return compileJsObj(v)
  }
  return ''+v
}

function compileJsObj(obj) {
  let r = []
  Object.keys(obj).forEach(key => {
    r.push(compileKey(key)+': '+compileJsValue(obj[key]))
  })
  return '{'+r.join(', ')+'}'
}

function _buildJomeObjs(nodes, ctx, isRoot = true) {
  let result = []
  nodes.forEach(node => {
    // if (tok.type === 'meta.jome-obj.jome') {
    let attrs = {}
    let meta = {}
    let stateVars = {}
    let argTokens = []
    let key
    let type
    for (let i = 0; i < node.array.length; i++) {
      let part = node.array[i]
      if (part.type === 'entity.name.type.jome-obj.jome') {
        type = part.text()
      } else if (part.type === 'keyword.control.tutor.jome') {
        // Ignore handled elsewhere
      //} else if (part.type && !part.type.startsWith('punctuation')) {
      } else if (part.type === 'variable.other.state-var.jome') {
        let name = part.text().slice(1)
        let val = compileToken(node.array[i+2], ctx)
        stateVars[name] = val
        i += 2
      } else if (i === 0 && part.type === 'meta.dictionary-key.jome') {
        key = part.children[0].text()
      } else {
        argTokens.push(part)
      }
    }
    let args = compileFunctionCallArgs(argTokens, type, ctx)
    let childrenNodes = []
    let funcCalls = []
    node.children.forEach(child => {
      let tok = child.array[0]
      if (tok.type === 'keyword.control.tutor.jome') {
        ctx.tutor = meta.name
      } else if (tok.type === 'entity.name.function.jome') { // Func call
        let name = tok.text()
        let args = compileFunctionCallArgs(child.array.slice(1), name, ctx)
        funcCalls.push(name+args)
      } else {
        childrenNodes.push(child)
      }
    })
    let children = childrenNodes.length ? _buildJomeObjs(childrenNodes, ctx, false) : []
    if (isRoot && ctx.tutor) {
      meta.tutorPath = ctx.tutor
    }
    let stateVariables = ctx.stateVariables
    ctx.stateVariables = []
    if (type || Object.keys(meta).length) {
      result.push({type, args, attrs, meta, children, funcCalls, stateVars, key, stateVariables})
    }
      // $$.newObj({}, {name: 'container', children: [$$.newObj({}, {name: 'subcontainer'})], tutor: 'subcontainer'})
    // } else if (tok.type === 'keyword.control.tutor.jome') {
    //   // Ignore here, it's handled elsewhere
    // } else {
    //   throw new Error('Unexpected token found parsing jome object.')
    // }
  })
  return result
}

function compileFunctionArgsDetailed(node, ctx, insideClassFunction = false) {
  if (node.type !== 'meta.function.jome' && node.type !== 'meta.interface.jome') {
    throw new Error('Error 6927')
  }
  //let args = cutGroup(node.children, 'punctuation.definition.array.begin.jome', 'punctuation.definition.array.end.jome', 'punctuation.separator.delimiter.jome')
  let hasParams = false
  let args = {}
  let paramsValues = {}
  let attrParams = []
  let children = filterSpaces(node.children).filter(child => {
    let t = child.type
    return t !== 'keyword.arrow.jome' && t !== 'punctuation.definition.args.begin.jome' &&
           t !== 'punctuation.definition.args.end.jome' && t !== 'entity.name.type.interface.jome'
  })
  let list = parseList(children)
  list.forEach(arr => {
    let child = arr[0]
    if (child.type.startsWith('support.type.property-name.parameter')) {
      let value = child.text().slice(0, -1) // remove the ? or !
      if (insideClassFunction) {
        ctx.addBinding(value, {type: 'prop'})
      } else {
        ctx.addBinding(value, {type: 'parameter'})
      }
      ctx.paramsIsClassVariable = insideClassFunction
      hasParams = true
      if (arr[1] && arr[1].type === 'keyword.operator.assignment.jome') {
        paramsValues[value] = compileToken(arr[2], ctx)
      }

    } else if (child.type === 'support.type.property-name.attribute.jome') {
      let value = child.text().slice(1)
      ctx.addBinding(value, {type: 'attribute-argument'})
      args[value] = {type: 'attribute-argument'}

    } else if (child.type.startsWith('support.type.property-name.attribute')) {
      let value = child.text().slice(1, -1) // remove the ? or !
      ctx.addBinding(value, {type: 'attribute-parameter'})
      ctx.paramsIsClassVariable = insideClassFunction
      hasParams = true
      if (arr[1] && arr[1].type === 'keyword.operator.assignment.jome') {
        paramsValues[value] = compileToken(arr[2], ctx)
      }
      attrParams.push(value)

    } else if (child.type === 'variable.other.jome' || child.type === 'variable.parameter.jome') {
      let value = child.text()
      let type = insideClassFunction ? 'argument-class-function' : 'argument'
      ctx.addBinding(value, {type})
      args[value] = {type}

    } else if (child.type === 'entity.name.type.interface-ref.jome') {
      let name = child.text().slice(1)
      let inter = ctx.interfaces[name]
      args = {...args, ...inter.args}
      hasParams = hasParams || inter.hasParams
      attrParams = [...attrParams, ...inter.attrParams]
      paramsValues = {...paramsValues, ...inter.paramsValues}
    }
  })
  let argNames = Object.keys(args)
  argNames = hasParams ? [insideClassFunction ? '__props__' : '__params__', ...argNames] : argNames
  return {result: `(${argNames.join(', ')})`, args, paramsValues, hasParams, attrParams}
}

function compileFunctionArgs(node, ctx) {
  return compileFunctionArgsDetailed(node, ctx).result
}

// Used inside the context of a class
function compileDictValOrMethod(arr, ctx, key) {
  let r = '', r0 = '()', r1
  if (arr[0].type === 'meta.function.jome') {
    r0 = compileFunctionArgs(arr[0], ctx)
  }
  if (arr[0].type === 'meta.function.jome' || arr[0].type === 'keyword.arrow.jome') {
    r = r0+' '+jsBlock(arr[1], ctx, key !== 'constructor')
    return r
  }
  return ' = '+compileJsBlock(arr, ctx)
}

function buildDictV2ParseKeys(dict, arr, ctx, func) {
  let list = parseList(arr)
  list.forEach(nested => {
    // FIXME: Repeated above
    if (nested[0].type === 'variable.dict-symbol.jome') {
      let key = nested[0].text().slice(1) // remove the colon
      dict[key] = key
    } else if (nested[0].type !== 'meta.dictionary-key.jome') {
      return console.error('Error processing expected meta.dictionary-key.jome inside meta.block.jome but was', nested[0].type)
    } else {
      let key = nested[0].children[0].text()
      dict[key] = func(nested.slice(1), ctx, key)
    }
  })
  return dict
}

function buildDictV2(topLevelNodes, ctx, func) {
  let dict = {}
  //for (let i = 0; i < list.length; i++) {
    //let j = list.slice(i).findIndex(e => e.type === 'newline')
  topLevelNodes.forEach(node => {
    let arr = filterStrings(node.array)
    let i = arr[0].type === 'punctuation.whitespace.indent.jome' ? 1 : 0
    if (!arr[i]) {return;}
    //if (arr[0].type === 'newline') {return;}
    if (arr[i].type === 'variable.dict-symbol.jome') {
      dict = buildDictV2ParseKeys(dict, arr, ctx, func)
    } else if (arr[i].type !== 'meta.dictionary-key.jome') {
      return console.error('Error processing expected meta.dictionary-key.jome inside meta.block.jome but was', arr[i].type)
    } else {
      let value;
      let key = arr[i].children[0].text()
      if (key === 'super') { // FIXME: only if inside class block
        ctx.superClass = {key, array: arr.slice(i+1)}

      } else if (arr[i+1].type === 'entity.name.type.jome-obj.jome') {
        //value = _compileJomeObj(_buildJomeObjs([{array: arr.slice(i+1), children: node.children}], ctx)[0], ctx)
        value = compileNode(_buildJomeObjs([{array: arr.slice(i+1), children: [/* FIXME */]}], ctx)[0], ctx)
        dict[key] = value
      } else {
        dict = buildDictV2ParseKeys(dict, arr, ctx, func)
      }
    }
  })
  return dict
}

function compileNode(obj, ctx) {
  return _compileNode(obj, ctx).result
}

function _compileNode(obj, ctx, nested = false) {
  let {type, attrs, meta, args, children, funcCalls, stateVars, key, stateVariables} = obj
  let s1 = type ? `new ${type}${args}` : compileJsObj(attrs)
  let hasStateVariable = stateVariables.length
  if (hasStateVariable) {
    s1 = '(__state__) => ('+s1+')'
  }
  // If it is not a node
  if (!children.length && !funcCalls.length && !Object.keys(stateVars).length && !key && !hasStateVariable) {
    return {isNode: false, result: s1}
  }
  let r = `${JOME_LIB}(${s1})`
  stateVariables.forEach(depencency => {
    r += '\n  .addStateVarDep("'+depencency+'")'
  })
  if (ctx.currentObjPath) {
    r += `\n  .setParent(${ctx.currentObjPath})`
  }
  Object.keys(stateVars).forEach(stateVarName => {
    r += `\n  .initStateVar(${ctx.currentVariableAssignment}, "${stateVarName}", ${stateVars[stateVarName]})`
  })
  if (children.length) {
    r += children.map(c => {
      let childCompiled = _compileNode(c, ctx, true)
      if (childCompiled.isNode) {
        return `\n  .addChildBuilder(`+childCompiled.result+')'
      } else {
        return `\n  .addChild(`+childCompiled.result+')'
      }
    }).join('')
  }
  if (funcCalls.length) {
    let chained = funcCalls.slice(0,-1)
    if (chained.length) {
      r += chained.map(call => `\n  .call(o => o.${call})`).join('')
    }
  }
  if (!nested) {
    r += '\n  .node()'
  }
  if (funcCalls.length) {
    r += `\n  .${funcCalls[funcCalls.length-1]}`
  }
  return {isNode: true, result: (key ? `"${key}", ${r}` : r)}
}

function buildJomeObjs(node, ctx) {
  let list = node.children.slice(1, -1)
  let nodes = parseIndent(list)
  ctx.tutor = null
  return _buildJomeObjs(nodes, ctx)
}

class IndentNode {
  constructor(indent, array) {
    this.indent = indent
    this.array = array
    this.children = []
    this.parent = null
  }
}

function parseIndent(list, ctx) {
  let nodes = []
  let stack = []
  let indent = 0;
  for (let i = 0; i < list.length; i++) {
    let c = list[i]
    let n = list[i+1]
    if (!c.type) {continue; /* Was only spaces, FIXME */}
    if (c.type === 'newline') {
      if (n && n.type === 'punctuation.whitespace.indent.jome') {
        indent = n.text().length
        i++;
      } else {
        indent = 0;
      }
    } else if (c.type === 'punctuation.whitespace.indent.jome') {
      // Ignore punctuation that is not preceded by a newline.
      indent = 0
    } else if (c.type.startsWith('comment')) {
      // ignore
    } else {
      let j = list.slice(i).findIndex(e => e.type === 'newline')
      let arr = (j === -1) ? list.slice(i) : list.slice(i, i+j)
      i = (j === -1) ? list.length - 1 : i+j-1
      let node = new IndentNode(indent, arr)
      while (stack.length && (stack[stack.length-1].indent) >= indent) {
        stack.pop(); // Pop out nodes until indentation level matches
      }
      if (!stack.length) {
        nodes.push(node)
      } else {
        let current = stack[stack.length-1]
        current.children.push(node)
        node.parent = current
      }
      stack.push(node)
      indent = 0
    }
  }
  return nodes
}

function compileFunctionCallArgs(array, functionName, ctx) {
  let hasParams = false
  let binding = functionName ? ctx.getBinding(functionName) : null
  if (binding && binding.type === 'class_name') {
    let klass = ctx.classes[functionName]
    if (klass?.constructorDetails?.hasParams) {
      hasParams = true
    }
  } else if (binding && binding.type === 'named-import') {
    hasParams = true // FIXMEEEEEEEEEEEEEE: Somehow check the named imports to see if they take params or not.
  }
  let args = parseList(array, ctx)
  let actualArgs = []
  let params = {}
  args.forEach(array => {
    if (array[1]?.type === 'keyword.operator.colon.jome') {
      let name = array[0].text()
      params[name] = compileJsBlock(array.slice(2), ctx)
    } else if (array[0]?.type === 'meta.dictionary-key.jome') {
      let name = array[0].children[0].text()
      params[name] = compileJsBlock(array.slice(1), ctx)
    } else {
      actualArgs.push(compileJsBlock(array, ctx))
    }
  })
  if (Object.keys(params).length) {
    actualArgs = [compileJsObj(params), ...actualArgs]
  } else if (hasParams) {
    actualArgs = ['{}', ...actualArgs]
  }
  return `(${actualArgs.join(', ')})`
}

// Return a list of array
function parseList(list, ctx) {
  // Remove spaces
  // Split on 
  let results = []
  let current = []
  for (let i = 0; i < list.length; i++) {
    if (typeof list[i] === 'string') {continue;} // Ignore spaces
    if (list[i].type === 'punctuation.separator.delimiter.jome' || list[i].type === 'newline') {
      if (current.length) { // How to handle funcCall(x,,,,y) ???
        results.push(current)
      }
      current = []
    } else {
      current.push(list[i])
    }
  }
  if (current.length) {
    results.push(current)
  }
  return results
}

export function compileInterpolate(str, ctx, escSeqBeg = '${', escSeqEnd = '}') {
  // FIXME: This is a simplify method that does not allow "%>" to be for example inside a string
  // FIXME: <html><%= "%>" %></html> // DOES NOT WORK
  // A proper solution would be to have all the tmLanguage files to tokenize properly, and inject
  // into the grammar files my interpolation tag.
  // But this does not fix the problem that syntax highlighting does not work...
  // So keep it simple for now

  // One part of the solution I think is to tokenize and check that if all the groups were close
  // In order to handle <% if (true) ( %> Blah blah <% ) %>
  // TODO: Checker comment ils font dans eta.js

  return str.replace(/<%=((.|\n)*?)%>/g, (match, group) => {
    let raw = group.trim()
    let out = compileGetContext(raw, ctx, true)
    return escSeqBeg+out.result.trim()+escSeqEnd
  });
}

// function variableNameForPath(name, ctx) {
//   let s = name.split('/')
//   let root =  '$'+s[0]
//   ctx.declareVariable(root)
//   return '$'+s.join('.$.$')
// }

function parseScriptTagArgs(node) {
  let args = {}
  filterSpaces(node.children.slice(1,-1)).forEach(child => {
    if (child.type === 'entity.other.attribute-name.jome') {
      let n = child.text()
      args[n] = null // FIXME: try true
    } else if (child.type === 'meta.script-param-assign.jome') {
      let n = child.children[0].text()
      args[n] = child.children[2].text().slice(1, -1) // remove quotes
    } else {
      throw new Error("Error 965047124965")
    }
  })
  return args
}

// Takes a relative path and make it relative to what? I'm confused...
// FIXME: forRequire...............................
// I have a bug and this is an ugly tmp fix
function getRelativePath(relPath, ctx, forRequire) {
  if (relPath[0] !== '.') {return relPath} // It is not a relative path
  let curFolder = path.dirname(ctx.currentFile)
  // FIXME: Ugly as ****
  if (curFolder[0] !== '/') {
    return './'+path.join(curFolder, relPath)
  } else if (forRequire) {
    let rel = ctx.currentFile.slice(ctx.rootDir.length+1) // FIXME: +1 for slash
    let relDir = path.dirname(rel)
    if (relDir && relDir !== '.') {
      return './' + path.join(relDir, relPath)
    }
  }
  return relPath
}

export function escapeBackticks(inputString) {
  return inputString.replace(/`/g, '\u005c`').replace(/\$\{/g, '\u005c\$\{')
}

// keyword can be 'var', 'def' or null (null means const)
function assignVariable(node, ctx, keyword) {
  let value = node.text()
  if (value.startsWith('$')) {
    let next = node.captureNext() // The = sign (keyword.operator.assignment.compound.jome)
    next = next.captureNext()
    return 'process.env.'+value.slice(1)+' = '+compileToken(next, ctx)
  }
  let outKeyword = ''
  let isAssignment = node.type === 'variable.assignment.jome'
  if (keyword === 'var') {
    // TODO: Check if already defined inside the SAME scope, throw an Error if so
    ctx.addBinding(value, {type: 'variable'})
    outKeyword = 'var '
  } else if (keyword === 'def') {
    // TODO: Check if already defined inside the SAME scope, throw an Error if so
    ctx.addBinding(value, {type: 'definition'})
    outKeyword = 'const '
  } else {
    if (ctx.hasBinding(value)) {
      if (!isAssignment) {
        throw new Error('Variable was already declared previously', value)
      }
    } else {
      outKeyword = 'var '
      ctx.addBinding(value, {type: 'global-constant'})
    }
  }
  if (node.type === 'variable.other.jome') {
    return outKeyword+value+';'
  }
  let next = node.captureNext() // The = sign (keyword.operator.assignment.compound.jome)
  next = next.captureNext()
  if (next.type === 'keyword.arrow.jome' && next.text() === ' -> ') {
    // TODO: Check if already defined inside the SAME scope, throw an Error if so
    let func = next.captureNext()
    return `function ${value}() ${jsBlock(func, ctx, true)}`
  }
  ctx.currentVariableAssignment = value
  let result = outKeyword+value+' = '+compileToken(next, ctx)
  ctx.currentVariableAssignment = null
  return result
}

function buildBlock(node, ctx, func) {
  let list = filterSpaces(node.children.slice(1, -1))
  let topLevelNodes = parseIndent(list)
  let topsIsKey = topLevelNodes.map(n => {
    let t = n.array[0].type
    return t === 'meta.dictionary-key.jome' || t === 'variable.dict-symbol.jome'
  })
  // If all top level nodes are keys or symbols, then it is an object
  if (topsIsKey.every(b => b)) {
    return buildDictV2(topLevelNodes, ctx, func)

  // If any top level nodes are keys, then it is an error
  } else if (topsIsKey.some(b => b)) {
    throw new Error("You cannot combine an object with something else inside a block.")
  } else {
    return topLevelNodes.map(top => {
      if (top.array[0].type === 'entity.name.type.jome-obj.jome') {
        return compileNode(_buildJomeObjs([top], ctx)[0], ctx)

      } else if (top.array[0].type === 'entity.name.function.jome') { // Func call
        let name = top.array[0].text()
        if (top.array[1].type === 'expression.group') {
          return name+compileToken(top.array[1], ctx)
        } else {
          return name+'('+compileFunctionCallArgs(top.array.slice(1), name, ctx)+')'
        }
      } else {
        let list = parseList(top.array, ctx)
        if (list.length > 1) {
          return '['+list.map(e => compileJsBlock(e, ctx)).join(', ')+']'
        } else {
          return compileJsBlock(list[0], ctx)
        }
      }
    })
  }
}

function compileBlock(node, ctx) {
  let built = buildBlock(node, ctx, (arr) => compileJsBlock(arr, ctx))
  if (Array.isArray(built)) {
    if (built.length === 1) {
      return built[0]
    } else {
      return '[\n  '+built.join(',\n  ')+'\n]'
    }
  } else if (typeof built === 'object') {
    return compileJsObj(built)  
  }
}

// Using an hashmap here because it is easier to debug,
// a bunch of if else if else is annoying to go through step by step
// and switch case is really annoying because it does not scope the variables
const PROCESSES = {
  "newline": () => "\n",
  // The whole source code
  "source.jome": (node, ctx) => compileScope(node, node.children, ctx),
  "meta.statement.require.jome": (node, ctx) => {
    let list = filterSpaces(node.children).slice(1) // remove require keyword
    let varName = list[0].text()
    let filePath = getRelativePath(list[2].children[1], ctx, true)
    let before = ctx.currentFile
    ctx.currentFile = filePath
    let data
    try {
      let raw = fs.readFileSync(filePath, 'utf8');
      let root = tokenize(raw)
      data = jsBlock(root, ctx, true)
      //data = compileGetContext(raw, ctx).result
      ctx.addBinding(varName, {type: 'require-variable'})
    } catch (err) {
      console.error("Error trying to require file.")
      throw err
    }
    ctx.currentFile = before
    return 'let '+varName+` = ((__params__ = {}) => ${data})`
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
  "meta.statement.import.jome": (node, ctx) => {
    let file;
    let defaultImport = ''
    let namedImports = []
    let list = filterStrings(node.children.slice(1)) // remove import keyword
    list.forEach(item => {
      if (item.type === 'meta.named-imports.jome') {
        filterSpaces(item.children.slice(1, -1)).forEach(imp => {
          if (imp.type === 'variable.other.named-import.jome') {
            let name = imp.text()
            namedImports.push(name)
            ctx.addBinding(name, {type: 'named-import'})
          } else if (imp.type === 'meta.import-alias.jome') {
            throw new Error("TODO: import {foo as bar} syntax")
          }
        })
      } else if (item.type === 'meta.import-file.jome') {
        let cs = filterSpaces(item.children)
        file = cs[cs.length-1].text().slice(1,-1)
      } else if (item.type === 'variable.other.default-import.jome') {
        defaultImport = item.text().trim()
        ctx.addBinding(defaultImport, {type: 'default-import'})
      } else {
        throw new Error("Error 234j90s7adfg1")
      }
    })

    let relPath = getRelativePath(file, ctx)
    let ext = path.extname(relPath)
    if (ext === '.jome') {
      ctx.dependencies.push(relPath)
      relPath = relPath.slice(0, relPath.length-4)+"built.js"
    }
    ctx.imports[relPath] = {
      default: defaultImport,
      namedImports
    }
    return ''
  },
  "keyword.control.declaration.jome": (node, ctx) => {
    let keyword = node.text()
    let next = node.captureNext()
    if (next.type !== 'variable.assignment.jome' && next.type !== 'variable.other.jome') {
      throw new Error('Error bnjs98124u9sdb92')
    }
    return assignVariable(next, ctx, keyword)
  },
  // fooBar =
  "variable.assignment.jome": (node, ctx) => {
    return assignVariable(node, ctx)
  },
  // @name => this.name
  "support.type.property-name.attribute.jome": (node, ctx) => {
    let r = node.text().slice(1)
    return r.length ? `this.${r}` : 'this'
  },
  // <>1+1</>
  // "meta.embedded.block.css": (node, ctx) => {
  //   let args = parseScriptTagArgs(node.children[0])
  //   let raw = compileRaw(node.children.slice(1,-1))
  //   let out = args.out || '__main__'
  //   ctx.stylesheets[out] = (ctx.stylesheets[out] || '') + raw
  // },
  "meta.embedded.block.css": (node, ctx) => '`'+compileRaw(node.children.slice(1,-1))+'`',
  "meta.embedded.block.javascript": (node, ctx) => compileRaw(node.children.slice(1,-1)),
  "meta.embedded.block.markdown": compileMarkdown,
  "meta.embedded.block.html": (node, ctx) => {
    let args = parseScriptTagArgs(node.children[0])
    let b = ''
    let a = ''
    if ('root' in args) {
      b = '<!DOCTYPE html>\n<html>'
      a = '</html>'
    }
    return '`'+b+compileInterpolate(compileRaw(node.children.slice(1,-1)), ctx)+a+'`'
  },
  "meta.embedded.block.shell": (node, ctx) => {
    let raw = compileRaw(node.children.slice(1,-1))
    ctx.imports['child_process'] = {namedImports: ['execSync']}
    return "execSync(`"+escapeBackticks(raw)+"`);"
  },
  // fooBar
  "variable.other.jome": (node, ctx) => {
    let value = node.text()
    let binding = ctx.getBinding(value)
    if (!binding) {
      console.error('Error unkown variable', value)
      return ''
    }
    if (binding.type === 'parameter') {
      return (ctx.paramsIsClassVariable ? 'this.' : '')+'__params__.'+value
      //return (ctx.paramsIsClassVariable ? 'this.__props__' : '__params__')+'__params__.'+value
    } else if (binding.type === 'prop') {
      return (ctx.paramsIsClassVariable ? 'this.' : '')+'__props__.'+value
    } else if (binding.type === 'argument-class-function' && !ctx.isInsideClassSuperObject) {
      return 'this.'+value
    } else if (binding.type === 'require-variable') {
      return value+'()'
    }
    return value
  },
  // fooBar(...)
  "support.function-call.jome": (node, ctx) => {
    let i = 0;
    if (node.children[0].type === 'punctuation.dot.jome') {
      i = 1
    }
    let name = node.children[i].text()
    let result = `${i === 1 ? '.' : ''}${name}${compileFunctionCallArgs(node.children.slice(2+i, -1), name, ctx)}`
    return result
  },
  // =>
  "keyword.arrow.jome": (node, ctx) => {
    let arrow = node.text()
    let next = node.captureNext()
    if (arrow === '=>') {
      return `() => ${jsBlock(next, ctx, true)}`
    } else if (arrow === ' -> ') {
      return `function() ${jsBlock(next, ctx, true)}`
    } else {
      throw new Error("Error 5601293567")
    }
  },
  // arg1 =>
  // |arg1, arg2| =>
  "meta.function.jome": (node, ctx) => {
    let arrow = node.children[node.children.length-1].text()
    let next = node.captureNext()
    let args = compileFunctionArgs(node, ctx)
    if (arrow === '=>') {
      return `${args} => ${jsBlock(next, ctx, true)}`
    } else if (arrow === ' -> ') {
      return `function${args} ${jsBlock(next, ctx, true)}`
    } else {
      throw new Error("Error 982349614921")
    }
  },
  // (fooBar + 1)
  "expression.group": (node, ctx) => { // TODO: Rename expression.group. Maybe meta.parenthesis.jome?
    return `(${compileJsBlock(node.children.slice(1, -1), ctx)})`
  },
  // {x: 20, y: 30}
  "meta.block.jome": compileBlock,
  // fooBar.x
  "meta.getter.jome": (node, ctx) => {
    let prev = compileToken(node.prev(), ctx)
    return prev+'.'+compileRaw(node.children[1], ctx)
  },
  // [10, 20]
  // fooBar[10]
  // fooBar["hello"]
  // [10, 20][0]
  "meta.square-bracket.jome": (node, ctx) => {
    let list = parseList(node.children.slice(1,-1))
    if (list.length === 1) {
      let prev = node.prev()
      let t = prev?.type
      if (t && (t.startsWith('variable') || t === 'meta.square-bracket.jome')) {
        // Check if it is an accessor like fooBar[10], check for fooBar[-1]
        let val = compileJsBlock(list[0], ctx)
        if (/^-\d+$/.test(val.replaceAll(/ /g, ''))) {
          return '.slice('+val+')[0]'
        }
        return '['+val+']'
      } else if (t === 'keyword.operator.colon.jome') {
      } else {
        // TODO: List all the types so I am sure I am not missing any cases
        console.warn('Warning 95412')
      }
    }
    return '['+list.map(e => compileJsBlock(e, ctx)).join(', ')+']'
    // let prev = node.prev()
    // let before = prev ? compileNode(prev, ctx) : ''
    // let list = parseList(node.children.slice(1,-1))
    // return before+'['+list.map(e => compileBlock(e, ctx)).join(', ')+']'
  },
  "keyword.operator.colon.jome": () => ' : ',
  "keyword.operator.existential.jome": () => ' ? ',
  // ->keys
  "meta.arrow-getter.jome": (node, ctx) => {
    let val = node.children[1].text()
    let prev = compileToken(node.prev(), ctx)
    switch (val) {
      case 'keys': case 'values': case 'entries':
        return `Object.${val}(${prev} || {})`
      case 'props':
        //return ctx.isInsideClassSuperObject ? `__params__` : `this.__params__`
        //return `${JOME_LIB}.props(${prev})`
        return `${prev}.__props__`
      case 'params':
        return `${JOME_LIB}.params(${prev})`
      case 'hasOwnProperty':
      case 'path': // Good?
      case 'name':
      case 'signals':
        return `${prev}?.${JOME_ATTRS}?.${val}`
      case 'children':
        return `(${prev}.$?.children||[])`
      case 'removeChildren':
        return `(() => {${prev}.${JOME_ATTRS}.children = []})`
      default: throw "FIXME arrow getter not implemented yet: " + val
    }
  },
  // true, vrai, ...
  "constant.language.jome": (node, ctx) => {
    switch (node.text()) {
      case 'true': case 'vrai': return 'true'
      case 'false': case 'faux': return 'false'
      case 'null': case 'nul': return 'null'
      case 'undefined': case 'indéfini': return 'undefined'
      case 'on': case 'marche': return 'true'
      case 'yes': case 'oui': return 'true'
      case 'off': case 'arrêt': return 'false'
      case 'no': case 'non': return 'false'
      default: throw new Error("FIXME constant: " + node.text())
    }
  },
  // #PI, #sin, #params, ...
  "variable.other.constant.jome": (node, ctx) => {
    switch (node.text().slice(1)) {
      case 'PI': return 'Math.PI'
      case 'params': return '__params__'
      default: throw new Error("FIXME hashtag constant: " + node.text())
    }
  },
  // $ENV_VAR
  "variable.other.environment.jome": (node, ctx) => {
    return 'process.env.'+node.text().slice(1)
  },
  // 10g
  "meta.number-with-unit.jome": (node, ctx) => {
    let nb = node.children[0].text()
    let unit = node.children[1].text()
    return nb
  },
  // interface SomeInterface
  "meta.interface.jome": (node, ctx) => {
    let l0 = filterSpaces(node.children)
    let name = l0[1].text()
    ctx.interfaces[name] = compileFunctionArgsDetailed(node, ctx)
    // let args = l0.slice(3, -1)
    // let list = parseList(args, ctx)
    // list.forEach(el => {
    //   if (el.type === 'variable.other.jome') {
    //   } else if (el.type === 'support.type.property-name.parameter.optional.jome') {
    //   }
    // })
    return ''
  },
  // class SomeType
  "meta.class.jome": (node, ctx) => {
    // if (node.children[0].type !== 'storage.type.class.jome') {
    //   return console.error('Error processing expected storage.type.class.jome inside meta.class.jome but was', node.children[0].type)
    // }
    let name = node.children[2].text()
    ctx.addBinding(name, {type: 'class_name'})
    let methods = {}
    let next = node.next()
    let extension = ''
    let constructorLines = []
    let constructorArgs = '()'
    let constructor = ''
    let constructorDetails
    ctx.nest(() => {
      if (next?.type === 'meta.function.jome') {
        constructorDetails = compileFunctionArgsDetailed(next, ctx, true)
        constructorLines = Object.keys(constructorDetails.args).map(arg => {
          return `this.${arg} = ${arg}`
        })
        if (constructorDetails.hasParams) {
          if (Object.keys(constructorDetails.paramsValues).length) {
            constructorLines.push(`this.__props__ = {...${compileJsObj(constructorDetails.paramsValues)}, ...__props__}`)
          } else {
            constructorLines.push(`this.__props__ = __props__`)
          }
        }
        if (constructorDetails.attrParams && constructorDetails.attrParams.length) {
          // constructorLines.push(`let {${constructorDetails.attrParams.join(', ')}, ...__params__} = __props__`)
          constructorDetails.attrParams.forEach(attr => {
            // constructorLines.push(`this.${attr} = ${attr}`)
            constructorLines.push(`this.${attr} = __props__.${attr}`)
          })
          // constructorLines.push(`this.__params__ = __params__`)
        // } else if (constructorDetails.hasParams) {
        //   constructorLines.push(`this.__params__ = __props__`)
        }
        constructorArgs = constructorDetails.result
        next.captured = true
        next = next.next()
      } else if (next?.type === 'keyword.arrow.jome') {
        next.captured = true
        next = next.next()
      }
      if (next?.type === 'meta.standalone-obj.jome') {
        ctx.isInsideClassSuperObject = true
        let objs = buildJomeObjs(next, ctx) // remove '«' and '»'
        if (objs.length !== 1) {
          console.error('A standalone object given to class should contain one and only one object')
        }
        ctx.isInsideClassSuperObject = false
        let obj = objs[0]
        if (obj.type) {
          extension = ` extends ${obj.type}`
          let line = `super${obj.args}`
          constructorLines = [line, ...constructorLines]
        } else {
          console.error('A standalone object given to class should have a type')
        }
        next.captured = true
        next = next.next()
      }
      if (next?.type === 'meta.block.jome') {
        methods = {...methods, ...buildBlock(next, ctx, compileDictValOrMethod)}
        next.captured = true
      }
      if (ctx.superClass) {
        extension = ` extends ${ctx.superClass.array[0].text()}`
        ctx.isInsideClassSuperObject = true
        let line = `super${compileFunctionCallArgs(ctx.superClass.array.slice(1), null, ctx)}`
        ctx.isInsideClassSuperObject = false
        constructorLines = [line, ...constructorLines]
        ctx.superClass = null
      }
      if (constructorLines.length) {
        if (methods.hasOwnProperty('constructor')) {
          let lines = methods['constructor'].slice(4, -1).split('\n').map(e => e.trim())
          constructorLines = [...constructorLines, ...lines]
          delete methods['constructor']
        }
        constructor = '\n  constructor'+constructorArgs+' '+jsBlock(constructorLines.join('\n'+'  '.repeat(ctx.depth+1)), ctx)
      }
    })
    ctx.classes[name] = {name, methods, constructorDetails}
    return `class ${name}${extension} {${constructor}
  ${Object.keys(methods).map(key => {
    return `${compileName(key)}${methods[key]}`
  }).join('\n  ')}
}\n\n`
  },
  "variable.other.state-var.jome": (node, ctx) => {
    let name = node.text().slice(1)
    ctx.stateVariables.push(name)
    return `__state__.${name}`
  },
  "keyword.control.conditional.else.jome": (node, ctx) => {
    let val = node.captureNext()
    return ` else ${jsBlock(val, ctx)}`
  },
  "keyword.control.conditional.jome": (node, ctx) => {
    let cond = node.captureNext()
    let val = cond.captureNext()
    let label
    switch (node.text().trimLeft()) {
      case "if": case "si": label = 'if'; break;
      case "elseif": case "elsif": case "sinon si": case "else if": label = ' else if'; break;
      default: throw new Error('Error 84023')
    }
    return `${label} ${compileToken(cond, ctx)} ${jsBlock(val, ctx)}`
  },
  "keyword.control.main.jome": () => "export default ",
  "punctuation.separator.delimiter.jome": () => ', ',
  "punctuation.terminator.statement.jome": () => ';',
  "keyword.operator.jome": (node, ctx) => (
    node.text() === '^' ? ' ** ' : compileWithSpaces(node, ctx)
  ),
  "keyword.operator.typeof.jome": compileWithSpaces,
  "keyword.operator.logical.jome": compileWithSpaces,
  "keyword.operator.assignment.jome": compileWithSpaces,
  "keyword.operator.comparison.jome": compileWithSpaces,
  "keyword.operator.assignment.compound.jome": compileWithSpaces,
  "support.variable.jome": (node, ctx) => {
    let name = node.text()
    if (name === '__dirname') {
      ctx.imports['path'] = {default: 'path'}
      ctx.imports['url'] = {namedImports: ['fileURLToPath']}
      ctx.usesDirname = true
    } else if (name === '__filename') {
      ctx.imports['url'] = {namedImports: ['fileURLToPath']}
      ctx.usesFilename = true
    }
    return name
  },
  "support.class.jome": compileAsIs,
  "constant.numeric.integer.jome": compileAsIs,
  "constant.numeric.float.jome": compileAsIs,
  "comment.line.double-slash.jome": () => '',
  "comment.block.jome": () => '',
  "comment.block.documentation.jome": () => '',
  "string.quoted.backtick.verbatim.jome": (node) => `\`${compileRaw(node.children.slice(1,-1))}\``,
  "string.quoted.double.verbatim.jome": (node) => `"${compileRaw(node.children.slice(1,-1))}"`,
  "string.quoted.single.jome": (node) => `'${compileRaw(node.children.slice(1,-1))}'`,
  "string.quoted.double.jome": (node) => `"${compileRaw(node.children.slice(1,-1))}"`,
  "string.quoted.backtick.jome": (node, ctx) => {
    return '`'+node.children.slice(1,-1).map(
      c => typeof c === 'string' ? c : '${'+compileJsBlock(c.children.slice(1,-1), ctx)+'}'
    ).join('')+'`'
  },
  "keyword.control.jome": (node, ctx) => {
    let word = node.text()
    if (word === 'ret' || word === 'return' || word === 'retourne') {
      return 'return '
    } else if (word === 'export') {
      return 'export '
    } else if (word === 'await') {
      return 'await '
    } else if (word === 'import') {
      return 'import '
    } else if (word === 'async') {
      return 'async '
    }
    console.error('Error 745912')
  }
}

function compileToken(tok, context) {
  if (typeof tok === 'string') {return tok}
  let process = PROCESSES[tok.type]
  let result;
  if (process) {
    result = process ? (process(tok, context) || '') : ''
  } else {
    console.warn("Don't know how to process type", tok.type, "at line", tok.lineNb)
    result = ''
  }
  return result
}

function compileHeaders(ctx) {
  let r = ctx.headers.join('\n')+'\n'
  Object.keys(ctx.imports).forEach(fileName => {
    let imp = ctx.imports[fileName]
    r += `import ${imp.default||''}${(imp.namedImports||[]).length ? `{${imp.namedImports.join(', ')}}`:''} from "${fileName}";\n`
  })
  if (ctx.usesDirname) {
    // FIXME: don't import path and fileURLToPath multiple times...
    r += `
let __filename = fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)
    `
  } else if (ctx.usesFilename) {
    // FIXME: don't import path and fileURLToPath multiple times...
    r += `
__filename = fileURLToPath(import.meta.url)
    `
  }
  return r
}

export function compile(text) {
  return compileGetContext(text).result
}

export function compileGetContext(text, ctx, isNested = false) {
  let root = tokenize(text)
  analyze(root)
  let context = ctx || new CompileContext()
  // console.log('tokenized:', root.print())
  let r1 = compileToken(root, context)
  let r0 = isNested ? '' : compileHeaders(context)
  return {result: r0 + r1, context}
}