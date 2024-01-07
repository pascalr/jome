// FIXME: Change the name of imports and functions when there is name clashes.

const UTILS = {
  log: () => "console.log",
  PI: () => "Math.PI",
  // argv: () => "process.argv",
  argv: (node) => {
    node.lexEnv.ctxFile.addImport('argv', null, 'jome-lib/argv')
    return `argv()`
  },
  write: (node) => {
    node.lexEnv.ctxFile.addImport(null, ['write'], 'jome-lib/write')
    return `write`
  },
  writeSync: (node) => {
    node.lexEnv.ctxFile.addImport(null, ['writeSync'], 'jome-lib/write')
    return `writeSync`
  },
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