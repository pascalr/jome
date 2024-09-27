import { e } from "../helpers"
import { getFilenameFromPath } from "../utils"

export function createFilesTabs(app) {

  let currentFilepath = app.getData('CURRENT_FILEPATH')
  let filesOpened = (app.getData('FILES_OPENED_BY_PROJECT')||{})[app.getData('PROJECT_PATH')] || []

  return e('div', {className: "tab-buttons"}, filesOpened.map(f => {
    if (f === currentFilepath) {
      return e('button', {className: "tab-button active", title: f}, [getFilenameFromPath(f)])
    } else {
      return e('button', {className: "tab-button", title: f, onclick: () => app.openFile(f)}, [getFilenameFromPath(f)])
    }
  }))
}