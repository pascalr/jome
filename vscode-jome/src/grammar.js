const fs = require('fs');
const path = require('path');

// TODO: Instead of defining name: meta.....jome, simply add id to syntax automatically if it has type, but no name
// This simply makes it easier to debug.

// TODO: Move this in a separate package that can be used by both jome and vscode-jome

// TODO: Use \\p{L} ?
// Use [:alnum:] ?
const REGEX_CLASS_NAME = "[A-Za-z_$]\\w*" // FIXME: Accents
// FIXME: REGEX_CLASS_NAME and REGEX_VARIABLE should be the same otherwise the patterns must be modified
// I don't know if they are the same, but I think so.
const REGEX_VARIABLE = "[A-Za-z_$][A-Za-z0-9_]*" // FIXME: Accents
const REGEX_PROPERTY = `\\.${REGEX_VARIABLE}` // .property

const REGEX_PATH_CHARS = "[^ \\(\\)\\,]*"

const REGEX_XML_NAME = "[_:A-Za-z][A-Za-z0-9\\-_\\:.]*"

const REGEX_PRIMITIVE_TYPE = "\\b(?:int|string|bool|float)\\b(?:\\[\\])*" // FIXME: Accents

const REGEX_TYPE = "[A-Za-z_$]\\w*(?:\\<\\w+\\>)?(?:\\[\\])*" // FIXME: Accents

const LOOKAHEAD_FUNC_CALL_WIP = "(?!\\:)(?!\\s*([\\+\\-\\*\\/\\|\\^\\=\\,\\.]|\\)|&&|\\!=|\\!==|$|%|;|along|chain|end|\\}|\\?|\\[|\\]))"

// const LOOKBEHIND_DECLARATION = "(?<=\n|^|;)\\s*"
// const LOOKAHEAD_DECLARATION = "\\s*(?=\n|$|;|=)"

// // If the regex containing this regex has no group, then group number is 1.
// // Otherwise, you have to add 1 for every group before this one.
// function REGEX_INLINE_STRING(groupNumber=1) {
//   return `(['"\`])(.*?)\\${groupNumber}`
// }
const REGEX_REGULAR_STRING = "\"[^\"]*\"|'[^']*'" // FIXME: Allow backticks and escaped quotes

function PATTERN_SCRIPT(name, sourceTagName) {
  // FIXME: Fix all this... Make it like #tag, not #script
  return {
    //begin: `\\<(${REG_XML_NAME_2}\\.${name})(\\s+|\\w+|\\w+\\s*=\"[^\"]*\")*\\>`,
    begin: `\\<(${REGEX_XML_NAME}?\\.${name}|${name})(\\s+|\\w+|\\w+\\s*=\"[^\"]*\")*\\>`,
    end: `\\<\\/\\1\\>`,
    beginCaptures: { 0: { patterns: [{ include: "#script-params" }] } },
    endCaptures: { 0: { patterns: [{ include: "#tag-end" }] } },
    name: `meta.tag.jome`,
    contentName: "raw",
    patterns: [{ include: sourceTagName }]
  }
}

function PATTERN_STRING(type, name, symbols, templateStartSymbols, templateEndSymbols) {
  let patterns = [{ include: "#escape-char" }]
  if (templateStartSymbols) {
    patterns.push({
      strict: true,
      type: "TEMPLATE_LITERAL",
      name: "meta.string-template-literal.jome",
      begin: templateStartSymbols,
      beginCaptures: { 0: { name: "punctuation.definition.template-expression.begin.jome" } },
      end: templateEndSymbols,
      endCaptures: { 0: { name: "punctuation.definition.template-expression.end.jome" } },
      patterns: [{ include: "#expression" }]
    })
  }
  // TODO: strict: true, this will remove escape-char and punctuations
  return {
    type, name, patterns,
    begin: `${symbols}`,
    beginCaptures: { 0: { name: "punctuation.definition.string.begin.jome" } },
    end: `${symbols}`,
    endCaptures: { 0: { name: "punctuation.definition.string.end.jome" } },
  }
}

