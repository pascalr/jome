const { JomeBuilder, buildAndRunFile } = require('./builder.js');

const { compilePPAndSaveFile } = require('./src/parser.js');

module.exports = {
  JomeBuilder,
  buildAndRunFile,
  compilePPAndSaveFile
}