import { JomeComponent } from "./JomeComponent";

export const DRAWING_ATTRIBUTES = {
  thickness: {
    type: "int",
    default: 2,
  },
  color: {
    type: "color",
    default: "#000",
  },
  fill: {
    type: "color",
    default: "#000",
  },
}

export class DrawingComponent extends JomeComponent {
}
