import {e} from '../helpers'

import { ActionView } from '../view'

class ActionsObjects extends ActionView {

  render() {
    let path = this.app.getProjectPath()
    if (!path) {return this.getRef().replaceChildren()}
    
    this.getRef().replaceChildren(e('div', {}, [
      e('div', {className: "panel-main-header"}, this.selection.getLabelParts()),
      e('p', {}, ["TODO"])
    ]))
  }

  onSelect({selection}) {
    this.selection = selection
    this.render()
  }

}

export function registerActionsObjects(app) {
  app.registerView(new ActionsObjects())
}