import {DOMParser} from "prosemirror-model"

import {BlockType} from './parser'

import mdToHtml from "@jome/md-to-html"

export function deserialize(schema, jomeDoc) {

  // Testing .md => html => DOM parser
  if (jomeDoc.extension === "md") {
    let html = ""
    jomeDoc.parts.forEach(part => {
      if (part.type === BlockType.code) {
        html += mdToHtml(part.value)
      }
    })
    let el = document.createElement("div")
    el.innerHTML = html
    let doc = DOMParser.fromSchema(schema).parse(el)
    return doc
  }

  // let doc = [{type: mySchema.topNodeType, attrs: null, content: [], marks: []}]
  let doc = schema.node(schema.topNodeType, null, [
    schema.node("paragraph", null, [schema.text("One.")]),
    schema.node("horizontal_rule"),
    schema.node("paragraph", null, [schema.text("Two!")])
  ])

  return doc
}