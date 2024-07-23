const vscode = require('vscode');

// TODO: "notebook.showCellStatusBar": false,
// https://github.com/microsoft/vscode-jupyter/issues/6024

/**
 * The kernel seems to be the thing responsible to execute the code cells.
 */
class JomeNotebookKernel {

	constructor() {

    this._id = 'jome-notebook-serializer-kernel';
    this._label = 'Jome Notebook Kernel';
    this._supportedLanguages = ['jome'];

    this._executionOrder = 0;

		this._controller = vscode.notebooks.createNotebookController(this._id,
			'jome-notebook-serializer',
			this._label);

		this._controller.supportedLanguages = this._supportedLanguages;
		this._controller.supportsExecutionOrder = true;
		this._controller.executeHandler = this._executeAll.bind(this);
	}

	dispose() {
		this._controller.dispose();
	}

	_executeAll(cells, _notebook, _controller) {
		for (const cell of cells) {
			this._doExecution(cell);
		}
	}

	async _doExecution(cell) {
		const execution = this._controller.createNotebookCellExecution(cell);

		execution.executionOrder = ++this._executionOrder;
		execution.start(Date.now());

		try {
			execution.replaceOutput([new vscode.NotebookCellOutput([
				vscode.NotebookCellOutputItem.text('<div><b>Hello</b> World</div>', 'text/x-html'),
			])]);

			execution.end(true, Date.now());
		} catch (err) {
			execution.replaceOutput([new vscode.NotebookCellOutput([
				vscode.NotebookCellOutputItem.error(err)
			])]);
			execution.end(false, Date.now());
		}
	}
}

module.exports = JomeNotebookKernel