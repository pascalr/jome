import MarkdownIt from 'markdown-it'
import { compileInterpolate, compileRaw, escapeBackticks } from '../compiler.js'

import hljs from 'highlight.js'
import jomeHljs from '../../highlight.js/jome.js'

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

export default function compileMarkdown(node, ctx) {
  let r = compileRaw(node.children.slice(1,-1))
  r = compileInterpolate(r, ctx, "$$escSeqBeg$$", "$$escSeqEnd$$")
  r = escapeBackticks(markdownIt.render(r))
  r = r.replaceAll(/\$\$escSeqBeg\$\$/g, '${').replaceAll(/\$\$escSeqEnd\$\$/g, '}')
  return '`'+r+'`'
}