const vscode = require('vscode');
const { TextDecoder, TextEncoder } = require('util');

// const { parseAndAnalyzeCode } = require('jome.js/src/compiler.js');

class JomeNotebookSerializer {
  constructor() {
    this.label = 'Jome Notebook Serializer';
  }

	async deserializeNotebook(data, token) {
		const contents = new TextDecoder().decode(data); // convert to String

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

    const cells = [new vscode.NotebookCellData(
			vscode.NotebookCellKind.Code,
			contents,
			'jome'// item.cell_type === 'code' ? 'python' : 'markdown'
		)];

		return new vscode.NotebookData(cells);
	}

	async serializeNotebook(data, token) {
    let str = data.cells[0].value
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