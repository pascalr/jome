const jome = require('jome')


const {AppPage} = require("../lib/app.built.js");
const renderMarkdown = require("jome/lib/render_markdown");

var content = renderMarkdown(`
  ## Jome librairies

  Librairies should be distributed the same way as CoffeeScript librairies. So I think it is mainly through npm.

  ### Common librairies

  - [Html](${global._URL}/lib/html)

`)
module.exports = new AppPage({title: 'Jome examples', className: "examples-page", content: content}).toString()