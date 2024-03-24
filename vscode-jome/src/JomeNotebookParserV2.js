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
  { begin: "###", end: "###", type: MD_TYPE },
]

let DATA_RULE_BEGIN = /^<(\w+)>/
let DATA_RULE_BEGIN_REGEX = new RegExp(DATA_RULE_BEGIN)

function createCell(type, value, language = null) {
  return {type, value, language}
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
        if (rule.type) {
          if (code) { matches.push(createCell(CODE_TYPE, code)); code = "" }
          matches.push(createCell(rule.type, input.substring(startIndex, endIndex)))
        } else {
          code += input.substring(i, (endIndex === -1) ? -1 : (endIndex+rule.end.length))
        }
        i = (endIndex === -1) ? input.length : (endIndex+rule.end.length)
        break;
      }
    }
    if (i === beforeIndex) {
      // Check for data tags using regexes
      if (input[i] === '<') {
        let sub = input.slice(i)
        let match = DATA_RULE_BEGIN_REGEX.exec(sub);
        if (match) {
          let wholeMatch = match[0]
          let tagName = match[1]
          let endRule = `</${tagName}>`
          let startIndex = i+wholeMatch.length
          let endIndex = input.indexOf(endRule, startIndex);
          let inner = input.substring(startIndex, endIndex);
          if (code) { matches.push(createCell(CODE_TYPE, code)); code = "" }
          matches.push(createCell(DATA_TYPE, inner, tagName))
          i = (endIndex === -1) ? input.length : (endIndex+endRule.length)
          continue
        }
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