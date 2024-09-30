import Split from 'split.js'

import {e, svgE} from '../helpers'

import { parse } from '../parser'

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
import { showExplorer } from '../partials/explorer'
import { createFilesTabs } from '../partials/files_tabs'
import { loadFileProseMirrorEditor } from '../prosemirror/prosemirror_editor'
import { JomeDocument } from '../models/jome_document'
import { forEach } from '../utils'
import { createCodemirrorEditor } from '../codemirror/codemirror_editor'
import { JomeParser } from '../jome_parser'

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

export function updateMainPanelContent(app, filepath, content) {
  let ref = document.getElementById('split-1')
  ref.replaceChildren(...createMainPanelContent(app))

  // update active in explorer tree
  // FIXME: DON'T DO THIS HERE. THE SELCTION SHOULD BE HANDLED ELSEWHERE AND IT IS THE SELECTION THAT SHOULD CALL openFile when needed
  forEach(document.querySelectorAll("#explorer-tree .leaf[selected]"), el => {
    el.removeAttribute('selected')
    // el.classList.remove("active")
  })
  const leaf = document.querySelector(`#explorer-tree .leaf[data-path="${filepath}"]`);
  if (leaf) {leaf.setAttribute('selected', "")}

  // update the main source view
  let doc = new JomeDocument(filepath, content)
  let parts = parse(doc) // FIXME: Make this clear that this modifies doc. Refactor
  // console.log("parts", parts)
  loadFileProseMirrorEditor('#prosemirror_editor', doc)
  // document.getElementById('output-editor').innerHTML = renderOutputCode(doc, parts)
  // document.getElementById('notebook-editor').innerHTML = renderNotebookView(doc, parts)

  let parser = new JomeParser()
  let segments = parser.parse(doc)

  createCodemirrorEditor(app, content)
}

function createMainPanelContent(app) {
  let anyFileOpened = !!app.getData("CURRENT_FILEPATH")

  if (anyFileOpened) {
    return [
      createFilesTabs(app),
      e('div', {id: "codemirror_editor"}),
      e('div', {id: "prosemirror_editor"})
    ]
  } else {
    return [e('div', {}, [
      e('p', {}, ["No pages opened."]),
    ])]
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
      e('div', {id: 'split-1', className: "main_panel"}, createMainPanelContent(app)),
      e('div', {id: 'split-2', className: "selection_panel"}, [
        createActionsSelection(app),
        createActionsFile(app),
        createActionsProject(app)
      ])
    ])
  ])
  
}

export const EditorPage = {
  create: createEditor,
  afterRender
}