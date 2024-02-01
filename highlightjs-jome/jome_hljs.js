// TODO: Inside an object, scope: "attr" for object keys



// Example of an example:
// https://github.com/highlightjs/highlight.js/blob/main/src/languages/css.js

function SCRIPT_TAG(id, name) {
  return {
    begin: `<${id}>`, end: `<\\/${id}>`,
    subLanguage: name
  }
}

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

  // hljs does not seem to support \\1, it seems I have to use on:begin
  // https://highlightjs.readthedocs.io/en/latest/mode-reference.html
  // const TAG = {
  //   scope: "string",
  //   begin: `<\\w+>`, end: `<\\/\\1>`,
  // }

  const VARIABLE = {
    scope: "variable",
    begin: '@?\\w+'
  }

  const KEYWORD = {
    scope: "keyword",
    begin: '\\b(init|attr|with|parent|exec|then|end|if|si|class|export|import|from|for|in|while|do|def|var|let|code|unit|false|true|null|return|module|interface|main|type|else|elif|elsif)\\b'
  }

  const CLASS_NAME = {
    scope: "title class_",
    begin: "[A-Z]\\w*" //    FIXME: not working... begin: "\\p{Lu}\\w*"
  }

  const UTIL_CONST = {
    scope: "built_in.variable",
    begin: '#\\b(PI|env|cwd|argv)\\b'
  }

  const UTIL_FUNC = {
    scope: "built_in.function",
    begin: '#\\w+!?'
  }

  const FUNC_CALL = {
    scope: "title.function.invoke",
    begin: '\\w+(?=\\()'
  }

  const OBJ_KEY = {
    begin: '\\w+(?=:)'
  }

  // const TEST = {
  //   scope: "title class_",
  //   begin: "<html>",
  //   end: `<\\/html>`
  // }

  // const SCRIPT_TAG_MD = {
  //   begin: '<md>', end: '<\\/md>'
  // }

  return {
    case_insensitive: false, // language is case sensitive
    keywords: {
      keyword: 'if si class classe export import from def var let code unit',
      literal: 'false true null vrai faux nul oui non yes no'
    },
    contains: [
      // TEST,
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
          hljs.C_LINE_COMMENT_MODE,
          hljs.COMMENT('# ', '$',)
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
      SCRIPT_TAG('jome', 'jome'),
      SCRIPT_TAG('js', 'js'),
      SCRIPT_TAG('md', 'md'),
      SCRIPT_TAG('sh', 'shell'),
      SCRIPT_TAG('css', 'css'),
      SCRIPT_TAG('html', 'xml'),
      // TAG
    ]
  }
}

module.exports = highlighter