/*~
L'éditeur prosemirror est modulaire et est composé de plusieurs parties.

Le modèle définie le schéma, c'est-à-dire la structure permise du document.


*/

import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"

import {buildKeymap} from "./prosemirror_keymap"
import {buildInputRules} from "./prosemirror_inputrules"
import { deserialize } from "./prosemirror_deserializer"

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

let editorView = null
let editorRef = null

// (The null arguments are where you can specify attributes, if necessary.)
// let doc = schema.node("doc", null, [
//     schema.node("paragraph", null, [schema.text("One.")]),
//     schema.node("horizontal_rule"),
//     schema.node("paragraph", null, [schema.text("Two!")])
// ])

function createState(jomeDoc) {
  let doc = deserialize(mySchema, jomeDoc)
  let state = EditorState.create({
    schema: mySchema,
    doc,
    plugins: [
      history(),
      buildInputRules(mySchema),
      keymap(buildKeymap(mySchema)),
      keymap(baseKeymap) // handle enter key, delete, etc
      ]
  })
  return state
}

export function loadFileProseMirrorEditor(selector, jomeDoc) {
  let state = createState(jomeDoc)
  editorRef = document.querySelector(selector)
  // if (editorView) {
  //   editorView.updateState(state)
  // } else {
    editorView = new EditorView(editorRef, {state})
  // }
  editorRef.setAttribute("autocomplete", "off")
  editorRef.setAttribute("autocorrect", "off")
  editorRef.setAttribute("autocapitalize", "off")
  editorRef.setAttribute("spellcheck", false)
}