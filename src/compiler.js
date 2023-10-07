import { POST_PROCESSES, tokenize } from './tokenizer.js'
import { CompileContext } from './compile_context.js'

const JOME_LIB = 'jome'
const JOME_ROOT = '$'
const JOME_ATTRS = '$'

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

function compileRaw(node) {
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
  ctx.depth += 1
  let r = `{\n${'  '.repeat(ctx.depth)}`
  if (node.type === 'expression.group') {
    r += compileScope(node, node.children.slice(1,-1), ctx, addReturnStatement)
  } else {
    r += (addReturnStatement ? 'return ' : '')+compileNode(node, ctx)
  }
  ctx.depth -= 1
  r += `\n${'  '.repeat(ctx.depth)}}`
  return r
}

function compileScope(node, array, ctx, addReturnStatement = false) {
  let prev = ctx.currentScopeNode
  ctx.currentScopeNode = node
  node.declarations = new Set()
  let r = compileBlock(array, ctx, addReturnStatement)
  if (node.declarations.size) {
    return 'var '+Array.from(node.declarations).join(', ')+'\n'+r
  }
  ctx.currentScopeNode = prev
  return r
}

function filterSpaces(array) {
  return array.filter(e => !/^\s*$/.test(e)) // filter spaces
}

function compileBlock(array, ctx, addReturnStatement = false) {
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
        let r1 = compileNode(array[i], ctx)
        if (r1 && r1.length) {r.push(r1)}
      }
    }
  }
  if (addReturnStatement) {
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

// Ugly implementation, it's because of inside _printJomeObj, I want to print children directly as a string
function compileJsObj(obj) {
  let v = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      return `{${Object.keys(value).map(v => {
        let val = typeof value[v] === 'function' ? `${key}: [func]` : value[v]
        //val = typeof value[v] === 'string' ? `'${val}'` : val
        return `${v}: ${val}`
      }).join(', ')}}`
    // } else if (typeof value === 'string') {
    //   return "'"+value+"'"
    }
    return value;
  });
  return v.slice(1, v.length-1).replace(/\\n/g, '\n')
}

