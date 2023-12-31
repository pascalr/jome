// import fs from 'fs';
// import path from 'path';
// import { CompileContext } from './compile_context.js';
// import { compile, compileGetContext } from './compiler.js';
// import { fileURLToPath } from 'url';
// import {globSync} from 'glob'
// import { spawnSync } from 'child_process';
const fs = require('fs');
const path = require('path');
const { CompileContext } = require('./compile_context.js');
const { compile, compileGetContext } = require('./compiler.js');
const { fileURLToPath } = require('url');
const globSync = require('glob').sync;
const { spawnSync, execSync } = require('child_process');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const JOME_LIB = 'jome'

function saveFile(name, content) {
  let direct = path.dirname(name)
  if (!fs.existsSync(direct)) {
    fs.mkdirSync(direct, { recursive: true })
  }
  fs.writeFileSync(name, content, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('File has been written.', name);
    }
  });
}

/**
 * Process Jome code.
 * 
 * Compile:
 * Take the .jome files as input and compile them as .js files inside a hidden .jome folder
 * 
 * Build:
 * Execute the main of every compiled files, and write the result into the out directory.
 * 
 */
class JomeBuilder {
  constructor(params={}) {

    this.projectAbsPath = params.projectAbsPath || ''
    // if (this.projectAbsPath === '.') {this.projectAbsPath = '/home/pascalr/jome/'}

    let defaultTmpDirName = '.jome/'
    // The absolute path to the directory to contain the intermediary build files and and build runtime file.
    let defaultTmpDir = path.join(this.projectAbsPath, defaultTmpDirName)
    // The name of the build directory inside the temporary directy
    let defaultBuildDirName = 'build'
    // The absolute path of the intermediary build directory
    let defaultBuildDir = path.join(defaultTmpDir, defaultBuildDirName)
    // The absolute path of the output directory
    let defaultOutDir = path.join(this.projectAbsPath, 'docs/')

    this.buildAbsPath = params.buildAbsPath || defaultBuildDir
    this.outDir = params.outDir || defaultOutDir
    this.dependencies = []

    this.filesToBuild = []
  }

  compileFile(absPath, ext) {
    if (!absPath.endsWith('.jome')) {
      throw new Error('Cannot compile file without .jome extension', absPath);
    }
  
    if (!absPath.startsWith(this.projectAbsPath)) {
      throw new Error("Only compiling files inside the project folder supported for now.")
    }
    let relPath = absPath.slice(this.projectAbsPath.length)
    if (relPath[0] === '/') {relPath = relPath.slice(1)}
    console.log('Compiling', relPath)
  
    try {
      // Check if the file exists
      fs.accessSync(absPath, fs.constants.F_OK);
    } catch (err) {
      throw new Error(`File '${absPath}' does not exist.`);
    }
  
    // Read the contents of the file synchronously
    const data = fs.readFileSync(absPath, 'utf8');
  
    let ctx = new CompileContext({})
    ctx.currentFile = absPath // For import relative paths
    ctx.rootDir = this.projectAbsPath
  
    let { result, context } = compileGetContext(data, ctx);
  
    // Handle dependencies relative to the path of the file
    const directoryPart = path.dirname(absPath);
    let missings = []
    context.dependencies.forEach(dependency => {
      if (!(dependency in this.dependencies)) {
        this.dependencies.push(dependency)
        let depAbsPath = path.join(directoryPart, dependency)
        missings.push(depAbsPath)
      }
    })
  
    if (ext.endsWith('.js')) {
      if (context.useESM) {
        result = `import ${JOME_LIB} from 'jome'\n\n` + result;
      } else {
        result = `const ${JOME_LIB} = require('jome')\n\n` + result;
      }
    }
  
    return {result, context, missings, relPath}
  }

  compileFileAndDeps(absPath, ext) {

    let {result, context, missings, relPath} = this.compileFile(absPath, ext)
  
    missings.forEach(missing => {
      //this.compileAndSaveFile(missing, context.useESM ? '.built.js' : '.built.cjs') // FIXMEEEEEEEEEEEEEEEEEEEEEEEEEEE. I could import a file of any type...
      this.compileAndSaveFile(missing, '.built.js') // FIXMEEEEEEEEEEEEEEEEEEEEEEEEEEE. I could import a file of any type...
    })
  
    return {result, context, relPath}
  }

