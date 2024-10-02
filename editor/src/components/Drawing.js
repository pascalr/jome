import { e } from "../helpers";
import { capitalize } from "../utils";

export class Drawing extends HTMLElement {

  constructor() {
    super()
    this.width = 192
    this.height = 108
    this.fill = "#FFF"
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
    this.replaceChildren(el)
  }

}