import { JomeComponent } from "../JomeComponent";

export class Polygon extends JomeComponent {

  static elementName = "jome-polygon"

  static ownAttributes = {
    x: {
      type: "int",
      required: true
    },
    y: {
      type: "int",
      required: true
    },
    sides: {
      type: "dim",
      default: 5,
    },
    radius: {
      type: "int",
      default: 10,
    },
    color: {
      type: "color",
      default: "#000",
    },
    thickness: {
      type: "int",
      default: 2,
    },
    rotate: {
      type: "float",
      unit: "deg",
      default: 0,
    },
  }

  draw(ctx) {

    let rot = this.rotate * 2 * Math.PI / 360

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    ctx.moveTo(this.x + this.radius * Math.cos(rot), this.y + this.radius * Math.sin(rot));          

    let debug = this.rotate

    for (var i = 1; i <= this.sides; i += 1) {
      ctx.lineTo(
        this.x + this.radius * Math.cos(i * 2 * Math.PI / this.sides + rot),
        this.y + this.radius * Math.sin(i * 2 * Math.PI / this.sides + rot)
      );
    }

    ctx.stroke();
    ctx.restore();
  }
  
}