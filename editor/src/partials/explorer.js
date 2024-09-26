import { createHtmlTree } from "../lib/renderHtmlTree"
import { getFilenameFromPath } from "../utils"

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

export async function showExplorer(app) {
  // Load the navigation tree
  if (app.data['PROJECT_PATH']) {
    let tree = await buildTree(app, app.data['PROJECT_PATH'])
    // // await app.listDirectory(app.data['PROJECT_PATH'])
    // app.loadFileTree(app.data['PROJECT_PATH'], tree => {
      let ref = document.getElementById('explorer-tree')
      // explorerList.innerHTML = renderHtmlTree(tree)
      ref.replaceChildren(createHtmlTree(tree, leaf => {
        return {id: leaf.path, className: "leaf", "data-path": leaf.path, onclick: () => {
          app.openFile(leaf.path)
        }}
      }))
    // })
  }
}