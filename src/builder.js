import fs from 'fs';
import path from 'path';
import { CompileContext } from './compile_context.js';
import { compile, compileGetContext } from './compiler.js';

const JOME_LIB = 'jome'
const JOME_ROOT = '$'

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

  //let { result, context } = jome.buildGetContext(data, new CompileContext(run ? {} : {module: true}));
  let { result, context } = compileGetContext(data, new CompileContext(run ? {} : {module: true}));

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
    buildFile(path.join(directoryPart, missing), dependencies)
  })

  // Modify 'result' as needed
  if (run) {
    result = `const ${JOME_ROOT} = ${JOME_LIB}.createObj()\n` +
             `if (typeof window !== 'undefined') {window.${JOME_ROOT} = ${JOME_ROOT};}\n\n` +
             result
  }
  result = `import ${JOME_LIB} from 'jome'\n\n` + result;

  // Generate the build file name
  const buildFileName = fullPath.replace(/\.jome$/, '.built.js');

  try {
    // Write the result to the file synchronously
    fs.writeFileSync(buildFileName, result);
    console.log(`Successfully wrote to '${buildFileName}'.`);
  } catch (err) {
    console.error('Error writing to the file:', err);
    return null
  }

  return buildFileName
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
  let buildFileName = buildFile(fullPath, dependencies, true)
  if (buildFileName) {
    console.log('Running built')
    await import(buildFileName);
  }
}