import { DRAWING_ATTRIBUTES } from "../abstract/DrawingComponent";
import { JomeComponent } from "../abstract/JomeComponent";

export class Line extends JomeComponent {

  static componentName = "line"

  static ownAttributes = {
    x1: {
      type: "int",
      required: true
    },
    x2: {
      type: "int",
      required: true
    },
    y1: {
      type: "int",
      required: true
    },
    y2: {
      type: "int",
      required: true
    },
    ...DRAWING_ATTRIBUTES
  }

  drawOnCanvas(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
  
}