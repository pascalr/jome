import { DRAWING_ATTRIBUTES } from "../abstract/DrawingComponent";
import { PrimitiveComponent } from "../abstract/PrimitiveComponent";

export class Isogon extends PrimitiveComponent {

  static tagName = "isogon"

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
    rotate: {
      type: "float",
      unit: "deg",
      default: 0,
    },
    ...DRAWING_ATTRIBUTES
  }
  
}