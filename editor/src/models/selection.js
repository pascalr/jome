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

export class Selection {

  // Source of change: Does it come from clicking in the side menu? From the text editor?
  // Used to avoid handling the event if the source of change is itself
  constructor(type, itemOrList, sourceOfChange) {
    this.type = type
    this.isEmpty = !itemOrList
    this.isMany = itemOrList && Array.isArray(itemOrList)
    this.list = this.isEmpty ? [] : (this.isMany ? itemOrList : [itemOrList])
    this.sourceOfChange = sourceOfChange
  }

  getLabelParts() {
    if (this.isEmpty) {return [""]}
    if (this.isMany) {return [`${this.list.length} ${this.type}s selected`]}
    if (this.type === SELECTION_TYPE.OBJECT) {
      return createObjectLabelParts(this.list[0])
    }
    return ["TODO"]
  }

  getItem() {
    return this.list[0]
  }

  getType() {
    return this.type
  }

  merge(other) {
    if (this.type === other.type) {
      this.list = [...this.list, ...other.list]
      return this
    } else {
      // Override the selection with the new one
      return other
    }
  }

}