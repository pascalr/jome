const Webpage = require("../src/webpage.js");
const mdToHtml = require("jome-lib/mdToHtml");
module.exports = () => {
  function printExample(result) {
    return `
    <div class='example'>
      <div class='onglets'>
        <div class='active'>Code</div>
        <div>Compiled</div>
        <div>Output</div>
      </div>
      <div class='example-content'>${result}</div>
    </div>
  `;
  }
  let counter = `
  import React, { useState } from 'react'; // I would be nice if this was optional because implicit because inside react tag

  const Counter = () => {
    // Define state variable 'count' with initial value 0 and a function 'setCount' to update it
    const [count, setCount] = useState(0);

    return <button onClick={setCount(count+1)}>
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  };`;
  let content = mdToHtml(`
  # Jome examples

  TODO: For hello world and the counter, write show the code for vanilla, web components, react, vue, angular, svelte, ...
  Show the code 75% of the space at the left, and 25% the simple counter button on the right (or Hello world message)

  <h2 id="hello-world">Hello world</h3>

  83e12e01e1210c36810087d76fbcec01

  <h3>Vanilla js</h3>

  <div id="ex-vanilla-hello"></div>

  ## Counter

  A simple button that when you click on it it increments. "Clicked 2 times"

  <h3>Vanilla js</h3>

  <button id="ex-vanilla-counter">Clicked 0 times</button>

  <h3>Web components</h3>

  <h3 id="react-component">React component</h3>

  \`\`\`jome
  import React, { useState } from 'react';

  const Counter = () => {
    // Define state variable 'count' with initial value 0 and a function 'setCount' to update it
    const [count, setCount] = useState(0);

    return <react>
      <button onClick={setCount(count+1)}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
      </button>
    </react>
  };
  \`\`\`

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

  <script src="${ROOT}/js/ex_vanilla.js"></script>`).replace(
    "83e12e01e1210c36810087d76fbcec01",
    printExample('#log "Hello, world!"')
  );
  return new Webpage("Jome examples", content).render();
};
