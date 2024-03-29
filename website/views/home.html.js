const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let PARTIAL = mdToHtml(`
  \`\`\`xml
  <html>
    <div class="navbar">
      <span class="navbrand" href="#">Jome</span>
      <a href="\<%= locale %>/editor">Editor</a>
      <a href="\<%= locale %>/">Home</a>
      <a href="\<%= locale %>/utils">Utils</a>
      <a href="https://github.com/pascalr/jome">GitHub</a>
    </div>
  </html>
  \`\`\``);

  let content = mdToHtml(`

  # Jome

  Jome tries to be an unopiniated programming language. You code using your own style and use a linter in other to share
  standardized code with other people.

  You should use a specialized editor (WIP) in order to fully use all it's features such as code evaluation (like Jupyter Notebook)
  and data editing (like spreadsheet with types inside the editor).

  For the near future, it only compiles to JavaScript.

  ## Flexible typing system

  Like the rest of Jome, the typing system is flexible. You can omit them, you can use hard typing or you can use duct typing.

  # Jome v0.1

  Jome is a language that compiles to JavaScript. It has goodies like CoffeeScript and underscore.js, permissive syntax similar to either javascript or ruby and it
  has some original features. One day, it will have a node structure like in Godot, types like Typescript, and reactivity like svelte.

  Well that's the idea at least. Right now it is very much in experimental phase. There are a lot of bugs and not many tests are written yet.

  **Flexible typing** - You can use static typing for robustness and usability or omit them for development speed and simplicity.

  **Flexible syntax** - You can use curly braces, block statements with end keyword or inline with colon at the end.

  **Customizable builtins** - Jome comes with a lot of builtins which you can map to keywords you want. You can also define your own.

  **Reactivity** - TODO

  **Node structure like Godot** - TODO

  <h2 id="overview">Overview</h2>

  \`\`\`jome
  // .jome files are functions
  // you can give parameters using a with block
  // you can set default values, here it's english
  with locale = 'en' end
  return <html>
    <div class="navbar">
      <span class="navbrand" href="#">Jome</span>
      <a href="\<%= locale %>/editor">Editor</a>
      <a href="\<%= locale %>/">Home</a>
      <a href="\<%= locale %>/utils">Utils</a>
      <a href="https://github.com/pascalr/jome">GitHub</a>
    </div>
  </html>

  // You can then import it from another file or run this file directly to get html
  <sh>jome ./navbar.html.jome fr > ./navbar.html</sh>
  // or
  import navbar from './navbar.html.jome'
  let frenchNavbar = navbar("fr")
  \`\`\`

  ## Notebook like jupyter

  Jome code can be used to create notebooks like jupyter.

  You can use the .jomn extension to denote that the file is expected to be opened as a notebook.

  ### Markdown cells

  You can create markdown cells by surrounding the content with three hashtags alone on a line \`###\`.

  \`\`\`jome
  ###
  This is a markdown cell
  ### This level 3 title
  Below is the ending
  ###
  \`\`\`

  ### Code cells

  Not all code cells are executed.

  TODO: What keyword to use to mean that it should be executed???

  \`\`\`jome
  cell
    // ...
  end

  script
    // ...
  end

  code
    // ...
  end
  \`\`\`

  ### Data cells

  Jome introducte the idea of data cells in a notebook.

  The idea is that you should be able to enter data in a spreadsheet like format in the notebook.

  TODO: Explain that tags are data cells, and that right now I am simply abusing the markdown cells

  ### Collapsed code cells

  There should also be collapsed by default code cells. For example for imports. If you click on it, you should see it.
  But you could also that it is collapsed by default.

  But I want to be able to search for it though... CTRL+F should find text hidden inside the collapsed cell. Not sure if that is possible in the browser...

  Ah yes, maybe simply make is small and scrollable, but when it gains focus, it becomes bigger! This should work with CTRL+F!

  ### with blocks

  Idea: A with block should be showned in a notebook like documentation on the web. It should be pretty, and the script code below would
  be the content of the function of class.
  
  ## Disclaimer

  The language is very, very young and still contains a log of bugs. I don't recommend using yet for any real project.

  I don't have a list of bugs yet, because there are too many.`);

  return new Webpage("Jome", content).render();
};
