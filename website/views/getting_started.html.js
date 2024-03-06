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

  <h2 id="install">Installation</h2>

  \`\`\`sh
  npm install jome.js -g
  \`\`\`

  <h2 id="usage">Usage</h2>

  \`\`\`sh
  # Usage
  jome # executes index.jome or the file specified by the entry main in config.jome
  jome file.jome # execute the given file
  jome server start # pass the arguments "server" and "start" to index.jome executable
  \`\`\`

  <h2 id="hello-world">Hello world</h2>
  
  Create a file \`hello.jome\` with the following content:

  \`\`\`jome
  #log "Hello world!" // #log is a shortcut for console.log
  \`\`\`

  Run it with \`jome hello.jome\`

  ### File parameters

  A .jome file is compiled into a function. You can pass arguments to it using the \`with\` keyword.

  Let's modify the file \`hello.jome\`

  \`\`\`jome
  with name end
  #log "Hello {name}!"
  \`\`\`

  The result is
  \`\`\`sh
  jome hello.jome Paul
  # => Hello Paul!
  \`\`\`

  <h3 id="index-jome">index.jome</h3>

  The Jome CLI command checks if the first argument is a .jome source file and executes it if so. Otherwise, it will execute index.jome or the file specified by the entry main in config.jome

  Let's write inside the file \`index.jome\`

  \`\`\`jome
  with cmd, message end

  if cmd === 'say'
    #log message
  end
  \`\`\`

  The result is
  \`\`\`sh
  jome say "Hello Anna!"
  # => Hello Anna!
  \`\`\``);
  return new Webpage("Jome", content).render();
};
