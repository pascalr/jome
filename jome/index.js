export default class Jome {

  // x = [1,2,3]; $$.at(x, -1) => 3
  // $$.at(dict, 'key')
  static at(list, indexOrKey) {
    return (indexOrKey < 0) ? list[list.length+indexOrKey] : list[indexOrKey]
  }

  static assign(target, source) {
    target = {...target, ...source}
    return target
  }

  static createObj(parent=null, obj={}, meta={}) {
    if (!obj.$) {
      let {children, ...otherMeta} = meta
      obj.$ = {children: [], signals: [], ...otherMeta, chain: (func) => {
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

  // static getOrCreateChild(parent, name) {
  //   let s = name.split('/')
  //   let o = parent
  //   for (let i = 0; i < s.length; i++) {
  //     let v = s[i]
  //     let c = (/^\d+$/.test(v)) ? o.$['$'+(parseInt(v)-1)] : o.$['$'+v]
  //     if (!c) {
  //       c = this.createObj(null, {}, {name: v})
  //       this.addChild(o, c)
  //     }
  //     o = c
  //   }
  //   return o
  // }

  // static getChild(parent, name) {
  //   let s = name.split('/')
  //   let o = parent
  //   for (let i = 0; i < s.length; i++) {
  //     let v = s[i]
  //     o = (/^\d+$/.test(v)) ? o.$['$'+(parseInt(v)-1)] : o.$['$'+v]
  //     if (!o) {return null}
  //   }
  //   return o
  // }

  // // Children are attached directly to the $ property.
  // static getChildren(obj) {
  //   let list = []
  //   Object.keys(obj.$||{}).forEach(key => {
  //     if (key[0] === '$') {
  //       list.push(obj.$[key])
  //     }
  //   })
  //   return list
  // }

  // static getNthChild(parent, index) {
  //   return parent.$.children[index-1]
  // }
}