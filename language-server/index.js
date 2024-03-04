#!/usr/bin/env node

// TODO: Use TextDocument.positionAt to convert offset to line and character!!!!!!!!

// FIXME: How does unused variable work???!!!

const {
  createConnection,
	ProposedFeatures,
	DidChangeConfigurationNotification,
	CompletionItemKind,
	TextDocumentSyncKind,
  SymbolKind
} = require("vscode-languageserver/node");

// //import {validateCode} from 'jomec/src/compiler.js';
const { BindingKind } = require('jome.js/src/context.js');
const Documents = require("./src/documents");

const documents = new Documents()

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);
// WTF is this???
// const connection = (0, createConnection)(ProposedFeatures.all);

// Create a simple text document manager.
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params) => {
  connection.console.log("onInitialize")
  const capabilities = params.capabilities;
  //connection.console.log(JSON.stringify(params.initializationOptions));
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
      hoverProvider: "true",
      // signatureHelpProvider: {
      //   triggerCharacters: [ '(', ' ' ]
      // },
      // definitionProvider: "true",
      // referencesProvider: "true",
      // // documentHighlightProvider : "true", // I don't know about that one, the default is good enough?
      // colorProvider: "true",
      // // documentFormattingProvider: "true" // TODO: Not implemented yet
      // // documentRangeFormattingProvider: "true"  // TODO: Not implemented yet
      renameProvider: "true",
      documentSymbolProvider: "true",
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
  connection.console.log("onInitialized")
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

connection.onDocumentLinks(({textDocument}, token, workDoneProgress, resultProgress) => {
  connection.console.log('onDocumentLinks');

  let doc = documents.get(textDocument.uri)
  let {ctxFile} = documents.getParsed(textDocument.uri)

  let result = []
  ctxFile.filesLinks.forEach(fileLink => {
    result.push({
      range: {
        start: doc.positionAt(fileLink.startIndex),
        end: doc.positionAt(fileLink.endIndex),
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
connection.onCompletion(({textDocument}) => {
  connection.console.log('onCompletion');

  let {ctxFile, bindings} = documents.getParsed(textDocument.uri)

  let classIdentifiers = [...ctxFile.classIdentifiers]
  let bindingIdentifiers = []
  
  let rawKeywords = "new|chain|with|then|end|if|class|export|import|from|for|in|while|do|def|var|let|code|unit|return|module|interface|main|type|else|elif|elsif";
  let keywords = rawKeywords.split('|').map(k => ({ label: k, kind: CompletionItemKind.Keyword }));
  
  Object.keys(bindings).forEach(k => {
    let binding = bindings[k]
    bindingIdentifiers.push(bindingKindToCompletionItemKind(binding.kind))
  })
  // CompletionItemKind.Method, Function, Constant, Unit, Struct, Interface, Variable, ...
  return [
      ...keywords,
      ...classIdentifiers.map(k => ({ label: k, kind: CompletionItemKind.Class })),
      ...bindingIdentifiers
  ];
});

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(item => {
  connection.console.log('onCompletionResolve');
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
connection.onHover(({textDocument, position}, token, workDoneProgress, resultProgress) => {
  connection.console.log('onHover')
  let doc = documents.get(textDocument.uri)
  let {ctxFile, bindings} = documents.getParsed(textDocument.uri)
  let index = doc.offsetAt(position)
  let occurence = ctxFile.validOccurences.find(o => o.startIndex <= index && o.endIndex > index)
  // FIXME: How to colorize the contents?
  if (occurence) {
    return {
      contents: {
        kind: 'markdown',
        value: `(${bindingKindToText(occurence.kind)}) ${occurence.name}
___
This is *some* description.
\\033[31;1;4mHello\\033[0m
Hooooooow tooooo adddddd collloooorrrrssss?!?!?!?!?!`
      }
    }
  }
})

// connection.onSignatureHelp((params, token, workDoneProgress, resultProgress) => {
//   let {textDocument, position} = params
//   connection.console.log('onSignatureHelp')
//   return {
//     signatures: [{
//       label: 'onSignatureHelp label',
//       documentation: 'onSignatureHelp documentation'
//     }],
//     activeParameter: 0
//   }
// })

// // /**
// //      * Represents the connection of two locations. Provides additional metadata over normal {@link Location locations},
// //      * including an origin range.
// //  */
// // export interface LocationLink {
// //   /**
// //    * Span of the origin of this link.
// //    *
// //    * Used as the underlined span for mouse interaction. Defaults to the word range at
// //    * the definition position.
// //    */
// //   originSelectionRange?: Range;
// //   /**
// //    * The target resource identifier of this link.
// //    */
// //   targetUri: DocumentUri;
// //   /**
// //    * The full target range of this link. If the target for example is a symbol then target range is the
// //    * range enclosing this symbol not including leading/trailing whitespace but everything else
// //    * like comments. This information is typically used to highlight the range in the editor.
// //    */
// //   targetRange: Range;
// //   /**
// //    * The range that should be selected and revealed when this link is being followed, e.g the name of a function.
// //    * Must be contained by the `targetRange`. See also `DocumentSymbol#range`
// //    */
// //   targetSelectionRange: Range;
// // }

// connection.onDefinition((params, token, workDoneProgress, resultProgress) => {
//   let {textDocument, position} = params
//   connection.console.log("onDefinition")
// })

// connection.onReferences((params, token, workDoneProgress, resultProgress) => {
//   let {textDocument, position, context} = params
//   connection.console.log("onReferences")
// })

// connection.onDocumentHighlight((params, token, workDoneProgress, resultProgress) => {
//   let {textDocument, position} = params
//   connection.console.log("onDocumentHighlight")
// })

// connection.onDocumentColor((params, token, workDoneProgress, resultProgress) => {
//   let {textDocument} = params
//   connection.console.log("onDocumentColor")
// })

// connection.onColorPresentation((params, token, workDoneProgress, resultProgress) => {
//   let {textDocument, color, range} = params
//   connection.console.log("onColorPresentation")
// })

connection.onPrepareRename(({textDocument, position}, token) => {
  connection.console.log("onPrepareRename")
})

connection.onRenameRequest(({textDocument, position, newName}, token, workDoneProgress, resultProgress) => {
  connection.console.log("onRenameRequest")
})

/**
 * This mainly adds the symbol to the outline accordeon on the explorer tab.
 * It also adds the symbol to the path just above the editor when you click on it.
 */
connection.onDocumentSymbol(({textDocument}, token, workDoneProgress, resultProgress) => {
  connection.console.log("onDocumentSymbol")

  let doc = documents.get(textDocument.uri)
  let {ctxFile, bindings} = documents.getParsed(textDocument.uri)

  let list = []

  ctxFile.symbols.forEach(symbol => {
    list.push({
      name: symbol.name,
      detail: "Symbol detail",
      kind: bindingKindToSymbolKind(symbol.kind),
      //tags: [],
      deprecated: false,
      range: {start: doc.positionAt(symbol.startIndex), end: doc.positionAt(symbol.endIndex)}, // To determine if cursor is inside the symbol
      selectionRange: {start: doc.positionAt(symbol.startIndex), end: doc.positionAt(symbol.endIndex)}, // Highlight for example the name of the function, must be included in range
      //children: []
    })
  })

  return list
})

documents.listen(connection);

console.log('Listening...')
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map
console.log('Done')

function bindingKindToCompletionItemKind(kind) {
  switch (kind) {
    case BindingKind.Class: return CompletionItemKind.Class
    case BindingKind.Function: return CompletionItemKind.Function
    case BindingKind.Variable: return CompletionItemKind.Variable
    default: throw new Error("asdfasf9i23hf09ahsn0fp")
  }
}

function bindingKindToSymbolKind(kind) {
  switch (kind) {
    case BindingKind.Class: return SymbolKind.Class
    case BindingKind.Function: return SymbolKind.Function
    case BindingKind.Variable: return SymbolKind.Variable
    default: throw new Error("asdfasf9i23hf09ahsn0fp")
  }
}

function bindingKindToText(kind) {
  switch (kind) {
    case BindingKind.Class: return 'class'
    case BindingKind.Function: return 'function'
    case BindingKind.Variable: return 'variable'
    default: return 'undefined'
  }
}