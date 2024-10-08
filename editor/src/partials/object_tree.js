import iconTree from '../../assets/icons/tree.svg'
import { e, svgE } from '../helpers'
import { SideView } from '../sideview'

class ObjectTreeView extends SideView {

  constructor() {
    super()
    this.document = null
  }

  getName() {
    return "obj_tree"
  }

  getIcon() {
    return svgE(iconTree, "Object Tree")
  }

  render(app, ref) {
    ref.replaceChildren(...[
      e('div', {className: "panel-header"}, ["Object Tree"])
    ])
  }

  getListeners() {
    return {
      documentChanged(document) {
        this.document = document
      }
    }
  }

  // listen(event) {
  //   if (event.type === 'file_changed') {

  //   }
  // }

}

export function registerObjectTree(app) {
  let view = new ObjectTreeView()
  app.registerSideView(view)
  // // This will only be called for the active SideView
  // app.addListener('file_changed', view.getName(), (filepath, content) => {

  // })
}