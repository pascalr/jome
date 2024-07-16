(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/parse_js.js
  var require_parse_js = __commonJS({
    "src/parse_js.js"(exports, module) {
      var BLOCK_JS = 1;
      var BLOCK_JOME = 2;
      var BLOCK_WHITESPACE = 3;
      function extractBlockComment(str) {
        let i, result = "/*";
        for (i = 2; i < str.length && !(str[i] === "*" && str[i + 1] === "/"); i++) {
          result += str[i];
        }
        return i < length ? result + "*/" : result;
      }
      function extractQuote(str) {
        let i, ch = str[0];
        let result = ch;
        for (i = 1; i < str.length && (str[i] !== ch || str[i - 1] === "\\"); i++) {
          result += str[i];
        }
        return i < length ? result + ch : result;
      }
      function extractSingleLineComment(str) {
        let i, result = "";
        for (i = 0; i < str.length && str[i] !== "\n"; i++) {
          result += str[i];
        }
        return i < length ? result + "\n" : result;
      }
      function parseJs2(code) {
        let parts = [];
        let i = 0;
        let length2 = code.length;
        let js = "";
        let str;
        while (i < length2) {
          if (code[i] === '"' || code[i] === "'") {
            str = extractQuote(code.slice(i));
            js += str;
            i = i + (str.length || 1);
            continue;
          } else if (code[i] === "/" && code[i + 1] === "/") {
            str = extractSingleLineComment(code.slice(i));
          } else if (code[i] === "/" && code[i + 1] === "*") {
            str = extractBlockComment(code.slice(i));
          } else {
            js += code[i];
            i++;
            continue;
          }
          if (str[2] === "~") {
            if (js.length) {
              parts.push({ type: BLOCK_JS, value: js });
              js = "";
            }
            parts.push({ type: BLOCK_JOME, value: str });
          } else {
            js += str;
          }
          i = i + (str.length || 1);
        }
        if (js.length) {
          parts.push({ type: BLOCK_JS, value: js });
          js = "";
        }
        parts = parts.map((p) => {
          if (p.type === BLOCK_JS && /^\s*$/.test(p.value)) {
            return { type: BLOCK_WHITESPACE, value: p.value };
          }
          return p;
        });
        return parts;
      }
      module.exports = { BLOCK_JS, BLOCK_JOME, BLOCK_WHITESPACE, parseJs: parseJs2 };
    }
  });

  // src/light_editor.js
  var import_parse_js = __toESM(require_parse_js());

  // samples/torque_calculator.js.txt
  var torque_calculator_js_default = `//~jome 0.0.1

/*~md
# Torque Calculator Example
*/

//~input {unit: "N*", comment: "Newtons or equivalent", onSave: "setValue"}
  let force;
//~end
//~input {unit: "m*", comment: "meters or equivalent", onSave: "setValue"}
  let distance;
//~end

/*~with
~arg force, ~unit N*, ~comment Newtons or equivalent
~arg distance, ~unit m*, ~comment meters or equivalent
*/
let force, distance;


/*~md Torque is the result of a force multiplied by a distance from a pivot point. */

// We use a jome tag because it's a script that can be run
// The unit checker can infer that this block returns a value
// with N*m or equivalent as a unit and shows it.

/*~main
~arg force, ~unit N*, ~comment Newtons or equivalent
~arg distance, ~unit m*, ~comment meters or equivalent
*/
function main(force, distance) {
  //~run
  return force * distance; // the last value from a Jome tag is returned
  //~end
}

//~main
  //~arg force, ~unit N*, ~comment Newtons or equivalent
  //~arg distance, ~unit m*, ~comment meters or equivalent
  function main(force, distance) {
    //~run
    return force * distance; // the last value from a Jome tag is returned
    //~end
  }
//~end`;

  // src/light_editor.js
  document.addEventListener("DOMContentLoaded", function() {
    let src = torque_calculator_js_default;
    let parts = (0, import_parse_js.parseJs)(src);
    console.log("parts", parts);
    document.getElementById("output-editor").innerHTML = renderOutputCode(src, parts);
    document.getElementById("notebook-editor").innerHTML = renderNotebookView(src, parts);
  });
  function renderNotebookView(raw, parts) {
    return "";
  }
  function renderOutputCode(raw, parts) {
    return hljs.highlight(raw, { language: "js" }).value;
  }
})();
//# sourceMappingURL=bundle.js.map
