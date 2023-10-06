export class $$ {

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

  static createObj(parent, obj={}, meta={}) {
    if (!obj.$) {
      obj.$ = {children: [], parent, signals: [], ...meta}
    } else {
      console.error('Error 854372')
    }
    return obj
  }

  // A base object or a list of base object. Maybe deprecated. Using only paramters instead work?
  static newObj(objOrList={}, meta={}) {
    let list = Array.isArray(objOrList) ? objOrList : [objOrList]
    //let o = Object.create(list[0]||{}) // keep the first object prototype
    let o = list[0]||{} // keep the first object prototype
    //let o = {...(list[0]||{})} // keep the first object prototype
    if (!o.$) {
      o.$ = {children: [], signals: [], ...meta}
    } else {
      // FIXME
    }
    list.slice(1,list.length).forEach(obj => {
      Object.assign(o, obj)
      // Object.keys(obj).forEach(key => {
      //   if (obj.hasOwnProperty(key)) {
      //     o[key] = obj[key]
      //   }
      // })
      obj?.$?.children?.forEach(child => {
        o.$.children.push(child)
      })
      obj?.$?.signals?.forEach(signal => {
        o.$.signals.push(signal)
      })
    })
    return o
  }

  static props(target) {
    return Object.fromEntries(Object.entries(target).filter(([k,v]) => k !== '$' && target.hasOwnProperty(k) && typeof target[k] !== 'function' && !k.startsWith('@') && !k.startsWith('__arg__')))
  }

  static addChildren(parent, children) {
    parent.$.children.concat(children)
  }

  static addChild(parent, child) {
    parent.$.children.push(child)
  }

  static getOrCreateChild(parent, name) {
    let s = name.split('/')
    let o = parent
    for (let i = 0; i < s.length; i++) {
      let v = s[i]
      let c = (/^\d+$/.test(v)) ? o.$.children[parseInt(v)-1] : o.$.children.find(child => child.$.name === v)
      if (!c) {
        c = this.newObj({}, {name: v})
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
      o = (/^\d+$/.test(v)) ? o.$.children[parseInt(v)-1] : o.$.children.find(child => child.$.name === v)
      if (!o) {return null}
    }
    return o
  }

  static getNthChild(parent, index) {
    return parent.$.children[index-1]
  }
}

// class JomeObj {
//   constructor(props={}, meta={}) {
//     Object.keys(props).forEach(prop => {
//       this[prop] = props[prop]
//     })
//     this.$ = meta
//     this.$.children = meta.children || []
//   }
// }

// // DEPRECATED. This will only be handled at compile time. Nothing fancy at run time.
export class Quantity {
  constructor(value, unit) {
    this.val = value;
    this.unit = unit;
  }
}

export default $$