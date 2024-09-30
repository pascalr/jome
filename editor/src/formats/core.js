export const CORE_FORMATS_WIP = {

  js: {
    contains: [
      {begin: "//~", end: "\n|$", capture: true},
      {begin: "\\s*/\\*~", end: "~\\*/\\s*", capture: true},
      {begin: "/\\*", end: "\\*/"},
      {begin: '"', end: '"'},
      {begin: "'", end: "'"},
      {begin: "`", end: "`", contains: [
        {begin: "\\$\\{", end: "\\}", contains: ["*"]} // Star means anything from the top contains
      ]},
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