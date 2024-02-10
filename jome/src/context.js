const path = require('path')

const {DEFAULT_FORALLS} = require('./forall.js')

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
    this.fileImportDependenciesByFile = {}
  }

  addFileImportDependency(name, type, file) {
    this.fileImportDependenciesByFile[file] = [...(this.fileImportDependenciesByFile[file]||[]), {name, type}]
  }

  addForall(name, chainFuncs, wrapFuncs) {
    this.foralls[name] = {chain: chainFuncs, wrap: wrapFuncs}
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
}