import { e } from "../helpers";
import { JomeComponent } from "../components/abstract/JomeComponent";

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
  RECT(el, ctx) {
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

export class Canvas extends JomeComponent {

  static componentName = "canvas"

  constructor() {
    super()
    this.attachShadow({mode: 'open'});
    // this.shadowRoot.appendChild(template.content.cloneNode(true));
    // this.shadowRoot.adoptedStyleSheets = [BASE_STYLESHEET]
  }

  static get ownAttributes() {
    return DRAWING_ATTRIBUTES
  }

  render() {
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
        let drawingFunc = DRAW_PRIMITIVES[c.tagName.toUpperCase()]
        if (drawingFunc) {
          drawingFunc(c, ctx)
        }
      }
      ctx.restore();
    })

    this.shadowRoot.replaceChildren(el)
  }
  
  connectedCallback() {
    super.connectedCallback()
    this.render()
    this.observeChildren()
  }

  observeChildren() {
    this.observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        console.log('mutation', mutation)
        // There seems to be two mutations when modifying the children
        // It seems the previous child is removed and a new is added
        // So only rerender when added
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          this.render()
        }
      }
    });

    // Observe changes to the parent element's children
    this.observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

}