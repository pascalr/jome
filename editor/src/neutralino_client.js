function logError(error) {
  console.error(error)
}

export function loadFile(filepath, callback) {
  Neutralino.filesystem.readFile(filepath).then(callback).catch(logError)
}

export function loadFileTree(callback) {
  Neutralino.filesystem.readDirectory('.', {recursive: true}).then(callback).catch(logError)
}
