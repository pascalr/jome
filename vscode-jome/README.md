TODO: Use \\1 insides the regexes for example when there is an optional quote: This explains it well:

The regular expression you've provided seems to be part of a syntax definition or pattern matching context. It is not complete on its own, and it appears to be designed to match a specific pattern within a larger string.

Breaking down the provided components:

    "begin": "(?=(?><<[-~](\"?)((?:[_\\w]+_|)HTML)\\b\\1))":
        (?> ... ): This is an atomic group that prevents backtracking into the enclosed pattern.
        <<[-~](\"?): Matches << followed by a character in the range [-~] (ASCII characters between hyphen and tilde), and captures an optional double quote.
        ((?:[_\\w]+_|)HTML): Captures a group containing either one or more word characters or underscores followed by an underscore, or just HTML.
        \\b: Asserts a word boundary.
        \\1: Backreference to the captured optional double quote (matching the one captured earlier).
        (?= ... ): This is a positive lookahead assertion, ensuring that the enclosed pattern exists ahead in the string without consuming characters.

    "end": "(?!\\G)":
        (?!\\G): This is a negative lookahead assertion, ensuring that the current position is not immediately following the end of the previous match (\G).

# Installation

## Linux

## Windows

Copier le dossier dans mon C:\Users\...\... ne fonctionnait pas.

J'ai fait Ctrl+Shift+P dans vscode, ensuite Developper : Install extension from location,
j'ai sélectionné grammar comme dossier et ça l'a finalement fonctionné!


MERCIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII https://www.apeth.com/nonblog/stories/textmatebundle.html
Pour \G entre autres


https://github.com/microsoft/vscode/blob/main/extensions/javascript/syntaxes/JavaScript.tmLanguage.json

# jome README

This is the README for your extension "jome". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**















    "function": {
      "name": "meta.function.jome",
      "begin": "\\[",
      "beginCaptures": {"0": {"name": "punctuation.definition.array.begin.jome"}},
      "end": "(\\])\\s*(=>)",
      "endCaptures": {
        "1": {"name": "punctuation.definition.array.end.jome"},
        "2": {"name": "punctuation.definition.arrow.jome"}
      },
      "patterns": [
        {"include": "#expression"}
      ]
		},