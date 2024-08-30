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
  (children||[]).forEach(c => el.appendChild(c))
  return el
}