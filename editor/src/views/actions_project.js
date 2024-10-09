import {e} from '../helpers'

import { ActionView } from '../view'

class ActionsProject extends ActionView {

  render() {
    
    this.getRef().replaceChildren(e('div', {}, [
      e('div', {className: "panel-main-header"}, ["Project • FIXME"]),
      e('p', {}, ["TODO"])
    ]))
  }

  onProjectChange() { console.log('here!!!'); this.render() }

}

export function registerActionsProject(app) {
  app.registerView(new ActionsProject())
}