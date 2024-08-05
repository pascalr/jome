const configs = {
  js: {
    inline: "//",
    multiBegin: "/*",
    multiEnd: "*/",
    stringSingle: true,
    stringDouble: true,
    stringBacktick: true
  },
  html: {
    multiBegin: "<!--",
    multiEnd: "-->",
    stringSingle: true,
    stringDouble: true,
  },
  css: {
    multiBegin: "/*",
    multiEnd: "*/",
    stringSingle: true,
    stringDouble: true,
  }
}

const BlockType = {
  code: 'code',
  block: 'block',
  md: "md",
  comment: "comment",
  whitespace: 'whitespace',
  capture: 'capture',
}

function extractBlockComment(str, multiBegin, multiEnd) {
  let i, result = multiBegin;
  for (i = multiBegin.length; i < str.length && !(str.startsWith(multiEnd, i)); i++) {
    result += str[i];
  }
  if (str[i+2] === '\n') {return result+multiEnd+'\n'}
  return (i < str.length) ? result+multiEnd : result
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

function analyzeBlocks(blocks) {
  return blocks.map(b => {
    if (b.type === BlockType.block) {
      b.tag = b.value.slice(3).match(/\w+/)[0]
      let s = b.value.trimEnd()
      // FIXME: This assumes always a space after tag name. Correct?
      // Remove */ if present
      b.content = s.substring(4+b.tag.length, s.length - (b.value[1] === '*' ? 2 : 0))
    } else if (b.type === BlockType.capture) {
      b.tag = b.value.slice(9).match(/\w+/)[0]
      let s = b.value.slice(9 + b.tag.length).trimStart().trimEnd()
      try {
        console.log(s)
        let o = JSON.parse(s)
        b.data = o
      } catch (e) {
        console.error(e)
      }
    }
    return b
  })
}

function reduceBlocks(blocks) {
  let reduced = []
  for (let i = 0; i < blocks.length; i++) {
    p = blocks[i] 

    // Converts matching blocks to type whitespace
    if (p.type === BlockType.code && /^\s*$/.test(p.value)) {
      reduced.push({type: BlockType.whitespace, value: p.value})

    // Converts matching blocks to type comment
    } else if (p.type === BlockType.block && p.value.startsWith("/*~!")) {
      reduced.push({type: BlockType.comment, value: p.value})
    } else if (p.type === BlockType.block && p.value.startsWith("//~!")) {
      reduced.push({type: BlockType.comment, value: p.value})

    // Converts matching blocks to type md
    } else if (p.type === BlockType.block && p.value.startsWith("/*~ ")) {
      reduced.push({type: BlockType.md, value: p.value, content: p.value.slice(4,-2)})
    } else if (p.type === BlockType.block && p.value.startsWith("//~ ")) {
      reduced.push({type: BlockType.md, value: p.value, content: p.value.slice(4)})
    
    // Groups blocks between the ~begin and ~end into a capture block
    } else if (p.type === BlockType.block && p.value.slice(2,8) === "~begin") {
      let j = i + 1;
      for (; j < blocks.length; j++) {
        if (blocks[j].value.slice(2,6) === "~end") {break;}
      }
      // FIXME: This does not work for double nested. Not sure if supported yet. We'll see.
      // TODO: Validate that the last is an end tag. This does not work otherwise (will skip the last block I believe)
      reduced.push({type: BlockType.capture, value: p.value, nested: reduceBlocks(blocks.slice(i+1, j))})
      i = j
    } else {
      reduced.push(p)
    }
  }
  return reduced
}

// Split the js code into blocks of different kinds like mardown, source code, data...
function parse(doc) {
  let config = configs[doc.extension]
  if (!config) {throw new Error("No configuration found to parse extension: ", doc.extension)}
  let code = doc.content
  let parts = [] // {type: ..., value: ...}

  let js = ""
  let str;

  while (doc.cursor < doc.length) {
    let i = doc.cursor
    // TODO: Template literals
    // strings
    if ((config.stringDouble && code[i] === '"') || (config.stringSingle && code[i] === "'")) {
      str = extractQuote(code.slice(i))
      js += str;
      doc.cursor = i + (str.length || 1);
      continue;
    // commments OR jome block
    } else if (config.inline && code.startsWith(config.inline, i)) {
      str = extractSingleLineComment(code.slice(i))
    // comments or jome block
    } else if (config.multiBegin && code.startsWith(config.multiBegin, i)) {
      str = extractBlockComment(code.slice(i), config.multiBegin, config.multiEnd)
    } else {
      js += code[i]; doc.cursor++; continue;
    }
    // comments OR jome block only they execute this code
    if (str[2] === '~') {
      if (js.length) {parts.push({type: BlockType.code, value: js}); js = ""}
      parts.push({type: BlockType.block, value: str})
    } else {
      js += str;
    }
    doc.cursor = i + (str.length || 1);
  }
  if (js.length) {parts.push({type: BlockType.code, value: js}); js = ""}

  return analyzeBlocks(reduceBlocks(parts))
}

module.exports = {BlockType, parse}