import { JomeDocument } from '../models/jome_document'
import { forEach } from '../utils'
import { createCodemirrorEditor } from '../codemirror/codemirror_editor'
import { JomeParser } from '../jome_parser'
import mdToHtml from '@jome/md-to-html'

export function updateMainPanelContent(app, filepath, content) {

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