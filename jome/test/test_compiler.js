const assert = require("assert/strict");
const { compileCode } = require("../src/compiler.js");
const { describe, it } = require("minispec");
module.exports = () => {
  function compile(code) {
    return compileCode(code, { writeScript: false });
  }
  describe("Paths", function () {
    it("Dirname shortcuts", function () {
      assert.match(compile("#."), /__dirname/);
      assert.match(compile("#./"), /__dirname/);
    });
    it("Absolute paths", function () {
      assert.match(compile("#/"), /"\/"/);
      assert.match(compile("#/some/path.ext"), /"\/some\/path\.ext"/);
    });
    it("Path relative to current file", function () {
      assert.match(
        compile("#./some_file.ext"),
        /path.join\(__dirname, "some_file\.ext"\)/,
      );
    });
    it("Path relative to the current working directory", function () {
      assert.match(
        compile("#cwd/some_file.ext"),
        /path.resolve\("\.\/some_file\.ext"\)/,
      );
    });
    it("Path in the current file parent folder", function () {
      assert.match(compile("#.."), /path.join\(__dirname, ".."\)/);
      assert.match(compile("#../"), /path.join\(__dirname, "..\/"\)/);
      assert.match(
        compile("#../some_file.ext"),
        /path.join\(__dirname, "..\/some_file\.ext"\)/,
      );
    });

    it.skip("Path in the home directory", function () {
      assert.match(compile("#~"), /require\('os'\); os.homedir\(\)/);
      assert.match(compile("#~/"), /require\('os'\); os.homedir\(\)/);
      assert.match(
        compile("#~/some_file.ext"),
        /require\('os'\); path.join\(os.homedir\(\), 'some_file.ext'\)/,
      );
    });
  });
  describe("Imports", function () {
    it("Default import", function () {
      assert.match(
        compile('import name from "module-name"'),
        /const name = require\("module-name"\)/,
      );
    });
    it("Star import", function () {
      assert.match(
        compile('import * as name from "module-name"'),
        /const (\w+) = require\("module-name"\);\s*const { ?default: \w+, ...name ?} = \1;/,
      );
    });
    it("Deconstructed import", function () {
      assert.match(
        compile('import { name } from "module-name"'),
        /const { ?name ?} = require\("module-name"\)/,
      );
      assert.match(
        compile('import { name, name2 } from "module-name"'),
        /const { ?name, name2 ?} = require\("module-name"\)/,
      );
    });
    it("Alias deconstructed import", function () {
      assert.match(
        compile('import { name as otherName } from "module-name"'),
        /const { name: otherName } = require\("module-name"\)/,
      );
      assert.match(
        compile('import { normal, name as otherName } from "module-name"'),
        /const { normal, name: otherName } = require\("module-name"\)/,
      );
    });
    it("Alias deconstructed import with default", function () {
      assert.match(
        compile('import def, { name as otherName } from "module-name"'),
        /const (\w+) = require\("module-name"\);\s*const { ?default: def, name: otherName ?} = \1;/,
      );
    });

    it("Default import and deconstructed", function () {
      assert.match(
        compile('import name, { foo } from "module-name"'),
        /const (\w+) = require\("module-name"\);\s*const { ?default: name, foo ?} = \1;/,
      );
    });
    it("Default import and star import", function () {
      assert.match(
        compile('import name, * as all from "module-name"'),
        /const (\w+) = require\("module-name"\);\s*const { ?default: name, ...all ?} = \1;/,
      );
    });
  });
  describe("Strings", function () {
    it("Single quote strings", function () {
      assert.match(compile("'hello Éric'"), /"hello Éric"/);
      assert.match(
        compile("let code = 'if (cond) {return 0;}'"),
        /let code = "if \(cond\) {return 0;}"/,
      );

      assert.match(
        compile(`'multi
    line'`),
        /`multi\s+line`/,
      );

      assert.match(compile("'\"hello\"'"), /"\\"hello\\""/);

      assert.match(
        compile(`'multi \`line\`
    with backticks'`),
        /`multi \\`line\\`\s+with backticks`/,
      );
    });
    it("Regular double quote strings", function () {
      assert.match(compile('"hello"'), /"hello"/);
      assert.match(compile('"Hello Éric!"'), /"Hello Éric!"/);

      assert.match(
        compile(`"multi
    line"`),
        /`multi\s+line`/,
      );
      assert.match(compile('"Hello O\'Connor"'), /"Hello O'Connor"/);

      assert.match(
        compile(`"multi \`line\`
    with backticks"`),
        /`multi \\`line\\`\s+with backticks`/,
      );
    });
    it("Double quote strings template literal", function () {
      assert.match(compile('"1 + 1 = {1+1}"'), /`1 \+ 1 = \$\{1 ?\+ ?1\}`/);
    });
    it("Triple single quote strings", function () {
      assert.match(compile("'''Hello O'Connor'''"), /"Hello O'Connor"/);
    });
  });
  describe("Regexes", function () {
    it("/test1212/", function () {
      assert.match(compile("/test1212/"), /\/test1212\//);
    });
  });
  describe("Heredocs", function () {
    it("<sh>ls</sh>", function () {
      assert.match(
        compile("<sh>ls</sh>"),
        /const execSh = require\("@jome\/core\/execSh"\);\s*execSh\("ls"\);/,
      );
    });
    describe("Heredoc percent syntax", function () {
      it('"ls"%sh', function () {
        assert.match(
          compile('"ls"%sh'),
          /const execSh = require\("@jome\/core\/execSh"\);\s*execSh\("ls"\);/,
        );
      });
    });
  });
  describe("Comments", function () {
    describe("Documentation comments", function () {
      it("Documentation comments should be compiled into js comments", function () {
        assert.match(
          compile("# documentation comment"),
          /\/\/ documentation comment/,
        );
      });
    });
  });
  describe("Test arrow call", function () {
    it("obj->call", function () {
      assert.match(compile("obj->call"), /obj.call\(\)/);
    });
  });
  describe("Test function call", function () {
    it("Function call with parens", function () {
      assert.match(
        compile(`
let add = (x,y) => x + y
add(10, 5)
`),
        /\s*let add = \(x, ?y\) => \(?x \+ y\)?;?\s*add\(10, ?5\);?/,
      );
    });
    it("Function call without parens", function () {
      assert.match(
        compile(`
let add = (x,y) => x + y
add 10, 5
`),
        /\s*let add = \(x, ?y\) => \(?x \+ y\)?;?\s*add\(10, ?5\);?/,
      );
    });
  });
  describe("Test class", function () {
    it("Class with one method", function () {
      assert.match(
        compile(`
class Person
  def sayHello
    #log("Hello!")
  end
end
`),
        /\s*class Person\s*\{\s+sayHello = \(\) => \{\s*console.log\("Hello!"\);?\s*\};?\s*\}/,
      );
    });
  });
  describe("Test built-ins", function () {
    it("#log", function () {
      assert.match(compile("#log"), /console.log/);
    });
    it("#log hello world", function () {
      assert.match(
        compile('#log("Hello world!")'),
        /console.log\("Hello world!"\)/,
      );
    });
    it("#log hello world without parens", function () {
      assert.match(
        compile('#log "Hello world!"'),
        /console.log\("Hello world!"\)/,
      );
    });
    it("{x:1}.#log", function () {
      assert.match(compile("{x:1}.#log"), /console.log\(\{ ?x\: ?1 ?\}\);?/);
    });
  });
  describe("Creating functions", function () {
    it("def keyword", function () {
      assert.match(
        compile('def sayHello #log("hello") end'),
        /function sayHello\(\) {\s*console.log\("hello"\);?\s*}/,
      );
    });
    it("def keyword with args", function () {
      assert.match(
        compile('def sayHello(name) #log("hello", name) end'),
        /function sayHello\(name\) {\s*console.log\("hello", ?name\);?\s*}/,
      );
    });

    it("let keyword with function end", function () {
      assert.match(
        compile('let sayHello = function #log("hello") end'),
        /let sayHello = function \(\) {\s*console.log\("hello"\);?\s*}/,
      );
    });
    it("let keyword with function end with args", function () {
      assert.match(
        compile('let sayHello = function(name) #log("hello", name) end'),
        /let sayHello = function \(name\) {\s*console.log\("hello", ?name\);?\s*}/,
      );
    });
    it("let keyword with arrow function", function () {
      assert.match(
        compile("let giveMe5 = () => 5"),
        /let giveMe5 = \(\) => \(?5\)?/,
      );
    });
    it("let keyword with arrow function with args", function () {
      assert.match(
        compile("let echo = (x) => x"),
        /let echo = \(x\) => \(?x\)?/,
      );
    });

    it("inline with function end", function () {
      assert.match(
        compile('let f = function #log("hello") end'),
        /let f = function \(\) {\s*console.log\("hello"\);?\s*}/,
      );
    });
    it("inline with function end with args", function () {
      assert.match(
        compile('let f = function(x, name) #log("hello", name) end'),
        /let f = function \(x,\s*name\) {\s*console.log\("hello", ?name\);?\s*}/,
      );
    });
    it("inline with arrow function", function () {
      assert.match(compile("() => 5"), /\(\) => \(?5\)?/);
    });
    it("inline with arrow function with args no paren", function () {
      assert.match(compile("x => x"), /\(?x\)? => \(?x\)?/);
    });
    it("inline with arrow function with args", function () {
      assert.match(compile("(x) => x"), /\(x\) => \(?x\)?/);
    });

    it("let keyword with do end", function () {
      assert.match(
        compile('let sayHello = do #log("hello") end'),
        /let sayHello = function \(\) {\s*console.log\("hello"\);?\s*}/,
      );
    });
    it("let keyword with do end with args", function () {
      assert.match(
        compile('let sayHello = do |name| #log("hello", name) end'),
        /let sayHello = function \(name\) {\s*console.log\("hello", ?name\);?\s*}/,
      );
    });
  });
  describe("Test if statements", function () {
    it("if statements blocks", function () {
      assert.match(
        compile('if true #log("hello") end'),
        /\s*if \(true\) \{\s*console.log\("hello"\);?\s*\}/,
      );
    });

    it("if modifier", function () {
      assert.match(
        compile('let x; x = "10" if true'),
        /let x;\s*if \(?true\)? \{\s*x = "10";?\s*\}/,
      );
    });
    it("if statements blocks with elsif and else", function () {
      assert.match(
        compile(`if true
  x = 1
elsif false
  x = 2
else
  x = 3
end
`),
        /\s*if \(true\) \{\s*x = 1;\s*\} else if \(false\) \{\s*x = 2;\s*\} else \{\s*x = 3;\s*\}/,
      );
    });
  });
  describe("Test attribute accessor", function () {
    it("({x:5}).x", function () {
      assert.match(compile("({x:5}).x"), /\(\{ ?x\: ?5 ?\}\)\.x/);
    });
    it("let o; o.x", function () {
      assert.match(compile("let o; o.x"), /let o;\s*?o\.x;?/);
    });

    describe("Optional attribute accessor", function () {
      it("let o; o?.x", function () {
        assert.match(compile("let o; o?.x"), /let o;\s*?o\?\.x;?/);
      });
      it("let o; o?.x?.y", function () {
        assert.match(compile("let o; o?.x?.y"), /let o;\s*?o\?\.x\?\.y;?/);
      });
    });
  });
  describe("Test attribute setter", function () {
    it("let o; o.x = 10", function () {
      assert.match(compile("let o; o.x = 10"), /let o;\s*?o\.x ?= ?10;?/);
    });
  });
  describe("Values", function () {
    it("integer", function () {
      assert.match(compile("10"), /10/);
      assert.match(compile("1234"), /1234/);
    });
    it("float", function () {
      assert.match(compile("1.0"), /1.0/);
      assert.match(compile("12.34"), /12.34/);
    });

    describe("Language constant values", function () {
      it("true", function () {
        assert.match(compile("true"), /true/);
      });
      it("false", function () {
        assert.match(compile("false"), /false/);
      });
      it("null", function () {
        assert.match(compile("null"), /null/);
      });
      it("undefined", function () {
        assert.match(compile("undefined"), /undefined/);
      });
    });

    describe("Arrays", function () {
      it("[]", function () {
        assert.match(compile("[]"), /\[\]/);
      });
      it("[1,2,3]", function () {
        assert.match(compile("[1,2,3]"), /\[1, ?2, ?3\]/);
      });
    });
  });
  describe("Types", function () {
    describe("Variable declaration", function () {
      describe("Default types", function () {
        it("int", function () {
          assert.match(compile("int x"), /let x/);
        });
        it("int assignment", function () {
          assert.match(compile("int x = 0"), /let x = 0/);
        });
        it("float", function () {
          assert.match(compile("float x"), /let x/);
        });
        it("float assignment", function () {
          assert.match(compile("float x = 1.0"), /let x = 1\.0/);
        });
        it("string", function () {
          assert.match(compile("string x"), /let x/);
        });
        it("string assignment", function () {
          assert.match(compile('string x = "hello"'), /let x = "hello"/);
        });
        it("bool", function () {
          assert.match(compile("bool x"), /let x/);
        });
        it("bool assignment", function () {
          assert.match(compile("bool x = true"), /let x = true/);
        });
        it("array[]", function () {
          assert.match(compile("int[] x"), /let x/);
        });
        it("array[] assignment", function () {
          assert.match(compile("int[] x = [1,2,3]"), /let x = \[1, ?2, ?3\]/);
        });
      });
    });
  });
  describe("Test objects", function () {
    it("({})", function () {
      assert.match(compile("({})"), /\(\{\}\)/);
    });
    it("{x: 1}", function () {
      assert.match(compile("{x: 1}"), /\{\s*x\: ?1;?\s*\}/);
    });
    it("{x: 1, y: 2}", function () {
      assert.match(compile("{x: 1, y: 2}"), /\{\s*x\: ?1, y: 2\s*\}/);
    });
    it("key is quoted string", function () {
      assert.match(compile('{"x": 1}'), /\{\s*x\: ?1;?\s*\}/);
    });
  });
  describe("No group", function () {
    it("Test each do end", function () {
      assert.match(
        compile(`
  [1,2,3,4,5].each do |i|
    console.log i
  end
  `),
        /\s*\[1, 2, 3, 4, 5\]\.each\(function \(i\) \{\s*console\.log\(i\);?\s*\}\)\s*/,
      );
    });
    it("Pass named parameters to functions", function () {
      assert.match(compile("add x: 1, y: 2"), /add\(\{ x: 1, y: 2 \}\)/);
    });

    it("let shouldAddSemiToDec = 1", function () {
      assert.match(
        compile("let shouldAddSemiToDec = foo()[0]", { prettier: false }),
        /;\s*$/,
      );
    });
  });
  describe("Assignment", function () {
    it("let x = 1", function () {
      assert.match(compile("let x = 1"), /(var|let)\s+x\s*=\s*1/);
    });
  });
  describe("Operations", function () {
    describe("Inversion (! operator)", function () {
      it("!true", function () {
        assert.match(compile("!true"), /!true/);
      });
      it("!true === false", function () {
        assert.match(compile("!true === false"), /!true === false/);
      });
      it("!true === !false", function () {
        assert.match(compile("!true === !false"), /!true === !false/);
      });
      it("!true === !!false", function () {
        assert.match(compile("!true === !!false"), /!true === !!false/);
      });
    });
    describe("Mathematic operations", function () {
      it("addition", function () {
        assert.match(compile("1 + 2"), /1 \+ 2/);
        assert.match(compile("1 + 2 + 3"), /1 \+ 2 \+ 3/);
      });
      it("multiplication", function () {
        assert.match(compile("1 * 2"), /1 \* 2/);
        assert.match(compile("1 * 2 * 3"), /1 \* 2 \* 3/);
      });
      it("division", function () {
        assert.match(compile("8 / 2"), /8 \/ 2/);
        assert.match(compile("8 / 4 / 2"), /8 \/ 4 \/ 2/);
      });
      it("substraction", function () {
        assert.match(compile("8 - 2"), /8 \- 2/);
        assert.match(compile("8 - 2 - 3"), /8 \- 2 \- 3/);
      });
    });
    describe("Priority of operations", function () {});
  });
  describe('Test "ternary"', function () {
    it("true ? 1", function () {
      assert.match(compile("true ? 1"), /true \? 1 : null/);
    });

    it("false ? 1 : 0", function () {
      assert.match(compile("false ? 1 : 0"), /false \? 1 : 0/);
    });
  });
  describe("async", function () {});
};
