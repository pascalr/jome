const jome = require('jome')


const {AppPage} = require("../lib/app.built.js");
const renderMarkdown = require("jome/lib/render_markdown");

module.exports = new AppPage({title: 'Simple HTML Page', content: (renderMarkdown(`

  # Jome v-0.0.0.0.1

  Jome is a language that compiles to JavaScript. It has a node structure like in Godot, it has types like Typescript,
  it has goodies like CoffeeScript and underscore.js, it handles state like in React and it has some original features.

  Well that's the idea at least. Right now it is very much in experimental phase. There are a lot of bugs and not many tests are written yet.

  You can read from top to bottom to learn the language, or you can jump to any section if you are only curious.

  ## Overview

  Example Jome code: TODO: Make this like the examples so you can click see compiled and result

  Here is some code to show what Jome looks like. You can look at the [examples](${global._URL}/examples) page to see more.

  \`\`\`jome
  // Classes
  class Character |@name, @weapon?| => {
    attack: |enemy| => (

    )
  }
  class Weapon |damage?, range?| => {}

  // Inheritence and properties
  class Dagger { super: Weapon range: 50 }
  class WeakDagger { super: Dagger damage: 50 }
  class StrongDagger { super: Dagger damage: 200 }

  // Instantiation
  var startingWeapon = { WeakDagger }
  var hero = { Character "Paul", weapon: startingWeapon }

  // Scripts (any language, here shell)
  var gameSaved = <sh>cat "saved-gamed.json"</sh>

  // Functions
  def announceGameIsStarted = -> (
    console.log('Game started!')
  )
  announceGameIsStarted()
  \`\`\`
  
  ## Disclaimer

  The language is very, very young and still contains a log of bugs. I don't recommend using yet for any real project.

  I don't have a list of bugs yet, because there are too many.

  ## Installation

  \`\`\`sh
  # FIXME: NPM PACKAGE IS NOT YET CREATED!
  npm install jome
  \`\`\`

  ## Usage

  \`\`\`sh
  # Usage
  jome # executes index.jome in current or ancestor directory
  jome file.jome # execute the given file
  jome server start # pass the arguments "server" and "start" to index.jome executable
  \`\`\`

  <h2 id="lang-ref">Language Reference</h2>

  This documentation assumes the reader is familiar with javascript.

  Jome is similar to JavaScript, but there are a few distinctions that you must be aware of. Mainly, the syntax is a bit different, there are nodes, named parameters and scripts.

  <h2 id="syntax">Syntax</h2>

  Parentheses are used for statement blocks.

  \`\`\`jome
  if (someCondition) (
    /* Notice the usage of parentheses and not curly braces */
  )
  \`\`\`

  Curly braces are used for [blocks](#blocks).

  \`\`\`jome
  def someFunction = -> (return 10 + 20) // ok
  def someFunction = -> {return 10 + 20} // WRONG!
  def someFunction = -> {x: 10} // ok
  \`\`\`



  Vertical bars are used for function parameters.
  \`\`\`jome
  def addXY = |x, y| -> (x + y)
  \`\`\`

  TODO: Try an idea: -> and => are optional
  \`\`\`jome
  def addXY = |x, y| (x + y)
  [1,2,3,4,5,6,7,8,9].filter(|nb| nb > 5)
  // Et pour quand il n'y a pas d'argument?
  def sayHello = | | (#log("Hello!")) // Noooooon ça c'est laid...
  \`\`\`

  ### Keywords

  Declaration keywords:
  - [var](#declaration): To declare variables
  - [def](#declaration): To declare functions
  - [let](#declaration): To declare anything

  ### Bilingual

  Jome is bilingual in french and english. There are french keywords equivalent to english keywords.

  - vrai: true
  - faux: false
  - si: if
  - sinon: else
  - requiert: require
  - ...

  <h2 id="blocks">Blocks</h2>

  Blocks are a key component of Jome. They use indentation to build objects in a short and subjectively pretty way.
  It is also the syntax required to build [nodes](#nodes).

  Blocks are surrounded by curly braces. The result of a block can be an object, a list, a node or a value.

  \`\`\`jome
  // objects
  position = {x: 10, y: 10}
  destination = {
    x: 40
    y: 50
  }
  details = {
    distanceX: 30, distanceY: 40 // comma is optional
    totalDistance: 50, eta: 10min
  }

  // lists
  numbers = {1,2,3,4} // but [1,2,3,4] is preferred when on a single line
  names = {
    "Jean"
    "Jacques"
    "Paul"
  }
  matrix = {
    1, 0, 0
    0, 1, 0
    0, 0, 1
  }

  // nodes
  node = {
    Obj some: 'obj'
      'String child'
      Nested prop: 'val'
  }

  // values
  singleObj = {Obj prop: 'val'}
  chainResult = {
    Obj prop: 'val'
      Nested prop: 'val'
        Nested prop: 'val'
      run
  } // The value will be the result of the function run of the object created.
  \`\`\`

  ### Shorthand key syntax

  The short key syntax is different that in javascript, because it could be confused with list. In Jome, it starts with a colon
  \`\`\`jome
  obj = {:content, :value}
  // same as
  obj = {content: content, value: value}
  \`\`\`

  ### Functions inside blocks

  A variable name nested under a node is a function call.

  If you want to refer to the variable to add it as a children, you use the = sign at the beginning.

  \`\`\`jome
  // Create a server, add a get handler and start it
  {
    ExpressServer port: 3000
      get '/', |req, res| => (
        res.send(homePage)
      )
      start
  }

  obj = {
    Obj prop: 'val'
      =addChild('arg')
      executeFunction
  }
  \`\`\`

  ### List with single element

  In a block, you can't have a list with a single element because it that case it returns the element directly.
  You have to use the square brackets syntax then.

  ### At (@)

  At is usually the same as the keyword this.

  \`\`\`jome
  let _this = @ // same as this
  let name = @name // same as this.name
  \`\`\`

  Idea: But it can also be used to refer to children.
  \`\`\`jome
  let firstChild = @1 // Child index starts at 1
  let secondChild = @2
  \`\`\`

  <h2 id="nodes">Nodes</h2>

  Nodes are objects in a tree structure. They can have a parent and they can have children.

  You create nodes by using blocks.

  \`\`\`jome
  node = {
    Obj (
      prop: 'val',
      prop2: 'val2'
    )
      @attr = 'val3'
      @attr2 = 'val4'
      child: 'val5'
      child2: 'val6'
  }
  \`\`\`

  ### Adding children to nodes
  
  In order to add children to nodes, you can use the << operator.

  \`\`\`jome
  hero.inventory << {
    Sword damage: 10, weight: 500g
    Shield armor: 8, weight: 400g
    Scroll "Scroll of wisdom"
    Belt
      HealingPotion life: 200
      ManaPotion mana: 100
  }
  \`\`\`

  ### Children attached with key

  LES NODES N'ONT PAS DE NOM, MAIS TU PEUX LES ATTACHER AVEC UNE CLÉ À UN PARENT
  QUAND TU ATTACHES UN CHILDREN AVEC UNE CLÉ, il est là ET il est dans la liste de children.
  si tu veux mettre à un attribute, mais pas children, alors utiliser @attr
 
  \`\`\`jome
  $ <<
    someVar = 10
    page: Page
      navbar: Navbar
        list: List
          Link "Musics", to: '/musics'
          Link "Sports", to: '/sports'
          Link "Arts", to: '/arts'
      Body
        Txt < md >
          # Welcome
          Welcome to this website! You can browse links at the top.
        < / md>
  >>
  var navLinks = $page.navbar.list->children
  \`\`\`

  ### Under the hood

  Underneath, nodes are objects with a property named '$'. The idea of doing it this way is in order to not clash with user defined properties for
  example name.

  The property includes the following attributes:
  - children: The list of children of the node.
  - parent: A link to the node who is it's parent
  - signals: A list of the signals the node listens to
  - childrenCount: The number of children of the node. Not sure about this one. TODO: Remove this since I can do children.length

  ## Conditions

  On jase. Pour les ifs, qu'est-ce qui pourrait être fait?
  J'aime quand même bien le if après.

  return "some val" if someCond

  Est-ce que ça serait possible de faire quelque chose de similaire plus développé?
  someVar = "some val" if someCond else "some default"
  someVar = "some val" if someCond
            "some other val" if someOtherCond
            else "some default"
  Est-ce que ça prend un else partout?
  someVar = "some val" if someCond else
            "some other val" if someOtherCond
            else "some default"

  Je veux quand même pouvoir faire un if normal, je pense que je préfère avec un end (vu que pas avec {})
  if someCond
    doSomething
  end

  if someCond
    doSomething
  else if someOtherCond
    doSomething // all valid
  elsif someOtherCond
    doSomething // all valid
  elif someOtherCond
    doSomething // all valid
  else
    doSomething
  end

  J'aime ça j'aime mes idées.
  On jase encore plus:
  Quoi faire avec le switch case?

  Mon idée, tu fais:
  case someVal
  Ça assigne la valeur someVal comme valeur temporaire qui va être utilisée.
  Ensuite, quand tu call when, ça compare avec la valeur de someVal

  ex:
  let cmd = "yell"
  case cmd
  // Any code can be here it does not matter
  return "HELLO WORLD" when "yell"
  let someVar = "hello" when "talk" else
                "hola" when "spanish" else
                "sup"

  Par défault, when fais simplement une comparaison.
  Mais tu peux utiliser d'autre opérations avec en suivant when d'un opérateur

  case number
  return "very big number" when > 10000
  return "big number" when > 1000
  return "number"

  Le case doit être dans le scope des when. Tu ne peux pas par exemple le mettre caché dans le if.
  Les when sont simplement remplacé par "if (expression du case)"

  <h2 id="named-parameters">Named parameters and props</h2>

  When calling a function, you can add paramters.

  \`\`\`jome
  someFunc(someParam: 10, otherParam: 'Jean')
  \`\`\`

  To define parameters when creating a function, you either add ? at the end for an optional parameter, or you add ! for a required parameter.

  \`\`\`jome
  def someFunc = |someParam?, otherParam? = 'Pierre', optionalParam?, requiredParam!| => (
    console.log(someParam) // No need to add ? or ! when refering to a parameter
  )
  \`\`\`

  You can pass a parameter that was not defined in the list.

  BUT YOU CAN'T PASS a parameter to a function if the function does not take any parameter. Because under the hood,
  we add a params argument to the function, so we need at least one to add the argument, then you can pass as many as you want.

  When calling a function with named parameters, the order does not matter. You can put them before arguments, after or even in the middle.

  ### PARAMS
  
  Get the list of parameters given to a function.

  \`\`\`jome
    def someFunc = => (
      PARAMS // The object containing all the paramters given to the function.
    )  
  \`\`\`

  FIXME: I don't like using the word PARAMS in capital letters, but I don't have a better idea yet.
  I don't want to reserve the keyword params...

  ### Props

  Props are all the parameters and attributes as parameters passed during an object creation.

  \`\`\`jome
  « Obj someProp: 10, someAttr: 'Paul' »
  class Obj |someProp?, @someAttr?| => {
  }
  // compiles to
  class Obj {
    constructor(__props__) {
      this.__props__ = __props__
      let {someAttr, ...__params___} = __props__
      this.__params__ = __params__
      this.someAttr = someAttr
    }
  }
  \`\`\`

  ### Under the hood

  TODO: Explain how it works

  ## Classes

  ### Inheritence

  \`\`\`jome
    class Base {
      super: Abstract prop: 'val'
    }
  \`\`\`

  ## Interfaces

  An interface is a list of props. When you declare a class, you can give an interface so you don't have to specify every time the list of
  possible parameters that can be given.

  To refer to an interface, you add an ampersand before the name.

  \`\`\`jome
  interface HtmlOptions |
    width?,
    height?
  |

  class Div &HtmlOptions => {/* ... */}
  class Span |arg, &HtmlOptions| => {/* ... */}
  \`\`\`

  I don't know yet how I want to refer to the interface values. Directly or through the interface name?
  Maybe allow both?

  \`\`\`jome
  class Div &HtmlOption => {
    toString: => (
      let widthPlus1 = width + 1
      // or
      let widthPlus1 = HtmlOption.width + 1
    )
  }
  \`\`\`

  In an interface, you can define arguments, parameters and attributes.

  \`\`\`jome
  interface Example |
    argument,
    parameter?,
    @requiredAttribute,
    @optionalAttribute?
  |
  \`\`\`

  Maybe also latter possible to define function that must be implemented by the class using the interface.

  An interface can be used by classes and by functions.

  ### Functions

  Il doit y avoir un espace avant le -> pour que ce soit une fonction. Sinon, c'est le meta accessor.

  By default, Jome adds returns statements to functions. This setting can be disabled in the config file.

  It is very nice when prototyping to not have to write return statements. But for production code, it is safer to always write them, this
  way you never return by accident a sensitive value that should be hiden from users.

  Je n'aime pas tant que Jome ajoute des returns statements automatiquement. Je veux avoir le contrôle là dessus. Comment faire
  si je ne veux pas retourner rien?

  Idées:
  def sum |args| :=> (executeMaisRetournePas(10))
  def sum |args| :-> (executeMaisRetournePas(10))
  def sum |args| |> (executeMaisRetournePas(10))
  def sum |args| |> (executeMaisRetournePas(10))
  def sum |args| (executeMaisRetournePas(10))
  func sum |args| (executeMaisRetournePas(10))
  function sum(args) ()

  Peut-être qu'avec def ne pas utiliser le signe =, je trouve ça redondant.

  def x 10
  def sum |a,b| => (a+b)
  def sayHello => #log("Hello!")
  def sayHello |> #log("Hello!")

  I think I got it: do and end

  def sayHello do #log("Hello!") end
  def sayHello do
    #log("Hello!")
  end

  def sayHelloTo |name| do
    #log(\`Hello! {name}\`)
  end
  // Utiliser la syntaxe comme ruby?
  def sayHelloTo do |name|
    #log(\`Hello! {name}\`)
  end

  Il reste la question de quand est-ce que c'est une fonction et quand est-ce que c'est une arrow function pour le bind?

  def c'est toujours pour le bind?
  Utiliser un keyword func ou fn pour les fonctions?

  if x do
    
  end

  ## State variables

  Nodes can have state variables that start with a percentage sign like \`%stateVar = 10\`

  \`\`\`jome
  { // %count does not have to be declared in the Btn class, you can attach any state to any node
    Btn %count: 0, ~click: => (%count += 1)
      Txt "Clicked {%count} {%count == 1 ? 'time' : 'times'}"  
  }
  // Txt does not have a %count state variable, so it checks to see if it's parent has one. Yes, Btn has a state variable called %count.
  // So Txt will add itself as a dependency on Btn state. It Btn state changes, then Txt will be updated too.
  \`\`\`

  C'est OK, mais j'aimerais pouvoir dire à qui appartient le state au lieu d'être à l'aveugle comme ça.

  J'aimerais pouvoir setter le state à travers un nom de node? Je ne sais pas ce n'est pas si explicit non plus...

  Qu'est-ce qui se passe si le node et ses parents n'ont pas le state?

  State variables inside classes.

  Class using parent state:

  \`\`\`jome
  // A question mark when dependent on a state or an exclamation mark (silent vs throw exception?)
  class ColoredText |@text, %theme?| {
    print: () => {
      return \`<p style="color: {%theme.textColor}">{%theme}</p>\`
    }
  }
  \`\`\`

  Class having state:

  \`\`\`jome
  // No question mark having state
  class App |%theme| {
    init: () => {
      %theme = {
        textColor: "red"
      }
    }
  }
  \`\`\`

  ### Documenting state variables

  Declaring state variables is not necessary. You can simply attach them to nodes. But it should be pretty important
  to declare them, in order to know what is available.

  \`\`\`jome
  class Something |%someState| => {

  }
  \`\`\`

  ## Optional keys

  :? => set le key value seulement si il y a une valeur
  \`\`\`jome
  let value = null
  let obj = {
   key:? value
  }
  obj === {} // true
  "key" in obj // false
  \`\`\`

  <h2 id="scripts">Scripts</h2>

  In jome, the idea is that you could include most other programming languages directly using xml tags.

  \`\`\`jome
  // Execute a shell command in a script
  <sh>ls -A</sh>

  // Ruby is a pretty nice language for scripts too 
  <rb>puts (1..10).select(&:even?).sum</rb>
  \`\`\`

  Supported list for now:
  - sh
  - html
  - md
  - js

  TODO list:
  - css
  - bin
  - oct
  - hex
  - rb
  - sql
  - txt et/ou str
  - C
  - cpp

  MAYBE list:
  - col: For color, need a way to let the editor know that we want to be picking a color.

  ### Scripts for data

  TODO:

  En jome, c'est <bin>01010101</bin> pour faire du binaire et <hex>FF00AA</hex> pour faire de l'hexadécimal.
  <oct>12345678</oct> compile en 0o
  
  Ne pas supporter 0xFF00AA et ne pas supporter non plus 0b01010101, ceci est confondant avec les unités.

  bin et hex compile en utilisant 0x et 0b

  TODO: Rajouter du syntax highligh au hex pour changer de couleur à toute les 2 charactères? Afficher comme des
  string et à tous les 2 charactères mettre comme si escaped string pour que la couleur change un peu.

  TODO: Supporter la syntaxe 123e4 par contre
  let exponentialNumber = 123e4;
  console.log(exponentialNumber); // Outputs: 1230000

  ### Scripts interpolation

  You can add data inside the scripts using the < % =    % > syntax.

  Contrary to other template languages like ejs, you must finish the expression given inside the interpolation tag.

  If you want to do a condition for example, you use a nesting tag < > ... < / >

  \`\`\`jome
  < % = if true < >
    <div class="content">
      < % = content % >
    </div>
  else < >
    <div class="content">
      < % = content % >
    </div>
  < / > % >
  \`\`\`

  The behavior will depend on the kind of script.

  On html, it will insert a template literal interpolation.

  On markdown what do I want to do?

  Logically, it would include markdown. But this mean that some markdown would be compiled at compile time,
  and that the text inside the interpolation would be compiled at run time. I don't like this because I don't
  want the built file to include the javascript of markdown-it. But this could be a feature if that is actually
  what the user want.

  But right now, I am the user and this is not what I want. So what I want is that the text to be interpolated
  be removed from the markdown compile, and that inserted compiled using a template literal.

  Basically, I want to inject html and not inject markdown directly.

  Nahhhh, I don't like this.

  What I really what is to add markdown. This means using markdown-it at compile time. I am fine with this.

  ### .jobj extension

  Files with a .jobj extension would start already in a block.

  It think this would be pratical for example for config files.

  <h2 id="utils">Utils</h2>

  For the complete list of utils: see the [utils page](${global._URL}/utils).

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
  \`\`\`

  Utils include most things global in javascript and useful utils like in underscore.js.
  
  Math: #PI, #sin, #cos, #tan, ..., #rand?
  console: #log, ...
  process: #argv, #env, #cwd...
  underscore.js: #map, #reduce, ...
  
  <h2 id="instance-driven-dev">Instance driven development</h2>
  Instance driven development is what I call when the focus is working on concrete objects in Godot software.
  Most of the time you control objects directly inside the editor and simply modify parameters.
  
  It's the same thing as object oriented, but the focus is on the concrete object rather than the abstract class.

  <h2 id="units">Units</h2>

  \`\`\`jome
  debug = |arg, unit argUnit| => (
    /* ... */
  )
  \`\`\`

  You can add units at the end of numbers like 100g. You can also add units at the end of variables using the middle dot.

  This feature is not yet implemented. Right now, it does nothing. The idea, is that if you have a function for example sleep
  that takes a time, then you can give it 1s or 1000ms or 0.000ks and it would all do the same thing.

  I want everything to be handled at compile time. I don't want to create a datastructure for this.

  Also, it's just nice to be able to write a unit beside a number.

  An idea also is that I would like to add an operator like variable->unit => which gives the unit has a string.
  So this way, you have the number for the variable directly, but if the program can infer the unit of the variable,
  you can also get it's unit.

  density = 105g / 98mL
  density->unit => "g/mL"

  area = 2m * 3m
  area->unit => "m^2"

  maybe, for an argument to a function, well it could be anything, so you either specify what unit you are expecting,
  or maybe have a special construct that means that you want the variable and it's unit

  func = |anything| => anything->unit
  func(10g)
  // because we are asking for unit here, it means that two args must actually be passed to the function, anything and __unit__anything
  so it would be compiled to
  function func(anything, __unit__anything) {

  }
  func(10, "g")

  <h2 id="verbatim">Verbatim string literals</h2>

  Verbatim string literals are strings that do not interpolate. The idea is taken from C#. But in C# it also includes backslashes without escaping
  them I don't know if I want to do that. Or I want to offer multiple possibilities.
  
  \`\`\`jome
  str = @"This is a string that does \${not} interpolate"
  \`\`\`

  ## signals
  
  Signals are used for events. They are not very much implemented yet. TODO: Check how Godot handles events, check how js handles events.

  In Jome, signals start with a tilde.

  \`\`\`jome
  class Button {
    ~click() {
      console.log('Button clicked!')
    }
  }

  btn = « Button »
  btn.click()
  \`\`\`

  ### Default signals

  Default signals are created for very common things.

  Jome signals:
  - ~created: Called when an object is created. I think this would be soooo nice and would be very usefull.
  This way, you can create an object and call a lot of methods that define how the object will be created.
  Then it will be call automatically. Maybe objects will have a variable isAuto by default true and if true
  then it will executed created automatically.

  Html functions:

  click, ...

  ### Under the hood

  Work in progress

  Signals are compiled as functions where the tilde is replaced by the prefix on_. And another
  function is created with the same same as the signal to force the signal.

  Or maybe just the version without the tilde and that's it?

  \`\`\`js
  class Button {
    on_click() {
      console.log('Button clicked!')
    }
    click() { on_click() }
    // or simply
    click() {
      console.log('Button clicked!')
    }
  }

  btn = new Button()
  btn.click()
  \`\`\`

  <h2 id="declaration">Declaration</h2>

  When you declare a variable without a keyword, the variable will be a constant. To declare a variable, use the var keyword.
  To declare a function, use de def function.

  TODO: Keywords, var, def, let

  \`\`\`jome
  PI = 3.1415
  PI = 10 // ERROR. PI is not allowed to be redeclared anywhere nested inside the scope
  var x = 10
  x = 20
  def add10 = x => x + 10
  add10(20)
  add10 = x => x + 20 // ERROR. add10 can only be redeclared in a nested scope
  \`\`\`

  ## along keyword

  When you want to also have the unit or the code for a variable, you can use the along keyword.

  along is useful to be used alongside:
  - unit: The unit of the expression given, as a string
  - type: The variable type of the expression given (like typescript), as a string
  - source: The source code literaly given of the expression, as a string
  - code: The js compiled code of the expression, as a string

  The along keyword is useful, because you could also want the use of the modifiers above alone.

  def debug = |msg along code along type along unit| => (
  def debug = |msg along code as customCodeName along type as customTypeName along unit as customUnitName| => (

  You can't only get the modifier value, but then again you can simply assign an unused variable name

  def printType = |unused along type|

  ## Capture de code

  TODO

  Je pense que la syntaxe que je veux est d'utiliser le type 'code'.

  \`\`\`jome
  def debug = |msg along code| => (
    #log(code+':', msg)
  )
  debug(nomDeVariable) // => #log("nomDeVariable:", nomDeVariable)

  // When calling in javascript, you need to supply both arguments
  debug(nomDeVariable, "nomDeVariable")
  \`\`\`

  ## String modifier

  Idée:

  J'aimerais pouvoir faire
  $"$URL/stylesheet.css"
  ou
  "$URL/stylesheet.css"$
  ou
  au lieu de
  \`{$URL}/stylesheet.css\`
  Ça serait plus simple mettre le modificateur avec pour parser, mais c'est plus beau après.

  ## Main

  The \`main\` keyword is compiled to \`export default\`.

  Waiiiiiiit. Pas sur. Je vais convertir mes trucs en CommonJs, et on va voir après si je peux supporter ça.

  Possiblement tu peux faire main ou export, mais pas les deux en même temps, parce que sois tu exécutes, sois tu exportes des fonctions
  parce que tu ne peux pas avoir l'équivalent de export et export default en CommonJS je crois.

  ### Export

  Au lieu de export, le keyword public?

  Une idée: Tous est export par défault. Pour mettre privé, mettre un underscore au début.

  Ça pourrait être une option de compilation optionelle. (enabled on mode prototypage, disabled en mode securité?)

  \`\`\`jome
  def publicFunc = => (

  )

  def _privateFunc = => (
    
  )
  \`\`\`

  ## Environment variables

  Use #env for environment variables

  \`\`\`jome
  #env.MY_ENV_VAR = 'foo' // => process.env.MY_ENV_VAR = 'foo'
  \`\`\`

  ## Global variables

  Global variables start with a dollar sign. For example, \`$MY_GLOB_VAR = 'foo'\`.

  Simply equivalent of global._ for now. Adding underscore in order to avoid name clashes. For example,
  I was using $URL, but this does not work because global.URL already exists within Node.

  ## Pretty output

  Idéalement, je ne me soucis pas de l'indentation de l'output et tout le tralala qui peut compliquer le compilateur pour rien.

  Simplement passer le code dans un formatteur de code.

  J'ai essayé prettier et js-beautify.

  Je préfère de loin prettier je trouve son output plus beau personnellement.

  Le problème est que prettier bug et ne veut pas process mes fichiers s'ils sont dans le .gitignore file............

  ## Types

  TODO: Support static typing a little like Typescript.

  You will be able to add the type of the variable with a colon like in the examples below.

  \`\`\`jome
  def greet = |name: string, greeting: string = "Hello"|: string => {
    \`\${greeting}, \${name}!\`
  }
  \`\`\`

  \`\`\`jome
  interface Person {
    firstName: string = "John"
    lastName: string = "Doe"
    age: number
  }
  \`\`\`

   \`\`\`jome
  var answer: number = 42
  \`\`\`

  I don't know Typescript. I don't get why type and interface. Let's just use Jome interface for now.



  ## Contributing

  I recommend using visual studio code for now because it is super usefull for debugging tokenization. You hit Ctrl+Shift+P,
  "inspect editor token and scope", and you see if it is correct. Also you see using syntax highlighting.

  You can make pull requests on github.

  You can simply make constructive comments on github.

  Keep in mind I am working only 10 hours a week on this project for now.

  ## Acknowledgements

  TODO: Explain why

  - CoffeeScript: I was kinda lost at some point. I did not have a clear direction for my language. Until I thought, hey, coffeescript did something similar! So it gave me a lot of guidance.
  - underscore.js: A great library full of goodies.
  - vscode: Escpecially thank you for creating custom grammar. It is really nice to create a grammar and see live the tokenization.
  - ChatGPT: I probably never would have had to courage to go through with writing a programming language if I did not have the help from ChatGPT.

  Thank you to everyone who contributed to any open-sourced library. Escpecially under a license like MIT license. You are awesome!

  TODO: Link to the librairies website

  Librairies used:
  - express
  - markdown-it

  ## Thrash  

  It's intented main purpose is to be used for prototyping or small projects. It is usefull for concrete applications like making something visual.

    «
    Page
      Navbar
        List
          Link "Musics", to: '/musics'
          Link "Sports", to: '/sports'
          Link "Arts", to: '/arts'
      Body
        Txt < md >
          # Welcome
          Welcome to this website! You can browse links at the top.
        < / md>
  »

    Il est aussi possible de définir des variables dans un bloc. Les variables sont simplement sorties du block et exécuter avant le bloc.


  Avoir un keyword new ou ben simplement toujours utiliser les blocks?
  \`\`\`jome
  obj = new Obj(/* ... */) // Supporter new?
  obj = {Obj /* ... */}
  \`\`\`

  The advantage is that there is never confusion. You never have an error that tells you you have to add parentheses. For example, in javascript:

  \`\`\`js
  let someFunction = () => ({x: 10}) // you often have to add extra parentheses around objects in js
  \`\`\`

  ## Features

  Main ideas:
  - [Nodes](#nodes) - An object in a tree structure
  - [Integrated scripts](#integrated-scripts) - Incoroporate code from other languages
  - [Named parameters and props](#named-parameters) - Add optional parameters easily
  - [Instance driven development](#instance-driven-dev) - A more approchable way to programming

  Goodies / Syntaxic sugar:
  - [Arrow getter](#arrow-getter) - Allows to save keystrokes and is easier to type. ex: obj->keys => Object.keys(obj)
  - Optional let - Not sure about that one...
  - [Verbatim string literals](#verbatim) - @\\\`This is a string that does \${not} interpolate\\\`
  - [Units](#units) - You can add units to numbers. ex: "density = 105g / 98mL"
  - [Hyphen](#hyphens) - You can use hyphens in variable names like left-panel. The minus operator should always be surrounded by spaces.

  ## bugs

  FIXME: The indentation is super important in markdown. For example, adding tabs inside md scripts, if only one tab html tags will work,
  otherwise it will not.

`))}).toString()