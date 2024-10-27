## TODO: Code mirror & Prose mirror

Code mirror pour le code (le contenu raw), et prose mirror pour le reste.

Soit contenir code mirror dans prose mirror (il y a une example sur le site de prosemirror),
ou une instance par segments.

## TODO: Key

Add key attribute to all objects. They will be unique identifiers.

The keys restrict the usage of variable names inside the language, it must not be the same.
Or what about using something different inside Jome code to differentiate between the two?
@variableName and objKey OR variableName and @objKey? Or #objKey

## TODO: Escaping

The end of comment sequence could come normally inside the html. In this case, use the unicode enconding.

Ex: For js, use \u002A\u002F instead of */

It could also be inside strings. In this case, use the escape character "\".

Ex: For js use "\*\/" or "*\/".

## TODO: Refactor parser, rename

Un fichier serait séparer en segment.

Les types principaux de segments sont:

- SourceSegment: As is. Ça peut être du code (.js, .rb, ...), du texte (.txt), de l'information (.json), du contenu (.md), ...
- JomeSegment: Meta data used to generate source automatically.

Un fichier est premièrement séparer par segments par: JomeParser

## Add x besides opened files to allow closing them

## On wheel click on tab close it

## Show NoPageOpened when no page is opened.

## Sidebar on homepage

Essayer d'afficher la sidebar sur le homepage. Petite ligne bleue pour afficher que tu es sur maison. Tu peux cliquer sur explorer pour aller sur l'éditeur.

## UML inside README.md on github

I really want that. svg? canvas?

## Code personalisé

Le projet devrait avoir un fichier avec des paramètres pour linter le code

ET

chaque utilisateur a des paramètres de préférences de code.

Quand tu ouvres un fichier, le code est converti selon tes préférences.

Tu fais des modifications avec ton code.

Tu enregistres, ça enregistre selon les paramètres de lintage de code du projet dans le fichier,

et ça modifie le code que tu vois si tu ne l'a pas écrit parfaitement comme selon tes préférences à toi.

## Optional curly braces

Un feature que j'aimerais bien, c'est l'option de cacher les curly braces, un peu comme dans ruby. Ça ne modifirait pas le code, ce serait
purement visuel.

## Back button on home

Simply save state before getting to home and restore if back is pressed?

## Optional parentheses

Un feature que j'aimerais bien, c'est l'option de cacher les parenthèses, un peu comme dans ruby. Ça ne modifirait pas le code, ce serait
purement visuel.

## XML tags

TODO

## Autre

Les boutons à droite, faire un effet Hover
Les boutons à droite, affiché plus blanc le menu qui est actif? Ou bien background?

Ouverture temporaire des fichiers comme dans vscode.

Afficher un message de départ quand il n'y a aucun fichier d'ouvert.

Enregistrer le state des fichiers ouverts.

Afficher un message, un modal, quand le serveur ne répond plus.








// TODO: I want to show the open menu every time the editor is opened, and you click on the latest project if you want to get back into it.
// So don't persist which project is currently opened.
// Only persist the history so it is showned in the latest.
// It would be nice to keep the history of files opened per project.
// This way, when you reopen a project, it reopens the files.
// Let's check out if Godot does that. No it does not. I guess it only opens the primary file. Do something similar?
// I would like that people specify a primary file, maybe README.md by default, and this is what is opened first.
// I am not so sure about all of that. Maybe do like vscode and when you reopen the program, it reopens the same way as you left it.
Finalement, je pense faire comme vscode. J'aime bien que ça réouvres ton dernier projet par défault. Tu recommences là où tu avais arrêté.
Essayé les 2 et choisir après?