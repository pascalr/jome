const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let content = mdToHtml(`

  # Jome v-0.2

  What's next to come?

  - Types similar to typescript.
  - A REPL environment like Svelte
  - A language server
  - Nodes, Blocks
  - Units
  - And much more
  - A tutorial to learn the language step by step?

  ## Slim arrow accessor

  To call a method on a object without parameters, you can use an arrow.

  Let's wait for this one. Maybe -> could be used for something else with children or something.

  Because this is not really necessary with the get and set keywords in javascript.

  \`\`\`jome
  obj->density // same as obj.density()
  obj->density = 1.05 // def density=(val) // TODO: WIP
  obj->save
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

  <h2 id="blocks">Blocks V2</h2>

  \`\`\`jome
  // nodes
  node = Obj #{
    someProp: 'obj'
    'String child'
    int prop: 10
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

  ### Work in progress V2

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

  ## Chain inside objects

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

  ## Conditions with blocks

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

  ## Strings

  Ideas:
  - @"Hello {name}! \n not escaped" // verbatim, \ only escapes the quote, no interpolation
  - @"""Hello \ {{name}}!""" // verbatim, \ only escapes the quote, but ALLOWS interpolation with double {{}}
  Maybe:
  - #"Hello #name! How are you #{name}? ##PI is almost 3.1416" // #identifier and #{identifier} are both allowed for interpolation
  - $"Hello \${name}!" // exactly like backticks in js

  ## TODO

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
`);

  return new Webpage("Jome", content).render();
};
