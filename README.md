# Jome

This is the master folder containing all the main parts of the Jome programming language.

TODO: Avoir seulement un README.md et des dossiers

## lsp

A language server protocol (LSP) implementation. This is to provide smart coding functionality to IDEs. Contains the server and the client.

TODO: Merge lsp and tm-grammar into a single folder maybe? A single vscode extension?

## jomec

A package that contains the compiler that converts .jome file to .js files.

## jome-lib

Contains functions that are used by Jome built-ins. #log won't be in jome-lib for example, it will be directly inside jome

But if a utils compiles into a function, this function will be inside jome-lib (or similar).

TODO: Split the code into a lot of packages.

jome-lib-core: Contains the most used functions
jome-lib-fs
jome-lib-lodash
jome-lib-...

TODO: Split the utils by grouping them when they are mostly used together, and group them mostly by their usage.
TODO: Optimize so a minimum amount of packages is install for the maximum of coverage, while keeping the space usage at a minimum.

## cli

The command line application to run .jome files.

## website

The source code for the website that contains the documentation, examples and an online editor.

## tm-grammar

The text mate grammar files and visual studio code extension.

## highlightjs-jome

This is for Jome syntax highlighting using highlight.js. It is usefull for highlighting on the web.

## docs

The static files for the github pages website compiled from the website folder.