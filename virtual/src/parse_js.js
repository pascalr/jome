const BLOCK_JS = 1
const BLOCK_JOME = 2
const BLOCK_WHITESPACE = 3

function extractBlockComment(str) {
  let i, result = "/*";
  for (i = 2; i < str.length && !(str[i] === '*' && str[i + 1] === '/'); i++) {
    result += str[i];
  }
  return (i < length) ? result+'*/' : result
}

function extractQuote(str) {
  let i, ch = str[0]
  let result = ch;
  for (i = 1; i < str.length && (str[i] !== ch || str[i - 1] === '\\'); i++) {
    result += str[i];
  }
  return (i < length) ? result+ch : result
}

function extractSingleLineComment(str) {
  let i, result = "";
  for (i = 0; i < str.length && (str[i] !== '\n'); i++) {
    result += str[i];
  }
  return (i < length) ? result+'\n' : result
}

// Split the js code into blocks of different kinds like mardown, source code, data...
function parseJs(code) {
  let parts = [] // {type: ..., value: ...}

  let i = 0;
  let length = code.length;
  let js = ""

  while (i < length) {
    // TODO: Template literals
    // strings
    if (code[i] === '"' || code[i] === "'") {
      let str = extractQuote(code.slice(i))
      js += str;
      i = i + (str.length || 1);
    // commments OR jome block
    } else if (code[i] === '/' && code[i + 1] === '/') {
      let str = extractSingleLineComment(code.slice(i))
      if (str[2] === '~') {
        if (js.length) {parts.push({type: BLOCK_JS, value: js}); js = ""}
        parts.push({type: BLOCK_JOME, value: str})
      } else {
        js += str;
      }
      i = i + (str.length || 1);
    // comments or jome block
    } else if (code[i] === '/' && code[i + 1] === '*') {
      let str = extractBlockComment(code.slice(i))
      if (str[2] === '~') {
        if (js.length) {parts.push({type: BLOCK_JS, value: js}); js = ""}
        parts.push({type: BLOCK_JOME, value: str})
      } else {
        js += str;
      }
      i = i + (str.length || 1);
    } else {
      js += code[i]; i++
    }
  }
  if (js.length) {parts.push({type: BLOCK_JS, value: js}); js = ""}
  return parts
}

module.exports = {BLOCK_JS, BLOCK_JOME, BLOCK_WHITESPACE, parseJs}