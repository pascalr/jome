const hljs = require('highlight.js')
const jomeHljs = require('./jome_hljs.js')

hljs.registerLanguage('jome', jomeHljs)

module.exports = hljs