// Because DOM lists do not have the forEach method
export function forEach(list, callback) {
  for (let i = 0; i < list.length; i++) {
    callback(list[i])
  }
}

// https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
export function getFilenameFromPath(path) {
  return path ? path.split('\\').pop().split('/').pop() : path
}

// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// https://stackoverflow.com/questions/3043775/how-to-escape-html
export function escapeHTML(str){
  return new Option(str).innerHTML;

}