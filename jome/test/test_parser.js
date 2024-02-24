const assert = require("assert/strict");
const { parse } = require("../src/parser.js");
const { tokenize } = require("../src/tokenizer.js");
const { describe, it } = require("minispec");
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
  function validatePart(part, expected, msg) {
    if (expected.type) {
      assert.equal(part.type, expected.type, msg);
    }
    if (expected.value) {
      assert.equal(part.value, expected.value);
    }
    if (expected.parts) {
      if (part.parts.length !== expected.parts.length) {
        let a = JSON.stringify(part.parts.map((p) => p.type));
        let e = JSON.stringify(expected.parts.map((p) => p.type));
        assert.equal(a, e, msg + ".parts");
      }
      expected.parts.forEach(function (e, i) {
        validatePart(part.parts[i], e, msg + `.parts[${i}]`);
      });
    }
    if (expected.operands) {
      assert.equal(
        part.operands.length,
        expected.operands.length,
        msg + ".operands.length",
      );
      expected.operands.forEach(function (e, i) {
        validatePart(part.operands[i], e, msg + `.operands[${i}]`);
      });
    }
  }
  function testParse(code, expected) {
    let list = parse(tokenize(code).children);
    assert.equal(list.length, expected.length, "Number of expressions");
    expected.forEach(function (e, i) {
      validatePart(list[i], e, `Expression[${i}]`);
    });
  }
  describe("Parse let assignment", function () {
    it("let x", function () {
      testParse("let x", [
        {
          type: "meta.declaration.jome",
          parts: [
            { type: "keyword.control.declaration.jome" },
            { type: "variable.other.jome" },
          ],
        },
      ]);
    });

    it("let x;", function () {
      testParse("let x;", [
        {
          type: "meta.declaration.jome",
          parts: [
            { type: "keyword.control.declaration.jome" },
            { type: "variable.other.jome" },
          ],
        },
        { type: "punctuation.terminator.statement.jome" },
      ]);
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
  describe("Parse conditions", function () {
    it("if statements blocks, operation condition", function () {
      testParse('if x === 1\n  #log("hello")\nend', [
        {
          type: "meta.if-block.jome",
          parts: [
            { type: "keyword.control.conditional.jome" },
            {
              type: "keyword.operator.comparison.jome",
              operands: [
                {
                  type: "variable.other.jome",
                  type: "constant.numeric.integer.jome",
                },
              ],
            },
            {
              type: "support.function-call.jome",
              parts: [{ type: "string.quoted.double.jome" }],
            },
            { type: "keyword.control.jome" },
          ],
        },
      ]);
    });
  });
  describe("Parse trycatch", function () {
    it("throw new Error", function () {
      testParse('throw new Error("error")', [
        {
          type: "keyword.control.throw.jome",
          operands: [
            {
              type: "keyword.operator.new.jome",
              operands: [{ type: "keyword.control.conditional.jome" }],
            },
          ],
        },
      ]);
    });
  });
};
