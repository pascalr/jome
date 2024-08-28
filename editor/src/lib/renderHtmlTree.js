export default function renderHtmlTree(tree, root=true) {
  let html = root ? "<ul class='tree'>" : "<ul>"
  tree.children.forEach(c => {
    html += "<li>"
    if (c.type === "file") {
      html += `📄 ${c.name}<br>`
    } else {
      html += "<details>"
      html += `<summary>📁 ${c.name}</summary>`
      html += renderHtmlTree(c, false)
      html += "</details>"
    }
    html += "</li>"
  })
  html += "</ul>"
  return html
}