let grammar = {
  "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
  name: "Jome",
  scopeName: "source.jome",
  fileTypes: [
    ".jome",
    ".jomm",
    ".jomn"
  ],
  patterns: [
    {include: "#statement"},
    {include: "#expression"}
  ],
  repository: {
    "import-identifier": {
      patterns: [
        { match: `&${REGEX_CLASS_NAME}`, name: "entity.name.class.jome", type: "CLASS_REFERENCE" },
        { include: "#variable" }
      ]
    },
    statement: {
      patterns: [
        {
          type: "MD_CELL", // Markdown cell (for notebook like jupyter)
          strict: true,
          name: "meta.md-cell.jome",
          begin: `^(###)(\r\n|\n|$)`,
          beginCaptures: {
            1: { name: "punctuation.definition.tag.md-cell.begin.jome" },
          },
          end: "^(###)(\r\n|\n|$)",
          endCaptures: {
            1: { name: "punctuation.definition.tag.md-cell.end.jome" },
          },
          patterns: [{ include: "text.html.markdown" }] // OPTIMIZE: stylePatterns only
        },
        {
          type: "IMPORT",
          strict: true,
          name: "meta.statement.import.jome",
          begin: `^(import) ?(&?${REGEX_VARIABLE})?`,
          beginCaptures: {
            1: { name: "keyword.control.jome" },
            2: {
              type: "DEFAULT_IMPORT",
              name: "variable.other.default-import.jome",
              patterns: [{ include: "#import-identifier" }]
            }
          },
          end: "\r\n|\n|$",
          patterns: [
            { match: "\\s+" },
            {
              name: "meta.namespace-import.jome",
              match: `(\\*) (as) (&?${REGEX_VARIABLE})`,
              captures: {
                1: { name: "constant.language.import-export-all.jome" },
                2: { name: "keyword.control.jome" },
                3: {
                  type: "NAMESPACE_IMPORT",
                  name: "variable.other.namespace-import.jome",
                  patterns: [{ include: "#import-identifier" }]
                }
              }
            },
            {
              name: "meta.import-file.jome",
              // TODO: deprecate the colon, it is ugly
              match: `(from|\\:|of) (${REGEX_REGULAR_STRING})`,
              captures: {
                1: { name: "keyword.control.jome", type: "IMPORT_STYLE" },
                2: { name: "string.quoted.jome", type: "IMPORT_FILE" }
              }
            },
            {
              name: "meta.named-imports.jome",
              begin: "\\{",
              end: "\\}",
              patterns: [
                {
                  type: "ALIAS_IMPORT",
                  name: "meta.import-alias.jome",
                  match: `(&?${REGEX_VARIABLE}) (as) (${REGEX_VARIABLE})`,
                  captures: {
                    1: {
                      name: "variable.other.readwrite.jome",
                      patterns: [
                        { include: "#import-identifier" }
                      ]
                    },
                    2: { name: "keyword.control.jome" },
                    3: { name: "variable.other.readwrite.alias.jome", type: "VARIABLE" }
                  }
                },
                {
                  type: "ALIAS_IMPORT",
                  name: "meta.import-alias.jome",
                  match: `(${REGEX_REGULAR_STRING}) (as) (${REGEX_VARIABLE})`,
                  captures: {
                    1: { name: "string.quoted.jome", type: "STRING" },
                    2: { name: "keyword.control.jome" },
                    3: { name: "variable.other.readwrite.alias.jome", type: "VARIABLE" }
                  }
                },
                {
                  type: "NAMED_IMPORT",
                  name: "variable.other.named-import.jome",
                  match: `&?${REGEX_VARIABLE}`,
                  patterns: [{ include: "#import-identifier" }]
                },
                { include: "#comma" },
                { include: "#block-comment" },
              ]
            }
          ]
        }
      ]
    },
    expression: {
      strict: false,
      patterns: [
        { include: "#comment" },
        { include: "#if_block" },
        { include: "#interface" },
        { include: "#class" },
        { include: "#symbols" },
        { include: "#format" },
        { include: "#function" },
        { include: "#do_end" },
        { include: "#trycatch" },
        { include: "#for-tag" },
        { include: "#chain-bloc" },
        { include: "#type_def" },
        { include: "#regex" },
        { include: "#keywords" },
        { include: "#with-args" },
        { include: "#vbars-args" },
        { include: "#def" },
        { include: "#paren-expression" },
        { include: "#strings" },
        { include: "#scripts" },
        { include: "#tag" },
        { include: "#arrow" },
        { include: "#constants" },
        { include: "#declaration" },
        { include: "#function_call" },
        { include: "#caller" }, // ->something
        { include: "#state-var" },
        { include: "#getter" }, // .something, ?.something
        { include: "#operators" },
        // { include: "#parameter" },
        { include: "#attribute" },
        { include: "#square-bracket" },
        { include: "#inline-utility" },
        { include: "#utilities" },
        { include: "#support-items" },
        { include: "#variable" },
        { include: "#block-array" },
        { include: "#code_block"},
        { include: "#block"},
        { include: "#semicolon" }, // ;
        { include: "#comma" }, // ,
      ]
    },
    // TODO: Add all available in js here
    "support-items": {
      patterns: [
        {
          type: "VARIABLE",
          name: "support.variable.jome",
          match: "\\b(console|window|global|document|__dirname|__filename|JSON)\\b"
        },
        {
          type: "VARIABLE",
          name: "support.class.jome",
          match: "\\b(Array|Error)\\b"
        }
      ]
    },
    keywords: {
      patterns: [
        {
          name: "keyword.control.inline-conditional.jome",
          match: "\\b(if|si)\\b"
        },
        {
          name: "keyword.control.main.jome",
          match: "\\b(main)\\b"
        },
        {
          name: "keyword.control.return.jome",
          match: "\\b(return)\\b"
        },
        {
          name: "keyword.control.throw.jome",
          match: "\\b(throw)\\b"
        },
        {
          name: "keyword.operator.new.jome",
          match: "\\b(new)\\b"
        },
        {
          name: "keyword.control.trycatch.jome",
          match: "\\b(try|catch|finally)\\b"
        },
        {
          name: "keyword.control.flow.jome",
          match: "\\b(await)\\b"
        },
        {
          name: "storage.modifier.async.jome",
          match: "\\b(async)\\b"
        },
        {
          name: "keyword.control.jome",
          match: "\\b(yield|while|for|return|include|from|import|ret|retn|export|await|async|default|interface)\\b"
        },
        {
          name: "keyword.operator.typeof.jome",
          match: "\\b(typeof)\\b"
        },
        {
          name: "keyword.other.debugger.jome",
          match: "\\b(debugger)\\b"
        }
      ]
    },
    comma: { match: ",", name: "punctuation.separator.delimiter.jome" },
    semicolon: { match: ";", name: "punctuation.terminator.statement.jome" },
    symbols: {
      patterns: [
        {
          type: "SYMBOL_TRUE",
          match: `:${REGEX_VARIABLE}\\!`,
          name: "variable.symbol.true.jome"
        },
        {
          type: "SYMBOL",
          match: `:(${REGEX_VARIABLE})`,
          name: "variable.symbol.jome"
        },
      ]
    },
    arrow: {
      name: "keyword.arrow.jome",
      match: "=>| -> "
    },
    "vbars-args": {
      strict: true,
      name: "meta.args.jome",
      begin: "\\|(?!\\|)",
      beginCaptures: { 0: { name: "punctuation.vertical-bar.begin.jome" } },
      end: "\\|",
      endCaptures: { 0: { name: "punctuation.vertical-bar.end.jome" } },
      patterns: [
        { include: "#argument_v2" },
        { include: "#along" },
        { include: "#expression" }
      ]
    },
    "with-args": {
      /* type: 'ARGUMENTS' */
      name: "meta.with-args.jome",
      begin: "with",
      beginCaptures: { 0: { name: "keyword.control.jome" } },
      end: "\\b(end|(?=def)|(?=class)|(?=main)|(?=export))\\b",
      endCaptures: { 0: { name: "keyword.control.jome" } },
      patterns: [
        { include: "#argument" },
        { include: "#along" },
        { include: "#expression" }
      ]
    },
    "paren-args": {
      strict: true,
      name: "meta.args.jome",
      begin: "\\G\\(",
      beginCaptures: { 0: { name: "punctuation.paren.open" } },
      end: "\\)",
      endCaptures: { 0: { name: "punctuation.paren.close" } },
      patterns: [
        { include: "#argument_v2" },
        { include: "#along" },
        { include: "#expression" }
      ]
    },
    declaration: {
      strict: true,
      patterns: [
        {
          type: "DECLARATION",
          name: "meta.declaration.jome",
          match: `(${REGEX_PRIMITIVE_TYPE})\\s+(${REGEX_VARIABLE})`,
          captures: {
            1: { name: "storage.type.jome", type: 'TYPE' }, // primitive type
            2: { name: "variable.other.jome", type: 'VARIABLE' }
          }
        },
        {
          type: "DECLARATION",
          name: "meta.declaration.jome",
          match: `\\b(let|var|const)\\b\\s*(${REGEX_VARIABLE})?(?:\\s*(\\:)\\s*(${REGEX_PRIMITIVE_TYPE}))`,
          captures: {
            1: { name: "keyword.control.declaration.jome", type: 'KEYWORD_DECLARATION' },
            2: { name: "variable.other.jome", type: 'VARIABLE' },
            3: { name: "punctuation.colon.jome" },
            4: { name: "storage.type.jome", type: 'TYPE' } // primitive type
          }
        },
        {
          type: "DECLARATION",
          name: "meta.declaration.jome",
          match: `\\b(let|var|const)\\b\\s*(${REGEX_VARIABLE})?(?:\\s*(\\:)\\s*(${REGEX_TYPE}))?`,
          captures: {
            1: { name: "keyword.control.declaration.jome", type: 'KEYWORD_DECLARATION' },
            2: { name: "variable.other.jome", type: 'VARIABLE' },
            3: { name: "punctuation.colon.jome" },
            4: { name: "entity.name.type.jome", type: 'TYPE' } // custom type
          }
        },
        {
          type: "DECLARATION",
          name: "meta.declaration.jome",
          match: `(${REGEX_TYPE})\\s+(?!\\b(?:chain|do)\\b)(${REGEX_VARIABLE})\\s*(?=\n|;)`,
          captures: {
            1: { name: "entity.name.type.jome", type: 'TYPE' }, // custom type
            2: { name: "variable.other.jome", type: 'VARIABLE' }
          }
        },
      ]
    },
    def: {
      strict: true,
      type: 'FUNCTION',
      name: "meta.def.jome",
      begin: `\\b(def)\\s*(${REGEX_VARIABLE})?\\b\\s*`,
      beginCaptures: {
        1: { name: "keyword.control.jome", type: 'FUNCTION_STYLE' },
        2: { name: "entity.name.function.jome", type: 'FUNCTION_NAME' }
      },
      end: "(\\bend\\b)|((?<!\\s)\\:\\s)",
      endCaptures: {
        1: { name: "keyword.control.jome" },
        2: { name: "punctuation.section.function.begin.jome", type: 'BEGIN_SECTION' }
      },
      patterns: [
        { include: "#paren-args" },
        { include: "#expression" }
      ]
    },
    "chain-bloc": {
      name: "meta.chain.jome",
      begin: "\\b(chain)\\b\\s*",
      beginCaptures: { 1: { name: "keyword.control.jome" } },
      end: "\\b(end)\\b",
      endCaptures: { 1: { name: "keyword.control.jome" } },
      patterns: [{ include: "#expression" }]
    },
    do_end: {
      strict: true,
      type: "DO_END",
      name: "meta.do-end.jome",
      begin: "\\b(do)\\b\\s*",
      beginCaptures: { 1: { name: "keyword.control.jome" } },
      end: "\\b(end)\\b",
      endCaptures: { 0: { name: "keyword.control.jome" } },
      patterns: [
        { include: "#vbars-args" },
        { include: "#expression" }
      ]
    },
    function: {
      strict: true,
      type: "FUNCTION",
      name: "meta.function.jome",
      begin: `\\b(function|fn)\\b\\s*(${REGEX_VARIABLE}(?=\\())?\\s*`,
      beginCaptures: {
        1: { name: "keyword.control.jome", type: 'FUNCTION_STYLE' },
        2: { name: "entity.name.function.jome", type: 'FUNCTION_NAME' }
      },
      end: "(\\bend\\b)|(?:(?<=\\))(?=\\s*\\{))",
      endCaptures: { 1: { name: "keyword.control.jome" } },
      patterns: [
        { include: "#paren-args" },
        { include: "#expression" }
      ]
    },
    if_block: {
      patterns: [
        {
          strict: true,
          type: "IF_BLOCK",
          name: "meta.if-block.jome",
          begin: "(?:^|\\G)\\s*\\b(if)\\b",
          beginCaptures: { 1: { name: "keyword.control.conditional.jome" } },
          end: "(\\bend\\b)|((?<!\\s)\\:\\s)|(?=(?:\\belse\\b))|(?=(?:\\belif\\b))|(?=(?:\\belsif\\b))",
          endCaptures: {
            1: { name: "keyword.control.jome" },
            2: { name: "punctuation.section.function.begin.jome", type: 'BEGIN_SECTION' }
          },
          patterns: [{ include: "#expression" }]
        },
        {
          strict: true,
          type: "ELSIF_BLOCK",
          name: "meta.elsif-block.jome",
          begin: "\\b((else if)|(elsif)|(elif))\\b",
          beginCaptures: { 1: { name: "keyword.control.conditional.jome" } },
          end: "(\\bend\\b)|((?<!\\s)\\:\\s)|(?=(?:\\belse\\b))|(?=(?:\\belif\\b))|(?=(?:\\belsif\\b))",
          endCaptures: {
            1: { name: "keyword.control.jome" },
            2: { name: "punctuation.section.function.begin.jome", type: 'BEGIN_SECTION' }
          },
          patterns: [{ include: "#expression" }]
        },
        {
          strict: true,
          type: "ELSE_BLOCK",
          name: "meta.else-block.jome",
          begin: "\\b(else)\\b",
          beginCaptures: { 1: { name: "keyword.control.conditional.jome" } },
          end: "(\\bend\\b)|((?<!\\s)\\:\\s)",
          endCaptures: {
            1: { name: "keyword.control.jome" },
            2: { name: "punctuation.section.function.begin.jome", type: 'BEGIN_SECTION' }
          },
          patterns: [{ include: "#expression" }]
        }
      ]
    },
    trycatch: {
      patterns: [
        {
          name: "meta.try-block.jome",
          begin: "\\b(try)\\b\\s*\\{",
          beginCaptures: { 1: { name: "keyword.control.trycatch.jome" } },
          end: "\\}(?!\\s*catch)(?!\\s*finally)",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "meta.catch.jome",
          begin: `\\b(catch)\\b\\s*(?:\\(\\s*(${REGEX_VARIABLE})\\)\\s*)?\\s*\\{`,
          beginCaptures: {
            1: { name: "keyword.control.trycatch.jome" },
            2: { name: "variable.other.exception.jome" }
          },
          end: "\\}",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "meta.finally.jome",
          begin: "\\b(finally)\\b\\s*\\{",
          beginCaptures: { 1: { name: "keyword.control.trycatch.jome" } },
          end: "\\}",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "meta.trycatch.jome",
          begin: "\\b(try)\\b",
          beginCaptures: { 1: { name: "keyword.control.trycatch.jome" } },
          end: "\\b(end)\\b",
          endCaptures: { 0: { name: "keyword.control.jome" } },
          patterns: [{ include: "#expression" }]
        },
      ]
    },
    type_def: {
      patterns: [
        {
          name: "meta.type_def.jome",
          match: "\\b(type)\\b\\s*(\\w*)\\s*=\\s*((\\s*[\\|\\&]?\\w*)*)",
          captures: {
            1: {
              name: "keyword.control.jome"
            },
            2: {
              name: "entity.name.type.jome", // custom type
              type: "TYPE"
            },
            3: {
              patterns: [
                {
                  match: "\\w+",
                  name: "support.type.jome",
                  type: "TYPE"
                }
              ]
            }
          }
        },
        {
          name: "meta.type_def.jome",
          begin: "\\b(type)\\b(\\w*)",
          beginCaptures: {
            1: {
              name: "keyword.control.jome"
            },
            2: {
              name: "entity.name.type.jome", // custom type
              type: "TYPE"
            }
          },
          end: "\\b(end)\\b",
          endCaptures: {
            0: {
              name: "keyword.control.jome"
            }
          },
          patterns: [{ include: "#expression" }]
        }
      ]
    },
    class: {
      patterns: [
        {
          name: "meta.class.jome",
          begin: `\\b(class)\\b\\s*(${REGEX_CLASS_NAME})?\\s*(\\{)`,
          beginCaptures: {
            1: { name: "keyword.control.jome" },
            2: { name: "entity.name.type.class.jome" },
            3: { name: "punctuation.definition.block.begin.jome" }
          },
          end: "\\}",
          endCaptures: { 0: { name: "punctuation.definition.block.end.jome" } },
          patterns: [{ include: "#expression" }]
        },
        {
          name: "meta.class.jome",
          begin: `\\b(class)\\b\\s*(${REGEX_CLASS_NAME})?`,
          beginCaptures: {
            1: { name: "keyword.control.jome" },
            2: { name: "entity.name.type.class.jome" }
          },
          end: "\\b(end)\\b",
          endCaptures: { 0: { name: "keyword.control.jome" } },
          patterns: [{ include: "#expression" }]
        }
      ]
    },
    interface: {
      name: "meta.interface.jome",
      begin: "\\b(interface)\\b\\s*([a-zA-Z_]\\w*)",
      beginCaptures: {
        1: { name: "keyword.control.jome" },
        2: { name: "entity.name.type.interface.jome" }
      },
      end: "\\b(end)\\b",
      endCaptures: { 0: { name: "keyword.control.jome" } },
      patterns: [
        { include: "#argument" },
        { include: "#expression" }
      ]
    },
    function_call: {
      patterns: [
        {
          strict: true,
          type: "INLINE_FUNCTION_CALL",
          name: "meta.function-call.jome",
          begin: "(\\.)(\\w+)\\(",
          beginCaptures: {
            1: { name: "punctuation.dot.jome" },
            2: { name: "entity.name.function.jome", type: "FUNCTION_NAME" }
          },
          end: "\\)",
          patterns: [{ include: "#expression" }]
        },
        {
          strict: true,
          type: "INLINE_FUNCTION_CALL",
          name: "meta.function-call.jome",
          begin: "(\\.)(#\\w+\\!?)\\(",
          beginCaptures: {
            1: { name: "punctuation.dot.jome" },
            2: { name: "support.function.builtin.jome", type: "BUILT_IN" }
          },
          end: "\\)",
          patterns: [{ include: "#expression" }]
        },
        {
          strict: true,
          type: "INLINE_FUNCTION_CALL",
          name: "meta.function-call.WIP.jome",
          begin: `(\\.)(#\\w+\\b\\!?)${LOOKAHEAD_FUNC_CALL_WIP}`,
          beginCaptures: {
            1: { name: "punctuation.dot.jome" },
            2: { name: "support.function.builtin.jome", type: "BUILT_IN" }
          },
          end: "\r\n|\n|$|chain",
          patterns: [{ include: "#expression" }]
        },
        {
          strict: true,
          type: "INLINE_FUNCTION_CALL",
          name: "meta.function-call.WIP.jome",
          begin: `(\\.)\\b(\\w+)\\b${LOOKAHEAD_FUNC_CALL_WIP}`,
          beginCaptures: {
            1: { name: "punctuation.dot.jome" },
            2: { name: "entity.name.function.jome", type: "FUNCTION_NAME" }
          },
          end: "\r\n|\n|$|chain",
          patterns: [{ include: "#expression" }]
        },
        {
          strict: true,
          type: "FUNCTION_CALL",
          name: "support.function-call.jome",
          begin: "(\\w+)\\(",
          beginCaptures: { 1: { name: "entity.name.function.jome", type: "FUNCTION_NAME" } },
          end: "\\)",
          patterns: [{ include: "#expression" }]
        },
        {
          strict: true,
          type: "FUNCTION_CALL",
          name: "support.function-call.jome",
          begin: "(#\\w+\\!?)\\(",
          beginCaptures: { 1: { name: "support.function.builtin.jome", type: "BUILT_IN" } },
          end: "\\)",
          patterns: [{ include: "#expression" }]
        },
        {
          strict: true,
          type: "FUNCTION_CALL",
          name: "support.function-call.WIP.jome",
          begin: `(#\\w+\\b\\!?)${LOOKAHEAD_FUNC_CALL_WIP}`,
          beginCaptures: { 1: { name: "support.function.builtin.jome", type: "BUILT_IN" } },
          end: "\r\n|\n|$|chain",
          patterns: [{ include: "#expression" }]
        },
        {
          strict: true,
          type: "FUNCTION_CALL",
          name: "support.function-call.WIP.jome",
          begin: `\\b(\\w+)\\b${LOOKAHEAD_FUNC_CALL_WIP}`,
          beginCaptures: { 1: { name: "entity.name.function.jome", type: "FUNCTION_NAME" } },
          end: "\r\n|\n|$|chain",
          patterns: [{ include: "#expression" }]
        }
      ]
    },
    argument_v2: {
      strict: true,
      patterns: [
        {
          type: "ARGUMENT",
          match: `(${REGEX_VARIABLE})\\s*(:)\\s*([A-Za-z]\\w*)`,
          captures: {
            1: { name: "variable.other.jome", type: "NAME" },
            2: { name: "keyword.operator.type.annotation.jome" },
            3: { name: "support.type.jome", type: "TYPE" }
          }
        },
        {
          match: REGEX_VARIABLE,
          name: "variable.other.jome",
          type: "ARGUMENT"
        },
        {
          name: "meta.deconstructed-arg.jome",
          begin: "\\{",
          beginCaptures: { 0: { name: "punctuation.curly-braces.open.jome" } },
          end: "\\}",
          endCaptures: { 0: { name: "punctuation.curly-braces.close.jome" } },
          patterns: [
            { include: "#argument_v2" },
            { include: "#expression" }
          ]
        }
      ]
    },
    argument: {
      patterns: [
        {
          match: `(${REGEX_VARIABLE})\\s*(:)\\s*([A-Za-z]\\w*)`,
          captures: {
            1: { name: "variable.other.jome", type: "ARGUMENT" },
            2: { name: "keyword.operator.type.annotation.jome" },
            3: { name: "support.type.jome", type: "TYPE" }
          }
        },
        {
          match: REGEX_VARIABLE,
          name: "variable.other.jome",
          type: "ARGUMENT"
        },
        {
          name: "meta.deconstructed-arg.jome",
          begin: "\\{",
          beginCaptures: { 0: { name: "punctuation.curly-braces.open.jome" } },
          end: "\\}",
          endCaptures: { 0: { name: "punctuation.curly-braces.close.jome" } },
          patterns: [
            { include: "#argument" },
            { include: "#expression" }
          ]
        }
      ]
    },
    variable: {
      match: REGEX_VARIABLE,
      name: "variable.other.jome",
      type: "VARIABLE"
    },
    caller: {
      name: "meta.caller.jome",
      match: "(->)(\\w+)",
      captures: {
        1: { name: "punctuation.arrow.jome" },
        2: { name: "entity.name.function.jome" }
      }
    },
    getter: {
      patterns: [
        {
          name: "meta.getter.jome",
          match: "(\\?\\.)(\\w+)",
          captures: {
            1: { name: "punctuation.accessor.optional.jome" },
            2: { name: "variable.other.property.jome" }
          }
        },
        {
          name: "meta.getter.jome",
          match: "(\\.)(\\w+)",
          captures: {
            1: { name: "punctuation.dot.jome" },
            2: { name: "variable.other.property.jome" }
          }
        },
        {
          name: "meta.getter.jome",
          begin: "(\\?\\.)(\\[)",
          beginCaptures: {
            1: { name: "punctuation.accessor.optional.jome" },
            2: { name: "punctuation.definition.square-bracket.begin.jome" },
          },
          end: "\\]",
          endCaptures: {0: {name: "punctuation.definition.square-bracket.end.jome"}},
          patterns: [{include: "#expression"}]
        },
      ]
    },
    "inline-utility": {
      name: "entity.name.function.utility-inline.jome",
      match: "\\.#\\w+\\!?"
    },
    utilities: {
      patterns: [
        {
          name: "meta.include.jome",
          begin: `(#\\.\\.\\.)(\\()`,
          beginCaptures: {
            1: { name: "support.function.include.jome" },
            2: { name: "punctuation.paren.open.jome" }
          },
          end: "\\)",
          endCaptures: { 0: { name: "punctuation.paren.close.jome" } },
          patterns: [{ include: "#expression" }]
        },
        {
          name: "meta.require.jome", // "Allow #~ for home too?"
          begin: `(#)(\\()`,
          beginCaptures: {
            1: { name: "support.function.include.jome" },
            2: { name: "punctuation.paren.open.jome" }
          },
          end: "\\)",
          endCaptures: { 0: { name: "punctuation.paren.close.jome" } },
          patterns: [{ include: "#expression" }]
        },
        {
          name: "string.other.path.jome", // "Allow #~ for home too?"
          match: `(#\\.{0,2}/${REGEX_PATH_CHARS})|(#cwd/${REGEX_PATH_CHARS})|(#\\.{1,2})`
        },
        {
          name: "variable.other.constant.utility.jome",
          match: "#\\b(PI|env|cwd|argv)\\b",
          notWorkingMatch: "#\\b\\w+\\b(?!\\(|#)"
        },
        {
          name: "support.function.builtin.jome",
          match: "#\\w+\\!?"
        }
      ]
    },
    along: {
      match: "(along)\\s*(type|unit|code|source)",
      captures: {
        1: { name: "keyword.control.along.jome" },
        2: { name: "variable.language.jome" }
      }
    },
    "state-var": {
      name: "variable.other.state-var.jome",
      match: "%\\w+"
    },
    attribute: {
      patterns: [
        {
          name: "support.type.property-name.attribute.optional.jome",
          match: "\\@\\w+\\?"
        },
        {
          name: "support.type.property-name.attribute.required.jome",
          match: "\\@\\w+\\!"
        },
        {
          name: "support.type.property-name.attribute.jome",
          match: "\\@\\w*"
        }
      ]
    },
    operators: {
      patterns: [
        {
          match: "([a-zA-Z_]\\w*)?\\s*(\\+=|-=|\\*=|&&=|\\|\\|=|(?<!\\()/=)",
          captures: {
            1: { name: "variable.assignment.jome" },
            2: { name: "keyword.operator.assignment.compound.jome" }
          }
        },
        {
          match: "!==|!=|<=|>=|===|==|<|>",
          name: "keyword.operator.comparison.jome"
        },
        {
          match: "!",
          name: "keyword.operator.logical.unary.jome"
        },
        {
          match: "\\?\\?",
          name: "keyword.operator.nullish-coalescing.jome"
        },
        { match: "&&", name: "keyword.operator.logical.jome", type: "OP_AND" },
        { match: "\\|\\|", name: "keyword.operator.logical.jome", type: "OP_OR" },
        {
          match: "([a-zA-Z$_][\\w$]*)?(:)\\s*(\\w+)\\s*(=)(?![>=])",
          captures: {
            1: { name: "variable.assignment.jome" },
            2: { name: "keyword.operator.type.annotation.jome" },
            3: { name: "support.type.jome", type: "TYPE" },
            4: { name: "keyword.operator.assignment.jome", type: "ASSIGN" }
          }
        },
        {
          match: "([a-zA-Z$_][\\w$]*)?\\s*(=)(?![>=])",
          captures: {
            1: { name: "variable.assignment.jome" },
            2: { name: "keyword.operator.assignment.jome", type: "ASSIGN" }
          }
        },
        {
          match: "--",
          name: "keyword.operator.decrement.jome"
        },
        {
          match: "\\+\\+",
          name: "keyword.operator.increment.jome"
        },
        {
          match: "\\.\\.\\.",
          name: "keyword.operator.splat.jome"
        },
        {
          match: "\\?",
          name: "keyword.operator.existential.jome"
        },
        {
          match: ":",
          name: "keyword.operator.colon.jome"
        },
        {
          match: "\\*|/|-|\\+|\\^",
          name: "keyword.operator.jome"
        }
      ]
    },
    strings: {
      patterns: [
        PATTERN_STRING(null, "string.quoted.multi.jome", "'''"),
        PATTERN_STRING(null, "string.quoted.single.jome", "'"),
        PATTERN_STRING(null, "string.quoted.backtick.jome", "`"),
        PATTERN_STRING(null, "string.quoted.multi.jome", "\"\"\"", "\\{\\{", "\\}\\}"),
        PATTERN_STRING(null, "string.quoted.double.jome", "\"", "\\{", "\\}"),
        {
          name: "string.quoted.verbatim.jome",
          begin: "@(\"|'|\"\"\"|''')",
          beginCaptures: { 0: { name: "punctuation.definition.string.begin.jome" } },
          end: "\\1",
          endCaptures: { 0: { name: "punctuation.definition.string.end.jome" } },
        },
      ]
    },
    "escape-char": {
      name: "constant.character.escape.jome",
      match: "\\\\."
    },
    "paren-expression": {
      begin: "\\(",
      end: "\\)",
      beginCaptures: {
        0: {
          name: "punctuation.paren.open"
        }
      },
      endCaptures: {
        0: {
          name: "punctuation.paren.close"
        }
      },
      name: "meta.group.jome",
      patterns: [{ include: "#expression" }]
    },
    "block-content": {
      patterns: [
        {
          match: "(?:^|\\G)(\\s*)([\\p{L}~]\\w*)\\s*:\\s*([\\p{Lu}]\\w*)",
          captures: {
            1: {
              name: "punctuation.whitespace.indent.jome"
            },
            2: {
              name: "meta.dictionary-key.jome",
              patterns: [
                {
                  match: "([\\p{L}~]\\w*)",
                  name: "support.type.property-name.jome"
                }
              ]
            },
            3: {
              name: "entity.name.type.jome-obj.jome"
            }
          }
        },
        {
          match: "(?:^|\\G)(\\s*)([\\p{Lu}]\\w*)(?!\\w*(-\\w+)*\\s*:)",
          captures: {
            1: {
              name: "punctuation.whitespace.indent.jome"
            },
            2: {
              name: "entity.name.type.jome-obj.jome"
            }
          }
        },
        {
          match: "(?:^|\\G)(\\s*)([\\p{L}]\\w*)(?!\\w*(-\\w+)*\\s*:)",
          captures: {
            1: {
              name: "punctuation.whitespace.indent.jome"
            },
            2: {
              name: "entity.name.function.jome"
            }
          }
        },
        {
          match: "(?:\\G)\\s+"
        },
        {
          match: "(?:^|\r\n|\n)\\s+",
          name: "punctuation.whitespace.indent.jome"
        },
        {
          match: "\\s+"
        },
        {
          match: "([\\p{L}~]\\w*(-\\w+)*)\\s*:",
          name: "meta.dictionary-key.jome",
          captures: {
            1: {
              name: "support.type.property-name.jome"
            }
          }
        },
        { include: "#comma" },
        { include: "#expression" }
      ]
    },
    "block-array": {
      begin: "\\{\\[",
      end: "\\]\\}",
      beginCaptures: {
        0: {
          name: "punctuation.curly-braces.open"
        }
      },
      endCaptures: {
        0: {
          name: "punctuation.curly-braces.close"
        }
      },
      name: "meta.block-array.jome",
      patterns: [
        {
          include: "#block-content"
        }
      ]
    },
    // A block of code being executed. For example
    // () => {/* everything here is inside the code-block */}
    code_block: {
      patterns: [
        {
          strict: true,
          type: "CODE_BLOCK",
          begin: "(?<=\\=\\>)\\s*\\{",
          end: "\\}",
          beginCaptures: { 0: { name: "punctuation.curly-braces.open" } },
          endCaptures: { 0: { name: "punctuation.curly-braces.close" } },
          name: "meta.code-block.jome",
          patterns: [{include: "#expression"}]
        },
        {
          strict: true,
          type: "CODE_BLOCK",
          begin: "(?<=\\))\\s*\\{",
          end: "\\}",
          beginCaptures: { 0: { name: "punctuation.curly-braces.open" } },
          endCaptures: { 0: { name: "punctuation.curly-braces.close" } },
          name: "meta.code-block.jome",
          patterns: [{include: "#expression"}]
        }
      ]
      
    },
    block: {
      begin: "\\{",
      end: "\\}",
      beginCaptures: {
        0: {
          name: "punctuation.curly-braces.open"
        }
      },
      endCaptures: {
        0: {
          name: "punctuation.curly-braces.close"
        }
      },
      name: "meta.block.jome",
      patterns: [
        {
          include: "#block-content"
        }
      ]
    },
    "script-params": {
      patterns: [
        {
          match: `(\\<)(${REGEX_XML_NAME})`,
          captures: {
            1: { name: "punctuation.definition.tag.begin.jome" },
            2: { name: "entity.name.tag.jome" }
          }
        },
        { match: "\\s+" },
        {
          name: "meta.script-param-assign.jome",
          match: "(\\w+)\\s*=\\s*(\"[^\"]*\")",
          captures: {
            1: { name: "entity.other.attribute-name.jome" },
            2: { name: "string.quoted.double.jome" }
          }
        },
        {
          match: "\\w+",
          name: "entity.other.attribute-name.jome"
        },
        {
          match: ">$",
          name: "punctuation.definition.tag.end.jome"
        }
      ]
    },
    "for-tag-func": {
      patterns: [
        {
          name: "entity.name.function.jome",
          match: "#?\\w+"
        }
      ]
    },
    "for-tag": {
      patterns: [
        {
          name: "meta.forall.jome",
          begin: `\\b(forall)\\b\\s*(${REGEX_XML_NAME})?`,
          beginCaptures: {
            1: { name: "keyword.control.jome" },
            2: { name: "keyword.other.tag-name.jome" }
          },
          end: "\\b(end)\\b",
          endCaptures: { 0: { name: "keyword.control.jome" } },
          patterns: [
            {
              name: "meta.forall-chain.jome",
              match: "\\b(chain)\\b\\s*((?:#?\\w+(?:,\\s*#?\\w+)*)?)\\s*",
              captures: {
                1: { name: "keyword.control.jome" },
                2: { patterns: [{ include: "#for-tag-func" }] }
              }
            },
            {
              name: "meta.forall-wrap.jome",
              match: "\\b(wrap)\\b\\s*((?:#?\\w+(?:,\\s*#?\\w+)*)?)\\s*",
              captures: {
                1: { name: "keyword.control.jome" },
                2: { patterns: [{ include: "#for-tag-func" }] }
              }
            }
          ]
        }
      ]
    },
    "tag-end": {
      match: `(\\<\\/)(${REGEX_XML_NAME})(\\>)`,
      captures: {
        1: { name: "punctuation.definition.tag.begin.jome" },
        2: { name: "entity.name.tag.jome" },
        3: { name: "punctuation.definition.tag.end.jome" }
      }
    },
    "tag-literal": {
      patterns: [
        {
          name: "meta.string-template-literal.jome",
          begin: "<%=|<%s|<%-|<%",
          beginCaptures: { 0: { name: "punctuation.definition.tag-literal.begin.jome" } },
          end: "%>",
          endCaptures: { 0: { name: "punctuation.definition.tag-literal.end.jome" } },
          patterns: [{ include: "#expression" }]
        },
      ]
    },
    tag: {
      begin: `\\<(${REGEX_XML_NAME})(\\s+|\\w+|\\w+\\s*=\"[^\"]*\")*\\>`,
      beginCaptures: { 0: { patterns: [{ include: "#script-params" }] } },
      end: "(\\<\\/)(\\1)(\\>)",
      endCaptures: { 0: { patterns: [{ include: "#tag-end" }] } },
      name: "meta.tag.jome",
      contentName: "raw",
      patterns: [{ include: "#tag-literal" }],
    },
    format: {
      match: "(?<=\"|'|>|\\w)(%:?(:\\#)?\\w+)+",
      name: "keyword.other.string-format.jome"
    },
    scripts: {
      patterns: [
        PATTERN_SCRIPT("jome", "source.jome"),
        PATTERN_SCRIPT("js", "source.js"),
        PATTERN_SCRIPT("md", "text.html.markdown"),
        PATTERN_SCRIPT("sh", "source.shell"),
        PATTERN_SCRIPT("css", "source.css"),
        // Allow html and HTML, this way I can easily add an html tag inside html because it is case sensitive.
        PATTERN_SCRIPT("html", "text.html.derivative"),
        PATTERN_SCRIPT("HTML", "text.html.derivative"),
      ]
    },
    "square-bracket": {
      name: "meta.square-bracket.jome",
      begin: "\\[",
      beginCaptures: { 0: { name: "punctuation.definition.square-bracket.begin.jome" } },
      end: "\\]",
      endCaptures: { 0: { name: "punctuation.definition.square-bracket.end.jome" } },
      patterns: [
        {
          match: "(?<!\\.)\\.{3}",
          name: "keyword.operator.slice.exclusive.jome"
        },
        {
          match: "(?<!\\.)\\.{2}",
          name: "keyword.operator.slice.inclusive.jome"
        },
        { include: "#expression" }
      ]
    },
    constants: {
      patterns: [
        {
          match: "([+-]?\\d+\\.\\d+)(([a-zA-Z%])+(•[a-zA-Z]+)*(\\/[a-zA-Z]+)*)",
          captures: {
            1: { name: "constant.numeric.float.jome" },
            2: { name: "support.constant.unit.jome" }
          },
          name: "meta.number-with-unit.jome"
        },
        {
          match: "[+-]?\\d+\\.\\d+",
          name: "constant.numeric.float.jome"
        },
        {
          match: "([+-]?\\d+)(([a-zA-Z%])+(•[a-zA-Z]+)*(\\/[a-zA-Z]+)*)",
          captures: {
            1: { name: "constant.numeric.integer.jome" },
            2: { name: "support.constant.unit.jome" }
          },
          name: "meta.number-with-unit.jome"
        },
        {
          match: "\\b(0|(0[dD]\\d|[1-9])(?>_?\\d)*)r?i?\\b",
          name: "constant.numeric.integer.jome"
        },
        {
          name: "constant.language.jome",
          match: "\\b(null|undefined)\\b"
        },
        {
          name: "constant.language.boolean.jome",
          match: "\\b(true)\\b"
        },
        {
          name: "constant.language.boolean.jome",
          match: "\\b(false)\\b"
        },
        {
          name: "variable.language.jome",
          match: "\\b(PARAMS)\\b"
        }
      ]
    },
    "block-comment": {
      patterns: [
        {
          begin: "\\/\\*",
          beginCaptures: { 0: { name: "punctuation.definition.comment.jome" } },
          end: "\\*\\/",
          endCaptures: { 0: { name: "punctuation.definition.comment.jome" } },
          name: "comment.block.jome"
        }
      ]
    },
    comment: {
      patterns: [
        {
          match: "(^[ \\t]+)?((//)(?:\\s*((@)internal)(?=\\s|$))?).*(?:\r\n|\n|$)",
          name: "comment.line.double-slash.jome"
        },
        {
          begin: "# ",
          beginCaptures: { 0: { name: "punctuation.definition.comment.jome" } },
          end: "$\\n?",
          name: "comment.line.documentation.jome"
        },
        {
          begin: "\\/\\*\\*",
          beginCaptures: { 0: { name: "punctuation.definition.comment.jome" } },
          end: "\\*\\/",
          endCaptures: { 0: { name: "punctuation.definition.comment.jome" } },
          name: "comment.block.documentation.jome"
        },
        { include: "#block-comment" }
      ]
    },
    // This was copy pasted from JavaScript.tmLanguage.json
    regex: {
      patterns: [
        {
          name: "string.regexp.js",
          begin: "(?<!\\+\\+|--|})(?<=[=(:,\\[?+!]|^return|[^\\._$[:alnum:]]return|^case|[^\\._$[:alnum:]]case|=>|&&|\\|\\||\\*\\/)\\s*(\\/)(?![\\/*])(?=(?:[^\\/\\\\\\[\\()]|\\\\.|\\[([^\\]\\\\]|\\\\.)+\\]|\\(([^\\)\\\\]|\\\\.)+\\))+\\/([dgimsuy]+|(?![\\/\\*])|(?=\\/\\*))(?!\\s*[a-zA-Z0-9_$]))",
          beginCaptures: { 1: { name: "punctuation.definition.string.begin.js" } },
          end: "(/)([dgimsuy]*)",
          endCaptures: {
            1: { name: "punctuation.definition.string.end.js" },
            2: { name: "keyword.other.js" }
          },
          patterns: [{ include: "#regexp" }]
        },
        {
          name: "string.regexp.js",
          begin: "((?<![_$[:alnum:])\\]]|\\+\\+|--|}|\\*\\/)|((?<=^return|[^\\._$[:alnum:]]return|^case|[^\\._$[:alnum:]]case))\\s*)\\/(?![\\/*])(?=(?:[^\\/\\\\\\[]|\\\\.|\\[([^\\]\\\\]|\\\\.)*\\])+\\/([dgimsuy]+|(?![\\/\\*])|(?=\\/\\*))(?!\\s*[a-zA-Z0-9_$]))",
          beginCaptures: { 0: { name: "punctuation.definition.string.begin.js" } },
          end: "(/)([dgimsuy]*)",
          endCaptures: {
            1: { name: "punctuation.definition.string.end.js" },
            2: { name: "keyword.other.js" }
          },
          patterns: [{ include: "#regexp" }]
        }
      ]
    },
    regexp: {
      patterns: [
        {
          name: "keyword.control.anchor.regexp",
          match: "\\\\[bB]|\\^|\\$"
        },
        {
          match: "\\\\[1-9]\\d*|\\\\k<([a-zA-Z_$][\\w$]*)>",
          captures: {
            0: { name: "keyword.other.back-reference.regexp" },
            1: { name: "variable.other.regexp" }
          }
        },
        {
          name: "keyword.operator.quantifier.regexp",
          match: "[?+*]|\\{(\\d+,\\d+|\\d+,|,\\d+|\\d+)\\}\\??"
        },
        {
          name: "keyword.operator.or.regexp",
          match: "\\|"
        },
        {
          name: "meta.group.assertion.regexp",
          begin: "(\\()((\\?=)|(\\?!)|(\\?<=)|(\\?<!))",
          beginCaptures: {
            1: { name: "punctuation.definition.group.regexp" },
            2: { name: "punctuation.definition.group.assertion.regexp" },
            3: { name: "meta.assertion.look-ahead.regexp" },
            4: { name: "meta.assertion.negative-look-ahead.regexp" },
            5: { name: "meta.assertion.look-behind.regexp" },
            6: { name: "meta.assertion.negative-look-behind.regexp" }
          },
          end: "(\\))",
          endCaptures: { 1: { name: "punctuation.definition.group.regexp" } },
          patterns: [{ include: "#regexp" }]
        },
        {
          name: "meta.group.regexp",
          begin: "\\((?:(\\?:)|(?:\\?<([a-zA-Z_$][\\w$]*)>))?",
          beginCaptures: {
            0: { name: "punctuation.definition.group.regexp" },
            1: { name: "punctuation.definition.group.no-capture.regexp" },
            2: { name: "variable.other.regexp" }
          },
          end: "\\)",
          endCaptures: { 0: { name: "punctuation.definition.group.regexp" } },
          patterns: [{ include: "#regexp" }]
        },
        {
          name: "constant.other.character-class.set.regexp",
          begin: "(\\[)(\\^)?",
          beginCaptures: {
            1: { name: "punctuation.definition.character-class.regexp" },
            2: { name: "keyword.operator.negation.regexp" }
          },
          end: "(\\])",
          endCaptures: { 1: { name: "punctuation.definition.character-class.regexp" } },
          patterns: [
            {
              name: "constant.other.character-class.range.regexp",
              match: "(?:.|(\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\c[A-Z])|(\\\\.))\\-(?:[^\\]\\\\]|(\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\c[A-Z])|(\\\\.))",
              captures: {
                1: { name: "constant.character.numeric.regexp" },
                2: { name: "constant.character.control.regexp" },
                3: { name: "constant.character.escape.backslash.regexp" },
                4: { name: "constant.character.numeric.regexp" },
                5: { name: "constant.character.control.regexp" },
                6: { name: "constant.character.escape.backslash.regexp" }
              }
            },
            { include: "#regex-character-class" }
          ]
        },
        { include: "#regex-character-class" }
      ]
    },
    "regex-character-class": {
      patterns: [
        {
          name: "constant.other.character-class.regexp",
          match: "\\\\[wWsSdDtrnvf]|\\."
        },
        {
          name: "constant.character.numeric.regexp",
          match: "\\\\([0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})"
        },
        {
          name: "constant.character.control.regexp",
          match: "\\\\c[A-Z]"
        },
        {
          name: "constant.character.escape.backslash.regexp",
          match: "\\\\."
        }
      ]
    }
  }
}

