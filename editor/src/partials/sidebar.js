import iconHouse from '../../assets/icons/house.svg'
import iconBoxes from '../../assets/icons/boxes.svg'
import iconBracesAsterisk from '../../assets/icons/braces-asterisk.svg'
import iconBug from '../../assets/icons/bug.svg'
import iconGear from '../../assets/icons/gear.svg'
import iconGit from '../../assets/icons/git.svg'
import iconQuestionCircle from '../../assets/icons/question-circle.svg'
import iconTerminal from '../../assets/icons/terminal.svg'

import { HomePage } from '../pages/homepage'
import { e, svgE } from '../helpers'

export const SIDEBAR_TABS = {
  HOME: "home",
  EXPLORER: "explorer",
}

function sidebarIcon(icon, title, onClick, isCurrent) {
  // I could modify the size of the icons here
  // One day far far away, allow a settings to specify the size of the icons.
  let el = svgE(icon, title)
  el.setAttribute('width', 26)
  el.setAttribute('height', 26)
  if (onClick) {
    el.onclick = onClick
    el.style.cursor = "pointer"
  }
  if (isCurrent) {
    el.style.backgroundColor = "#1b3346"
  }
  return el
}

function sidebarIconV2(app, sideView, current) {
  // I could modify the size of the icons here
  // One day far far away, allow a settings to specify the size of the icons.
  let el = sideView.getIcon()
  el.setAttribute('width', 26)
  el.setAttribute('height', 26)
  el.onclick = () => {
    if (sideView.load) {
      let err = sideView.load()
      if (!err) {
        app.changeSideView(sideView)
      }
    }
  }
  if (sideView.load) {
    el.style.cursor = "pointer"
  }
  if (current === sideView.getName()) {
    el.style.backgroundColor = "#1b3346"
  }
  return el
}

export function createSideBar(app) {

  let currentName = app.getData("CURRENT_SIDEVIEW")
  let currentView = app.getCurrentSideView()
  let sideViews = app.sideViews

  let contentDiv = e('div', {className: "context_content"}, null)
  if (currentView && currentView.render) {
    currentView.render(app, contentDiv)
  }

  return [
    e('div', {className: "context_buttons"}, [
      sidebarIcon(iconHouse, "Home", () => app.show(HomePage), currentName === SIDEBAR_TABS.HOME),
      ...(sideViews.map(v => sidebarIconV2(app, v, currentName))),
      sidebarIcon(iconBug, "Run & Debug"),
      sidebarIcon(iconGit, "Git"),
      sidebarIcon(iconBracesAsterisk, "Snippets"),
      sidebarIcon(iconBoxes, "Extensions"),
      e('div', {style: "flex-grow: 1;"}),
      sidebarIcon(iconTerminal, "Console"),
      sidebarIcon(iconQuestionCircle, "Documentation"),
      sidebarIcon(iconGear, "Settings"),
      e('div', {style: "height: 0.5em;"})
    ]),
    contentDiv
  ]
}