import iconTree from '../../assets/icons/tree.svg'
import { e, svgE } from '../helpers'
import { Selection, SELECTION_TYPE } from '../models/selection'
import { DockView } from '../view'
import { getRef, REF } from './skeleton'

function createNestingLines(depth) {
  let els = []
  for (let i = 0; i < depth; i++) {
    els.push(e('span', {className: "component-nesting-line"}))
  }
  return els
}

class ObjectTree extends DockView {

  static itemId = "obj_tree"

  setup() {
    this.app.addDockIcon(ObjectTree.itemId, svgE(iconTree, "Object Tree"))
    this.objectsExpanded = {}
  }

  render() {
    let ref = getRef(REF.DOCK_CONTENT)
  
    ref.replaceChildren(...[
      e('div', {className: "panel-header"}, ["Object Tree"])
    ])

    let tree = e('div', {className: "object-tree"})

    if (this.doc) {
      let roots = this.doc.getRootComponents()
      tree.replaceChildren(...roots.map(r => this.createComponentBranchDivs(r)).flat())
    }

    ref.appendChild(tree)
  }

  onDocumentBatchChange(doc) {
    this.doc = doc
    if (this.isActive()) {this.render()}
  }

  handleComponentNodeClick(component, evt) {
    if (component.childrenAllowed) {
      let key = component.getKey()
      this.objectsExpanded[key] = !this.objectsExpanded[key]
      this.app.select(new Selection(SELECTION_TYPE.OBJECT, component))
      this.render()
    }
  }
  
  createComponentBranchDivs(component, depth=0) {
    let expanded = component.childrenAllowed && this.objectsExpanded[component.getKey()]
    let caret = component.children.length ? [e('span', {className: expanded ? "component-caret-down" : "component-caret-right"})] : []
    let div = e('div', {className: "component-node", onclick: (evt) => this.handleComponentNodeClick(component, evt)}, [
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
    if (expanded) {
      component.children.forEach(c => {
        divs = [...divs, ...this.createComponentBranchDivs(c, depth+1)]
      })
    }
    return divs
  }

}

export function registerObjectTreeView(app) {
  app.registerView(new ObjectTree())
}