//const {compile} = require('./compiler.js')
const {parse} = require('./parser.js')
const {compileNodes, compileCode} = require('./compiler.js')
const {tokenize} = require('./tokenizer.js')

const compile = (code) => {
  return compileCode(code, {writeScript: false})
}

/*
FIXMEEEE: Combining compiler and parser tests because I am having issues with depedencies: (running either separate OK)
TypeError: Cannot redefine property: length
        at Function.defineProperty (<anonymous>)

      1 | // import FirstMate from 'first-mate'
    > 2 | const FirstMate = require('first-mate')
        |                   ^
      3 |
      4 | const registry = new FirstMate.GrammarRegistry()
      5 | //registry.loadGrammarSync('./grammar/syntaxes/JavaScript.tmLanguage.json')

      at Object.<anonymous> (node_modules/oniguruma/src/oniguruma.js:108:8)
      at Object.<anonymous> (node_modules/first-mate/lib/grammar.js:10:10)
      at Object.<anonymous> (node_modules/first-mate/lib/grammar.js:395:4)
      at Object.<anonymous> (node_modules/first-mate/lib/grammar-registry.js:12:13)
      at Object.<anonymous> (node_modules/first-mate/lib/grammar-registry.js:273:4)
      at Object.<anonymous> (node_modules/first-mate/lib/first-mate.js:4:22)
      at Object.<anonymous> (node_modules/first-mate/lib/first-mate.js:14:4)
      at Object.require (src/tokenizer.js:2:19)
      at Object.require (src/compiler.js:9:38)
      at Object.require (src/compiler_and_parser.test.js:1:19)
*/

/*
I was wondering whether I want to write tests in Jome or in js. But I think I prefer to write them in
javascript because it is more stable. It is a little weird to compile tests in itself when the language is not stable yet.
*/

// class Counter(@count = 0)
//   def add(amount)
//     @count += amount
//   end
// end
// Counter() exec
//   add 1
//   add 2
// end

describe("Jome paths", () => {
  test('Dirname shortcuts', () => {
    expect(compile(`#.`)).toMatch(/__dirname/);
    expect(compile(`#./`)).toMatch(/__dirname/);
  })
  test('Absolute paths', () => {
    expect(compile(`#/`)).toMatch(/"\/"/);
    expect(compile(`#/some/path.ext`)).toMatch(/"\/some\/path\.ext"/);
  })
  test('Path relative to current file', () => {
    expect(compile(`#./some_file.ext`)).toMatch(/path.join\(__dirname, "some_file\.ext"\)/);
  })
  test('Path relative to the current working directory', () => {
    expect(compile(`#cwd/some_file.ext`)).toMatch(/path.resolve\("\.\/some_file\.ext"\)/);
  })
  test('Path in the current file parent folder', () => {
    expect(compile(`#..`)).toMatch(/path.join\(__dirname, ".."\)/);
    expect(compile(`#../`)).toMatch(/path.join\(__dirname, "..\/"\)/);
    expect(compile(`#../some_file.ext`)).toMatch(/path.join\(__dirname, "..\/some_file\.ext"\)/);
  })
  // I am not yet sure if I want to support this. It would be nice, but maybe #~ could be used for something else? Like signals?
  // test('Path in the home directory', () => {
  //   expect(compile(`#~`)).toMatch(/require\('os'\); os.homedir\(\)/);
  //   expect(compile(`#~/`)).toMatch(/require\('os'\); os.homedir\(\)/);
  //   expect(compile(`#~/some_file.ext`)).toMatch(/require\('os'\); path.join\(os.homedir\(\), 'some_file.ext'\)/);
  // })
})

test('Pass named parameters to functions', () => {
  expect(compile(`add x: 1, y: 2`)).toMatch(/add\(\{ x: 1, y: 2 \}\)/);
})

test('String format " test"%xl', () => {
  expect(compile(`" test"%xl`)).toMatch(/"test"/);
})

test('String interpolation "{1+1}"', () => {
  expect(compile(`"1 + 1 = {1+1}"`)).toMatch(/`1 \+ 1 = \$\{1 ?\+ ?1\}`/);
})

