//#!/usr/bin/env node

// Jome executable

// Description:
// Executes code written in Jome language by compiling it and passing it to node.js executable
//
//
//

// Usage:
// jome # Executes index.jome in the current directory
// jome someFile.jome # Executes someFile.jome
// jome server # Executes index.jome and pass the string server to it.
//
//
//

// Args: (any arguments must be at the beginning of the command!)
// -c "fileToCompile.jome": Compiles the given file to a .js file.
// -e "log('Hello')": Execute some code
// -h: Config mode
//
//

// For anything about Jome command itself, using -h
// It launches an interactive mode.
// jome -h
// Jome version 0.0.1
//
// Commands available:
// u: update
// x: ...
// x: ...
// x: ...
//
// What do you want to do? (q or Ctrl^C to exit)
// > ___

// Code to run another file in jome.
// ./node jome.js file.jome

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

import { JomeBuilder, buildAndRunFile } from './src/builder.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2); // Exclude the first two arguments (node executable and script file)

const fileName = (args.length === 0) ? 'index.jome' : args[0];
const fullPath = path.join(__dirname, fileName)
buildAndRunFile(fullPath)

// let builder = new JomeBuilder({projectAbsPath: __dirname})
// builder.execute(fullPath)