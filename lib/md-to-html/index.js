const MarkdownIt = require('markdown-it')
const hljs = require('highlightjs-jome')

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