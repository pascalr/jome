// function createTable(cols=2, rows=2) {
//   let table = document.createElement('table');
//   for (let i = 0; i < rows; i++) {
//     let row = document.createElement('tr');
//     for (let j = 0; j < cols; j++) {
//       let cell = document.createElement('td');
//       cell.textContent = `Item ${i*cols + j}`;
//       row.appendChild(cell);
//     }
//     table.appendChild(row);
//   }
//   document.body.appendChild(table);
// }

function getTopLevelNodes(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const root = xmlDoc.documentElement;
  return Array.from(root.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);
}

let testDataTable = `<table>
  <tr>
    <td>Row 1, Column 1</td>
    <td>Row 1, Column 2</td>
    <td>Row 1, Column 3</td>
  </tr>
  <tr>
    <td>Row 2, Column 1</td>
    <td>Row 2, Column 2</td>
    <td>Row 2, Column 3</td>
  </tr>
  <tr>
    <td>Row 3, Column 1</td>
    <td>Row 3, Column 2</td>
    <td>Row 3, Column 3</td>
  </tr>
</table>
`

// render can be:
// field: Rendered as the name of the field of the left, and the data on the right
// textarea: Rendered with the name above, and the data in a kind of text area below
// object: An object will be decomposed and furter parameters will define how to render it

const DEFAULT_CONFIGS = {
  nb: {
    render: 'field'
  }
}

const DEFAULT_CONFIG = {
  render: 'textarea'
}

function getConfigForTag(tagName) {
  // TODO: Parse config.jome and get the config from there
  return DEFAULT_CONFIGS[tagName] || DEFAULT_CONFIG
}

function encodeHtmlString(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderHeader(data) {
  return `<div class="data-header">
  <span class="data-header-name">${data.varName}</span>
</div>`
// <span class="data-header-tag">${data.tagName}</span>
}

function renderDataField(data) {
  return `<div class="data_field">
  <span class="data_field_name">${data.varName}</span>
  <span class="data_field_value">${encodeHtmlString(data.value)}</span>
</div>`
}

function renderDataArea(data) {
  // TODO: Show tag name in the bottom right of data area. It should be a dropdown that allows you
  // to change the type of the data area, like in the notebook.
  return `<pre class="data_cell"><code>${encodeHtmlString(data.value)}</code></pre>`
}

function renderTable(data) {
  // encodeHtmlString
  return testDataTable
}

function renderData(data) {
  let {value, varName, tagName} = data

  let config = getConfigForTag(tagName)
  let header = renderHeader(data)

  if (config.render === 'object') {
    // const topLevelNodes = getTopLevelNodes(value);
    return header+renderTable(data)
  } else if (config.render === 'field') {
    return renderDataField(data)
  } else {
    return header+renderDataArea(data)
  }
}

module.exports = renderData