test('let shouldAddSemiToDec = 1', () => {
  expect(compile(`let shouldAddSemiToDec = foo()[0]`, {prettier: false})).toMatch(/;\s*$/);
})

test('<sh>ls</sh>', () => {
  expect(compile(`<sh>ls</sh>`)).toMatch(/const execSh = require\("jome-lib\/execSh"\);\s*execSh\(`ls`\);/);
})

test('# documentation comment', () => {
  expect(compile(`# documentation comment`)).toMatch(/\/\/ documentation comment/);
})

// test.only('WIP2', () => {
//   expect(compile(`
// `)).toBe("WIP2");
// })

// test('WIP', () => {
//   expect(compile(`
// `)).toBe("WIP");
// })

test('Test each do end', () => {
  expect(compile(`
[1,2,3,4,5].each do |i|
  console.log i
end
`)).toMatch(/\s*\[1, 2, 3, 4, 5\]\.each\(function \(i\) \{\s*console\.log\(i\);?\s*\}\)\s*/);
})

describe("Test arrow call", () => {
  test('obj->call', () => {
    expect(compile(`obj->call`)).toMatch(/obj.call\(\)/);
  })
})

describe("Test regex call", () => {
  test('/test1212/', () => {
    expect(compile(`/test1212/`)).toMatch("/test1212/");
  })
})

describe("Test function call", () => {
  test('Function call with parens', () => {
    expect(compile(`
let add = (x,y) => x + y
add(10, 5)
`)).toMatch(/\s*let add = \(x, ?y\) => \(?x \+ y\)?;?\s*add\(10, ?5\);?/);
  })
  test('Function call without parens', () => {
    expect(compile(`
let add = (x,y) => x + y
add 10, 5
`)).toMatch(/\s*let add = \(x, ?y\) => \(?x \+ y\)?;?\s*add\(10, ?5\);?/);
  })
})

describe("Test class", () => {
  test('Class with one method', () => {
    expect(compile(`
class Person
  def sayHello
    #log("Hello!")
  end
end
`)).toMatch(/\s*class Person\s*\{\s+sayHello = \(\) => \{\s*console.log\("Hello!"\);?\s*\};?\s*\}/);
  })
})

describe("Test utils", () => {
  test('#log', () => {
    expect(compile('#log')).toMatch(/console.log/);
  })
  test('#log hello world', () => {
    expect(compile('#log("Hello world!")')).toMatch(/console.log\("Hello world!"\)/);
  })
  test('#log hello world without parens', () => {
    expect(compile('#log "Hello world!"')).toMatch(/console.log\("Hello world!"\)/);
  })
  test('{x:1}.#log', () => {
    expect(compile('{x:1}.#log')).toMatch(/console.log\(\{ ?x\: ?1 ?\}\);?/);
  })
})

// ```jome
//   
//   ```

