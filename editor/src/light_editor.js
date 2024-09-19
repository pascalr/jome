// import mdToHtml from "@jome/md-to-html"

import {parse, BlockType} from './parser'
import {JomeDocument} from './jome_document'

import {loadFileProseMirrorEditor} from './prosemirror_editor'

import Split from 'split.js'
import renderHtmlTree, {createHtmlTree} from './lib/renderHtmlTree'

import { forEach } from './utils'

import {loadFile, loadFileTree} from './neutralino_client'
import { createHomepage } from './partials/homepage'
import { NeutralinoApp } from './neutralino_app'

//let _active_filepath = null
//let _opened_files = []
function openFile(filepath) {
  loadFile(filepath, (file) => {
    console.log('file', file)
    // update state
    //_opened_files[filepath] = file.content
    //_active_filepath = filepath

    // update files tabs
    let filesTabs = document.getElementById("files_tabs")
    forEach(filesTabs.children, c => {
      if (c.classList.contains("active")) {c.classList.remove("active")}
    })
    let btn = document.createElement('button')
    btn.className = "tab-button active"
    btn.innerText = file.name
    filesTabs.prepend(btn)

    // update active in explorer tree
    // FIXME: DON'T DO THIS HERE. THE SELCTION SHOULD BE HANDLED ELSEWHERE AND IT IS THE SELECTION THAT SHOULD CALL openFile when needed
    forEach(document.querySelectorAll("#explorer-tree .leaf[selected]"), el => {
      el.removeAttribute('selected')
      // el.classList.remove("active")
    })
    const leaf = document.querySelector(`#explorer-tree .leaf[data-path="${filepath}"]`);
    leaf.setAttribute('selected', "")

    // update active filename
    forEach(document.getElementsByClassName('active_filename'), el => {
      el.innerText = file.name; 
    });

    // update the main source view
    let doc = new JomeDocument(filepath, file.content)
    let parts = parse(doc)
    console.log("parts", parts)
    loadFileProseMirrorEditor('#prosemirror_editor', doc)
    // document.getElementById('output-editor').innerHTML = renderOutputCode(doc, parts)
    // document.getElementById('notebook-editor').innerHTML = renderNotebookView(doc, parts)
  })
}





async function setupApp() {

  let app = new NeutralinoApp()

  await app.load()

  let path = app.getData('PROJECT_PATH')

  console.log('PROJECT_PATH', path)

  let mainPanel = document.getElementById('main-panel')
  let homepage = createHomepage(app)
  mainPanel.replaceChildren(homepage)
}

document.addEventListener('DOMContentLoaded', function() {

  setupApp()

  Split(['#split-0', '#split-1', '#split-2'], {
    gutterSize: 4,
    sizes: [20, 60, 20]
  })

  const explorerList = document.getElementById('explorer-tree')
  loadFileTree(tree => {
    // explorerList.innerHTML = renderHtmlTree(tree)
    explorerList.replaceChildren(createHtmlTree(tree, leaf => {
      return {id: leaf.path, className: "leaf", "data-path": leaf.path, onclick: () => {
        openFile(leaf.path)
      }}
    }))
  })
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}