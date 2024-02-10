const build = require("./build.js");
const server = require("./server.js");
const { trim, flat } = require("@jome/core");
const execSh = require("@jome/core/execSh");
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
