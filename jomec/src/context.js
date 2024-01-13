const path = require('path')

// The scope of the file. So it handles imports especially.
class ContextFile {
  constructor(absPath) {
    this.absPath = absPath
    this.lexEnv = new LexicalEnvironment()
    this.lexEnv.ctxFile = this
    this.namedImportsByFile = {}
    this.defaultImportsByFile = {}
    this.classIdentifiers = new Set() // The list of identifiers that refer to a class name
    this.dependencies = [] // Files that need to be compiled too for this file to run
    this.fileArguments = [] // A list of Argument
    this.currentArguments = null // The arguments defined just before classes and functions
    this.compiler = null // A reference to the compiler
  }

  addImport(defaultImport, namedImports, file) {
    if (defaultImport) {
      if (this.defaultImportsByFile[file] && this.defaultImportsByFile[file] !== defaultImport) {
        throw new Error("Two default imports on the same file not supported for now.")
      }
      if (defaultImport[0] === '&') {
        let name = defaultImport.slice(1)
        this.classIdentifiers.add(name)
        this.defaultImportsByFile[file] = name
      } else {
        this.defaultImportsByFile[file] = defaultImport
      }
    }
    if (namedImports && namedImports.length) {
      if (!this.namedImportsByFile[file]) {
        this.namedImportsByFile[file] = new Set()
      }
      namedImports.forEach(imp => {
        if (imp[0] === '&') {
          let name = imp.slice(1)
          this.classIdentifiers.add(name)
          this.namedImportsByFile[file].add(name)
        } else {
          this.namedImportsByFile[file].add(imp)
        }
      })
    }
  }

  addDependency(filename) {
    this.dependencies.push(filename)
  }

  // Returns abs paths
  getDependencies() {
    return this.dependencies.map(dep => {
      return path.resolve(this.absPath, '..', dep)
    })
  }
}

// A local scope (inside a function, an if block, ...)
class LexicalEnvironment {

}

module.exports = {
  LexicalEnvironment,
  ContextFile
}