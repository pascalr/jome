import { JomeComponent } from "../JomeComponent";

export class Polygon extends JomeComponent {

  static componentName = "polygon"

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
    fill: {
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

  drawOnCanvas(ctx) {

    let rot = this.rotate * 2 * Math.PI / 360

    ctx.fillStyle = this.fill;
    drawPolygon(ctx, this.x, this.y, this.radius, this.sides, rot)
    // drawPolygon(ctx, this.x, this.y, this.radius-this.thickness, this.sides, rot)
  }
  
}

function drawPolygon(ctx, x, y, radius, sides, rot) {
  ctx.beginPath();
  ctx.moveTo(x + radius * Math.cos(rot), y + radius * Math.sin(rot));          

  for (var i = 1; i <= sides; i += 1) {
    ctx.lineTo(
      x + radius * Math.cos(i * 2 * Math.PI / sides + rot),
      y + radius * Math.sin(i * 2 * Math.PI / sides + rot)
    );
  }
  ctx.fill();
}