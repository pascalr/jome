import { DRAWING_ATTRIBUTES } from "../abstract/DrawingComponent";
import { PrimitiveComponent } from "../abstract/PrimitiveComponent";

export class Rect extends PrimitiveComponent {

  static tagName = "rect"

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
    rx: {
      type: "int",
    },
    ry: {
      type: "int",
    },
    // TODO: pathLength, I don't get that one
    ...DRAWING_ATTRIBUTES
  }
  
}