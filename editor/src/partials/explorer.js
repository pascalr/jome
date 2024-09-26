import { createHtmlTree } from "../lib/renderHtmlTree"

// this.data['DIR_LISTING'][path] = sorted // deprecated
// app.dirListings[path] = sorted

export async function showExplorer(app) {
  // Load the navigation tree
  if (app.data['PROJECT_PATH']) {
    // await app.listDirectory(app.data['PROJECT_PATH'])
    app.loadFileTree(app.data['PROJECT_PATH'], tree => {
      let ref = document.getElementById('explorer-tree')
      // explorerList.innerHTML = renderHtmlTree(tree)
      ref.replaceChildren(createHtmlTree(tree, leaf => {
        return {id: leaf.path, className: "leaf", "data-path": leaf.path, onclick: () => {
          app.openFile(leaf.path)
        }}
      }))
    })
  }
}