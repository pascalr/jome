import { View } from "../view"
import { getRef, REF } from "./skeleton"

// Dock items are added by the other views using addDockItem
// This view is responsible to showing the active item
class Dock extends View {

  setup() {
    // TODO: Maybe save the state of the current dock
    this.app.changeDock(this.app.getProjectPath() ? "explorer" : "home")
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



// import iconHouse from '../../assets/icons/house.svg'
// import iconBoxes from '../../assets/icons/boxes.svg'
// import iconBracesAsterisk from '../../assets/icons/braces-asterisk.svg'
// import iconBug from '../../assets/icons/bug.svg'
// import iconGear from '../../assets/icons/gear.svg'
// import iconGit from '../../assets/icons/git.svg'
// import iconQuestionCircle from '../../assets/icons/question-circle.svg'
// import iconTerminal from '../../assets/icons/terminal.svg'
// return [
//   e('div', {className: "context_buttons"}, [
//     sidebarIcon(iconHouse, "Home", () => app.changeWindow(WINDOW.HOME), currentName === SIDEBAR_TABS.HOME),
//     ...(sideViews.map(v => sidebarIconV2(app, v, currentName))),
//     sidebarIcon(iconBug, "Run & Debug"),
//     sidebarIcon(iconGit, "Git"),
//     sidebarIcon(iconBracesAsterisk, "Snippets"),
//     sidebarIcon(iconBoxes, "Extensions"),
//     e('div', {style: "flex-grow: 1;"}),
//     sidebarIcon(iconTerminal, "Console"),
//     sidebarIcon(iconQuestionCircle, "Documentation"),
//     sidebarIcon(iconGear, "Settings"),
//     e('div', {style: "height: 0.5em;"})
//   ]),
//   contentDiv
// ]