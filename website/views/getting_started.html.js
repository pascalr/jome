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
  jome # executes index.jome or the file specified by the entry "main" in config.jome
  jome file.jome # execute the given file
  jome server start # pass the arguments "server" and "start" to index.jome executable
  \`\`\`

  <h2 id="hello-world">Hello world</h2>
  
  Create a file \`hello.jome\` with the following content:

  \`\`\`jome
  #log "Hello world!" // #log is a shortcut for console.log
  \`\`\`

  In a terminal, this gives:
  \`\`\`sh
  jome hello.jome
  # => Hello world!
  \`\`\`

  ### File parameters

  A .jome file is compiled into a function. You can pass arguments to it using the \`with\` keyword.

  Let's modify the file \`hello.jome\`

  \`\`\`jome
  with name end
  #log "Hello {name}!"
  \`\`\`

  This gives:
  \`\`\`sh
  jome hello.jome Paul
  # => Hello Paul!
  \`\`\`

  <h2 id="index-jome">index.jome</h2>

  By default, index.jome is executed if no .jome file is given to the CLI.

  Let's write inside the file \`index.jome\`

  \`\`\`jome
  with cmd, message end

  if cmd === 'say'
    #log message
  end
  \`\`\`

  This gives:
  \`\`\`sh
  jome say "Hello Anna!"
  # => Hello Anna!
  \`\`\`

  <h2 id="config-jome">config.jome</h2>

  config.jome contains all the configuration of the project and the language itself.

  TODO: Give an example of a config.jome file.

  \`\`\`jome
  meta #{
    main: "./server.jome" // Set server.jome as the default file executed when running jome without a file.
    scripts: 
      s: {file: "./server.jome", alias: "server"}
  }
  \`\`\`
`);
  return new Webpage("Jome", content).render();
};
