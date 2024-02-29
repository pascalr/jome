#!/usr/bin/env node

/*
TODO:
# Some func does something
def someFunc(int someArg)
end

someFunc(

TODO: Hover someFunc
TODO: Help with function signatures
TODO: When someFunc is used, link to where it is created
TODO: When double clicking someFunc, highlight all in the same lex env only
TODO: Show parameter type
TODO: Show function documentation
TODO: Rename!!!!!
TODO: Folding
*/

// TODO: <color>#FFF</color>: Use DocumentColor & Color Presentation

// TODO: Formatting (use config as defined inside config.jome)

// FIXME: How does unused variable work???!!!

const {
  createConnection,
	TextDocuments,
	ProposedFeatures,
	DidChangeConfigurationNotification,
	CompletionItemKind,
	TextDocumentSyncKind,
  DiagnosticSeverity,
} = require("vscode-languageserver/node");

const {TextDocument} = require("vscode-languageserver-textdocument");

// //import {validateCode} from 'jomec/src/compiler.js';
const { parseAndAnalyzeCode } = require('jome.js/src/compiler.js');
const { BindingKind } = require('jome.js/src/context.js');

// This stores the parsed data for every file
const dataByURI = {}

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);
// WTF is this???
// const connection = (0, createConnection)(ProposedFeatures.all);

// Create a simple text document manager.
const documents = new TextDocuments(TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params) => {
  const capabilities = params.capabilities;
  connection.console.log(JSON.stringify(params.initializationOptions));
  // Does the client support the `workspace/configuration` request?
  // If not, we fall back using global settings.
  hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
  hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
  hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
      capabilities.textDocument.publishDiagnostics &&
      capabilities.textDocument.publishDiagnostics.relatedInformation);
      
  const result = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true
      },
      documentLinkProvider: {
        resolveProvider: true
      },
      hoverProvider : "true",
      signatureHelpProvider : {
        triggerCharacters: [ '(', ' ' ]
      },
      definitionProvider : "true",
      referencesProvider : "true",
      // documentHighlightProvider : "true", // I don't know about that one, the default is good enough?
    }
  };
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true
      }
    };
  }
  return result;
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    connection.client.register(DidChangeConfigurationNotification.type, undefined);
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders(_event => {
      connection.console.log('Workspace folder change event received.');
    });
  }
});

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings = { maxNumberOfProblems: 1000 };
let globalSettings = defaultSettings;
// Cache the settings of all open documents
const documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
  if (hasConfigurationCapability) {
      // Reset all cached document settings
      documentSettings.clear();
  }
  else {
      globalSettings = ((change.settings.languageServerExample || defaultSettings));
  }
  // Revalidate all open text documents
  documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource) {
  if (!hasConfigurationCapability) {
      return Promise.resolve(globalSettings);
  }
  let result = documentSettings.get(resource);
  if (!result) {
      result = connection.workspace.getConfiguration({
          scopeUri: resource,
          section: 'languageServerExample'
      });
      documentSettings.set(resource, result);
  }
  return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
  validateTextDocument(change.document);
});

connection.onDidOpenTextDocument((params) => {
  // A text document was opened in VS Code.
  // params.uri uniquely identifies the document. For documents stored on disk, this is a file URI.
  // params.text the initial full content of the document.
  validateTextDocument(params.text)
});

connection.onDidChangeTextDocument((params) => {
  // The content of a text document has change in VS Code.
  // params.uri uniquely identifies the document.
  // params.contentChanges describe the content changes to the document.
  console.log('content changes', params.contentChanges)
  validateTextDocument(params.contentChanges)
});

connection.onDidCloseTextDocument((params) => {
  // A text document was closed in VS Code.
  // params.uri uniquely identifies the document.
});

async function validateTextDocument(textDocument) {
  console.log('Validate text document begin')
  // In this simple example we get the settings for every validate run.
  const settings = await getDocumentSettings(textDocument.uri);
  const text = textDocument.getText();
  const diagnostics = [];
  try {
    let {ctxFile, nodes} = parseAndAnalyzeCode(text)
    let bindings = ctxFile.lexEnv.getAllBindings()
    dataByURI[textDocument.uri] = {ctxFile, nodes, bindings}
    let errors = ctxFile.errors
    console.log('Errors found: ', errors)
    for (let i = 0; i < errors.length && i < settings.maxNumberOfProblems; i++) {
      let err = errors[i]
      let startIndex = err.startIndex || 10 // random number temporary for testing
      let endIndex = err.endIndex || 20 // random number temporary for testing
      const diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: textDocument.positionAt(startIndex),
          end: textDocument.positionAt(endIndex)
        },
        message: err.message || err,
        source: 'jome(1234)'
      };
      // if (hasDiagnosticRelatedInformationCapability) {
      // 	diagnostic.relatedInformation = [
      // 		{
      // 			location: {
      // 				uri: textDocument.uri,
      // 				range: Object.assign({}, diagnostic.range)
      // 			},
      // 			message: 'Spelling matters'
      // 		},
      // 		{
      // 			location: {
      // 				uri: textDocument.uri,
      // 				range: Object.assign({}, diagnostic.range)
      // 			},
      // 			message: 'Particularly for names'
      // 		}
      // 	];
      // }
      diagnostics.push(diagnostic);
    }
    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
  } catch (err) {
    connection.console.error(err.stack);
  }
}

