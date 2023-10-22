import jome from 'jome'


export class HtmlPage {
  constructor(__params__) {
    this.__params__ = {...{title: '', stylesheets: []}, ...__params__}
  }
  toString() {
    return `
    <!DOCTYPE html>
    <HTML lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.__params__.title}</title>
        ${this.__params__.stylesheets.map((f) => {
      return `<link rel="stylesheet" type="text/css" href="${f}">`
    }).join('\n')}
      </head>
      <body>
        ${this.__params__.body}
      </body>
    </HTML>
  `
  }
}

