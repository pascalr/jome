const Webpage = require("../src/webpage.js");
const mdToHtml = require("jome-lib/mdToHtml");
module.exports = () => {
  let content = mdToHtml(
    mdToHtml(`
  ## Jome librairies

  Jome compiles into JavaScript. So librairies are distributed through npm like other JavaScript librairies.

  ### Common librairies

  - [Html](${global.g_URL}/lib/html)

`)
  );
  return new Webpage("Jome librairies", content).render();
};
