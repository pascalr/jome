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