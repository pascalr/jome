import { capitalize } from "../utils"

export class ProseMirrorJomeComponent {
 
  constructor(node) {
    // this.component = component
    this.node = node
  }

  getLabel() {
    return this.node.type.name.toUpperCase()
  }

  getDescription() {
    return this.node.attrs.name
  }
  
}

// Used to wrap all the text components together (h1, p, ul, ...)
export class ProseMirrorTextComponent {

  constructor(nodes) {
    this.nodes = nodes
    this.isTextBlock = true
  }

  getLabel() {
    return "Aa"
  }

  getDescription() {
    return this.nodes[0].textContent.trimStart().slice(0,20)
  }

}

export class ProseMirrorCodeComponent {

  constructor(node) {
    this.node = node
    this.isCodeBlock = true
  }

  getLabel() {
    return "<>"
  }

  getDescription() {
    return this.node.textContent.trimStart().slice(0,20)
  }

}

export class ProseMirrorJomeDocument {

  constructor(app, doc) {
    this.app = app
    this.doc = doc
  }

  getRootComponents() {
    let roots = []

    // OPTIMIZE: set instead of list
    let jomeComponentList = this.app.components.map(c => c.componentName)

    let textElements = [] // Group together h1, p, ul, ...
    function checkPushTextComponent() {
      if (textElements.length) {
        roots.push(new ProseMirrorTextComponent([...textElements]))
        textElements.splice(0)
      }
    }

    this.doc.content.forEach((node) => {

      // TODO: Check that it has the attribute that says that it is raw code
      if (node.type.name === 'code_block') {
        checkPushTextComponent()
        roots.push(new ProseMirrorCodeComponent(node))
      } else if (jomeComponentList.includes(node.type.name)) {
        checkPushTextComponent()
        roots.push(new ProseMirrorJomeComponent(node))
      } else {
        textElements.push(node)
      }
    })
    checkPushTextComponent()

    console.log('roots', roots)

    return roots
  }

}