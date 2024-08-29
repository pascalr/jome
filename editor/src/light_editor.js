// import mdToHtml from "@jome/md-to-html"

import {parse, BlockType} from './parser'
import {JomeDocument} from './jome_document'

import {initProseMirrorEditor} from './prosemirror_editor'

import { loadFile, loadFileList, loadFileTree } from "./client"

import Split from 'split.js'
import renderHtmlTree from './lib/renderHtmlTree'

import { forEach } from './utils'







let _active_filename = null
let _opened_files = []
function openFile(filename, content) {
  // update state
  _opened_files[filename] = content
  _active_filename = filename

  // update files tabs
  let filesTabs = document.getElementById("files_tabs")
  forEach(filesTabs.children, c => {
    if (c.classList.contains("active")) {c.classList.remove("active")}
  })
  let btn = document.createElement('button')
  btn.className = "tab-button active"
  btn.innerText = filename
  filesTabs.prepend(btn)

  // update active filename
  forEach(document.getElementsByClassName('active_filename'), el => {
    el.innerText = filename; 
  });

  // update the main source view
  let doc = new JomeDocument(filename, content)
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