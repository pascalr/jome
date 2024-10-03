export const BASE_ATTRIBUTES = {
  display: {
    type: 'enum',
    default: 'block',
    values: ["inline", "block"] // inline-block or block
  },
  hidden: { // Is this already part of HTML standard?
    type: 'bool',
    default: false
  },
  margin: {
    type: '[dim]',
    default: 0,
  },
  padding: {
    type: '[dim]',
    default: 0,
  }
}

export const BASE_STYLESHEET = new CSSStyleSheet();
BASE_STYLESHEET.replaceSync(`
:host {
  display: block;
}
:host([hidden]) {
  display: none;
}
`)

function validateType(type, value) {
  if (type === 'dim') {
    return CSS.supports('width', value)
  } else if (type === '[dim]') {
    return CSS.supports('margin', value)
  }
  throw `Don't know how to validate attribute of type ${type}.`
}

function parseAttribute(el, attr, attrName) {

  let value = el.getAttribute(attrName)

  if (!value) {
    return attr.default
  }

  if (!validateType(attr.type, value)) {
    throw `Invalid ${attrName}: ${value}`
  }

  return value
}

export function applyBaseStyle(el) {
  if (el.hasAttribute('margin')) {
    el.style.margin = parseAttribute(el, BASE_ATTRIBUTES.margin, 'margin')
  } else if (el.hasAttribute('padding')) {
    el.style.padding = parseAttribute(el, BASE_ATTRIBUTES.padding, 'padding')
  }
}

export class JomeComponent extends HTMLElement {

  constructor() {
    super()

    let attrs = this.constructor.allAttributes
    Object.keys(attrs).forEach(k => {
      if (attrs[k].default) {
        this[k] = attrs[k].default
      }
    })
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }

}