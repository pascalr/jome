// Example of an example:
// https://github.com/highlightjs/highlight.js/blob/main/src/languages/css.js

export default function(hljs) {
  return {
    case_insensitive: false, // language is case sensitive
    keywords: 'if si class classe export import from',
    contains: [
      {
        scope: 'string',
        begin: '"', end: '"'
      },
      {
        scope: 'string',
        begin: "'", end: "'"
      },
      {
        scope: 'string',
        begin: "`", end: "`"
      },
      {
        className: "comment",
        variants: [
          // JSDOC_COMMENT,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.C_LINE_COMMENT_MODE
        ]
      }
    ]
  }
}