const run_navbar_html = require("../views/partials/navbar.html.js");
const run_sidebar_html = require("../views/partials/sidebar.html.js");
let navbar = run_navbar_html();
let sidebar = run_sidebar_html();  // The base template for most webpages on this website.;
/**
 * @param {*} title The html title of the page
 * @param {*} content Content to be displayed inside the body
 */
module.exports = class Webpage {
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
          <link rel="stylesheet" type="text/css" href="${global.g_URL}/stylesheet.css">
          <link rel="stylesheet" type="text/css" href="${global.g_URL}/highlight.js.min.css">
          <link rel="apple-touch-icon" sizes="180x180" href="${global.g_URL}/apple-touch-icon.png">
          <link rel="icon" type="image/png" sizes="32x32" href="${global.g_URL}/favicon-32x32.png">
          <link rel="icon" type="image/png" sizes="16x16" href="${global.g_URL}/favicon-16x16.png">
          <link rel="manifest" href="${global.g_URL}/site.webmanifest">
        </head>
        <body>
          <div class="d-flex flex-column" style="min-height: 100vh;">
          ${navbar}
          <div style="flex-grow: 1; height: calc(100vh - 50px);">
            <div class="d-flex" style="height: 100%;">
            ${sidebar}
            <div class="scrollable" style="width: 100%;">
              <div class="app-content">
                ${this.content}
              </div>
            </div>
          </div>
        </body>
      </HTML>
    `;
  };
};
