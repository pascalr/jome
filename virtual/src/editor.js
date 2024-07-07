import {Parser} from "acorn"
import escodegen from "escodegen"

import sample01 from '../samples/torque_calculator.js.txt'

document.addEventListener('DOMContentLoaded', function() {
  let src = sample01
  let ast = jsToAst(src)
  escodegen.attachComments(ast.root, ast.comments, ast.tokens);
  let str = escodegen.generate(ast.root, {comment: true})
  console.log(ast)
  console.log(str)
  let highlighted = hljs.highlight(src, {language: 'js'}).value
  document.getElementById('output-editor').innerHTML = highlighted
});

// Converts js code to Asbstract Syntax Tree
function jsToAst(js) {
  let comments = [], tokens = [];
  let root = Parser.parse(js, {
    ecmaVersion: 6,
    ranges: true,
    onComment: comments,
    onToken: tokens
  })
  return {root, comments, tokens}
}