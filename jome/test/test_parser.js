const assert = require("assert/strict");
const { describe, it, context } = require("minispec");
const { parse } = require("../src/parser.js");
const { tokenize } = require("../src/tokenizer.js");
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

    it("2 + 3 * 4 + 5 == 19", function () {
      let list = parse(tokenize("2 + 3 * 4 + 5 == 19").children);
      assert.equal(list?.length, 1);
      let ast = list[0];
      assert.equal(ast?.raw, "==");
      assert.equal(ast?.operands?.[0]?.raw, "+");
      assert.equal(ast?.operands?.[0]?.operands?.[0]?.raw, "+");
      assert.equal(ast?.operands?.[0]?.operands?.[0]?.operands?.[0]?.raw, "2");
      assert.equal(ast?.operands?.[0]?.operands?.[0]?.operands?.[1]?.raw, "*");
      assert.equal(
        ast?.operands?.[0]?.operands?.[0]?.operands?.[1]?.operands?.[0]?.raw,
        "3",
      );
      assert.equal(
        ast?.operands?.[0]?.operands?.[0]?.operands?.[1]?.operands?.[1]?.raw,
        "4",
      );
      assert.equal(ast?.operands?.[0]?.operands?.[1]?.raw, "5");
      assert.equal(ast?.operands?.[1]?.raw, "19");
    });
  });
  describe("Parse let assignment", function () {
    it("let x", function () {
      let list = parse(tokenize("let x").children);
      assert.equal(list?.length, 1);
      let ast = list[0];
      assert.equal(ast?.raw, "let x");
    });

    it("let x;", function () {
      let list = parse(tokenize("let x;").children);
      assert.equal(list?.length, 2);
      let ast = list[0];
      assert.equal(ast?.raw, "let x");
    });

    it("let x; let y", function () {
      let list = parse(tokenize("let x; let y").children);
      assert.equal(list?.length, 3);
      assert.equal(list[0]?.raw, "let x");
      assert.match(list[2]?.raw, /let y/);
    });

    it("[1][0]", function () {
      let list = parse(tokenize("[1][0]").children);
      assert.equal(list?.length, 1);
      let ast = list[0];
      assert.equal(ast?.parts?.length, 3);
      assert.equal(ast?.operands?.length, 1);
      assert.equal(ast?.operands?.[0]?.parts?.length, 3);
    });
  });
};
