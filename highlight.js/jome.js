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
      hljs.COMMENT(
        '/\\*', // begin
        '\\*/', // end
        {
          contains: [
            {
              scope: 'doc', begin: '@\\w+'
            }
          ]
        }
      )
    ]
  }
}