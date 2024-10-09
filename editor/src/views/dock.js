import { View } from "../view"
import { getRef, REF } from "./skeleton"

// Dock items are added by the other views using addDockItem
// This view is responsible to showing the active item
class Dock extends View {

  setup() {
    // TODO: Maybe save the state of the current dock
    this.app.changeDock(this.app.getData("PROJECT_PATH") ? "explorer" : "home")
  }

  onDockChange({itemId}) {
    let ref = getRef(REF.DOCK_BUTTONS)
    ;([...ref.children].forEach(c => {
      c.classList.toggle('active', c.dataset.id === itemId)
    }))
  }

}

export function registerDock(app) {
  app.registerView(new Dock())
}