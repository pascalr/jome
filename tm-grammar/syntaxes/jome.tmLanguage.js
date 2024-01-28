const fs = require('fs');
const path = require('path');

// TODO: Use \\p{L} ?
const REGEX_CLASS_NAME = "[A-Za-z_$]\\w*" // FIXME: Accents
// FIXME: REGEX_CLASS_NAME and REGEX_VARIABLE should be the same otherwise the patterns must be modified
// I don't know if they are the same, but I think so.
const REGEX_VARIABLE = "[A-Za-z_$]\\w*" // FIXME: Accents

// // If the regex containing this regex has no group, then group number is 1.
// // Otherwise, you have to add 1 for every group before this one.
// function REGEX_INLINE_STRING(groupNumber=1) {
//   return `(['"\`])(.*?)\\${groupNumber}`
// }
const REGEX_REGULAR_STRING = "\"[^\"]*\"|'[^']*'" // FIXME: Allow backticks and escaped quotes

function PATTERN_SCRIPT(name, sourceTagName, fixmeTmp) {
  // FIXME: Fix all this... Make it like #tag, not #script
  return {
    begin: `\\<${name}(\\s+|\\w+|\\w+\\s*=\"[^\"]*\")*\\>`,
    end: `\\<\\/${name}\\>`,
    beginCaptures: { 0: { patterns: [{ include: "#script-params" }] } },
    endCaptures: { 0: { patterns: [{ include: "#tag-end" }] } },
    name: `meta.embedded.block.${fixmeTmp}`,
    contentName: "raw",
    patterns: [{ include: sourceTagName }]
  }
}

