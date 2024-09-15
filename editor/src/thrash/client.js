import { showErrorModal } from "./modal";
import { getFilenameFromPath } from "./utils";

function handleError(error) {
  console.error(error)
  showErrorModal("Error communicating with the server.")
}

function fetchJSON(url, callback) {
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Convert response to text
  })
  .then(callback)
  .catch(handleError);
}

function fetchText(url, callback) {
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.text(); // Convert response to text
  })
  .then(callback)
  .catch(handleError);
}

export function loadFileTree(callback) {
  fetchJSON('/get_file_tree', callback)
}

export function loadFile(filepath, callback) {
  fetchText('/get_file/'+filepath, content => callback({name: getFilenameFromPath(filepath), path: filepath, content}))
}