export const FILE_FORMATS = {
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