const execSh = require("jome-lib/execSh");
const run_server = require("./website-v2/server.js");
module.exports = (cmd) => {
  if (cmd === "test") {
    execSh(`jome test.jome`);
  } else if (cmd === "s" || cmd === "server") {
    run_server({ port: 3000 });
  } else {
    console.log(`Jome App v0.0.0.0.1

Usage:
jome # get this help message
jome s # start server (or jome server)
jome test # launch the tests`);
  }
  class Webpage {
    contructor(title, content = "Default content") {
      this.title = title;
      this.content = content;
    }
  }
  let hello = "Hello";
  return `<div>${hello}</div>`;
};
