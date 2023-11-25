const jome = require('jome')


const {AppPage} = require("../lib/app.built.js");
const renderMarkdown = require("jome/lib/render_markdown");

var content = renderMarkdown(`
  ## Utils

  TODO: #uuid, avec un enum obligatoire, par example #uuid(FAST), ou #uuid(SECURE)
  Utiliser quel #uuid par défaut? Idéalement, un paramètre obligatoire. Ce que j'aimerais, tu fais
  #uuid( et là l'autocomplete te demande tu veux utiliser quel enum.
  // # Define an enum
  //DaysOfWeek = enum
  //  SUNDAY:   0
  //  MONDAY:   1
  //  TUESDAY:  2
  //  WEDNESDAY: 3
  //  THURSDAY: 4
  //  FRIDAY:   5
  //  SATURDAY: 6
  TODO: Supporter enum comme coffeescript ou d'une manière différente

  Utils start with the # character.

  It can be a constant, a function or a function acting upon a variable.

  \`\`\`jome
  // A constant
  let x = #PI/2
  let e = #e // Euler's number

  // A function
  let angle = #sin(x)
  #log("The angle is:", angle) // #log is a shorthand for console.log

  // A function acting upon a variable
  let keys = obj.#keys // === #keys(obj) === Object.keys(obj)
  10.#times(i => /* ... */)

  // Chaining example
  obj.#keys.#filter(key -> key.startsWith(':')).#each(el => /* ... */)
  \`\`\`

  ### Jome specific utils

  #params, #props, #children, #removeChildren

  obj.#params // The list of props given to an object constructor
  obj.#props // The list of props given to an object constructor
  obj.#children // The list of children of a node
  obj.#removeChildren // Remove all children of a node

  ### Math

  #PI, #sin, #cos, #tan, ..., 

  #### #cos

  #### #PI

  #### #rand?

  #### #sin

  #### #tan

  ### console

  #log, ...

  ### process

  #argv #cwd, #env...

  ### underscore.js

  #keys, #values, #entries, #map, #reduce, ...

  ### Others

  #each

  #dirname, #filename, ...

  #dirname: The directory of the current file. (Equivalent of __dirname)
  #filename: The name of the current file. (Equivalent of __filename)

  // TODO
  obj.#isBlank // Like Rails blank // ou bien isBlank?
  obj.#isPresent // The opposite of Rails blank // ou bien isPresent?

  ### Colors

  Nahhhhhhh, because what would be the good value, I want jome utils to be universally accepted, not dependant on the context
  TODO: All html colors: MAYBEEE? Because I don't know in what format I would want the value to be... so probably don't do this
  - #red: 0xFF0000
  - ...
  Maybe #red_i32 or stuff like that, but that's ugly?
`)
module.exports = new AppPage({title: 'Jome utils', className: "utils-page", content: content}).toString()