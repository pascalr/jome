// import MarkdownIt from 'markdown-it'
// import { compileInterpolate, compileRaw, escapeBackticks } from '../compiler.js'

// import hljs from 'highlight.js'
// import jomeHljs from '../../highlight.js/jome.js'

const MarkdownIt = require('markdown-it')
//const { compileInterpolate, compileRaw, escapeBackticks } = require('../compiler.js')

const hljs = require('highlight.js')
const jomeHljs = require('../../highlight.js/jome.js')

hljs.registerLanguage('jome', jomeHljs)

let markdownIt = new MarkdownIt({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
})

function compileMarkdown(node, ctx) {
  const compiler = require('../compiler.js')
  let r = compiler.compileRaw(node.children.slice(1,-1))
  r = compiler.compileInterpolate(r, ctx, "$$escSeqBeg$$", "$$escSeqEnd$$")
  r = compiler.escapeBackticks(markdownIt.render(r))
  r = r.replaceAll(/\$\$escSeqBeg\$\$/g, '${').replaceAll(/\$\$escSeqEnd\$\$/g, '}')
  return '`'+r+'`'
}

module.exports = compileMarkdown