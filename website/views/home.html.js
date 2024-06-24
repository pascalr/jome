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
  // The unit checker can infer that this block returns a value
  // with N*m or equivalent as a unit and shows it.
  return <jome >
    return force * distance
  </jome >
  \`\`\``);

  let overview = `
  <div id="homepage-example">
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
  </div>`.replace("e7fbf80ba4c5b2cb25858cfa78de66e9", overview01);

  let content = mdToHtml(`

  # Jome

  Jome tries to be an unopiniated programming language. You code using your own style and use a linter in other to share
  standardized code with other people.

  You should use a specialized editor (WIP) in order to fully use all it's features such as code evaluation (like Jupyter Notebook)
  and data editing (like spreadsheet with types inside the editor).

  It has nice features like a base library and macros.

  For the near future, it only compiles to JavaScript.

  ## Status

  Jome is in early development stage. It is not usable yet.

  The compiler does not handle all the features described here. Tests are lacking and there is a lot of bugs.

  <h2 id="sample">Code Sample</h2>

  045a7bfe3dba9ba99b065d6f5aedfd77

  Result inside the editor:

  bce059749d61c1c247c303d0118d0d53

  Result inside the shell:

  \`\`\`sh
  jome torqueCalculator.jome --force=10 --distance="2 m"
  # => 20 N·m
  \`\`\`

  Usage inside another file:

  \`\`\`jome
  import calculateTorque from './torqueCalculator.jome'

  let torque = calculateTorque force: 20 lbs, distance: 1 in
  \`\`\`

  <h2 id="features">Features</h2>

  Jome has some original features that sets it appart from other languages.

  1. **Notebook comments** - You can add documentation comments using markdown to create a notebook like jupyter.

  2. **Inline data** - TODO: You can do advamced stuff with inline data using tags (preprocessing, ...)

  3. **Flexible syntax** - You can code using the style you prefer and use a linter to share code in a standardized way.

  4. **Flexible typing** - You can use static typing for robustness and usability or omit them for development speed and simplicity.

  5. **Custom base library** - Choose the base library for your project to reuse common functionalities.

  6. **A unit system** - You can add units to numbers. Smart conversions are done at compile time to ensure you use the proper units.

  7. **Custom base language** - Choose the language to jome compiles to and inherits operators and globals (Only javascript supported for now)

  8. **Macros** - Add extra parameters given the context of the function call.

  ## Notebook like jupyter

  Markdown comments are used for documentation and for creating notebooks.

  ### Markdown cells

  You can create markdown cells by adding an hashtag followed by a space. Multiline is also supported by surrounding the content with an hashtag and a star \`#* This is a *markdown* cell *#\`.

  \`\`\`jome
  #*
  This is a markdown cell
  ### This level 3 title
  Below is the ending
  *#
  \`\`\`

  ### Code cells

  \`\`\`jome
  < jome >
    let txt = "This is a code cell"
  < / jome >
  \`\`\`

  ### Data cells

  There is two kinds of data. There is runtime data. And there is static data.

  Runtime data is data given using the with keyword. When you reload this page, you loose this.

  Static data is data directly inserted into the code. When you save you modify the source code.

  Jome introducte the idea of data cells in a notebook.

  The idea is that you should be able to enter data in a spreadsheet like format in the notebook.

  TODO: Explain that tags are data cells, and that right now I am simply abusing the markdown cells

  How to support =A1+B2 ?

  \`\`\`jome
  // A table like this should be editable as a spreadsheet in the editor
  < table >
    < tr >
        < th >Name</ th >
        < th >Age</ th >
        < th >City</ th >
    </ tr >
    < tr >
        < td >John Doe</ td >
        < td >25</ td >
        < td >Montréal</ td >
    </ tr >
    < tr >
        < td >Jane Smith</ td >
        < td >30</ td >
        < td >Québec</ td >
    </ tr >
  < / table >
  \`\`\`

  ### Collapsed code cells

  There should also be collapsed by default code cells. For example for imports. If you click on it, you should see it.
  But you could also that it is collapsed by default.

  But I want to be able to search for it though... CTRL+F should find text hidden inside the collapsed cell. Not sure if that is possible in the browser...

  Ah yes, maybe simply make is small and scrollable, but when it gains focus, it becomes bigger! This should work with CTRL+F!

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
  console.log(torque)
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

  ## Macros

  Macros are functions that are extended at compile time with the context. Additional parameters are added to the function.

  You can access the code given to the parameter as a string. You can also get the unit of the parameter.

  \`\`\`jome
  def calc(value along code c along unit u)
    console.log(c, ' = ', value, ' ', u)
  end
  calc(1 + 1 N) // compiled as calc(1+1, "1 + 1 N", "N")
  // => 1 + 1 N = 2 N
  \`\`\`

  ## Jome API (WIP)

  In order to make code that can compile in many programming language, there would be an API available under the Jome object.

  \`\`\`jome
  jome.print("Hello world!") // compiles to console.log in js, printf in c, puts in ruby, etc.
  \`\`\`

  It's an idea. It is not implemented yet. Only javascript as a base language is supported for now.

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
