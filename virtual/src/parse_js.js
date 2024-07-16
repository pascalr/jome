const BLOCK_JS = 1
const BLOCK_MARKDOWN = 2
const BLOCK_META_DATA = 3

// TODO: Test this AI generated code
// Split the js code into blocks of different kinds like mardown, source code, data...
function parseJs(code) {
  let parts = [] // {type: ..., value: ...}
  let result = {
    strings: [],
    comments: [],
    code: []
  };

  let i = 0;
  let length = code.length;

  while (i < length) {
    if (code[i] === '"' || code[i] === "'") {
      let quote = code[i];
      let str = quote;
      i++;
      while (i < length && (code[i] !== quote || code[i - 1] === '\\')) {
        str += code[i];
        i++;
      }
      if (i < length) {
        str += code[i];
        i++;
      }
      result.strings.push(str);
    } else if (code[i] === '/' && code[i + 1] === '/') {
      let comment = '';
      while (i < length && code[i] !== '\n') {
        comment += code[i];
        i++;
      }
      result.comments.push(comment);
      if (i < length) {
        comment += code[i];
        i++;
      }
    } else if (code[i] === '/' && code[i + 1] === '*') {
      let comment = '';
      while (i < length && !(code[i] === '*' && code[i + 1] === '/')) {
        comment += code[i];
        i++;
      }
      if (i < length) {
        comment += '*/';
        i += 2;
      }
      result.comments.push(comment);
    } else {
      let codeSegment = '';
      while (i < length && code[i] !== '"' && code[i] !== "'" && !(code[i] === '/' && (code[i + 1] === '/' || code[i + 1] === '*'))) {
        codeSegment += code[i];
        i++;
      }
      if (codeSegment.trim().length > 0) {
        result.code.push(codeSegment);
      }
    }
  }

  return result;
}

module.exports = {BLOCK_CODE: BLOCK_JS, BLOCK_MARKDOWN}