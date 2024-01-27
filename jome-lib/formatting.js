function text(str) {

}

function ltrim(lines) {
  return lines.map(line => {
    let [firstPart, ...parts] = line
    if (typeof firstPart !== 'string') {return line}
    return [firstPart.trimStart(), ...parts]
  })
}

function rtrim(lines) {
  return lines.map(line => {
    let modParts = line[line.length - 1].slice();
    let lastPart = modParts[modParts.length - 1]
    if (typeof lastPart !== 'string') {return line}
    modParts[modParts.length - 1] = lastPart.trimEnd();
    return modLines;
  })
}

function strim(lines) {
  let [firstLine, ...otherLines] = lines
  let [firstPart, ...parts] = firstLine
  if (typeof firstPart !== 'string') {return otherLines}
  return [[firstPart.trimStart(), ...parts], ...otherLines]
}

function etrim(lines) {
  let modLines = lines.slice();
  let modParts = modLines[modLines.length - 1].slice();
  let lastPart = modParts[modParts.length - 1]
  if (typeof lastPart !== 'string') {return lines}
  modParts[modParts.length - 1] = lastPart.trimEnd();
  modLines[modLines.length - 1] = modParts;
  return modLines;
}

function xtrim(lines) {
  return ltrim(rtrim(lines)) // OPTIMIZE: Combine the code of both here.
}

function ytrim(lines) {
  return strim(etrim(lines)) // OPTIMIZE: Combine the code of both here.
}

function trim(lines) {
  return xtrim(ytrim(lines)) // OPTIMIZE: Combine the code of both here.
}

function none(input) { return input }

module.exports = {
  strim, etrim, ltrim, rtrim, xtrim, ytrim, trim, none
}

// function text(str) {

// }

// function ltrim(str) {
//   return str.replace(/\n\s+/g, '\n')
// }

// function rtrim(str) {
//   return str.replace(/\s+(?=\r?\n)/g, '')
// }

// function strim(str) {
//   return str.trimLeft()
// }

// function etrim(str) {
//   return str.trimRight()
// }

// function xtrim(str) {
//   // TODO
//   throw new Error("sfi9snf89234h89f3h4")
//   return str.replace(/\s+(?=\r?\n)/g, '')
// }

// function ytrim(str) {
//   return str.trimRight().trimLeft()
// }

// function trim(str) {
//   throw new Error("sfi9snf89234h89f3hsfd3f0j034")
//   return str.trimRight().trimLeft()
// }

// Les fonctions doivent nécessairement être importer en javascript pour que je puisse faire require dynamiquement et l'utiliser tout de suite?

//let %text = %ltrim%ytrim
//article: %s/\n\s*[^\n]//g

// You can use or define formats to specify how multi strings should be compiled. They start with the symbol `%`.

//   There are many formats builtin:
//   - %text: Trims every line and the beginning and the end of the string.
//   - %article: Joins every line with a space, but keeps empty lines.
//   - %indent: Removes the lowest indentation level everywhere, but keep the nested indentation.
//   - %code: Same as %indent%ytrim
//   - %prepend("  "): Add some string before every lines
//   - %append(";"): Add some string after every lines

  // Je ne peux pas faire %indent avec des regex... J'ai besoin d'une fonction
  // def %indent(str)
  // end

  // Les fonctions de formattage prennent une string en entrée et ressort une autre string.


  // If you define custom formats, it should have at least two characters in the name. Because at some point %a, %b, or any character
  // could be reserved to mean something like %s.

  // You can combine and apply multiple formats one after the other.

  // "str"%trim%clean

  // Possiblité d'avoir des arguments aux formats? Par exemple, %indent(2spaces) or %indent(2tabs)