const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create interface for reading user input from command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let dir = path.resolve(process.argv[2] || process.cwd())

let stats = fs.statSync(dir)

if (!stats) {
  console.error(`Directory '${dir}' does not exist.`);
  process.exit(1);
}

if (!stats.isDirectory()) {
  console.error(`Error '${dir}' must be a folder.`);
  process.exit(1);
}

let jomeConfig = path.join(dir, 'config.jome')

console.log(`This utility will help you run Jome code in the following directory:
${dir}

Press ^C at any time to quit.

Do you want to use a template to create base code you can edit? (YES/no)
`)
// package name: (tmptmptmp) 

console.log(`[0] Hello world
[1] A static website
[2] A simple web server

What template do you want to use? (0)`)

if (!fs.existsSync(jomeConfig)) {
  // TODO
  // rl.question('Please enter the directory path: ', (answer) => {
  //   checkDirectoryExists(answer);
  // })
}

// TODO: Parse args for --template, --flavor or --style