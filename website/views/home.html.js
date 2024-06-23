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
  return force * distance
  \`\`\``);

  let overviewSrc = mdToHtml(`
  \`\`\`jome
  #*
  # Torque Calculator Example
  *#

  with
    Number force = ? N* // Newtons or equivalent
    Number distance = ? m* // meters or equivalent
  end

  # Torque is the result of a force multiplied by a distance from a pivot point.

  // We use a jome tag because it's a script that can be run
  # The unit checker can infer that this block returns a value with N*m or equivalent as a unit and shows it.
  return <jome >
    return unitstr(force * distance) // unitstr and unitof try to extract the unit from the context
  </jome >
  \`\`\``);

  let overview = `
  <div style="display: flex; width: calc(100vw - 340px);">
    <div class="preview" style="width: 50%; overflow: auto;">
      <h1>Torque Calculator Example</h1>
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
      <p>Torque is the result of a force multiplied by a distance from a pivot point.</p>
      e7fbf80ba4c5b2cb25858cfa78de66e9
      <div class="code-result">=> null N·m</div>
    </div>
    <div class="code" style="width: 50%; overflow: auto;">
    </div>
  </div>`.replace("e7fbf80ba4c5b2cb25858cfa78de66e9", overview01);

  let content = mdToHtml(`

  # Jome

  Jome tries to be an unopiniated programming language. You code using your own style and use a linter in other to share
  standardized code with other people.

  You should use a specialized editor (WIP) in order to fully use all it's features such as code evaluation (like Jupyter Notebook)
  and data editing (like spreadsheet with types inside the editor).

  It has nice features like macros.

  For the near future, it only compiles to JavaScript.

  <h2 id="sample">Code Sample</h2>

  045a7bfe3dba9ba99b065d6f5aedfd77

  Result inside the editor:

  bce059749d61c1c247c303d0118d0d53

  Result inside the shell:

  \`\`\`sh
  jome torqueCalculator.jome --force=10 --distance=2
  # => 20 N·m
  \`\`\`

  Usage inside another file:

  \`\`\`jome
  import calculateTorque from './torqueCalculator.jome'

  let torque = calculateTorque force: 20 lbs, distance: 1 in
  \`\`\`

  <h2 id="features">Features</h2>

  Jome has a few original features (to my knowledge):

  1. **Easy scripting** - .jome files define functions which can be executed from the CLI or from another file easily

  2. **Notebook comments** - You can add documentation comments using markdown to create a notebook like jupyter.

  3. **Inline data** - TODO: You can do advamced stuff with inline data using tags (preprocessing, ...)

  4. **Flexible syntax** - You can code using the style you prefer and use a linter to share code in a standardized way.

  5. **Flexible typing** - You can use static typing for robustness and usability or omit them for development speed and simplicity.

  6. **Custom base library** - Choose the base library for your project to reuse common functionalities.

  7. **A unit system** - You can add units to numbers. Smart conversions are done at compile time to ensure you use the proper units.

  8. **Custom base language** - Choose the language to jome compiles to and inherits operators and globals (Only javascript supported for now)

  ## Easy Execution

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

  ## Flexible syntax

  You can code using the syntax you prefer. The project should specify a linter so the code is converted to a standard when you save.

  Also, the idea is that when you open a page, the editor should show you the code in the syntax that you prefer.

  \`\`\`jome
  if val == 20: doSomething()
  if (val == 20) { doSomething() }
  if (val == 20) doSomething() end
  calcSomething 1, 2 // You can omit parentheses for a function call
  \`\`\`

  Read more on [Flexible syntax]() (TODO Link)

  ## Flexible typing system

  Like the rest of Jome, the typing system is flexible. You can omit them, you can use hard typing or you can use duct typing.

  \`\`\`jome
  let addInts = (x, y) => x + y
  let addInts = (int x, int y) => x + y
  int addInts = (int x, int y) => x + y
  let addInts = (x : int, y : int) => x + y
  let addInts : int = (x : int, y : int) => x + y
  \`\`\`

  ## Rigid operators

  I think operators will be rigid. Otherwise it becomes a mess and you see code and you don't know how it behaves because it depends on how the operator was written.

  Maybe allow some flexible operators? Like ===, !== ? Probably not

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

  ## Base library

  Every project can choose a base library. This library should contain common utility functions and constants.

  \`\`\`jome
  // Example using lodash as a base library
  import * from 'lodash'

  // Then you get access to all the named exports by prepending an hashtag symbol before.
  #partition([1, 2, 3, 4], n => n % 2)
  // → [[1, 3], [2, 4]]

  // You can also use the hashtag operator (.#) to put the first operand before instead of after.
  { 'a': 1 }.#defaults({ 'a': 3, 'b': 2 })
  // → { 'a': 1, 'b': 2 }
  \`\`\`

  Read more on [Base library]() (TODO Link)

  ## Unit system

  Note: This is a work in progress.

  You can add units to variables. They are only used at compile time.

  You can specify the unit after a number or use the middle dot (·) to apply a unit to a variable.
  The editor should make this symbol easyily accessible. You can also simply multiply by 1 of the unit.

  \`\`\`jome
  let width = 5
  let force = 10 N // Newtons
  let distance = width·m // meters // same as width*1m
  let torque = force * distance
  jome.log(torque)
  // → 50 N·m
  \`\`\`

  with nb = ? foos end

  You can get the type of a variable as a string using the \`unitof\` operator.

  let unit = unitof someVar

  You can also do it using the along keyword inside a function.

  TODO: There must be a way to say that it is required to specify a unit.

  \`\`\`jome
  // Here, sleep should specify that the unit is mandatory
  jome.sleep(20 ms)
  \`\`\`

  ## Custom base language (flavor?)

  Only javascript is supported for now.

  Jome is compiled into the base language choosen.

  Jome operators are exactly the same as the base language.

  It also makes all the globals available from the base language available in Jome.

  \`\`\`jome
  with flavor js // you can omit this, this is the default
  
  console.log("Hello") // console is available because of javascript
  let y = 10 ** 2 // ** is the exponentiation operator like javascript
  \`\`\`

  If you want total control even let's say on the operators, you could eventually design a custom language.

  ## Disclaimer

  The language is very, very young and still contains a log of bugs. I don't recommend using yet for any real project.

  I don't have a list of bugs yet, because there are too many.

  ## Trash

  Jome is a language that compiles to JavaScript. It has goodies like CoffeeScript and underscore.js, permissive syntax similar to either javascript or ruby and it
  has some original features. One day, it will have a node structure like in Godot, types like Typescript, and reactivity like svelte.

  **Customizable builtins** - Jome comes with a lot of builtins which you can map to keywords you want. You can also define your own.

  **Reactivity** - TODO

  **Node structure like Godot** - TODO`)
    .replace("045a7bfe3dba9ba99b065d6f5aedfd77", overviewSrc)
    .replace("bce059749d61c1c247c303d0118d0d53", overview);

  return new Webpage("Jome", content).render();
};
