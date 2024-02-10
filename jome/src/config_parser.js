// Handles config.jome

const {compileFileGetCtx} = require('./compiler')
const {LexicalEnvironment} = require('./context')

class JomeConfig {
  constructor() {
    this.lexEnv = new LexicalEnvironment()
  }
}

function parseConfig(absPath) {
  let {result, ctxFile} = compileFileGetCtx(absPath)
  let lexEnv = ctxFile.lexEnv
  let configReturn = eval(result)()
  let conf = new JomeConfig()
  Object.keys(configReturn.utils||{}).forEach(util => {
    let binding = lexEnv.bindings[util]
    if (!binding) {
      throw new Error("Internal Error parsing config.jome, missing binding for "+util)
    }
    conf.lexEnv.addBinding(util, binding)
  })
  return conf
}

module.exports = {
  parseConfig
}