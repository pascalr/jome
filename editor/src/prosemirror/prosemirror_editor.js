/*~
L'éditeur prosemirror est modulaire et est composé de plusieurs parties.

Le modèle définie le schéma, c'est-à-dire la structure permise du document.


*/

import {EditorState, Plugin} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {DOMParser, DOMSerializer} from "prosemirror-model"
import {history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"

import {buildKeymap} from "./prosemirror_keymap"
import {buildInputRules} from "./prosemirror_inputrules"
import { deserialize } from "./prosemirror_deserializer"
import { schema } from "./prosemirror_schema"
import { arrowHandlers, CodeBlockView } from "./CodeBlockView"
import { EVENT } from "../neutralino_app"
import { ProseMirrorJomeDocument } from "./prosemirror_jome_document"

// (The null arguments are where you can specify attributes, if necessary.)
// let doc = schema.node("doc", null, [
//     schema.node("paragraph", null, [schema.text("One.")]),
//     schema.node("horizontal_rule"),
//     schema.node("paragraph", null, [schema.text("Two!")])
// ])

function createState(jomeDoc) {
  let doc = deserialize(schema, jomeDoc)
  let state = EditorState.create({
    schema: schema,
    doc,
    plugins: [
      history(),
      buildInputRules(schema),
      keymap(buildKeymap(schema)),
      keymap(baseKeymap) // handle enter key, delete, etc
      ]
  })
  return state
}

export function loadFileProseMirrorEditor(ref, jomeDoc) {
  let state = createState(jomeDoc)
  let editorRef = document.createElement('div')
  ref.appendChild(editorRef)
  // if (editorView) {
  //   editorView.updateState(state)
  // } else {
    let editorView = new EditorView(editorRef, {state})
  // }
  editorRef.setAttribute("autocomplete", "off")
  editorRef.setAttribute("autocorrect", "off")
  editorRef.setAttribute("autocapitalize", "off")
  editorRef.setAttribute("spellcheck", false)
}

function getJSON(state) {
  return state.doc.toJSON()
}

function getHTML(schema, content) {
  const div = document.createElement('div')
  const fragment = DOMSerializer
    .fromSchema(schema)
    .serializeFragment(content)

  div.appendChild(fragment)
  return div.innerHTML
}

function batchNotifier(app, schema, debounceTimeMs = 600) {

  let timeout = null;

  return new Plugin({
    state: {
      init(config, instance) {
      },
      // This is the `apply` method, which is triggered when the editor's state changes.
      apply(tr, value, oldState, newState) {
        // Check if the transaction caused a change to the document
        if (tr.docChanged) {
          app.emit(EVENT.DOM_CHANGE, {content: newState.doc.content})

          if (timeout) {clearTimeout(timeout)}

          timeout = setTimeout(() => {
            app.emit(EVENT.DOM_BATCH_CHANGE, new ProseMirrorJomeDocument(newState.doc))
          }, debounceTimeMs)
        }
      }
    }
  })
}

export function createProsemirrorEditor(app, ref, segmentStr) {

  let el = document.createElement("div")
  el.innerHTML = segmentStr
  let doc = DOMParser.fromSchema(schema).parse(el)

  let state = EditorState.create({
    schema: schema,
    doc,
    plugins: [
      history(),
      buildInputRules(schema),
      keymap(buildKeymap(schema)),
      keymap(baseKeymap), // handle enter key, delete, etc
      arrowHandlers,
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
}