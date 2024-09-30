import { CORE_FORMATS_WIP } from "./formats/core"

export class JomeParser {

  parse(doc) {

    let config = CORE_FORMATS_WIP[doc.extension]
    doc.config = config
    if (!config) {
      // don't know how to detect comments for this file type, push a single code block
      return [{isRaw: true, str: doc.content}]
    }

    let jomeBlocks = []

    for (let i = 0; i < doc.content.length; i++) {

      let str = doc.content.slice(i)

      let contains = config.contains
      contains.forEach(attempt => {

        let match = str.match(new RegExp('^'+attempt.begin))
        if (match) {
          let after = str.slice(match[0].length)
          let endMatch = new RegExp(attempt.end).exec(after)
          let strMatch = str.slice(0, endMatch ? (match[0].length+endMatch.index+endMatch[0].length) : undefined)
          if (attempt.capture) {
            jomeBlocks.push({
              startIdx: i,
              endIdx: i+strMatch.length,
              matchBegin: match[0],
              matchEnd: endMatch[0],
              data: strMatch.slice(match[0].length, -endMatch[0].length)
            })
          }
          i = i+strMatch.length-1 // fixme not sure -1
        }
      })
    }

    if (!jomeBlocks.length) {
      return [{isRaw: true, str: doc.content}]
    }

    let segments = []
    let i = 0
    jomeBlocks.forEach(block => {
      if (i !== block.startIdx) {
        segments.push({isRaw: true, str: doc.content.slice(i, block.startIdx)})
      }
      segments.push({isRaw: false, str: doc.content.slice(block.startIdx, block.endIdx)})
      i = block.endIdx
    })
    if (i != doc.content.length) {
      segments.push({isRaw: true, str: doc.content.slice(i)})
    }

    console.log("Segments found: ", segments)

    return segments
  }
}


// let parser = new JomeParser()
// let segments = parser.parse(jomeDoc.content)
// let children = []
// segments.forEach(segment => {
//   if (segment.isRaw) {
//     children.push(schema.node("paragraph", null, [schema.text(segment.str || "FIXME CAN'T BE EMPTY")]))
//   }
// })
// let topNode = schema.node(schema.topNodeType, null, children)
// return topNode









// function extractBlockComment(doc) {
//   let start = doc.cursor
//   while (doc.cursor < doc.length && !(doc.content.startsWith(doc.config.multiEnd, doc.cursor))) {
//     doc.cursor++
//   }
//   doc.cursor += doc.config.multiEnd.length; // Add the ending or go beyond EOF doesn't matter
//   let whole = doc.content.slice(start, doc.cursor)
//   let inner = whole.slice(doc.config.multiBegin.length, -doc.config.multiEnd.length)
//   pushComment(doc, whole, inner)
// }

// function extractQuote(str) {
//   let i, ch = str[0]
//   let result = ch;
//   for (i = 1; i < str.length && (str[i] !== ch || str[i - 1] === '\\'); i++) {
//     result += str[i];
//   }
//   return (i < str.length) ? result+ch : result
// }

// function pushCurrentCode(doc) {
//   if (doc._currCodeBlock) {
//     doc.parts.push({isRaw: true, str: doc._currCodeBlock})
//     // if (/^\s*$/.test(doc._currCodeBlock)) {
//     //   doc.parts.push({type: BlockType.whitespace, value: doc._currCodeBlock})
//     // } else {
//     //   doc.parts.push({type: BlockType.code, value: doc._currCodeBlock})
//     // }
//     doc._currCodeBlock = ""
//   }
// }

// function pushComment(doc, whole, inner) {
//   // Check if the comment is a code comment or a Jome block.
//   if (inner[0] === '~') {
//     pushCurrentCode(doc)
//     doc.parts.push({isRaw: false, str: inner.slice(1)})
//   } else {
//     doc._currCodeBlock += whole;
//   }
// }

// function extractSingleLineComment(doc) {
//   let start = doc.cursor
//   while (doc.cursor < doc.length && (doc.content[doc.cursor] !== '\n')) {
//     doc.cursor++
//   }
//   doc.cursor++; // Add the newline or go beyond EOF doesn't matter
//   let whole = doc.content.slice(start, doc.cursor)
//   let inner = whole.slice(doc.config.inlineComment.length)
//   pushComment(doc, whole, inner)
// }





// let src = doc.content

// while (doc.cursor < doc.length) {
//   let i = doc.cursor
//   // TODO: Template literals
//   // TODO: Heredocs
//   if ((config.stringDouble && src[i] === '"') || (config.stringSingle && src[i] === "'")) {
//     let str = extractQuote(src.slice(i))
//     doc._currCodeBlock += str;
//     doc.cursor = i + (str.length || 1);
//   } else if (config.inlineComment && src.startsWith(config.inlineComment, i)) {
//     extractSingleLineComment(doc)
//   } else if (config.multiBegin && src.startsWith(config.multiBegin, i)) {
//     extractBlockComment(doc)
//   } else {
//     doc._currCodeBlock += src[i]; doc.cursor++;
//   }
// }
// pushCurrentCode(doc)
// doc.parts = analyzeBlocks(reduceBlocks(doc.parts))
// return doc.parts
// }