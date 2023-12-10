//const {compile} = require('./compiler.js')
const {parse,compilePP} = require('./parser.js')
const {tokenize} = require('./tokenizer.js')

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

function compile(code) {
  return compilePP(parse(tokenize(code).children))
}

describe("Test utils", () => {
  test('#log', () => {
    expect(compile('#log("Hello world!")')).toMatch(/console.log\("Hello world!"\)/);
  })
})

describe("Test functions creation", () => {
  /*
  The keyword def generates an arrow function. The keyword fn generates a function.
  You can also use the let keyword instead of def
  Functions can also be declared inline.
  */
  // *** KEYWORD def ***
  test('def keyword with do end', () => {
    expect(compile('def sayHello do #log("hello") end')).toMatch(/let sayHello = \(\) => {\s*console.log\("hello"\)\s*}/);
  })
  test('def keyword with do end with args', () => {
    expect(compile('def sayHello do |name| #log("hello", name) end')).toMatch(/let sayHello = \(name\) => {\s*console.log\("hello", name\)\s*}/);
  })
  test('def keyword with arrow function', () => {
    expect(compile('def giveMe5 => 5')).toMatch(/let giveMe5 = \(\) => 5/);
  })
  test('def keyword with arrow function with args', () => {
    expect(compile('def echo |x| => x')).toMatch(/let echo = \(x\) => x/);
  })
  // *** KEYWORD let ***
  test('let keyword with do end', () => {
    expect(compile('let sayHello = do #log("hello") end')).toMatch(/let sayHello = \(\) => {\s*console.log\("hello"\)\s*}/);
  })
  test('let keyword with do end with args', () => {
    expect(compile('let sayHello = do |name| #log("hello", name) end')).toMatch(/let sayHello = \(name\) => {\s*console.log\("hello", name\)\s*}/);
  })
  test('let keyword with arrow function', () => {
    expect(compile('let giveMe5 = => 5')).toMatch(/let giveMe5 = \(\) => 5/);
  })
  test('let keyword with arrow function with args', () => {
    expect(compile('let echo = |x| => x')).toMatch(/let echo = \(x\) => x/);
  })
  // *** KEYWORD fn ***
  test('fn keyword with do end', () => {
    expect(compile('fn sayHello do #log("hello") end')).toMatch(/function sayHello {\s*console.log\("hello"\)\s*}/);
  })
  test('fn keyword with do end with args', () => {
    expect(compile('fn sayHello do |name| #log("hello", name) end')).toMatch(/function sayHello\(name\) {\s*console.log\("hello", name\)\s*}/);
  })
  test('fn keyword with arrow function', () => {
    expect(compile('fn giveMe5 => 5')).toMatch(/function giveMe5() {return 5;?}/);
  })
  test('fn keyword with arrow function with args', () => {
    expect(compile('fn echo |x| => x')).toMatch(/function echo\(x\) {return x;?}/);
  })
  // *** inline ***
  test('inline with do end', () => {
    expect(compile('do #log("hello") end')).toMatch(/\(\) => {\s*console.log\("hello"\)\s*}/);
  })
  test('inline with do end with args', () => {
    expect(compile('do |name| #log("hello", name) end')).toMatch(/\(name\) => {\s*console.log\("hello", name\)\s*}/);
  })
  test('inline with arrow function', () => {
    expect(compile('=> 5')).toMatch(/\(\) => 5/);
  })
  test('inline with arrow function with args', () => {
    expect(compile('|x| => x')).toMatch(/\(x\) => x/);
  })
  // *** inline with fn keyword ***
  test('inline with fn keyword with do end', () => {
    expect(compile('fn do #log("hello") end')).toMatch(/function {\s*console.log\("hello"\)\s*}/);
  })
  test('inline with fn keyword with do end with args', () => {
    expect(compile('fn do |name| #log("hello", name) end')).toMatch(/function \(name\) {\s*console.log\("hello", name\)\s*}/);
  })
  test('inline with fn keyword with arrow function', () => {
    expect(compile('fn => 5')).toMatch(/function () {return 5;?}/);
  })
  test('inline with fn keyword with arrow function with args', () => {
    expect(compile('fn |x| => x')).toMatch(/function \(x\) {return x;?}/);
  })
})

describe("Test if statements", () => {
  test('if statements use parentheses and not square brackets', () => {
    expect(compile('if (true) (/* some code */)')).toMatch(/\s*if \(true\) \{\s*\}/); // FIXME: Should keep comment
  })
})

test('let x = 1', () => {
  // FIXME: Do I want var or I want let? I used var because it is what CoffeeScript is using by default.
  expect(compile('let x = 1')).toMatch(/var x = 1/);
});





/*****************************************************/
/*********** TEST PARSER AND COMPILER_PP *************/
/*****************************************************/

describe("Parse operation", () => {

  test('1 + 2', () => {
    let list = parse(tokenize("1+2").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('+')
    expect(ast?.children?.[0]?.raw).toBe('1')
    expect(ast?.children?.[1]?.raw).toBe('2')

    let out = compilePP(list)
    expect(out).toMatch(/1\s*\+\s*2/)
  })

  test('2 + 3 * 4 + 5 == 19', () => {
    let list = parse(tokenize("2 + 3 * 4 + 5 == 19").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('==')
    expect(ast?.children?.[0]?.raw).toBe('+')
    expect(ast?.children?.[0]?.children?.[0]?.raw).toBe('+')
    expect(ast?.children?.[0]?.children?.[0]?.children?.[0]?.raw).toBe('2')
    expect(ast?.children?.[0]?.children?.[0]?.children?.[1]?.raw).toBe('*')
    expect(ast?.children?.[0]?.children?.[0]?.children?.[1]?.children?.[0]?.raw).toBe('3')
    expect(ast?.children?.[0]?.children?.[0]?.children?.[1]?.children?.[1]?.raw).toBe('4')
    expect(ast?.children?.[0]?.children?.[1]?.raw).toBe('5')
    expect(ast?.children?.[1]?.raw).toBe('19')
  })
})

describe("Parse let assignment", () => {

  test('let x', () => {
    let list = parse(tokenize("let x").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('let')
    expect(ast?.children?.[0]?.raw).toBe('x')
  })

  test('let x;', () => {
    let list = parse(tokenize("let x;").children)
    expect(list?.length).toBe(2)
    let ast = list[0]
    expect(ast?.raw).toBe('let')
    expect(ast?.children?.[0]?.raw).toBe('x')
  })

  test('let x; let y', () => {
    let list = parse(tokenize("let x; let y").children)
    expect(list?.length).toBe(3)
    expect(list[0]?.raw).toBe('let')
    expect(list[0]?.children?.[0]?.raw).toBe('x')
    expect(list[2]?.raw).toBe('let')
    expect(list[2]?.children?.[0]?.raw).toBe('y')
  })

})

describe("Parse def assignment", () => {

  test('def x 10', () => {
    let list = parse(tokenize("def x 10").children)
    expect(list?.length).toBe(1)
    let ast = list[0]
    expect(ast?.raw).toBe('def')
    expect(ast?.children?.[0]?.raw).toBe('x')
    expect(ast?.children?.[1]?.raw).toBe('10')

    let out = compilePP(list)
    expect(out).toMatch(/(let|var|const)\s+x\s*=\s*10/)
  })

})