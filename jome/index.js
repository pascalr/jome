function addStateVarDepToHolder(builder, node, dep) {
  if (node.$.state.hasOwnProperty(dep)) {
    if (node !== builder._node) {
      node.$.dependants.push(builder)
    }
  } else if (node.$.parent) {
    addStateVarDepToHolder(builder, node.$.parent, dep)
  } else {
    throw new Error("Could not find state variable holder for "+dep)
  }
}

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
    return getStateVar(target.$.parent, stateVar)
  }
  return null
  //throw new Error("Unknown state variable", stateVar)
}

// When you call .$ on a node, you get an instance of NodeData.
class NodeData {

  constructor(obj, idx, key, data) {
    Object.keys(data||{}).forEach(key => {
      this[key] = data[key]
    })
    this.key = key // this.parent[key] === this
    this.idx = idx // this.parent.$.children[idx] === this
    this.obj = obj
    this.children = []
    this.signals = []
    this.state = {}
    this.dependants = [] // TODO: A list of callbacks to handle changes to the state for descendants.
  }

  // Update the state of the node.
  update(updates) {
    console.log('TODO: Implement NodeData.update', updates)
    console.log('dependants', this.dependants)
    Object.keys(updates).forEach(key => {
      this.obj.$.state[key] = updates[key]
    })
    this.dependants.forEach(dependant => {
      let previous = dependant._node
      // Dependant is a builder
      let updated = dependant.node() // Recreate the node
      Object.keys(updated).forEach(key => {
        previous[key] = updated[key]
      })
      
    })
  }

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
    _childrenInfo: [],
    _state: {},
    _stateDependencies: [],
    _calls: [],
    addChildren: chain(addChildren),
    addChild: chain(addChild),
    addChildNode: chain(addChildNode),
    initStateVar: chain(initStateVar),
    // setStateVar: chain(setStateVar),
    setParent: chain(setParent),
    call: chain(call),
    addStateVarDep: chain(addStateVarDep),
    node,
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

  // Same as addChild, but takes a function that wants the parent as an argument.
  function addChildNode(key, func) {
    if (func) {
      builder._childrenInfo.push({childBuilder: func, key})
    } else {
      builder._childrenInfo.push({childBuilder: key})
    }
  }

  function addChild(key, child) {
    if (child) {
      builder._childrenInfo.push({child, key})
    } else {
      builder._childrenInfo.push({child: key})
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

  // idx, the index of the node in it's parent children array
  function node(idx, key, isNew = true) {

    let _node;
    if (typeof target === 'function') {
      let args = {}
      builder._stateDependencies.forEach(dep => {
        let value = getStateVar(builder._parent, dep)
        args[dep] = value
      })
      _node = target(args)
    } else {
      _node = target
    }
    if (!_node.$) {
      _node.$ = new NodeData(_node, idx, key)
    }

    let meta = _node.$

    // Parent
    if (builder._parent) {
      meta.parent = builder._parent
      if (isNew) {
        meta.parent.$.children.push(_node)
      } else {
        meta.parent.$.children[idx] = _node
      }
    }

    // State
    meta.state = builder._state

    // Children
    meta.children = builder._childrenInfo.map(({child, key, childBuilder}, i) => {
      let value;
      if (childBuilder) {
        childBuilder.setParent(_node)
        value = childBuilder.node(i, key, isNew)
      } else {
        value = child
      }
      if(value.$) {
        value.$.parent = _node
      }
      if (key) {
        _node[key] = value
      }
      return value
    })

    if (isNew) {
      builder._node = _node
    }
    builder._stateDependencies.forEach(dep => {
      addStateVarDepToHolder(builder, _node, dep)
    })

    // Calls
    builder._calls.forEach(func => {
      func(_node)
    })

    return _node
  }

  return builder;
}

jome.getStateVar = getStateVar
jome.params = params

// export default jome
module.exports = jome


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