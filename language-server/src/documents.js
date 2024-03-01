// TODO: Work in progress

const {TextDocument} = require("vscode-languageserver-textdocument");

const { parseAndAnalyzeCode } = require('jome.js/src/compiler.js');

const validate = require('./validate.js');

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

  _parseDocument(connection, uri, doc) {
    try {
      let parsedData = parseAndAnalyzeCode(doc.getText())
      parsedData.bindings = parsedData.ctxFile.lexEnv.getAllBindings()
      this.parsedDataByUri[uri] = parsedData
      let diagnostics = validate(doc, parsedData)
      connection.sendDiagnostics({uri, diagnostics})
    } catch (err) {
      connection.console.error(err.stack);
    }
  }

  listen(connection) {
    //connection.__textDocumentSync = vscode_languageserver_protocol_1.TextDocumentSyncKind.Incremental;
    
    connection.onDidOpenTextDocument(({textDocument: td}) => {
      connection.console.log("onDidOpenTextDocument")
      let doc = TextDocument.create(td.uri, td.languageId, td.version, td.text)
      this.docsByUri[td.uri] = doc
      this._parseDocument(connection, td.uri, doc)
    })

    connection.onDidChangeTextDocument(({textDocument: td, contentChanges}) => {
      connection.console.log("onDidChangeTextDocument")
      let version = td.version
      if (contentChanges.length === 0) { return; }
      if (version === null || version === undefined) {
        throw new Error(`Received document change event for ${td.uri} without valid version identifier`);
      }
      let doc = this.docsByUri[td.uri]
      if (doc !== undefined) {
        doc = TextDocument.update(doc, contentChanges, version);
        this.docsByUri[td.uri] = doc
        this._parseDocument(connection, td.uri, doc)
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