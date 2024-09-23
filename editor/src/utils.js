// Because DOM lists do not have the forEach method
export function forEach(list, callback) {
  for (let i = 0; i < list.length; i++) {
    callback(list[i])
  }
}

// https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
export function getFilenameFromPath(path) {
  return path.split('\\').pop().split('/').pop()
}

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
  titleEl.innerText = title

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