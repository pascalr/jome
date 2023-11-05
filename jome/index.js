// Everything here is static instead of being a class Node that other classes inherit from
// because it is more flexible this way. It works with javascript that is not Jome too.

// TODO:
// jome({some: 'object', y: 20}).node()
// L'avantage de cette syntaxe, est de pouvoir faire:
// jome(node)
//   .addChildren(child1)
//   .addChildren(child2)
//   .addChildren(child3)
//   .node() // Get the node object

export default class Jome {

  static createObj(parent=null, obj={}, meta={}) {
    if (!obj.$) {
      let {children, ...otherMeta} = meta
      obj.$ = {children: [], signals: [], state: {}, ...otherMeta, chain: (func) => {
        func(obj)
        return obj
      }}
      if (children) {
        this.addChildren(obj, children)
      }
      if (parent) {
        this.addChild(parent, obj)
      }
    } else {
      console.error('Error 854372')
    }
    return obj
  }

  static params(target) {
    return Object.keys(target.__props__)
      .filter(key => !target[key])
      .reduce((newObj, key) => {
          newObj[key] = target.__props__[key];
          return newObj;
      }, {});
  }

  static entryCond(key, value) {
    return value ? {key: value} : {}
  }

  // static props(target) {
  //   return target.__params__ || {}
  //   //return Object.fromEntries(Object.entries(target).filter(([k,v]) => k !== '$' && target.hasOwnProperty(k) && typeof target[k] !== 'function' && !k.startsWith('@') && !k.startsWith('__arg__')))
  // }

  static addChildren(parent, children) {
    children.forEach(child => this.addChild(parent, child))
  }

  static addChild(parent, child) {
    if (!parent?.$?.children) {
      throw new Error('Can add any child to parent', parent)
    }
    parent.$.children.push(child)
    if (child.$) {
      child.$.parent = parent
    }
    // let n = child.$.name || ('' + parent.$.childrenCount)
    // parent.$['$'+n] = child
  }

  static initStateVar(node, stateVar, value) {
    node.$.state[stateVar] = value
  }

  static setStateVar(node, stateVar, value) {
    if (node.$.state.hasOwnProperty(stateVar)) {
      node.$.state[stateVar] = value
    } else if (node.$.parent) {
      return this.setStateVar(node.$.parent, stateVar, value)
    }
    throw new Error("Cannot set unkown state variable", stateVar)
  }

  static getStateVar(node, stateVar) {
    if (node.$.state.hasOwnProperty(stateVar)) {
      return node.$.state[stateVar]
    } else if (node.$.parent) {
      return this.getStateVar(node.$.parent, stateVar)
    }
    //throw new Error("Unknown state variable", stateVar)
  }
}