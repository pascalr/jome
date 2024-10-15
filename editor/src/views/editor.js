import mdToHtml from "@jome/md-to-html"
import { JomeParser } from "../jome_parser"
import { JomeDocument } from "../models/jome_document"
import { View } from "../view"
import { getRef, REF } from "./skeleton"
import { createCodemirrorEditor } from "../codemirror/codemirror_editor"
import { createProsemirrorEditor } from "../prosemirror/prosemirror_editor"
import { escapeHTML } from "../utils"

class EditorView extends View {

  onFileChange({filepath, content}) {

    let doc = new JomeDocument(filepath, content)
    let parser = new JomeParser()
    doc.segments = parser.parse(doc)

    let ref = getRef(REF.EDITOR_CONTENT)
    ref.replaceChildren()

    let htmlDoc = ""
    doc.segments.forEach(segment => {
      if (segment.isRaw) {
        if (doc.extension === 'md') {
          htmlDoc += mdToHtml(segment.str)
        } else {
          htmlDoc += `<pre><code>${escapeHTML(segment.str)}</code></pre>`
        }
      } else {
        htmlDoc += segment.str
      }
    })

    createProsemirrorEditor(this.app, ref, htmlDoc)
  }

    // doc.segments.forEach(segment => {
    //   if (segment.isRaw) {
    //     if (doc.extension === 'md') {
    //       let el = document.createElement("div")
    //       el.innerHTML = mdToHtml(segment.str)
    //       ref.appendChild(el)
    //     } else {
    //       createCodemirrorEditor(this.app, ref, segment.str)
    //     }
    //   } else {
    //     createProsemirrorEditor(this.app, ref, segment.str)
    //     // let el = document.createElement("div")
    //     // el.innerHTML = segment.str
    //     // ref.appendChild(el)
    //   }
    // })

}

export function registerEditorView(app) {
  app.registerView(new EditorView())
}