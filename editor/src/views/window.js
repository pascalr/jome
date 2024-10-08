import { View } from "../view"
import { getRef, REF } from "./skeleton"

class WindowView extends View {

  onWindowChange({windowName}) {
    // FIXME: Refer to constant somewhere and not hardcoded string
    getRef(REF.HOME).style.display = windowName === "home" ? "block" : "none"
    getRef(REF.EDITOR).style.display = windowName === "editor" ? "block" : "none"
  }

}

export function registerWindowView(app) {
  app.registerView(new WindowView())
}