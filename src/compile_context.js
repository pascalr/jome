import { LexicalEnvironment } from './lex_env.js';

class Scope {
  constructor(parent, params={}) {
    this.parent = parent
    this.lexEnv = params.lexEnv || new LexicalEnvironment()
  }
}

export class CompileContext {
  constructor(params={}) {
    let {lexEnv, compile, dependencies, depth, module} = params
    this.lexEnv = lexEnv || new LexicalEnvironment()
    this.compile = compile === undefined ? true : compile // DEPRECATED ARGUMENT, SHOULD ALWAYS BE TRUE
    this.dependencies = dependencies || []
    this.depth = depth || 0
    this.module = module || false
    this.declarations = [] // used for declaring variable per scope
    this.headers = [] // Things added at the beginning of the file
    this.stylesheets = {} // For <css></css> tags
    this.imports = {} // All the import statements found
    this.currentFile = null // For import relative paths
    this.rootDir = null // For imports
    this.interfaces = {}
  }

  spacing() {
    return '  '.repeat(this.depth)
  }

  run(funcRun) {
    let before = {...this}
    let result = funcRun()
    Object.keys(before).forEach(key => {
      this[key] = before[key]
    })
    return result
  }

  nest(func) {
    this.depth += 1
    func()
    this.depth -= 1
  }

  hasBinding(name) {
    return this.lexEnv.hasBinding(name)
  }

  addBinding(name, value) {
    this.lexEnv.addBinding(name, value)
  }

  getBinding(name) {
    return this.lexEnv.getBindingValue(name)
  }

  declareVariable(name) {
    if (!this.currentScopeNode.declarations.has(name)) {
      this.currentScopeNode.declarations.add(name)
    }
  }
}