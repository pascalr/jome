const vscode = require('vscode');

// TODO: A grammar for serializing. Should be minimilalistic.
// Comments, strings, ...
// Ideally, share grammar with tokenizer, instead of parsing it twice.

// TODO: Handle escape character \
let RULES = [
  { begin: "//", end: "\n" },
  { begin: "# ", end: "\n" },
  { begin: "/*", end: "*/" },
  { begin: "\"", end: "\"" },
  { begin: "'", end: "'" },
  { begin: "`", end: "`" },
  { begin: "###", end: "###", type: 'MD_CELL' },
  //{ begin: "<(\w+)>", end: "</\\1>", type: 'DATA_CELL' },
]
let CODE_TYPE = 'CODE_CELL'

function createCell(type, value) {
  if (type === CODE_TYPE) {
    return new vscode.NotebookCellData(vscode.NotebookCellKind.Code, value, 'jome')
  } else if (type === 'MD_CELL') {
    return new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, value, 'markdown')
  } else {
    throw new Error("TODO 7fs82u3hr97sgfuas3ubrfusf9qw3")
  }
}

function parseWithRules(input) {
  let matches = [];

  let code = "";
  for (let i = 0; i < input.length; i++) {
    for (let rule of RULES) {
      // This does not work with regex for data cell
      if (input.startsWith(rule.begin, i)) {
        let endIndex = input.indexOf(rule.end, i);
        let sub = input.substring(i, endIndex);
        if (rule.type) {
          if (code) { matches.push(createCell(CODE_TYPE, code)) }
          matches.push(createCell(rule.type, sub))
        } else {
          code.push(sub)
        }
        i = endIndex
        break;
      }
    }
  }

  if (code) { matches.push(createCell(CODE_TYPE, code)) }

  return matches;
}

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