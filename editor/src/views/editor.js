import mdToHtml from "@jome/md-to-html"
import { JomeParser } from "../jome_parser"
import { JomeDocument } from "../models/jome_document"
import { View } from "../view"
import { getRef, REF } from "./skeleton"
import { createCodemirrorEditor } from "../codemirror/codemirror_editor"

class EditorView extends View {

  onDocumentChange({doc}) {

    let ref = getRef(REF.EDITOR_CONTENT)
    ref.replaceChildren()

    doc.segments.forEach(segment => {
      if (segment.isRaw) {
        if (doc.extension === 'md') {
          let el = document.createElement("div")
          el.innerHTML = mdToHtml(segment.str)
          ref.appendChild(el)
        } else {
          createCodemirrorEditor(this.app, ref, segment.str)
        }
      } else {
        let el = document.createElement("div")
        el.innerHTML = segment.str
        ref.appendChild(el)
      }
    })
  }

}

export function registerEditorView(app) {
  app.registerView(new EditorView())
}