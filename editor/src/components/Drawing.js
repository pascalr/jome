import { e } from "../helpers";

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
    }
  </style>
`;

const baseStylesheet = new CSSStyleSheet();
baseStylesheet.replaceSync(`
:host {
  display: block;
}
:host([hidden]) {
  display: none;
}
`)

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

const DRAWING_ATTRIBUTES = {
  width: {
    type: "dim",
    default: 192
  },
  height: {
    type: "dim",
    default: 108
  },
  fill: {
    type: "color",
    default: "#FFF"
  }
}

const OBSERVED_ATTRIBUTES = Object.keys({...DRAWING_ATTRIBUTES, ...BASE_ATTRIBUTES})

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

function applyStyle(el) {
  if (el.hasAttribute('margin')) {
    el.style.margin = parseAttribute(el, BASE_ATTRIBUTES.margin, 'margin')
  } else if (el.hasAttribute('padding')) {
    el.style.padding = parseAttribute(el, BASE_ATTRIBUTES.padding, 'padding')
  }
}

export class Drawing extends HTMLElement {

  constructor() {
    super()
    this.width = 192
    this.height = 108
    this.fill = "#FFF"
    this.attachShadow({mode: 'open'});
    // this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [baseStylesheet]
  }

  static get allAttributes() {
    return {...DRAWING_ATTRIBUTES, ...BASE_ATTRIBUTES}
  }

  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES;
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }
  
  connectedCallback() {

    applyStyle(this)

    let el = e('canvas', {width: this.width, height: this.height})
    el.style.backgroundColor = this.fill
    this.shadowRoot.appendChild(el)
  }

}