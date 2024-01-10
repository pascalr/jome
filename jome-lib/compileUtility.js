// FIXME: Change the name of imports and functions when there is name clashes.

const path = require('path')

function _run(node, sync, args) {
  let filepath = args[0].slice(1,-1)
  let name = 'run_'+path.parse(filepath).name
  node.lexEnv.ctxFile.addDependency(filepath)
  if (!filepath.endsWith('.jome')) {
    throw new Error('Cannot run file without .jome extension. Was: '+filepath);
  }
  let jsFile = filepath.slice(0,-5)+'.js' // remove .jome and replace extension with js
  node.lexEnv.ctxFile.addImport(name, null, jsFile)
  return sync ? `await ${name}()` : `${name}()`
}

const UTILS = {
  log: (node, args) => `console.log(${(args).join(', ')})`,
  PI: () => "Math.PI",
  argv: () => "process.argv",
  // argv: (node) => {
  //   node.lexEnv.ctxFile.addImport('argv', null, 'jome-lib/argv')
  //   return `argv()`
  // },
  write: (node, args) => {
    node.lexEnv.ctxFile.addImport(null, ['write'], 'jome-lib/write')
    return `write(${(args).join(', ')})`
  },
  "write!": (node, args) => {
    node.lexEnv.ctxFile.addImport(null, ['writeSync'], 'jome-lib/write')
    return `writeSync(${(args).join(', ')})`
  },
  run: (node, args) => _run(node, false, args),
  "run!": (node, args) => _run(node, true, args),
  load: (node, args) => _run(node, false, args),
  "load!": (node, args) => _run(node, true, args),
}

function compileUtility(name, node, args) {
  let utils = UTILS[name]
  if (!utils) {
    throw new Error("Unkown util "+name)
  }
  return `${utils(node, args||[])}`
}

module.exports = {
  compileUtility
}