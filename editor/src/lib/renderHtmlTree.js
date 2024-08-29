export default function renderHtmlTreeUl(tree, root=true) {
  let html = root ? "<ul class='tree'>" : "<ul>"
  tree.children.forEach(c => {
    html += "<li>"
    if (c.type === "file") {
      html += `📄 ${c.name}<br>`
    } else {
      html += "<details>"
      html += `<summary>📁 ${c.name}</summary>`
      html += renderHtmlTreeUl(c, false)
      html += "</details>"
    }
    html += "</li>"
  })
  html += "</ul>"
  return html
}

function renderHtmlTreeDiv(tree, root=true) {
  let html = root ? "<div class='linear-tree'>" : ""
  tree.children.forEach(c => {
    if (c.type === "file") {
      html += `<div data-depth="0.6rem">📄 ${c.name}</div>`
    } else {
      html += "<details>"
      html += `<summary data-depth="1.6rem">📁 ${c.name}</summary>`
      html += renderHtmlTreeDiv(c, false)
      html += "</details>"
    }
  })
  html += "</div>"
  return html
}