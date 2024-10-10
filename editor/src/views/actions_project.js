import {e} from '../helpers'
import { getFilenameFromPath } from '../utils'

import { ActionView } from '../view'

class ActionsProject extends ActionView {

  render() {
    let path = this.app.getProjectPath()
    if (!path) {return this.getRef().replaceChildren()}
    
    let name = getFilenameFromPath(path)
    this.getRef().replaceChildren(e('div', {}, [
      e('div', {className: "panel-main-header"}, [`Project • ${name}`]),
      e('p', {}, ["TODO"])
    ]))
  }

  onProjectChange() { this.render() }

}

export function registerActionsProject(app) {
  app.registerView(new ActionsProject())
}