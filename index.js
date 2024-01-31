const { trim, flat } = require("jome-lib/formatting");
const build = require("./website/build.js");
const server = require("./website/server.js");
const execSh = require("jome-lib/execSh");
module.exports = (cmd, args) => {
  global.ROOT = "/jome";
  if (cmd === "test") {
    execSh("jome test.jome");
  } else if (cmd === "dev") {
    build({ force: true });
    server({ port: 3000 });
  } else if (cmd === "s" || cmd === "server") {
    build();
    server({ port: 3000 });
  } else {
    console.log(`Jome App v0.0.0.0.1

Usage:
jome # get this help message
jome s # start server (or jome server)
jome test # launch the tests`);
  }
  return `<div>${"Hello"}</div>`;
};
