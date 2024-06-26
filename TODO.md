# Table data

  I want to be able to easily add table data inside the editor.

  ```
  testCompile #[2, tag<jome>, tag</js]
  ```

  Or even better, I want to allow to enable inside config.jome arrays for tags instead of strings.

  ```
  <test-compile>[<jome>#log "Hello world"</jome>, <js>console.log("Hello world")</js>]</test-compile>
  ```

  In config.jome, I say test compile is an array of jome and js.

  So when I do `<test-compile></test-compile>`, it should add underneath a side-by-side data editor allowing me to edit the content.

  It should hide the `<test-compile></test-compile>`, make a header and show the type of the thing inside the header.

  Actually, do I do this for all tags? No, not inline tags like bin, hex, col, ...

  But this should be the case for html and md.

  If I do,

  ```jome
  let content = < md >
    ...
  < /md >
  ```

  It should hide the tag, and it should indent one more indentation before it does not start at the beginning of the line.


TODO: Support "do:" (would be same as do end, but a single operand)

## Tmp begin

  TODO: Explain this better somewhere else.

  Declaration and initialization takes precedence over function call.

  ```jome
  Recipe recipe // here the variable recipe is declared
  Recipe recipe, 10 // here recipe and 10 are given to the function call Recipe
  Recipe(recipe) // here recipe is given to the function call Recipe
  Recipe recipe() // Here the constructor of recipe is called
  Recipe recipe() {/* ... */} // Here a function called recipe is created
  ```

  ```jome
  Recipe #{/* ... */} // Creation of a Recipe node
  Recipe recipe #{/* ... */} // Creation of a Recipe node with the node name being recipe
  Recipe(recipe) #{/* ... */} // Creation of a Recipe node with recipe being passed to the constructor
  Recipe recipe #{
    name: "Weird family recipe"
    Ingredient mainIngredient("salt") // recipe.mainIngredient => Ingredient("salt")
    Ingredient "pepper"
    SomeFunction(someVal)
  }
  ```

  TODO: Supporter:

  ```jome
  fn {/* ... */}
  fn int {/* ... */}
  fn foo() {/* ... */}
  fn int foo() {/* ... */}

  fn -> int {/* ... */}
  fn foo() -> int {/* ... */}
  ```

  TODO: once

  ```jome
  while once or someCondition
    /* ... */
  end
  /* =>
  let once_0 = 0
  while (!(once_0++)) // Does this work???
  */
  ```

  TODO: Supporter

  ```jome
  for (let i = 0; i < 0; i++) { /* ... */ }
  // These are all the same:
  for (let el : elems) { /* ... */ }
  for (let el of elems) { /* ... */ }
  for (let el in elems) { /* ... */ }
  ```

  TODO: Supporter

  ```jome
  if true
    x = 10
    y = 20
  else:
    z = 30
  ```

  ### Gotchas

  Main gotchas compared to javascript:

  - for in for of
  - No do ... while, use while once instead
  - No octal? use <oct></oct> instead

  ## Tmp end

  TODO: A tree view like in godot in vscode extension.

  Allow #http://... as paths? #http should autocomplete to add the slashes after

  TODO: Handle int returnTypeOnTheLeft = (int arg0, int arg1) => {/* ... */}
  This mandates that the function returns an int.
  It's the compromise of not being able to do int function(int arg0, int arg1) { /* ... */ }
  Though you can do than for methods inside a class.

  TODO: Language configuration guide: increaseIndentPattern, indentNextLinePattern (when ends with colon)

  TODO: Tokenize the tags simply as strings with interpolation and add semantic tokenization after.

  TODO: For the website, do more like Civet. Put v0_1.html.jome should be in a tab called Reference.
  Inside the home page, only put the best of Jome. The goal is to dazzle.

  TODO: Allow to specify syntax highlighting color theme inside config.jome.
  Use semantic coloring to customize colors using the language server.
  For example, I would like string.quoted.single to be of a different color than string.quoted.double.

  TODO: Allow types/structs that you can create like so:
  Params params = {
    someParam: 'val'
  }