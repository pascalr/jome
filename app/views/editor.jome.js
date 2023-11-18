const jome = require('jome')


const {HtmlPage} = require("../../lib/html-page.built.js");
const {Div, renderHtmlTag} = require("../../lib/html.built.js");

const boxCss = (obj) => {
  return {width: obj.width, height: obj.height, "background-color": obj.color, margin: obj.margin, border: obj.border, "flex-grow": obj.grow, "flex-shrink": obj.shrink}
}
const textCss = (obj) => {
  return {color: obj.color, "font-weight": obj.bold ? "bold" : null}
}
class Screen {
  constructor(__props__) {
    this.__props__ = __props__
    this.width = __props__.width
    this.height = __props__.height
    this.color = __props__.color
    this.margin = __props__.margin
    this.border = __props__.border
    this.shrink = __props__.shrink
    this.grow = __props__.grow
  }
  toString() {
    return renderHtmlTag({class: "jome-html screen", css: {width: this.width, height: this.height, "background-color": this.color}}, 'div', (this.$?.children||[]))
  }
}

class Panel {
  constructor(__props__) {
    this.__props__ = __props__
    this.width = __props__.width
    this.height = __props__.height
    this.color = __props__.color
    this.margin = __props__.margin
    this.border = __props__.border
    this.shrink = __props__.shrink
    this.grow = __props__.grow
  }
  toString() {
    return renderHtmlTag({class: "jome-html panel", css: boxCss(this)}, 'div', (this.$?.children||[]))
  }
}

class Row {
  toString() {
    return renderHtmlTag({class: "jome-html row"}, 'div', (this.$?.children||[]))
  }
}

class Col {
  toString() {
    return renderHtmlTag({class: "jome-html col"}, 'div', (this.$?.children||[]))
  }
}

class HSplit {
  constructor(__props__) {
    this.__props__ = __props__
    this.width = __props__.width
    this.height = __props__.height
    this.color = __props__.color
    this.margin = __props__.margin
    this.border = __props__.border
    this.shrink = __props__.shrink
    this.grow = __props__.grow
  }
  toString() {
    return renderHtmlTag({class: "jome-html hsplit", css: boxCss(this)}, 'div', (this.$?.children||[]))
  }
}

class VSplit {
  constructor(__props__) {
    this.__props__ = __props__
    this.width = __props__.width
    this.height = __props__.height
    this.color = __props__.color
    this.margin = __props__.margin
    this.border = __props__.border
    this.shrink = __props__.shrink
    this.grow = __props__.grow
  }
  toString() {
    return renderHtmlTag({class: "jome-html vsplit", css: boxCss(this)}, 'div', (this.$?.children||[]))
  }
}

class HAligned {
  constructor(__props__) {
    this.__props__ = __props__
    this.width = __props__.width
    this.height = __props__.height
    this.color = __props__.color
    this.margin = __props__.margin
    this.border = __props__.border
    this.shrink = __props__.shrink
    this.grow = __props__.grow
  }
  toString() {
    return renderHtmlTag({class: "jome-html haligned", css: boxCss(this)}, 'div', (this.$?.children||[]))
  }
}

class Txt {
  constructor(__props__, content) {
    this.content = content
    this.__props__ = __props__
    this.color = __props__.color
    this.bold = __props__.bold
    this.class = __props__.class
  }
  toString() {
    return renderHtmlTag({class: `jome-html${this.class ? ` ${this.class}` : ''}`, css: textCss(this)}, 'span', null, this.content)
  }
}

class Link {
  constructor(__props__, content) {
    this.content = content
    this.__props__ = __props__
    this.color = __props__.color
    this.bold = __props__.bold
    this.class = __props__.class
    this.to = __props__.to
  }
  toString() {
    return renderHtmlTag({class: `jome-html${this.class ? ` ${this.class}` : ''}`, href: this.to, css: textCss(this)}, 'a', (this.$?.children||[]), this.content)
  }
}

var bgColor1 = "#d6dbe2"
var bgColor2 = "#b5bcc9"
var bgColorSelected = "#c8b099"
var bgColor3 = "#d1d6de"
var bgColor4 = "#b2b2b2"
var bod = jome(new Screen({color: bgColor1}))
  .addChildNode(jome(new VSplit({}))
  .addChildNode(jome(new HAligned({height: '30px'}))
  .addChild(new Txt({class: 'editor-navbtn', bold: true}, "JomeEditor"))
  .addChild(new Txt({class: 'editor-navbtn'}, "File"))
  .addChild(new Txt({class: 'editor-navbtn'}, "Edit"))
  .addChild(new Panel({shrink: 1}))
  .addChild(new Link({to: `${process.env.URL}/`, class: 'editor-navbtn'}, "About Jome")))
  .addChildNode(jome(new HSplit({}))
  .addChildNode(jome(new VSplit({width: '200px'}))
  .addChild(new Panel({height: '50%', color: bgColor3, border: `4px solid ${bgColor2}`}))
  .addChild(new Panel({shrink: 1, color: bgColor3, border: `4px solid ${bgColor2}`})))
  .addChild(new Panel({shrink: 1, color: bgColor3, border: `4px solid ${bgColor2}`}))
  .addChild(new Panel({width: '200px', color: bgColor3, border: `4px solid ${bgColor2}`}))))
  .node()
module.exports = new HtmlPage({title: 'Jome editor', stylesheets: [`${process.env.URL}/reset.css`, `${process.env.URL}/jome-html.css`], body: bod.toString()}).toString()