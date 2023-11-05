function initNode(node) {
  if (!node.$) {
    node.$ = {children: [], signals: [], state: {}}
  }
}

// Example:
// var testChainFuncCall = jome(new TestFuncCall())
//   .call((o) => o.getFive())
//   .node()
//   .getFive();
let jome = (target) => {

  // OPTIMIZE: Is there a way to avoid writing wrapper everywhere?
  let wrapper = {_node: null, addChildren, addChild, node, initStateVar, setStateVar, setParent, call, init}

  if (typeof target !== 'function') {
    wrapper._node = target
    initNode(wrapper._node)
  }

  // If the target is a function, the object is created here.
  function init() {
    // FIXME: Pass __state__ as args somehow
    wrapper._node = target({
      get() {
        return null
      }
    })
    initNode(wrapper._node)
    return wrapper
  }

  function call(func) {
    func(wrapper._node)
    return wrapper
  }

  function addChild(key, child) {
    let _child = child || key
    wrapper._node.$.children.push(_child)
    if (_child.$) {
      _child.$.parent = wrapper._node
    }
    if (child) {
      wrapper._node[key] = child
    }
    return wrapper
  }

  function addChildren(children) {
    children.forEach(child => addChild(wrapper._node, child))
    return wrapper
  }

  function initStateVar(stateVar, value) {
    wrapper._node.$.state[stateVar] = value
    return wrapper
  }

  function setParent(parent) {
    jome(parent).addChild(wrapper._node)
    return wrapper
  }

  function setStateVar(stateVar, value) {
    if (wrapper._node.$.state.hasOwnProperty(stateVar)) {
      wrapper._node.$.state[stateVar] = value
    } else if (wrapper._node.$.parent) {
      this.setStateVar(wrapper._node.$.parent, stateVar, value)
    } else {
      throw new Error("Cannot set unkown state variable", stateVar)
    }
    return wrapper
  }

  function node() {
    return wrapper._node
  }

  return wrapper;
}

jome.params = (target) => {
  return Object.keys(target.__props__)
    .filter(key => !target[key])
    .reduce((newObj, key) => {
        newObj[key] = target.__props__[key];
        return newObj;
    }, {});
}

jome.getStateVar = (target, stateVar) => {
  if (target.$.state.hasOwnProperty(stateVar)) {
    return target.$.state[stateVar]
  } else if (target.$.parent) {
    return this.getStateVar(target.$.parent, stateVar)
  }
  return target
  //throw new Error("Unknown state variable", stateVar)
}

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