function _buildJomeObjs(nodes, ctx, isRoot = true) {
  let result = []
  nodes.forEach(node => {
    // if (tok.type === 'meta.jome-obj.jome') {
    let attrs = {}
    let meta = {}
    let argTokens = []
    let type
    node.array.forEach(part => {
      if (part.type === 'entity.name.tag.jome-obj.jome') {
        meta.name = `'${part.text().slice(1)}'`
      } else if (part.type === 'entity.name.type.jome-obj.jome') {
        type = part.text()
      } else if (part.type === 'keyword.control.tutor.jome') {
        // Ignore handled elsewhere
      //} else if (part.type && !part.type.startsWith('punctuation')) {
      } else {
        argTokens.push(part)
      }
    })
    let args = compileFunctionCallArgs(argTokens, ctx)
    let childrenNodes = []
    node.children.forEach(child => {
      let tok = child.array[0]
      if (tok.type === 'keyword.control.tutor.jome') {
        ctx.tutor = meta.name
      } else {
        childrenNodes.push(child)
      }
    })
    let children = childrenNodes.length ? _buildJomeObjs(childrenNodes, ctx, false) : []
    if (isRoot && ctx.tutor) {
      meta.tutorPath = ctx.tutor
    }
    if (type || Object.keys(meta).length) {
      result.push({type, args, attrs, meta, children})
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
  if (!node.type === 'meta.function.jome') {
    throw new Error('Error 6927')
  }
  //let args = cutGroup(node.children, 'punctuation.definition.array.begin.jome', 'punctuation.definition.array.end.jome', 'punctuation.separator.delimiter.jome')
  let hasParams = false
  let args = {}
  let paramsValues = {}
  let children = filterSpaces(node.children).filter(child => {
    let t = child.type
    return t !== 'keyword.arrow.jome' && t !== 'punctuation.definition.args.begin.jome' && t !== 'punctuation.definition.args.end.jome'
  })
  let list = parseList(children)
  list.forEach(arr => {
    let child = arr[0]
    if (child.type === 'support.type.property-name.parameter.jome') {
      let value = child.text().slice(1) // remove the ampersand
      ctx.addBinding(value, {type: 'parameter'})
      ctx.paramsIsClassVariable = insideClassFunction
      hasParams = true
      if (arr[1] && arr[1].type === 'keyword.operator.assignment.jome') {
        paramsValues[value] = compileNode(arr[2], ctx)
      }
    } else if (child.type === 'support.type.property-name.attribute.jome') {
      let value = child.text().slice(1)
      ctx.addBinding(value, {type: 'attribute-argument'})
      args[value] = {type: 'attribute-argument'}
    } else if (child.type === 'variable.other.jome' || child.type === 'variable.parameter.jome') {
      let value = child.text()
      let type = insideClassFunction ? 'argument-class-function' : 'argument'
      ctx.addBinding(value, {type})
      args[value] = {type}
    }
  })
  let argNames = Object.keys(args)
  argNames = hasParams ? ['__params__', ...argNames] : argNames
  return {result: `(${argNames.join(', ')})`, args, paramsValues, hasParams}
}

function compileFunctionArgs(node, ctx) {
  return compileFunctionArgsDetailed(node, ctx).result
}

function compileMethod(arr, ctx, key) {
  let r = '', r0 = '()', r1
  if (arr[0].type === 'meta.function.jome') {
    r0 = compileFunctionArgs(arr[0], ctx)
  }
  r = r0+' '+jsBlock(arr[1], ctx, key !== 'constructor')
  return r
}

function buildDict(node, ctx, func) {
  let list = parseList(node.children.slice(1, -1).flat())
  let dict = {}
  //for (let i = 0; i < list.length; i++) {
    //let j = list.slice(i).findIndex(e => e.type === 'newline')
  list.forEach(arr => {
    //if (arr[0].type === 'newline') {return;}
    if (arr[0].type !== 'meta.dictionary-key.jome') {
      return console.error('Error processing expected meta.dictionary-key.jome inside meta.dictionary.jome but was', arr[0].type)
    }
    let key = arr[0].children[0].text()
    let value = func(arr.slice(1), ctx, key)
    dict[key] = value
  })
  return dict
}

function _compileJomeObj(obj, ctx) {
  let {type, attrs, meta, args, children} = obj
  if (children.length) {
    meta.children = `[${children.map(c => _compileJomeObj(c, ctx)).join(', ')}]`
  }
  let s1 = type ? `new ${type}${args}` : compileJsObj(attrs)
  return `${JOME_LIB}.createObj(${ctx.currentObjPath}, ${s1}, ${compileJsObj(meta)})`
}

function compileJomeObjBlock(list, ctx) {
  let nodes = parseIndent(list)
  ctx.tutor = null
  let result = []
  nodes.forEach(node => {
    let t = node.array[0].type
    if (t === 'entity.name.type.jome-obj.jome' || t === 'entity.name.tag.jome-obj.jome') {
      result.push(_compileJomeObj(_buildJomeObjs([node], ctx)[0], ctx))
    } else if (t === 'entity.name.function.jome') {
      let name = node.array[0].text()
      let args = compileFunctionCallArgs(node.array.slice(1), ctx)
      result.push(name+args)
    } else if (t === 'variable.assignment.jome') {
      result.push(compileBlock(node.array, ctx))
    } else {
      console.error('Error 91283')
    }
  })
  return ctx.spacing()+result.join('\n'+ctx.spacing())
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
  for (let i = 0; i < list.length-1; i++) {
    let c = list[i]
    let n = list[i+1]
    if (c.type === 'newline') {
      if (n.type === 'punctuation.whitespace.indent.jome') {
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
      let arr = list.slice(i, j === -1 ? -1 : i+j)
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

function compileFunctionCallArgs(array, ctx) {
  let args = parseList(array, ctx)
  let actualArgs = []
  let params = {}
  args.forEach(array => {
    if (array[1]?.type === 'keyword.operator.colon.jome') {
      let name = array[0].text()
      params[name] = compileBlock(array.slice(2), ctx)
    } else {
      actualArgs.push(compileBlock(array, ctx))
    }
  })
  if (Object.keys(params).length) {
    actualArgs = [compileJsObj(params), ...actualArgs]
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

function variableNameForPath(name, ctx) {
  let s = name.split('/')
  let root =  '$'+s[0]
  ctx.declareVariable(root)
  return '$'+s.join('.$.$')
}

// Using an hashmap here because it is easier to debug,
// a bunch of if else if else is annoying to go through step by step
// and switch case is really annoying because it does not scope the variables
const PROCESSES = {
  "newline": () => "\n",
  // The whole source code
  "source.jome": (node, ctx) => {
    let r = compileScope(node, node.children, ctx)
    return ctx.headers.join('\n')+'\n'+r
  },
  // import {$$} from 'jome_lib'
  "meta.statement.import.jome": (node, ctx) => {
    // FIXME: Handle all possible import types
    let defaultImport = ''
    let namedImports = []
    node.children.forEach((child, i) => {
      if (child.type === 'variable.other.jome') {
        let name = child.text()
        let p = node.children[i-1]
        if (p && typeof p === 'string' && p.includes('{')) {
          namedImports.push(name)
          ctx.addBinding(name, {type: 'named-import'})
        } else {
          defaultImport = name+' '
          ctx.addBinding(name, {type: 'default-import'})
        }
      }
    })
    let fileName = node.children.slice(-1)[0].children[1]
    let ext = fileName.match(/\.([^.]+)$/)
    let extName = ext && ext[1]
    if (extName === 'jome') {
      ctx.dependencies.push(fileName)
      fileName = fileName.slice(0, fileName.length-4)+"built.js"
    }
    return `import ${defaultImport}${namedImports.length ? `{${namedImports.join(', ')}}`:''} from "${fileName}"\n\n`
  },
  // fooBar =
  "variable.assignment.jome": (node, ctx) => {
    let value = node.text()
    let next = node.captureNext() // The = sign (keyword.operator.assignment.compound.jome)
    next = next.captureNext()
    if (ctx.hasBinding(value)) {return value}
    ctx.addBinding(value, {type: 'variable'})
    return 'let '+value+' = '+compileNode(next, ctx)
  },
  // @name => this.name
  "support.type.property-name.attribute.jome": (node, ctx) => {
    let r = node.text().slice(1)
    return r.length ? `this.${r}` : 'this'
  },
  // <>1+1</>
  "meta.embedded.block.javascript": (node, ctx) => compileRaw(node.children.slice(1,-1)),
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
    } else if (binding.type === 'argument-class-function' && !ctx.isInsideClassSuperObject) {
      return 'this.'+value
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
    let result = `${i === 1 ? '.' : ''}${name}${compileFunctionCallArgs(node.children.slice(2+i, -1), ctx)}`
    return result
  },
  // =>
  "keyword.arrow.jome": (node, ctx) => {
    let next = node.captureNext()
    return `() => ${jsBlock(next, ctx, true)}`
  },
  // arg1 =>
  // |arg1, arg2| =>
  "meta.function.jome": (node, ctx) => {
    let next = node.captureNext()
    return `${compileFunctionArgs(node, ctx)} => ${jsBlock(next, ctx, true)}`
  },
  // (fooBar + 1)
  "expression.group": (node, ctx) => { // TODO: Rename expression.group. Maybe meta.parenthesis.jome?
    return `(${compileBlock(node.children.slice(1, -1), ctx)})`
  },
  // « $someName SomeType »
  "meta.standalone-obj.jome": (node, ctx) => {
    let r = compileJomeObjBlock(node.children.slice(1, -1), ctx) // remove '«' and '»'
    if (r.includes("\n")) {
      console.error('A standalone object can only contain a single jome object')
    }
    return r
  },
  // $some/path << $someName SomeType >>
  "meta.obj-block.jome": (node, ctx) => {
    let prevNode = node.prev()
    let path = prevNode.text().slice(1)
    ctx.currentObjPath = variableNameForPath(path, ctx)
    let prev = compileNode(prevNode, ctx)
    // let r = `${JOME_LIB}.addChildren(${prev}, [\n`
    // ctx.nest(() => {
    //   r += compileJomeObjBlock(node.children.slice(1, -1), ctx) // remove '«' and '»'
    // })
    // return r+'\n])\n\n'
    return prev + '\n' + compileJomeObjBlock(node.children.slice(1, -1), ctx) + '\n\n' // remove '«' and '»'
  },
  // {x: 20, y: 30}
  "meta.dictionary.jome": (node, ctx) => {
    let dict = buildDict(node, ctx, (arr) => compileBlock(arr, ctx))
    return compileJsObj(dict)
  },
  // fooBar.x
  "meta.getter.jome": (node, ctx) => {
    let prev = compileNode(node.prev(), ctx)
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
        let val = compileBlock(list[0], ctx)
        if (/^-\d+$/.test(val.replaceAll(/ /g, ''))) {
          return '.slice('+val+')[0]'
        }
        return '['+val+']'
      } else {
        // TODO: List all the types so I am sure I am not missing any cases
        console.warn('Warning 95412')
      }
    }
    return '['+list.map(e => compileBlock(e, ctx)).join(', ')+']'
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
    let prev = compileNode(node.prev(), ctx)
    switch (val) {
      case 'keys': case 'values': case 'entries':
        return `Object.${val}(${prev})`
      case 'props':
        return `${JOME_LIB}.props(${prev})`
      case 'hasOwnProperty':
      case 'path': // Good?
      case 'name':
      case 'signals':
        return `${prev}.${JOME_ATTRS}.${val}`
      case 'children':
        return `${JOME_LIB}.getChildren(${prev})`
      case 'removeChildren':
        return `(() => {${prev}.${JOME_ATTRS}.children = []})`
      default: throw "FIXME meta not implemented yet: " + val
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
    ctx.nest(() => {
      if (next?.type === 'meta.function.jome') {
        let details = compileFunctionArgsDetailed(next, ctx, true)
        constructorLines = Object.keys(details.args).map(arg => {
          return `this.${arg} = ${arg}`
        })
        if (details.hasParams) {
          if (Object.keys(details.paramsValues).length) {
            constructorLines.push(`this.__params__ = {...${compileJsObj(details.paramsValues)}, ...__params__}`)
          } else {
            constructorLines.push(`this.__params__ = __params__`)
          }
        }
        constructorArgs = details.result
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
      if (next?.type === 'meta.dictionary.jome') {
        methods = {...methods, ...buildDict(next, ctx, compileMethod)}
        next.captured = true
      }
      if (constructorLines.length) {
        if (methods['constructor']) {
          let lines = methods['constructor'].slice(4, -1).split('\n').map(e => e.trim())
          constructorLines = [...constructorLines, ...lines]
          delete methods['constructor']
        }
        constructor = '\n  constructor'+constructorArgs+' '+jsBlock(constructorLines.join('\n'+'  '.repeat(ctx.depth+1)), ctx)
      }
    })
    return `class ${name}${extension} {${constructor}
  ${Object.keys(methods).map(key => {
    return `${compileName(key)}${methods[key]}`
  }).join('\n  ')}
}\n\n`
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
    return `${label} ${compileNode(cond, ctx)} ${jsBlock(val, ctx)}`
  },
  "support.variable.path.jome": (node, ctx) => {
    //let o = ctx.isInsideClass ? 'this' : '$'
    let obj = '$'
    let path = node.text()
    if (path === JOME_ROOT) {return obj}
    let name = path.slice(1)
    let v = variableNameForPath(name, ctx)
    // if (/^\d+$/.test(name)) {
    //   return `${v} = ${JOME_LIB}.getNthChild(${obj}, ${parseInt(name)})`
    // }
    return `${v} = ${JOME_LIB}.getOrCreateChild(${obj}, '${name}')`
  },
  "punctuation.separator.delimiter.jome": () => ', ',
  "punctuation.terminator.statement.jome": () => ';',
  "keyword.operator.jome": (node, ctx) => (
    node.text() === '^' ? ' ** ' : compileWithSpaces(node, ctx)
  ),
  "keyword.operator.logical.jome": compileWithSpaces,
  "keyword.operator.assignment.jome": compileWithSpaces,
  "keyword.operator.comparison.jome": compileWithSpaces,
  "keyword.operator.assignment.compound.jome": compileWithSpaces,
  "support.variable.jome": compileAsIs,
  "constant.numeric.integer.jome": compileAsIs,
  "comment.line.double-slash.jome": () => '',
  "comment.block.jome": () => '',
  "string.quoted.single.jome": (node) => `'${compileRaw(node.children.slice(1,-1))}'`,
  "string.quoted.double.jome": (node) => `"${compileRaw(node.children.slice(1,-1))}"`,
  "string.quoted.backtick.jome": (node, ctx) => {
    return '`'+node.children.slice(1,-1).map(
      c => typeof c === 'string' ? c : '${'+compileBlock(c.children.slice(1,-1), ctx)+'}'
    ).join('')+'`'
  },
  "keyword.control.jome": (node, ctx) => {
    let word = node.text()
    if (word === 'ret' || word === 'return' || word === 'retourne') {
      return 'return '
    } else if (word === 'export') {
      return 'export '
    }
    console.error('Error 745912')
  },
  "meta.embedded.block.shell": (node, ctx) => {
    // FIXME: Use ctx.imports and not headers, because I never want to import multiple times the same thing.
+    ctx.headers.push(`import { exec } from "child_process"`)
    return `exec("${node.children[1].replaceAll(/"/g, '\\"')}")`
  }
}

function compileNode(node, context) {
  if (typeof node === 'string') {return node}
  let process = PROCESSES[node.type]
  let result;
  if (process) {
    result = process ? (process(node, context) || '') : ''
  } else {
    console.warn("Don't know how to process type", node.type, "at line", node.lineNb)
    result = ''
  }
  return result
}

export function compile(text) {
  return compileGetContext(text).result
}

export function compileGetContext(text, ctx) {
  let root = tokenize(text)
  let context = ctx || new CompileContext()
  // console.log('tokenized:', root.print())
  let result = compileNode(root, context)
  return {result, context}
}