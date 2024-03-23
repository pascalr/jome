const vscode = require("vscode");
const {LanguageClient} = require("vscode-languageclient/node");
const path = require("path");

const NodeTreeProvider = require("./src/NodeTreeProvider.js")
//const JomeEditorProvider = require("./src/JomeEditorProvider.js")
const JomeNotebookSerializer = require("./src/JomeNotebookSerializer.js")
const JomeNotebookKernel = require("./src/JomeNotebookKernel.js")

let client;

const NOTEBOOK_TYPE = 'jome-notebook-serializer';

function activate(context) {

  context.subscriptions.push(
		vscode.workspace.registerNotebookSerializer(
			NOTEBOOK_TYPE, new JomeNotebookSerializer(), { transientOutputs: true }
		),
		new JomeNotebookKernel()
	);

  // "customEditors": [
  //   {
  //     "viewType": "jomeEditor",
  //     "displayName": "Jome Editor",
  //     "selector": [
  //       {"filenamePattern": "*.jome"},
  //       {"filenamePattern": "*.jomm"},
  //       {"filenamePattern": "*.jomn"}
  //     ],
  //     "priority": "option"
  //   }
  // ],
  //context.subscriptions.push(JomeEditorProvider.register(context));

  // context.subscriptions.push(
  //   vscode.commands.registerCommand('jomeEditor.start', () => {
  //     // Create and show a new webview
  //     const panel = vscode.window.createWebviewPanel(
  //       'jomeEditor', // Identifies the type of the webview. Used internally
  //       'Jome Editor', // Title of the panel displayed to the user
  //       vscode.ViewColumn.One, // Editor column to show the new webview panel in.
  //       {} // Webview options. More on these later.
  //     );

  //     // And set its HTML content
  //     panel.webview.html = getWebviewContent();
  //   })
  // )

    // // The server is implemented in node
    // const serverModule = context.asAbsolutePath(
    // 	path.join('server', 'out', 'server.js')
    // );
    // // If the extension is launched in debug mode then the debug server options are used
    // // Otherwise the run options are used
    // const serverOptions: ServerOptions = {
    // 	run: { module: serverModule, transport: TransportKind.ipc },
    // 	debug: {
    // 		module: serverModule,
    // 		transport: TransportKind.ipc,
    // 	}
    // };
    
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    // const serverOptions = {
    //   command: "jome-language-server",
    //   args: ["--stdio"]
    //   //args: ["--node-ipc"]
    // };

    const serverOptions = {
      command: "node",
      args: [path.join(__dirname, "..", "language-server", "index.js"), "--stdio"]
      //args: ["--node-ipc"]
    };

    // Options to control the language client
    const clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'jome' }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
        }
    };

    // Create the language client and start the client.
    client = new LanguageClient('jomeServer', 'Jome Server', serverOptions, clientOptions);

    // Start the client. This will also launch the server
    client.start();
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