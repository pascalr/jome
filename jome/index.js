export default class Jome {

  // x = [1,2,3]; $$.at(x, -1) => 3
  // $$.at(dict, 'key')
  static at(list, indexOrKey) {
    return (indexOrKey < 0) ? list[list.length+indexOrKey] : list[indexOrKey]
  }

  // TODO: Handle units like: (125 ± 5)g / (100 ± 5)mL
  static add(val1, val2) {
    return val1 + val2
  }

  static assign(target, source) {
    target = {...target, ...source}
    return target
  }

  static createObj(parent=null, obj={}, meta={}) {
    if (!obj.$) {
      let {children, ...otherMeta} = meta
      obj.$ = {childrenCount: 0, signals: [], ...otherMeta, chain: (func) => {
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

  static props(target) {
    return target.__params__ || {}
    //return Object.fromEntries(Object.entries(target).filter(([k,v]) => k !== '$' && target.hasOwnProperty(k) && typeof target[k] !== 'function' && !k.startsWith('@') && !k.startsWith('__arg__')))
  }

  static addChildren(parent, children) {
    children.forEach(child => this.addChild(parent, child))
  }

  static addChild(parent, child) {
    parent.childrenCount += 1
    child.$.parent = parent
    let n = child.$.name || ('' + parent.$.childrenCount)
    parent.$['$'+n] = child
  }

  static getOrCreateChild(parent, name) {
    let s = name.split('/')
    let o = parent
    for (let i = 0; i < s.length; i++) {
      let v = s[i]
      let c = (/^\d+$/.test(v)) ? o.$['$'+(parseInt(v)-1)] : o.$['$'+v]
      if (!c) {
        c = this.createObj(null, {}, {name: v})
        this.addChild(o, c)
      }
      o = c
    }
    return o
  }

  static getChild(parent, name) {
    let s = name.split('/')
    let o = parent
    for (let i = 0; i < s.length; i++) {
      let v = s[i]
      o = (/^\d+$/.test(v)) ? o.$['$'+(parseInt(v)-1)] : o.$['$'+v]
      if (!o) {return null}
    }
    return o
  }

  // Children are attached directly to the $ property.
  static getChildren(obj) {
    let list = []
    Object.keys(obj.$).forEach(key => {
      if (key[0] === '$') {
        list.push(obj.$[key])
      }
    })
    return list
  }

  // static getNthChild(parent, index) {
  //   return parent.$.children[index-1]
  // }
}