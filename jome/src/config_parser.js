// Handles config.jome

const {compileFileGetCtx} = require('./compiler')

class JomeConfig {
  constructor() {
    this.globals = [] // {name: "...", source: {...}}
  }
}

function parseConfig(absPath) {
  let {result, ctxFile} = compileFileGetCtx(absPath)
  return {}
}

module.exports = {
  parseConfig
}