const { run } = require("jome-lib/cjs");
const execSh = require("jome-lib/execSh");
module.exports = () => {
  let cmd = process.argv[1];
  if (cmd === "test") {
    execSh(`jome test.jome`);
  } else if (cmd === "s" || cmd === "server") {
    run(path.join(__dirname, "website-v2/server.jome"));
  } else {
    console.log(`Jome App v0.0.0.0.1

Usage:
jome # get this help message
jome s # start server (or jome server)
jome test # launch the tests`);
  }
};
