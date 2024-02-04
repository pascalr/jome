# Jome

This is the master folder containing all the main parts of the Jome programming language.

## jome

A package that contains the compiler that converts .jome file to .js files.

Also contains the jome CLI and the jomec CLI.

## language server

A language server implementing the language server protocol (LSP). This is to provide smart coding functionality to IDEs.

## vscode-jome

The VS Code extension for Jome language support. Handles syntax highlighting and a client to talk to the language server.

## lib

Contains functions that are used by Jome built-ins.
#log won't be in jome-lib for example, it will be directly inside jome
But if a utils compiles into a function, this function will be inside jome-lib (or similar).

## website

The source code for the website that contains the documentation, examples and an online editor.

## highlightjs-jome

This is for Jome syntax highlighting using highlight.js. It is usefull for highlighting on the web.

## docs

The static files for the github pages website compiled from the website folder.