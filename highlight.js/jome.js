// Example of an example:
// https://github.com/highlightjs/highlight.js/blob/main/src/languages/css.js

export default function(hljs) {

  // Source: https://github.com/highlightjs/highlight.js/blob/main/src/languages/javascript.js
  // https://tc39.es/ecma262/#sec-literals-numeric-literals
  const decimalDigits = '[0-9](_?[0-9])*';
  const frac = `\\.(${decimalDigits})`;
  // DecimalIntegerLiteral, including Annex B NonOctalDecimalIntegerLiteral
  // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: 'number',
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
        `[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },

      // DecimalBigIntegerLiteral
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },

      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },

      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" },
    ],
    relevance: 0
  };

  // https://github.com/highlightjs/highlight.js/blob/main/src/languages/ruby.js
  const VARIABLE = {
    // negative-look forward attempts to prevent false matches like:
    // @ident@ or $ident$ that might indicate this is not ruby at all
    className: "variable",
    begin: '(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])' + `(?![A-Za-z])(?![@$?'])`
  }



  return {
    case_insensitive: false, // language is case sensitive
    keywords: 'if si class classe export import from def var code unit',
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
      },
      NUMBER,
      VARIABLE
    ]
  }
}