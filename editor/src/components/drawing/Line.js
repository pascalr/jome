import { JomeComponent } from "../JomeComponent";

export class Line extends JomeComponent {

  static elementName = "jome-line"

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
    thickness: {
      type: "int",
      default: 2,
    },
    color: {
      type: "color",
      default: "#000",
    },
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.restore();
  }
  
}