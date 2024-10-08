import iconTree from '../../assets/icons/tree.svg'
import { e, svgE } from '../helpers'
import { SideView } from '../sideview'

class ObjectTreeView extends SideView {

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

}

export function registerObjectTree(app) {
  let view = new ObjectTreeView()
  app.registerSideView(view)
  // app.addListener(view.getName(), 'file_changed', () => app.)
}