export const SELECTION_TYPE = {
  OBJECT: "Object",
  TEXT: "Text",
  FILE: "File",
  NONE: "none",
}

export class Selection {

  constructor(type, itemOrList) {
    this.type = type
    this.isEmpty = !itemOrList
    this.isMany = itemOrList && Array.isArray(itemOrList)
    this.list = this.isEmpty ? [] : (this.isMany ? itemOrList : [itemOrList])
  }

  getLabel() {
    if (this.isEmpty) {return ""}
    if (this.isMany) {return `${this.list.length} ${this.type}s selected`}
    if (this.type === SELECTION_TYPE.OBJECT) {
      return `Object ${this.list[0].getLabel()} ${this.list[0].getDescription()}`
    }
    return "TODO"
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