/*
TODO: Instead of analyzer, add stuff directly here inside the grammar.

Stuff that will be ignored when generating the jome.tmLanguage.json file

Stuff that dictates how to handle.

Ideas:
- bind: true // Generate a binding for the token
- kind: BindingKind.Variable // Specify the kind of the binding
- mandatory: true // When the regex is optional, for example def <functionName>, functionName is mandatory and generates an error if missing
- dataKey: 'datakey' // The key that will be given
- runName: 'something.else' // Allow a different name than name
- runMatch: '...' // Allow a different match than match

Instead of specifying these things for each token types, use the key type (token type id) and use then
specify those things for every token of this token type.

Use containsType to avoid giving the same type for every one inside the pattern.

*/

let keysToRemove = ['type', 'containsType']
// Helper function to handle recursion for objects and arrays
function removeKeysRecursive(data) {
  if (Array.isArray(data)) {
    // If it's an array, map over its elements recursively
    return data.map(item => removeKeysRecursive(item));
  } else if (typeof data === 'object' && data !== null) {
    // If it's an object, create a copy omitting specified keys
    const copy = {};
    for (let key in data) {
      if (!keysToRemove.includes(key)) {
        copy[key] = removeKeysRecursive(data[key]);
      }
    }
    return copy;
  } else {
    // For other types, return as is
    return data;
  }
}

