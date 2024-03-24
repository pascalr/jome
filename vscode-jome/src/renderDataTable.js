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

function renderDataTable(data) {
  let {value, varName, tagName} = data
  return `<div class="data-header">${varName}</div>`+testDataTable
}

module.exports = renderDataTable