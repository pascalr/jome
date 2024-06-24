const Webpage = require("../src/webpage.js");
const mdToHtml = require("@jome/md-to-html");
module.exports = () => {
  let content = mdToHtml(`

  TODO: Write a test suite that is documented, and this is what would be the in depth. It would be perfect because it would
  be complete.

  Let's write a notebook and use that as a reference for the language.

  # In depth

  TODO

  ## Formats

  All the default formats

  ## Syntax

  void doSomething() { /* ... */ }
  def doSomething /* ... */ end
  fn doSomething() { /* ... */ }
  function doSomething() { /* ... */ }
  let doSomething = () => { /* ... */ }
  let doSomething = => { /* ... */ }`);

  return new Webpage("Jome In Depth", content).render();
};
