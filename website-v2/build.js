const build = require("jome-lib/build");
module.exports = () => {
  build(
    path.join(__dirname, "views/test.html.jome"),
    path.join(__dirname, "../docs/test/index.html")
  );
};
