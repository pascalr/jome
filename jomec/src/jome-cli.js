#!/usr/bin/env node

// Jome CLI

// NAME:
// jome — Jome runtime
//
//
//

// SYNOPSIS:
// jome [options] [file] [arguments ...]
// jome [options] [arguments ...]
// jome [options]
//
//
//

// DESCRIPTION:
// Executes code written in the Jome programming language using node.js.
//
// Executing without arguments executes index.jome in the current directory.
// 
// If the first argument given ends with .jome extension, this file will be executed instead of index.jome.
//
// The rest of arguments are simply given to the executable.
//
//
//

// OPTIONS:
// -e "log('Hello')": Execute some code
// -v: Show Jome version
// -h: Show help message
// -u: update Jome?
//
//
//

const path = require('path');
const {compileAndSaveFile} = require('./compiler')

const args = process.argv.slice(2); // Exclude the first two arguments (node executable and script file)

let wholeArgs = args.filter(arg => !arg.startsWith('-'))
let fileToRun = 'index.jome' // by default
let executableArgs = wholeArgs // by default

if (wholeArgs[0]?.endsWith('.jome')) {
  fileToRun = wholeArgs[0]
  executableArgs = wholeArgs.slice(1)
}

let absPath = path.resolve(fileToRun, executableArgs)
compileAndExecute(absPath)

function compileAndExecute(absPath, args) {
  let buildFileName = compileAndSaveFile(absPath)
  execute(buildFileName, args)
}

// FIXME
// I would like to be able to execute a file without creating an intermediary .js file, but it is not working.
// But the issue right now is that in spawn, __dirname is set to '.', and I can't seem to require. Paths are broken.
// const result = spawnSync('node', [], {
//   cwd: process.cwd(),
//   input: scriptCode,
//   encoding: 'utf-8',
// });
function execute(absPath, args) {
  spawnSync('node', [absPath, '--', ...(args||[])], { encoding: 'utf-8', stdio: 'inherit' });
}


// TODO: use:
//
// const { spawn } = require('child_process');
// 
// const someCode = "console.log('hello')";
// 
// // Split the code into an array of arguments
// const codeArguments = ['-e', someCode];
// 
// // Spawn a new process with the node command and code arguments
// const nodeProcess = spawn('node', codeArguments);
// 
// // Listen for data on stdout and stderr
// nodeProcess.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });
// 
// nodeProcess.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });
// 
// // Listen for the process to exit
// nodeProcess.on('close', (code) => {
//   console.log(`Child process exited with code ${code}`);
// });