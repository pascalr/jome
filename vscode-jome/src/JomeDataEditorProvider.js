const vscode = require('vscode');

const getMarkdownRenderer = require('./getMarkdownRenderer.js')
const {parse, MD_TYPE, CODE_TYPE, DATA_TYPE} = require('./JomeNotebookParserV2.js')

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}



class JomeDataEditorProvider {

	static register(context) {
		const provider = new JomeDataEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(JomeDataEditorProvider.viewType, provider);
		return providerRegistration;
	}

	static viewType = 'jomeDataEditor';

	constructor(context) {
    this.context = context
  }

	/**
	 * Called when our custom editor is opened.
	 */
	async resolveCustomTextEditor(document,	webviewPanel,	_token) {
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    const mdRenderer = getMarkdownRenderer(true) // FIXME: This does not exist: this.context.workspace.isTrusted

		function updateWebview() {
      let text = document.getText()
      let parsed = parse(text)
      let rendered = parsed.map(p => {
        if (p.type === CODE_TYPE) {
          return p.value
        } else if (p.type === MD_TYPE) {
          return mdRenderer(p.value)
        } else if (p.type === DATA_TYPE) {
          return p.value
        } else {
          throw new Error("TODO 7fs82u3hr97sgfuas3ubrfusf9qw3")
        }
      }).join('\n')
			webviewPanel.webview.postMessage({
				type: 'update',
				text: rendered,
			});
		}

		// Hook up event handlers so that we can synchronize the webview with the text document.
		//
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		// 
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(e => {
			switch (e.type) {
				case 'add':
					this.addNewScratch(document);
					return;

				case 'delete':
					this.deleteScratch(document, e.id);
					return;
			}
		});

		updateWebview();
	}

	/**
	 * Get the static html used for the editor webviews.
	 */
	getHtmlForWebview(webview) {
		// Local path to script and css for the webview
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'view', 'jomeEditor.js'));

		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'view', 'reset.css'));

		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'view', 'vscode.css'));

		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'view', 'jomeEditor.css'));

		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

    // Use a content security policy to only allow loading images from https or from our extension directory,
    // and only allow scripts that have a specific nonce.
		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet" />
				<link href="${styleVSCodeUri}" rel="stylesheet" />
				<link href="${styleMainUri}" rel="stylesheet" />

				<title>Jome Editor</title>
			</head>
			<body>
				<div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

	/**
	 * Add a new scratch to the current document.
	 */
	addNewScratch(document) {
		const json = this.getDocumentAsJson(document);
		const character = CatScratchEditorProvider.scratchCharacters[Math.floor(Math.random() * CatScratchEditorProvider.scratchCharacters.length)];
		json.scratches = [
			...(Array.isArray(json.scratches) ? json.scratches : []),
			{
				id: getNonce(),
				text: character,
				created: Date.now(),
			}
		];

		return this.updateTextDocument(document, json);
	}

	/**
	 * Delete an existing scratch from a document.
	 */
	deleteScratch(document, id) {
		const json = this.getDocumentAsJson(document);
		if (!Array.isArray(json.scratches)) {
			return;
		}

		json.scratches = json.scratches.filter((note) => note.id !== id);

		return this.updateTextDocument(document, json);
	}

	/**
	 * Try to get a current document as json text.
	 */
	getDocumentAsJson(document) {
		const text = document.getText();
		if (text.trim().length === 0) {
			return {};
		}

		try {
			return JSON.parse(text);
		} catch {
			throw new Error('Could not get document as json. Content is not valid json');
		}
	}

	/**
	 * Write out the json to a given document.
	 */
	updateTextDocument(document, json) {
		const edit = new vscode.WorkspaceEdit();

		// Just replace the entire document every time for this example extension.
		// A more complete extension should compute minimal edits instead.
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			JSON.stringify(json, null, 2));

		return vscode.workspace.applyEdit(edit);
	}
}

module.exports = JomeDataEditorProvider