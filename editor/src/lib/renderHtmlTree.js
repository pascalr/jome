import { e } from "../helpers"

// DEPRECATED
export default function renderHtmlTreePath(tree, root=true) {
  let html = root ? "<ul class='tree'>" : "<ul>"
  tree.children.forEach(c => {
    html += "<li>"
    if (!c.isDirectory) {
      html += `<div class="leaf" data-path="${c.path}">📄&nbsp;${c.name}</div>`
    } else {
      html += "<details>"
      html += `<summary class="leaf" data-path="${c.path}">📁&nbsp;${c.name}</summary>`
      html += renderHtmlTreePath(c, false)
      html += "</details>"
    }
    html += "</li>"
  })
  html += "</ul>"
  return html
}

export function createHtmlTree(tree, transformLeaf=()=>({}), root=true) {
  let el = e('ul', root ? {className: 'tree'} : {}, tree.children.map(c => {
    let cs = []
    if (!c.isDirectory) {
      cs = [e('div', {...transformLeaf(c), innerText: `📄 ${c.name}`})]
    } else {
      cs = [e('details', {}, [
        e('summary', {...transformLeaf(c), innerText: `📁 ${c.name}`}),
        createHtmlTree(c, transformLeaf, false)
      ])]
    }
    return e('li', {}, cs)
  }))
  return el
}

function renderPlainHtmlTree(tree) {
  return createHtmlTree(tree).outerHTML
}

// DEPRECATED
function renderHtmlTreeUl(tree, root=true) {
  let html = root ? "<ul class='tree'>" : "<ul>"
  tree.children.forEach(c => {
    html += "<li>"
    if (!c.isDirectory) {
      html += `<div class="leaf" selected>📄&nbsp;${c.name}</div>`
    } else {
      html += "<details>"
      html += `<summary class="leaf">📁&nbsp;${c.name}</summary>`
      html += renderHtmlTreeUl(c, false)
      html += "</details>"
    }
    html += "</li>"
  })
  html += "</ul>"
  return html
}

// DEPRECATED
function renderHtmlTreeDiv(tree, root=true) {
  let html = root ? "<div class='linear-tree'>" : ""
  tree.children.forEach(c => {
    if (!c.isDirectory) {
      html += `<div data-depth="0.6rem" selected>📄&nbsp;${c.name}</div>`
    } else {
      html += "<details>"
      html += `<summary data-depth="1.6rem">📁&nbsp;${c.name}</summary>`
      html += renderHtmlTreeDiv(c, false)
      html += "</details>"
    }
  })
  html += "</div>"
  return html
}