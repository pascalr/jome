const jome = require('jome')


const {AppPage} = require("../../lib/app.built.js");
const renderMarkdown = require("jome/lib/render_markdown");

module.exports = new AppPage({title: 'Jome html layout', content: (renderMarkdown(`

  # HTML layout

  ExpressServer is a wrapper for express in Jome.

`))}).toString()