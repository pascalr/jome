const assert = require("assert/strict");
const { compileCode } = require("../src/compiler.js");
const { describe, it } = require("minispec");
module.exports = () => {
  function compile(code) {
    return compileCode(code, { writeScript: false });
  }
  function testCompile(code, expectedResult) {
    assert.match(compile(code), expectedResult);
  }
  describe("Paths", function () {
    it("Dirname shortcuts", function () {
      testCompile("#.", /__dirname/);
      testCompile("#./", /__dirname/);
    });
    it("Absolute paths", function () {
      testCompile("#/", /"\/"/);
      testCompile("#/some/path.ext", /"\/some\/path\.ext"/);
    });
    it("Path relative to current file", function () {
      testCompile(
        "#./some_file.ext",
        /path.join\(__dirname, "some_file\.ext"\)/,
      );
    });
    it("Path relative to the current working directory", function () {
      testCompile("#cwd/some_file.ext", /path.resolve\("\.\/some_file\.ext"\)/);
    });
    it("Path in the current file parent folder", function () {
      testCompile("#..", /path.join\(__dirname, ".."\)/);
      testCompile("#../", /path.join\(__dirname, "..\/"\)/);
      testCompile(
        "#../some_file.ext",
        /path.join\(__dirname, "..\/some_file\.ext"\)/,
      );
    });

    it.skip("Path in the home directory", function () {
      testCompile("#~", /require\('os'\); os.homedir\(\)/);
      testCompile("#~/", /require\('os'\); os.homedir\(\)/);
      testCompile(
        "#~/some_file.ext",
        /require\('os'\); path.join\(os.homedir\(\), 'some_file.ext'\)/,
      );
    });
  });
  describe("Imports", function () {
    it("Default import Jome file", function () {
      testCompile(
        'import execute from "execute.jome"',
        /const execute = require\("execute.js"\)/,
      );
    });
    it("Default import", function () {
      testCompile(
        'import name from "module-name"',
        /const (\w+) = require\("module-name"\);\s*const name = \1.default;/,
      );
    });
    it("Star import", function () {
      testCompile(
        'import * as name from "module-name"',
        /const name = require\("module-name"\)/,
      );
    });
    it("Deconstructed import", function () {
      testCompile(
        'import { name } from "module-name"',
        /const { ?name ?} = require\("module-name"\)/,
      );
      testCompile(
        'import { name, name2 } from "module-name"',
        /const { ?name, name2 ?} = require\("module-name"\)/,
      );
    });
    it("Alias deconstructed import", function () {
      testCompile(
        'import { name as otherName } from "module-name"',
        /const { name: otherName } = require\("module-name"\)/,
      );
      testCompile(
        'import { normal, name as otherName } from "module-name"',
        /const { normal, name: otherName } = require\("module-name"\)/,
      );
    });
    it("Alias deconstructed import with default", function () {
      testCompile(
        'import def, { name as otherName } from "module-name"',
        /const (\w+) = require\("module-name"\);\s*const { ?default: def, name: otherName ?} = \1;/,
      );
    });

    it("Default import and deconstructed", function () {
      testCompile(
        'import name, { foo } from "module-name"',
        /const (\w+) = require\("module-name"\);\s*const { ?default: name, foo ?} = \1;/,
      );
    });
    it("Default import and star import", function () {
      testCompile(
        'import name, * as all from "module-name"',
        /const (\w+) = require\("module-name"\);\s*const { ?default: name, ...all ?} = \1;/,
      );
    });

    describe("Common JS imports", function () {
      it("Import all", function () {
        testCompile(
          'import name : "module-name"',
          /const name = require\("module-name"\);/,
        );
      });
      it("Import deconstructed", function () {
        testCompile(
          'import { foo, bar } : "module-name"',
          /const { ?foo, ?bar ?} = require\("module-name"\);/,
        );
      });
    });
  });
  describe("Strings", function () {
    it("Single quote strings", function () {
      testCompile("'hello Éric'", /"hello Éric"/);
      testCompile(
        "let code = 'if (cond) {return 0;}'",
        /let code = "if \(cond\) {return 0;}"/,
      );

      testCompile(
        `'multi
    line'`,
        /`multi\s+line`/,
      );

      testCompile("'\"hello\"'", /"\\"hello\\""/);

      testCompile(
        `'multi \`line\`
    with backticks'`,
        /`multi \\`line\\`\s+with backticks`/,
      );
    });
    it("Regular double quote strings", function () {
      testCompile('"hello"', /"hello"/);
      testCompile('"Hello Éric!"', /"Hello Éric!"/);

      testCompile(
        `"multi
    line"`,
        /`multi\s+line`/,
      );
      testCompile('"Hello O\'Connor"', /"Hello O'Connor"/);

      testCompile(
        `"multi \`line\`
    with backticks"`,
        /`multi \\`line\\`\s+with backticks`/,
      );
    });
    it("Double quote strings template literal", function () {
      testCompile('"1 + 1 = {1+1}"', /`1 \+ 1 = \$\{1 ?\+ ?1\}`/);
    });
    it("Triple single quote strings", function () {
      testCompile("'''Hello O'Connor'''", /"Hello O'Connor"/);
    });
  });
  describe("Regexes", function () {
    it("/test1212/", testCompile("/test1212/", /\/test1212\//));
  });
  describe("Heredocs", function () {
    it("<sh>ls</sh>", function () {
      testCompile(
        "<sh>ls</sh>",
        /const execSh = require\("@jome\/core\/execSh"\);\s*execSh\("ls"\);/,
      );
    });
    describe("Heredoc percent syntax", function () {
      it('"ls"%sh', function () {
        testCompile(
          '"ls"%sh',
          /const execSh = require\("@jome\/core\/execSh"\);\s*execSh\("ls"\);/,
        );
      });
    });
  });
  describe("Comments", function () {
    describe("Documentation comments", function () {
      it("Documentation comments should be compiled into js comments", function () {
        testCompile("# documentation comment", /\/\/ documentation comment/);
      });
    });
  });
  describe("Test arrow call", function () {
    it("obj->call", function () {
      testCompile("obj->call", /obj.call\(\)/);
    });
  });
  describe("Test function call", function () {
    it("Function call with parens", function () {
      testCompile(
        `
let add = (x,y) => x + y
add(10, 5)
`,
        /\s*let add = \(x, ?y\) => \(?x \+ y\)?;?\s*add\(10, ?5\);?/,
      );
    });
    it("Function call without parens", function () {
      testCompile(
        `
let add = (x,y) => x + y
add 10, 5
`,
        /\s*let add = \(x, ?y\) => \(?x \+ y\)?;?\s*add\(10, ?5\);?/,
      );
    });
    it("Function call without parens with entry", function () {
      testCompile(
        `
let idle = (options) => 10
idle delay: 20
`,
        /\s*let idle = \(options\) => \(10\)?;?\s*idle\(\{delay: ?20\}\);?/,
      );
    });
    it("Function call with shorthand key entry", function () {
      testCompile(
        `
let delay = 20
let idle = (options) => 10
idle :delay
`,
        /WTF!!!!!!!!!!!!!!!!!!!!!!!!!!/,
      );
    });
    it("Function call with shorthand boolean entry", function () {
      testCompile(
        `
let idle = (options) => 10
idle :force!
`,
        /WTF!!!!!!!!!!!!!!!!!!!!!!!!!!/,
      );
    });
  });
  describe("Test class", function () {
    it("Class with one method", function () {
      testCompile(
        `
class Person
  def sayHello
    #log("Hello!")
  end
end
`,
        /\s*class Person\s*\{\s+sayHello = \(\) => \{\s*console.log\("Hello!"\);?\s*\};?\s*\}/,
      );
    });
  });
  describe("Test built-ins", function () {
    it("#keys", testCompile("#keys({})", /Object.keys\(\{\}\)/));
    it("#values", testCompile("#values({})", /Object.values\(\{\}\)/));
    it("#entries", testCompile("#entries({})", /Object.entries\(\{\}\)/));
    it("#argv", testCompile("#argv", /process.argv/));
    it("#PI", testCompile("#PI", /Math.PI/));
    it("#global", testCompile("#global", /globalThis/));
    it("#env", testCompile("#env", /process.env/));
    it("#log", testCompile("#log", /console.log/));

    it("#log hello world", function () {
      testCompile('#log("Hello world!")', /console.log\("Hello world!"\)/);
    });
    it("#log hello world without parens", function () {
      testCompile('#log "Hello world!"', /console.log\("Hello world!"\)/);
    });
    it("{x:1}.#log", function () {
      testCompile("{x:1}.#log", /console.log\(\{ ?x\: ?1 ?\}\);?/);
    });
  });
  describe("Creating functions", function () {
    it("def keyword", function () {
      testCompile(
        'def sayHello #log("hello") end',
        /function sayHello\(\) {\s*console.log\("hello"\);?\s*}/,
      );
    });
    it("def keyword with args", function () {
      testCompile(
        'def sayHello(name) #log("hello", name) end',
        /function sayHello\(name\) {\s*console.log\("hello", ?name\);?\s*}/,
      );
    });

    it("let keyword with function end", function () {
      testCompile(
        'let sayHello = function #log("hello") end',
        /let sayHello = function \(\) {\s*console.log\("hello"\);?\s*}/,
      );
    });
    it("let keyword with function end with args", function () {
      testCompile(
        'let sayHello = function(name) #log("hello", name) end',
        /let sayHello = function \(name\) {\s*console.log\("hello", ?name\);?\s*}/,
      );
    });
    it("let keyword with arrow function", function () {
      testCompile("let giveMe5 = () => 5", /let giveMe5 = \(\) => \(?5\)?/);
    });
    it("let keyword with arrow function with args", function () {
      testCompile("let echo = (x) => x", /let echo = \(x\) => \(?x\)?/);
    });

    it("inline with function end", function () {
      testCompile(
        'let f = function #log("hello") end',
        /let f = function \(\) {\s*console.log\("hello"\);?\s*}/,
      );
    });
    it("inline with function end with args", function () {
      testCompile(
        'let f = function(x, name) #log("hello", name) end',
        /let f = function \(x,\s*name\) {\s*console.log\("hello", ?name\);?\s*}/,
      );
    });
    it("inline with arrow function", function () {
      testCompile("() => 5", /\(\) => \(?5\)?/);
    });
    it("inline with arrow function with args no paren", function () {
      testCompile("x => x", /\(?x\)? => \(?x\)?/);
    });
    it("inline with arrow function with args", function () {
      testCompile("(x) => x", /\(x\) => \(?x\)?/);
    });

    it("let keyword with do end", function () {
      testCompile(
        'let sayHello = do #log("hello") end',
        /let sayHello = function \(\) {\s*console.log\("hello"\);?\s*}/,
      );
    });
    it("let keyword with do end with args", function () {
      testCompile(
        'let sayHello = do |name| #log("hello", name) end',
        /let sayHello = function \(name\) {\s*console.log\("hello", ?name\);?\s*}/,
      );
    });

    describe("With curly braces", function () {
      it("inline with arrow function with args", function () {
        testCompile("(x) => x", /\(x\) => \(?x\)?/);
      });
    });
  });
  describe("Test if statements", function () {
    it("if statements blocks", function () {
      testCompile(
        'if true #log("hello") end',
        /\s*if \(true\) \{\s*console.log\("hello"\);?\s*\}/,
      );
    });

    it("if modifier", function () {
      testCompile(
        'let x; x = "10" if true',
        /let x;\s*if \(?true\)? \{\s*x = "10";?\s*\}/,
      );
    });
    it("if statements blocks with elsif and else", function () {
      testCompile(
        `if true
  x = 1
elsif false
  x = 2
else
  x = 3
end
`,
        /\s*if \(true\) \{\s*x = 1;\s*\} else if \(false\) \{\s*x = 2;\s*\} else \{\s*x = 3;\s*\}/,
      );
    });
  });
  describe("Test attribute accessor", function () {
    it("({x:5}).x", function () {
      testCompile("({x:5}).x", /\(\{ ?x\: ?5 ?\}\)\.x/);
    });
    it("let o; o.x", function () {
      testCompile("let o; o.x", /let o;\s*?o\.x;?/);
    });

    describe("Optional attribute accessor", function () {
      it("let o; o?.x", function () {
        testCompile("let o; o?.x", /let o;\s*?o\?\.x;?/);
      });
      it("let o; o?.x?.y", function () {
        testCompile("let o; o?.x?.y", /let o;\s*?o\?\.x\?\.y;?/);
      });
    });
  });
  describe("Test attribute setter", function () {
    it("let o; o.x = 10", function () {
      testCompile("let o; o.x = 10", /let o;\s*?o\.x ?= ?10;?/);
    });
  });
  describe("Values", function () {
    it("integer", function () {
      testCompile("10", /10/);
      testCompile("1234", /1234/);
    });
    it("float", function () {
      testCompile("1.0", /1.0/);
      testCompile("12.34", /12.34/);
    });

    describe("Language constant values", function () {
      it("true", testCompile("true", /true/));
      it("false", testCompile("false", /false/));
      it("null", testCompile("null", /null/));
      it("undefined", testCompile("undefined", /undefined/));
    });

    describe("Arrays", function () {
      it("[]", testCompile("[]", /\[\]/));
      it("[1,2,3]", testCompile("[1,2,3]", /\[1, ?2, ?3\]/));
    });
  });
  describe("Types", function () {
    describe("Variable declaration", function () {
      describe("Default types with type before", function () {
        it("int", testCompile("int x", /let x/));
        it("int assignment", testCompile("int x = 0", /let x = 0/));
        it("float", testCompile("float x", /let x/));
        it("float assignment", testCompile("float x = 1.0", /let x = 1\.0/));
        it("string", testCompile("string x", /let x/));
        it(
          "string assignment",
          testCompile('string x = "hello"', /let x = "hello"/),
        );
        it("bool", testCompile("bool x", /let x/));
        it("bool assignment", testCompile("bool x = true", /let x = true/));
        it("int[]", testCompile("int[] x", /let x/));
        it(
          "int[] assignment",
          testCompile("int[] x = [1,2,3]", /let x = \[1, ?2, ?3\]/),
        );
      });
      describe("Default types with type after", function () {
        it("int", testCompile("let x : int", /let x/));
        it("int assignment", testCompile("let x : int = 0", /let x = 0/));
        it("float", testCompile("let x : float", /let x/));
        it(
          "float assignment",
          testCompile("let x : float = 1.0", /let x = 1\.0/),
        );
        it("string", testCompile("let x : string", /let x/));
        it(
          "string assignment",
          testCompile('let x : string = "hello"', /let x = "hello"/),
        );
        it("bool", testCompile("let x : bool", /let x/));
        it(
          "bool assignment",
          testCompile("let x : bool = true", /let x = true/),
        );
        it("int[]", testCompile("let x : int[]", /let x/));
        it(
          "int[] assignment",
          testCompile("let x : int[] = [1,2,3]", /let x = \[1, ?2, ?3\]/),
        );
      });
    });
  });
  describe("Test objects", function () {
    it("({})", testCompile("({})", /\(\{\}\)/));
    it("{x: 1}", testCompile("{x: 1}", /\{\s*x\: ?1;?\s*\}/));
    it("{x: 1, y: 2}", testCompile("{x: 1, y: 2}", /\{\s*x\: ?1, y: 2\s*\}/));
    it("key is quoted string", testCompile('{"x": 1}', /\{\s*x\: ?1;?\s*\}/));
  });
  describe("No group", function () {
    it("Test each do end", function () {
      testCompile(
        `
  [1,2,3,4,5].each do |i|
    console.log i
  end
  `,
        /\s*\[1, 2, 3, 4, 5\]\.each\(function \(i\) \{\s*console\.log\(i\);?\s*\}\)\s*/,
      );
    });
    it("Pass named parameters to functions", function () {
      testCompile("add x: 1, y: 2", /add\(\{ x: 1, y: 2 \}\)/);
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
      testCompile("let x = 1", /(var|let)\s+x\s*=\s*1/);
    });
  });
  describe("Operations", function () {
    describe("Inversion (! operator)", function () {
      it("!true", testCompile("!true", /!true/));
      it("!true === false", testCompile("!true === false", /!true === false/));
      it(
        "!true === !false",
        testCompile("!true === !false", /!true === !false/),
      );
      it(
        "!true === !!false",
        testCompile("!true === !!false", /!true === !!false/),
      );
    });
    describe("Mathematic operations", function () {
      it("addition", function () {
        testCompile("1 + 2", /1 \+ 2/);
        testCompile("1 + 2 + 3", /1 \+ 2 \+ 3/);
      });
      it("multiplication", function () {
        testCompile("1 * 2", /1 \* 2/);
        testCompile("1 * 2 * 3", /1 \* 2 \* 3/);
      });
      it("division", function () {
        testCompile("8 / 2", /8 \/ 2/);
        testCompile("8 / 4 / 2", /8 \/ 4 \/ 2/);
      });
      it("substraction", function () {
        testCompile("8 - 2", /8 \- 2/);
        testCompile("8 - 2 - 3", /8 \- 2 \- 3/);
      });
    });
    describe("Priority of operations", function () {});
  });
  describe('Test "ternary"', function () {
    it("true ? 1", testCompile("true ? 1", /true \? 1 : null/));

    it("false ? 1 : 0", testCompile("false ? 1 : 0", /false \? 1 : 0/));
  });
  describe("async", function () {});
};
