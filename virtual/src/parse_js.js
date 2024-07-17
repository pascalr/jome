const BLOCK_JS = 1
const BLOCK_JOME = 2
const BLOCK_WHITESPACE = 3
const BLOCK_CAPTURE = 4

function extractBlockComment(str) {
  let i, result = "/*";
  for (i = 2; i < str.length && !(str[i] === '*' && str[i + 1] === '/'); i++) {
    result += str[i];
  }
  if (str[i+2] === '\n') {return result+'*/\n'}
  return (i < str.length) ? result+'*/' : result
}

function extractQuote(str) {
  let i, ch = str[0]
  let result = ch;
  for (i = 1; i < str.length && (str[i] !== ch || str[i - 1] === '\\'); i++) {
    result += str[i];
  }
  return (i < str.length) ? result+ch : result
}

function extractSingleLineComment(str) {
  let i, result = "";
  for (i = 0; i < str.length && (str[i] !== '\n'); i++) {
    result += str[i];
  }
  return (i < str.length) ? result+'\n' : result
}

// Split the js code into blocks of different kinds like mardown, source code, data...
function parseJs(code) {
  let parts = [] // {type: ..., value: ...}

  let i = 0;
  let length = code.length;
  let js = ""
  let str;

  while (i < length) {
    // TODO: Template literals
    // strings
    if (code[i] === '"' || code[i] === "'") {
      str = extractQuote(code.slice(i))
      js += str;
      i = i + (str.length || 1);
      continue;
    // commments OR jome block
    } else if (code[i] === '/' && code[i + 1] === '/') {
      str = extractSingleLineComment(code.slice(i))
    // comments or jome block
    } else if (code[i] === '/' && code[i + 1] === '*') {
      str = extractBlockComment(code.slice(i))
    } else {
      js += code[i]; i++; continue;
    }
    // comments OR jome block only executes this code
    if (str[2] === '~') {
      if (js.length) {parts.push({type: BLOCK_JS, value: js}); js = ""}
      parts.push({type: BLOCK_JOME, value: str})
    } else {
      js += str;
    }
    i = i + (str.length || 1);
  }
  if (js.length) {parts.push({type: BLOCK_JS, value: js}); js = ""}

  parts = parts.map(p => {
    if (p.type === BLOCK_JS && /^\s*$/.test(p.value)) {
      return {type: BLOCK_WHITESPACE, value: p.value}
    } else if (p.type === BLOCK_JOME && p.value.slice(2,8) === "~begin") {
      // TODO: Capture nested blocks until the end tag is reached
    }
    return p
  })

  return parts
}

module.exports = {BLOCK_JS, BLOCK_JOME, BLOCK_WHITESPACE, BLOCK_CAPTURE, parseJs}