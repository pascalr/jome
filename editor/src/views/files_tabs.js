import { e } from "../helpers"
import { getFilenameFromPath } from "../utils"
import { View } from "../view"
import { getRef, REF } from "./skeleton"

// TODO: Add x to allow close on left click
// TODO: Allow drag and drop to move
// TODO: Add arrow on the right to see more hidden files (or dropdown) I like dropdown more I think. "See (3) more..."

function handleMouseDown(app, filepath, isActive, evt) {
  if (evt.button === 0) { // left click
    if (!isActive) {
      app.openFile(filepath)
    }
  } else if (evt.button === 1) { // middle (wheel) click
    app.closeFile(filepath)
  }
}

class FilesTabs extends View {

  render() {
    let ref = getRef(REF.FILE_TABS)

    let currentFilepath = this.app.getData('CURRENT_FILEPATH')
    let filesOpened = this.app.getProjectData('FILES_OPENED') || []

    ref.replaceChildren(e('div', {className: "tab-buttons"}, filesOpened.map(f => {
      if (f === currentFilepath) {
        return e('button', {className: "tab-button active", title: f, onmousedown: (evt) => handleMouseDown(this.app, f, true, evt)}, [getFilenameFromPath(f)])
      } else {
        return e('button', {className: "tab-button", title: f, onmousedown: (evt) => handleMouseDown(this.app, f, false, evt)}, [getFilenameFromPath(f)])
      }
    })))
  }

  onFileOpen() { this.render() }
  onFileClose() { this.render() }

}

export function registerFilesTabs(app) {
  app.registerView(new FilesTabs())
}