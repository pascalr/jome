# Jome

Jome adds HTML5 code inside comments of other languages.

The idea is to see and document code in a more visual way and to add complex functionalities not possible with the language.

Jome code is delimited by a tilde at the beginning and the end of a comment block.

```js
/*~
<h1>This is a javascript file</h1>

<p>The field below will generate js code automatically when changed.</p>

<jome-field name="force" type="number" unit="N" value=10>
  */let force = 10;/*
</jome-field>
~*/
```

Jome is composed of many parts.

- Jome code: HTML5 code that is inserted inside comments
- Jome Editor: An editor to see and modify Jome code
- JomeScript: A scripting language used inside Jome code
- Jome components: Tags that can be inserted inside Jome code

<!--~begin dir_list(".", comments: {"REFERENCE.md": "Jome format reference"})-->
<pre style="background-color: #242426; padding: 0.5em;">
https://github.com/pascalr/jome/tree/main/editor
├─── 📁 <a href="./docs">docs</a> — <i>The files rendered on the website</i>
├─── 📁 <a href="./node_modules">node_modules</a>
├─── 📁 <a href="./src">src</a> — <i>The js files with the code for the editor</i>
├─── 📁 <a href="./.gitignore">.gitignore</a>
├─── 📄 <a href="./build.mjs">build.mjs</a> — <i>Script to bundle the editor in a single .js file.</i>
├─── 📄 <a href="./dev.js">dev.js</a> — <i>Script to launch an express.js webserver.</i>
├─── 📄 <a href="./FIXME.md">FIXME.md</a> — <i>List of known bugs</i>
├─── 📄 <a href="./package-lock.json">package-lock.json</a>
├─── 📄 <a href="./package.json">package.json</a>
├─── 📄 <a href="./README.md">README.md</a>
├─── 📄 <a href="./REFERENCE.md">REFERENCE.md</a> — <i>Jome format reference</i>
└─── 📄 <a href="./TODO.md">TODO.md</a> — <i>List of missing features</i>
</pre>
<!--~end-->

## Lexical

Node: A building block. An instance of a component. 
Component: A kind of node. Field, Calc, ...

## See also

- [The language documentation](REFERENCE.md)
- [TODO list](TODO.md)
- [Bugs list](FIXME.md)

## Random thoughts

> If people complain that it sends html comments, well the could be processed to be minimized and stored or they could be compressed when sent to simply filter comments. This is much less operations than server side rendering anyway.

> Instead of using markdown inside comments, why not simply only use HTML? This way I don't have to convert. It is more standard than markdown anyway. It does everything markdown does. Yesss, comments should be HTML.

## How it works (TODO: Move this somewhere else REFERENCE.md?)

1. Parsing: The source file is read and roughly parsed into a JomeDocument. This separates source code from presentation blocks.
2. Deconstruction: The JomeDocument is then translated into a ProseMirror document.
3. Modification: The user modifiers the ProseMirror document throught the editor.
4. Construction: When the user saves, the ProseMirror document is converted back into a JomeDocument.
5. Serializing: It is then written into the source language format.

The steps 1 and 5 are handled by language format plugins.

The steps 2 and 4 are handled by syntax plugins.

The steps 3 handled by editor itself.

How about the document format I use be compatible with ProseMirror document, this way I save a step? No.

## On jase

Je n'ai jamais tant aimé les menus standard, File, Edit, Selection, View, Help, ... c'est souvent pénible trouver ce que je veux.

Mon idée serait de ne pas mettre ça. À la place, utiliser en grande majorité le panneau de droite qui sert à modifier la sélection actuel. Quand tu cliques sur la fenêtre, ben tu verrais des paramètres générique du programme, du projet...

Quand tu cliques sur une page, tu vois le fichier ouvert et ses détails.

Quand tu sélectionnes du texte, tu vois ce que tu peux faire avec.

J'aime mieux parce que tu n'as pas toutes les options à passer aux travers, seulement celles qui te servent.

## Apparence

Titre centré en haut: « Nom du fichier présentement ouvert » - « nom du projet » - « Nom du programme »




## UI

J'ai en tête un bouton Home (petite maison) en haut à gauche. Quand tu cliques dessus, ça va à la page de départ.

La part de départ que je préfère, c'est comme Godot. Faire une belle page simple avec une liste de projet précédemment ouvert.
Ne pas me casser la tête et simplement reproduire le UI pour l'instant.

Mais j'aimerais faire mieux en proposant des templates un jour.



## Syntax

/*~ <h1>title</h1> This is text. <input label="Some label">*/let outCodeGoesHere;/*</input> ~*/
/*~ <h1>title</h1> This is text. {input({label: "Some label"}, */let outCodeGoesHere;/*)} ~*/
/*~ <h1>title</h1> This is text. {
  input({label: "Some label"}, */let outCodeGoesHere;/*)
  input({label: "Some other label"}, */let outCodeGoesHere;/*)
} ~*/

Correct one:
/*~ <h1>title</h1> This is text. {input(id: "outCodeGoesHere", label: "Some label") {*/
  let outCodeGoesHere;
/*}} ~*/

Inside the parens is simply JSON. Add curly braces before and after and do JSON.parse

Maybe at some point do parameters instead of only JSON, like:
input("outCodeGoesHere", label: "Some label")
input(id: "outCodeGoesHere", label: "Some label")

But this is premature optimization and is less flexible to change. Only do this very late.

## .jome

.jome is HTML partial with jome blocks

<h1>title</h1> This is text. {
  input(label: "Some label") {*/let outCodeGoesHere;/*}
  input(label: "Some other label") {*/
    let outCodeGoesHere;
  /*}
}


## spreadsheet

/*~ {sheet({id: "foo", C1: "=A1+B1"}, */let foo = [[1, 10, 11]];/*)} ~*/


## comments

Jome comments are not supported because you should use an editor and not program jome blocks directly. You can use HTML comments if you really need it. Or comments from the language.