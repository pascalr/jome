import { getFilenameFromPath } from "../utils"
import { View } from "../view"
import { getRef, REF } from "./skeleton"

class WindowBar extends View {

  render() {
    let ref = getRef(REF.WINDOW_BAR)

    let name = getFilenameFromPath(this.app.getCurrentFilepath())
    let projectName = getFilenameFromPath(this.app.getProjectPath())
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

  onFileChange() {this.render()}
  onProjectChange() {this.render()}

}

export function registerWindowBar(app) {
  app.registerView(new WindowBar())
}