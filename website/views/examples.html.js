const j_uid_1 = require("highlightjs-jome");
const hljs = j_uid_1.default;
const Webpage = require("../src/webpage.js");
const { trim, indent } = require("@jome/core");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  function highlight(code) {
    return hljs.highlight(code, { language: "jome" }).value;
  }

  function tabbedContent(contentByTitle) {
    let titles = Object.keys(contentByTitle)
      .map((title) => `<div>${title}</div>`)
      .join("\n");
    let contents = Object.values(contentByTitle).map(
      (content) => `<div>${content}</div>`,
    )[0];
    return `<div class='tabbed-content'>
    <div class='onglets'>
      ${titles}
    </div>
    <pre class='example-content'><code>${contents}</code></pre>
  </div>`;
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

  let counters = {
    Vanilla: highlight(`// Button counter
def renderCounter
  let count = 0;
  let button = document.getElementById("ex-vanilla-counter");
  def handleClick
    count = count + 1
    button.textContent = "Clicked {count} {count === 1 ? 'time' : 'times'}"
  end
  button.addEventListener "click", handleClick
  return function
    button.removeEventListener "click", handleClick
  end
end
renderCounter()`),
    "Web components": "Clicked 0 times",
    "Vue.js": "Clicked 0 times",
    Angular: "Clicked 0 times",
    Svelte: "Clicked 0 times",
    React: "Clicked 0 times",
  };

  let content = mdToHtml(`
  # Jome examples

  TODO: The result on top, and the tabbed source code for many librairies below.

  TODO: For hello world and the counter, write show the code for vanilla, web components, react, vue, angular, svelte, ...
  Show the code 75% of the space at the left, and 25% the simple counter button on the right (or Hello world message)

  <h2 id="hello-world">Hello world</h3>

  TODO

  <h3>Vanilla js</h3>

  <div id="ex-vanilla-hello"></div>

  ## Counter

  A simple counter that shows a dynamic element and an event listener.

  <div class="example-result"><button id="ex-vanilla-counter">Clicked 0 times</button></div>

  ${tabbedContent(counters)}

  A simple button that when you click on it it increments. "Clicked 2 times"

  <h3>Vanilla js</h3>

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

  ## Adder

  Un autre truc simple comme le compteur. 2 input fields, tu additionnes les inputs et tu les affichent.

  Voici le code svelte.

  \`\`\`svelte
  <script>
    export let a;
    export let b;
  </script>

  <input type="number" bind:value={a}>
  <input type="number" bind:value={b}>

  <p>{a} + {b} = {a + b}</p>
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

  <script src="${ROOT}/js/ex_vanilla.js"></script>`);

  return new Webpage("Jome examples", content).render();
};
