const Webpage = require("../src/webpage.js");
const mdToHtml = require("jome-lib/mdToHtml");
module.exports = () => {
  let content = mdToHtml(`

  # Jome v-0.0

  Jome is a language that compiles to JavaScript. It has a node structure like in Godot, types like Typescript,
  goodies like CoffeeScript and underscore.js, syntax similar to ruby, it handles state like in React and it
  has some original features.......

  Well that's the idea at least. Right now it is very much in experimental phase. There are a lot of bugs and not many tests are written yet.

  You can read from top to bottom to learn the language, or you can jump to any section if you are only curious.

  ## Overview

  Example Jome code: TODO: Make this like the examples so you can click see compiled and result

  Here is some code to show what Jome looks like. You can look at the [examples](${global.g_URL}/examples) page to see more.

  \`\`\`jome
  with
    name: string
    weapon: Weapon
  class Character(@name)
    def attack(enemy)
    end
  end

  interface CharacterProps
    name: string
    weapon: Weapon
  end
  class Character(@name) < CharacterProps
    def attack(enemy)
    end
  end

  // Classes
  class Character(@name, props)
    include props
    def attack(enemy)

    end
  end
  class Character(name, props)
    @name = name
    @weapon = props.weapon
    def attack(enemy)

    end
  end
  interface Weapon
    damage: number
    range: int
  end

  // When you inherit from an interface, you can call super on the interface to initialize some values

  // Inheritence and properties
  class Dagger < Weapon(range: 50) end
  class WeakDagger < Dagger(damage: 50) end
  class StrongDagger < Dagger(damage: 200) end

  // Instantiation
  var startingWeapon = { WeakDagger }
  var hero = { Character "Paul", weapon: startingWeapon }

  // Scripts (any language, here shell)
  var gameSaved = <sh>cat "saved-gamed.json"</sh>

  // Functions
  def announceGameIsStarted
    #log 'Game started!'
  end
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

  Jome is similar to JavaScript, but there are a few distinctions that you must be aware of. Mainly, the syntax is a bit different, there are nodes and scripts.

  <h2 id="syntax">Syntax</h2>

  The syntax is similar to the ruby programming language. You use the keyword def instead of function.
  And you use the end keyword instead of curly braces.

  \`\`\`jome
  class Person
    def sayHello
      #log 'Hello!' // #log is a util shorthand of console.log
    end
  end
  \`\`\`

  Parentheses are optional for function calls.

  \`\`\`jome
  let add = (x,y) => x + y
  add 10, 5
  \`\`\`

  You can pass arguments for a single object without using curly braces.

  \`\`\`jome
  let add = ({x, y}) => x + y
  add x: 10, y: 5
  \`\`\`

  To call a method on a object without parameters, you can use an arrow.

  \`\`\`jome
  obj->density // same as obj.density()
  obj->density = 1.05 // def density=(val) // TODO: WIP
  obj->save
  \`\`\`

  You can use \`do ... end\` to create functions. You pass arguments between vertical bars.

  \`\`\`jome
  [1,2,3,4,5].each do |i|
    console.log i
  end
  \`\`\`

  <h2 id="utils">Utils</h2>

  The language includes a lot of built-in functions and constants. They start with a hashtag (#) symbol.

  For the complete list of utils: see the [utils page](${global.g_URL}/utils).

  \`\`\`jome
  // A constant
  let x = #PI/2
  let e = #e // Euler's number

  // A function
  let angle = #sin(x)
  let logarithmic = #log10(2)
  #log("The angle is:", angle) // #log is a shorthand for console.log
  \`\`\`

  By addind a dot before the hashtag, you can call the function with the preceding token as an argument.

  \`\`\`jome
  // A function acting upon a variable
  let keys = obj.#keys // same as #keys(obj) or Object.keys(obj)
  \`\`\`

  Utils include most things global in javascript and useful utils like in underscore.js.
  
  Math: #PI, #sin, #cos, #tan, ..., #rand?
  console: #log, ...
  process: #argv, #env, #cwd...
  underscore.js: #map, #reduce, ...

  For functions that have a sync and async version, use the exclamation mark after to use the sync version.
  \`\`\`jome
  #write! './somefile.txt', 'Some content', overwrite: true
  \`\`\`

  ## Types

  You can specify types for variables. It can be primitives like string, number, integer or float. It can also be class names or interfaces.

  \`\`\`jome
  def greet(name: string, greeting: string = "Hello") : string
    return \`\${greeting}, \${name}!\`
  end

  def attack(enemy: Player)
    /* ... */
  end
  \`\`\`

  You add a question mark after the type if the variable can be null.

  \`\`\`jome
  def sayHello(anybody: Person?): string
    return \`\${greeting}, \${anybody.name}!\` if anybody
  end
  \`\`\`

  In a node block, you can specify the types of keys like so:

  \`\`\`jome
  {
    [key: string]: nb; // Here nb is a string
  };
  \`\`\`

  But what about the types of children? (string)
  {
    MyNode
      "childString"
      (string) someFuncCallReturnsString
      [string] someFuncCallReturnsString
      someFuncCallReturnsString : string // Nooooooo, because it clashes with parameters...
  }

  You can create custom types. See interfaces and types. (TODO: link)

  <h2 id="blocks">Blocks</h2>

  Blocks are delimited by curly braces and are used for a lot more than creating objects. You also use then to instantiate
  objects, execute functions and to create [nodes](#nodes)

  \`\`\`jome
  // objects
  let details = {
    distanceX: 30, distanceY: 40 // comma is optional
    totalDistance: 50, eta: 10min
  }

  // values
  let obj = {Obj prop: 'val'} // instantiate an object
  let objRunResult = {
    Obj prop: 'val'
      .run 'some arg'
  }

  // nodes
  node = {
    Obj someProp: 'obj'
      'String child'
      Nested prop: 'val'
  }
  \`\`\`

  Note: A value is only on a single line. Use parentheses if you need multiple lines.
  \`\`\`jome
  {
    x: 1 +
       2 // WRONG!
    y: (1 +
       2) // OK
  }
  \`\`\`

  ### Shorthand key syntax

  The short key syntax is different that in javascript, because it could be confusing with children. In Jome, it starts with a colon
  \`\`\`jome
  obj = {:content, :value}
  // same as
  obj = {content: content, value: value}
  \`\`\`

  ### Work in progress V2

  We always know if the identifier is a function or a class. When it's local we know. We it's imported,
  you add an ampersand before the identifier when it's a class.

  import {func, &klass} from 'lib'

  I am not sure yet how I want to handle when you want to call new for a function and not a class, well I am not even sure I want to support this in Jome...

  identifier // if identifier is a class, then new identifier(), otherwise identifier()
  key: identifier // set identifier as a property of the instance
  =identifier // add identifier as a children of the node
  key = identifier // add identifier as a property of the object and as a children
  :identifier // pass identifier to the constructor as a property of the object
  .identifier // call function on parent

  Le désavantage que je vois de faire key: identifier pour une propriété, est que c'est tanant pour le type.
  Avec un = c'est facile rajouter le type. Mais d'un autre côté, est-ce qu'on veut vraiment mettre un type
  là? Ça devrait être assez explicit en général. Et tu peux quand même le faire avec [key: type].

  You can specify dynamic keys using square brackets. Ex: [\`key_{name}\`]

  \`\`\`jome
  {
  Recipe
    name: 'Chickpea balls'
    prepare: 1h
    Ing 1cup, "dry chickpeas"
    Ing 2cup, "water"
    Ing 2tbsp, "parmesan"
    Step \`Put {@1} into {@2}...\` // @1 is the first children
    Step "Mix ..."
    Step "Blah blah ..."
    .prepare 'The recipe'
    Ing ...
  }
  \`\`\`

  \`\`\`jome
  // Create a server, add a get handler and start it
  {
    ExpressServer port: 3000
      .get '/' do |req, res|
        res.send(homePage)
      end
      .start
  }
  \`\`\`

  ### Construction block

  You can apply a block onto an instance using #{ }.

  \`\`\`jome
  with
    name: string
    prepare: int
  class Recipe
    def prepare(str)
    end
  end

  class Ing(qty: int along qtyFormat, @name)
  end

  class Step(@instructions)
  end
  \`\`\`

  \`\`\`jome
  Recipe #{
    name: 'Chickpea balls'
    prepare: 1h
    Ing 1cup, "dry chickpeas"
    Ing 2cup, "water"
    Ing 2tbsp, "parmesan"
    Step \`Put {@1} into {@2}...\` // @1 is the first children
    Step "Mix ..."
    Step "Blah blah ..."
    .prepare 'The recipe'
    Ing ...
  }
  \`\`\`

  ### Chain block

  You can create a chain block using chain ... end.

  Chain returns the value of the last command.

  \`\`\`jome
  // Create a server, add a get handler and start it
  ExpressServer port: 3000 chain
    get '/' do |req, res|
      res.send(homePage)
    end
    start
  end
  \`\`\`

  \`\`\`jome
  // Create a server, add a get handler and start it
  {
    ExpressServer port: 3000
      someProp: 'someVal'
      chain
        get '/' do |req, res|
          res.send(homePage)
        end
        start
      end
  }
  \`\`\`

  \`\`\`jome
  import express from 'express'

  let port = 3000

  express chain
    get '/' do |req, res|
      res.send('Hello world!')
    end
    listen port do
      #log \`Server listening on port {port}\`
    end
  end
  \`\`\`

  Compiles to

  \`\`\`js
  import express from 'express'

  let port = 3000

  (() => {
    let __chain = express()
    __chain.get('/', (req, res) => {
      res.send('Hello world!')
    })
    return __chain.listen(port, () => {
      console.log(\`Server listening on port {port}\`)
    })
  })()
  \`\`\`

  ### Lists inside blocks

  A block { } will return only one object. Use {[ ]} to generate a list of objects.

  \`\`\`jome
  let listObjs = {[
    Obj name: 'foo'
    Obj name: 'bar'
  ]}
  \`\`\`

  ### At (@)

  One of the objective of Jome is to remove the weird thing that is this.

  I want in Jome this to refer to the current instance when inside a method and that's it.

  In order to do this, I should bind automatically all the functions inside the class to the proper this.
  Inside the constructor:
  everyMethod1.bind(this)
  everyMethod2.bind(this)
  Then inside the everyMethod1:
    __this = this
  everyMethod2:
    __this = this

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

  TODO: Use the keyword self instead of this, this makes it clear that it refers to self inside a class,
  and that it is a little different than this in javascript in that it always refer to the class instance.

  Use #evt to get current event
  Use window or #window to get the window

  ### Exclamation mark in objects

  Inside an object, you can use an exclamation mark after a variable name so it sets it value to true.

  \`\`\`jome
  let obj = {someCond!} // same as {someCond: true}
  \`\`\`

  ## Paths

  The issue with relative paths is that you don't know what they are relative to. In js, in include files,
  the relative path is relative to the current file. If you try to open and write a file, than it is relative
  to the current working directory.

  In Jome, this is more explicit using paths. '#./' is used for paths relative to current file, '#cwd/' is used for
  paths relative to the current working directory. They are compiled to become absolute, so you can pass it to
  a function in another file and you are sure it will reference the proper file.

  You can use # to define paths. They must start by '/', '.' or 'cwd/'. (Maybe '~' too)

  \`\`\`jome
  let path0 = #. // same as __dirname
  let path1 = #/some/absolute/path.txt
  let path2 = #./someFile.jome
  let path3 = #../otherDir/"some file with spaces.txt"
  let path4 = #cwd/someFile.txt // Allow paths after #cwd to get files inside current working directory.
  let path5 = #~/Downloads/someFile.txt // Maybe
  \`\`\`
  
  Relative paths are converted to absolute paths. It's the same as joining __dirname with the relative path.

  Spaces are not allowed, but you can escape them. Any other character is allowed?

  You can use quotes inside paths, just not at the beginning. You can use like like so:

  \`\`\`jome
  let test = #./'some/file with spaces.txt'
  let test = #/'some/file with spaces.txt'
  let test = #./"some/file with spaces.txt"
  let test = #/"some path/file with spaces.txt"
  let test = #/some/path/to/some/"file with spaces.txt"
  \`\`\`

  If you want quotes inside your filename, than you need to escape them.

  No interpolation inside jome paths?

  Paths always use the /, but maybe they are converted when compiling for Windows?

  Si je me retrouve à tout le temps faire #run(#./some_file.ext), ça serait nice d'avoir un
  shortcut.

  Par exemple, r#./some_file.html.jome

  Ce que j'aime du r ici c'est que ça veut dire run et ça veut dire read aussi.

  En fait c'est peut-être run! que j'utilise plus souvent.

  Utiliser !#./some_file.html.jome // Comme shortcut?

  ## Executing jome files

  .jome files are compiled into a function. When you use jome CLI to run a .jome file, you are executing this
  function and passing args to the function.

  You can use return inside a .jome file to exit prematurly or to return a value.

  You can use #run or #load to run another .jome file within jome.

  \`\`\`jome
  #run './some_file.jome'
  // compiles to:
  // import run_some_file from 'some_file.jome'
  // run_some_file()
  \`\`\`

  Jome files can be included into other jome files. This allows you to easily create partials and file improved with Jome.

  C'est utile pour générer des fichiers d'autres types aussi.

  data.json.jome
  \`\`\`jome
  return <json>
    {
      "some": "data",
      "title": <% title %>,
      "math": <% 1 + 2 %>
    }
  </json>
  \`\`\`

  some_file.jome
  \`\`\`jome
  let data: string = #run './data.json.jome', title: 'Some title!'
  \`\`\`

  Je ne sais pas encore pour des fichiers jome avec des modules et des exports. Peut-être un type de fichier différent? .jomm?

  some_page.html.jome, dans ce cas un fichier some_page.html.js est généré, il n'est pas exécuter automatiquement.

  Tu peux faire:

  #write #run(#./some_page.html.jome), to: #./some_page.html
  ou peut-être fournir un shortcut genre
  #compile #./some_page.html.jome

  Compiler tous les fichiers .jome avec un default export de function pour le script. Parce que présentement, ce n'est
  pas simple d'appeler plusieurs fois le même fichier. Ce qui est un peu tanant c'est qu'il faut que je fasse
  node -e "require('some_compiled_file.js')()" au lieu de juste node some_compiled_file.js

  You specify the variables you expect to be given to the partial file with a with block.
  \`\`\`jome
  with
    {title: string}
  end

  return <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title><% title %></title>
    </head>
  </html>
  \`\`\`

  A Jome script is compiled into a function with the parameters described from the with block.

  \`\`\`js
  module.exports = ({title}) => {
    // ...
  }
  \`\`\`
  #run et #load qui font tous les deux la même chose?
  et
  #run! et #load!

  Comment gérer le fichier dynamiquement?

  #load('file.jome')
  #load(nameOfFile)

  Ça ne change rien en fait, c'est juste que ça va être dynamique ou pas. Dans tous les cas je vais faire require sur place
  ou await import sur place.

  FIXMEEEE run avec ESM doit utiliser await import, mais je ne veux pas toujours retourner une valeur async...

  Mais mon trouble là c'est avec les dynamic imports. Mettre ça de côté pour l'instant

  ## Loops

  Loops are used exactly like in javascript, but with the end keyword.

  Nooooooooooo. They are disguting. There is for...in, for...of, it's ugly. I don't even know
  how to use them properly... Check other languages to find a better way.

  Note: There is no do ... while, because the do keyword is used for functions.
  Maybe exec ... while ???

  \`\`\`jome
  for (let el in els)
    // ...
  end

  for (let i = 0; i < list.length; i++)
    // ...
  end

  while (someCondition)
    // ...
  end
  \`\`\`

  <h2 id="nodes">Nodes</h2>

  Nodes are objects in a tree structure. They can have a parent and they can have children.

  You create nodes by using blocks.

  \`\`\`jome
  node = {
    Obj prop1: 'val', prop2: 'val2'
      prop3: 'val3', prop4: 'val4'
      propAndChild1 = 'val5'
      propAndChild2 = 'val6'
  }
  \`\`\`

  \`\`\`jome
  class Node
    def constructor(props: Object)
      set(props)
      this.props = props
    end

    def set(attrs: Object)
      // Assign each entry of the object to 'this'
      for (const key in props)
        if (props.hasOwnProperty(key)) {
          this[key] = props[key];
        }
      end
    end
  end
  \`\`\`

  ### Adding children to nodes
  
  In order to add children to nodes, you can use the << operator.

  \`\`\`jome
  hero.inventory << {[
    Sword damage: 10, weight: 500g
    Shield armor: 8, weight: 400g
    Scroll "Scroll of wisdom"
    Belt
      HealingPotion life: 200
      ManaPotion mana: 100
  ]}
  \`\`\`

  ### Children attached with key

  LES NODES N'ONT PAS DE NOM, MAIS TU PEUX LES ATTACHER AVEC UNE CLÉ À UN PARENT
  QUAND TU ATTACHES UN CHILDREN AVEC UNE CLÉ, il est là ET il est dans la liste de children.
  si tu veux mettre à un attribute, mais pas children, alors utiliser @attr
 
  \`\`\`jome
  $ <<
    someVar: 10
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

  \`\`\`jome
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
  \`\`\`

  return "some val" if someCond

  An if modifier executes everything to it's left only if the condition is true

  An if does not return anything, except in a block. So you can use a block to assing a value conditionally.

  \`\`\`jome
  someVar = {
    if someCond
      "someVal"
    elsif someOtherCond
      "some other val"
    else
      "some default"
    end
  }
  \`\`\`

  Le keyword then peut être utiliser pour mettre la valeur sur la même ligne que la condition

  \`\`\`jome
  someVar = {
    if someCond then "someVal"
    elsif someOtherCond then "some other val"
    else "some default" end
  }
  \`\`\`

  You can use elif, elsif or else if, they are all the same.

  Comment est-ce que ça comporterait un if modifier dans un node block?
  Ça marche pour ajouter des childrens conditionnellement.

  \`\`\`jome
  someVar = {[
    "item1" if someCond
    "item2" if someOtherCond
    "item3 always there"
  ]}
  \`\`\`

  J'aimerais pouvoir utiliser un if modifier dans un string literal.

  someStr = \`Hello{' '+name if name}\`

  Et j'aimerais que dans ce cas, ça retourne automatiquement '' au lieu de undefined ou null

  ## comments

  Use // and /* */ for regular comments.

  Use # for documentation comments. NOTE: It must have a space after the # , otherwise it's a utils.

  \`\`\`jome
  // This is a regular comment

  let foo = 10 # comment after?

   # This is a documentation comment that describes the function below.
   # Second line of same documentation comment.
  with
    arg: string # Documentation comment that describes what this argument is
  def someFunc
    /* TODO: implement this function */
  end
  \`\`\`

  By default, regular comments are discarded when compiled and documentation comments are kept.

  ### Switch / case

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

  ## Classes

  Normal arguments are only available inside the constructor.
  The constructor is everything inside the class before the first def ... end.
  If you use @someArgument, then it will automatically set it for you.

  \`\`\`jome
  class Person(favoriteColor)
    @firstName: string = "John"
    @lastName: string = "Doe"
    @age: number
    @favoriteColor = favoriteColor || 'brown'
  end

  with
    @favoriteColor = 'brown'
  class Person
    @firstName: string = "John"
    @lastName: string = "Doe"
    @age: number
  end

  class Person
    @username: string = "Bigdaddy007" // same as doing @username = "Bigdaddy007" inside the constructor
    @username?: string = "Bigdaddy007" // same as doing @username = #params.username || "Bigdaddy007" inside the constructor
    @usersame // does nothing
    @username // same as doing @username = null inside the constructor
    
    @@className = "Person"
  end
  \`\`\`

  All attributes are public because it is javascript, so no need for attr_reader, attr_accessor...

  \`\`\`jome
  class SomeClass

    super AbstractClass

    attr someAttr = "defaultValue"

    children {[
      DefaultChild "blah"
      DefaultChild "blah"
    ]}
      
    def someMethod |someArg|

    end

  end
  \`\`\`

  ### Methods

  \`\`\`jome
  class SomeClass
    // Multiple lines methods
    def someMethod
      // ...
    end

    // Inline methods
    add10 = x => x + 10

    // Alias
    addTen = add10

    // What about constants? Is this allowed?
    constant = 125 // What does this meannnnnnn??
    @@constant = 125 // Double ampersand! What does this meannnnnnn?!?!

    @token = ... // attached to instance (set in constructor)
    token = ... // attached to prototype
    @@token = ... // static, attached to class

    // SomeClass.constant

    def @@staticMethod
    end
  end
  \`\`\`

  Idée: Quand une classe inhérite d'un interface, mettre les valeurs par défaut dans le prototype.

  ### Inline methods

  Pouvoir définir une méthode sur une seule ligne avec def < funcName > =

  \`\`\`
  class SomeClass
    def inlineMethod = "someText" // Careful here it is a function, not only a string
    // same as
    def inlineMethod
      return "someText"
    end

    def inlineMethod2 = {
      key: 'value'
    }
    // same as
    def inlineMethod2
      return {
        key: 'value'
      }
    end
  end
  \`\`\`

  ### Deconstructings

  I want to be able to name deconstructed arguments in a method. Maybe with keyword as?

  \`\`\`jome
  def example(props as {arg1, arg2})
  end
  \`\`\`

  ### Class arguments

  Class arguments are read-only. They are available from everywhere inside the class, every method not just constructor.

  If you want the value to be set for the instance, use an ampersand before the variable name.

  \`\`\`jome
  class Tag(@name)
  end
  \`\`\`

  \`\`\`js
  class Tag {
    constructor(name) {
      this.name = name
    }
  }
  \`\`\`

  If you want to add everything from an object, what to do then? Keyword include?

  \`\`\`jome
  class Tag(props)
    include props
  end
  \`\`\`

  \`\`\`jome
  class Tag(tag, content)
    def toString = => \`<{tag}{renderHTMLAttrs(@)}>{content||''}{renderHTMLChildren(@)}</{tag}>\`
    def createElem = => createElem(@, tag, content)
  end
  \`\`\`

  \`\`\`jome
  interface TagProps
    foo: bar
  end

  class Tag(props: TagProps) < Node(props)

  end
  \`\`\`

  Qu'est-ce que ça implique de faire ça?

  Qu'est-ce que ça peut vouloir dire:
  - je veux que le premier argument du constructeur soit tag, et setter this.tag = tag
  - je veux avoir accès à tag sans nécessairement le rendre public, encapsulter par une fonction?
  - je veux pouvoir faire tag: tag dans le constructeur.

  No constructor. Constructor code directly inside class.

  ### Inheritence

  WIP

  ### Constructor

  No constructor? If you want to call a method like a constructor, then call it.

  \`\`\`jome
  class SomeClass(options)
    @init()

    def init
      
    end
  end
  \`\`\`

  ### Inject object

  I want to be able to inject an object into an instance. But what syntax to use???

  Keyword include?

  \`\`\`jome
  class ExpressServer(options)

    include options
  end
  \`\`\`

  ## Modules and exports

  There are many ways to export items, but they are all compiled the same. Either using module.exports or export depending on jome config.

  \`\`\`jome
  module
    def someFunc
    end
    let someVar = 10
  end
  \`\`\`

  Compiles to

  \`\`\`js
  module.exports = {
    someFunc: () => {
    },
    someVar: 10
  }
  // or
  export function someFunc() {
  }
  export const someVar = 10
  \`\`\`

  You can give a name to the module, which simply creates an object that holds everything inside.

  \`\`\`jome
  module SomeModule
    def someFunc
    end
    let someVar = 10
  end

  // usage:
  // import {SomeModule} from './some_file.jome'
  // let ten = SomeModule.someVar
  \`\`\`

  You can also export functions and constants individually.

  \`\`\`jome
  export def someFunc
  end
  export let someVar = 10

  // usage:
  // import {someFunc, someVar} from './some_file.jome'
  \`\`\`

  To export the default or an object, use the main keyword. It allows you to return a value from a file.

  \`\`\`jome
  // sum.jome
  main |a, b| => (a + b)

  // usage:
  // import sum from './sum.jome'
  \`\`\`

  ## Interfaces and types

  I find interfaces and types to be confusing in Typescript as someone who does know to language. In order to avoid
  the confusion, you cannot declare an object with type. So you use interface for an object, and type otherwise.

  \`\`\`jome
  interface Dimensions
    width: number
    height: number
  end

  // Alias
  type Dim = Dimensions

  // Unions
  type DimOrStr = Dim | string

  // Tuples
  type DimAndStr = [Dim, string]

  def funcWithDimensions(dim : Dim)
    // ...
  end
  \`\`\`

  ### Inheritence

  You can use < for extending an interface.

   \`\`\`jome
  interface Dim3d < Dimensions
    depth: number
  end
  \`\`\`

  \`\`\`jome
  interface Weapon damage, range end

  // When you inherit from an interface, you can call super on the interface to initialize some values

  // Inheritence and properties
  class Dagger < Weapon(range: 50) end
  class WeakDagger < Dagger(damage: 50) end
  class StrongDagger < Dagger(damage: 200) end
  \`\`\`

  ### Intersection

  You can use intersection to create a type that combines the properties of two interfaces together.

  ### Function types

  You can give a single function signature to a type. You can give function signatures to variables in interfaces.

  \`\`\`jome
  type log = (val: string) => void;

  interface WithLog
    log: (val: string) => void;
  end
  \`\`\`

  For function overloading, you can use unions.

  \`\`\`jome
  type log = (val: string) => void | (val: number) => void;
  \`\`\`

  ### Default values

  Contrary to Typescript, you can add default values in an interface.

  \`\`\`jome
  interface Options
    method: string = 'get'
    ttl: number = 30s
  end
  \`\`\`

  ### Declaration Merging

  By default, you cannot redeclare an interface and it adds to the previous one.

  You have to use another syntax to do this. Maybe interface <

  \`\`\`jome
  interface < Options
    arg: string = 'one more option'
  end
  \`\`\`

  ### Class extends interface

  A class can extend an interface.

  Interface default values will given given to the instance by default in the constructor.

  \`\`\`jome
  class SomeClass(props) < SomeInterface(props)
  end
  \`\`\`

  ### Source for decisions

  https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript

  ### Functions

  \`\`\`jome
  // Utilise la syntaxe comme ruby
  def sayHello
    #log('Hello')
  end

  def sayHelloTo do |name|
    #log(\`Hello! {name}\`)
  end
  \`\`\`

  Je ne veux pas que le user n'aie à faire la distinction entre une fonction et une arrow fonction.
  Trouver une manière de gérer cela.

  ### With keyword

  Usefull to define interfaces of classes and functions.

  \`\`\`jome
  with
    name: String # Full name of the personnellement
  class Person
  end

  with
    x: float # The base value
    y: integer # The factor
  def multiply
  end
  \`\`\`

  This allows easy documentation of the code without having to repeat yourself in the comments.

  It would be nice is there was a short way to start a single line documentation comment.

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

  ### Compile files with different extension

  You can compile files with a different extension by having the preceding extension just before.

  So if you compile some-page.html.jome, it should first create a some-page.html.js, then this
  file can be executed to make some-page.html

  ### .jobj extension

  Files with a .jobj extension would start already in a block.

  It think this would be pratical for example for config files.
  
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

  ## aka or alias

  I want to be able to give many possible names to a parameter.

  For example, the port, it can be 'port' or 'p'

  In js, you have to do:

  \`\`\`js
  let run = ({port, p}) => {
    port = port || p
  }
  \`\`\`

  In Jome, you can simply do:

  \`\`\`jome
  let run = ({port aka p}) => {
    // ...
  }
  \`\`\`

  It will automatically be compiled to the code above.

  ## Strings

  Single and double quotes are to be the same and can be used interchangibly. Like in js and python.

  Backticks are not to be supported for now. I don't know what I what to do with them.

  All string are allowed to be multiline.

  Ideas:
  - "Hello {name}!" // name is interpolated with single {}
  - """Hello {{name}}! Can use single " or double "" inside too!""" // name is interpolated with double {{}}
  - @"Hello {name}! \n not escaped" // verbatim, \ only escapes the quote, no interpolation
  - @"""Hello \ {{name}}!""" // verbatim, \ only escapes the quote, but ALLOWS interpolation with double {{}}
  Maybe:
  - #"Hello #name! How are you #{name}? ##PI is almost 3.1416" // #identifier and #{identifier} are both allowed for interpolation
  - $"Hello \${name}!" // exactly like backticks in js

  Maybe use ' and ''' instead of @" and @"""? In ruby, this is what they do. It's just that I don't think it's that common.
  And honestly I did not know that. @ is more explicit. Otherwise you might think they can be used interchangibly like in python.

  ### Formatting

  Formatting nomenclature:

  x: trim
  s: whole string
  l: line
  i: indent (trim, but keep indentation, check for least amount of spaces before, than trim, spaces and tabs not allowed combined, never with s (string))
  t: tab
  _: space
  j: join (must be at the end of the format. joins all lines with the character after if any, or nothing if ends with j)

  // Explicit characters like \t and \n are not trimmed.
  ""%xs // Trim empty lines at the beginning of the string
  ""%xsx // Trim empty lines at the beginning and the end of the string
  ""%sx // Trim empty lines at the end of the string
  ""%xl // Trim everyline before
  ""%xlx // Trim everyline before and after
  ""%lx // Trim everyline after
  ""%xs%xt // Trim at the beginning of the string and the end of every line
  ""%xl%sx // Trim at the beginning of every line and the end of the string
  ""%i__ // Keep indentation at the beginning of everyline starting with two spaces

  let description = "This is a text description
                     on many lines. It stays many
                     lines but trims beginning.
                    "%xlsx

  let singleLine = "This is written on multiple
                    lines but will all be joined
                    on a single line.
                    "%xlx%j_

  Maybe allow formatting after scripts too? <html></html>%xs

  ### Default string format

  I think I want the default format to be %i%xsx.

  You can use the keyword \`use\` to set a default format for the strings that comes after in the current scope.

  \`\`\`jome
  use %xlx%j_
  let str = "some multi
             line string" // will use the format above
  \`\`\`

  The formats do not add up to each other. When you specify a format, it replaces the previous one.

  Maybe allow to give names to format that you can reuse?

  Or simply numbers?

  set format 0 %xlx%j_

  then you do "some string"%0

  When there is a default format and you want none, use only % like "str"%

  Maybe define single digits aliases myself to be the most commonly used formats. This way you can know what it means without looking
  it up if you are an expert.

  Or maybe define named aliases myself.

  %_html => string like in html, joins the lines with a single space

  Maybe it would be nice if I could modify only some flag instead of all. Let's say, I always want xsx, but only sometimes xl,
  I don't want to have to redefine xsx every time.

  Peut-être quand dans le fond faire que ce sont tous des flags.

  Tu peux faire %s pour reset string settings, %l pour line settings, %s%l%i%j équivalerais à % qui reset tout

  Je ne sais pas pour %i par contre, mais celui n'est pas encore tout à fais clair. Ça garde juste le nested indent?

  Si %i active, comment désactivé?

  <h3 id="verbatim">Verbatim string literals</h3>

  Verbatim string literals are strings that do not interpolate. The idea is taken from C#. But in C# it also includes backslashes without escaping
  them I don't know if I want to do that. Or I want to offer multiple possibilities.
  
  \`\`\`jome
  str = @"This is a string that does \${not} interpolate"
  \`\`\`

  ## Threads

  Exactly the same as JavaScript? await, async, ...

  \`\`\`jome
  async def someMethod
  end

  let someFunc = async () => {x: 1, y: 2}
  \`\`\`

  ## Private

  For private fields inside classes, you can use a private block.
  You can also use the private before a method.

  \`\`\`
  class SomeClass
    private
      def somePrivateMethod
      end
    end

    private def someOtherPrivateMethod
    end
  end
  \`\`\`

  It compiles in javascript using a # before the names of fields.

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

  ### Ternary

  Idée: pas de ternary operator comme d'habitude, parce que je veux pouvoir faire (x ? y) seulement
  sans le :. Le : est très utilisé je trouve. Je n'ai pas tant envie de l'utiliser comme opérateur simple.
  L'idée est donc d'utiliser les opérateurs qui existe déjà, ? et ??.
  x ? y ?? z
  Si x, alors y, sinon z
  D'un côté je n'aime pas dévié d'un standard. ? : est pas mal dans tous les languages, mais d'un autre côté
  je trouve ça vraiment gossant de ne pas pouvoir faire simplement x ? y. Le résultat serait null.
  let r = x ? y // si x, alors y, sinon null
  let r = x if y // si x, alors y, sinon undefined
  let r = \`{x ? y}\` // si x, alors \`{y}\`, sinon \`null\`
  let r = \`{x if y}\` // si x, alors \`{y}\`, sinon \`\` J'aimerais vraiment ça!!!!!!!!!!!!!!

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

  ## TODO

  Faire que this fais toujours référence à un this normal!!! Caché ce défault de javascript de l'utilisateur.

  Peut-être créer un keyword #evt ou quelque chose du genre pour avoir accès au this dans un évènement html.

  Idée: #1, #2, ... fait référence aux arguments d'une fonction. Pas obliger de les déclarer. Ça peut être court comme syntaxe
  pour des filters par exemple.

  \`\`\`jome
  let even = [1,2,3,4,5,6,7,8,9].filter(#1 mod 2)
  \`\`\`

  TODO: Try an idea: -> and => are optional
  \`\`\`jome
  def addXY = |x, y| (x + y)
  [1,2,3,4,5,6,7,8,9].filter(|nb| nb > 5)
  // Et pour quand il n'y a pas d'argument?
  def sayHello = | | (#log("Hello!")) // Noooooon ça c'est laid...
  \`\`\`

  get and set javascript keyword? Allow this in Jome? Or should use ->?

  Je viens d'apprendre qu'il existe le keyword get en javascript qui permet de faire ça.
  Mais l'avantage d'utiliser un -> est que tu peux définir une méthode avec des arguments optionels.
  C'est impossible avec get. (A getter must have exactly zero parameters)

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

  \`\`\`jome
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

  Pouvoir caller une fonction locale comme .#, en utilisant .: ? arg.:funcLocal

  ## bugs

  FIXME: The indentation is super important in markdown. For example, adding tabs inside md scripts, if only one tab html tags will work,
  otherwise it will not.












  # DEPRECATED
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

  Use #params instead of PARAMS?

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


  ### Instantiation

  I would like to create an instance by calling just like a function. SomeClass() // which would become new SomeClass()

  I want to use the new keyword, because it binds this and when you call a function or a class constructor using new, it creates an empty object, sets the object's prototype to the prototype property of the constructor, and executes the constructor to initialize the object.

  The ideal would be to know the type. Basically, when it is local I know what it refers to. The issue is imports. I don't want
  to have to read the files to know what it is.

  Using capital letters is a convention, but I don't want to use this.

  I think the best to have a syntax when importing that differentiates between classes and functions.

  Wait this does not work, because functions can be called and they can be created using new.

  Simply always use new inside blocks?

  ## Work in progress

  identifier // new identifier()
  .identifier // call identifier on the created object
  key: identifier // pass identifier to the constructor as a property of the object
  =identifier // add identifier as a children of the node
  key = identifier // add identifier as a property of the object and as a children

  // if you want to set attributes without passing it to the constructor, you can use:
  .set attr: 'value' // set is a method on Node

  Le désavantage que je vois de faire key: identifier pour une propriété, est que c'est tanant pour le type.
  Avec un = c'est facile rajouter le type. Mais d'un autre côté, est-ce qu'on veut vraiment mettre un type
  là? Ça devrait être assez explicit en général. Et tu peux quand même le faire avec [key: type].

  You can specify dynamic keys using square brackets. Ex: [\`key_{name}\`]

  \`\`\`jome
  {
  Recipe
    name: 'Chickpea balls'
    prepare: 1h
    Ing 1cup, "dry chickpeas"
    Ing 2cup, "water"
    Ing 2tbsp, "parmesan"
    Step \`Put {@1} into {@2}...\` // @1 is the first children
    Step "Mix ..."
    Step "Blah blah ..."
    .prepare 'The recipe'
    Ing ...
  }
  \`\`\`

  \`\`\`jome
  // Three syntaxes allowed to execute functions
  {[
    Obj prop: 'val'
      .execFunc
      .execFunc2

    Obj prop: 'val' exec
      execFunc
      execFunc2

    Obj prop: 'val'
      exec
        execFunc
        execFunc2
  ]}
  \`\`\`

  \`\`\`jome
  // Create a server, add a get handler and start it
  {
    ExpressServer port: 3000 exec
      get '/', |req, res| => (
        res.send(homePage)
      )
      start
  }
  \`\`\`





`);
  return new Webpage("Jome", content).render();
};
