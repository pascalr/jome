import { EVENT } from "./neutralino_app";
import { getRef, REF } from "./views/skeleton";

/**
 * Shorthand to create an HTML element.
 * Attrs:
 * id, className, innerText, data-*
 * onclick
 **/ 
export function e(kind, attrs = {}, children = []) {
  let el = document.createElement(kind)
  Object.keys(attrs||{}).forEach(key => {
    if (key.startsWith("data-")) {
      el.setAttribute(key, attrs[key])
    } else {
      el[key] = attrs[key]
    }
  });
  (children||[]).forEach(c => {
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)
  })
  return el
}

/**
 * Creates an svg element given the loaded svg from esbuild. Right now, simply text. Optimize later.
 */
export function svgE(loadedSvg, title) {
  let titleEl = document.createElement('title')
  if (title) {
    titleEl.innerText = title
  }

  let el = createElementFromHTML(loadedSvg)
  el.insertBefore(titleEl, el.firstChild)
  return el
}

// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

export function toolIcon(icon, title) {
  // I could modify the size of the icons here
  // One day far far away, allow a settings to specify the size of the icons.
  return svgE(icon, title)
}

export function createToolSection(title, groups) {
  return e('div', {className: "tool-section"}, [
    e('div', {className: "panel-header"}, [title]),
    e('div', {className: "tool-buttons"},
      groups.map(group => (
        e('div', {className: "tool-group"}, group)
      ))
    )
  ])
}

export function addDockIcon(app, id, svgEl, onClick) {
  let ref = getRef(REF.DOCK_BUTTONS)
  svgEl.setAttribute('width', 26)
  svgEl.setAttribute('height', 26)
  svgEl.onclick = (evt) => {
    app.changeDock(id)
    if (onClick) {onClick(evt)}
  }
  svgEl.style.cursor = "pointer"
  svgEl.dataset.id = id
  // if (current) {
  //   el.style.backgroundColor = "#1b3346"
  // }
  ref.appendChild(svgEl)
  return svgEl  
}

export function dockIcon(app, svgE, current) {
  let el = svgE
  el.setAttribute('width', 26)
  el.setAttribute('height', 26)
  // el.onclick = () => {
  //   app.changeSideView(sideView)
  // }
  // if (sideView.render) {
    el.style.cursor = "pointer"
  // }
  if (current) {
    el.style.backgroundColor = "#1b3346"
  }
  return el
}