async function validate(textDocument) {
  console.log('Validate text document begin')
  // In this simple example we get the settings for every validate run.
  const text = textDocument.getText();
  const diagnostics = [];
  try {
    let {ctxFile, nodes} = parseAndAnalyzeCode(text)
    let bindings = ctxFile.lexEnv.getAllBindings()
    dataByURI[textDocument.uri] = {ctxFile, nodes, bindings}
    let errors = ctxFile.errors
    console.log('Errors found: ', errors)
    for (let i = 0; i < errors.length && i < 1000; i++) {
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

module.exports = validate