let grammar = {
  "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
  name: "Jome",
  scopeName: "source.jome",
  fileTypes: [
    ".jome",
    ".jomm"
  ],
  patterns: [
    {include: "#statement"},
    {include: "#expression"}
  ],
  repository: {
    "import-identifier": {
      patterns: [
        { match: `&${REGEX_CLASS_NAME}`, name: "entity.name.class.jome" },
        { include: "#variable" }
      ]
    },
    statement: {
      patterns: [
        {
          name: "meta.statement.import.jome",
          begin: `^(import) ?(&?${REGEX_VARIABLE})?`,
          beginCaptures: {
            1: { name: "keyword.control.jome" },
            2: {
              name: "variable.other.default-import.jome",
              patterns: [{ include: "#import-identifier" }]
            }
          },
          end: "\r\n|\n|$",
          patterns: [
            { match: "\\s+" },
            {
              name: "meta.namespace-import.jome",
              match: `(\\*) (as) (${REGEX_VARIABLE})`,
              captures: {
                1: { name: "constant.language.import-export-all.jome" },
                2: { name: "keyword.control.jome" },
                3: { name: "variable.other.namespace-import.jome" }
              }
            },
            {
              name: "meta.import-file.jome",
              match: `(from) (${REGEX_REGULAR_STRING})`,
              captures: {
                1: { name: "keyword.control.jome" },
                2: { name: "string.quoted.jome" }
              }
            },
            {
              name: "meta.named-imports.jome",
              begin: "\\{",
              end: "\\}",
              patterns: [
                {
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
                    3: { name: "variable.other.readwrite.alias.jome" }
                  }
                },
                {
                  name: "meta.import-alias.jome",
                  match: `(${REGEX_REGULAR_STRING}) (as) (${REGEX_VARIABLE})`,
                  captures: {
                    1: { name: "string.quoted.jome" },
                    2: { name: "keyword.control.jome" },
                    3: { name: "variable.other.readwrite.alias.jome" }
                  }
                },
                {
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
      patterns: [
        { include: "#comment" },
        { include: "#if_block" },
        { include: "#interface" },
        { include: "#class" },
        { include: "#symbol" },
        { include: "#format" },
        { include: "#function" },
        { include: "#do_end" },
        { include: "#for-tag" },
        { include: "#chain-bloc" },
        { include: "#type_def" },
        { include: "#regex" },
        { include: "#keywords" },
        { include: "#declaration" },
        { include: "#with-args" },
        { include: "#vbars-args" },
        { include: "#def" },
        { include: "#paren-expression" },
        { include: "#strings" },
        { include: "#scripts" },
        { include: "#tag" },
        { include: "#arrow" },
        { include: "#caller" }, // ->something
        { include: "#state-var" },
        { include: "#operators" },
        // { include: "#parameter" },
        { include: "#attribute" },
        { include: "#square-bracket" },
        { include: "#constants" },
        { include: "#inline-utility" },
        { include: "#function_call" },
        { include: "#utilities" },
        { include: "#support-items" },
        { include: "#variable" },
        { include: "#getter" }, // .something
        { include: "#block-array" },
        { include: "#block"},
        { include: "#semicolon" }, // ;
        { include: "#comma" }, // ,
      ]
    },
    "support-items": {
      patterns: [
        {
          name: "support.variable.jome",
          match: "\\b(console|window|global|document|__dirname|__filename)\\b"
        },
        {
          name: "support.class.jome",
          match: "\\b(Array|JSON)\\b"
        }
      ]
    },
    keywords: {
      patterns: [
        {
          name: "keyword.control.conditional.jome",
          match: "\\b(elif|elsif|else if)\\b"
        },
        {
          name: "keyword.control.conditional.else.jome",
          match: "\\b(else|sinon)\\b"
        },
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
    symbol: {
      match: `:(${REGEX_VARIABLE})`,
      name: "variable.symbol.jome"
    },
    arrow: {
      name: "keyword.arrow.jome",
      match: "=>| -> "
    },
    "vbars-args": {
      name: "meta.args.jome",
      begin: "\\|(?!\\|)",
      beginCaptures: { 0: { name: "punctuation.vertical-bar.begin.jome" } },
      end: "\\|",
      endCaptures: { 0: { name: "punctuation.vertical-bar.end.jome" } },
      patterns: [
        { include: "#argument" },
        { include: "#along" },
        { include: "#expression" }
      ]
    },
    "with-args": {
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
      name: "meta.args.jome",
      begin: "\\G\\(",
      beginCaptures: { 0: { name: "punctuation.paren.open" } },
      end: "\\)",
      endCaptures: { 0: { name: "punctuation.paren.close" } },
      patterns: [
        { include: "#argument" },
        { include: "#along" },
        { include: "#expression" }
      ]
    },
    declaration: {
      name: "meta.declaration.jome",
      match: `\\b(let|var)\\b\\s*(${REGEX_VARIABLE})?`,
      captures: {
        1: { name: "keyword.control.declaration.jome" },
        2: { name: "variable.other.jome" }
      }
    },
    def: {
      name: "meta.def.jome",
      begin: `\\b(def)\\s*(${REGEX_VARIABLE})?\\b\\s*`,
      beginCaptures: {
        1: { name: "keyword.control.jome" },
        2: { name: "entity.name.function.jome" }
      },
      end: "\\b(end)\\b",
      endCaptures: { 0: { name: "keyword.control.jome" } },
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
      name: "meta.function.jome",
      begin: "\\b(function)\\b\\s*",
      beginCaptures: { 1: { name: "keyword.control.jome" } },
      end: "\\b(end)\\b",
      endCaptures: { 0: { name: "keyword.control.jome" } },
      patterns: [
        { include: "#paren-args" },
        { include: "#expression" }
      ]
    },
    if_block: {
      name: "meta.if-block.jome",
      begin: "(?:^|\\G)\\s*\\b(if)\\b",
      beginCaptures: { 1: { name: "keyword.control.conditional.jome" } },
      end: "\\b(end)\\b",
      endCaptures: { 0: { name: "keyword.control.jome" } },
      patterns: [{ include: "#expression" }]
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
              name: "entity.name.type.jome"
            },
            3: {
              patterns: [
                {
                  match: "\\w+",
                  name: "support.type.jome"
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
              name: "entity.name.type.jome"
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
      name: "meta.class.jome",
      begin: `\\b(class)\\b\\s*(${REGEX_CLASS_NAME})?`,
      beginCaptures: {
        1: { name: "keyword.control.jome" },
        2: { name: "entity.name.type.class.jome" }
      },
      end: "\\b(end)\\b",
      endCaptures: { 0: { name: "keyword.control.jome" } },
      patterns: [{ include: "#expression" }]
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
          name: "meta.function-call.jome",
          begin: "(\\.)(\\w+)\\(",
          beginCaptures: {
            1: { name: "punctuation.dot.jome" },
            2: { name: "entity.name.function.jome" }
          },
          end: "\\)",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "meta.function-call.jome",
          begin: "(\\.)(#\\w+\\!?)\\(",
          beginCaptures: {
            1: { name: "punctuation.dot.jome" },
            2: { name: "entity.name.function.utility.jome" }
          },
          end: "\\)",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "meta.function-call.WIP.jome",
          begin: "(\\.)(#\\w+\\b\\!?)(?!\\s*([\\+\\-\\*\\/\\|\\^\\=\\,\\.\\:]|\\)|&&|\\!=|\\!==|$|%|along|chain|end|\\}|\\?|\\[|\\]))",
          beginCaptures: {
            1: { name: "punctuation.dot.jome" },
            2: { name: "entity.name.function.utility.jome" }
          },
          end: "\r\n|\n|$|chain",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "meta.function-call.WIP.jome",
          begin: "(\\.)\\b(\\w+)\\b(?!\\s*([\\+\\-\\*\\/\\|\\^\\=\\,\\.\\:]|\\)|&&|\\!=|\\!==|$|%|along|chain|end|\\}|\\?|\\[|\\]))",
          beginCaptures: {
            1: { name: "punctuation.dot.jome" },
            2: { name: "entity.name.function.jome" }
          },
          end: "\r\n|\n|$|chain",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "support.function-call.jome",
          begin: "(\\w+)\\(",
          beginCaptures: { 1: { name: "entity.name.function.jome" } },
          end: "\\)",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "support.function-call.jome",
          begin: "(#\\w+\\!?)\\(",
          beginCaptures: { 1: { name: "entity.name.function.utility.jome" } },
          end: "\\)",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "support.function-call.WIP.jome",
          begin: "(#\\w+\\b\\!?)(?!\\s*([\\+\\-\\*\\/\\|\\^\\=\\,\\.\\:]|\\)|&&|\\!=|\\!==|$|%|along|chain|end|\\}|\\?|\\[|\\]))",
          beginCaptures: { 1: { name: "entity.name.function.utility.jome" } },
          end: "\r\n|\n|$|chain",
          patterns: [{ include: "#expression" }]
        },
        {
          name: "support.function-call.WIP.jome",
          begin: "\\b(\\w+)\\b(?!\\s*([\\+\\-\\*\\/\\|\\^\\=\\,\\.\\:]|\\)|&&|\\!=|\\!==|$|%|along|chain|end|\\}|\\?|\\[|\\]))",
          beginCaptures: { 1: { name: "entity.name.function.jome" } },
          end: "\r\n|\n|$|chain",
          patterns: [{ include: "#expression" }]
        }
      ]
    },
    argument: {
      patterns: [
        {
          match: `(${REGEX_VARIABLE})\\s*(:)\\s*([A-Za-z]\\w*)`,
          captures: {
            1: { name: "variable.other.jome" },
            2: { name: "keyword.operator.type.annotation.jome" },
            3: { name: "support.type.jome" }
          }
        },
        {
          include: "#variable"
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
      name: "variable.other.jome"
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
      name: "meta.getter.jome",
      match: "(\\.)(\\w+)",
      captures: {
        1: { name: "punctuation.dot.jome" },
        2: { name: "variable.other.property.jome" }
      }
    },
    "inline-utility": {
      name: "entity.name.function.utility-inline.jome",
      match: "\\.#\\w+\\!?"
    },
    utilities: {
      patterns: [
        {
          name: "variable.other.constant.utility.jome",
          match: "#\\b(PI|env|cwd|argv)\\b",
          notWorkingMatch: "#\\b\\w+\\b(?!\\(|#)"
        },
        {
          name: "entity.name.function.utility.jome",
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
          match: "!=|<=|>=|===|==|<|>",
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
        {
          match: "&&|\\|\\|",
          name: "keyword.operator.logical.jome"
        },
        {
          match: "([a-zA-Z$_][\\w$]*)?(:)\\s*(\\w+)\\s*(=)(?![>=])",
          captures: {
            1: { name: "variable.assignment.jome" },
            2: { name: "keyword.operator.type.annotation.jome" },
            3: { name: "support.type.jome" },
            4: { name: "keyword.operator.assignment.jome" }
          }
        },
        {
          match: "([a-zA-Z$_][\\w$]*)?\\s*(=)(?![>=])",
          captures: {
            1: { name: "variable.assignment.jome" },
            2: { name: "keyword.operator.assignment.jome" }
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
        {
          name: "string.quoted.multi.jome",
          begin: "'''",
          beginCaptures: { 0: { name: "punctuation.definition.string.begin.jome" } },
          end: "'''",
          endCaptures: { 0: { name: "punctuation.definition.string.end.jome" } },
          patterns: [{ include: "#escape-char" }]
        },
        {
          comment: "Allow #~ for home too?",
          name: "string.other.path.jome",
          match: "(#\\.{0,2}/[^ \\(\\)\\,]*)|(#cwd/[^ \\(\\)\\,]*)|(#\\.{1,2})"
        },
        {
          name: "string.quoted.verbatim.jome",
          begin: "@(\"|'|\"\"\"|''')",
          beginCaptures: { 0: { name: "punctuation.definition.string.begin.jome" } },
          end: "\\1",
          endCaptures: { 0: { name: "punctuation.definition.string.end.jome" } },
        },
        {
          name: "string.quoted.double.jome",
          begin: "\"",
          beginCaptures: { 0: { name: "punctuation.definition.string.begin.jome" } },
          end: "\"",
          endCaptures: { 0: { name: "punctuation.definition.string.end.jome" } },
          patterns: [
            { include: "#template-literal" },
            { include: "#escape-char" }
          ]
        },
        {
          name: "string.quoted.single.jome",
          begin: "'",
          beginCaptures: { 0: { name: "punctuation.definition.string.begin.jome" } },
          end: "'",
          endCaptures: { 0: { name: "punctuation.definition.string.end.jome" } },
          patterns: [{ include: "#escape-char" }]
        },
        {
          name: "string.quoted.backtick.jome",
          begin: "`",
          beginCaptures: { 0: { name: "punctuation.definition.string.begin.jome" } },
          end: "`",
          endCaptures: { 0: { name: "punctuation.definition.string.end.jome" } },
          patterns: [{ include: "#escape-char" }]
        }
      ]
    },
    "escape-char": {
      name: "constant.character.escape.jome",
      match: "\\\\."
    },
    "template-literal": {
      name: "meta.string-template-literal.jome",
      begin: "\\{",
      beginCaptures: {
        0: {
          name: "punctuation.definition.template-expression.begin.jome"
        }
      },
      end: "\\}",
      endCaptures: {
        0: {
          name: "punctuation.definition.template-expression.end.jome"
        }
      },
      patterns: [{ include: "#expression" }]
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
          match: "(\\<)([A-Za-z]\\w*(?:-\\w+)*)",
          captures: {
            1: {
              name: "punctuation.definition.tag.begin.jome"
            },
            2: {
              name: "entity.name.tag.jome"
            }
          }
        },
        {
          match: "\\s+"
        },
        {
          name: "meta.script-param-assign.jome",
          match: "(\\w+)\\s*=\\s*(\"[^\"]*\")",
          captures: {
            1: {
              name: "entity.other.attribute-name.jome"
            },
            2: {
              name: "string.quoted.double.jome"
            }
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
          begin: "\\b(forall)\\b\\s*(\\w+(?:-\\w+)*)?",
          beginCaptures: {
            1: {
              name: "keyword.control.jome"
            },
            2: {
              name: "keyword.other.tag-name.jome"
            }
          },
          end: "\\b(end)\\b",
          endCaptures: {
            0: {
              name: "keyword.control.jome"
            }
          },
          patterns: [
            {
              name: "meta.forall-chain.jome",
              match: "\\b(chain)\\b\\s*((?:#?\\w+(?:,\\s*#?\\w+)*)?)\\s*",
              captures: {
                1: {
                  name: "keyword.control.jome"
                },
                2: {
                  patterns: [
                    {
                      include: "#for-tag-func"
                    }
                  ]
                }
              }
            },
            {
              name: "meta.forall-wrap.jome",
              match: "\\b(wrap)\\b\\s*((?:#?\\w+(?:,\\s*#?\\w+)*)?)\\s*",
              captures: {
                1: {
                  name: "keyword.control.jome"
                },
                2: {
                  patterns: [
                    {
                      include: "#for-tag-func"
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    },
    "tag-end": {
      match: "(\\<\\/)([a-zA-Z]\\w*(?:-\\w+)*)(\\>)",
      captures: {
        1: { name: "punctuation.definition.tag.begin.jome" },
        2: { name: "entity.name.tag.jome" },
        3: { name: "punctuation.definition.tag.end.jome" }
      }
    },
    tag: {
      begin: "\\<([a-zA-Z]\\w*(?:-\\w+)*)(\\s+|\\w+|\\w+\\s*=\"[^\"]*\")*\\>",
      beginCaptures: { 0: { patterns: [{ include: "#script-params" }] } },
      end: "(\\<\\/)(\\1)(\\>)",
      endCaptures: { 0: { patterns: [{ include: "#tag-end" }] } },
      name: "meta.tag.jome",
      contentName: "raw"
    },
    format: {
      match: "(?<=\"|'|>|\\w)(%:?(:\\#)?\\w+)+",
      name: "keyword.other.string-format.jome"
    },
    scripts: {
      patterns: [
        PATTERN_SCRIPT("js", "source.js", "javascript"),
        PATTERN_SCRIPT("md", "text.html.markdown", "markdown"),
        PATTERN_SCRIPT("sh", "source.shell", "shell"),
        PATTERN_SCRIPT("css", "source.css", "css"),
        PATTERN_SCRIPT("html", "text.html.derivative", "html"),
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
          match: "\\b(true|false|null|undefined)\\b"
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
    regex: {
      patterns: [
        {
          name: "string.regexp.js",
          begin: "(?<!\\+\\+|--|})(?<=[=(:,\\[?+!]|^return|[^\\._$[:alnum:]]return|^case|[^\\._$[:alnum:]]case|=>|&&|\\|\\||\\*\\/)\\s*(\\/)(?![\\/*])(?=(?:[^\\/\\\\\\[\\()]|\\\\.|\\[([^\\]\\\\]|\\\\.)+\\]|\\(([^\\)\\\\]|\\\\.)+\\))+\\/([dgimsuy]+|(?![\\/\\*])|(?=\\/\\*))(?!\\s*[a-zA-Z0-9_$]))",
          beginCaptures: {
            1: {
              name: "punctuation.definition.string.begin.js"
            }
          },
          end: "(/)([dgimsuy]*)",
          endCaptures: {
            1: {
              name: "punctuation.definition.string.end.js"
            },
            2: {
              name: "keyword.other.js"
            }
          },
          patterns: [
            {
              include: "#regexp"
            }
          ]
        },
        {
          name: "string.regexp.js",
          begin: "((?<![_$[:alnum:])\\]]|\\+\\+|--|}|\\*\\/)|((?<=^return|[^\\._$[:alnum:]]return|^case|[^\\._$[:alnum:]]case))\\s*)\\/(?![\\/*])(?=(?:[^\\/\\\\\\[]|\\\\.|\\[([^\\]\\\\]|\\\\.)*\\])+\\/([dgimsuy]+|(?![\\/\\*])|(?=\\/\\*))(?!\\s*[a-zA-Z0-9_$]))",
          beginCaptures: {
            0: {
              name: "punctuation.definition.string.begin.js"
            }
          },
          end: "(/)([dgimsuy]*)",
          endCaptures: {
            1: {
              name: "punctuation.definition.string.end.js"
            },
            2: {
              name: "keyword.other.js"
            }
          },
          patterns: [
            {
              include: "#regexp"
            }
          ]
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
            0: {
              name: "keyword.other.back-reference.regexp"
            },
            1: {
              name: "variable.other.regexp"
            }
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
            1: {
              name: "punctuation.definition.group.regexp"
            },
            2: {
              name: "punctuation.definition.group.assertion.regexp"
            },
            3: {
              name: "meta.assertion.look-ahead.regexp"
            },
            4: {
              name: "meta.assertion.negative-look-ahead.regexp"
            },
            5: {
              name: "meta.assertion.look-behind.regexp"
            },
            6: {
              name: "meta.assertion.negative-look-behind.regexp"
            }
          },
          end: "(\\))",
          endCaptures: {
            1: {
              name: "punctuation.definition.group.regexp"
            }
          },
          patterns: [
            {
              include: "#regexp"
            }
          ]
        },
        {
          name: "meta.group.regexp",
          begin: "\\((?:(\\?:)|(?:\\?<([a-zA-Z_$][\\w$]*)>))?",
          beginCaptures: {
            0: {
              name: "punctuation.definition.group.regexp"
            },
            1: {
              name: "punctuation.definition.group.no-capture.regexp"
            },
            2: {
              name: "variable.other.regexp"
            }
          },
          end: "\\)",
          endCaptures: {
            0: {
              name: "punctuation.definition.group.regexp"
            }
          },
          patterns: [
            {
              include: "#regexp"
            }
          ]
        },
        {
          name: "constant.other.character-class.set.regexp",
          begin: "(\\[)(\\^)?",
          beginCaptures: {
            1: {
              name: "punctuation.definition.character-class.regexp"
            },
            2: {
              name: "keyword.operator.negation.regexp"
            }
          },
          end: "(\\])",
          endCaptures: {
            1: {
              name: "punctuation.definition.character-class.regexp"
            }
          },
          patterns: [
            {
              name: "constant.other.character-class.range.regexp",
              match: "(?:.|(\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\c[A-Z])|(\\\\.))\\-(?:[^\\]\\\\]|(\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\c[A-Z])|(\\\\.))",
              captures: {
                1: {
                  name: "constant.character.numeric.regexp"
                },
                2: {
                  name: "constant.character.control.regexp"
                },
                3: {
                  name: "constant.character.escape.backslash.regexp"
                },
                4: {
                  name: "constant.character.numeric.regexp"
                },
                5: {
                  name: "constant.character.control.regexp"
                },
                6: {
                  name: "constant.character.escape.backslash.regexp"
                }
              }
            },
            {
              include: "#regex-character-class"
            }
          ]
        },
        {
          include: "#regex-character-class"
        }
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

let filepath = path.join(__dirname, 'jome.tmLanguage.json')
fs.writeFileSync(filepath, JSON.stringify(grammar, null, 2), 'utf-8');





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