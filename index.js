const jome = require('jome')


global.jome_argv = ["jome", ...process.argv.slice(process.argv.indexOf("--") + 1)];

const execSh = require("jome/lib/exec_sh");

if (global.jome_argv[1] === 'test') {
  execSh(`node /home/pascalr/jome/jome.js -- test.jome`);
} else {
  execSh(`node /home/pascalr/jome/jome.js -- bin/server.jome`);
}