const configs = {
  js: {
    inlineComment: "//",
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

function pushCurrentCode(doc) {
  if (doc._currCodeBlock) {
    if (/^\s*$/.test(doc._currCodeBlock)) {
      doc.parts.push({type: BlockType.whitespace, value: doc._currCodeBlock})
    } else {
      doc.parts.push({type: BlockType.code, value: doc._currCodeBlock})
    }
    doc._currCodeBlock = ""
  }
}

function pushComment(doc, whole, inner) {
  // Check if the comment is a code comment or a Jome block.
  if (inner[0] === '~') {
    pushCurrentCode(doc)
    if (inner[1] === '!') { // comment
      doc.parts.push({type: BlockType.comment, value: inner.slice(1)})
    } else if (inner[1] === ' ') { // markdown
      doc.parts.push({type: BlockType.md, value: inner.slice(1)})
    } else { // block
      doc.parts.push({type: BlockType.block, value: inner.slice(1)})
    }
  } else {
    doc._currCodeBlock += whole;
  }
}

function extractSingleLineComment(doc) {
  let start = doc.cursor
  while (doc.cursor < doc.length && (doc.content[doc.cursor] !== '\n')) {
    doc.cursor++
  }
  doc.cursor++; // Add the newline or go beyond EOF doesn't matter
  let whole = doc.content.slice(start, doc.cursor)
  let inner = whole.slice(doc.config.inlineComment.length)
  pushComment(doc, whole, inner)
}

function analyzeBlocks(blocks) {
  return blocks.map(b => {
    if (b.type === BlockType.block) {
      b.tag = b.value.match(/\w+/)[0]
      let s = b.value.trimEnd()
      // FIXME: This assumes always a space after tag name. Correct?
      // Remove */ if present
      b.content = s.substring(4+b.tag.length, s.length - (b.value[1] === '*' ? 2 : 0))
    } else if (b.type === BlockType.capture) {
      b.tag = b.value.slice(6).match(/\w+/)[0]
      let s = b.value.slice(6 + b.tag.length).trimStart().trimEnd()
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

    // Groups blocks between the ~begin and ~end into a capture block
    if (p.type === BlockType.block && p.value.slice(0,5) === "begin") {
      let j = i + 1;
      for (; j < blocks.length; j++) {
        if (blocks[j].value.slice(0,3) === "end") {break;}
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
  doc.config = config
  if (!config) {throw new Error("No configuration found to parse extension: ", doc.extension)}
  let src = doc.content
  let parts = [] // {type: ..., value: ...}

  let code = ""
  let str = "";

  while (doc.cursor < doc.length) {
    let i = doc.cursor
    // TODO: Template literals
    // strings
    if ((config.stringDouble && src[i] === '"') || (config.stringSingle && src[i] === "'")) {
      str = extractQuote(src.slice(i))
      code += str;
      doc.cursor = i + (str.length || 1);
      continue;
    // commments OR jome block
    } else if (config.inlineComment && src.startsWith(config.inlineComment, i)) {
      extractSingleLineComment(doc)
    // comments or jome block
    } else if (config.multiBegin && src.startsWith(config.multiBegin, i)) {
      str = extractBlockComment(src.slice(i), config.multiBegin, config.multiEnd)
    } else {
      code += src[i]; doc.cursor++; continue;
    }
    // comments OR jome block only they execute this code
    if (str[2] === '~') {
      if (code.length) {parts.push({type: BlockType.code, value: code}); code = ""}
      parts.push({type: BlockType.block, value: str})
    } else {
      code += str;
    }
    doc.cursor = i + (str.length || 1);
  }
  if (code.length) {parts.push({type: BlockType.code, value: code}); code = ""}

  pushCurrentCode(doc)

  doc.parts = analyzeBlocks(reduceBlocks(doc.parts))
  return doc.parts
  return analyzeBlocks(reduceBlocks(parts))
}

module.exports = {BlockType, parse}