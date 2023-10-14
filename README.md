# Jome

Jome is a little language that compiles in JavaScript. It is simliar to CoffeeScript in this way.

The main idea is what I call instance driven development. It's the same thing as object oriented, but the focus is on the concrete object
instead of the abstract class.

Instance driven development is like in Godot. Most of the time you control objects directly inside the editor.

It's intented main purpose is to be used for prototyping or small projects. It is usefull for concrete applications like making something visual.

## Installation

TODO

## Usage

TODO: Expliquer comment compiler du code .jome en code JavaScript.











Plan de match:

1. Que ça fonctionne
2. Page de présentation du language
3. Une dizaine de démos
4. Release to the world
5. Un éditeur Jome dans le browser

J'ai demandé à ChatGPT pourquoi javascript faisait la distinction entre expression et statement. Voir réponse plus bas.

Présentement, tout mon code est une expression.

Eux, assignation, if, et for sont des statements par exemple.

Assignation: Je ne suis pas tant d'accord. Retourner la valeur lors d'une assignation.
If statement: Ben faire l'équivalent de (condition ? valeur : null)
For statement: ouin... valeur de undefined? Ou bien tout simplement pas de for... Utiliser array.forEach ou array.each

TODO

<sh>ls -A</sh>
<rb>10 + 20</rb>
<c>int main(int argc, void* argv) {printf("Hello world!")}</c>
<ts>"someTypeScriptCode"</ts>
<html>
  How to put an html tag inside an html tag???
</html>
<css>
  #how .to .handle, .this
</css>

Ne pas me casser la tête. Faire exactement comme typescript.

jomec some_script.jome // compile en some_script.js

jome some_script.jome // exécute le script

En jome, tu peux exécuter du code javascript comme sui:
<>cecieEst = "du code javascript"</>

Comment faire pour exécuter du code jome en javascript?

Mes tests je les fait en quoi?
- javascript?
- jome?
  J'aimerais mieux en jome, mais le problème est que si je fuck la syntaxe, le fichier ne compile plus et plus aucun test ne s'exécute.
  La solution serait alors de séparer les tests en fichiers comme ça je peux exécuter certains fichiers

INSTALL

Add to ~/.bashrc or ~/.bash_aliases
alias jome="node ./jome.js"


DOSSIERS

server.js: Serveur node.js pour le site web.
docs: Fichiers statiques pour le site web.
projects: Fichier d'exemple programmer en jome.
views: Fichiers dynamiques pour le site web.
vscode-jome-lang: Extension pour Visual Studio Code pour le language Jome.







************** QUESTION *****************
In javascript, why is there a distinction between statements and expressions?

************** RÉPONSE *****************
In JavaScript, the distinction between statements and expressions relates to how code is executed and how values are produced. Let's break down the differences between these two concepts:

    Expressions:
    An expression in JavaScript is a piece of code that produces a value. Expressions can be simple, like a single constant value, or complex, involving operations, variables, function calls, and more. Expressions can be used in various contexts, such as assignments, function arguments, or within larger expressions.

    Example expressions:

    javascript

5 + 3  // produces the value 8
x * 2  // produces the value of x multiplied by 2
func(10)  // produces the value returned by the function call

Statements:
A statement is a line of code that performs an action or carries out a task. Statements don't necessarily produce values, although they can have side effects (modifying variables, invoking functions, etc.). Statements often control the flow of program execution, like loops and conditionals.

Example statements:

javascript

    let x = 10;  // variable declaration and assignment is a statement
    if (x > 5) {
        console.log("x is greater than 5");  // if statement is a statement
    }
    for (let i = 0; i < 5; i++) {
        console.log(i);  // for loop is a statement
    }

The distinction between expressions and statements is important because of how JavaScript's execution model works:

    Expressions produce values: Expressions are evaluated to produce values, which can be used in various ways within your code. They can be part of larger expressions, assigned to variables, or used as function arguments.

    Statements perform actions: Statements are instructions that carry out specific actions or tasks. They control the flow of your program, like conditionals and loops. While statements may have side effects, they don't produce values that can be directly used.

JavaScript's distinction between expressions and statements makes the language versatile. You can use expressions to build complex computations and then use the resulting values in statements to control the flow of your program. This separation also helps in understanding the intent of different parts of your code and makes it possible for JavaScript engines to optimize execution based on these distinctions.



## TODO

- Prendre les syntaxes actuelles de html et css et injecter mon code dedans pour l'interpolation jome <%= %>
- Créer un fichier de syntax pour highlight.js
- Implémenter de l'intelligence avec Visual Studio Code (code completion, bug detection...)
- Finalement, j'aimerais utiliser let x = ... au lieu de juste x = ...
- Pour l'instant c'est plus simple de tout installer, mais idéalement markdown, haml, etc serait optionel
ou peut-être jome-base qui a juste jome, et jome qui regroupe beaucoup d'autres sous language, j'aime ça en avoir beaucoup par défault
- Support <haml></haml>
- Support <md></md>
- Support <json></json>
- Support <rb></rb>
- Support <txt></txt> qui serait simplement du texte. Intéressant pour afficher du code juste en texte.
- Support custom language (il n'y aurait juste pas de syntax highlight pour)
- Configuration file to decide how to process the script tags found.
- Include all the lodash functions that make sense
- Require other file formats, for example, require images. SVG is the easiest as a string. How to handle other images?
- Faire quelques exemples sur le site
- Faire la documentation sur le site

## FIXME

- Le css devrait être scope à la page, du moins avoir la possibilité de le faire
- Les css de html-page devrait être des arguments
- A semicolon at the end of an import does not work
- A comment at the end of a required file does not work
- Présentement, je dois mettre <css> avant <html>, ça serait le fun que ce ne soit pas nécessaire
- Don't import multiple times the same css script...




PAS D'INTERPOLATION EN MARKDOWN, simplement faire <md>...</md>+"something"+<md>...</md>

MAIS OUI INTERPOLATION EN CSS, HTML, SHELL, etc... mais carrement prendre leur tmLanguage et
injecter dedans <%= %>