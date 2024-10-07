import { e } from "../helpers";
import { applyBaseStyle, BASE_ATTRIBUTES, JomeComponent } from "../components/abstract/JomeComponent";

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

export class Canvas extends JomeComponent {

  static componentName = "canvas"

  constructor() {
    super()
    this.attachShadow({mode: 'open'});
    // this.shadowRoot.appendChild(template.content.cloneNode(true));
    // this.shadowRoot.adoptedStyleSheets = [BASE_STYLESHEET]
  }

  static get allAttributes() {
    return {...DRAWING_ATTRIBUTES, ...BASE_ATTRIBUTES}
  }

  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES;
  }
  
  connectedCallback() {

    applyBaseStyle(this)

    console.log('THIS', this)

    let el = e('canvas', {width: this.width, height: this.height})
    el.style.backgroundColor = this.fill

    let ctx = el.getContext("2d");

    ;[...this.children].forEach(c => {
      if (c.drawOnCanvas) {
        ctx.save();
        ctx.lineWidth = c.thickness;
        ctx.strokeStyle = c.color;
        ctx.fillStyle = c.fill;
        c.drawOnCanvas(ctx)
        ctx.restore();
      }
    })

    this.shadowRoot.appendChild(el)
  }

}