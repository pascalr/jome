import iconTree from '../../assets/icons/tree.svg'
import { e, svgE } from '../helpers'
import { DockView } from '../view'
import { getRef, REF } from './skeleton'

function createNestingLines(depth) {
  let els = []
  for (let i = 0; i < depth; i++) {
    els.push(e('span', {className: "component-nesting-line"}))
  }
  return els
}

function createComponentBranchDivs(component, depth=0) {
  let caret = component.children.length ? [e('span', {className: "component-caret-down"})] : []
  let divs = [e('div', {className: "component-node"}, [
    ...caret,
    ...createNestingLines(depth),
    e('span', {className: "component-icon", style: `background-image: url('${component.getIconUrl()}')`}),
    e('span', {className: "component-label"}, [component.getLabel()]),
    e('span', {className: "component-description"}, [component.getDescription()||""])
  ])]
  component.children.forEach(c => {
    divs = [...divs, ...createComponentBranchDivs(c, depth+1)]
  })
  return divs
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
      tree.replaceChildren(...roots.map(r => createComponentBranchDivs(r)).flat())
    }

    ref.appendChild(tree)
  }

  onDocumentBatchChange(doc) {
    this.doc = doc
    if (this.isActive()) {this.render()}
  }

}

export function registerObjectTreeView(app) {
  app.registerView(new ObjectTree())
}