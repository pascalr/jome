import mdToHtml from "@jome/md-to-html"

import {parse, BlockType} from './parser'
import {JomeDocument} from './jome_document'

import {initProseMirrorEditor} from './prosemirror_editor'

import { loadFile, loadFileList } from "./client"

function handleFileLoaded(filename, src) {
  let doc = new JomeDocument(filename, src)
  let parts = parse(doc)
  console.log("parts", parts)
  initProseMirrorEditor('#prosemirror_editor', doc)
  document.getElementById('output-editor').innerHTML = renderOutputCode(doc, parts)
  document.getElementById('notebook-editor').innerHTML = renderNotebookView(doc, parts)
}

document.addEventListener('DOMContentLoaded', function() {
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

function renderJomeCode(raw, parts) {
  return ''
}

function evaluateCell(cell) {

}

function renderNotebookView(doc, parts) {
  let html = ''
  parts.forEach(part => {
    if (part.type === BlockType.html) {
      html += "<div>"+part.value+"</div>"
    } else if (part.type === BlockType.code) {
      if (doc.extension === "md") {
        html += mdToHtml(part.value)
      } else {
        html += `<pre><code>${highlight(doc, part.value.trim())}</code></pre>`
      }
    } else if (part.type === BlockType.capture && part.tag === 'code') {
      evaluateCell(part)
      html += `<pre><code>${highlight(doc, part.nested.map(o => o.value).join(''))}</code></pre>`
      html += `<div class="code_result">999 N·m</div>`
    } else if (part.type === BlockType.block && part.tag === 'html') {
      html += part.value
    } else if (part.type === BlockType.block && part.tag === 'svg') {
      html += "<svg>"+part.value+"</svg>"
    } else if (part.type === BlockType.capture && part.tag === 'input') {
      let id = `"input_${part.data.name}"`
      let type = part.data.type||"text"
      html += `<div>`
      html += `<label for=${id}>${part.data.name}: </label>`
      html += `<input id=${id} type="${type}"${part.data.defaultValue ? ` value="${part.data.defaultValue}"` : ''}>`
      if (part.data.unit && part.data.unit.endsWith("*")) {
        let u = part.data.unit.slice(0,-1)
        html += `<select name="${id}_unit" id="${id}_unit">
        <option value="${u}">${u}</option>
      </select>`
      } else if (part.data.unit) {
        html += part.data.unit
      }
      html += `</div>`
    } else if (part.type === BlockType.capture /* WIP not sure about global capture here */) {
      html += part.nested.map(o => o.value).join('')
    }
  })
  return html
}

function renderOutputCode(doc, parts) {
  return highlight(doc, doc.content)
}

function highlight(doc, code) {
  return hljs.highlight(code, {language: doc.extension}).value
}