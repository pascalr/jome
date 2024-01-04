const { parse } = require("./parser")
const { transpile } = require("./transpiler")
const { tokenize } = require('./tokenizer.js')
const { validateAllNodes } = require("./validator")

const fs = require('fs');
//const path = require('path');

// That a list of ASTNode and return js code
function compileNodes(nodes) {
  validateAllNodes(nodes)
  return nodes.map(node => transpile(node)).join('')
}

function compile(code) {
  let tokens = tokenize(code).children
  let topNodes = parse(tokens)
  //topNodes.forEach(top => printTree(top))
  return compileNodes(topNodes)
}

// FIXME: This does not belong here
function compileAndSaveFile(absPath) {

  if (!fs.existsSync(absPath)) {
    throw new Error("Can't compile and save missing file " + absPath)
  }

  // Read the contents of the file synchronously
  const data = fs.readFileSync(absPath, 'utf8');

  let tokens = tokenize(data).children
  let topNodes = parse(tokens)
  //topNodes.forEach(top => printTree(top))
  let result = compileNodes(topNodes)

  if (!absPath.endsWith('.jome')) {
    throw new Error('Cannot compile file without .jome extension', absPath);
  }
  const buildFileName = absPath.slice(0,-5)+'.js' // remove .jome and replace extension with js

  try {
    // Write the result to the file synchronously
    fs.writeFileSync(buildFileName, result);

    console.log(`Successfully wrote to '${buildFileName}'.`);
  } catch (err) {
    console.error('Error writing to the file:', err);
    return null
  }
}

module.exports = {
  compile,
  compileNodes,
  compileAndSaveFile
}