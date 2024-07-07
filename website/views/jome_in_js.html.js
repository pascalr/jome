const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let content = mdToHtml(`

  # Jome

  Jome is a virtual programming language on top of Javascript. It is a customizable way of seeing and modifying the code.

  Instead of having a separate source file, it adds annotations in comments. This way, you don't need anything special to run it. It's just Javascript.

  It also improves the base language by adding code validation and code generation.

  ## Plan

  ### Step 1 - As is

  Parse javascript using the javascript grammar file already available.
  Then compile the AST to javascript. Use a linter to standardize the js.
  It should output the same file.

  TODO: Try using acorn.

  ### Step 2 - Markdown

  Convert the AST into a notebook view with markdown given by @md.

  \`\`\`js
  /** @md # This is a *markdown* header */
  \`\`\`

  ### Step 3 - Units

  Inside the notebook view, show @unit into Jome numbers with units.

  \`\`\`js
  let x = 2 /** @unit m */
  \`\`\`

  Should show:

  \`\`\`jome
  let x = 2 m
  \`\`\`

  ### Step 4 - Models

  Show @model into xml tag in editor.

  \`\`\`js
  /** @model Recipe {
     attrs: [
       {name: "name", type: "string"}
       {name: "servings", type: "string", optional: true}
     ],
     has_many: [
       {name: "ingredients", model="ing", optional: true}
       {name: "steps", model="step", optional: true}
     ],
     components: [
        {
          model: "ing",
          attrs: [
            {name: "qty", type: "string"}
            {name: "name", type: "string"}
          ]
        },
        {
          model: "step",
          content: {name: "text", type: "string"}
        }
     ]
   }
  */

  // Inside Recipe class if it exists:

  /** @do fr0aw893hf9h32hr08h230rhww3 */
  // Code generated goes here
  /** @end fr0aw893hf9h32hr08h230rhww3 */
  \`\`\`

  \`\`\`jome
  <?model Recipe name: "string"
    <attr name="servings" type="string" optional />
    <has_many name="ingredients" model="ing" optional>
    <has_many name="steps" model="step" optional>
    <component model="ing">
      <attr name="qty" type="string" />
      <attr name="name" type="string" />
    </component>
    <component model="step">
      <content name="text" type="string" />
    </component>
  ?>
  \`\`\`

  ## Strings and tags

  \`\`\`js
  let color = /** @tag color */ \`#abcdef\`
  \`\`\`

  ## Tables

  ## With block

  A with block should be a code generator that generates code to handle stdin.

  ## main

  Since a file is now only a .js file, I need a way to mean execute code. Maybe a main file? Or implicit when using a with block?

  ## Annotation to say that it is Jome code?

  \`\`\`js
  /** @jome 0.0.1 */
  \`\`\`

  ## WIP

  This would mean using a parser for .js files.

  .js file => jome transcription => some editing => save to same .js file with annotations to lose no information

  No project config. Only user config. User personal library.

  \`\`\`jome
  # Some example
  with distance = 1 m end
  let force = 10 N
  \`\`\`

  \`\`\`js
  //@md # Some example
  let force = 10 //@unit N

  //@arg distance
  module.exports = (distance = 1 /*@unit m*/) => {
    
  }
  \`\`\`

  For Jome data in comments, it uses two stars like JSDoc. So it must be compatible.

  JSDoc already uses about 70 at names. https://jsdoc.app/


  Pour du meta data Jome, utiliser deux étoiles comme JSDoc. Donc être comptatible et ne pas utiliser 

  Syntax pour dire que c'est un commentaire Jome: \`/** */\``);

  return new Webpage("Jome", content).render();
};
