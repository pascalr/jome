import jome from 'jome'


import {Div} from "./lib/html.built.js";

`
  .jome-html.screen {
    min-height: 100vh;
    width: 100vw;
    display: grid; /* grid is decently supported now: https://caniuse.com/css-grid */
  }
  .jome-html.panel {
    background-color: #aaa;
  }
  .jome-html.row {
    display: flex;
  }
  .jome-html.column {
    display: flex;
    flex-direction: column;
  }
`
export class HBox {
  
}

export class VBox {
  
}

class Tag {
  constructor(tag, content) {
    this.tag = tag
    this.content = content
  }
  toString() {
    return `<${this.tag}${renderHTMLAttrs(this)}>${this.content || ''}${renderHTMLChildren(this)}</${this.tag}>`
  }
}

export class Txt {
  constructor(content) {
    this.content = content
  }
  toString() {
    return `<span>${content}</span>`
  }
}

export class Screen {
  toString() {
    return `
    <div class="jome-html screen">
      ${jome.getChildren(this).map((c) => {
      return c.toString()
    }).join('\n')}
    </div>
  `
  }
}

export class Panel extends Div {
  constructor() {
    super()
  }
  
}

export class Row {
  toString() {
    return `
    <div class="jome-html row">
      ${jome.getChildren(this).map((c) => {
      return c.toString()
    }).join('\n')}
    </div>
  `
  }
}

export class Col {
  toString() {
    return `
    <div class="jome-html column">
      ${jome.getChildren(this).map((c) => {
      return c.toString()
    }).join('\n')}
    </div>
  `
  }
}

