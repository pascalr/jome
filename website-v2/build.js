const build = require("jome-lib/build");
module.exports = () => {
  build(
    path.join(__dirname, "views/test.html.jome"),
    path.join(__dirname, "../docs/test/index.html"),
    { force: true }
  );
  build(
    path.join(__dirname, "views/librairies.html.jome"),
    path.join(__dirname, "../docs/lib/index.html"),
    { force: true }
  );
  build(
    path.join(__dirname, "views/utils.html.jome"),
    path.join(__dirname, "../docs/utils/index.html"),
    { force: true }
  );
  build(
    path.join(__dirname, "css/stylesheet.css.jome"),
    path.join(__dirname, "../docs/stylesheet.css"),
    { force: true }
  );
};
