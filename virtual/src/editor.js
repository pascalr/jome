import {Parser} from "acorn"
import escodegen from "escodegen"

import sample01 from '../samples/torque_calculator.js.txt'

document.addEventListener('DOMContentLoaded', function() {
  let src = sample01
  let data = parseJs(src)
  escodegen.attachComments(data.ast, data.comments, data.tokens);
  let str = escodegen.generate(data.ast, {comment: true})
  console.log(data)
  console.log(str)
  let highlighted = hljs.highlight(src, {language: 'js'}).value
  document.getElementById('output-editor').innerHTML = highlighted
  console.log('==>', data.metaData)
  document.getElementById('notebook-editor').innerText = data.metaData.filter(o => o.first === '@md').map(o => o.value).join('\n')
});

// Converts js code to Asbstract Syntax Tree
function parseJs(js) {
  let allComments = [], tokens = [], comments = [], metaData = [];
  let ast = Parser.parse(js, {
    ecmaVersion: 6,
    ranges: true,
    onComment: allComments,
    onToken: tokens
  })
  allComments.forEach(comment => {
    console.log(comment)
    if (comment.value[0] === '~') {
      metaData.push(comment)
    } else {
      comments.push(comment)
    }
  })
  metaData.forEach(data => {
    let first = data.value.slice(1).trimLeft().match(/^@\w+/)
    if (first) {
      data.first = first[0]
    }
  })
  return {ast, comments, tokens, metaData}
}