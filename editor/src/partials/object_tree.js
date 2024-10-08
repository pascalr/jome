import iconTree from '../../assets/icons/tree.svg'
import { svgE } from '../helpers'
import { SideView } from '../sideview'

class ObjectTreeView extends SideView {

  getName() {
    return "obj_tree"
  }

  getIcon() {
    return svgE(iconTree, "Object Tree")
  }

  load() {
  }

}

export function registerObjectTree(app) {
  app.registerSideView(new ObjectTreeView())
}