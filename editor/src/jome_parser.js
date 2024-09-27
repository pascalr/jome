export class JomeParser {

  parse(text) {
    let segments = [] // {isRaw: ..., str: ...}
    segments.push({isRaw: true, str: text})
    return segments
  }

}


// let parser = new JomeParser()
// let segments = parser.parse(jomeDoc.content)
// let children = []
// segments.forEach(segment => {
//   if (segment.isRaw) {
//     children.push(schema.node("paragraph", null, [schema.text(segment.str || "FIXME CAN'T BE EMPTY")]))
//   }
// })
// let topNode = schema.node(schema.topNodeType, null, children)
// return topNode