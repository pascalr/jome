// The base template for most webpages on this website.;

const navbar = '' // TODO
const sidebar = '' // TODO

class Webpage {
  /**
   * @param {*} title The html title of the page
   * @param {*} content Content to be displayed inside the body
   */
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }
  render = () => {
    return `
      <!DOCTYPE html>
      <HTML lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${this.title}</title>
          <link rel="stylesheet" type="text/css" href="${ROOT}/stylesheet.css">
          <link rel="stylesheet" type="text/css" href="${ROOT}/highlight.js.min.css">
          <link rel="stylesheet" type="text/css" href="${ROOT}/hljs_tomorrow_night_bright.css">
          <link rel="apple-touch-icon" sizes="180x180" href="${ROOT}/apple-touch-icon.png">
          <link rel="icon" type="image/png" sizes="32x32" href="${ROOT}/favicon-32x32.png">
          <link rel="icon" type="image/png" sizes="16x16" href="${ROOT}/favicon-16x16.png">
          <link rel="manifest" href="${ROOT}/site.webmanifest">
        </head>
        <body>
          <div class="d-flex flex-column" style="min-height: 100vh;">
          ${navbar}
          <div style="flex-grow: 1; height: calc(100vh - 50px);">
            <div class="d-flex" style="height: 100%;">
            ${sidebar}
            <div class="scrollable" style="width: 100%;">
              <div class="main">
                ${this.content}
              </div>
            </div>
          </div>
        </body>
      </HTML>
    `;
  };
};

module.exports = Webpage