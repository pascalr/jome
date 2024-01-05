// The scope of the file. So it handles imports especially.
class ContextFile {
  constructor() {
    this.lexEnv = new LexicalEnvironment()
    this.lexEnv.ctxFile = this
    this.namedImportsByFile = {}
    this.defaultImportsByFile = {}
  }

  addImport(defaultImport, namedImports, file) {
    if (defaultImport) {
      if (this.defaultImportsByFile[file] && this.defaultImportsByFile[file] !== defaultImport) {
        throw new Error("Two default imports on the same file not supported for now.")
      }
      this.defaultImportsByFile[file] = defaultImport
    }
    if (namedImports && namedImports.length) {
      if (!this.namedImportsByFile[file]) {
        this.namedImportsByFile[file] = new Set()
      }
      namedImports.forEach(imp => {
        this.namedImportsByFile[file].add(imp)
      })
    }
  }
}

// A local scope (inside a function, an if block, ...)
class LexicalEnvironment {

}

module.exports = {
  LexicalEnvironment,
  ContextFile
}