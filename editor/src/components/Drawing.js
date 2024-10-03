import { e } from "../helpers";

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
    }
  </style>
`;

const style = new CSSStyleSheet();
style.replaceSync(":host { display: block; }")

export class Drawing extends HTMLElement {

  constructor() {
    super()
    this.width = 192
    this.height = 108
    this.fill = "#FFF"
    this.attachShadow({mode: 'open'});
    // this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [style]
  }

  static get observedAttributes() {
    return ['width', 'height', 'fill'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }
  
  connectedCallback() {

    let el = e('canvas', {width: this.width, height: this.height})
    el.style.backgroundColor = this.fill
    this.shadowRoot.appendChild(el)
  }

}