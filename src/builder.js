import fs from 'fs';
import path from 'path';
import { CompileContext } from './compile_context.js';
import { compile, compileGetContext } from './compiler.js';
import { fileURLToPath } from 'url';

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
  result = `import ${JOME_LIB} from 'jome'\n\n` + result;

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

export class JomeBuilder {
  constructor(params={}) {
    this.projectAbsPath = params.projectAbsPath
    this.buildAbsPath = params.buildAbsPath
    this.outDir = params.outDir
    this.dependencies = []
  }

  buildFile(absPath, ext) {
    if (!absPath.endsWith('.jome')) {
      console.warn('Cannot build file without .jome extension', absPath);
      return;
    }
  
    if (!absPath.startsWith(this.projectAbsPath)) {
      throw new Error("Only building files inside the project folder supported for now.")
    }
    let relPath = absPath.slice(this.projectAbsPath.length+1)
    console.log('Building File', relPath);
  
    try {
      // Check if the file exists
      fs.accessSync(absPath, fs.constants.F_OK);
    } catch (err) {
      console.error(`File '${absPath}' does not exist.`);
      return null
    }

    let dir = path.dirname(relPath)
    let buildDir = path.join(this.buildAbsPath, dir)
    // Reproduce the directory structure inside the build directory.
    if (!fs.existsSync(buildDir)) (
      fs.mkdirSync(buildDir, { recursive: true })
    )
  
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
  
    missings.forEach(missing => {
      this.buildFile(missing, '.built.js') // FIXMEEEEEEEEEEEEEEEEEEEEEEEEEEE. I could import a file of any type...
    })
  
    if (ext.endsWith('.js')) {
      result = `import ${JOME_LIB} from 'jome'\n\n` + result;
    }
  
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
  
    return {buildFileName, context}
  }

  /**
   * Copies files to the output directory
   */
  asset(params={}, filename) {
    let out = path.join(this.outDir, params.as || filename)
    fs.copyFileSync(filename, out)
  }

  /**
   * Compiles the given jome file into an intermediary .js file stored in .jome folder.
   * Then runs this .js file and store the result based on params.as
   */
  async src(params={}, relPath) {
    let type = path.extname(relPath).slice(1)
    let dir = path.dirname(relPath)
    let fileAbsPath = path.join(this.projectAbsPath, relPath)
    let ext = `.${type}.js`
    this.buildFile(fileAbsPath, ext)
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
  }
}

// // FIXME: This makes a whole lot of ugly assomptions for paths.........
// // FIXME: This currently does not work because it is building asynchronously files I think
// /** @deprecated Use buildFile instead */
// export function buildFileAsync(fullPath, dependencies=[], callback) {
//   if (!fullPath.endsWith('.jome')) {
//     return console.warn('cannot build file not .jome extension', fullPath)  
//   }
//   console.log('buildingFile', fullPath)
//   // Check if the file exists
//   fs.access(fullPath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error(`File '${fullPath}' does not exist.`);
//     } else {
//       // Read and display the contents of the file
//       fs.readFile(fullPath, 'utf8', async (err, data) => {
//         if (err) {
//           console.error('Error reading the file:', err);
//         } else {
//           let jome = new Jome()
//           let {result, context} = jome.buildGetContext(data, new CompileContext(callback ? {} : {module: true}))

//           // FIXMEEEEEEEEEEEEEEEEEE dependencies are relative to the path of the file, handle that

//           let missings = []
//           context.dependencies.forEach(dependency => {
//             if (!(dependency in dependencies)) {
//               dependencies.push(dependency)
//               missings.push(dependency)
//             }
//           })

//           const directoryPart = path.dirname(fullPath);
//           missings.forEach(missing => {
//             buildFile(path.join(directoryPart, missing), dependencies)
//           })

//           //let nb = (fullPath.match(/\//g)||[]).length;
//           //if (fullPath.startsWith('./')) {nb -= 1}
//           if (callback) {
//             result = `const $ = $$.newObj()\nif (typeof window !== 'undefined') {window.$ = $;}\n\n` + result
//           }
//           //result = `import {$$} from '${'../'.repeat(nb)}./src/jome_v9.js'\n\n` + result
//           result = `import {$$} from 'jome_lib'\n\n` + result

//           //let buildFileName = "build/built.js"
//           let buildFileName = fullPath.replace(/\.jome$/, ".built.js")
//           fs.writeFile(buildFileName, result, async (err) => {
//             if (err) {
//                 console.error('Error writing to the file:', err);
//             } else {
//                 console.log(`Successfully wrote to '${buildFileName}'.`);
//                 if (callback) {
//                   callback(buildFileName)
//                 }
//             }
//           });
//         }
//       });
//     }
//   });
// }

export async function buildAndRunFile(fullPath, dependencies=[]) {
  let buildFileName = buildFile(fullPath, dependencies, true)?.buildFileName
  if (buildFileName) {
    console.log('Running built')
    await import(buildFileName);
  }
}