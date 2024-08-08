import mdToHtml from "@jome/md-to-html"
import {LooseParser} from "acorn-loose"

import {parse, BlockType} from './parser'
import {Document} from './document'

// Create an instance of ESLint with the configuration passed to the function
// function createESLintInstance(overrideConfig) {
//   return new ESLint({
//     overrideConfigFile: true,
//     overrideConfig,
//     fix: true,
//   });
// }

/**
 * The data analyzed inside a jome meta data comment delimited by `/*~` and *\/`
 */
class MetaData {
  constructor(type, value) {
    this.type = type // The main type of the meta data. Ex: unit, function, class, md, ...
    this.value = value // The text value of the meta data.
  }
}

function parseMetaDatas(metaDataComments) {
  const metaDatas = []
  metaDataComments.forEach(data => {
    // FIXME: parse properly so not spliting inside string
    let parts = data.value.split(/(~\w+)/g)
    if (parts.length >= 3) {
      metaDatas.push(new MetaData(parts[1].slice(1), parts[2]))
    }
    // for (let i = 1; i < parts.length; i++) {
    //   let label = parts[i].slice(1)
    //   let value = parts[i+1]
    //   metaData[label] = value
    // }
  })
  console.log("metaDatas: ", metaDatas)
  return metaDatas
}

function loadFile(filename) {
  document.getElementById("current_filename").innerText = filename
  fetch('/editor/samples/'+filename)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.text(); // Convert response to text
  })
  .then(src => {
    let doc = new Document(filename, src)
    let parts = parse(doc)
    console.log("parts", parts)
    document.getElementById('output-editor').innerHTML = renderOutputCode(doc, parts)
    document.getElementById('notebook-editor').innerHTML = renderNotebookView(doc, parts)
  })
  // .catch(error => {
  //   // TODO: handle error
  //   // document.getElementById('file-content').textContent = 'Error: ' + error;
  // });
}

document.addEventListener('DOMContentLoaded', function() {
  const selectSampleElement = document.getElementById('sample_select');
  loadFile(selectSampleElement.value)
  selectSampleElement.addEventListener('change', function (event) {
    loadFile(event.target.value)
  });
});

function renderJomeCode(raw, parts) {
  return ''
}

function evaluateCell(cell) {

}

function renderNotebookView(doc, parts) {
  let html = ''
  parts.forEach(p => {
    if (p.type === BlockType.md) {
      html += mdToHtml(p.value)
    } else if (p.type === BlockType.code) {
      if (doc.extension === "md") {
        html += mdToHtml(p.value)
      } else {
        html += `<pre><code>${highlight(doc, p.value.trim())}</code></pre>`
      }
    } else if (p.type === BlockType.capture && p.tag === 'code') {
      evaluateCell(p)
      html += `<pre><code>${highlight(doc, p.nested.map(o => o.value).join(''))}</code></pre>`
      html += `<div class="code_result">999 N·m</div>`
    } else if (p.type === BlockType.block && p.tag === 'html') {
      html += p.value
    } else if (p.type === BlockType.block && p.tag === 'svg') {
      html += "<svg>"+p.value+"</svg>"
    } else if (p.type === BlockType.capture && p.tag === 'input') {
      let id = `"input_${p.data.name}"`
      let type = p.data.type||"text"
      html += `<div>`
      html += `<label for=${id}>${p.data.name}: </label>`
      html += `<input id=${id} type="${type}"${p.data.defaultValue ? ` value="${p.data.defaultValue}"` : ''}>`
      if (p.data.unit && p.data.unit.endsWith("*")) {
        let u = p.data.unit.slice(0,-1)
        html += `<select name="${id}_unit" id="${id}_unit">
        <option value="${u}">${u}</option>
      </select>`
      } else if (p.data.unit) {
        html += p.data.unit
      }
      html += `</div>`
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