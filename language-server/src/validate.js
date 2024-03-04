const { DiagnosticSeverity } = require("vscode-languageserver/node");

function validate(textDocument, {ctxFile}) {
  console.log('Validate text document begin')
  // In this simple example we get the settings for every validate run.
  const diagnostics = [];
  let errors = ctxFile.errors
  for (let i = 0; i < errors.length && i < 1000; i++) {
    let err = errors[i]
    const diagnostic = {
      severity: DiagnosticSeverity.Error,
      range: {
        start: textDocument.positionAt(err.startIndex),
        end: textDocument.positionAt(err.endIndex)
      },
      message: err.message || err,
      source: 'jome(1234)'
    };
    diagnostics.push(diagnostic);
  }

  let undeclaredOccurences = ctxFile.undeclaredOccurences
  for (let i = 0; i < undeclaredOccurences.length && i < 1000; i++) {
    let occurence = undeclaredOccurences[i]
    const diagnostic = {
      // TODO: Allow strict mode in jome.config, this would be an Error in strict mode and not only a hint
      severity: DiagnosticSeverity.Hint,
      range: {
        start: textDocument.positionAt(occurence.startIndex),
        end: textDocument.positionAt(occurence.endIndex)
      },
      message: `Undeclared symbol ${occurence.name}`,
      source: 'jome(1234)'
    };
    diagnostics.push(diagnostic);
  }

  return diagnostics
}

module.exports = validate