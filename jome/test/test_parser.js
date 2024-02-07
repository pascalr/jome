const { describe, it, context } = require("minispec");
const { parse } = require("../src/parser.js");
const { tokenize } = require("../src/tokenizer.js");
const assert = require("assert/strict");
module.exports = () => {
  describe("Parse operation", function () {
    it("1 + 2", function () {
      let list = parse(tokenize("1+2").children);
      assert.equal(list?.length, 1);
      let ast = list[0];
      assert.equal(ast?.raw, "+");
      assert.equal(ast?.operands?.[0]?.raw, "1");
      assert.equal(ast?.operands?.[1]?.raw, "2");
    });
  });
};
