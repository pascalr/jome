const compileJomeFile = require('./lib/compile_jome_file.js')

// Same as esm/run, but for CommonJS.
async function run(jomeFileAbsPath, ...args) {
  let jsFile = compileJomeFile(jomeFileAbsPath)
  let func = require(jsFile)
  return func(...args)
}

module.exports = {
  run
}