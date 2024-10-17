import { createObjectLabelParts } from "../partials/object_label"

export const SELECTION_TYPE = {
  OBJECT: "Object",
  TEXT: "Text",
  FILE: "File",
  NONE: "none",
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