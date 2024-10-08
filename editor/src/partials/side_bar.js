import iconHouse from '../../assets/icons/house.svg'
import iconFolder2Open from '../../assets/icons/folder2-open.svg'
import iconBoxes from '../../assets/icons/boxes.svg'
import iconBracesAsterisk from '../../assets/icons/braces-asterisk.svg'
import iconBug from '../../assets/icons/bug.svg'
import iconGear from '../../assets/icons/gear.svg'
import iconGit from '../../assets/icons/git.svg'
import iconQuestionCircle from '../../assets/icons/question-circle.svg'
import iconTerminal from '../../assets/icons/terminal.svg'
import iconTree from '../../assets/icons/tree.svg'

import { HomePage } from '../pages/homepage'
import { e, svgE } from '../helpers'

function contextIcon(icon, title, onClick) {
  // I could modify the size of the icons here
  // One day far far away, allow a settings to specify the size of the icons.
  let el = svgE(icon, title)
  el.setAttribute('width', 26)
  el.setAttribute('height', 26)
  if (onClick) {
    el.onclick = onClick
    el.style.cursor = "pointer"
  }
  return el
}

export function createSideBar(app) {

  return [
    e('div', {className: "context_buttons"}, [
      contextIcon(iconHouse, "Home", () => app.show(HomePage)),
      contextIcon(iconFolder2Open, "File explorer"),
      contextIcon(iconTree, "Object Tree"),
      contextIcon(iconBug, "Run & Debug"),
      contextIcon(iconGit, "Git"),
      contextIcon(iconBracesAsterisk, "Snippets"),
      contextIcon(iconBoxes, "Extensions"),
      e('div', {style: "flex-grow: 1;"}),
      contextIcon(iconTerminal, "Console"),
      contextIcon(iconQuestionCircle, "Documentation"),
      contextIcon(iconGear, "Settings"),
      e('div', {style: "height: 0.5em;"})
    ]),
    e('div', {className: "context_content"}, [
      e('div', {className: "panel-header"}, ["Explorer"]),
      e('div', {id: "explorer-tree"})
    ])
  ]
}