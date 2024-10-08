import { DockView } from "../view"
import iconFolder2Open from '../../assets/icons/folder2-open.svg'
import { createHtmlTree } from "../lib/renderHtmlTree"
import { addDockIcon, dockIcon, e, svgE } from "../helpers"
import { getRef, REF } from "./skeleton"

async function buildTreeSub(app, listingEntry) {
  let children = []
  if (app.isFolderExpanded(listingEntry.path)) {
    let entries = await app.listDirectory(listingEntry.path)
    children = await Promise.all(entries.map(o => buildTreeSub(app, o)))
  }
  return { path: listingEntry.path, name: listingEntry.entry, isDirectory: listingEntry.type === "DIRECTORY", children }
}

async function buildTree(app, path) {
  let entries = await app.listDirectory(path)
  let children = await Promise.all(entries.map(o => buildTreeSub(app, o)))
  return { children } // path, name: getFilenameFromPath(path)
}

async function showExplorer(app) {
  // Load the navigation tree
  if (app.getProjectPath()) {
    let tree = await buildTree(app, app.getProjectPath())
    // // await app.listDirectory(app.data['PROJECT_PATH'])
    // app.loadFileTree(app.data['PROJECT_PATH'], tree => {
      let ref = document.getElementById('explorer-tree')
      if (ref) {
        // explorerList.innerHTML = renderHtmlTree(tree)
        ref.replaceChildren(createHtmlTree(tree, node => {
          return {id: node.path, className: "leaf", "data-path": node.path, open: app.isFolderExpanded(node.path), onclick: () => {
            if (node.isDirectory) {
              app.toggleDirectoryExpansion(node.path)
              showExplorer(app)
            } else {
              app.openFile(node.path)
            }
          }}
        }))
      }
    // })
  }
}

class Explorer extends DockView {

  static itemId = "explorer"

  setup() {
    this.app.addDockIcon(Explorer.itemId, svgE(iconFolder2Open, "File explorer"))
  }

  render() {
    let ref = getRef(REF.DOCK_CONTENT)

    ref.replaceChildren(...[
      e('div', {className: "panel-header"}, ["Explorer"]),
      e('div', {id: "explorer-tree"})
    ])
    showExplorer(this.app)
  }

  onFileChange({filepath, content}) {
    // update active in explorer tree
    // FIXME: DON'T DO THIS HERE. THE SELCTION SHOULD BE HANDLED ELSEWHERE AND IT IS THE SELECTION THAT SHOULD CALL openFile when needed
    ;[...document.querySelectorAll("#explorer-tree .leaf[selected]")].forEach(el => {
      el.removeAttribute('selected')
      // el.classList.remove("active")
    })
    const leaf = document.querySelector(`#explorer-tree .leaf[data-path="${filepath}"]`);
    if (leaf) {leaf.setAttribute('selected', "")}
  }

}

export function registerExplorerView(app) {
  app.registerView(new Explorer())
}