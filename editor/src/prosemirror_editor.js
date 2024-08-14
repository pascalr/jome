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

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

// (The null arguments are where you can specify attributes, if necessary.)
// let doc = schema.node("doc", null, [
//     schema.node("paragraph", null, [schema.text("One.")]),
//     schema.node("horizontal_rule"),
//     schema.node("paragraph", null, [schema.text("Two!")])
// ])

export function initProseMirrorEditor(selector) {
    let state = EditorState.create({
        schema: mySchema,
        plugins: [
            history(),
            buildInputRules(mySchema),
            keymap(buildKeymap(mySchema)),
            keymap(baseKeymap) // handle enter key, delete, etc
          ]
    })
    let view = new EditorView(document.querySelector(selector), {state})
}