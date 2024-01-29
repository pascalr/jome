// FIXME: Change the name of imports and functions when there is name clashes.

const path = require('path')

function _run(node, sync, args) {
  if (args[0][0] === '"' || args[0][0] === "'") {
    let filepath = args[0].slice(1,-1)
    let name = 'run_'+path.parse(filepath).name.replace(/\./g, '_');
    node.ctxFile.addDependency(filepath)
    if (!filepath.endsWith('.jome')) {
      throw new Error('Cannot run file without .jome extension. Was: '+filepath);
    }
    let jsFile = filepath.slice(0,-5)+'.js' // remove .jome and replace extension with js
    node.ctxFile.addImport(name, null, jsFile)
    let str = `${name}(${args.slice(1).join(', ')})`
    return sync ? `await ${str}` : `${str}`
    // TODO: Pass the rest of the args too into the function call
  } else {
    throw new Error('Dynamic #run not supported for now')
    let lib = node.ctxFile.compilerOptions.useCommonJS ? 'cjs' : 'esm'
    let str = `run(${args.join(', ')})`
    node.ctxFile.addImport(null, ['run'], 'jome-lib/'+lib)
    return sync ? `await ${str}` : `${str}`
  }
}

const UTILS = {
  log: (node, args) => `console.log(${(args).join(', ')})`,
  keys: (node, args) => `Object.keys(${(args).join(', ')})`,
  values: (node, args) => `Object.values(${(args).join(', ')})`,
  entries: (node, args) => `Object.entries(${(args).join(', ')})`,
  PI: () => "Math.PI",
  argv: () => "process.argv",
  // argv: (node) => {
  //   node.ctxFile.addImport('argv', null, 'jome-lib/argv')
  //   return `argv()`
  // },
  write: (node, args) => {
    node.ctxFile.addImport(null, ['write'], 'jome-lib/write')
    return `write(${(args).join(', ')})`
  },
  "write!": (node, args) => {
    node.ctxFile.addImport(null, ['writeSync'], 'jome-lib/write')
    return `writeSync(${(args).join(', ')})`
  },
  cp: (node, args) => {
    node.ctxFile.addImport('fs', null, 'fs')
    return `fs.copyFile(${(args).join(', ')})`
  },
  "cp!": (node, args) => {
    node.ctxFile.addImport('fs', null, 'fs')
    return `fs.copyFileSync(${(args).join(', ')})`
  },
  run: (node, args) => _run(node, false, args),
  "run!": (node, args) => _run(node, true, args),
  load: (node, args) => _run(node, false, args),
  "load!": (node, args) => _run(node, true, args),
  // TODO: build!
  build: (node, args) => {
    node.ctxFile.addImport('build', null, 'jome-lib/build')
    return `build(${(args).join(', ')})`
  },
  // TODO: compile!
  compile: (node, args) => {
    node.ctxFile.addImport('compile', null, 'jome-lib/compile')
    return `compile(${(args).join(', ')})`
  },
  mdToHtml: (node, args) => {
    node.ctxFile.addImport('mdToHtml', null, 'jome-lib/mdToHtml')
    return `mdToHtml(${(args).join(', ')})`
  },
  execSh: (node, args) => {
    node.ctxFile.addImport('execSh', null, 'jome-lib/execSh')
    return `execSh(${(args).join(', ')})`
  },
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