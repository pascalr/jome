// Components that already exists like <rect>, <text>...

import { getterForAttr, setterForAttr } from "./JomeComponent"

export class PrimitiveComponent {

  constructor(el) {
    this.el = el
    // let attrs = this.constructor.allAttributes
    // Object.keys(attrs).forEach(k => {
    //   if (attrs[k].hasOwnProperty('default')) {
    //     this[k] = attrs[k].default
    //   }
    // })
  }

  // Wrapper functions for the html element
  hasAttribute(attr) { return this.el.hasAttribute(attr) }
  getAttribute(attr) { return this.el.getAttribute(attr) }
  setAttribute(attr, val) { return this.el.setAttribute(attr, val) }

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