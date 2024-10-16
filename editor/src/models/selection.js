export const SELECTION_TYPE = {
  OBJECT: "object",
  TEXT: "text",
  FILE: "file",
  NONE: "none",
}

export class Selection {

  constructor(type, itemOrList) {
    this.type = type
    this.isEmpty = !itemOrList
    this.isMany = itemOrList && Array.isArray(itemOrList)
    this.list = this.isEmpty ? [] : (this.isMany ? itemOrList : [itemOrList])
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