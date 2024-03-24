// Comment séparer 2 code blocks?

let MD_TYPE = 'MD_CELL'
let CODE_TYPE = 'CODE_CELL'
let DATA_TYPE = 'DATA_CELL'

// TODO: Handle escape character \
let RULES = [
  { begin: "//", end: "\n" },
  { begin: "# ", end: "\n" },
  { begin: "/*", end: "*/" },
  { begin: "\"", end: "\"" },
  { begin: "'", end: "'" },
  { begin: "`", end: "`" },
]

//               start             content               end
let MD_RULE = /^(?:###)(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)(?:###)(?:\r\n|\n|$)/
let MD_RULE_REGEX = new RegExp(MD_RULE)

// TODO: Support all of these
// let data1 = <xml>...</xml>
// const data2 = <xml>...</xml>
// var data3 = <xml>...</xml>
// TODO:
// SomeType data4 = <xml>...</xml>
// data5 := <xml>...</xml>

//                                              variable name                          tag name
let DATA_RULE_BEGIN = /^(?:let|const|var)\s+([A-Za-z_$][A-Za-z0-9_]*)\s*=\s*<([_:A-Za-z][A-Za-z0-9\-_\:.]*)>/ // FIXME: Accents
let DATA_RULE_BEGIN_REGEX = new RegExp(DATA_RULE_BEGIN)

function createCell(type, value, data = null) {
  return {type, value, data}
}

function parse(input) {
  let matches = [];

  let code = "";
  for (let i = 0; i < input.length;) {
    let beforeIndex = i
    // Check for rules without regex first
    for (let rule of RULES) {
      if (input.startsWith(rule.begin, i)) {
        let startIndex = i+rule.begin.length
        let endIndex = input.indexOf(rule.end, startIndex);
        code += input.substring(i, (endIndex === -1) ? -1 : (endIndex+rule.end.length))
        i = (endIndex === -1) ? input.length : (endIndex+rule.end.length)
        break;
      }
    }
    if (i === beforeIndex) {
      let sub = input.slice(i)
      // Check for markdown using regexes
      let match = MD_RULE_REGEX.exec(sub);
      if (match) {
        if (code) { matches.push(createCell(CODE_TYPE, code)); code = "" }
        matches.push(createCell(MD_TYPE, match[1]))
        i = i + match[0].length
        continue
      }
      // Check for data tags using regexes
      match = DATA_RULE_BEGIN_REGEX.exec(sub);
      if (match) {
        let wholeMatch = match[0]
        let varName = match[1]
        let tagName = match[2]
        let endRule = `</${tagName}>`
        let startIndex = i+wholeMatch.length
        let endIndex = input.indexOf(endRule, startIndex);
        let inner = input.substring(startIndex, endIndex);
        if (code) { matches.push(createCell(CODE_TYPE, code)); code = "" }
        matches.push(createCell(DATA_TYPE, inner, {tagName, varName}))
        i = (endIndex === -1) ? input.length : (endIndex+endRule.length)
        continue
      }
      code += input[i]
      i++
    }
  }

  if (code && code.length) { matches.push(createCell(CODE_TYPE, code)) }

  // Trim all cells, but don't remove newlines at the very beginning or at the very end?
  matches = matches.map((cell, i) => {
    if (i !== 0 && cell.value[0] === '\n') {
      cell.value = cell.value.slice(1)
    }
    //if (i !== (matches.length-1) && cell.value[cell.value.length-1] === '\n') {
    if (cell.value[cell.value.length-1] === '\n') {
      cell.value = cell.value.slice(0,-1)
    }
    return cell
  })

  return matches;
}

module.exports = {
  parse,
  MD_TYPE,
  CODE_TYPE,
  DATA_TYPE,
}