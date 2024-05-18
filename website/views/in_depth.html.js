const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let content = mdToHtml(`

  # In depth

  TODO

  ## Formats

  All the default formats`);

  return new Webpage("Jome In Depth", content).render();
};
