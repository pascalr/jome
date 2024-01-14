const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')
const jomeHljs = require('../hl-grammar/jome.js') // FIXME: mdToHtml should have this file in the same package...

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

function mdToHtml(str) {
  return markdownIt.render(str)
}

module.exports = mdToHtml