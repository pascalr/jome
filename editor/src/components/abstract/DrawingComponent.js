import { JomeComponent } from "./JomeComponent";

export const DRAWING_ATTRIBUTES = {
  thickness: {
    type: "int",
    default: 2,
  },
  color: {
    type: "color",
  },
  fill: {
    type: "color",
  },
}

export class DrawingComponent extends JomeComponent {
}
