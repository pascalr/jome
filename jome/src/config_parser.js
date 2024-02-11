// Handles config.jome

const {compileFileGetCtx} = require('./compiler')
const {LexicalEnvironment} = require('./context')
const path = require('path')

class JomeConfig {
  constructor(data) {
    this.lexEnv = new LexicalEnvironment()
    this.data = data||{}
    this.main = this.data.main || 'index.jome'
  }
}

function parseConfig(absPath) {
  let {result, ctxFile} = compileFileGetCtx(absPath)
  if (!result) {return new JomeConfig()}
  let dir = path.dirname(absPath)
  let context = `let __dirname = "${dir}"\n`
  let data = eval(context+result)()
  let conf = new JomeConfig(data)
  let lexEnv = ctxFile.lexEnv
  Object.keys(data?.utils||{}).forEach(util => {
    let binding = lexEnv.bindings[util]
    if (!binding) {
      throw new Error("Internal Error parsing config.jome, missing binding for "+util)
    }
    //ctxFile.addFileImportDependency(util, binding.type, binding.file)
    conf.lexEnv.addBinding(util, binding)
  })
  return conf
}

module.exports = {
  parseConfig
}