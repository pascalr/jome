// FIXME: Change the name of imports and functions when there is name clashes.

const path = require('path')

function _run(node, sync) {
  let filepath = args // FIXME!!!!!
  // FIXME: Capture the args given!
  // Inside validate parse the args and give them to the node.data for utils???
  // return ['outstring'] // When inside an arary it means that it captured?
  throw new Error("Error f030340rfn034hnf")
  // if (filepath[0] !== '.' && filepath[0] !== '/') {
  //   filepath = './'+filepath
  // }
  // let name = 'run_'+path.parse(filepath).name
  // node.lexEnv.ctxFile.addImport(name, null, filepath)
  // return sync ? `await ${}()` : name
}

const UTILS = {
  log: () => "console.log",
  PI: () => "Math.PI",
  argv: () => "process.argv",
  // argv: (node) => {
  //   node.lexEnv.ctxFile.addImport('argv', null, 'jome-lib/argv')
  //   return `argv()`
  // },
  write: (node) => {
    node.lexEnv.ctxFile.addImport(null, ['write'], 'jome-lib/write')
    return `write`
  },
  "write!": (node) => {
    node.lexEnv.ctxFile.addImport(null, ['writeSync'], 'jome-lib/write')
    return `writeSync`
  },
  run: (node) => _run(node, false),
  "run!": (node) => _run(node, true),
  load: (node) => _run(node, false),
  "load!": (node) => _run(node, true),
}

function compileUtility(name, node) {
  let utils = UTILS[name]
  if (!utils) {
    throw new Error("Unkown util "+name)
  }
  return utils(node)
}

module.exports = {
  compileUtility
}