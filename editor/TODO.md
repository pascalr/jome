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