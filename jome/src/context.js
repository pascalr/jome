const path = require('path')

const {DEFAULT_FORALLS} = require('./forall.js')

class FileImports {
  constructor() {
    this.filename = null
    // A default import can be given a name, and an implicit import (by using builtin or custom tag or whatever)
    // can give other names to the default import. List all the names used here.
    this.defaultImportNames = []
    // Namespace import can only be specified explicitely, so only keep one value for it.
    this.namespaceImport = null
    this.namedImports = new Set()
    this.aliasesByName = {} // {originalName: ["aliasName1", "aliasName2"]}
    // All the identifiers that design a class. They start with an ampersand &SomeClass
    this.classIdentifiers = new Set()
    // When a util has a dependency to an import, add it here
    // The dependency will be renamed if the name is already used in any lexical environment
    this.importDependenciesByFile = {} // [{type: 'named-import', name: 'foobar'}]
  }

  mergeWith(fileImports) {
    this.filename = this.filename || fileImports.filename
    this.defaultImportNames = [...this.defaultImportNames, ...fileImports.defaultImportNames]
    this.namespaceImport = this.namespaceImport || fileImports.namespaceImport
    this.namedImports = new Set([...this.namedImports, ...fileImports.namedImports])
    Object.keys(fileImports.aliasesByName).forEach(alias => {
      if (this.aliasesByName[alias]) {
        this.aliasesByName[alias] = new Set([...this.aliasesByName[alias], ...fileImports.aliasesByName[alias]])
      } else {
        this.aliasesByName[alias] = fileImports.aliasesByName[alias]
      }
    })
    this.classIdentifiers = new Set([...this.classIdentifiers, ...fileImports.classIdentifiers])
    return this
  }

  // Extract the name and sets identifier to be a class identifier if it is the case
  extractName(name) {
    if (name.startsWith("&")) {
      let n = name.slice(1)
      this.classIdentifiers.add(n)
      return n
    }
    return name
  }

  addNamedImport(name) {
    this.namedImports.add(this.extractName(name))
  }

  addAliasImport(originalName, aliasName) {
    this.namedImports.add(originalName)
    let list = this.aliasesByName[originalName] || new Set()
    list.add(aliasName)
    this.aliasesByName[originalName] = list
  }

  addDefaultImport(name) {
    this.defaultImportNames.push(this.extractName(name))
  }

  setNamespaceImport(name) {
    this.namespaceImport = name
  }
}

// The scope of the file. So it handles imports especially.
class ContextFile {
  constructor(absPath, outerEnvironment) {
    this.uidNb = 0
    this.absPath = absPath
    this.lexEnv = new LexicalEnvironment(outerEnvironment)
    this.lexEnv.ctxFile = this
    this.namedImportsByFile = {}
    this.defaultImportsByFile = {}
    this.namespaceImportsByFile = {}
    this.classIdentifiers = new Set() // The list of identifiers that refer to a class name
    this.dependencies = new Set() // Files that need to be compiled too for this file to run
    this.fileArguments = [] // A list of Argument
    this.currentArguments = null // The arguments defined just before classes and functions
    this.compiler = null // A reference to the compiler
    this.foralls = DEFAULT_FORALLS
    this.errors = [] // A list of errors found when analyzing
    this.fileImportsByFile = {}
    this.fileImportDependenciesByFile = {}
  }

  addFileImportDependency(name, type, file) {
    this.fileImportDependenciesByFile[file] = [...(this.fileImportDependenciesByFile[file]||[]), {name, type}]
  }

  addForall(name, chainFuncs, wrapFuncs) {
    this.foralls[name] = {chain: chainFuncs, wrap: wrapFuncs}
  }

  getFileImports(filename) {
    if (!this.fileImportsByFile[filename]) {
      this.fileImportsByFile[filename] = new FileImports()
    }
    return this.fileImportsByFile[filename]
  }

  addFileImports(fileImports) {
    let previous = this.getFileImports(fileImports.filename)
    this.fileImportsByFile[fileImports.filename] = previous.mergeWith(fileImports)
    this.classIdentifiers = new Set([...this.classIdentifiers, ...fileImports.classIdentifiers])
  }

  addDependency(filename) {
    this.dependencies.add(filename)
  }

  // Returns abs paths
  getDependencies() {
    return [...this.dependencies].map(dep => {
      return path.resolve(this.absPath, '..', dep)
    })
  }

  // Get unique identifier. Simply prefix j_uid_ than a number that goes up by one every time
  uid() {
    return `j_uid_${++this.uidNb}`
  }
}

// A local scope (inside a function, an if block, ...)
class LexicalEnvironment {
  constructor(outerEnvironment = null) {
    this.bindings = {};
    this.bindingsUsed = new Set()
    this.nestedEnvs = []
    this.outer = outerEnvironment;
    if (this.outer) {this.outer.nestedEnvs.push(this)}
  }

  useBinding(name) {
    let env = this.getBindingEnv(name)
    env.bindingsUsed.add(name)
  }

  isBindingUsed(name) {
    let env = this.getBindingEnv(name)
    return env.bindingsUsed.has(name)
  }

  hasBinding(name) {
    return this.getBindingValue(name) !== undefined
  }

  // Method to add variable bindings to the environment
  addBinding(name, value) {
    this.bindings[name] = {...value, name};
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
  ContextFile,
  FileImports
}