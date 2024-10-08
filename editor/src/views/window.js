import { View } from "../view"
import { getRef, REF } from "./skeleton"

class WindowView extends View {

  onSidebarTabChange() {
    getRef(REF.HOME).style.display = "none"
    getRef(REF.EDITOR).style.display = "none"
  }

}

export function registerWindowView(app) {
  app.registerView(new WindowView())
}