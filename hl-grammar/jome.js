// Example of an example:
// https://github.com/highlightjs/highlight.js/blob/main/src/languages/css.js

const highlighter = function(hljs) {

  // Source: https://github.com/highlightjs/highlight.js/blob/main/src/languages/javascript.js
  // https://tc39.es/ecma262/#sec-literals-numeric-literals
  const decimalDigits = '[0-9](_?[0-9])*';
  const frac = `\\.(${decimalDigits})`;
  // DecimalIntegerLiteral, including Annex B NonOctalDecimalIntegerLiteral
  // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    scope: 'number',
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

  // // https://github.com/highlightjs/highlight.js/blob/main/src/languages/ruby.js
  // const VARIABLE = {
  //   // negative-look forward attempts to prevent false matches like:
  //   // @ident@ or $ident$ that might indicate this is not ruby at all
  //   scope: "variable",
  //   begin: '(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])' + `(?![A-Za-z])(?![@$?'])`
  // }

  const VARIABLE = {
    scope: "variable",
    begin: '@?\\w+'
  }

  const KEYWORD = {
    scope: "keyword",
    begin: '\\b(init|attr|parent|exe|then|end|if|si|class|export|import|from|for|in|while|do|def|var|let|code|unit|false|true|null|return|module|interface|main|type|else|elif|elsif)\\b'
  }

  const CLASS_NAME = {
    scope: "title class_",
    begin: "[A-Z]\\w*" //    FIXME: not working... begin: "\\p{Lu}\\w*"
  }

  const UTIL_CONST = {
    scope: "variable",
    begin: '#\\b(PI|env|cwd|argv)\\b'
  }

  const UTIL_FUNC = {
    scope: "title function_",
    begin: '#\\w+'
  }

  const FUNC_CALL = {
    scope: "title function_",
    begin: '\\w+(?=\\()'
  }

  const OBJ_KEY = {
    begin: '\\w+(?=:)'
  }

  // const SCRIPT_TAG_MD = {
  //   begin: '<md>', end: '<\\/md>'
  // }

  const SCRIPT_TAG_SH = {
    begin: '<sh>', end: '<\\/sh>',
    subLanguage: 'shell'
  }

  const SCRIPT_TAG_HTML = {
    begin: '<html>', end: '<\\/html>',
    subLanguage: 'html'
  }

  return {
    case_insensitive: false, // language is case sensitive
    keywords: {
      keyword: 'if si class classe export import from def var let code unit',
      literal: 'false true null vrai faux nul oui non yes no'
    },
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
        scope: "comment",
        variants: [
          // JSDOC_COMMENT,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.C_LINE_COMMENT_MODE
        ]
      },
      NUMBER,
      KEYWORD,
      FUNC_CALL,
      UTIL_CONST,
      UTIL_FUNC,
      OBJ_KEY,
      CLASS_NAME,
      VARIABLE,
      SCRIPT_TAG_SH,
      SCRIPT_TAG_HTML
    ]
  }
}

module.exports = highlighter