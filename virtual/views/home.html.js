const Webpage = require("../src/webpage.js");
module.exports = () => {
  const content = `
    <h1>Jome virtual - Live editor</h1>
  `/*_* @tag html */
  return new Webpage("Jome virtual - Live editor", content).render();
};
