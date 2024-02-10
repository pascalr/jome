const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let content = mdToHtml(`
  # Utils

  ## Testing suite

  \`\`\`jome
  #describe "group test" do
    #test "some test" do
      let x = 10
      x.#mustBe 10
      "foobarbaz".#mustMatch /bar/
    end
  end
  \`\`\`

  Oui, à #mustBe, #mustMatch, ...
  Non à #describe, #test
  Ne pas fournir une librairie de test par défault.
  Rajouter minispec prend seulement quelques lignes dans config.jome de toute façon...
  Ça serait une trop grosse opinion...
  En plus c'est laid, tu ne veux pas avoir à faire #describe, #test, #it tout le temps...
  Tant qu'à faire des shortcuts, choisis directement quelle librairie tu veux.

  ## ...

  Je veux que this fasse toujours référence à un this normal comme dans un autre language.
  Utiliser #evt pour avoir accès au this dans un évènement. Cacher cette merde de javascript au user.

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

  NNooooooonn
  Implémenter un seul #uuid, simple, si tu as besoin de quelquechose de plus spécifique, ben utilise qqchose de plus spécifique.
  Avoir tous des trucs de base utile pour prototyper. Garder ça en tête.

  TODO: #debug =>
  def debug = |msg with code: code| => (
    #log(code+':', msg)
  )

  #log is for loggin
  #log10 is logarithmic
  #ln is natural logarithmic

  Maybe #print that does the same thing as #log? #puts?

  TODO: Implémenter un système de version lock. Je ne veux pas avoir #uuid-v2 #uuid-v3, ...
  Je veux un seul #uuid, mais je veux pouvoir changer le code dans le temps, mais sans briser quoi que ce soit.
  L'idée, est que la première fois que #uuid est détecter, alors, enregistrer dans jome.lock ou quelque chose du
  genre, la version de la function #uuid qui a été utilisé.

  Je ne veux pas non plus que #uuid soit configurable. C'est quelque chose de standard. Si tu veux to propre uuid function
  à utiliser partout, alors utilise $uuid et non #uuid

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

  Idée: #1, #2, ... fait référence aux arguments d'une fonction. Pas obliger de les déclarer. Ça peut être court comme syntaxe
  pour des filters par exemple.

  \`\`\`jome
  let even = [1,2,3,4,5,6,7,8,9].filter(#1 mod 2)
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
  Maybe #red_i32 or stuff like that, but that's ugly?`);
  return new Webpage("Jome utils", content).render();
};
