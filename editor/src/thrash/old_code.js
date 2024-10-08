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

// Create an instance of ESLint with the configuration passed to the function
// function createESLintInstance(overrideConfig) {
//   return new ESLint({
//     overrideConfigFile: true,
//     overrideConfig,
//     fix: true,
//   });
// }


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