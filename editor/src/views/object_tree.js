import iconTree from '../../assets/icons/tree.svg'
import { dockIcon, e, svgE } from '../helpers'
import { View } from '../view'
import { getRef, REF } from './skeleton'

class ObjectTree extends View {

  setup() {
    let refButtons = getRef(REF.DOCK_BUTTONS)
    let el = dockIcon(this.app, svgE(iconTree, "Object Tree"), false)
    refButtons.appendChild(el)
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