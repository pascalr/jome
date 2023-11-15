import fs from 'fs';
import path from 'path';
import { CompileContext } from './compile_context.js';
import { compile, compileGetContext } from './compiler.js';
import { fileURLToPath } from 'url';
import {globSync} from 'glob'
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export function buildFile(fullPath, dependencies = [], run=false) {
  if (!fullPath.endsWith('.jome')) {
    console.warn('Cannot build file without .jome extension', fullPath);
    return;
  }

  console.log('Building File', fullPath);

  try {
    // Check if the file exists
    fs.accessSync(fullPath, fs.constants.F_OK);
  } catch (err) {
    console.error(`File '${fullPath}' does not exist.`);
    return null
  }

  // Read the contents of the file synchronously
  const data = fs.readFileSync(fullPath, 'utf8');

  let ctx = new CompileContext(run ? {} : {module: true})
  ctx.currentFile = fullPath // For import relative paths
  ctx.rootDir = __dirname.slice(0, -3) // FIXME

  let { result, context } = compileGetContext(data, ctx);

  // Handle dependencies relative to the path of the file
  const directoryPart = path.dirname(fullPath);
  let missings = []
  context.dependencies.forEach(dependency => {
    if (!(dependency in dependencies)) {
      dependencies.push(dependency)
      missings.push(dependency)
    }
  })

  missings.forEach(missing => {
    let out = buildFile(path.join(directoryPart, missing), dependencies)
    let css = out?.context?.stylesheets||{}
    Object.keys(css).forEach(key => {
      // FIXME: Don't import multiple times the same css script...
      context.stylesheets[key] = (context.stylesheets[key]||'') + css[key]
    })
  })

  // Modify 'result' as needed
  if (context.useESM) {
    result = `import ${JOME_LIB} from 'jome'\n\n` + result;
  } else {
    result = `const ${JOME_LIB} = require('jome')\n\n` + result;
  }

  // Generate the build file name
  const buildFileName = fullPath.replace(/\.jome$/, '.built.js');

  try {
    // Write the result to the file synchronously
    fs.writeFileSync(buildFileName, result);

    if (run) {
      Object.keys(context.stylesheets).forEach(name => {
        let cssPath;
        if (name === '__main__') {
          cssPath = fullPath.replace(/\.jome$/, '.built.css');
        } else {
          cssPath = path.join(path.dirname(fullPath), name)
        }
        // TODO: Insert a comment into the stylesheet that says what the source file is
        fs.writeFileSync(cssPath, context.stylesheets[name]);
        console.log(`Successfully wrote to '${cssPath}'.`);
      })
    }

    console.log(`Successfully wrote to '${buildFileName}'.`);
  } catch (err) {
    console.error('Error writing to the file:', err);
    return null
  }

  return {buildFileName, context}
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
export class JomeBuilder {
  constructor(params={}) {

    this.projectAbsPath = params.projectAbsPath || ''

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
      console.warn('Cannot compile file without .jome extension', absPath);
      return;
    }
  
    if (!absPath.startsWith(this.projectAbsPath)) {
      throw new Error("Only compiling files inside the project folder supported for now.")
    }
    let relPath = absPath.slice(this.projectAbsPath.length+1)
    console.log('Compiling File', relPath);
  
    try {
      // Check if the file exists
      fs.accessSync(absPath, fs.constants.F_OK);
    } catch (err) {
      console.error(`File '${absPath}' does not exist.`);
      return null
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

  compileAndSaveFile(absPath, ext) {

    let {result, context, missings, relPath} = this.compileFile(absPath, ext)

    let dir = path.dirname(relPath)
    let buildDir = path.join(this.buildAbsPath, dir)
    // Reproduce the directory structure inside the build directory.
    if (!fs.existsSync(buildDir)) (
      fs.mkdirSync(buildDir, { recursive: true })
    )
  
    missings.forEach(missing => {
      this.compileAndSaveFile(missing, '.built.js') // FIXMEEEEEEEEEEEEEEEEEEEEEEEEEEE. I could import a file of any type...
    })
  
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
  
    return {buildFileName, context, outFileName}
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

  async execute(absPath) {    
    let {result: scriptCode} = this.compileFile(absPath, '.js')
    const result = spawnSync('node', [], {
      input: scriptCode,
      encoding: 'utf-8',
    });
    
    // Check for errors
    if (result.error) {
      console.error(`Error in child process: ${result.error.message}`);
    }
    
    // Log the child process output
    console.log(`Child process output: ${result.stdout}`);
    
    // Log the exit code and signal
    console.log(`Child process exited with code ${result.status} and signal ${result.signal}`);
    
    // Perform actions after the child process has exited
    console.log('Child process has ended.');
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
      let result = await import(`../.jome/${path.join('build', dir)}/${f}`);
      let defaut = result.default
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

// TODO: Sort out the mess of this file...
// Use a single buildFile method
// Use a compile file, because when executing a file I don't want to write to an intermediary file.

export async function buildAndRunFile(fullPath, dependencies=[]) {
  let buildFileName = buildFile(fullPath, dependencies, true)?.buildFileName
  if (buildFileName) {
    console.log('Running built')
    await import(buildFileName);
  }
}