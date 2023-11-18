const jome = require('jome')


const {AppPage} = require("../../lib/app.built.js");

module.exports = new AppPage({title: 'Jome html layout', content: (`<h1>HTML layout</h1>
<p>ExpressServer is a wrapper for express in Jome.</p>
`)}).toString()