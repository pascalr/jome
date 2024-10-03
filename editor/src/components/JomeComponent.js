export const BASE_ATTRIBUTES = {
  display: {
    type: 'enum',
    default: 'block',
    values: ["inline", "block"] // inline-block or block
  },
  margin: {
    type: '[dim]',
    default: "0",
  },
  padding: {
    type: '[dim]',
    default: "0",
  }
}

function getterForAttr(attr, attrName) {
  if (attr.type === 'int') {
    return function() { return parseInt(this.getAttribute(attrName)) }
  } else if (attr.type === 'float') {
    return function() { return parseFloat(this.getAttribute(attrName)) }
  } else {
    return function() { return this.getAttribute(attrName) }
  }
}

function setterForAttr(attr, attrName) {
  return function (newValue) {
    this.setAttribute(attrName, newValue)
  }
}

export function applyBaseStyle(el) {
  el.style.display = el.hasAttribute('hidden') ? 'none' : 'block'
  if (el.hasAttribute('margin')) {
    el.style.margin = el.getAttribute('margin') || BASE_ATTRIBUTES.margin.default;
  } else if (el.hasAttribute('padding')) {
    el.style.padding = el.getAttribute('padding') || BASE_ATTRIBUTES.padding.default;
  }
}

export class JomeComponent extends HTMLElement {

  constructor() {
    super()

    let attrs = this.constructor.allAttributes
    Object.keys(attrs).forEach(k => {
      if (attrs[k].hasOwnProperty('default')) {
        this[k] = attrs[k].default
      }
    })
  }

  static get allAttributes() {
    return {...this.ownAttributes, ...BASE_ATTRIBUTES}
  }

  static get observedAttributes() {
    return Object.keys(this.allAttributes || {})
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }

  static register() {

    console.log("register this", this)

    Object.keys(this.ownAttributes||{}).forEach(attrName => {

      console.log("forEach", this)

      let attr = this.ownAttributes[attrName]

      // Object.defineProperty(this.prototype, attrName, { get: getter, set: setter })
      Object.defineProperty(this.prototype, attrName, {
        get: getterForAttr(attr, attrName),
        set: setterForAttr(attr, attrName)
      })
    })

    customElements.define(this.elementName, this)
  }

}


// export const BASE_STYLESHEET = new CSSStyleSheet();
// BASE_STYLESHEET.replaceSync(`
// :host {
//   display: inline;
// }
// :host([hidden]) {
//   display: none;
// }
// `)

// function validateType(type, value) {
//   if (type === 'dim') {
//     return CSS.supports('width', value)
//   } else if (type === '[dim]') {
//     return CSS.supports('margin', value)
//   }
//   throw `Don't know how to validate attribute of type ${type}.`
// }

// // Wait, I don't even need to validate?
// // This is useless?
// // Or maybe will be used in UI, so keep for now.
// function parseAttribute(el, attr, attrName) {

//   let value = el.getAttribute(attrName)

//   if (!value) {
//     return attr.default
//   }

//   if (!validateType(attr.type, value)) {
//     throw `Invalid ${attrName}: ${value}`
//   }

//   return value
// }

