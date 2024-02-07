const test_compiler = require("./test_compiler.js");
const test_analyzer = require("./test_analyzer.js");
const test_parser = require("./test_parser.js");
const MiniSpecPkg = require("minispec");
module.exports = () => {
  let MiniSpec = MiniSpecPkg.default;
  test_parser();
  test_compiler();
  test_analyzer();
  MiniSpec.execute();
};
