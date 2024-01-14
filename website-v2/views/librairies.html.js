const Webpage = require("../src/webpage.js");
module.exports = () => {
  content = `
  ## Jome librairies

  Jome compiles into JavaScript. So librairies are distributed through npm like other JavaScript librairies.

  ### Common librairies

  - [Html](${global.g_URL}/lib/html)

`;
  return new Webpage("Jome librairies", content).render();
};
