import Split from 'split.js'

import {e, svgE} from '../helpers'

import iconHouse from '../../assets/icons/house.svg'
import iconFolder2Open from '../../assets/icons/folder2-open.svg'
import iconBoxes from '../../assets/icons/boxes.svg'
import iconBracesAsterisk from '../../assets/icons/braces-asterisk.svg'
import iconBug from '../../assets/icons/bug.svg'
import iconGear from '../../assets/icons/gear.svg'
import iconGit from '../../assets/icons/git.svg'
import iconQuestionCircle from '../../assets/icons/question-circle.svg'
import iconTerminal from '../../assets/icons/terminal.svg'
import { createActionsSelection } from '../partials/actions_selection'
import { createActionsFile } from '../partials/actions_file'
import { createActionsProject } from '../partials/actions_project'
import { HomePage } from './homepage'
import { createHtmlTree } from '../lib/renderHtmlTree'

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

function afterRender(app) {
  // FIXME: Do this inside editor page only
  Split(['#split-0', '#split-1', '#split-2'], {
    gutterSize: 4,
    sizes: [20, 60, 20]
  })

  showExplorer(app)
}

async function showExplorer(app) {
  // Load the navigation tree
  if (app.data['PROJECT_PATH']) {
    // await app.listDirectory(app.data['PROJECT_PATH'])
    app.loadFileTree(app.data['PROJECT_PATH'], tree => {
      let ref = document.getElementById('explorer-tree')
      // explorerList.innerHTML = renderHtmlTree(tree)
      ref.replaceChildren(createHtmlTree(tree, leaf => {
        return {id: leaf.path, className: "leaf", "data-path": leaf.path, onclick: () => {
          app.openFile(leaf.path)
        }}
      }))
    })
  }
}

function createEditor(app) {

  // TODO: Show NoPageOpened if no page is opened
  // if (!this.data['CURRENT_FILENAME']) {
  //   this.refs.mainPanel.replaceChildren(createNoPageOpened(this))
  // }

  return e('div', {className: "window"}, [
    e('div', {className: "split-content"}, [
      e('div', {id: 'split-0', className: "context_panel"}, [
        e('div', {className: "context_buttons"}, [
          contextIcon(iconHouse, "Home", () => app.show(HomePage)),
          contextIcon(iconFolder2Open, "File explorer"),
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
      ]),
      e('div', {id: 'split-1', className: "main_panel"}, [
        e('div', {id: "files_tabs", className: "tab-buttons"}),
        e('div', {id: "prosemirror_editor"})
      ]),
      e('div', {id: 'split-2', className: "selection_panel"}, [
        createActionsSelection(this),
        createActionsFile(this),
        createActionsProject(this)
      ])
    ])
  ])
  
}

export const EditorPage = {
  create: createEditor,
  afterRender
}