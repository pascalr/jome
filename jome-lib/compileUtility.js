// FIXME: Change the name of imports and functions when there is name clashes.

const path = require('path')

function _run(node, sync, args) {
  // TODO: Check if the first arg is a string, if it is, use normal import,
  // Otherwise use dynamic import
  // Dynamic import is not the best, because it means that when the code will be run, then
  // it will compile the .jome file as needed and run it. But that's OK.
  // let filepath = args[0].slice(1,-1)
  // let name = 'run_'+path.parse(filepath).name
  // node.lexEnv.ctxFile.addDependency(filepath)
  // if (!filepath.endsWith('.jome')) {
  //   throw new Error('Cannot run file without .jome extension. Was: '+filepath);
  // }
  // let jsFile = filepath.slice(0,-5)+'.js' // remove .jome and replace extension with js
  // node.lexEnv.ctxFile.addImport(name, null, jsFile)
  // return sync ? `await ${name}()` : `${name}()`
  // TODO: Pass the rest of the args too into the function call
  let lib = node.lexEnv.ctxFile.compilerOptions.useCommonJS ? 'cjs' : 'esm'
  let str = `run(${args.join(', ')})`
  node.lexEnv.ctxFile.addImport(null, ['run'], 'jome-lib/'+lib)
  return sync ? `await ${str}` : `${str}`
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