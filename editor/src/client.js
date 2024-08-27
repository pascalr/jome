
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
  fetch('/get_file_list')
  .then(extractFetchJSON)
  .then(callback)
}

export function loadFile(filename, callback) {
  document.getElementById("current_filename").innerText = filename
  fetch('/get_file/'+filename)
  .then(extractFetchText)
  .then(src => callback(filename, src))
  // .catch(error => {
  //   // TODO: handle error
  //   // document.getElementById('file-content').textContent = 'Error: ' + error;
  // });
}