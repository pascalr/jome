import { JomeComponent } from "../JomeComponent";

export class Rect extends JomeComponent {

  static elementName = "jome-rect"

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
    thickness: {
      type: "int",
      default: 2,
    },
    color: {
      type: "color",
      default: "#000",
    },
  }

  // TODO move this inside renderer (canvas, svg, css), here it is just the model
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    // ctx.stroke();
    ctx.restore();
  }
  
}