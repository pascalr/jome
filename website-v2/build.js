const build = require("jome-lib/build");
module.exports = () => {
  build(
    path.join(__dirname, "views/test.html.jome"),
    path.join(__dirname, "../docs/test/index.html")
  );
  build(
    path.join(__dirname, "views/librairies.html.jome"),
    path.join(__dirname, "../docs/lib/index.html")
  );
};
