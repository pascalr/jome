

const renderHTMLAttrs = (obj) => {
  var r = Object.keys(obj?.$?.signals || {}).map((n) => {
    return `on${n}="jome.run('$${obj?.$?.path}.${n}()')"`
  }, ).join(" ")
r = r + (Object.entries(jome.params(obj) || {}).filter((entry) => {
    return entry[0] != 'css'
  }).map((entry) => {
    return `${entry[0]}="${entry[1]}"`
  }, ).join(" "))
r = r + (jome.params(obj).css ? ('style="' + Object.entries(jome.params(obj).css || {}).map((entry) => {
    return `${entry[0]}: ${entry[1]}`
  }).join('; ') + '"') : '')
return r ? (' ' + r) : r
}
const renderHTMLTagChildren = (children) => {
  return children.map((c) => {
    return c.toString ? c.toString() : ''
  }).join("")
}
const renderHTMLTagAttrs = (attrs) => {
  
var r = (Object.entries(attrs || {}).filter((entry) => {
    return entry[0] != 'css'
  }).map((entry) => {
    return `${entry[0]}="${entry[1]}"`
  }, ).join(" "))
var s = (attrs.css ? (Object.entries(attrs.css || {}).map((entry) => {
    return entry[1] ? `${entry[0]}: ${entry[1]}` : ''
  }).filter((s) => {
    return s.length
  }).join('; ')) : '')
r = r + (s && s.length ? (' style="' + s + '"') : '')
return r ? (' ' + r) : r
}
const renderHtmlTag = (__params__, tag, children, content) => {
  return `<${tag}${renderHTMLTagAttrs(__params__)}>${content || ''}${renderHTMLTagChildren(children || [])}</${tag}>`
}
const renderHTMLChildren = (obj) => {
  return (obj.$?.children||[]).map((c) => {
    return c.toString ? c.toString() : ''
  }).join("")
}
const renderHTML = (__params__, obj) => {
  var elem = document.getElementById(__params__.target)
children = []
var html = ''
(obj.$?.children||[]).forEach((child) => {
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
    return document.getElementById(__params__.target).innerHTML = renderHTMLChildren(this)
  }
}

const createElem = (obj, tag, content, ns) => {
  var el = (ns ? document.createElementNS(ns, tag) : document.createElement(tag))
if (content) {
    el.appendChild(document.createTextNode(content))
  }
Object.entries(jome.params(obj) || {}).filter((entry) => {
    return entry[0] != 'css'
  }).forEach((entry) => {
    return el.setAttribute(entry[0], entry[1])
  })
if (obj.css) {
    el.style = Object.entries(obj.css || {}).map((entry) => {
      return `${entry[0]}: ${entry[1]}`
    }).join('; ')
  }
(obj.$?.children||[]).forEach((child) => {
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
(this.$?.children||[]).forEach((child) => {
      if (child.createElem) {
        el.appendChild(child.createElem())
      }
    })
return el
  }
}

class H1 extends Tag {
  constructor(__props__, text) {
    super("h1", text)
    this.text = text
    this.__props__ = __props__
  }
  
}

class H2 extends Tag {
  constructor(__props__, text) {
    super("h2", text)
    this.text = text
    this.__props__ = __props__
  }
  
}

class H3 extends Tag {
  constructor(__props__, text) {
    super("h3", text)
    this.text = text
    this.__props__ = __props__
  }
  
}

class P extends Tag {
  constructor(__props__, text) {
    super("p", text)
    this.text = text
    this.__props__ = __props__
  }
  
}

class Li extends Tag {
  constructor(__props__, text) {
    super("li", text)
    this.text = text
    this.__props__ = __props__
  }
  
}

class Span extends Tag {
  constructor(__props__, text) {
    super("span", text)
    this.text = text
    this.__props__ = __props__
  }
  
}

class Div extends Tag {
  constructor(__props__, text) {
    super("div", text)
    this.text = text
    this.__props__ = __props__
  }
  
}

class Pre extends Tag {
  constructor(__props__, text) {
    super("pre", text)
    this.text = text
    this.__props__ = __props__
  }
  
}

class Code extends Tag {
  constructor(__props__, text) {
    super("code", text)
    this.text = text
    this.__props__ = __props__
  }
  
}

class Form extends Tag {
  constructor(__props__) {
    super("form")
    this.__props__ = __props__
  }
  
}

class Ul extends Tag {
  constructor(__props__) {
    super("ul")
    this.__props__ = __props__
  }
  
}

class Ol extends Tag {
  constructor(__props__) {
    super("ol")
    this.__props__ = __props__
  }
  
}

class HtmlObject extends Tag {
  constructor(__props__) {
    super("object")
    this.__props__ = __props__
  }
  
}

class Canvas extends Tag {
  constructor(__props__) {
    super("canvas")
    this.__props__ = __props__
  }
  
}

class Br extends InlineTag {
  constructor(__props__) {
    super("br")
    this.__props__ = __props__
  }
  
}

class Hr extends InlineTag {
  constructor(__props__) {
    super("hr")
    this.__props__ = __props__
  }
  
}

class Txt {
  constructor(text) {
    this.text = text
  }
  toString() {
    attrs = renderHTMLAttrs(this)
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



module.exports = {renderHtmlTag, H1, H2, H3, P, Li, Span, Div, Pre, Code, Form, Ul, Ol, HtmlObject, Canvas, Br, Hr, Txt, Btn, Button, Link, Label, Input, Img}