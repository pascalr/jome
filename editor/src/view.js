import { getRef, REF } from "./views/skeleton"

export class View {

  setApp(app) {
    this.app = app
  }

}

export class DockView extends View {

  onDockChange({itemId}) {
    this._active = itemId === this.constructor.itemId
    if (this._active) {this.render()}
  }

  isActive() {
    return this._active
  }

}

export class ActionView extends View {

  setup() {
    let panel = getRef(REF.ACTION_PANEL)
    this.ref = document.createElement('div')
    panel.appendChild(this.ref)
  }

  getRef() {
    return this.ref
  }

}