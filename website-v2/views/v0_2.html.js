const Webpage = require("../src/webpage.js");
const mdToHtml = require("jome-lib/mdToHtml");
module.exports = () => {
  let content = mdToHtml(`

  # Jome v-0.2

  What's next to come?

  - Types similar to typescript.

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

`);
  return new Webpage("Jome", content).render();
};
