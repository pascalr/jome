import {Parser} from "acorn"
import {LooseParser} from "acorn-loose"
import acornJomeParser from "./acorn_jome_parser"
import escodegen from "escodegen"
//import { ESLint } from "eslint";// import { parse } from "@babel/parser"; // maybe try these instead
// import generate from "@babel/generator"; // maybe try these instead

import * as prettier from "prettier"
import pluginBabel from "prettier/plugins/babel";
import pluginEstree from "prettier/plugins/estree";
// import pluginHtml from "prettier/plugins/html";
// import prettier from "@prettier/sync";

import mdToHtml from "@jome/md-to-html"

import sample01 from '../samples/torque_calculator.js.txt'

const JomeJsParser = Parser.extend(acornJomeParser)
const JomeJsLooseParser = LooseParser.extend(acornJomeParser)

// Create an instance of ESLint with the configuration passed to the function
// function createESLintInstance(overrideConfig) {
//   return new ESLint({
//     overrideConfigFile: true,
//     overrideConfig,
//     fix: true,
//   });
// }

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
  renderOutputCode(data, (html) => {
    document.getElementById('output-editor').innerHTML = html
  })
  document.getElementById('notebook-editor').innerHTML = renderNotebookView(data)
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
  let ast;
  try {
    ast = JomeJsParser.parse(js, {
      ecmaVersion: 6,
      ranges: true,
      onComment: allComments,
      onToken: tokens
    })
  } catch (e) {
    allComments = [], tokens = [], comments = [], metaDataComments = [];
    ast = JomeJsLooseParser.parse(js, {
      ecmaVersion: 6,
      ranges: true,
      onComment: allComments,
      onToken: tokens
    })
  }
  allComments.forEach(comment => {
    console.log(comment)
    if (comment.value[0] === '~') {
      metaDataComments.push(comment)
    } else {
      comments.push(comment)
    }
  })
  const metaDatas = parseMetaDatas(metaDataComments)
  return {ast, comments, allComments, tokens, metaDatas, raw: js}
}

function renderJomeCode(data) {

}

function renderNotebookView(data) {
  return data.metaDatas.filter(o => o.type === "md").map(o => mdToHtml(o.value)).join('');
}

async function renderOutputCode(data, callback) {
  escodegen.attachComments(data.ast, data.allComments, data.tokens);
  let str = escodegen.generate(data.ast, {comment: true})
  let formatted = await prettier.format(str, {parser: "babel", plugins: [pluginBabel, pluginEstree]})
  let highlighted = hljs.highlight(formatted, {language: 'js'}).value
  callback(highlighted)
}