/*~
L'éditeur prosemirror est modulaire et est composé de plusieurs parties.

Le modèle définie le schéma, c'est-à-dire la structure permise du document.


*/

import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {DOMParser} from "prosemirror-model"
import {history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"

import {buildKeymap} from "./prosemirror_keymap"
import {buildInputRules} from "./prosemirror_inputrules"
import { deserialize } from "./prosemirror_deserializer"
import { schema } from "./prosemirror_schema"
import { arrowHandlers, CodeBlockView } from "./CodeBlockView"

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
      arrowHandlers
      ]
  })

  let nodeViews = {code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos)}

  let editorRef = document.createElement('div')
  ref.appendChild(editorRef)
  // if (editorView) {
  //   editorView.updateState(state)
  // } else {
    let editorView = new EditorView(editorRef, {state, nodeViews})
  // }
  editorRef.setAttribute("autocomplete", "off")
  editorRef.setAttribute("autocorrect", "off")
  editorRef.setAttribute("autocapitalize", "off")
  editorRef.setAttribute("spellcheck", false)
}