const Webpage = require("../src/webpage.js");
const mdToHtml = require("jome-lib/mdToHtml");
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
  \`\`\`
`);
  let content = mdToHtml(`

  # Jome v0.1

  TODO: Check for grammar and vocabulary mistakes! aspell?

  Jome is a language that compiles to JavaScript. It has goodies like CoffeeScript and underscore.js, syntax similar to ruby and it
  has some original features. One day, it will have a node structure like in Godot, types like Typescript, and reactivity like svelte.

  Well that's the idea at least. Right now it is very much in experimental phase. There are a lot of bugs and not many tests are written yet.

  You can read from top to bottom to learn the language, or you can jump to any section if you are only curious.

  <h2 id="overview">Overview</h2>

  TODO
  
  ## Disclaimer

  The language is very, very young and still contains a log of bugs. I don't recommend using yet for any real project.

  I don't have a list of bugs yet, because there are too many.

  <h2 id="install">Installation</h2>

  \`\`\`sh
  # FIXME: NPM PACKAGE IS NOT YET CREATED!
  npm install jome -g
  \`\`\`

  <h2 id="usage">Usage</h2>

  \`\`\`sh
  # Usage
  jome # executes index.jome in current or ancestor directory
  jome file.jome # execute the given file
  jome server start # pass the arguments "server" and "start" to index.jome executable
  \`\`\`

  <h2 id="hello-world">Hello world</h2>
  
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

  <h2 id="index-jome">index.jome</h2>

  The Jome CLI command checks if the first argument is a .jome source file and executes it if so. Otherwise, it will execute index.jome.

  Let's write inside the file \`index.jome\`

  \`\`\`jome
  with cmd, message end

  if cmd === 'say'
    #log message
  end
  \`\`\`

  The result is
  \`\`\`sh
  jome say "Hello Anna!"
  # => Hello Anna!
  \`\`\`

  <h2 id="partials">Partials</h2> 

  .jome files are very practical to write partials. For example, we can write an html navbar we can reuse using a [heredoc](#heredoc).

  \`\`\`jome
  with locale end
  return fba5cdfa4bcb408f641c743519a0fe19
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
    str: string # Documentation comment that describes what this argument is
    nb: number # A multiline description
    # of the arg nb goes below not above
  def someFunc
    /* TODO: implement this function */
  end
  \`\`\`

  By default, regular comments are discarded when compiled and documentation comments are kept.

  ### Shorthand key syntax

  The short key syntax is different that in javascript, because it could be confusing with children (a feature coming in v0.2). In Jome, it starts with a colon
  \`\`\`jome
  obj = {:content, :value}
  // same as
  obj = {content: content, value: value}
  \`\`\`

  <h2 id="builtins">Built-Ins</h2>

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
  #write! 'Some content', to: './somefile.txt', overwrite: true
  \`\`\`

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

  <h3 id="formatting">Formatting v5</h3>

  TODO: The first part of the tag is what is used for syntax highlighting. So for example, html.js, it should highlight like html. .js
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

  You can specify a function to transform strings of the same type using the keywords \`for strings\`.

  \`\`\`jome
  for strings double_quote_multi do |s|
    return s.#ytrim
  end

  // You can specify multiple kinds at once
  for strings double_quote_inline, double_quote_multi do |s|
    
  end
  \`\`\`

  You can specify for:
  - single_quote_inline
  - single_quote_multi
  - double_quote_inline
  - double_quote_multi
  - triple_single_quote
  - triple_double_quote
  - verbatim_double_quote_inline
  - verbatim_double_quote_multi

  You can also specify transform functions for tags using the keywords \`for tags\`.

  \`\`\`jome
  for tags sh do |s|
    #execSh(s)
  end
  \`\`\`

  Is it allowed to use transform functions for data tags such as bin, hex, ...?

  To make this work, let's compile for strings and for tags into functions. And simply wrap the strings with this function every time.

  Let's use j_format_XX as a function name.

  When compiling a string for example and simply trimming both ends, it would be nice to do it at compile time rather than at runtime.

  I am thinking that later functions could be marked as pure, (or deduced to be pure) meaning it has no side effect. Every pure function
  called on a value that has no variable could already be calculated.

  But unfortunately this does not work for for example " Hello {John} ", because of the template literal...

  DO I WANT TO BE ABLE TO APPLY TRIMMING TO THE STRING BEFORE TEMPLATE LITERAL?

  With the keyword chain?

  \`\`\`jome
  for strings double_quote_multi chain #ytrim, #ltrim, do |s|
    return s.#ytrim
  end
  \`\`\`

  I like that!

  But chain is not explicit in meaning that it is done before the interpolation...

  Wait... What exactly is the string given to the function?

  let txt = " Hello {name}! "

  Before interpolation the strings would be given directly transform functions:
  #xtrim would be given " Hello {name}! "

  Maybe use the keyword then and then specify functions that will be called after

  \`\`\`jome
  for strings double_quote_multi chain #ytrim, #ltrim, do |s|
    return s.#ytrim
  end then execSomeFunc1
  \`\`\`

  I really like to use the keyword then, it's just what to do when I don't want to apply anything before?

  \`\`\`jome
  for strings double_quote_inline chain then execSomeFunc1, execSomeFunc2
  \`\`\`

  \`\`\`jome
  for strings double_quote_inline chain then execSomeFunc1, execSomeFunc2 end
  for tags sh chain then execSomeFunc1, execSomeFunc2 end
  // vs
  for double_quote_inline chain then execSomeFunc1, execSomeFunc2 end
  for sh chain then execSomeFunc1, execSomeFunc2 end
  \`\`\`

  I like this. Simply \`for ... chain ... then ... end\`

  ## Calling function left operand

  In the same way that you can do operand.#function, I want to be able to do it with local function as well.

  This would be usefull for formatting strings.

  "some string"%someTransformFunction

  It could be nice for other this too.

  "actual" . equals "expected"
  "actual" % equals "expected"
  "actual" >> equals "expected"
  "actual".(equals) "expected"
  "actual"() equals "expected"
  "actual".|equals "expected"
  
  Je pense que je préfère \`.|\` pour l'instant. J'aime que ce soit un peu similaire à \`.#\`

  ## Shorthand syntax for function calls

  I want a short syntax for function calls like in ruby.

  I am thinking of using the same.

  \`\`\`jome
  let names = people.#each(&:name)
  \`\`\`

  Contrary to ruby, &: does not have any other meaning like defining a block to a symbol. It's just a syntaxic sugar.

  <h3 id="formatting">Formatting v2</h3>

  You can use or define formats to specify how multi strings should be compiled. They start with the symbol \`%\`.

  There are many formats builtin:
  - %text: Trims every line and the beginning and the end of the string.
  - %article: Joins every line with a space, but keeps empty lines.
  - %none: as is. Keeps spacing.
  - %ltrim or %trimLeft: Trims every line at the end.
  - %rtrim or %trimRight: Trims every line at the beginning.
  - %strim or %trimStart: Remove empty lines at the beginning. (or %ttrim for trimTop?)
  - %etrim or %trimEnd: Remove empty lines at the end. (or %btrim for trimBottom?)
  - %ytrim: Remove empty lines at the beginning and at the end.
  - %xtrim: Trims every line 
  - %trim: Trims every line and remove empty lines at the beginning and at the end.
  - %indent: Removes the lowest indentation level everywhere, but keep the nested indentation.
  - %code: Same as %indent%ytrim
  - %prepend("  "): Add some string before every lines
  - %append(";"): Add some string after every lines

  strim: %s/^\s+//
  etrim: %s/\s+$//
  let %ytrim = %strim%etrim
  ltrim: %s/\n\s+/\n/g
  rtrim: %s/\s+(?=\r?\n)//g
  let %xtrim = %ltrim%xtrim
  let trim = %xtrim%ytrim
  let %text = %ltrim%ytrim
  article: %s/\n\s*[^\n]//g

  Je ne peux pas faire %indent avec des regex... J'ai besoin d'une fonction
  def %indent(str)
  end

  Les fonctions de formattage prennent une string en entrée et ressort une autre string.


  If you define custom formats, it should have at least two characters in the name. Because at some point %a, %b, or any character
  could be reserved to mean something like %s.

  You can combine and apply multiple formats one after the other.

  "str"%trim%clean

  \`\`\`
  let str = "
    In the heart of the enchanted forest, a hidden cottage stood, surrounded by ancient trees. 
  The air was filled with the sweet melody of birdsong, creating a tranquil atmosphere.

      As the morning sun filtered through the leaves, a gentle breeze whispered 
      secrets to the dancing leaves below. Nature's symphony played, orchestrating 
      a harmonious blend of sounds that resonated with the soul.

  Inside the cottage, a crackling fireplace provided warmth, casting a soft glow 
  on the worn wooden furniture. The aroma of freshly brewed tea wafted through 
  the air, inviting anyone who entered to linger and embrace the serenity.
  "
  \`\`\`

  TODO: Faire un example que tu cliques sur chacun des boutons pour voir la différence de chaque format. Comme ça: https://developer.mozilla.org/en-US/docs/Web/CSS/cursor

  You add a formatting to strings by appending it right after. \`let str = "hello"%text\`

  You can also define a default format for strings using the keyword with. \`with %text\`

  You can also create custom formats. Create a function take takes lines, an array, and returns a string.

  \`\`\`jome
  def %txt(lines)
    return lines.map(l => l.trim()).join(' ')
  end
  \`\`\`

  Possiblité d'avoir des arguments aux formats? Par exemple, %indent(2spaces) or %indent(2tabs)

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

  No interpolation inside jome paths?

  Paths always use the /, but maybe they are converted when compiling for Windows?

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
`).replace("fba5cdfa4bcb408f641c743519a0fe19", PARTIAL);
  return new Webpage("Jome", content).render();
};
