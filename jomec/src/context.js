const path = require('path')

const {DEFAULT_FORALLS} = require('./forall.js')

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
    // These are the default formats. They can be overridden using the keyword with
    this.defaultMultilineFormat = "%xsx" // "%xsx%i" // Keep indent
    this.defaultFormatByTagName = {
      md: "%:#mdToHtml",
      sh: "%:#execSh"
    }
    this.foralls = DEFAULT_FORALLS
  }

  addForall(name, chainFuncs, wrapFuncs) {
    this.foralls[name] = {chain: chainFuncs, wrap: wrapFuncs}
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
  constructor(outerEnvironment = null) {
    this.bindings = {};
    this.outer = outerEnvironment;
  }

  hasBinding(name) {
    return this.getBindingValue(name) !== undefined
  }

  // Method to add variable bindings to the environment
  addBinding(name, value) {
    this.bindings[name] = value;
  }

  // Check if the variable is already declared.
  // If so, then modify it's value
  // Otherwise, add variable binding to the environment 
  setBindingValue(name, value) {
    let owner = this.getBindingEnv(name)?.bindings || this.bindings
    owner[name] = value;
  }

  getBindingEnv(name) {
    if (name in this.bindings) {
      return this
    } else if (this.outer) {
      return this.outer.getBindingEnv(name)
    }
    return null
  }

  // Method to get the value of a variable from the environment
  getBindingValue(name) {
    return (this.getBindingEnv(name)?.bindings || this.bindings)[name]
    // throw new ReferenceError(`${name} is not defined.`);
  }

  getBindingOwner(name) {
    return (this.getBindingEnv(name)?.bindings || this.bindings)
    // throw new ReferenceError(`${name} is not defined.`);
  }
}

module.exports = {
  LexicalEnvironment,
  ContextFile
}