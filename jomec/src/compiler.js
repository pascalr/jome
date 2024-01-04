const { parse } = require("./parser")
const { genCode } = require("./code_generator.js")
const { tokenize } = require('./tokenizer.js')
const { validateAllNodes } = require("./validator")
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
  return nodes.map(node => genCode(node)).join('')
}

function compile(code) {
  let tokens = tokenize(code).children
  let topNodes = parse(tokens)
  // let info = ""
  // topNodes.forEach(top =>
  //   info += '\n'+debugOpTree(top)
  // )
  // console.log(info)
  let generated = compileNodes(topNodes)
  let formated = prettier.format(generated, {parser: "babel"})
  return formated
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
    throw new Error('Error writing to the file:', err);
  }

  return buildFileName
}

module.exports = {
  compile,
  compileNodes,
  compileAndSaveFile
}