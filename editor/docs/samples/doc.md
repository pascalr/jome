TODO: A readme.md, a todo.md, a fixme.md, the readme.md should link to the other two, I should be able to
see and edit them inside the editor, I'd like to be able to edit the editor itself as I am writing it.

A jome file would be a file that is not bound to a specific language.

It can include scripts from multiple languages.

Not sure what the file format would be yet.

Using md as the default format? Allows you to include scripts from many languages.

You could use a comment to add for example a table of content, a folder listing, ...


Par défaut, quand il n'y a pas du tag qui définit le commentaire, ça serait du markdown?
Pour entre autres permettre de faire: //~# Titre 1

Ça serait du pseudo-markdown. Pas tout à fait pareil. Par exemple, pas de code block en indentation,
car ça ne fais pas de sens dans notre cas, le code est du code.

Les types supportés:
- h1,h2,h3,h4,h5,h6: peut-être, peut-être pas et doit utiliser markdown
- unit
- type
- 

Nice:
> ⚠️ **Warning:** Do not push the big red button.

> 📝 **Note:** Sunrises are beautiful.

> 💡 **Tip:** Remember to appreciate the little things in life.

Links:
[Website](https://duckduckgo.com)
[Header](#header_id)
[File](file:///home/me/some_file.txt)
[Function](function://package.function)