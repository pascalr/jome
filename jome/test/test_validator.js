const j_uid_1 = require("minispec");
const { default: MiniSpec, describe, it } = j_uid_1;
const { validateCode } = require("../src/compiler.js");
const assert = require("assert/strict");
module.exports = () => {
  describe("Validator", function () {
    it("should return an error keyword let without nothing", function () {
      assert.match(compile("#."), /__dirname/);
      assert.match(compile("#./"), /__dirname/);
    });
  });
};
