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

  let content = mdToHtml(`

  TODO: I am thinking of using test_compile.jomn as a notebook and use that as a reference for the language.
  Don't include all the very specific tests, but globals tests would be very nice to explain what the language does,
  and this would avoid repeating myself.

  <h2 id="lang-ref">Language Reference</h2>

  This documentation assumes the reader is familiar with javascript.

  Jome is similar to JavaScript, but there are a few distinctions that you must be aware of.
  - Execution is different: You execute .jome files using the jome CLI.
  - The [syntax](#syntax) is more permissive. You can have a syntax like javascript or something similar to the ruby programming language.
  - You can use a default library. Functions and constants become available using the hashtag. TODO
  - There are [heredocs](#heredocs) to include code from other languages (html, css, ...) written as xml tags.

  <h2 id="syntax">Syntax - WIP</h2>

  The idea is to support a lot of syntaxes so you can choose the one you prefer. Ideally, the editor would show you the
  code as you like it and save it in the format used by the organisation.

  Currently, the only supported syntax is using the \`end\` keyword. Later, a colon at the end of a line with indentation would
  be supported. Curly braces would be supported too.

  One thing which can be nice is to alternate between two syntax at every nesting level so it's easier to know where you are.

  \`\`\`jome
  class Person
    sayHello() {
      console.log 'Hello!'
    }
  end
  \`\`\`

  Would be the same as:

  \`\`\`jome
  class Person {
    def sayHello
      console.log 'Hello!'
    end
  }
  \`\`\`

  Or put this in advanced?
  In advanced I should detail ALL the available syntax (a little like mozilla for javascript)

  void doSomething() { /* ... */ }
  def doSomething /* ... */ end
  fn doSomething() { /* ... */ }
  function doSomething() { /* ... */ }
  let doSomething = () => { /* ... */ }
  let doSomething = => { /* ... */ }

  ### Function calls

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

  You can use a colon prefix to insert an entry in the object with the name of the variable as the key.

  \`\`\`jome
  let name = "Luc"
  sayHello :name // same as sayHello({name: name}) or sayHello({name})
  \`\`\`

  You can use a colon prefix with an exclamation mark at the end to make a boolean entry equal true.

  \`\`\`jome
  doWrite "Some text", to: "./someFile.txt", :force! // same as force: true
  \`\`\`

  You can use \`do\` ... \`end\` syntax at the end of a function call to pass a function as a parameter.
  The syntax is similar to ruby. You pass arguments between vertical bars.

  \`\`\`jome
  import * from 'jome-lib'
  [1,2,3,4,5].#each do |i|
    #log i
  end
  \`\`\`

  ### Piping

  You can write the input to a function call to the left by using the operators \`:.\`, \`|>\` or \`.#\`

  \`.#\` refer to built-in functions which are always available. The other two will use local functions or global ones
  defined in the file \`config.jome\`.

  The difference between \`:.\` and \`|>\` is the precedence. \`:.\` has the highest precedence same as \`.\`

  \`\`\`jome
  import * from 'jome-lib'
  obj.#keys.#filter(k => k[0] === 'p').#each do |k|
    // ...
  end

  "john":.upcase:.reverse // upcase and reverse here are local or global functions

  ["1","2","3"]:.reverse.join(" ") |> console.log

  "john" |> String.upcase |> String.reverse
  \`\`\`

  Piping allows to write in a functional way more easily.

  It's up to the user to choose between using .# or :.. By default in Jome it is using .# because it does not collide names.

  A good rule of thumb would be to use .# for utils you don't use often and use :. for utils you use often and that you
  don't mind the name being global.

  ## Implicit return for tags

  If the last expression of a function or a file is a tag, it is implicitely returned.

  \`\`\`jome
  def render
    let name = "Marc"
    <html>
      <div><p>Hello {name}!</p></div>
    </html>
  end
  \`\`\`

  \`\`\`jome
  // Last expression of a file
  <css>
    .someClass {
      color: red;
    }
  </css>
  \`\`\`

  ## TODO: Move this somewhere else with tags

  There is no default for tags. You must specify how to handle them.

  You can treat them simply as a string. You can allow interpolation using curly braces \`{variable}\` or using \`<% = variable %>\`

  You can parse tags as xml or not.

  ## config.jome

  You can use config.jome to pretty much define your own programming language.

  You can choose what are the global variables and functions available in this file (sin, cos, PI, or map, filter, ...)

  You can also choose how to handle strings and tags.

  Jome imports inside config.jome should be jome files inside a /utils folder or similar. It should be separated from
  the rest of the code, because it is different in the way that it does not have access to config.jome globals because
  it is being compiled.

  Parameters allowed:

  - main: The main file to be executed. index.jome by default.
  - globals: A list of global variables or functions available everywhere.
  - formats: Define how to handle strings and tags
  - units: WIP

  ## Functions

  You can use \`do ... end\` to create functions. You pass arguments between vertical bars.

  \`\`\`jome
  import * from 'jome-lib'
  [1,2,3,4,5].#each do |i|
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

  The advantage of this will be more apparent in latter Jome versions.

  <h3 id="keywords">Keywords</h3>

  Here are the Jome keywords that are different than javascript:
  - [with](#with): An alternative way to describe parameters
  - [end](#end): Replaces curly braces for statement blocks
  - [elif](#elif): Same as \`else if\`
  - [elsif](#elsif): Same as \`else if\`
  - [chain](#chain): Allows to call multiple methods on the same instance and return the last.
  - [private](#private): Comming soon...
  - [along](#along): Comming soon...
  - [code](#code): Comming soon...
  - [unit](#unit): Comming soon...
  - [type](#type): Comming soon...
  - [interface](#interface): Comming soon...

  <h3 id="comments">Comments</h3>

  You can use regular js comments with \`//\` and \`/* */\`.

  You can also use \`# \` for documentation comments. Note: The hashtag must be followed by a space.

  \`\`\`jome
  // This is a regular comment

  # This is a documentation comment that describes the function below.
  # Second line of same documentation comment.
  # @returns Some value
  with
    string str # Documentation comment that describes what this argument is
    number nb # A multiline description
    # can continue under

    # A multiline description
    # of the arg total
    float total
  def someFunc
    /* TODO: implement this function */
  end
  \`\`\`

  By default, regular comments are discarded when compiled and documentation comments are kept.

  ### Shorthand key syntax

  WIP: I want to support like in js too. But also :variable too.

  I've want {} to be a regulvar js object after all. Use #{} or {[]} for nodes.

  The short key syntax is different that in javascript, because it could be confusing with children (a feature coming in v0.2). In Jome, it starts with a colon
  \`\`\`jome
  obj = {:content, :value}
  // same as
  obj = {content: content, value: value}
  \`\`\`

  Also, this allows you to pass a variable as a named parameter to a function.
  
  \`\`\`jome
  someFunc :someArg // same as someFunc({someArg})
  \`\`\`

  ## Assignment - TODO WIP

  let x = 10 // yes
  int x = 10 // yes, string, float, ... works too
  x := 10 // maybe, same as let
  x ::= 10 // maybe, same as const?
  var x = 10 // probably
  const x = 10 // probably
  Foo foo = Foo("arg") // no, use instead: let foo = Foo("arg")

  ## Types

  TODO: Supporter les 2 syntaxes, c'est pas ben ben plus compliqué et ça laisse le choix à l'utilisateur.

  def sum(x: int, y: int) -> int
  def sum(int x, int y) -> int

  The types are specified before the variable name like in C++ or Java, not after like in typescript.

  You can declare primitive types directly, but you still use the keyword \`let\` for class instances. (You can't do it like c++ because it would be confused with function calls)

  \`\`\`jome
  int i = 0
  string str = "some string"
  let any = "some string"
  let obj = SomeClass("param")
  \`\`\`

  When the type is ambiguous, or you prefer to be explicit, you can cast it like so:

  \`\`\`jome
  let name = (Name) getName(10)
  let someName = (Array\<SomeClass>) \[SomeClass(10)]
  \`\`\`

  Inside function arguments, it's the same thing. The type comes before the variable name.

  \`\`\`jome
  def someFunction(int count, string message)
    // ...
  end

  with
    int count # the count
    string message # a message
  def someFunction
    // ...
  end
  \`\`\`

  I want to do the same for function types too. They replace the keyword def. This syntax uses curly braces instead of end keyword.
  A def with no args does not require parentheses, but this syntax does.

  \`\`\`jome
  int sum(int x, int y) {
    // ...
  }
  int add(int x, int y) {return x + y}

  class SomeClass
    int someMethod(int x, int y) {
      // ...
    }
    void doSomething() {
      // ...
    }
  end
  \`\`\`

  If I am to allow this syntax, then might as well allow no type in front

  \`\`\`jome
  class SomeClass
    doSomething() {
      // ...
    }
  end
  \`\`\`

  \`\`\`jome
  class SomeClass {
    def doSomething
      // ...
    end
  }
  \`\`\`

  \`\`\`jome
  def soSomething : int

  end
  \`\`\`

  How does it work for instance variables initialization? Works well

  \`\`\`jome
  class SomeClass

    int @count = 0
    string @message = "Hello world!"

  end
  \`\`\`

  TODO: Type of function signature for callbacks and al

  \`\`\`jome
  def doSomething((void => int) callback)
  \`\`\`

  You cannot use curly braces with the \`with\` keyword. You use def.
  The return type is given after the \`return\` keyword.

  \`\`\`jome
  with
    int x # Number 1
    int y # Number 2
    return int
  def add

  end
  \`\`\`

  Or maybe the return type is given using a fat arrow?

  \`\`\`jome
  with
    int x # Number 1
    int y # Number 2
    => int # The sum of number 1 and 2
  def add

  end
  \`\`\`

  Or maybe the return type is given using a colon?

  \`\`\`jome
  with
    int x # Number 1
    int y # Number 2
  def add : int # The sum of number 1 and 2

  end
  \`\`\`

  TODO: tuple, templates

  \`\`\`jome
  string[] names = ["John", "Mary"]
  Array<string> names = ["John", "Mary"]
  SomeContainer<string> container()

  class SomeContainer<T>
    T[] @list;
  end
  \`\`\`

  I want Jome by default to be very permissive. You can then add rules to restrain for being more standard or more secure.

  So if you are working on a personal project, you can use whatever style you prefer.

  If you are working on a shared project or in a company, you should use a linter so the code is more standard.

  I like to have both curly braces and end keyword. Personally, I think I prefer a mixture of both. At each indentation,
  change. This way it is easier to know where you are.

  <h2 id="strings">Strings</h2>

  They are many kinds of quotes in Jome that should handle every use case. There is:
  - Single quotes: Rendered as is. \`let code = 'if (cond) {return 0;}'\`
  - Triple single quotes: Rendered as is. Allows to insert single quotes inside the string.
  - Double quotes: Allows template literals. Insert content using curly braces. \`"Hello {name}!"\`
  - Triple double quotes: Allows template literals. Insert content using double curly braces. \`"""Hello {{name}}!"""\`
  - Verbatim strings (@): Render the string as is without escaping. \`let windowsPath = @"C:\Users\Pascal\Documents\File.txt"\`. Verbatim strings can be used with any of the kinds above. Interpolation will work for double quoted strings.

  Backticks are not supported for now. It's not yet decided how to handle them.

  TODO: Support them, just not interpolation yet because I don't know which interpolation I want to be able to use.

  Note: All strings are allowed to be multiline.

  In order to have consistency, strings shall always be compiled into strings. For example, if you compile to ruby, than backtick strings shall be converted
  to double quote strings because executing shell commands this way is not allowd in Jome. Use < sh > tags for that instead.

  Similarly, single quote strings compiled to c++ will be using double quote strings so that it is a valid string.

  <h3 id="formatting">Formatting v5</h3>

  TODO: The first part of the tag is what is used for syntax highlighting. So for example, html-js, it should highlight like html. -js
  is just a postfix that means compile a certain way

  You can format all kinds of strings and tags by using the syntax \`forall <tag_name> chain func1[, func2] wrap func3[, func 4] end\`.

  The functions given to wrap are added arround the final string and executed at runtime.

  The functions given to chain modify the raw string itself at compile time. They can even convert the strings into raw javascript code.

  The input and the output of chain functions are of the same type. They take an array of lines. And each like is an array of strings or TemplateLiteral.

  For example, the js tag takes a string in input and simply output it all into javascript code.

  FIXME: FIX THE CODE BELOW BECAUSE ONLY JS IMPORTED FUNCTIONS ARE ALLOWED. DO ... END is not allowed.
  This is because what if there are strings inside the jome function of other things it could become
  a loop nightmare.

  \`\`\`jome
  forall js
    chain do |lines|
      // First validate that every line contains only a string. Template literals are not allowed in a js tag.
      if !lines.every(line => line.length === 1 && line.type === 'string')
        throw new Error("Template literals are not allowed in a js tag.")
      end
      // Convert all the string into a single TemplateLiteral
      return TemplateLiteral(lines.map(l => l[0]).join('\n'))
    end
  end
  \`\`\`

  The chain functions must be imported javascript functions.

  Chain function are given the parameter lines, and another parameter ctx or something, that allows to including other files at the top of the file.

  Or it returns either lines, an array of array, or an instance of TagWithContext that returns lines and the files required to include.

  Wait what about \<% %> is this allowed. A heredoc is a string literal so it does not make sense here? I don't really think it makes
  any sense really...

  ## Content tag percent syntax

  You can define heredoc with xml tags, but you can also simply prepend a percent followed by the tag name.

  \`\`\`jome
  let isTrue = <txt>Hello</txt> === "Hello"%txt
  \`\`\`

  The difference is that you won't get syntax highlighting for things like html, css, etc. But you will at least get syntax highlighting
  for template literals properly.

  TODO: You can use percent formating after variable name too:

  \`\`\`
  content%txt === <txt>\<%= content %></txt>
  \`\`\`

  Possiblité d'avoir des arguments aux formats? Par exemple, %indent(2spaces) or %indent(2tabs)

  ## Config save

  Jome is by default opiniated and provide a lot of default of a lot of formats. They will change over time as librairies or opinions change.

  To make sure it works properly and it is not confusing what it does, every format used will be stored inside config.jome.

  When a new format is encountered in the source code, it is added to config.jome automatically, and librairies that need to be installed
  will be installed automatically.

  The goal is that it is really easy to do advanced stuff. For example, no need to use create-react-app or anything complicated. If you
  want a single page of your big application to use react, that use a react format and it will magically work.

  It keeps a snapshot of the formats used and allows to easily know what a format does, just look it up inside config.jome.

  ### For more info on tags/formats

  See the [formats page](/formats).

  <h3 id="formatting">Formatting v3</h3>

  You can specify for:
  - single_quote
  - double_quote
  - triple_single_quote
  - triple_double_quote

  ## Calling function left operand

  In the same way that you can do operand.#function, I want to be able to do it with local function as well.

  This would be usefull for formatting strings.

  "some string":.someTransformFunction

  :.

  ## Shorthand syntax for function calls

  I want a short syntax for function calls like in ruby.

  I am thinking of using the same.

  \`\`\`jome
  let names = people.#each(&:name)
  \`\`\`

  Contrary to ruby, &: does not have any other meaning like defining a block to a symbol. It's just a syntaxic sugar.

  Or

  \`:.\` could work for this too? When it has no operand, then it returns a functions that calls it on the object.
  I don't know... I don't like it too much because it's very different. :. get a function by this name, here it is
  an object property...

  \`\`\`jome
  let names = people.#each(:.name)
  \`\`\`

  <h3 id="verbatim">Verbatim string literals</h3>

  Verbatim string literals are strings that do not interpolate. The idea is taken from C#. But in C# it also includes backslashes without escaping
  them I don't know if I want to do that. Or I want to offer multiple possibilities.
  
  \`\`\`jome
  str = @"This is a string that does \${not} interpolate"
  \`\`\`

  <h2 id="heredocs">Heredocs</h2>

  In jome, the idea is that you could include most other programming languages directly using xml tags.

  \`\`\`jome
  // Execute a shell command in a script
  <sh>ls -A</sh>

  // Ruby is a pretty nice language for scripts too 
  <rb>puts (1..10).select(&:even?).sum</rb>
  \`\`\`

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

  ### Substitutions

  You can insert stuff after the transformers using \`\<%s varName %>\`. Under the hood, a hash is created for varName, it is inserted into the string
  and it is substituted after the transformers are called.

  TODO: Find a syntax to allow the same thing, but for strings. \`"Hello {%s name}"\`?

  <h3 id="paths">Paths</h3>

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

  TODO: Interpolation inside path

  \`\`\`
  let filename = 'foo.txt'
  let filepath = #./some/dir/{filename}
  \`\`\`

  Paths always use the /, but maybe they are converted when compiling for Windows?

  <h3 id="req_file_handlers">Require file handlers</h3>

  Work in progress

  You can process files using the syntax: \`#(./some_file.txt)\`

  The default file handlers are:
  - *.js, js: Same as the function \`require\`
  - *.jome, jome: Compiles the file, use \`require\` and run jome file

  \`\`\`jome
  let data = #("./some_data.json")
  let lib = #("./some_lib.js") // same as require('./some_lib.js')
  let result = #("./some_command.jome")
  \`\`\`

  You can use the keyword as to using another string as a matching string instead of the filename

  \`\`\`jome
  let data = #(./some_data as "json")
  \`\`\`

  How about let's say an image?

  \`\`\`jome
  let img = #(./some_img.jpg)
  \`\`\`

  Well in that case instead of using require, you could define a custom file handler.

  \`\`\`jome
  let img = #(./some_image.png)
  // Here it could be compiled for example to:
  const PNG = require('png-js');
  let img = new PNG('some_image.png');
  \`\`\`

  You can pass arguments to the file handlers. For jome files, they will be given to the file for example.

  \`\`\`jome
  let result = #(./some_command.jome, "someArg")
  \`\`\`

  <h3 id="include_file_handlers">Include file handlers</h3>

  Read the give file and insert the content as a string to the js file.

  \`\`\`jome
  let data = #...("./some_data")
  \`\`\`

  ### Jome global object

  Create a global object jome, much like window, to contain jome specific data.

  Maybe jome object would be the way to be language agnostic.

  Create an API that people can use. So for example, you do jome.log instead of console.log, this way it works when compiling to python it would use print.

  jome.evt => refers to this inside an event
  jome.window => refers to the window
  jome.params; Deprecated?
  jome.env // to set environment variables (process.env in js)
  jome.global => to set global variables (globalThis in js)

  You can also use the configuration file config.jome to define global variables or functions. See [config.jome](#config-jome).

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

  Use jome.evt to get current event
  Use window or jome.window to get the window

  FIXME: This clashes with decorators. But it can still work too I believe. Decorators are before class and method definitions. Attribute accessors are inside.

  See https://www.sitepoint.com/javascript-decorators-what-they-are/ to learn decorators.

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

  For of is usefull to loop through a string and handle unicode surrogate pairs

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
    @username?: string = "Bigdaddy007" // same as doing @username = jome.params.username || "Bigdaddy007" inside the constructor
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

  ### Inline methods - TODO WIP

  Pouvoir définir une méthode sur une seule ligne avec def < funcName > =

  \`\`\`
  class SomeClass
    def inlineMethod = "someText" // Careful here it is a function, not only a string

    def inlineMethod2 = {
      key: 'value'
    }
  end
  \`\`\`

  ### Deconstructings - TODO WIP

  I want to be able to name deconstructed arguments in a method. Maybe with keyword as? aka? alias?

  \`\`\`jome
  def example(props as {arg1, arg2})
  end
  \`\`\`

  ### Inheritence

  WIP

  ## Modules and exports - TODO WIP

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

  I want to be more explicit.

  import foo from 'bar'

  Does it mean import the default, or it means import all of it? Logically it's the default only.

  But let's say I export using cjs. I export only a function of a class. I don't want to have to do
  import * as foo from 'bar'

  Alternatives?

  import as foo from 'bar'
  const foo = require('bar')
  require foo from 'bar'
  import 'bar' in foo
  import 'bar' as foo

  I like:
  \`\`\`jome
  import 'bar' as foo
  import 'index.jome' as foo
  \`\`\`

  I don't know. Maybe I actually prefer simply require like before...
  \`\`\`jome
  const execute = require('execute.jome')
  const &Webpage = require('webpage.jome')
  \`\`\`

  I think I got it! Using a colon, this means import like using require.
  I don't like the colon. Use the keyword of instead.

  \`\`\`jome
  import &Webpage : './webpage.jomm'
  import build : 'build.jome'
  import {trim, flat} : '@jome/core'
  \`\`\`

  ### Functions - TODO WIP

  \`\`\`jome
  // Utilise la syntaxe comme ruby
  def sayHello
    console.log('Hello')
  end

  def sayHelloTo(name)
    console.log("Hello! {name}")
  end
  \`\`\`

  The idea in Jome is that you don't have to make the distinction between a function and an arrow function. We'll see if this works.

  ### With keyword

  The \`with\` keyword is used to list function arguments.
  
  It can be standalone in a .jome file which means they are arguments that can be given to the file function.
  
  \`\`\`jome
  import * from 'jome-lib'
  with src, dest end
  #cp src, dest
  \`\`\`
  
  It can be used along the \`def\` keyword to specify the function arguments.
  This allows easy documentation of the code without having to repeat yourself in the comments.

  \`\`\`jome
  with
    string name # The name
    int count # The count
  def doSomething : int
    // ....
  end
  \`\`\`
  
  It can also be used to specify the arguments the constructor of a class takes.

  \`\`\`jome
  with
    name: String # Full name of the personnellement
  class Person
  end
  \`\`\`
  
  ## along keyword - TODO WIP

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

  ## Base library

  Every project can choose a base library. This library should contain common utility functions and constants.

  For example:

  \`\`\`jome
  // Using lodash as a base library
  import * from 'lodash'

  // Then you get access to all the named exports by prepending an hashtag symbol before.
  #partition([1, 2, 3, 4], n => n % 2)
  // → [[1, 3], [2, 4]]

  // You can also use the hashtag operator (.#) to put the first operand before instead of after.
  { 'a': 1 }.#defaults({ 'a': 3, 'b': 2 })
  // → { 'a': 1, 'b': 2 }
  \`\`\`

  Using multiple import like this is not allowed because it would be annoying to know where the function is coming from and this avoids name conflicts.

  If you want multiple import, then create a file or library and join the import and export them.

  \`\`\`
  export * from 'ThingA';
  export * from 'ThingB';
  export * from 'ThingC';
  \`\`\`

  Ouin, finalement ce n'est pas super, parce que ce n'est pas plus clair ainsi, c'est juste un truc de plus... mais bon cette syntaxe est déjà accepté donc c'est OK

  ## Capture de code - TODO WIP

  TODO

  Je pense que la syntaxe que je veux est d'utiliser le type 'code'.

  \`\`\`jome
  def debug = |msg along code| => (
    console.log(code+':', msg)
  )
  debug(nomDeVariable) // => console.log("nomDeVariable:", nomDeVariable)

  // When calling in javascript, you need to supply both arguments
  debug(nomDeVariable, "nomDeVariable")
  \`\`\`

  ## aka or alias - TODO WIP

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

  ## Threads - TODO WIP

  Exactly the same as JavaScript? await, async, ...

  \`\`\`jome
  async def someMethod
  end

  let someFunc = async () => {x: 1, y: 2}
  \`\`\`

  ## Private - TODO WIP

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

  ### Ternary - TODO WIP

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

  ## Chaining methods

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

  ## Notebook like jupyter

  Jome code can be used to create notebooks like jupyter.

  You can use the .jomn extension to denote that the file is expected to be opened as a notebook.

  ### Markdown cells

  You can create markdown cells by surrounding the content with an hashtag and a star \`#* This is a *markdown* cell *#\`.

  Note: ### is deprecated. Starting and ending with three hastags alone on a line is deprecated because it's confusing when you don't know if it's a start or an end.

  \`\`\`jome
  #*
  This is a markdown cell
  ### This level 3 title
  Below is the ending
  *#
  \`\`\`

  ### Code cells

  Not all code cells are executed.

  TODO: What keyword to use to mean that it should be executed???

  \`\`\`jome
  cell
    // ...
  end

  script
    // ...
  end

  code
    // ...
  end
  \`\`\`

  ### Data cells

  Jome introducte the idea of data cells in a notebook.

  The idea is that you should be able to enter data in a spreadsheet like format in the notebook.

  TODO: Explain that tags are data cells, and that right now I am simply abusing the markdown cells

  ### Collapsed code cells

  There should also be collapsed by default code cells. For example for imports. If you click on it, you should see it.
  But you could also that it is collapsed by default.

  But I want to be able to search for it though... CTRL+F should find text hidden inside the collapsed cell. Not sure if that is possible in the browser...

  Ah yes, maybe simply make is small and scrollable, but when it gains focus, it becomes bigger! This should work with CTRL+F!

  ### with blocks

  Idea: A with block should be showned in a notebook like documentation on the web. It should be pretty, and the script code below would
  be the content of the function of class.

  ## Bugs

  TODO: Link to BUGS.md

  ## Contributing

  I recommend using visual studio code for now because it is super usefull for debugging tokenization. You hit Ctrl+Shift+P,
  "inspect editor token and scope", and you see if it is correct. Also you see using syntax highlighting.

  You can make pull requests on github.

  You can simply make constructive comments on github.

  Keep in mind I am working only 10 hours a week on this project for now.

  ## Acknowledgements

  - CoffeeScript: I was kinda lost at some point. I did not have a clear direction for my language. Until I thought, hey, coffeescript did something similar! So it gave me a lot of guidance.
  - underscore.js: A great library full of goodies.
  - vscode: Escpecially thank you for creating custom grammar. It is really nice to create a grammar and see live the tokenization.
  - ChatGPT: I probably never would have had to courage to go through with writing a programming language if I did not have the help from ChatGPT.

  Thank you to everyone who contributed to any open-sourced library. Escpecially under a license like MIT license. You are awesome!

  Librairies used:
  - [express](https://expressjs.com/)
  - [markdown-it](https://github.com/markdown-it/markdown-it)

  ## TODO

  TODO: Check for grammar and vocabulary mistakes! aspell?
  TODO: config.jome > md > spellcheck: true, I want to see mistakes within vscode.

  TODO: args are passed space separated instead of comma separated
  --args with dashes near each other are grouped together

  TODO: Error handly. Try catch...

  ## Other

  .jomd extension is used to store data in the Jome language. The only difference with .jome, is that the last line of code is returned implicitely. If you use
  a .jome and use return on the last line, it is the same thing. NOT THE ONLY DIFFERENCE, SEE BELOW, DIFFERENT FOR IMPORT TOO, IMPORT IS DATA, NOT FUNCTION...

  Wait, what about, import someData from './some_file.jomd', here I would expect someData to be some data, but it's a function because it is the same thing
  as .jome... Or maybe when doing this, call the function directly.

  But for #('./some_file.jomd') it works with this syntax.
  let someData = #('./some_file.jomd')



  

  Tags are simply always xml tags. C'est parfait. C'est mieux que JSON, parce que ça fait la distinction entre attribute et enfant.

  L'éditeur se charge de les afficher pour que ce soit beau.

  \`\`\`jome
  let html = <Recipe
    name="Recipe name"
    portions=5
  >
    <ing qty="100mL" name="water"/>
    <ing qty="100g" name="sugar"/>
  </Recipe>
  \`\`\`
`);

  return new Webpage("Jome", content).render();
};
