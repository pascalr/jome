export const Selection = {

  none() {
    return { isEmpty: true }
  },

  node(node) {
    return { isNode: true, node }
  },
  
  nodeList(nodeList) {
    return { isNodeList: true, nodeList }
  },
  
  text(todo) {
    return {}
  },
  
  file(file) {
    return { isFile: true, file }
  },
  
  fileList(fileList) {
    return { isFileList: true, fileList }
  },

  merge(first, second) {

    // Group nodes together
    if ((first.isNode || first.isNodeList) && (second.isNode || second.isNodeList)) {
      let a = first.isNode ? [first.node] : first.nodeList
      let b = second.isNode ? [second.node] : second.nodeList
      return Selection.nodeList([...a, ...b])
    }

    // Group files together
    if ((first.isFile || first.isFileList) && (second.isFile || second.isFileList)) {
      let a = first.isFile ? [first.file] : first.fileList
      let b = second.isFile ? [second.file] : second.fileList
      return Selection.fileList([...a, ...b])
    }

    // Otherwise, they can't be merged, return the second selection
    return second
  }
  
}