  compileAndSaveFile(absPath, ext) {

    let {result, context, relPath} = this.compileFileAndDeps(absPath, ext)

    let dir = path.dirname(relPath)
    let buildDir = path.join(this.projectAbsPath, dir)
    // let buildDir = path.join(this.buildAbsPath, dir)
    // Reproduce the directory structure inside the build directory.
    if (!fs.existsSync(buildDir)) (
      fs.mkdirSync(buildDir, { recursive: true })
    )
  
    // Generate the build file name
    const buildFileName = path.basename(absPath.replace(/\.jome$/, ext));
    const outFileName = path.join(buildDir, buildFileName)
  
    try {
      // Write the result to the file synchronously
      fs.writeFileSync(outFileName, result);
  
      console.log(`Successfully wrote to '${buildFileName}'.`);
    } catch (err) {
      console.error('Error writing to the file:', err);
      return null
    }
  
    return {buildFileName, context, outFileName, result}
  }

  /**
   * Copies a single file to the output directory
   */
  asset(params={}, filename) {
    let out = path.join(this.outDir, params.as || filename)
    fs.copyFileSync(filename, out)
  }

  /**
   * Copies files to the output directory
   */
  assets(params={}, glob) {
    let files = globSync(path.join(this.projectAbsPath, glob))
    files.forEach(file => {
      let out = path.join(this.outDir, params.into, path.basename(file))
      fs.copyFileSync(file, out)
    })
  }

  // async execute(absPath) {    
  //   let {outFileName} = this.compileAndSaveFile(absPath, '.js')
  //   await import(outFileName);
  // }

  // I would like to be able to execute a file without creating an intermediary .js file, but it is not working.
  // But the issue right now is that in spawn, __dirname is set to '.', and I can't seem to require. Paths are broken.
  // const result = spawnSync('node', [], {
  //   cwd: process.cwd(),
  //   input: scriptCode,
  //   encoding: 'utf-8',
  // });
  async execute(absPath, params={}) {    
    let {buildAndRun, argv} = params

    let {outFileName} = this.compileAndSaveFile(absPath, '.js')
    // let cmd = `node ${outFileName} -- ${(argv||[]).join(' ')}`
    // console.log('Executing:', cmd)
    // execSync(cmd);
    spawnSync('node', [outFileName, '--', ...(argv||[])], { encoding: 'utf-8', stdio: 'inherit' });

    // // Check for errors
    // if (result.error) {
    //   console.error(`Error in child process: ${result.error.message}`);
    // }
    
    // // Log the child process output
    // console.log(`Child process output: ${result.stdout}`);
    
    // // Log the exit code and signal
    // console.log(`Child process exited with code ${result.status} and signal ${result.signal}`);
    
    // // Perform actions after the child process has exited
    // console.log('Child process has ended.');
  }

  async run() {
    this.filesToBuild.forEach(async ({relPath, params}) => {
      let type = path.extname(relPath).slice(1)
      let dir = path.dirname(relPath)
      let fileAbsPath = path.join(this.projectAbsPath, relPath)
      let ext = `.${type}.js`
      this.compileAndSaveFile(fileAbsPath, ext)
      let f = path.basename(relPath).slice(0, -5)+ext
      let f2 = params.as ? path.join(this.outDir, params.as) : path.join(this.outDir, relPath)
      // if (type === 'html' && useIndexHtmlFiles) {
      //   f2 = outDir+path.basename(relPath).slice(0, -5)+'/index.html'
      // } else {
      //   f2 = outDir+path.basename(relPath).slice(0, -5)+ext.slice(0,-3)
      // }
      //let result = await import(`../.jome/${path.join('build', dir)}/${f}`);
      //let result = await import(`../${dir}/${f}`);
      //let defaut = result.default
      let defaut = require(`../${dir}/${f}`);
      saveFile(f2, defaut)
      // code = code + `import imp{i} from "./{path.join(buildDirName, dir)}/{f}"`+'\n' // FIXME parse newline at the end
      // "FIXME"
    })
  }

  /**
   * Compiles the given jome file into an intermediary .js file stored in .jome folder.
   * Then runs this .js file and store the result based on params.as
   */
  build(params={}, relPath) {
    this.filesToBuild.push({relPath, params})
  }
}

module.exports = {
  JomeBuilder
}