const Webpage = require("../src/webpage.js");
const mdToHtml = require("jome-lib/mdToHtml");
module.exports = () => {
  let content = mdToHtml(`

  # Jome v0.1

  Jome is a language that compiles to JavaScript. It has goodies like CoffeeScript and underscore.js, syntax similar to ruby and it
  has some original features. One day, it will have a node structure like in Godot, types like Typescript, and reactivity like svelte.

  Well that's the idea at least. Right now it is very much in experimental phase. There are a lot of bugs and not many tests are written yet.

  You can read from top to bottom to learn the language, or you can jump to any section if you are only curious.

  ## Overview

  TODO
  
  ## Disclaimer

  The language is very, very young and still contains a log of bugs. I don't recommend using yet for any real project.

  I don't have a list of bugs yet, because there are too many.

  ## Installation

  \`\`\`sh
  # FIXME: NPM PACKAGE IS NOT YET CREATED!
  npm install jome -g
  \`\`\`

  ## Usage

  \`\`\`sh
  # Usage
  jome # executes index.jome in current or ancestor directory
  jome file.jome # execute the given file
  jome server start # pass the arguments "server" and "start" to index.jome executable
  \`\`\`

  ## Hello world
  
  Create a file \`hello.jome\` with the following content:

  \`\`\`jome
  #log "Hello world!" // #log is a shortcut for console.log
  \`\`\`

  Run it with \`jome hello.jome\`

  ### File parameters

  A .jome file is compiled into a function. You can pass arguments to it using the \`with\` keyword.

  Let's modify the file \`hello.jome\`

  \`\`\`jome
  with name end
  #log "Hello {name}!"
  \`\`\`

  The result is
  \`\`\`sh
  jome hello.jome Paul
  # => Hello Paul!
  \`\`\`

  ## index.jome

  The Jome CLI command checks if the first argument is a .jome source file and executes it if so. Otherwise, it will execute index.jome.

  Let's write inside the file \`index.jome\`

  \`\`\`jome
  with cmd, name end

  if cmd === 'hello'
    #log "Hello {name}!"
  end
  \`\`\`

  The result is
  \`\`\`sh
  jome hello Anna
  # => Hello Anna!
  \`\`\`

  ## Creating partials

  .jome files are very practical to write partials. For example, we can write an html navbar we can reuse.

  \`\`\`jome
  with locale end
  return <html>
    <div class="navbar">
      <span class="navbrand" href="#">Jome</span>
      <a href="&lt;%= locale %>/editor">Editor</a>
      <a href="&lt;%= locale %>/">Home</a>
      <a href="&lt;%= locale %>/utils">Utils</a>
      <a href="https://github.com/pascalr/jome">GitHub</a>
    </div>
  </html>
  \`\`\`

  .jome file can be executed from the command line, but they can also be imported inside another .jome file.

  \`\`\`jome
  import navbar from './navbar.html.jome'

  let frenchNavbar = navbar("fr")
  \`\`\`

  ### Read more

  For full details of options, see [passing arguments to files](#pass_args_to_file)

  <h2 id="lang-ref">Language Reference</h2>

  This documentation assumes the reader is familiar with javascript.

  Jome is similar to JavaScript, but there are a few distinctions that you must be aware of.
  - Execution is different: You execute .jome files using the jome CLI.
  - The [syntax](#syntax) is a bit different: It is more similar to the ruby programming language.
  - There are a lot of [builtin functions and constants](#utils). They start with an hashtag (ex: #log is the same as console.log)
  - There are [heredocs](#heredocs) to include code from other languages (html, css, ...) written as xml tags.

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
    #log i
  end
  \`\`\`

  You can create an instance of a class without using the \`new\` keyword, simply call it as a function.

  \`\`\`jome
  class SomeClass end

  let someInstance = SomeClass()
  let otherInstance = new SomeClass() // You can also still use the new keyword
  \`\`\`

  For this to work with imported classes, you add an ampersand before the identifier.

  \`\`\`jome
  import &SomeClass from './some_lib.js'

  let someInstance = SomeClass()
  let otherInstance = new SomeClass() // You can also still use the new keyword
  \`\`\`

  The advantage of this will be more apparent in Jome version 0.2.

  ### Shorthand key syntax

  The short key syntax is different that in javascript, because it could be confusing with children (a feature coming in v0.2). In Jome, it starts with a colon
  \`\`\`jome
  obj = {:content, :value}
  // same as
  obj = {content: content, value: value}
  \`\`\`

  <h2 id="utils">Built-Ins</h2>

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

  ### Chaining methods

  You can execute multiple methods on the same object using the \`chain\` keyword.

  \`\`\`jome
  // Create a server, add a route and start it
  ExpressServer port: 3000 chain
    get '/' do |req, res|
      res.send(homePage)
    end
    start
  end
  \`\`\`

  Chain returns the value of the last command.

  ### Instance properties (@)

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

  I am not yet sure about that one. Maybe symbols with an exclamation mark at the end means true?
  This makes it less confusing and this could allow us to create methods using an exclamation mark at the end.

  \`\`\`jome
  let obj = {:someCond!} // same as {someCond: true}
  \`\`\`

  ## Paths

  The issue with relative paths is that you don't know what they are relative to. In js, in include files,
  the relative path is relative to the current file. If you try to open and write a file, than it is relative
  to the current working directory.

  In Jome, this is more explicit using paths. \`'#./'\` is used for paths relative to current file, '#cwd/' is used for
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

  ## Loops

  Loops are used exactly like in javascript, but with the end keyword.

  Work in progress

  I think I want to support while, and for like in c++. I don't want to support for of and for in because they are confusing I believe.
  Use obj.#keys.#each or arr.#each instead.

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

  ## Conditions

  You can use \`elif\`, \`elsif\` or \`else if\`. They are all the same.

  \`\`\`jome
  if someCond
    doSomething
  elsif someOtherCond
    doSomething
  else
    doSomething
  end
  \`\`\`

  You can also add an if after a statement to make it conditional. The statement will only be executed if the condition is true.

  \`\`\`jome
  return "some val" if someCond
  \`\`\`

  J'aimerais pouvoir utiliser un if modifier dans un string literal.

  someStr = \`Hello{' '+name if name}\`

  Et j'aimerais que dans ce cas, ça retourne automatiquement '' au lieu de undefined ou null

  ## Comments

  Use // and /* */ for regular comments.

  Use # for documentation comments. NOTE: It must have a space after the # , otherwise it's a builtin.

  \`\`\`jome
  // This is a regular comment

  let foo = 10

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
  You pass arguments to the constructor after the class name or before with the \`with\` keyword.

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

  All attributes are public by default. Use the private keyword to make them private. (Not yet implemented)

  ### Methods

  \`\`\`jome
  class SomeClass
    // Multiple lines methods
    def someMethod
      // ...
    end

    // Inline methods
    def add10 = x => x + 10

    // Alias
    def addTen = add10

    // What about constants? Is this allowed?
    constant = 125 // What does this meannnnnnn??
    @@constant = 125 // Double ampersand! What does this meannnnnnn?!?!

    @token = ... // attached to instance (set in constructor)
    token = ... // attached to prototype
    @@token = ... // static, attached to class

    // SomeClass.constant

    def @@staticMethod
    end

    // Noon je ne trouve pas ça tant beau
    // Je préfère utiliser le static keyword

    def static staticMethod
    end
  end
  \`\`\`

  Idée: Quand une classe inhérite d'un interface, mettre les valeurs par défaut dans le prototype.

  ### Inline methods

  Pouvoir définir une méthode sur une seule ligne avec def < funcName > =

  \`\`\`
  class SomeClass
    def inlineMethod = "someText" // Careful here it is a function, not only a string

    def inlineMethod2 = {
      key: 'value'
    }
  end
  \`\`\`

  ### Deconstructings

  I want to be able to name deconstructed arguments in a method. Maybe with keyword as? aka? alias?

  \`\`\`jome
  def example(props as {arg1, arg2})
  end
  \`\`\`

  ### Inheritence

  WIP

  ## Modules and exports

  You can write modules by writing files with the .jomm extension.

  You can export things with the \`export\` keyword.

  \`\`\`jome
  export def someFunc
  end
  export let someVar = 10

  // usage:
  // import {someFunc, someVar} from './some_file.jome'
  \`\`\`

  Use \`export default\` works too.

  FIXMEEEEEEEEEEEEeee: Remove everything I created about the main keyword. Let's use export default instead.

  ### Functions

  \`\`\`jome
  // Utilise la syntaxe comme ruby
  def sayHello
    #log('Hello')
  end

  def sayHelloTo(name)
    #log("Hello! {name}")
  end
  \`\`\`

  The idea in Jome is that you don't have to make the distinction between a function and an arrow function. We'll see if this works.

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

  It would be nice if there was a short way to start a single line documentation comment.

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
`);
  return new Webpage("Jome", content).render();
};
