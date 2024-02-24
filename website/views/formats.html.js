const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let content = mdToHtml(`
  # Formats

  \`\`\`jome
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

  ## Format variables

  Formatting is done at compile time and not at runtime for safety reason (otherwise there could be code injetcion).

  So it is limited what you can do.

  But I'd like that it works if the variable is a string.

  You can use it to read and process files at compile time too.

  \`\`\`jome
  let str = "some, data"
  let data = str as csv
  let data = #./some_data.txt as csv
  let data = "some, data" as csv
  let data = #./some_data.csv as csv
  \`\`\`

  TODO: Deprecate the syntax "Hello,world"%csv
  Use the keyword as or something similar instead.
  I want typecasting to be done using parentheses, not lt and gt and not the keyword as.

  \`\`\`jome
  def foo -> any
    return 10
  end
  let nb = (int) foo()
  // Based on the context I will know if int is a type or something else
  \`\`\`

  ## csv, json, yaml

  These formats are not so usefull inline, but this also means you can easily read them from a file and convert them.

  \`\`\`jome
  let data = #read(#./some_file.csv)%csv
  let data = #read #./some_file.csv |> %csv
  \`\`\`

  ## bin, hex, oct

  You can't declare the same way a binary, hexadecimal or octodecimal number in Jome because it could be confusing with units.

  Instead you use tags.

  \`\`\`jome
  let netmask = <hex>FFFFFF00</hex> // compiles to 0xFFFFFF00
  let flags = <bin>01100101</bin> // compiles to 0b01100101
  let octodecimalNb = <oct>712</oct> // compiles to 0o712
  \`\`\`

  TODO: Rajouter du syntax highligh au hex pour changer de couleur à toute les 2 charactères? Afficher comme des
  string et à tous les 2 charactères mettre comme si escaped string pour que la couleur change un peu.

  ## Html formats

  div, p, input, ... They should all be default tags. By default, they would be printed as is. The tag would be incorporated into the string.

  ## sh

  By default, sh is used for executing shell commands. It is wrapped with \`#execSh\`.

  \`\`\`jome
  let files = <sh>ls .</sh>
  \`\`\`

  Only Linux is supported for now.

  ## Scripting languages

  You can insert code from scripting languages such as ruby, python, lua, ...

  By default the code is executed? How does it work to get the return value from the code?

  Scripting languages list:
  - rb or ruby
  - py or python
  - lua

  ## latex

  TODO: Support LaTeX, but I don't know what to do with this?

  ## Music tabs

  TODO: Rewrite my guitar website with Jome and use tabs!!!

  Tabs for guitar, ukulele, any number of cords?

  \`\`\`jome
  let tab = <guitar-tab>

  </guitar-tab>
  \`\`\`

  TODO

  ## Music chords

  TODO

  ## Music score

  TODO

  ## Lyrics

  TODO

  ## C, C++

  How don't know how that would work, but it would be nice? Would it?

  ## jsx

  create react elements easily!

  ## js

  ## sql

  ## css

  ## html

  ## html.js

  html.js => convert html into js element creation! document.createElement('div')

  ## svg

  ## something for diagrams

  ## something for characters

  ## something for drawings

  ## Chess position

  ## maps

  \<map>An address</map> and it would show a map with this address.

  ## TODO

  MAYBE list:
  - col: For color, need a way to let the editor know that we want to be picking a color.

  TODO: Supporter la syntaxe 123e4 par contre
  let exponentialNumber = 123e4;
  console.log(exponentialNumber); // Outputs: 1230000`);
  return new Webpage("Jome formats", content).render();
};
