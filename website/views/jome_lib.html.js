const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let content = mdToHtml(`

  # JomeLib

  JomeLib is the opiniated part of Jome. It gives access to a lot of utilities to help you get started.

  It is a list of functions and constants.
  
  It is like a playlist. It gives you something to get started quickly. Over time, you will probably make your own playlist.
`);

  return new Webpage("JomeLib", content).render();
};
