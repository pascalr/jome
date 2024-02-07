const j_uid_1 = require("minispec");
const { default: MiniSpec, describe, it } = j_uid_1;
const { validateCode } = require("../src/compiler.js");
const assert = require("assert/strict");
module.exports = () => {
  describe("Validator", function () {
    it("should return an error keyword let with nothing else", function () {
      let errors = validateCode("let");
      assert.equal(errors.length, 1);
    });
    it("should return an error keyword import with nothing else", function () {
      let errors = validateCode("import");
      assert.equal(errors.length, 1);
    });
  });
};
