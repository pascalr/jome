export class View {

  setApp(app) {
    this.app = app
  }

}

export class DockView extends View {

  onDockChange({itemId}) {
    if (itemId === this.constructor.itemId) {this.render()}
  }

}