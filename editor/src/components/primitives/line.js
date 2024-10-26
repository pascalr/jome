import { DRAWING_ATTRIBUTES } from "../abstract/DrawingComponent";
import { PrimitiveComponent } from "../abstract/PrimitiveComponent";

export class Line extends PrimitiveComponent {

  static tagName = "line"

  static ownAttributes = {
    x1: {
      type: "int",
      required: true
    },
    y1: {
      type: "int",
      required: true
    },
    x2: {
      type: "int",
      required: true
    },
    y2: {
      type: "int",
      required: true
    },
    // TODO: pathLength
    ...DRAWING_ATTRIBUTES
  }
  
}