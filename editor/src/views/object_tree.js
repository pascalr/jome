import iconTree from '../../assets/icons/tree.svg'
import { addDockIcon, dockIcon, e, svgE } from '../helpers'
import { analyzeJomeSegment } from '../jome_analyzer'
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

    let tree = e('div', {className: "object-tree"})

    if (this.doc) {
      this.doc.segments.forEach(segment => {
        if (!segment.isRaw) {
          let tags = analyzeJomeSegment(segment.str)
          tags.forEach(tag => {
            tree.appendChild(e('div', {}, [tag.name]))
          })
        }
      })
    }

    ref.appendChild(tree)
  }

  // TODO: Don't listen to document change
  // Listen to the DOM change,
  // then simply read the DOM and show what's in it.
  // Wait probably not a good idea, depends how it's implemented...

  onDocumentChange({doc}) {
    this.doc = doc
    if (this.isActive()) {this.render()}
  }

}

export function registerObjectTreeView(app) {
  app.registerView(new ObjectTree())
}