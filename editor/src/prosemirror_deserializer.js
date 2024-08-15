export function deserialize(schema, jomeDoc) {
  // let doc = [{type: mySchema.topNodeType, attrs: null, content: [], marks: []}]
  let doc = schema.node(schema.topNodeType, null, [
    schema.node("paragraph", null, [schema.text("One.")]),
    schema.node("horizontal_rule"),
    schema.node("paragraph", null, [schema.text("Two!")])
  ])

  return doc
}