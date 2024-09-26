export function renderFilesTabs() {

  let currentFilepath = app.getData('CURRENT_FILEPATH')
  let filesOpened = app.getData('FILES_OPENED_BY_PROJECT')

  let ref = document.getElementById("files_tabs")

}

// openFile(filepath) {
//   loadFile(filepath, (file) => {
//     console.log('file', file)
//     // update state
//     //_opened_files[filepath] = file.content
//     //_active_filepath = filepath

//     // update files tabs
//     let filesTabs = document.getElementById("files_tabs")
//     forEach(filesTabs.children, c => {
//       if (c.classList.contains("active")) {c.classList.remove("active")}
//     })
//     let btn = document.createElement('button')
//     btn.className = "tab-button active"
//     btn.innerText = file.name
//     filesTabs.prepend(btn)

//     // update active in explorer tree
//     // FIXME: DON'T DO THIS HERE. THE SELCTION SHOULD BE HANDLED ELSEWHERE AND IT IS THE SELECTION THAT SHOULD CALL openFile when needed
//     forEach(document.querySelectorAll("#explorer-tree .leaf[selected]"), el => {
//       el.removeAttribute('selected')
//       // el.classList.remove("active")
//     })
//     const leaf = document.querySelector(`#explorer-tree .leaf[data-path="${filepath}"]`);
//     leaf.setAttribute('selected', "")

//     // update active filename
//     forEach(document.getElementsByClassName('active_filename'), el => {
//       el.innerText = file.name; 
//     });

//     // update the main source view
//     let doc = new JomeDocument(filepath, file.content)
//     let parts = parse(doc)
//     console.log("parts", parts)
//     loadFileProseMirrorEditor('#prosemirror_editor', doc)
//     // document.getElementById('output-editor').innerHTML = renderOutputCode(doc, parts)
//     // document.getElementById('notebook-editor').innerHTML = renderNotebookView(doc, parts)
//   })
// }