connection.onDidChangeWatchedFiles(_change => {
  // Monitored files have change in VSCode
  connection.console.log('We received an file change event');
});

// FIXME................
// onDocumentLinks is sometime called before validate document
// TODO: validate document if not already validated
connection.onDocumentLinks((params, token, workDoneProgress, resultProgress) => {
  connection.console.log('onDocumentLinks');

  let uri = params.textDocument.uri
  connection.console.log('uri: '+uri);
  if (!dataByURI[uri]) {
    connection.console.log("Can't send document links document has not been parsed yet");
    return null
  }
  let {ctxFile} = dataByURI[uri]

  let result = []
  ctxFile.filesLinks.forEach(fileLink => {
    result.push({
      range: {
        start: fileLink.startIndex,
        end: fileLink.endIndex,
      },
      //target: uri, //fileLink.file, // FIXME: Must be a URI (file:///home/...)
      tooltip: 'thisisatooltip'
    })
  })

  connection.console.log('Found '+result.length+' document links.');

  return result
})

connection.onDocumentLinkResolve((params, token) => {
  connection.console.log('onDocumentLinkResolve');
})

// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition) => {

  let uri = _textDocumentPosition.textDocument.uri
  let {ctxFile, bindings} = dataByURI[uri]

  let classIdentifiers = [...ctxFile.classIdentifiers]
  let bindingIdentifiers = []
  
  let rawKeywords = "new|chain|with|then|end|if|class|export|import|from|for|in|while|do|def|var|let|code|unit|return|module|interface|main|type|else|elif|elsif";
  let keywords = rawKeywords.split('|').map(k => ({ label: k, kind: CompletionItemKind.Keyword }));
  
  Object.keys(bindings).forEach(k => {
    let binding = bindings[k]
    if (binding.kind === BindingKind.Function) {
      bindingIdentifiers.push({ label: k, kind: CompletionItemKind.Function })
    } else if (binding.kind === BindingKind.Variable) {
      bindingIdentifiers.push({ label: k, kind: CompletionItemKind.Variable })
    } else {
      bindingIdentifiers.push({ label: k, kind: CompletionItemKind.Text })
    }
  })
  // CompletionItemKind.Method
  // CompletionItemKind.Function
  // CompletionItemKind.Constant
  // CompletionItemKind.Unit
  // CompletionItemKind.Struct
  // CompletionItemKind.Interface
  // CompletionItemKind.Variable
  return [
      ...keywords,
      ...classIdentifiers.map(k => ({ label: k, kind: CompletionItemKind.Class })),
      ...bindingIdentifiers
  ];
});

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(item => {
  // if (item.data === 1) {
  //   item.detail = 'TypeScript details';
  //   item.documentation = 'TypeScript documentation';
  // } else if (item.data === 2) {
  //   item.detail = 'JavaScript details';
  //   item.documentation = 'JavaScript documentation';
  // }
  return item;
});

// Je vais voir les autres options avant de continuer plus loin, ce n'est pas trop clair comment ça fonctionne
connection.onHover((params, token, workDoneProgress, resultProgress) => {
  connection.console.log('onHover')
  let uri = params.textDocument.uri
  let {ctxFile, bindings} = dataByURI[uri]
  // Somehow params.line starts at 0...
  let lineStartIndex = ctxFile.linesStartIndex[params.position.line+1]
  if (!lineStartIndex) {return null}
  let index = lineStartIndex + params.position.character
  let occurence = ctxFile.occurences.find(o => o.startIndex <= index && o.endIndex > index)
  // FIXME: How to colorize the contents?
  if (occurence) {
    return {
      contents: `(${occurence.kind}) ${occurence.name}`
    }
  }
})

connection.onSignatureHelp((params, token, workDoneProgress, resultProgress) => {
  let {textDocument, position} = params
  connection.console.log('onSignatureHelp')
  return {
    signatures: [{
      label: 'onSignatureHelp label',
      documentation: 'onSignatureHelp documentation'
    }],
    activeParameter: 0
  }
})

// /**
//      * Represents the connection of two locations. Provides additional metadata over normal {@link Location locations},
//      * including an origin range.
//  */
// export interface LocationLink {
//   /**
//    * Span of the origin of this link.
//    *
//    * Used as the underlined span for mouse interaction. Defaults to the word range at
//    * the definition position.
//    */
//   originSelectionRange?: Range;
//   /**
//    * The target resource identifier of this link.
//    */
//   targetUri: DocumentUri;
//   /**
//    * The full target range of this link. If the target for example is a symbol then target range is the
//    * range enclosing this symbol not including leading/trailing whitespace but everything else
//    * like comments. This information is typically used to highlight the range in the editor.
//    */
//   targetRange: Range;
//   /**
//    * The range that should be selected and revealed when this link is being followed, e.g the name of a function.
//    * Must be contained by the `targetRange`. See also `DocumentSymbol#range`
//    */
//   targetSelectionRange: Range;
// }

connection.onDefinition((params, token, workDoneProgress, resultProgress) => {
  let {textDocument, position} = params
  connection.console.log("onDefinition")
})

connection.onReferences((params, token, workDoneProgress, resultProgress) => {
  let {textDocument, position, context} = params
  connection.console.log("onReferences")
})

connection.onDocumentHighlight((params, token, workDoneProgress, resultProgress) => {
  let {textDocument, position} = params
  connection.console.log("onDocumentHighlight")
})

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

console.log('Listening...')
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map
console.log('Done')