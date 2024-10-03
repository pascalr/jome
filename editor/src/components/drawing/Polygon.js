import { JomeComponent } from "../JomeComponent";

export class Polygon extends JomeComponent {

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
    size: {
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
    }
  }

  draw(ctx) {

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    console.log('1 x', this.x + this.size * Math.cos(0))
    console.log('1 y', this.y + this.size * Math.sin(0))
    ctx.moveTo(this.x + this.size * Math.cos(0), this.y + this.size * Math.sin(0));          

    for (var i = 1; i <= this.sides; i += 1) {
      console.log('n x', this.x + this.size * Math.cos(i * 2 * Math.PI / this.sides))
      console.log('n y', this.y + this.size * Math.sin(i * 2 * Math.PI / this.sides))
      ctx.lineTo(this.x + this.size * Math.cos(i * 2 * Math.PI / this.sides), this.y + this.size * Math.sin(i * 2 * Math.PI / this.sides));
    }

    ctx.stroke();
    ctx.restore();
  }
  
}