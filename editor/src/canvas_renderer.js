import { e } from "./helpers";
import { validateColor } from "./validate";

export const CanvasRenderer = {
  render({name, args}) {
    let style = ""
    if (args["background-color"]) {
      style += "background-color: " + validateColor(args["background-color"])
    }
    return e('canvas', {width: args.width, height: args.height, style: style || undefined})
  }
}