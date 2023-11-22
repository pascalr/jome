const MarkdownIt = require('markdown-it')
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

function renderMarkdown(str) {
  return markdownIt.render(str)
}

module.exports = renderMarkdown