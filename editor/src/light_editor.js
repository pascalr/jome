// import mdToHtml from "@jome/md-to-html"

import {parse, BlockType} from './parser'
import {JomeDocument} from './jome_document'

import {initProseMirrorEditor} from './prosemirror_editor'

import { loadFile, loadFileList, loadFileTree } from "./client"

import Split from 'split.js'
import renderHtmlTree from './lib/renderHtmlTree'

import { forEach } from './utils'








let _active_filepath = null
let _opened_files = []
function openFile(filepath, content) {
  // update state
  _opened_files[filepath] = content
  _active_filepath = filepath

  // update files tabs
  let filesTabs = document.getElementById("files_tabs")
  forEach(filesTabs.children, c => {
    if (c.classList.contains("active")) {c.classList.remove("active")}
  })
  let btn = document.createElement('button')
  btn.className = "tab-button active"
  btn.innerText = filepath
  filesTabs.prepend(btn)

  // update active in explorer tree
  //forAll(document.querySelectorAll("#explorer-tree li.active"), el => {
  //  el.classList.remove("active")
  //})
  //let tree = document.getElementById("explorer-tree")

  // update active filename
  forEach(document.getElementsByClassName('active_filename'), el => {
    el.innerText = filepath; 
  });

  // update the main source view
  let doc = new JomeDocument(filepath, content)
  let parts = parse(doc)
  console.log("parts", parts)
  initProseMirrorEditor('#prosemirror_editor', doc)
  // document.getElementById('output-editor').innerHTML = renderOutputCode(doc, parts)
  // document.getElementById('notebook-editor').innerHTML = renderNotebookView(doc, parts)
}







document.addEventListener('DOMContentLoaded', function() {

  Split(['#split-0', '#split-1', '#split-2'], {
    gutterSize: 4,
    sizes: [20, 60, 20]
  })

  const explorerList = document.getElementById('explorer-tree')
  loadFileTree(tree => {
    explorerList.innerHTML = renderHtmlTree(tree)
  })

  const selectSampleElement = document.getElementById('sample_select');
  loadFileList(list => {
    selectSampleElement.innerHTML = list.map(path => (
      `<option value="${path}">${path}</option>`
    ))
    selectSampleElement.value = "README.md"
    // loadFile(selectSampleElement.value)
    loadFile("README.md", openFile)
    selectSampleElement.addEventListener('change', function (event) {
      loadFile(event.target.value, openFile)
    });
  })
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}