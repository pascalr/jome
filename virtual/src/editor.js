import {Parser} from "acorn"
import escodegen from "escodegen"

import mdToHtml from "@jome/md-to-html"

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
  document.getElementById('notebook-editor').innerHTML = data.metaDatas.filter(o => o.type === "md").map(o => mdToHtml(o.value)).join('')
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

function renderJomeCode() {
  
}

function renderNotebookView() {

}