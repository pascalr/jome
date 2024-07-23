const vscode = require("vscode");
const {LanguageClient} = require("vscode-languageclient/node");
const path = require("path");

const NodeTreeProvider = require("./src/NodeTreeProvider.js")
const JomeDataEditorProvider = require("./src/JomeDataEditorProvider.js")
const JomeNotebookSerializer = require("./src/JomeNotebookSerializer.js")
const JomeNotebookKernel = require("./src/JomeNotebookKernel.js")

let client;

const NOTEBOOK_TYPE = 'jomv-notebook-serializer';

function activate(context) {

  context.subscriptions.push(
		vscode.workspace.registerNotebookSerializer(
			NOTEBOOK_TYPE, new JomeNotebookSerializer(), { transientOutputs: true }
		),
		new JomeNotebookKernel()
	);

  context.subscriptions.push(JomeDataEditorProvider.register(context));
}

function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

// For the debugger. See package.json
vscode.commands.registerCommand('extension.vscode-jome.getProgramName', config => {
  return vscode.window.showInputBox({
    placeHolder: 'Please enter the name of a jome file in the workspace folder',
    value: 'index.jome'
  });
});

vscode.window.createTreeView('jomeExplorerNodes', {
  treeDataProvider: new NodeTreeProvider()
});

// function getWebviewContent() {
//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Jome editor</title>
// </head>
// <body>
//     <h1>Hello world</h1>
// </body>
// </html>`;
// }

// // Create and show a new webview
// vscode.window.createWebviewPanel(
//   'jomeEditor', // Identifies the type of the webview. Used internally
//   'Jome Editor', // Title of the panel displayed to the user
//   vscode.ViewColumn.One, // Editor column to show the new webview panel in.
//   {} // Webview options. More on these later.
// );

module.exports = {
  activate, deactivate
}