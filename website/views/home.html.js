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
  
  ## Disclaimer

  The language is very, very young and still contains a log of bugs. I don't recommend using yet for any real project.

  I don't have a list of bugs yet, because there are too many.`);
  return new Webpage("Jome", content).render();
};