describe("Test functions creation", () => {
  /*
  The keyword def generates an arrow function. The keyword fn generates a function.
  You can also use the let keyword instead of def
  Functions can also be declared inline.
  */
  // def sayHello
  // end
  // let sayHello = function
  // end
  // let sayHello = function(name)
  // end
  // def sayHello(name)
  // end
  // let sayHello = (name) => `Hello {name}`
  // let giveMe5 = () => 5
  // and/or
  // let giveMe5 = => 5
  // *** KEYWORD def ***
  test('def keyword', () => {
    expect(compile('def sayHello #log("hello") end')).toMatch(/function sayHello\(\) {\s*console.log\("hello"\);?\s*}/);
  })
  test('def keyword with args', () => {
    expect(compile('def sayHello(name) #log("hello", name) end')).toMatch(/function sayHello\(name\) {\s*console.log\("hello", ?name\);?\s*}/);
  })
  // *** KEYWORD let ***
  test('let keyword with function end', () => {
    expect(compile('let sayHello = function #log("hello") end')).toMatch(/let sayHello = function \(\) {\s*console.log\("hello"\);?\s*}/);
  })
  test('let keyword with function end with args', () => {
    expect(compile('let sayHello = function(name) #log("hello", name) end')).toMatch(/let sayHello = function \(name\) {\s*console.log\("hello", ?name\);?\s*}/);
  })
  test('let keyword with arrow function', () => {
    expect(compile('let giveMe5 = () => 5')).toMatch(/let giveMe5 = \(\) => \(?5\)?/);
  })
  test('let keyword with arrow function with args', () => {
    expect(compile('let echo = (x) => x')).toMatch(/let echo = \(x\) => \(?x\)?/);
  })
  // *** inline ***
  test('inline with function end', () => {
    expect(compile('let f = function #log("hello") end')).toMatch(/let f = function \(\) {\s*console.log\("hello"\);?\s*}/);
  })
  test('inline with function end with args', () => {
    expect(compile('let f = function(x, name) #log("hello", name) end')).toMatch(/let f = function \(x,\s*name\) {\s*console.log\("hello", ?name\);?\s*}/);
  })
  test('inline with arrow function', () => {
    expect(compile('() => 5')).toMatch(/\(\) => \(?5\)?/);
  })
  test('inline with arrow function with args no paren', () => {
    expect(compile('x => x')).toMatch(/\(?x\)? => \(?x\)?/);
  })
  test('inline with arrow function with args', () => {
    expect(compile('(x) => x')).toMatch(/\(x\) => \(?x\)?/);
  })
  // *** KEYWORD do ***
  test('let keyword with do end', () => {
    expect(compile('let sayHello = do #log("hello") end')).toMatch(/let sayHello = function \(\) {\s*console.log\("hello"\);?\s*}/);
  })
  test('let keyword with do end with args', () => {
    expect(compile('let sayHello = do |name| #log("hello", name) end')).toMatch(/let sayHello = function \(name\) {\s*console.log\("hello", ?name\);?\s*}/);
  })
})

describe("Test if statements", () => {
  test('if statements blocks', () => {
    expect(compile('if true #log("hello") end')).toMatch(/\s*if \(true\) \{\s*console.log\("hello"\);?\s*\}/);
  })
  // An if modifier executes everything to it's left only if the condition is true
  test('if modifier', () => {
    expect(compile('let x; x = "10" if true')).toMatch(/let x;\s*if \(?true\)? \{\s*x = "10";?\s*\}/);
  })
  test('if statements blocks', () => {
    expect(compile(`if true
  x = 1
elsif false
  x = 2
else
  x = 3
end
`)).toMatch(/\s*if \(true\) \{\s*x = 1;\s*\} else if \(false\) \{\s*x = 2;\s*\} else \{\s*x = 3;\s*\}/);
  })
})

describe("Test attribute accessor", () => {
  test('({x:5}).x', () => {
    expect(compile('({x:5}).x')).toMatch(/\(\{ ?x\: ?5 ?\}\)\.x/);
  })
  test('let o; o.x', () => {
    expect(compile('let o; o.x')).toMatch(/let o;\s*?o\.x;?/);
  })
})

describe("Test attribute setter", () => {
  test('let o; o.x = 10', () => {
    expect(compile('let o; o.x = 10')).toMatch(/let o;\s*?o\.x ?= ?10;?/);
  })
})

test('let x = 1', () => {
  // FIXME: Do I want var or I want let? I used var because it is what CoffeeScript is using by default.
  expect(compile('let x = 1')).toMatch(/(var|let)\s+x\s*=\s*1/);
});





/*****************************************************/
/*********** TEST PARSER AND COMPILER *************/
/*****************************************************/

