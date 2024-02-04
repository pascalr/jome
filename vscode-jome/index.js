const {workspace} = require("vscode");
const {LanguageClient} = require("vscode-languageclient/node");

let client;

function activate(context) {
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
    const serverOptions = {
        command: "jome-language-server",
        args: ["--stdio"]
        //args: ["--node-ipc"]
    };

    // Options to control the language client
    const clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'jome' }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
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

module.exports = {
  activate, deactivate
}