import { JomeParser } from "../jome_parser"
import { JomeDocument } from "../models/jome_document"
import { EVENT } from "../neutralino_app"
import { View } from "../view"

// FIXME: Currently a view in order to get callbacks functions. I am not sure yet how I want to do this so this way forn now.

class DocumentParser extends View {

  onFileChange({filepath, content}) {

    let doc = new JomeDocument(filepath, content)
    let parser = new JomeParser()
    doc.segments = parser.parse(doc)

    this.app.emit(EVENT.DOCUMENT_CHANGE, {doc})
  }

}

export function registerDocumentParser(app) {
  app.registerView(new DocumentParser())
}