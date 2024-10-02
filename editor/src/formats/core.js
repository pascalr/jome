export const CORE_FORMATS_WIP = {

  jome: {
    contains: [
      {include: "command"},
      {include: "html_comment"},
      // TODO: Add other HTML things that capture like pre or code?
    ],
    repository: {
      code: [
        // FIXMEEEEEEEEEEEEEEEEEEEEEEE * /
        {begin: "\\{\\*/", end: "/\\*\\{\\s*", capture: true, contains: ["lang*"]},
      ],
      command: [
        {begin: "\\w+\\(", end: ")\\s*", capture: true, matchAfter: ["code", "nested"], contains: ["string"]}
      ],
      nested: [
        {begin: "\\{", end: "\\}", capture: true, contains: ["command", "nested", "code"]}
      ],
      string: [
        {begin: '"', end: '"'},
      ],
      html_comment: [
        {begin: '<!--', end: '-->'},
      ]
    }
  },

  js: {
    codeBlockBegin: "\\{\\*/",
    codeBlockEnd: "/\\*\\{\\s*",
    contains: [
      {begin: "//~", end: "\n|$", capture: true},
      {begin: "\\s*/\\*~", end: "~\\*/\\s*", capture: true},
      {begin: "/\\*", end: "\\*/"},
      {begin: '"', end: '"'},
      {begin: "'", end: "'"},
      {begin: "`", end: "`", contains: [
        {begin: "\\$\\{", end: "\\}", contains: ["*"]} // Star means anything from the top contains
      ]},
      // FIXME: Regexes /.../
    ]
  }

  // TODO: interpolates

  // TODO: Ruby heredocs %Q(...) or <<-(\w+) ... (\1)

}

export const CORE_FORMATS = {
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
  },
  md: {
    // multiBegin: "\n[//]: # (",
    // multiEnd: ")",
    // FIXME: Don't consider a comment when inside a code block
    multiBegin: "<!--",
    multiEnd: "-->",
    stringSingle: true,
    stringDouble: true,
  }
}