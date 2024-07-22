import mdToHtml from "@jome/md-to-html"

import {parseJs, BlockType} from './parse_js'

import sample01 from '../samples/torque_calculator.js.txt'

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

document.addEventListener('DOMContentLoaded', function() {
  let src = sample01
  let parts = parseJs(src)
  console.log("parts", parts)
  document.getElementById('output-editor').innerHTML = renderOutputCode(src, parts)
  document.getElementById('notebook-editor').innerHTML = renderNotebookView(src, parts)
});

function renderJomeCode(raw, parts) {
  return ''
}

function renderNotebookView(raw, parts) {
  let html = ''
  parts.forEach(p => {
    if (p.type === BlockType.md) {
      html += mdToHtml(p.content)
    } else if (p.type === BlockType.js) {
      html += `<pre><code>${p.value}</code></pre>`
    } else if (p.type === BlockType.capture && p.tag === 'input') {
      let id = `"input_${p.data.name}"`
      html += `<div><label for=${id}>${p.data.name}: </label><input id=${id} /></div>`
    }
  })
  return html
}

function renderOutputCode(raw, parts) {
  return hljs.highlight(raw, {language: 'js'}).value
}