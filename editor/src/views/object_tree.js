import iconTree from '../../assets/icons/tree.svg'
import { addDockIcon, dockIcon, e, svgE } from '../helpers'
import { DockView } from '../view'
import { getRef, REF } from './skeleton'

class ObjectTree extends DockView {

  static itemId = "obj_tree"

  setup() {
    this.app.addDockIcon(ObjectTree.itemId, svgE(iconTree, "Object Tree"))
  }

  render() {
    let ref = getRef(REF.DOCK_CONTENT)
  
    ref.replaceChildren(...[
      e('div', {className: "panel-header"}, ["Object Tree"])
    ])
  }

  // onDocumentChange(document) {
  //   this.document = document
  //   this.update()
  // }

}

export function registerObjectTreeView(app) {
  app.registerView(new ObjectTree())
}