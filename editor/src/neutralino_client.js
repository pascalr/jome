import { getFilenameFromPath } from "./utils"

function logError(error) {
  console.error(error)
}

export function loadFile(filepath, callback) {
  Neutralino.filesystem.readFile(filepath).then(content => {
    callback({name: getFilenameFromPath(filepath), path: filepath, content})
  }).catch(logError)
}

function joinPaths(path1, path2) {
  // FIXME: On windows it's not /, path.join not working here because not bundling for node
  // TODO: Get info from the system to know what to use
  return path1+'/'+path2
}

function entryToBranch(entry) {
  return {name: entry.entry, path: entry.path, type: entry.type === "DIRECTORY" ? 'directory' : 'file', children: []}
}

// TODO: Only read directories that are opened. I have barely nothing in my project, but still have over 4000 files because of node_modules...
async function getDirectoryTreeWIP(dirPath) {

  let subs = await Neutralino.filesystem.readDirectory(dirPath)
  let sorted = subs.sort((a,b) => {
    if (a.type === b.type) {
      return a.entry.localeCompare(b.entry)
    }
    return a.type === 'FILE'
  })

  console.log('subs', subs)
  console.log('sorted', sorted)

  return {
    name: 'WIP',
    path: dirPath,
    type: 'directory',
    children: sorted.map(s => entryToBranch(s))
  }
}

// async function getDirectoryTree(dirPath, options) {

//   getDirectoryTreeTest(dirPath, options)
  
//   if (options && options.exclude && options.exclude.includes(dirPath)) {return null}

//   const stats = await Neutralino.filesystem.getStats(dirPath);
//   console.log('stats', stats)
//   const tree = {
//     name: pathBasename(dirPath),
//     path: dirPath,
//     type: stats.isDirectory ? 'directory' : 'file',
//   };

//   if (stats.isDirectory) {
//     let subs = await Neutralino.filesystem.readDirectory(dirPath)
//     let entries = subs.map(d => d.entry)
//     tree.children = entries.map(child => {

//       return getDirectoryTree(joinPaths(dirPath,child), options);
//     }).filter(f => f);
//   }

//   return tree;
// }


export function loadFileTree(callback) {
  return getDirectoryTreeWIP('.').then(callback).catch(logError)
  //return getDirectoryTree('.').then(callback).catch(logError)
  // Neutralino.filesystem.readDirectory('.', {recursive: true}).then(callback).catch(logError)
}
