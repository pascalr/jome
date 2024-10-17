export function findNodePosition(doc, targetNode) {
  let position = null;

  doc.descendants((node, pos) => {
    if (node === targetNode) {
      position = pos;
      return false; // Stop traversing when we find the node
    }
    return true; // Continue traversing
  });

  return position;
}

export function getJSON(state) {
  return state.doc.toJSON()
}

export function getHTML(schema, content) {
  const div = document.createElement('div')
  const fragment = DOMSerializer
    .fromSchema(schema)
    .serializeFragment(content)

  div.appendChild(fragment)
  return div.innerHTML
}