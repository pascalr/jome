function logError(error) {
  console.error(error)
}

export function loadFile(filepath, callback) {
  Neutralino.filesystem.readFile(filepath).then(callback).catch(logError)
}

function joinPaths(path1, path2) {
  // FIXME: On windows it's not /, path.join not working here because not bundling for node
  // TODO: Get info from the system to know what to use
  return path1+'/'+path2
}

function pathBasename(path) {
  return path.split(/[\\/]/).pop()
}

async function getDirectoryTree(dirPath, options) {
  
  if (options && options.exclude && options.exclude.includes(dirPath)) {return null}

  const stats = await Neutralino.filesystem.getStats(dirPath);
  console.log('stats', stats)
  const tree = {
    name: pathBasename(dirPath),
    path: dirPath,
    type: stats.isDirectory ? 'directory' : 'file',
  };

  if (stats.isDirectory) {
    let subs = await Neutralino.filesystem.readDirectory(dirPath)
    let entries = subs.map(d => d.entry)
    tree.children = entries.map(child => {

      return getDirectoryTree(joinPaths(dirPath,child), options);
    }).filter(f => f);
  }

  return tree;
}


export function loadFileTree(callback) {
  return getDirectoryTree('.').then(callback).catch(logError)
  // Neutralino.filesystem.readDirectory('.', {recursive: true}).then(callback).catch(logError)
}
