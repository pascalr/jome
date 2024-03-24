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

function getConfigForTag(tagName) {
  // The default just a single textarea. And the value is a string
  return {
    dataArea: true
  }
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

  if (config.dataArea) {
    return header+renderDataArea(data)
  } else {
    return header+renderTable(data)
    // const topLevelNodes = getTopLevelNodes(value);
  }
}

module.exports = renderData