import { getFilenameFromPath } from "./utils";

function extractFetchText(response) {
  // TODO: Proper error message not an exception
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  return response.text(); // Convert response to text
  // .catch(error => {
  //   // TODO: handle error
  //   // document.getElementById('file-content').textContent = 'Error: ' + error;
  // });
}

function extractFetchJSON(response) {
  // TODO: Proper error message not an exception
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  return response.json(); // Convert response to text
  // .catch(error => {
  //   // TODO: handle error
  //   // document.getElementById('file-content').textContent = 'Error: ' + error;
  // });
}

export function loadFileList(callback) {
  fetch('/get_file_list').then(extractFetchJSON).then(callback)
}

export function loadFileTree(callback) {
  fetch('/get_file_tree').then(extractFetchJSON).then(callback)
}

export function loadFile(filepath, callback) {
  fetch('/get_file/'+filepath)
  .then(extractFetchText)
  .then(content => callback({name: getFilenameFromPath(filepath), path: filepath, content}))
}