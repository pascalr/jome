import { DRAWING_ATTRIBUTES } from "../abstract/DrawingComponent";
import { JomeComponent } from "../abstract/JomeComponent";

export class Rect extends JomeComponent {

  static componentName = "rect"

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

  // TODO move this inside renderer (canvas, svg, css), here it is just the model
  drawOnCanvas(ctx) {
    // ctx.beginPath();
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    // ctx.stroke();
  }
  
}