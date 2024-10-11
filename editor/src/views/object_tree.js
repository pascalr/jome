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

    if (this.doc) {
      ref.appendChild(e('div', {className: "object-tree"}, this.doc.segments.map(segment => {
        return e('div', {}, ["Segment"])
      })))
    }
  }

  onDocumentChange({doc}) {
    this.doc = doc
    if (this.isActive()) {this.render()}
  }

}

export function registerObjectTreeView(app) {
  app.registerView(new ObjectTree())
}