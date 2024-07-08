import {Parser} from "acorn"
import escodegen from "escodegen"

import sample01 from '../samples/torque_calculator.js.txt'

/**
 * The data analyzed inside a jome meta data comment delimited by `/*~` and *\/`
 */
class MetaData {
  constructor(type, value) {
    this.type = type // The main type of the meta data. Ex: unit, function, class, md, ...
    this.value = value // The text value of the meta data.
  }
}

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
  document.getElementById('notebook-editor').innerText = data.metaDatas.filter(o => o.type === "md").map(o => o.value).join('\n')
});

function parseMetaDatas(metaDataComments) {
  const metaDatas = []
  metaDataComments.forEach(data => {
    // FIXME: parse properly so not spliting inside string
    let parts = data.value.split(/(~\w+)/g)
    if (parts.length >= 3) {
      metaDatas.push(new MetaData(parts[1].slice(1), parts[2]))
    }
    // for (let i = 1; i < parts.length; i++) {
    //   let label = parts[i].slice(1)
    //   let value = parts[i+1]
    //   metaData[label] = value
    // }
  })
  console.log("metaDatas: ", metaDatas)
  return metaDatas
}

// Converts js code to Asbstract Syntax Tree
function parseJs(js) {
  let allComments = [], tokens = [], comments = [], metaDataComments = [];
  let ast = Parser.parse(js, {
    ecmaVersion: 6,
    ranges: true,
    onComment: allComments,
    onToken: tokens
  })
  allComments.forEach(comment => {
    console.log(comment)
    if (comment.value[0] === '~') {
      metaDataComments.push(comment)
    } else {
      comments.push(comment)
    }
  })
  const metaDatas = parseMetaDatas(metaDataComments)
  return {ast, comments, tokens, metaDatas}
}