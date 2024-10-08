import { e } from "../helpers";
import { applyBaseStyle, BASE_ATTRIBUTES, JomeComponent } from "../components/abstract/JomeComponent";
import { Rect } from "../components/drawing/Rect";

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

const DRAW_PRIMITIVES = {
  rect(ctx, el) {
    if (el.hasAttribute("fill")) {
      ctx.beginPath();
      ctx.rect(parseInt(el.getAttribute("x")), parseInt(el.getAttribute("y")), parseInt(el.getAttribute("width")), parseInt(el.getAttribute("height")));
      ctx.fill();
    }
    if (el.hasAttribute("color")) {
      ctx.strokeRect(parseInt(el.getAttribute("x")), parseInt(el.getAttribute("y")), parseInt(el.getAttribute("width")), parseInt(el.getAttribute("height")));
    }    
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
      ctx.save();
      if (c.hasAttribute("thickness")) { ctx.lineWidth = parseInt(c.getAttribute("thickness")); }
      if (c.hasAttribute("color")) { ctx.strokeStyle = c.getAttribute("color"); }
      if (c.hasAttribute("fill")) { ctx.fillStyle = c.getAttribute("fill"); }
      if (c.drawOnCanvas) {
        c.drawOnCanvas(ctx)
      } else {
        let drawingFunc = DRAW_PRIMITIVES[c.tagName.toLowerCase()]
        if (drawingFunc) {
          drawingFunc(ctx, c)
        }
      }
      ctx.restore();
    })

    this.shadowRoot.appendChild(el)
  }

}