// To run grammar
// Instead of creating a grammar designed for tokenization, create one design to analyze and run code.
// Whenever a node is strict, it ignores all the names underneath
// This is temporary, at one point, everything will be strict by default
function convertToRunGrammar(data, strict=false) {
  if (Array.isArray(data)) {
    // If it's an array, map over its elements recursively
    return data.map(item => convertToRunGrammar(item, strict)).filter(f => f);
  } else if (typeof data === 'object' && data !== null) {

    strict = strict || data.strict
    let keysToRemove = [...['type', 'containsType', 'strict'], ...(strict ? ['name'] : [])]

    // If it's an object, create a copy omitting specified keys
    const copy = {};
    for (let key in data) {
      if (!keysToRemove.includes(key)) {
        let val = convertToRunGrammar(data[key], strict);
        if (val) {copy[key] = val}
      }
    }
    if (data['type']) {
      copy['name'] = data['type']
    }
    return Object.keys(copy).length ? copy : null;
  } else {
    // For other types, return as is
    return data;
  }
}

let tmLanguageFilepath = path.join(__dirname, '..', 'syntaxes', 'jome.tmLanguage.json')
let tmLanguageData = removeKeysRecursive(grammar)
fs.writeFileSync(tmLanguageFilepath, JSON.stringify(tmLanguageData, null, 2), 'utf-8');

let runGrammarFilepath = path.join(__dirname, '..', '..', 'jome', 'data', 'jome.tmLanguage.json')
let runGrammarData = convertToRunGrammar(grammar)
fs.writeFileSync(runGrammarFilepath, JSON.stringify(runGrammarData, null, 2), 'utf-8');

// {
//   name: "meta.statement.require.jome",
//   begin: "^require|^requiert",
//   beginCaptures: {
//     0: {
//       name: "keyword.control.jome"
//     }
//   },
//   end: "\r\n|\n|$",
//   patterns: [
//     {
//       include: "#keywords"
//     },
//     {
//       include: "#strings"
//     },
//     {
//       include: "#variable"
//     }
//   ]
// }

// parameter: {
//   patterns: [
//     {
//       name: "support.type.property-name.parameter.optional.jome",
//       match: "\\w+\\?"
//     },
//     {
//       name: "support.type.property-name.parameter.required.jome",
//       match: "\\w+\\!"
//     }
//   ]
// },