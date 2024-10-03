import { e } from "../helpers";
import { applyBaseStyle, BASE_ATTRIBUTES, BASE_STYLESHEET, JomeComponent } from "./JomeComponent";

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
    }
  </style>
`;

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

export class Drawing extends JomeComponent {

  constructor() {
    super()
    this.attachShadow({mode: 'open'});
    // this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [BASE_STYLESHEET]
  }

  static get allAttributes() {
    return {...DRAWING_ATTRIBUTES, ...BASE_ATTRIBUTES}
  }

  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES;
  }
  
  connectedCallback() {

    applyBaseStyle(this)

    let el = e('canvas', {width: this.width, height: this.height})
    el.style.backgroundColor = this.fill
    this.shadowRoot.appendChild(el)
  }

}