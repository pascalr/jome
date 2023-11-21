const jome = require('jome')


global.jome_argv = ["jome", ...process.argv.slice(process.argv.indexOf("--") + 1)];

const {execSync} = require("child_process");

if (global.jome_argv[1] === 'test') {
  execSync(`node /home/pascalr/jome/jome.js -- test.jome`);
} else {
  execSync(`node /home/pascalr/jome/jome.js -- bin/server.jome`);
}