import { DRAWING_ATTRIBUTES } from "../abstract/DrawingComponent";
import { PrimitiveComponent } from "../abstract/PrimitiveComponent";

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text

export class Text extends PrimitiveComponent {

  // Using txt becomes using text clashes with prosemirror text node.
  static tagName = "txt"

  static ownAttributes = {
    x: {
      type: "int",
      required: true
    },
    y: {
      type: "int",
      required: true
    },
    dx: {
      type: "dim", // is it?
      description: "Shifts the text position horizontally from a previous text element, or shifts the position of each individual glyph if a list of values is provided."
    },
    dy: {
      type: "dim", // is it?
      description: "Shifts the text position vertically from a previous text element, or shifts the position of each individual glyph if a list of values is provided."
    },
    // TODO: rotate
    // TODO: lengthAdjust
    // TODO: textLength
    ...DRAWING_ATTRIBUTES
  }
  
}