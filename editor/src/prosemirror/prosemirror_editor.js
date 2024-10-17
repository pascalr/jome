/*~
L'éditeur prosemirror est modulaire et est composé de plusieurs parties.

Le modèle définie le schéma, c'est-à-dire la structure permise du document.


*/

import {EditorState, NodeSelection, Plugin} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {DOMParser, DOMSerializer} from "prosemirror-model"
import {history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"

import {buildKeymap} from "./prosemirror_keymap"
import {buildInputRules} from "./prosemirror_inputrules"
import { schemaWithComponents } from "./prosemirror_schema"
import { arrowHandlers, CodeBlockView } from "./CodeBlockView"
import { EVENT } from "../neutralino_app"
import { ProseMirrorJomeComponent, ProseMirrorJomeDocument } from "./prosemirror_jome_document"
import { View } from "../view"
import { Selection, SELECTION_TYPE } from "../models/selection"
import { selectObject, updateObjectAttribute } from "./prosemirror_commands"

// (The null arguments are where you can specify attributes, if necessary.)
// let doc = schema.node("doc", null, [
//     schema.node("paragraph", null, [schema.text("One.")]),
//     schema.node("horizontal_rule"),
//     schema.node("paragraph", null, [schema.text("Two!")])
// ])

function batchNotifier(app, schema, debounceTimeMs = 600) {

  let timeout = null;

  return new Plugin({
    state: {
      init(config, instance) {
      },
      // This is the `apply` method, which is triggered when the editor's state changes.
      apply(tr, value, oldState, newState) {
        // app.emit(EVENT.DOCUMENT_EVENT, {content: newState.doc.content})

        // Check if the transaction caused a change to the document
        if (tr.docChanged) {
          app.emit(EVENT.DOCUMENT_CHANGE, new ProseMirrorJomeDocument(app, newState.doc))

          if (timeout) {clearTimeout(timeout)}

          timeout = setTimeout(() => {
            app.emit(EVENT.DOCUMENT_BATCH_CHANGE, new ProseMirrorJomeDocument(app, newState.doc))
          }, debounceTimeMs)
        }
      }
    }
  })
}

const SELECTION_SOURCE_TEXT_EDITOR = "prosemirror"

function selectionChangePlugin(app) {
  return new Plugin({
    state: {
      init(config, instance) {
      },
      apply(tr, value, oldState, newState) {

        let isEcho = tr.getMeta('sourceOfChange') === "selectObject"
        if (isEcho) {return;} // Don't re-emit the event

        // Check if the selection has changed
        if (!newState.selection.eq(oldState.selection)) {
          if (newState.selection instanceof NodeSelection) {
            app.select(new Selection(SELECTION_TYPE.OBJECT, new ProseMirrorJomeComponent(newState.selection.node), SELECTION_SOURCE_TEXT_EDITOR))
          } else {
            // TODO
            // app.select(new Selection(SELECTION_TYPE.TEXT, ))
          }
        }
      },
    },
  });
}

class ProsemirrorEditorWorker extends View {

  static workerName = "ProsemirrorEditorWorker"

  onSelect({selection}) {
    if (this.editorView && selection.sourceOfChange !== SELECTION_SOURCE_TEXT_EDITOR) {
      if (selection.type === SELECTION_TYPE.OBJECT) {
        selectObject(this.editorView.state, this.editorView.dispatch, selection.getItem().node)
      }
    }
  }

  onUpdateField({obj, field, value}) {
    // obj is not used here, because modify the selected object
    if (this.editorView) {
      updateObjectAttribute(this.editorView.state, this.editorView.dispatch, field, value)
    }
  }

  setEditorView(editorView) {
    this.editorView = editorView
  }

}

export function registerProsemirrorEditorWorker(app) {
  app.registerView(new ProsemirrorEditorWorker())
}

export function createProsemirrorEditor(app, ref, segmentStr) {

  let schema = schemaWithComponents(app.components)

  let el = document.createElement("div")
  el.innerHTML = segmentStr
  let doc = DOMParser.fromSchema(schema).parse(el)

  let state = EditorState.create({
    schema,
    doc,
    plugins: [
      history(),
      buildInputRules(schema),
      keymap(buildKeymap(schema)),
      keymap(baseKeymap), // handle enter key, delete, etc
      arrowHandlers,
      selectionChangePlugin(app),
      batchNotifier(app, schema), // Last so it gets the modifications from previous plugins
      ]
  })

  let nodeViews = {code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos)}

  let editorRef = document.createElement('div')
  ref.appendChild(editorRef)
  // if (editorView) {
  //   editorView.updateState(state)
  // } else {
    let editorView = new EditorView(editorRef, { state, nodeViews })
  // }
  editorRef.setAttribute("autocomplete", "off")
  editorRef.setAttribute("autocorrect", "off")
  editorRef.setAttribute("autocapitalize", "off")
  editorRef.setAttribute("spellcheck", false)

  let worker = app.findView(v => v.constructor.workerName === ProsemirrorEditorWorker.workerName)
  worker.setEditorView(editorView)

  // Send initial events
  app.emit(EVENT.DOCUMENT_CHANGE, new ProseMirrorJomeDocument(app, state.doc))
  app.emit(EVENT.DOCUMENT_BATCH_CHANGE, new ProseMirrorJomeDocument(app, state.doc))
}