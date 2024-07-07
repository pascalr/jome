const {Parser} = require("acorn")
const escodegen = require("escodegen")

let comments = [], tokens = [];
let ast = Parser.parse("let x = 1 /** @unit m */ // Some comment", {
  ecmaVersion: 6,
  ranges: true,
  onComment: comments,
  onToken: tokens
})
escodegen.attachComments(ast, comments, tokens);
let str = escodegen.generate(ast, {comment: true})

console.log(ast)
console.log(str)