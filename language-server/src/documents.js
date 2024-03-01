// TODO: Work in progress

const {TextDocument} = require("vscode-languageserver-textdocument");

class Documents {

  constructor() {
    this.documents = new Map()
  }
  
  get(uri) {
    return this.documents.get(uri)
  }
  
  all() {
    return Array.from(this.documents.values())
  }

  listen(connection) {
    //connection.__textDocumentSync = vscode_languageserver_protocol_1.TextDocumentSyncKind.Incremental;
    
    connection.onDidOpenTextDocument(({textDocument: td}) => {
      connection.console.log("TODO: Check text document text here, I believe it contains the text and I should validate here")
      let doc = TextDocument.create(td.uri, td.languageId, td.version, td.text)
      this.documents.set(td.uri, doc);
    })

    connection.onDidChangeTextDocument(({textDocument, contentChanges}) => {
      let version = textDocument.version
      if (contentChanges.length === 0) { return; }
      if (version === null || version === undefined) {
        throw new Error(`Received document change event for ${textDocument.uri} without valid version identifier`);
      }
      let doc = this.documents.get(textDocument.uri);
      if (doc !== undefined) {
        doc = TextDocument.update(doc, contentChanges, version);
        this.documents.set(textDocument.uri, doc);
      }
    })

    connection.onDidCloseTextDocument((event) => {
      let syncedDocument = this.documents.get(event.textDocument.uri);
      if (syncedDocument !== undefined) {
        this.documents.delete(event.textDocument.uri);
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
  }
}

module.exports = {Documents};