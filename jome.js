//#!/usr/bin/env node

// Code to run another file in jome.
// ./node jome.js file.jome

import { buildAndRunFile } from './src/builder.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2); // Exclude the first two arguments (node executable and script file)

if (args.length === 0) {
    console.error('Please provide a filename.');
    process.exit(1);
}

const fileName = args[0];
const fullPath = path.join(__dirname, fileName)
buildAndRunFile(fullPath)