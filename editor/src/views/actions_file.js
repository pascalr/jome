import {e, createToolSection, toolIcon} from '../helpers'

import iconCopy from '../../assets/icons/copy.svg'
import iconScissors from '../../assets/icons/scissors.svg'
import iconClipboard from '../../assets/icons/clipboard.svg'
import { ActionView } from '../view'
import { getFilenameFromPath } from '../utils'

class ActionsFile extends ActionView {

  render() {
    let filepath = this.app.getData("CURRENT_FILEPATH")
    if (!filepath) {return this.getRef().replaceChildren()}

    let filename = getFilenameFromPath(filepath)
    this.getRef().replaceChildren(e('div', {}, [
      e('div', {className: "panel-main-header"}, [`File • ${filename}`]),
      createToolSection("Modify", [
        [
          toolIcon(iconCopy, "FIXME"), // FIXME: What is this supposed to do?
          toolIcon(iconScissors, "FIXME"),
          toolIcon(iconClipboard, "FIXME"),
        ],
      ]),
    ]))
  }

  onFileChange() { this.render() }

}

export function registerActionsFile(app) {
  app.registerView(new ActionsFile())
}