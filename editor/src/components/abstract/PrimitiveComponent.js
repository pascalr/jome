// Components that already exists like <rect>, <text>...

import { getterForAttr, setterForAttr } from "./JomeComponent"

export class PrimitiveComponent {

  constructor(el) {
    // let attrs = this.constructor.allAttributes
    // Object.keys(attrs).forEach(k => {
    //   if (attrs[k].hasOwnProperty('default')) {
    //     this[k] = attrs[k].default
    //   }
    // })
  }

  static get allAttributes() {
    return {...this.ownAttributes}
  }

  static register() {

    // Maybe allow:
    // let complex = app.wrap(primitive)
    // complex.property // Get property and not attribute

    // Object.keys(this.ownAttributes||{}).forEach(attrName => {

    //   let attr = this.ownAttributes[attrName]

    //   // Object.defineProperty(this.prototype, attrName, { get: getter, set: setter })
    //   Object.defineProperty(this.prototype, attrName, {
    //     get: getterForAttr(attr, attrName),
    //     set: setterForAttr(attr, attrName)
    //   })
    // })
  }

}