import { tags as t } from '@lezer/highlight';

// Source: https://github.com/uiwjs/react-codemirror/blob/master/themes/material/src/index.ts
// Source: https://github.com/uiwjs/react-codemirror/blob/master/themes/theme/src/index.tsx

export const materialDarkThemeOptions = {
  '.cm-content': {
    caretColor: "#a0a4ae" // caret color
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: "#a0a4ae" // caret color
  },
  '&.cm-focused .cm-selectionBackground, & .cm-line::selection, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection': {
    background: '#d7d4f063 !important',
  },
  '& .cm-selectionMatch': {
    backgroundColor: '#d7d4f063'
  },
  '.cm-gutters': {
    backgroundColor: "#2e3235",
    color: "#999"
  },
  '.cm-activeLine': {
    backgroundColor: "#545b6130"
  },
  '.cm-activeLineGutter': {
    backgroundColor: "#545b6130",
    color: "#4f5b66"
  }
}

export const materialDarkStyle = [
  { tag: t.keyword, color: '#cf6edf' },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: '#56c8d8' },
  { tag: [t.propertyName], color: '#facf4e' },
  { tag: [t.variableName], color: '#bdbdbd' },
  { tag: [t.function(t.variableName)], color: '#56c8d8' },
  { tag: [t.labelName], color: '#cf6edf' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#facf4e' },
  { tag: [t.definition(t.name), t.separator], color: '#fa5788' },
  { tag: [t.brace], color: '#cf6edf' },
  { tag: [t.annotation], color: '#ff5f52' },
  { tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#ffad42' },
  { tag: [t.typeName, t.className], color: '#ffad42' },
  { tag: [t.operator, t.operatorKeyword], color: '#7186f0' },
  { tag: [t.tagName], color: '#99d066' },
  { tag: [t.squareBracket], color: '#ff5f52' },
  { tag: [t.angleBracket], color: '#606f7a' },
  { tag: [t.attributeName], color: '#bdbdbd' },
  { tag: [t.regexp], color: '#ff5f52' },
  { tag: [t.quote], color: '#6abf69' },
  { tag: [t.string], color: '#99d066' },
  {
    tag: t.link,
    color: '#56c8d8',
    textDecoration: 'underline',
    textUnderlinePosition: 'under',
  },
  { tag: [t.url, t.escape, t.special(t.string)], color: '#facf4e' },
  { tag: [t.meta], color: '#707d8b' },
  { tag: [t.comment], color: '#707d8b', fontStyle: 'italic' },
  { tag: t.monospace, color: '#bdbdbd' },
  { tag: t.strong, fontWeight: 'bold', color: '#ff5f52' },
  { tag: t.emphasis, fontStyle: 'italic', color: '#99d066' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.heading, fontWeight: 'bold', color: '#facf4e' },
  { tag: t.heading1, fontWeight: 'bold', color: '#facf4e' },
  {
    tag: [t.heading2, t.heading3, t.heading4],
    fontWeight: 'bold',
    color: '#facf4e',
  },
  { tag: [t.heading5, t.heading6], color: '#facf4e' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#56c8d8' },
  { tag: [t.processingInstruction, t.inserted], color: '#ff5f52' },
  { tag: [t.contentSeparator], color: '#56c8d8' },
  { tag: t.invalid, color: '#606f7a', borderBottom: `1px dotted #ff5f52` },
];