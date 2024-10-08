import { createHtmlTree } from "../lib/renderHtmlTree"
import { SideView } from "../sideview"

import iconFolder2Open from '../../assets/icons/folder2-open.svg'
import { e, svgE } from "../helpers"

// this.data['DIR_LISTING'][path] = sorted // deprecated
// app.dirListings[path] = sorted

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
  if (app.data['PROJECT_PATH']) {
    let tree = await buildTree(app, app.data['PROJECT_PATH'])
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

class ExplorerView extends SideView {

  getName() {
    return "explorer"
  }

  getIcon() {
    return svgE(iconFolder2Open, "File explorer")
  }

  load() {
  }

  render(app, ref) {
    ref.replaceChildren(...[
      e('div', {className: "panel-header"}, ["Explorer"]),
      e('div', {id: "explorer-tree"})
    ])
    showExplorer(app)
  }

}

export function registerExplorer(app) {
  app.registerSideView(new ExplorerView())
}