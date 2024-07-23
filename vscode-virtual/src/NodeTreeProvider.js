const vscode = require('vscode')
const path = require('path')

class NodeTreeProvider {
  constructor() {
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (!element) {
      return Promise.resolve([
        new JomeNodeItem("Recipe", "recipe")
      ])
    } else {
      return Promise.resolve([])
    }
  }
}

class JomeNodeItem extends vscode.TreeItem {
  constructor(kind, name, collapsibleState = true) {
    super(kind, collapsibleState);
    this.name = name
    this.tooltip = `This is a tooltip`;
    this.description = this.name;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'assets', 'light', 'view_in_ar_black_24dp.svg'),
    dark: path.join(__filename, '..', '..', 'assets', 'dark', 'view_in_ar_black_24dp.svg')
  };
}

module.exports = NodeTreeProvider