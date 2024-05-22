const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let PARTIAL = mdToHtml(`
  \`\`\`xml
  <html>
    <div class="navbar">
      <span class="navbrand" href="#">Jome</span>
      <a href="\<%= locale %>/editor">Editor</a>
      <a href="\<%= locale %>/">Home</a>
      <a href="\<%= locale %>/utils">Utils</a>
      <a href="https://github.com/pascalr/jome">GitHub</a>
    </div>
  </html>
  \`\`\``);

  let overview01 = mdToHtml(`
  \`\`\`jome
  let result = force * distance
  return result
  \`\`\``);

  let overview02 = mdToHtml(`
  ## How to use
  There are three ways to execute the code.

  You do it directly inside the editor in preview mode.

  You can execute it using the jome CLI tool.
  \`\`\`sh
  jome torqueCalculator.jome --force=10 --distance=2
  \`\`\`

  You can also import it from another file to execute this code.
  \`\`\`jome
  import calculateTorque from './torqueCalculator.jome'

  let torque = calculateTorque force: 20N, distance: 1m
  \`\`\``);

  let overviewSrc = mdToHtml(`
  \`\`\`jome
  #*
  # Torque Calculator Example

  To do something useful, we need some **inputs**:
  *#

  with
    Number<N> force
    Number<m> distance
  end

  # Then we need some code to calculate the result:

  // We use a jome tag because it's a script that can be run
  <jome >
    let result = force * distance
    #log \`Result: \${result}\`
  </jome >
  return result

  #*
  ## How to use
  There are three ways to execute the code.

  You do it directly inside the editor in preview mode.

  You can execute it using the jome CLI tool.
  \`sh
  jome torqueCalculator.jome --force=10 --distance=2
  \`

  You can also import it from another file to execute this code.
  \`jome
  import calculateTorque from './torqueCalculator.jome'

  let torque = calculateTorque force: 20N, distance: 1m
  \`
  *#
  \`\`\``);

  let overview = `
  <div style="display: flex; width: calc(100vw - 340px);">
    <div class="preview" style="width: 50%; overflow: auto;">
      <h1>Torque Calculator Example</h1>
      <p>To do something useful, we need some <b>inputs</b>:</p>
      <div class="input-container">
        <label for="input-field">force:</label>
        <input type="text" id="input-field" name="input-field">
        N
      </div>
      <div class="input-container">
        <label for="input-field">distance:</label>
        <input type="text" id="input-field" name="input-field">
        m
      </div>
      <p>Then we need some code to calculate the result:</p>
      e7fbf80ba4c5b2cb25858cfa78de66e9
      f3840e772925caf69af5aeea9447c7d1
    </div>
    <div class="code" style="width: 50%; overflow: auto;">
      045a7bfe3dba9ba99b065d6f5aedfd77
    </div>
  </div>`
    .replace("e7fbf80ba4c5b2cb25858cfa78de66e9", overview01)
    .replace("f3840e772925caf69af5aeea9447c7d1", overview02)
    .replace("045a7bfe3dba9ba99b065d6f5aedfd77", overviewSrc);

  let content = mdToHtml(`

  # Jome

  Jome tries to be an unopiniated programming language. You code using your own style and use a linter in other to share
  standardized code with other people.

  You should use a specialized editor (WIP) in order to fully use all it's features such as code evaluation (like Jupyter Notebook)
  and data editing (like spreadsheet with types inside the editor).

  For the near future, it only compiles to JavaScript.

  <h2 id="overview">Overview</h2>

  Preview mode on the left, and edit mode on the right.

  bce059749d61c1c247c303d0118d0d53

  ## Features

  Jome is a language that compiles to JavaScript. It has goodies like CoffeeScript and underscore.js, permissive syntax similar to either javascript or ruby and it
  has some original features. One day, it will have a node structure like in Godot, types like Typescript, and reactivity like svelte.

  **Flexible typing** - You can use static typing for robustness and usability or omit them for development speed and simplicity.

  **Flexible syntax** - You can use curly braces, block statements with end keyword or inline with colon at the end.

  **Customizable builtins** - Jome comes with a lot of builtins which you can map to keywords you want. You can also define your own.

  **Reactivity** - TODO

  **Node structure like Godot** - TODO

  ## Flexible typing system

  Like the rest of Jome, the typing system is flexible. You can omit them, you can use hard typing or you can use duct typing.

  ## Notebook like jupyter

  Jome code can be used to create notebooks like jupyter.

  You can use the .jomn extension to denote that the file is expected to be opened as a notebook.

  ### Markdown cells

  You can create markdown cells by surrounding the content with an hashtag and a star \`#* This is a *markdown* cell *#\`.

  Note: ### is deprecated. Starting and ending with three hastags alone on a line is deprecated because it's confusing when you don't know if it's a start or an end.

  \`\`\`jome
  #*
  This is a markdown cell
  ### This level 3 title
  Below is the ending
  *#
  \`\`\`

  ### Code cells

  Not all code cells are executed.

  TODO: What keyword to use to mean that it should be executed???

  \`\`\`jome
  cell
    // ...
  end

  script
    // ...
  end

  code
    // ...
  end
  \`\`\`

  ### Data cells

  Jome introducte the idea of data cells in a notebook.

  The idea is that you should be able to enter data in a spreadsheet like format in the notebook.

  TODO: Explain that tags are data cells, and that right now I am simply abusing the markdown cells

  ### Collapsed code cells

  There should also be collapsed by default code cells. For example for imports. If you click on it, you should see it.
  But you could also that it is collapsed by default.

  But I want to be able to search for it though... CTRL+F should find text hidden inside the collapsed cell. Not sure if that is possible in the browser...

  Ah yes, maybe simply make is small and scrollable, but when it gains focus, it becomes bigger! This should work with CTRL+F!

  ### with blocks

  Idea: A with block should be showned in a notebook like documentation on the web. It should be pretty, and the script code below would
  be the content of the function of class.

   ## WIP - Base library

  You can use an hashtag for utils shortcut. You define it using import * from 'lib' // or './file'

  \`\`\`
  import * from 'lodash'

  let list = [1,2,3,4].#reduce((s,i) => s+i, 0) // TODO: Changer d'exemple parce qu'on peut simplement faire reduce...
  \`\`\`

  Using multiple import like this is not allowed because it would be annoying to know where the function is coming from and this avoids name conflicts.

  If you want multiple import, then create a file or library and join the import and export them.

  \`\`\`
  export * from 'ThingA';
  export * from 'ThingB';
  export * from 'ThingC';
  \`\`\`

  Ouin, finalement ce n'est pas super, parce que ce n'est pas plus clair ainsi, c'est juste un truc de plus... mais bon cette syntaxe est déjà accepté donc c'est OK
  
  ## Disclaimer

  The language is very, very young and still contains a log of bugs. I don't recommend using yet for any real project.

  I don't have a list of bugs yet, because there are too many.`).replace(
    "bce059749d61c1c247c303d0118d0d53",
    overview,
  );

  return new Webpage("Jome", content).render();
};
