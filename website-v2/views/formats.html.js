const Webpage = require("../src/webpage.js");
const mdToHtml = require("jome-lib/mdToHtml");
module.exports = () => {
  let content = mdToHtml(`
  ## Formats

  - bin, hex, oct, ...
  - sh, rb, lua, ...
  - latex
  - md
  - guitar tab!!!
  - music score!!!
  - jsx => create react elements easily!
  - html.js => convert html into js element creation! document.createElement('div')...!!!!!!!!
  - svg
  - something for diagrams
  - something for characters
  - something for drawings?
`);
  return new Webpage("Jome formats", content).render();
};
