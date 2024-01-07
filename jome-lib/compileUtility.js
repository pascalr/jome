const UTILS = {
  log: () => "console.log",
  PI: () => "Math.PI",
  // argv: () => "process.argv",
  argv: (node) => {
    node.lexEnv.ctxFile.addImport('argv', null, 'jome-lib/argv')
    return `argv()`
  }
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