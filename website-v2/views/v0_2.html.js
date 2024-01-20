const Webpage = require("../src/webpage.js");
const mdToHtml = require("jome-lib/mdToHtml");
module.exports = () => {
  let content = mdToHtml(`

  # Jome v-0.2

`);
  return new Webpage("Jome", content).render();
};
