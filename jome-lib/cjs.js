const {execSync} = require("child_process");
const sanitize = require("sanitize-filename");

// Same as esm/run, but for CommonJS.
// FIXME: If you can run async multiple times on the same time, it will call jomec multiple times
// TODO: Find a way to cache and make sure that jomec and await import are executed only once.
async function run(jomeFileAbsPath, ...args) {
  execSync("jomec "+sanitize(jomeFileAbsPath))
  let jsFile = jomeFileAbsPath.slice(0,-5)+'.js' // remove .jome and replace extension with js
  let func = require(jsFile)
  func(...args)
}

module.exports = {
  run
}