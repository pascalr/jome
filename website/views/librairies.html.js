const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let content = mdToHtml(`
  ## Jome librairies

  Jome compiles into JavaScript. So librairies are distributed through npm like other JavaScript librairies.

  ### Common librairies

  - [Html](${ROOT}/lib/html)
`);

  return new Webpage("Jome librairies", content).render();
};
