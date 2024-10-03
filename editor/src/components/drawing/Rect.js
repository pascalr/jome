import { JomeComponent } from "../JomeComponent";

export class Rect extends JomeComponent {

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
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = this.thickness;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }
  
}