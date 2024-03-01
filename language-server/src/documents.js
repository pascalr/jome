// TODO: Work in progress

const {TextDocument} = require("vscode-languageserver-textdocument");

class Documents {

  constructor() {
    this.docsByUri = {}
    this.parsedDataByUri = {}
  }

  getParsed(uri) {
    return this.parsedDataByUri[uri]
  }
  
  get(uri) {
    return this.docsByUri[uri]
  }
  
  all() {
    return Object.values(this.docsByUri)
  }

  listen(connection) {
    //connection.__textDocumentSync = vscode_languageserver_protocol_1.TextDocumentSyncKind.Incremental;
    
    connection.onDidOpenTextDocument(({textDocument: td}) => {
      connection.console.log("onDidOpenTextDocument")
      connection.console.log("TODO: Check text document text here, I believe it contains the text and I should validate here")
      let doc = TextDocument.create(td.uri, td.languageId, td.version, td.text)
      this.docsByUri[td.uri] = doc
    })

    connection.onDidChangeTextDocument(({textDocument, contentChanges}) => {
      connection.console.log("onDidChangeTextDocument")
      let version = textDocument.version
      if (contentChanges.length === 0) { return; }
      if (version === null || version === undefined) {
        throw new Error(`Received document change event for ${textDocument.uri} without valid version identifier`);
      }
      let doc = this.docsByUri[textDocument.uri]
      if (doc !== undefined) {
        doc = TextDocument.update(doc, contentChanges, version);
        this.docsByUri[textDocument.uri] = doc
      }
    })

    connection.onDidCloseTextDocument((event) => {
      connection.console.log("onDidCloseTextDocument")
      let syncedDocument = this.docsByUri[event.textDocument.uri]
      if (syncedDocument !== undefined) {
        delete this.docsByUri[event.textDocument.uri]
      }
    })

    // connection.onWillSaveTextDocument((event) => {
    //   let doc = this.documents.get(event.textDocument.uri);
    // })

    // connection.onWillSaveTextDocumentWaitUntil((event, token) => {
    //   let doc = this.documents.get(event.textDocument.uri);
    // })

    // connection.onDidSaveTextDocument((event) => {
    //   let doc = this.documents.get(event.textDocument.uri);
    // })

    // connection.onDidChangeWatchedFiles(_change => {
    //   connection.console.log('onDidChangeWatchedFiles');
    // });
  }
}

module.exports = Documents;