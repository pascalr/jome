import { Schema } from "prosemirror-model"
import {addListNodes} from "prosemirror-schema-list"
import { Field } from "../components/Field"
import { Canvas } from "../renderers/Canvas"
import { Isogon } from "../components/drawing/Isogon"
import { Rect } from "../components/drawing/Rect"

// Copied basic nodes and marks from https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.ts

const nodes = {
  /// NodeSpec The top level document node.
  doc: {
    content: "block+"
  },

  /// A plain paragraph textblock. Represented in the DOM
  /// as a `<p>` element.
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{tag: "p"}],
    toDOM() { return ["p", 0] }
  },

  /// A blockquote (`<blockquote>`) wrapping one or more blocks.
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{tag: "blockquote"}],
    toDOM() { return ["blockquote", 0] }
  },

  /// A horizontal rule (`<hr>`).
  horizontal_rule: {
    group: "block",
    parseDOM: [{tag: "hr"}],
    toDOM() { return ["hr"] }
  },

  /// A heading textblock, with a `level` attribute that
  /// should hold the number 1 to 6. Parsed and serialized as `<h1>` to
  /// `<h6>` elements.
  heading: {
    attrs: {level: {default: 1, validate: "number"}},
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h1", attrs: {level: 1}},
               {tag: "h2", attrs: {level: 2}},
               {tag: "h3", attrs: {level: 3}},
               {tag: "h4", attrs: {level: 4}},
               {tag: "h5", attrs: {level: 5}},
               {tag: "h6", attrs: {level: 6}}],
    toDOM(node) { return ["h" + node.attrs.level, 0] }
  },

  /// A code listing. Disallows marks or non-text inline
  /// nodes by default. Represented as a `<pre>` element with a
  /// `<code>` element inside of it.
  // A code block would symply have syntax highligthing more.
  // Maybe use CodeMirror too, so to have smart indentation, ...
  // But it's purely visual.
  // Use raw_block to have code that will be executed.
  // Nooooooo, use code_block for everything, but add an attribute that specifies
  // if the code is to be executed or not. This way the editing works for
  // both kinds of code, and simply make it visually different so we know the difference.
  // Wait I am confused between code_block and code mark???
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    parseDOM: [{tag: "pre", preserveWhitespace: "full"}],
    toDOM() { return ["pre", ["code", 0]] }
  },

  /// The text node.
  text: {
    group: "inline"
  },

  /// An inline image (`<img>`) node. Supports `src`,
  /// `alt`, and `href` attributes. The latter two default to the empty
  /// string.
  image: {
    inline: true,
    attrs: {
      src: {validate: "string"},
      alt: {default: null, validate: "string|null"},
      title: {default: null, validate: "string|null"}
    },
    group: "inline",
    draggable: true,
    parseDOM: [{tag: "img[src]", getAttrs(dom) {
      return {
        src: dom.getAttribute("src"),
        title: dom.getAttribute("title"),
        alt: dom.getAttribute("alt")
      }
    }}],
    toDOM(node) { let {src, alt, title} = node.attrs; return ["img", {src, alt, title}] }
  },

  /// A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{tag: "br"}],
    toDOM() { return ["br"] }
  },


  // *** Jome nodes ***


  canvas: nodeSpecForComponent(Canvas), 
  field: nodeSpecForComponent(Field),
  rect: nodeSpecForComponent(Rect),
  isogon: nodeSpecForComponent(Isogon),
}

function nodeSpecForComponent(klass) {
  return {
    content: "block*",
    group: "block",
    atom: true,
    attrs: attrsForComponent(klass),
    parseDOM: [{tag: klass.tagName, getAttrs: getAttrsForComponent(klass)}],
    toDOM(node) {
      console.log('node', node);
      return [klass.tagName, extractAttrsForComponent(node.attrs, klass), 0]
    },
  }
}

function extractAttrsForComponent(attrs, klass) {
  return Object.keys(klass.allAttributes).reduce((acc, curr) => {
    acc[curr] = attrs[curr]
    return acc
  }, {})
}

function attrsForComponent(klass) {
  return Object.keys(klass.allAttributes).reduce((acc, curr) => {
    acc[curr] = {validate: "string|null", default: null} // FIXME map my types and defaults to prosemirror types and defaults
    // acc[curr] = {validate: klass.allAttributes[curr].type, default: klass.allAttributes[curr].default}
    return acc
  }, {})
}

function getAttrsForComponent(klass) {
  return (dom) => {
    return Object.keys(klass.allAttributes).reduce((acc, curr) => {
      acc[curr] = dom.getAttribute(curr)
      return acc
    }, {})
  }
}



/// [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
  /// A link. Has `href` and `title` attributes. `title`
  /// defaults to the empty string. Rendered and parsed as an `<a>`
  /// element.
  link: {
    attrs: {
      href: {validate: "string"},
      title: {default: null, validate: "string|null"}
    },
    inclusive: false,
    parseDOM: [{tag: "a[href]", getAttrs(dom) {
      return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
    }}],
    toDOM(node) { let {href, title} = node.attrs; return ["a", {href, title}, 0] }
  },

  /// An emphasis mark. Rendered as an `<em>` element. Has parse rules
  /// that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [
      {tag: "i"}, {tag: "em"},
      {style: "font-style=italic"},
      {style: "font-style=normal", clearMark: m => m.type.name == "em"}
    ],
    toDOM() { return emDOM }
  },

  /// A strong mark. Rendered as `<strong>`, parse rules also match
  /// `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      {tag: "strong"},
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      {tag: "b", getAttrs: (node) => node.style.fontWeight != "normal" && null},
      {style: "font-weight=400", clearMark: m => m.type.name == "strong"},
      {style: "font-weight", getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null},
    ],
    toDOM() { return strongDOM }
  },

  code: {
    parseDOM: [{tag: "code"}],
    toDOM() { return codeDOM }
  },
}


let fixmeNodes = new Schema({nodes, marks}).spec.nodes

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
export const schema = new Schema({
  nodes: addListNodes(fixmeNodes, "paragraph block*", "block"),
  marks: marks
})