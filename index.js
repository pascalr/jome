const jome = require('jome')


const {execSync} = require("child_process");

if (process.argv[1] === 'test') {
  execSync(`node /home/pascalr/jome/jome.js test.jome`);
} else {
  execSync(`node /home/pascalr/jome/jome.js bin/server.jome`);
}