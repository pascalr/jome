/*~
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
> :warning: **Warning:** Do not push the big red button.
> :memo: **Note:** Sunrises are beautiful.
> :bulb: **Tip:** Remember to appreciate the little things in life.

Links:
[Website](https://duckduckgo.com)
[Header](#header_id)
[File](file:///home/me/some_file.txt)
[Function](function://package.function)

*/