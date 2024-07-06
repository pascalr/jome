// TODO: Inside an object, scope: "attr" for object keys

const ECMAScript = require('./lib/ecmascript.js')

// Example of an example:
// https://github.com/highlightjs/highlight.js/blob/main/src/languages/css.js
// https://github.com/highlightjs/highlight.js/blob/main/src/languages/ruby.js
// https://github.com/highlightjs/highlight.js/blob/main/src/languages/vbscript-html.js

function ScriptTag(id, name) {
  return {
    begin: `(<${id}>)`, end: `(<\\/${id}>)`,
    beginScope: "tag",
    endScope: "tag",
    subLanguage: name
  }
}

function String(begin, end) {
  return {
    scope: 'string',
    begin, end
  }
}

const highlighter = function(hljs) {

  const regex = hljs.regex;

  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }

  // Source: https://github.com/highlightjs/highlight.js/blob/main/src/languages/javascript.js
  // https://tc39.es/ecma262/#sec-literals-numeric-literals
  const decimalDigits = '[0-9](_?[0-9])*';
  const frac = `\\.(${decimalDigits})`;
  // DecimalIntegerLiteral, including Annex B NonOctalDecimalIntegerLiteral
  // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const CLASS_NAME_RE = regex.either(
    /\b([A-Z]+[a-z0-9]+)+/,
    // ends in caps
    /\b([A-Z]+[a-z0-9]+)+[A-Z]+/,
  )

  const CLASS_DEFINITION = {
    match: [
      /class\s+/,
      CLASS_NAME_RE,
    ],
    scope: {
      1: "keyword",
      2: "title.class",
    },
    // keywords: RUBY_KEYWORDS
  };

  /*const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [ PARAMS ],
    illegal: /%/
  };*/

  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([
        ...ECMAScript.BUILT_IN_GLOBALS,
        "super",
        "import"
      ].map(x => `${x}\\s*\\(`)),
      ECMAScript.IDENT_RE, regex.lookahead(/\s*\(/)),
    className: "title.function",
    relevance: 0
  }

  const NUMBER_PLACEHOLDER = {
    match: [
      /=\s+/,
      /\?\s+\w+(\s*\|\s*\w+)*/,
    ],
    scope: {
      2: "number",
    },
  };
  
  // const CLASS_NAME_WITH_NAMESPACE_RE = regex.concat(CLASS_NAME_RE, /(::\w+)*/)
  const NUMBER = {
    scope: 'number',
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
        `[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },

      // FIXME: Are those below even supported in Jome?

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

  const NUMBER_WITH_UNIT = {
    match: /\d+(\.\d+)?[ \t]*\w+/,
    scope: "number",
  };
  
  const UNIT_OP = {
    match: /·[ \t]*\w+/,
    scope: "number",
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

  const PATH = {
    scope: "string",
    begin: "(#\\.{0,2}/[^ \\(\\)\\,\n\"'`]*)|(#cwd/[^ \\(\\)\\,\n\"'`]*)|(#\\.{1,2})"
  }

  const VARIABLE = {
    scope: "variable",
    begin: '@?\\w+'
  }

  const LITERALS = {
    scope: "literal",
    begin: '\\b(false|true|null)\\b'
  }

  const TYPES = {
    scope: "type",
    begin: '\\b(int|string|float|bool)\\b'
  }

  const KEYWORD = {
    scope: "keyword",
    begin: '\\b(new|chain|with|then|end|if|class|export|import|from|for|in|while|do|def|var|let|code|unit|return|module|interface|main|type|else|elif|elsif)\\b'
  }

  const PROCESSING_INSTRUCTION = {
    scope: "meta",
    begin: /<\?/,
    end: /\?>/,
    contains: [
      String('"', '"'),
      String("'", "'"),
      String('`', '`'),
    ]
  }

  //const CLASS_NAME = {
  //  scope: "title class_",
  //  begin: "[A-Z]\\w*" //    FIXME: not working... begin: "\\p{Lu}\\w*"
  //}

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

  // source: https://github.com/highlightjs/highlight.js/blob/main/src/languages/xml.js
  const TAG_NAME_RE = regex.concat(/[\p{L}_]/u, regex.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u);
  const XML_IDENT_RE = /[\p{L}0-9._:-]+/u;
  const XML_ENTITIES = {
    className: 'symbol',
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  };
  const TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: 'attr',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: 'string',
            endsParent: true,
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [ XML_ENTITIES ]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [ XML_ENTITIES ]
              },
              { begin: /[^\s"'=<>`]+/ }
            ]
          }
        ]
      }
    ]
  };
  const OPEN_TAG = {
    className: 'tag',
    begin: regex.concat(
      /</,
      regex.lookahead(regex.concat(
        TAG_NAME_RE,
        // <tag/>
        // <tag>
        // <tag ...
        regex.either(/\/>/, />/, /\s/)
      ))
    ),
    end: /\/?>/,
    contains: [
      {
        className: 'name',
        begin: TAG_NAME_RE,
        relevance: 0,
        starts: TAG_INTERNALS
      }
    ]
  }
  const CLOSE_TAG = {
    className: 'tag',
    begin: regex.concat(
      /<\//,
      regex.lookahead(regex.concat(
        TAG_NAME_RE, />/
      ))
    ),
    contains: [
      {
        className: 'name',
        begin: TAG_NAME_RE,
        relevance: 0
      },
      {
        begin: />/,
        relevance: 0,
        endsParent: true
      }
    ]
  }

  return {
    case_insensitive: true, // for a test for xml tags
    // case_insensitive: false, // language is case sensitive
    // the language is case sensitive like js, but the highlighter can be case insensitive? Which is faster?
    unicodeRegex: true, // Expresses whether the grammar in question uses Unicode (u flag) regular expressions
    // keywords: {
    //   keyword: 'if si class classe export import from def var let code unit',
    //   literal: 'false true null vrai faux nul oui non yes no'
    // },
    contains: [
      LITERALS,
      // TEST,
      String('"""', '"""'),
      String('"', '"'),
      String("'''", "'''"),
      String("'", "'"),
      String('`', '`'),
      String('@"', '"'),
      {
        scope: "comment",
        variants: [
          // JSDOC_COMMENT,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.C_LINE_COMMENT_MODE,
          hljs.COMMENT('# ', '$',),
          hljs.COMMENT('#\\*', '\\*#',)
          //hljs.COMMENT('###\n', '###\n',)
        ]
      },
      // PATH, FIXME: When unicode is enabled, this makes hljs not working
      TYPES,
      NUMBER_WITH_UNIT,
      PROCESSING_INSTRUCTION,
      UNIT_OP,
      NUMBER,
      NUMBER_PLACEHOLDER,
      CLASS_DEFINITION,
      FUNCTION_CALL, // FIXME: two function calls definitions
      KEYWORD,
      FUNC_CALL, // FIXME: two function calls definitions
      UTIL_CONST,
      UTIL_FUNC,
      OBJ_KEY,
      VARIABLE,
      ScriptTag('jome', 'jome'),
      ScriptTag('js', 'js'),
      ScriptTag('md', 'md'),
      ScriptTag('sh', 'shell'),
      ScriptTag('css', 'css'),
      ScriptTag('html', 'xml'),
      OPEN_TAG,
      CLOSE_TAG,
    ]
  }
}

module.exports = highlighter