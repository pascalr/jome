import { capitalize } from "../utils"

export class ProseMirrorJomeTag {
 
  constructor(node) {
    // this.component = component
    this.node = node
    this.childrenAllowed = true
    this.children = []
  }

  getAttribute(name) {
    return this.node.attrs[name]
  }

  getKey() {
    return this.node.attrs._key
  }

  getDescription() {
    return this.node.attrs.name
  }
  
}

export class ProseMirrorJomeComponent extends ProseMirrorJomeTag { // TODO: Rename to Object and not Component, Component is the class, Object is the instance
 
  constructor(node) {
    super(node)
  }

  getComponentName() {
    return this.node.attrs._component
  }

  getLabel() {
    return this.getComponentName().toUpperCase()
  }

  getIconUrl() {
    return "./img/box.svg"
  }
  
}

export class ProseMirrorJomePrimitive extends ProseMirrorJomeTag {
 
  constructor(node) {
    super(node)
  }

  getTagName() {
    return this.node.type.name
  }

  getLabel() {
    return this.node.type.name.toLowerCase()
  }

  getIconUrl() {
    return "./img/triangle.svg"
  }
  
}

// Used to wrap all the text components together (h1, p, ul, ...)
export class ProseMirrorTextComponent {

  constructor(nodes) {
    this.nodes = nodes
    this.isTextBlock = true
    this.childrenAllowed = false
    this.children = []
  }

  getQuote() {
    return this.nodes[0].textContent.trimStart().slice(0,20)
  }

  getIconUrl() {
    return "./img/body-text.svg"
  }

}

export class ProseMirrorCodeComponent {

  constructor(node) {
    this.node = node
    this.isCodeBlock = true
    this.childrenAllowed = false
    this.children = []
  }
  
  getQuote() {
    return this.node.textContent.trimStart().slice(0,20)
  }

  getIconUrl() {
    return "./img/code-square.svg"
  }

}

// Only at the top of document there is text and code components.
function contentToComponents(app, content, parentComponent=null) {
  let components = []

  // OPTIMIZE: set instead of list, and don't recalculate every time
  let jomeComponentList = app.components.map(c => c.tagName)
  let jomePrimitiveList = app.primitives.map(c => c.tagName)

  let textElements = [] // Group together h1, p, ul, ...
  function checkPushTextComponent() {
    if (textElements.length) {
      components.push(new ProseMirrorTextComponent([...textElements]))
      textElements.splice(0)
    }
  }

  content.forEach((node) => {

    // TODO: Check that it has the attribute that says that it is raw code
    if (!parentComponent && node.type.name === 'code_block') {
      checkPushTextComponent()
      components.push(new ProseMirrorCodeComponent(node))
    } else if (jomeComponentList.includes(node.type.name)) {
      checkPushTextComponent()
      components.push(new ProseMirrorJomeComponent(node))
    } else if (parentComponent && jomePrimitiveList.includes(node.type.name)) {
      checkPushTextComponent()
      components.push(new ProseMirrorJomePrimitive(node))
    } else if (!parentComponent) {
      textElements.push(node)
    }
  })
  checkPushTextComponent()

  components.forEach(c => {
    if (parentComponent) {
      c.parent = parentComponent;
    }
    if (c.childrenAllowed) {
      c.children = contentToComponents(app, c.node.content, c)
    }
  })

  return components
}

export class ProseMirrorJomeDocument {

  constructor(app, doc) {
    this.app = app
    this.doc = doc
  }

  getRootComponents() {
    let roots = contentToComponents(this.app, this.doc.content)
    console.log('roots', roots)
    return roots
  }

}