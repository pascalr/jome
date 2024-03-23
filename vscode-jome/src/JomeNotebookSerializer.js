const vscode = require('vscode');
const { TextDecoder, TextEncoder } = require('util');

const { parse } = require('./JomeNotebookParser.js');

class JomeNotebookSerializer {
  constructor() {
    this.label = 'Jome Notebook Serializer';
  }

	async deserializeNotebook(data, _token) {
		const contents = new TextDecoder().decode(data); // convert to String
    return new vscode.NotebookData(parse(contents));
	}

	async serializeNotebook(data, _token) {
    let str = ''
    data.cells.forEach(cell => {
      if (cell.kind === vscode.NotebookCellKind.Markup) {
        str += '###\n'+cell.value+'\n###\n'
      } else {
        if (cell.languageId === 'jome') {
          str += cell.value+'\n'
        } else {
          str += `<${cell.languageId}>`+cell.value+`</${cell.languageId}>\n`
        }
      }
    })
    return new TextEncoder().encode(str);
	}
}

module.exports = JomeNotebookSerializer