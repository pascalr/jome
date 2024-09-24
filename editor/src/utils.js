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