import { getFilenameFromPath } from "../utils"
import { View } from "../view"
import { getRef, REF } from "./skeleton"

class WindowBar extends View {

  render() {
    let ref = getRef(REF.WINDOW_BAR)

    let name = getFilenameFromPath(this.app.getData('CURRENT_FILEPATH'))
    let projectName = getFilenameFromPath(this.app.getData('PROJECT_PATH'))
    let txt = (name ? `${name} - ` : "") + 
      (projectName ? `${projectName} - ` : "") + 
      "Jome Editor"
    
    if (this.app.getWindowMode() === 'window') {
      this.app.setWindowTitle(txt)
      ref.style.display = "none"
    } else {
      ref.innerText = txt
    }
  }

}

export function registerWindowBar(app) {
  app.registerView(new WindowBar())
}