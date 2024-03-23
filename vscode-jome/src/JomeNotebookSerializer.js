const vscode = require('vscode');
const { TextDecoder, TextEncoder } = require('util');

// const { parseAndAnalyzeCode } = require('jome.js/src/compiler.js');

class JomeNotebookSerializer {
  constructor() {
    this.label = 'Jome Notebook Serializer';
  }

	async deserializeNotebook(data, token) {
		const contents = new TextDecoder().decode(data); // convert to String

    // FIXME: This does not handle # # # inside a comment. I must do a proper minimalistic grammar.
    let parts = contents.split(/(?:^|\n)(###)(?:\r\n|\n|$)/)

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

    // TODO: A grammar for serializing. Should be minimilalistic.
    // Comments, strings, ...
    // Ideally, share grammar with tokenizer, instead of parsing it twice.

    // const { parseAndAnalyzeCode } = require('jome.js/src/compiler.js');

    // let {ctxFile, nodes} = parseAndAnalyzeCode(contents)

		// // Read file contents
		// let raw;
		// try {
		// 	raw = JSON.parse(contents);
		// } catch {
		// 	raw = { cells: [] };
		// }

		// // Create array of Notebook cells for the VS Code API from file contents
		// const cells = raw.cells.map(item => new vscode.NotebookCellData(
		// 	item.kind,
		// 	item.value,
		// 	item.language
		// ));

		return new vscode.NotebookData(cells);
	}

	async serializeNotebook(data, token) {
    let str = ''
    data.cells.forEach(cell => {
      if (cell.kind === vscode.NotebookCellKind.Markup) {
        str += '###\n'+cell.value+'\n###\n'
      } else {
        str += cell.value+'\n'
      }
    })
    return new TextEncoder().encode(str);
		// // Map the Notebook data into the format we want to save the Notebook data as
		// const contents = { cells: [] };

		// for (const cell of data.cells) {
		// 	contents.cells.push({
		// 		kind: cell.kind,
		// 		language: cell.languageId,
		// 		value: cell.value
		// 	});
		// }

		// return new TextEncoder().encode(JSON.stringify(contents));
	}
}

module.exports = JomeNotebookSerializer