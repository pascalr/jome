const vscode = require('vscode');

// TODO: A grammar for serializing. Should be minimilalistic.
// Comments, strings, ...
// Ideally, share grammar with tokenizer, instead of parsing it twice.

function parse(text) {

  // FIXME: This does not handle # # # inside a comment. I must do a proper minimalistic grammar.
  let parts = text.split(/(?:^|\n)(###)(?:\r\n|\n|$)/)

  // Somehow there is a newline character at the end I have to remove
  let last = parts[parts.length - 1]
  if (last.charAt(last.length - 1) === '\n') {
    parts[parts.length - 1] = last.slice(0, -1)
  }

  const cells = []
  let isMdCell = false
  parts.forEach(part => {
    if (part === "###") {
      isMdCell = !isMdCell
    } else if (part.length) {
      cells.push(new vscode.NotebookCellData(
        isMdCell ? vscode.NotebookCellKind.Markup : vscode.NotebookCellKind.Code,
        part,
        isMdCell ? 'markdown' : 'jome' // TODO: any language!!! with <*.language-name> or <language-name>
      ))
    }
  })

  return cells
}

module.exports = {parse}