describe("Parse operation", () => {

  test('1 + 2', () => {
    let list = parse(tokenize("1+2").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('+')
    expect(ast?.operands?.[0]?.raw).toBe('1')
    expect(ast?.operands?.[1]?.raw).toBe('2')

    let out = compileNodes(list)
    expect(out).toMatch(/1\s*\+\s*2/)
  })

  test('2 + 3 * 4 + 5 == 19', () => {
    let list = parse(tokenize("2 + 3 * 4 + 5 == 19").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('==')
    expect(ast?.operands?.[0]?.raw).toBe('+')
    expect(ast?.operands?.[0]?.operands?.[0]?.raw).toBe('+')
    expect(ast?.operands?.[0]?.operands?.[0]?.operands?.[0]?.raw).toBe('2')
    expect(ast?.operands?.[0]?.operands?.[0]?.operands?.[1]?.raw).toBe('*')
    expect(ast?.operands?.[0]?.operands?.[0]?.operands?.[1]?.operands?.[0]?.raw).toBe('3')
    expect(ast?.operands?.[0]?.operands?.[0]?.operands?.[1]?.operands?.[1]?.raw).toBe('4')
    expect(ast?.operands?.[0]?.operands?.[1]?.raw).toBe('5')
    expect(ast?.operands?.[1]?.raw).toBe('19')
  })
})

describe("Parse let assignment", () => {

  test('let x', () => {
    let list = parse(tokenize("let x").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('let x')
  })

  test('let x;', () => {
    let list = parse(tokenize("let x;").children)
    expect(list?.length).toBe(2)
    let ast = list[0]
    expect(ast?.raw).toBe('let x')
  })

  test('let x; let y', () => {
    let list = parse(tokenize("let x; let y").children)
    expect(list?.length).toBe(3)
    expect(list[0]?.raw).toBe('let x')
    expect(list[2]?.raw).toBe('let y')
  })

  test('[1][0]', () => {
    let list = parse(tokenize("[1][0]").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.parts?.length).toBe(3) // [, 1, ]
    expect(ast?.operands?.length).toBe(1)
    expect(ast?.operands?.[0]?.parts?.length).toBe(3) // [, 0, ]
  })

})

describe("Test values", () => {
  test('integer', () => {
    expect(compile('10')).toMatch(/10/);
    expect(compile('1234')).toMatch(/1234/);
  })
  test('float', () => {
    expect(compile('1.0')).toMatch(/1.0/);
    expect(compile('12.34')).toMatch(/12.34/);
  })
  test('string', () => {
    expect(compile('"hello"')).toMatch(/"hello"/);
    //expect(compile('`hello`')).toMatch(/`hello`/);
    expect(compile(`'hello'`)).toMatch(/'hello'|"hello"/);
    expect(compile(`"multi
line"`)).toMatch(/`multi\r?\nline`/);
  })
})

describe("Test objects", () => {
  test('({})', () => {
    expect(compile('({})')).toMatch(/\(\{\}\)/);
  })
  test('{x: 1}', () => {
    expect(compile('{x: 1}')).toMatch(/\{\s*x\: ?1;?\s*\}/);
  })
})

describe("Test arrays", () => {
  test('[]', () => {
    expect(compile('[]')).toMatch(/\[\]/);
  })
  test('[1,2,3]', () => {
    expect(compile('[1,2,3]')).toMatch(/\[1, ?2, ?3\]/);
  })
})

test('!true', () => {
  expect(compile('!true')).toMatch(/!true/);
})
test('!true === false', () => {
  expect(compile('!true === false')).toMatch(/!true === false/);
})
test('!true === !false', () => {
  expect(compile('!true === !false')).toMatch(/!true === !false/);
})
test('!true === !!false', () => {
  expect(compile('!true === !!false')).toMatch(/!true === !!false/);
})

describe('Test "ternary"', () => {
  test('true ? 1', () => {
    expect(compile('true ? 1')).toMatch(/true \? 1 : null/);
  })
  // C'est quand même plus beau cond ? val1 : val2
  test('false ? 1 : 0', () => {
    expect(compile('false ? 1 : 0')).toMatch(/false \? 1 : 0/);
  })
})



// ************************************************************
// ************************************************************
// ************************************************************
// ********************** TODO ********************************
// ************************************************************
// ************************************************************
// ************************************************************

// You can pass arguments for a single object without using curly braces.
//   let add = ({x, y}) => x + y
//   add x: 10, y: 5



// obj->density = 1.05 // def density=(val) // TODO: WIP
