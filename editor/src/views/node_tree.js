import iconTree from '../../assets/icons/tree.svg'
import iconPlus from '../../assets/icons/plus.svg'
import { createBtn, e, svgE } from '../helpers'
import { Selection } from '../models/selection'
import { createObjectLabelParts } from '../partials/object_label'
import { DockView } from '../view'
import { getRef, REF } from './skeleton'

function createNestingLines(depth) {
  let els = []
  for (let i = 0; i < depth; i++) {
    els.push(e('span', {className: "component-nesting-line"}))
  }
  return els
}

class NodeTree extends DockView {

  static itemId = "obj_tree"

  setup() {
    this.app.addDockIcon(NodeTree.itemId, svgE(iconTree, "Node Tree"))
    this.objectsExpanded = {}
  }

  render() {
    let ref = getRef(REF.DOCK_CONTENT)
  
    ref.replaceChildren(...[
      e('div', {className: "panel-header"}, ["Object Tree"]),
      e('div', {className: "panel-toolbar"}, [
        e('input', {className: "filter-input", placeholder: "Filter..."}),
        e('div', {style: "float: right;"}, [
          createBtn(iconPlus, "Add node", () => {})
        ])
      ])
    ])

    let tree = e('div', {className: "object-tree"})

    if (this.doc) {
      let roots = this.doc.getRootComponents()
      tree.replaceChildren(...roots.map(r => this.createNodesDivs(r)).flat())
    }

    ref.appendChild(tree)
  }

  onDocumentBatchChange(doc) {
    this.doc = doc
    if (this.isActive()) {this.render()}
  }

  handleComponentNodeClick(node, evt) {
    if (node.childrenAllowed) {
      let key = node.getKey()
      this.objectsExpanded[key] = !this.objectsExpanded[key]
      this.app.select(Selection.node(node))
    }
  }
  
  createNodesDivs(node, depth=0) {
    let expanded = node.childrenAllowed && this.objectsExpanded[node.getKey()]
    let caret = node.children.length ? [e('span', {className: expanded ? "component-caret-down" : "component-caret-right"})] : []
    let div = e('div', {className: "component-node", onclick: (evt) => this.handleComponentNodeClick(node, evt)}, [
      ...caret,
      ...createNestingLines(depth),
      ...createObjectLabelParts(node)
    ])
    let divs = [div]
    if (expanded) {
      node.children.forEach(c => {
        divs = [...divs, ...this.createNodesDivs(c, depth+1)]
      })
    }
    return divs
  }

  onSelect() {
    this.render()
  }

}

export function registerNodeTreeView(app) {
  app.registerView(new NodeTree())
}