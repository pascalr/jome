const jome = require('jome')


const {AppPage} = require("../../lib/app.built.js");
const renderMarkdown = require("jome/lib/render_markdown");

module.exports = new AppPage({title: 'Jome express server', content: renderMarkdown(`

  # Express Server

  ExpressServer is a wrapper for express in Jome.

  ## Usage

  \`\`\`jome
  {
    ExpressServer port: 3000
      useStatic '/jome', 'docs'
      get '/', |req, res| => (
        res.redirect('/jome')
      )
  }
  run
  \`\`\`

`)}).toString()