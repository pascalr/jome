const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  return mdToHtml(`
## Jome API (WIP)

In order to make code that can compile in many programming language, there would be an API available under the Jome object.

\`\`\`jome
jome.print("Hello world!") // compiles to console.log in js, printf in c, puts in ruby, etc.
\`\`\`

It's an idea. It is not implemented yet. Only javascript as a base language is supported for now.

print: console.log as a macro to print unit
debug: console.log as a macro to print code and unit`);
};
