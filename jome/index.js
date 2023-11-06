function params(target) {
  return Object.keys(target.__props__)
    .filter(key => !target[key])
    .reduce((newObj, key) => {
        newObj[key] = target.__props__[key];
        return newObj;
    }, {});
}

function getStateVar(target, stateVar) {
  if (target.$.state.hasOwnProperty(stateVar)) {
    return target.$.state[stateVar]
  } else if (target.$.parent) {
    return this.getStateVar(target.$.parent, stateVar)
  }
  return target
  //throw new Error("Unknown state variable", stateVar)
}

// Example:
// var testChainFuncCall = jome(new TestFuncCall())
//   .call((o) => o.getFive())
//   .node()
//   .getFive();
let jome = (target) => {

  // OPTIMIZE: Is there a way to avoid writing wrapper everywhere?
  let builder = {
    _node: null,
    _parent: null,
    _children: [],
    _state: {},
    _stateDependencies: [],
    _calls: [],
    _entries: {},
    addChildren: chain(addChildren),
    addChild: chain(addChild),
    initStateVar: chain(initStateVar),
    // setStateVar: chain(setStateVar),
    setParent: chain(setParent),
    call: chain(call),
    addStateVarDep: chain(addStateVarDep),
    node
  }

  function chain(func) {
    return (...args) => {
      func(...args)
      return builder
    }
  }

  function call(func) {
    builder._calls.push(func)
  }

  function addStateVarDep(name) {
    builder._stateDependencies.push(name)
  }

  function addChild(key, child) {
    let _child = child || key
    builder._children.push(_child)
    if (child) {
      builder._entries[key] = child
    }
  }

  function addChildren(children) {
    children.forEach(child => addChild(builder._node, child))
  }

  function initStateVar(stateVar, value) {
    builder._state[stateVar] = value
  }

  function setParent(parent) {
    builder._parent = parent
    // jome(parent).addChild(wrapper._node)
  }

  // function setStateVar(stateVar, value) {
  //   if (wrapper._node.$.state.hasOwnProperty(stateVar)) {
  //     wrapper._node.$.state[stateVar] = value
  //   } else if (wrapper._node.$.parent) {
  //     this.setStateVar(wrapper._node.$.parent, stateVar, value)
  //   } else {
  //     throw new Error("Cannot set unkown state variable", stateVar)
  //   }
  // }

  function node() {

    let node;
    if (typeof target === 'function') {
      // FIXME: Pass __state__ as args somehow
      let args = {}
      node = target({
        get() {
          return null
        }
      })
      // _stateDependencies.forEach(dep => {
      //   getStateVar(wrapper._node)
      // })
    } else {
      node = target
    }
    if (!node.$) {
      node.$ = {children: [], signals: [], state: {}}
    }

    let meta = node.$
    // Parent
    if (builder._parent) {
      meta.parent = builder._parent
      meta.parent.$.children.push(node)
    }
    // Children
    meta.children = builder._children
    meta.children.forEach(child => {
      if(child.$) {
        child.$.parent = node
      }
    })
    // Copy all the entries into the node
    Object.keys(builder._entries).forEach(key => {
      node[key] = builder._entries[key]
    })

    meta.state = builder._state

    // Calls
    builder._calls.forEach(func => {
      func(node)
    })

    return node
  }

  return builder;
}

jome.getStateVar = getStateVar
jome.params = params

export default jome


// export default class Jome {

//   static createObj(parent=null, obj={}, meta={}) {
//     if (!obj.$) {
//       let {children, ...otherMeta} = meta
//       obj.$ = {children: [], signals: [], state: {}, ...otherMeta, chain: (func) => {
//         func(obj)
//         return obj
//       }}
//       if (children) {
//         this.addChildren(obj, children)
//       }
//       if (parent) {
//         this.addChild(parent, obj)
//       }
//     } else {
//       console.error('Error 854372')
//     }
//     return obj
//   }

//   // static params(target) {
//   //   return Object.keys(target.__props__)
//   //     .filter(key => !target[key])
//   //     .reduce((newObj, key) => {
//   //         newObj[key] = target.__props__[key];
//   //         return newObj;
//   //     }, {});
//   // }

//   // static entryCond(key, value) {
//   //   return value ? {key: value} : {}
//   // }

//   // static props(target) {
//   //   return target.__params__ || {}
//   //   //return Object.fromEntries(Object.entries(target).filter(([k,v]) => k !== '$' && target.hasOwnProperty(k) && typeof target[k] !== 'function' && !k.startsWith('@') && !k.startsWith('__arg__')))
//   // }

//   // static addChildren(parent, children) {
//   //   children.forEach(child => this.addChild(parent, child))
//   // }

//   // static addChild(parent, child) {
//   //   if (!parent?.$?.children) {
//   //     throw new Error('Can add any child to parent', parent)
//   //   }
//   //   parent.$.children.push(child)
//   //   if (child.$) {
//   //     child.$.parent = parent
//   //   }
//   //   // let n = child.$.name || ('' + parent.$.childrenCount)
//   //   // parent.$['$'+n] = child
//   // }

//   // static initStateVar(node, stateVar, value) {
//   //   node.$.state[stateVar] = value
//   // }

//   // static setStateVar(node, stateVar, value) {
//   //   if (node.$.state.hasOwnProperty(stateVar)) {
//   //     node.$.state[stateVar] = value
//   //   } else if (node.$.parent) {
//   //     return this.setStateVar(node.$.parent, stateVar, value)
//   //   }
//   //   throw new Error("Cannot set unkown state variable", stateVar)
//   // }

//   // static getStateVar(node, stateVar) {
//   //   if (node.$.state.hasOwnProperty(stateVar)) {
//   //     return node.$.state[stateVar]
//   //   } else if (node.$.parent) {
//   //     return this.getStateVar(node.$.parent, stateVar)
//   //   }
//   //   //throw new Error("Unknown state variable", stateVar)
//   // }
// }