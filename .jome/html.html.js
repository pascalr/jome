import jome from 'jome'


const renderHTMLAttrs = (obj) => {
  var r = Object.keys(obj?.$?.signals || {}).map((n) => {
    return `on${n}="jome.run('$${obj?.$?.path}.${n}()')"`
  }, ).join(" ")
r = r + (Object.entries(jome.props(obj) || {}).filter((entry) => {
    return entry[0] != 'css'
  }).map((entry) => {
    return `${entry[0]}="${entry[1]}"`
  }, ).join(" "))
r = r + (obj?.$?.hasOwnProperty('css') ? ('style="' + Object.entries(obj.css || {}).map((entry) => {
    return `${entry[0]}: ${entry[1]}`
  }).join('; ') + '"') : '')
return r ? (' ' + r) : r
}
const renderHTMLChildren = (obj) => {
  return jome.getChildren(obj).map((c) => {
    return c.toString ? c.toString() : ''
  }).join("")
}
const renderHTML = (obj, target) => {
  var elem = document.getElementById(target)
var children = []
var html = ''
jome.getChildren(obj).forEach((child) => {
    if (child.createElem) {
      var e = child.createElem()
children.push(e)
    } else if (child.toString) {
      html = child.toString()
    }
  })
elem.innerHTML = html
return children.forEach((child) => {
    return elem.appendChild(child)
  })
}
var HTML_EVENTS = ["click", "dblclick", "mouseover", "mouseout", "mousedown", "mouseup", "mousemove", "contextmenu", "keydown", "keyup", "keypress", "submit", "reset", "change", "focus", "blur", "input", "touchstart", "touchend", "touchmove", "touchcancel", "load", "unload", "resize", "scroll", "play", "pause", "ended", "volumechange", "timeupdate", "dragstart", "drag", "dragenter", "dragleave", "dragover", "drop", "dragend", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend"]
class Html {
  __signal__run() {
    return document.getElementById(target).innerHTML = renderHTMLChildren(this)
  }
}

const createElem = (obj, tag, content, ns) => {
  var el = (ns ? document.createElementNS(ns, tag) : document.createElement(tag))
if (content) {
    el.appendChild(document.createTextNode(content))
  }
Object.entries(jome.props(obj) || {}).filter((entry) => {
    return entry[0] != 'css'
  }).forEach((entry) => {
    return el.setAttribute(entry[0], entry[1])
  })
if (obj.css) {
    el.style = Object.entries(obj.css || {}).map((entry) => {
      return `${entry[0]}: ${entry[1]}`
    }).join('; ')
  }
jome.getChildren(obj).forEach((child) => {
    if (child.createElem) {
      el.appendChild(child.createElem())
    } else if (child.toString) {
      var tmp = document.createElement("div")
tmp.innerHTML = child.toString()
console.log('here', tmp.innerHTML)
el.appendChild(tmp.firstElementChild)
    }
  })
Object.keys(obj?.$?.signals || {}).forEach((n) => {
    if (HTML_EVENTS.includes(n)) {
      el.addEventListener(n, obj['~' + n])
    }
  })
return el
}
class Tag {
  constructor(tag, content) {
    this.tag = tag
    this.content = content
  }
  toString() {
    return `<${this.tag}${renderHTMLAttrs(this)}>${this.content || ''}${renderHTMLChildren(this)}</${this.tag}>`
  }
  createElem() {
    return createElem(this, this.tag, this.content)
  }
}

class InlineTag {
  constructor(tag) {
    this.tag = tag
  }
  toString() {
    return `<${this.tag}${renderHTMLAttrs(this)} />`
  }
  createElem() {
    return createElem(this, this.tag)
  }
}

class Fragment {
  toString() {
    return `${renderHTMLChildren(this)}`
  }
  createElem() {
    var el = document.createDocumentFragment()
jome.getChildren(this).forEach((child) => {
      if (child.createElem) {
        el.appendChild(child.createElem())
      }
    })
return el
  }
}

export class H1 extends Tag {
  constructor(text) {
    super("h1", text)
    this.text = text
  }
  
}

class H2 extends Tag {
  constructor(text) {
    super("h2", text)
    this.text = text
  }
  
}

class H3 extends Tag {
  constructor(text) {
    super("h3", text)
    this.text = text
  }
  
}

class P extends Tag {
  constructor(text) {
    super("p", text)
    this.text = text
  }
  
}

class Li extends Tag {
  constructor(text) {
    super("li", text)
    this.text = text
  }
  
}

class Span extends Tag {
  constructor(text) {
    super("span", text)
    this.text = text
  }
  
}

export class Div extends Tag {
  constructor(text) {
    super("div", text)
    this.text = text
  }
  
}

class Pre extends Tag {
  constructor(text) {
    super("pre", text)
    this.text = text
  }
  
}

class Code extends Tag {
  constructor(text) {
    super("code", text)
    this.text = text
  }
  
}

class Form extends Tag {
  constructor() {
    super("form")
  }
  
}

class Ul extends Tag {
  constructor() {
    super("ul")
  }
  
}

class Ol extends Tag {
  constructor() {
    super("ol")
  }
  
}

class HtmlObject extends Tag {
  constructor() {
    super("object")
  }
  
}

class Canvas extends Tag {
  constructor() {
    super("canvas")
  }
  
}

class Br extends InlineTag {
  constructor() {
    super("br")
  }
  
}

class Hr extends InlineTag {
  constructor() {
    super("hr")
  }
  
}

class Txt {
  constructor(text) {
    this.text = text
  }
  toString() {
    var attrs = renderHTMLAttrs(this)
return attrs ? "<span{attrs}>{text}</span>" : "{text}"
  }
  createElem() {
    return document.createTextNode(this.text)
  }
}

class Btn extends Tag {
  constructor(text) {
    super("button", text)
    this.text = text
  }
  
}

var Button = Btn
class Link extends Tag {
  constructor(url, name) {
    super({href: url}, "a", name)
    this.url = url
    this.name = name
  }
  
}

class Label extends Tag {
  constructor(name, text) {
    super({htmlFor: text}, "label", text)
    this.name = name
    this.text = text
  }
  
}

class Input extends InlineTag {
  constructor(name) {
    super({id: name, name: name, autocomplete: name}, "input")
    this.name = name
  }
  
}

class Img extends InlineTag {
  constructor(url, alt) {
    super({src: url, alt: alt}, "img")
    this.url = url
    this.alt = alt
  }
  
}

