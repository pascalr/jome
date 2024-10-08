import Split from 'split.js'

import {e, svgE} from '../helpers'

import { parse } from '../parser'

import { createActionsSelection } from '../partials/actions_selection'
import { createActionsFile } from '../partials/actions_file'
import { createActionsProject } from '../partials/actions_project'
import { createFilesTabs } from '../partials/files_tabs'
import { loadFileProseMirrorEditor } from '../prosemirror/prosemirror_editor'
import { JomeDocument } from '../models/jome_document'
import { forEach } from '../utils'
import { createCodemirrorEditor } from '../codemirror/codemirror_editor'
import { JomeParser } from '../jome_parser'
import { renderCommand } from '../jome_renderer'
import mdToHtml from '@jome/md-to-html'
import { createSideBar } from '../partials/sidebar'

function afterRender(app) {
  // FIXME: Do this inside editor page only
  Split(['#split-0', '#split-1', '#split-2'], {
    gutterSize: 4,
    sizes: [20, 60, 20]
  })
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
  // let parts = parse(doc) // FIXME: Make this clear that this modifies doc. Refactor
  // console.log("parts", parts)
  // document.getElementById('output-editor').innerHTML = renderOutputCode(doc, parts)
  // document.getElementById('notebook-editor').innerHTML = renderNotebookView(doc, parts)

  let parser = new JomeParser()
  let segments = parser.parse(doc)

  let contentRef = document.getElementById('editor_content')

  segments.forEach(segment => {
    if (segment.isRaw) {
      if (doc.extension === 'md') {
        let el = document.createElement("div")
        el.innerHTML = mdToHtml(segment.str)
        contentRef.appendChild(el)
      } else {
        createCodemirrorEditor(app, contentRef, segment.str)
      }
    } else {
      let el = document.createElement("div")
      el.innerHTML = segment.str
      contentRef.appendChild(el)
      // ;(segment.commands||[]).forEach(cmd => {
      //   renderCommand(contentRef, cmd)
      // })
      // loadFileProseMirrorEditor(contentRef, doc)
    }
  })
}

function createMainPanelContent(app) {
  let anyFileOpened = !!app.getData("CURRENT_FILEPATH")

  if (anyFileOpened) {
    return [
      createFilesTabs(app),
      e('div', {id: "editor_content"}),
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
      e('div', {id: 'split-0', className: "context_panel"}, createSideBar(app)),
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