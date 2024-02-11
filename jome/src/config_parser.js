// Handles config.jome

const {compileFileGetCtx} = require('./compiler')
const {LexicalEnvironment} = require('./context')
const path = require('path')
const JomeConfig = require('./jome_config.js')

// function execute(code, cwd) {
//   spawnSync('node', ['-e', code], { cwd, encoding: 'utf-8', stdio: 'inherit' });
// }

function parseConfig(absPath) {
  let dir = path.dirname(absPath)
  let {result, ctxFile} = compileFileGetCtx(absPath, {useAbsImportPaths: true, cwd: dir})
  if (!result) {return new JomeConfig()}
  let context = `let __dirname = "${dir}"\n`
  let code = context+result
  // let data = execute(code, dir)
  let data = eval(code)()
  //let data = new Function(code)()()
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
  parseConfig,
  JomeConfig
}