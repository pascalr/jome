import iconTree from '../../assets/icons/tree.svg'
import { addDockIcon, dockIcon, e, svgE } from '../helpers'
import { analyzeJomeSegment } from '../jome_analyzer'
import { DockView } from '../view'
import { getRef, REF } from './skeleton'

function extractComponentName(tagName) {
  // FIXME: hardcoded string
  if (tagName.toLowerCase().startsWith('jome-')) {
    return tagName.slice(5)
  } else if (tagName.toLowerCase().startsWith('j-')) {
    return tagName.slice(2)
  }
  return tagName
}

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
      let roots = this.doc.getRootComponents()
      roots.forEach(root => {
        window.debugRoot = root
        console.log('description', root.getDescription())
        tree.appendChild(e('div', {}, [
          e('span', {className: "component-label"}, [root.getLabel()]),
          e('span', {className: "component-description"}, [root.getDescription()||""])
        ]))
      })
    }

    ref.appendChild(tree)
  }

  // TODO: Don't listen to document change
  // Listen to the DOM change,
  // then simply read the DOM and show what's in it.
  // Wait probably not a good idea, depends how it's implemented...

  // onDocumentChange({doc}) {
  //   this.doc = doc
  //   if (this.isActive()) {this.render()}
  // }

  // TODO: This will be onDocumentChange later when this works
  onDocumentBatchChange(doc) {
    this.doc = doc
    if (this.isActive()) {this.render()}
  }

}

export function registerObjectTreeView(app) {
  app.registerView(new ObjectTree())
}