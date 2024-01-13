const { parse } = require("./parser")
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
  writeScript: true, // Whether to wrap the code inside a function to be exported
  inline: false, // Inside a script template literal the code is compiled inline for example
}

/**
 * Compile the given code based on the options.
 * @param {string} code 
 * @param {*} options See DEFAULT_COMPILER_OPTIONS for more details
 * @returns 
 */
function compileCode(code, options={}, compiler) {
  options = {...DEFAULT_COMPILER_OPTIONS, ...options}
  let tokens = tokenize(code).children
  let ctxFile = new ContextFile()
  ctxFile.compiler = compiler
  ctxFile.compilerOptions = options // TODO: Get the options through the compiler, not compilerOptions
  let topNodes = parse(tokens, null, ctxFile.lexEnv)
  // let info = ""
  // topNodes.forEach(top =>
  //   info += '\n'+debugOpTree(top)
  // )
  // console.log(info)
  let body = compileNodes(topNodes)
  if (options.inline) {
    let generated = prettier.format(body, {parser: "babel", semi: false}) // No semicolons
    return generated
  }
  if (options.writeScript) {
    let args = ctxFile.fileArguments.map(arg => arg.compile()).join(', ')
    // Wrap the body into a function
    // FIXME: Don't allow exports when compiling a script (.jome)
    if (options.useCommonJS) {
      body = `module.exports = ((${args}) => {${body}})`
    } else {
      body = `export default ((${args}) => {${body}})`
    }
  }
  let head = genImports(ctxFile, options)
  let generated = head + body
  if (options.prettier) {
    generated = prettier.format(generated, {parser: "babel"})
  }
  return generated
}

exports.compileCode = compileCode
const { genCode, genImports } = require("./code_generator.js")

class Compiler {
  constructor(options) {
    this.options = options
  }
  compile(absPath) {
    if (!fs.existsSync(absPath)) {
      throw new Error("Can't compile and save missing file " + absPath)
    }
  
    // Read the contents of the file synchronously
    const data = fs.readFileSync(absPath, 'utf8');
    let result = this.compileCode(data, this.options)
  
    if (!absPath.endsWith('.jome')) {
      throw new Error('Cannot compile file without .jome extension', absPath);
    }
    const buildFileName = absPath.slice(0,-5)+'.js' // remove .jome and replace extension with js
  
    // Write the result to the file synchronously
    fs.writeFileSync(buildFileName, result);
    console.log(`Successfully wrote to '${buildFileName}'.`);
  
    return buildFileName
  }
  compileCode(code, options={}) {
    return compileCode(code, options, this)
  }
}

// FIXME: This does not belong here
function compileAndSaveFile(absPath, options) {
  let compiler = new Compiler(options)
  return compiler.compile(absPath)
}

module.exports = {
  compileCode,
  compileNodes,
  compileAndSaveFile
}