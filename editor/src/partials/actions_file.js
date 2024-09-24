import {e, createToolSection, toolIcon} from '../helpers'

import iconCopy from '../../assets/icons/copy.svg'
import iconScissors from '../../assets/icons/scissors.svg'
import iconClipboard from '../../assets/icons/clipboard.svg'

export function createActionsFile(app) {
  return e('div', {}, [
    e('div', {className: "panel-main-header"}, ["File • FIXME"]),
    createToolSection("Modify", [
      [
        toolIcon(iconCopy, "FIXME"), // FIXME: What is this supposed to do?
        toolIcon(iconScissors, "FIXME"),
        toolIcon(iconClipboard, "FIXME"),
      ],
    ]),
  ])
}