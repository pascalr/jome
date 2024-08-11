# Jome editor

Jome is code that is inserted into other languages in order to add more information or give more advanced features.

Jome uses the extension of the base language and is added in the shape of a comment.

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

## See also

- [The language documentation](REFERENCE.md)
- [TODO list](TODO.md)
- [Bugs list](FIXME.md)

## Random thoughts

> If people complain that it sends html comments, well the could be processed to be minimized and stored or they could be compressed when sent to simply filter comments. This is much less operations than server side rendering anyway.

> Instead of using markdown inside comments, why not simply only use HTML? This way I don't have to convert. It is more standard than markdown anyway. It does everything markdown does. Yesss, comments should be HTML.