// import mdToHtml from "@jome/md-to-html"

import {parse, BlockType} from './parser'
import {JomeDocument} from './jome_document'

import {initProseMirrorEditor} from './prosemirror_editor'

import { loadFile, loadFileList } from "./client"

import Split from 'split.js'

function handleFileLoaded(filename, src) {
  var els = document.getElementsByClassName('filename');
  for (var i = 0; i < els.length; i++) {
    els[i].innerText = filename; 
  }
  let doc = new JomeDocument(filename, src)
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

  const selectSampleElement = document.getElementById('sample_select');
  loadFileList(list => {
    selectSampleElement.innerHTML = list.map(path => (
      `<option value="${path}">${path}</option>`
    ))
    selectSampleElement.value = "README.md"
    // loadFile(selectSampleElement.value)
    loadFile("README.md", handleFileLoaded)
    selectSampleElement.addEventListener('change', function (event) {
      loadFile(event.target.value, handleFileLoaded)
    });
  })
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}