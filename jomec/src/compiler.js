const { parse } = require("./parser")
const { tokenize } = require('./tokenizer.js')
const { genCode, genImports } = require("./code_generator.js")
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

function compileCode(code, options) {
  return new Compiler(options).compileCode(code)
}

const DEFAULT_COMPILER_OPTIONS = {
  useCommonJS: true, // Whether imports and exports use common JS or ESM
  prettier: true, // Whether to format the code using the prettier library
  writeScript: true, // Whether to wrap the code inside a function to be exported
  inline: false, // Inside a script template literal the code is compiled inline for example
}

class Compiler {
  constructor(options={}) {
    this.options = {...DEFAULT_COMPILER_OPTIONS, ...options}
    this.filesCompiled = new Set()
  }

  compileFile(absPath) {
    if (this.filesCompiled.has(absPath)) {
      console.log('Skipping compiling file', absPath, 'because it is already compiled.')
      return; // Skip files already compiled
    }
    if (!fs.existsSync(absPath)) {
      throw new Error("Can't compile and save missing file " + absPath)
    }

    const destFile = absPath.slice(0,-5)+'.js' // remove .jome and replace extension with js

    if (!absPath.endsWith('.jome')) {
      throw new Error('Cannot compile file without .jome extension', absPath);
    }
    // FIXME: This does not work because it does not check for dependencies.
    // If I want to do this, I must keep a dependency tree somewhere.
    // Or do I?
    // if (fs.existsSync(destFile)) {
    //   // Check if the file needs to be compiled
    //   const srcStats = fs.statSync(absPath);
    //   const destStats = fs.statSync(destFile);
    //   if (destStats.mtime.getTime() > srcStats.mtime.getTime()) {
    //     console.log('Skipping compiling file', absPath, 'because it is already up to date.')
    //     return; // File is already up to date
    //   }
    // }
  
    // Read the contents of the file synchronously
    const data = fs.readFileSync(absPath, 'utf8');
    let ctxFile = new ContextFile(absPath)
    let result = this.compileCode(data, this.options, ctxFile)
  
    
  
    // Write the result to the file synchronously
    fs.writeFileSync(destFile, result);
    console.log(`Successfully wrote to '${destFile}'.`);

    this.filesCompiled.add(absPath)
    ctxFile.getDependencies().forEach(dep => {
      this.compileFile(dep)
    })
  
    return destFile
  }

  compileCode(code, options={}, ctxFile) {
    let opts = {...this.options, ...options}
    let tokens = tokenize(code).children
    ctxFile = ctxFile || new ContextFile()
    ctxFile.compiler = this
    ctxFile.compilerOptions = this.options // TODO: Get the options through the compiler, not compilerOptions
    let topNodes = parse(tokens, null, ctxFile.lexEnv)
    // let info = ""
    // topNodes.forEach(top =>
    //   info += '\n'+debugOpTree(top)
    // )
    // console.log(info)
    let body = compileNodes(topNodes)
    if (opts.inline) {
      let generated = prettier.format(body, {parser: "babel", semi: false}) // No semicolons
      return generated
    }
    if (opts.writeScript) {
      let args = ctxFile.fileArguments.map(arg => arg.compile()).join(', ')
      // Wrap the body into a function
      // FIXME: Don't allow exports when compiling a script (.jome)
      if (opts.useCommonJS) {
        body = `module.exports = ((${args}) => {${body}})`
      } else {
        body = `export default ((${args}) => {${body}})`
      }
    }
    let head = genImports(ctxFile, opts)
    let generated = head + body
    if (opts.prettier) {
      generated = prettier.format(generated, {parser: "babel"})
    }
    return generated
  }
}

function compileAndSaveFile(absPath, options) {
  let compiler = new Compiler(options)
  return compiler.compileFile(absPath)
}

module.exports = {
  compileCode,
  compileNodes,
  compileAndSaveFile
}