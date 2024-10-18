import { JomeComponent } from "./JomeComponent";

export const DRAWING_ATTRIBUTES = {
  // FIXME: Rename this to strokeWidth like in svg, thickness does not make sense for example for a rectangle
  // FIXME: How to name this?
  // thickness: for a line
  // outline: for a rectangle
  // strokeWidth: ? probably yes
  thickness: {
    type: "int",
    default: 2,
  },
  color: {
    type: "color",
    // saveAs: "stroke"
  },
  fill: {
    type: "color",
  },
}

export class DrawingComponent extends JomeComponent {
}
