const jome = require('jome')


const {AppPage} = require("../lib/app.built.js");
const renderMarkdown = require("jome/lib/render_markdown");

class Example {
  constructor(data) {
    this.data = data
  }
  toString() {
    
var src = renderMarkdown(`
\`\`\`jome
${this.data.src}
\`\`\`
`)
return `
  <div class='example'>
    <div class='onglets'>
      <div class='active'>Code</div>
      <div>Compilé</div>
      <div>Résultat</div>
    </div>
    <div class='example-content'>
      ${src}
    </div>
  </div>
`
  }
}

class DynamicRenderer {
  constructor() {
    this.objsById = {}
this.scope = ""
this.idCounters = {}
  }
  getObjId(obj) {
    var type = obj.constructor.name
var nb = (this.idCounters[type]) ? (this.idCounters[type] + 1) : 1
this.idCounters[type] = nb
return `${this.scope ? (this.scope + '-') : ''}${type}-${nb}`
  }
  render(obj) {
    var id = this.getObjId(obj)
this.objsById[id] = obj
return `<div id="${id}"></div>`
  }
  script() {
    
var code = Object.keys(this.objsById || {}).map((id) => {
      var obj2 = this.objsById[id]
return `document.getElementById("${id}").innerHTML = "${obj2.toString()}"`
    }).join('\n')
return `
      <script defer>
        ${code}
      </script>
    `
  }
}

var dynamic = new DynamicRenderer()
const showExample = (data) => {
  
src = renderMarkdown(`
\`\`\`jome
${data.src}
\`\`\`
`)
return `
  <div class='example'>
    <div class='onglets'>
      <div class='active'>Code</div>
      <div>Compiled</div>
      <div>Output</div>
    </div>
    <div class='example-content'>${src}</div>
  </div>
`
}
var helloWorld = {src: '#log("Hello world!")', js: 'console.log("Hello world!")', out: 'Hello world!'}
var conten = renderMarkdown(`
  ## Jome examples

  <h3>Testing 1212</h3>
`) + dynamic.render(new Example(helloWorld)) + 
dynamic.render(new Example(helloWorld)) + 
renderMarkdown(`

  <h3 id="hello-world">Hello world</h3>

  ${showExample(helloWorld)}

  <h3 id="html-library">Html library</h3>
  
  \`\`\`jome
  html = «
    IFrame // for demo only
      Html title: 'My html page'
        page: Col
          navbar: Row
            Link 'Some page'
            Link 'Another page'
            Link 'Yet another page'
  »
  \`\`\`

  <h3 id="snake">Snake</h3>

  <h3 id="html-button">Html button</h3>
  
  \`\`\`jome
  import {Btn, Txt, renderHTML} from "html"

  renderHTML(target: '#div-id', {
    Btn %count: 0, ~click: => (%count += 1)
      Txt => "Clicked {%count} {%count == 1 ? 'time' : 'times'}"
  })
  \`\`\`

  Example compiled JavaScript output:
  \`\`\`js
  import jome from 'jome_lib'
  import {Btn, Txt, renderHTML} from "html"

  var btn

  // Add a button to the scene which has a text as a children
  btn = new Btn({__signal__click: () => {this.count += 1}})
  btn.count = 0
  jome.createObj($, btn)
  jome.createObj($.$.$btn, new Txt(() => (
    \`Clicked \${this.count} \${this.count == 1 ? 'time' : 'times'}\`
  )))

  // Compile all the objects of the scene and write the html to #jome-placeholder div
  renderHTML({target: 'jome-placeholder'}, $)
  \`\`\`

  ## Recipe?

  \`\`\`jome
  {
    Recipe
      attr
        name: 'Chickpea balls'
        prepare: 1h
      Ing 1cup, "dry chickpeas"
      Ing 2cup, "water"
      Ing 2tbsp, "parmesan"
      Step \`Put {@1} into {@2}...\` // @1 is the first children
      Step "Mix ..."
      Step "Blah blah ..."
  }
  \`\`\`

  ## A format database like?

  \`\`\`jome
  data = {
    "comma", "separated", "values"
    1,       "foo",       10.0
    2,       "bar",       20.0
  }
  \`\`\`
  <csv>
    "comma", "separated", "values"
    1,       "foo",       10.0
    2,       "bar",       20.0
  </csv>

  ## Sqlite3 export to CSV JavaScript

  Faire un petit script en Jome qui convertit un fichier .sqlite3 en un dossier avec des .csv pour chaques table un .csv pour le metadata

  TODO: Save metadata too.

  \`\`\`jome
  let tables = <sh>sqlite3 < % = ARGV[1] % > ".table"</sh>
  <sh>mkdir < % = ARGV[2] % ></sh>
  tables#each(table => (
    <sh>sqlite3 -header -csv < % = ARGV[1] % > "select * from < % = table % >;" > < % = table % >.csv</sh>
  ))
  \`\`\`

`) + dynamic.script()
module.exports = new AppPage({title: 'Jome examples', content: conten}).toString()