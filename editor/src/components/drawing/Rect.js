import { DRAWING_ATTRIBUTES } from "../abstract/DrawingComponent";
import { JomeComponent } from "../abstract/JomeComponent";

// FIXME deprecated??? use primitive tag <rect> instead?

export class Rect extends JomeComponent {

  static componentName = "rect"
  static primitiveName = "rect"

  static ownAttributes = {
    x: {
      type: "int",
      required: true
    },
    y: {
      type: "int",
      required: true
    },
    width: {
      type: "dim",
      required: true
    },
    height: {
      type: "dim",
      required: true
    },
    ...DRAWING_ATTRIBUTES
  }

  drawOnCanvas(ctx) {

    if (this.hasAttribute("fill")) {
      ctx.beginPath();
      ctx.rect(parseInt(this.getAttribute("x")), parseInt(this.getAttribute("y")), parseInt(this.getAttribute("width")), parseInt(this.getAttribute("height")));
      ctx.fill();
    }
    if (this.hasAttribute("color")) {
      ctx.strokeRect(parseInt(this.getAttribute("x")), parseInt(this.getAttribute("y")), parseInt(this.getAttribute("width")), parseInt(this.getAttribute("height")));
    }  
  }
  
}