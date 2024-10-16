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

function handleComponentNodeClick(app, component, evt) {
  
}

function createComponentBranchDivs(app, component, depth=0) {
  let caret = component.children.length ? [e('span', {className: "component-caret-down"})] : []
  let div = e('div', {className: "component-node", onclick: (evt) => handleComponentNodeClick(app, component, evt)}, [
    ...caret,
    ...createNestingLines(depth),
    e('span', {className: "component-icon", style: `background-image: url('${component.getIconUrl()}')`})
  ])
  if (component.isTextBlock || component.isCodeBlock) {
    div.appendChild(e('span', {className: "component-quote"}, [component.getQuote()]))
  } else {
    div.appendChild(e('span', {className: "component-label"}, [component.getLabel()]))
    div.appendChild(e('span', {className: "component-description"}, [component.getDescription()||""]))
  }
  let divs = [div]
  component.children.forEach(c => {
    divs = [...divs, ...createComponentBranchDivs(app, c, depth+1)]
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
      tree.replaceChildren(...roots.map(r => createComponentBranchDivs(this.app, r)).flat())
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