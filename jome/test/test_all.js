const test_compiler = require("./test_compiler.js");
const test_analyzer = require("./test_analyzer.js");
const MiniSpecPkg = require("minispec");
module.exports = () => {
  let MiniSpec = MiniSpecPkg.default;
  test_compiler();
  test_analyzer();
  MiniSpec.execute();
};
