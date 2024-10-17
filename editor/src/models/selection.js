import { createObjectLabelParts } from "../partials/object_label"

export const SELECTION_TYPE = {
  OBJECT: "Object",
  TEXT: "Text",
  FILE: "File",
  NONE: "none",
}

// export class ObjectSelection {

// }

// export class TextSelection {

// }

// export class FileSelection {

// }

// export class ObjectListSelection {

// }

// export class FileListSelection {

// }

export const SelectionV2 = {

  selectNone() {
    return { isEmpty: true }
  },

  selectNode(node) {
    return { isNode: true, node }
  },
  
  selectNodeList(nodeList) {
    return { isNodeList: true, nodeList }
  },
  
  selectText(todo) {
    return {}
  },
  
  selectFile(file) {
    return { isFile: true, file }
  },
  
  selectFileList(fileList) {
    return { isFileList: true, fileList }
  },

  merge(first, second) {

    // Group nodes together
    if ((first.isNode || first.isNodeList) && (second.isNode || second.isNodeList)) {
      let a = first.isNode ? [first.node] : first.nodeList
      let b = second.isNode ? [second.node] : second.nodeList
      return SelectionV2.selectNodeList([...a, ...b])
    }

    // Group files together
    if ((first.isFile || first.isFileList) && (second.isFile || second.isFileList)) {
      let a = first.isFile ? [first.file] : first.fileList
      let b = second.isFile ? [second.file] : second.fileList
      return SelectionV2.selectFileList([...a, ...b])
    }

    // Otherwise, they can't be merged, return the second selection
    return second
  }
  
}