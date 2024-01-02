const jome = require('jome')


global.jome_argv = ["jome", ...process.argv.slice(process.argv.indexOf("--") + 1)];

const execSh = require("jome/lib/exec_sh");

var cmd = global.jome_argv[1]
if (cmd === 'test') {
  execSh(`jome -- test.jome`);
} else if (cmd === 's' || cmd === 'server') {
  execSh(`jome -- website/server.jome`);
} else {
  console.log(`Jome App v0.0.0.0.1

Usage:
jome # get this help message
jome s # start server (or jome server)
jome test # launch the tests
`)
}