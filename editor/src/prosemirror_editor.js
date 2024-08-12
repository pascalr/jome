import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

export function initProseMirrorEditor(selector) {
    let state = EditorState.create({schema: mySchema})
    let view = new EditorView(document.querySelector(selector), {state})
}