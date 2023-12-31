const jome = require('jome')


const {AppPage} = require("../../lib/app.built.js");
const renderMarkdown = require("jome/lib/render_markdown");

var text23 = renderMarkdown(`

  # Jome lib html

  FIXME: This should be generated automatically from the source code.

  ## Objects
  - Screen: A div that has at a minimum the page size, but can be taller
  - Fullscreen: Takes the full size of the page and hides the overflow
  - Row: Children are place side by side
  - Col: Children are place one on top of the other

  ## Html attributes

  Every parameters passed onto the object will be assigned to the html tag.

  \`\`\`jome
  « Div class: 'd-flex' » // <div class='d-flex'></div>
  « Div width: 100px » // <div width='100px'></div>
  \`\`\`

  \`\`\`jome
  « Div style: {width: 100px, color: 'red'} » // <div style='width: 100px; color: red;'></div>
  « Div style.width: 100px, style.color: 'red' » // <div style='width: 100px; color: red;'></div>
  \`\`\`

  ou bien

  \`\`\`jome
  « Div css: {width: 100px, color: 'red'} » // <div style='width: 100px; color: red;'></div>
  « Div css.width: 100px, css.color: 'red' » // <div style='width: 100px; color: red;'></div>
  \`\`\`

`)
module.exports = new AppPage({title: 'Jome lib html', content: text23}).toString()