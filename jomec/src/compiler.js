const { parse } = require("./parser")
const { genCode, genImports } = require("./code_generator.js")
const { tokenize } = require('./tokenizer.js')
const { validateAllNodes } = require("./validator")
const { ContextFile } = require("./context.js")
const prettier = require("prettier")

const fs = require('fs');
//const path = require('path');

function debugOpTree(node, depth = 0) {
  const indentation = '  '.repeat(depth);

  let res = `${indentation}${node.type}`

  for (const op of node.operands) {
    res += '\n' + debugOpTree(op, depth + 1);
  }

  return res
}

function debugTreeType(node, depth = 0) {
  const indentation = '  '.repeat(depth);

  let res = `${indentation}${node.type}`

  if (node.parts) {
    for (const part of node.parts) {
      res += '\n' + debugTreeType(part, depth + 1);
    }
  }

  for (const op of node.operands) {
    res += '\n' + debugTreeType(op, depth + 1);
  }

  return res
}

function printTree(node, depth = 0) {
  const indentation = '  '.repeat(depth);

  console.log(`${indentation}${node.raw}`);

  for (const child of node.operands) {
    printTree(child, depth + 1);
  }
}

// That a list of ASTNode and return js code
function compileNodes(nodes) {
  validateAllNodes(nodes)
  return nodes.map(node => genCode(node)).join(';')+';'
}

const DEFAULT_COMPILER_OPTIONS = {
  useCommonJS: true, // Whether imports and exports use common JS or ESM
  prettier: true, // Whether to format the code using the prettier library
  writeScript: true // Whether to wrap the code inside a function to be exported
}

/**
 * Compile the given code based on the options.
 * @param {string} code 
 * @param {*} options See DEFAULT_COMPILER_OPTIONS for more details
 * @returns 
 */
function compile(code, options={}) {
  options = {...DEFAULT_COMPILER_OPTIONS, ...options}
  let tokens = tokenize(code).children
  let ctxFile = new ContextFile()
  let topNodes = parse(tokens, null, ctxFile.lexEnv)
  // let info = ""
  // topNodes.forEach(top =>
  //   info += '\n'+debugOpTree(top)
  // )
  // console.log(info)
  let body = compileNodes(topNodes)
  if (options.writeScript) {
    // Wrap the body into a function
    // FIXME: Don't allow exports when compiling a script (.jome)
    if (options.useCommonJS) {
      body = `module.exports = (() => {${body}})`
    } else {
      body = `export default (() => {${body}})`
    }
  }
  let head = genImports(ctxFile, options)
  let generated = head + body
  if (options.prettier) {
    generated = prettier.format(generated, {parser: "babel"})
  }
  return generated
}

// FIXME: This does not belong here
function compileAndSaveFile(absPath, options) {

  if (!fs.existsSync(absPath)) {
    throw new Error("Can't compile and save missing file " + absPath)
  }

  // Read the contents of the file synchronously
  const data = fs.readFileSync(absPath, 'utf8');
  let result = compile(data, options)

  if (!absPath.endsWith('.jome')) {
    throw new Error('Cannot compile file without .jome extension', absPath);
  }
  const buildFileName = absPath.slice(0,-5)+'.js' // remove .jome and replace extension with js

  try {
    // Write the result to the file synchronously
    fs.writeFileSync(buildFileName, result);

    console.log(`Successfully wrote to '${buildFileName}'.`);
  } catch (err) {
    throw new Error('Error writing to the file:', err);
  }

  return buildFileName
}

module.exports = {
  compile,
  compileNodes,
  compileAndSaveFile
}