(() => {
  // samples/torque_calculator.js.txt
  var torque_calculator_js_default = `//~jome 0.0.1

/*~md
# Torque Calculator Example
*/

//~input {unit: "N*", comment: "Newtons or equivalent", onSave: "setValue"}
let force;
//~input {unit: "m*", comment: "meters or equivalent", onSave: "setValue"}
let distance;

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
}`;

  // src/light_editor.js
  document.addEventListener("DOMContentLoaded", function() {
    let src = torque_calculator_js_default;
    let data = parseJs(src);
    document.getElementById("output-editor").innerHTML = renderOutputCode(data);
    document.getElementById("notebook-editor").innerHTML = renderNotebookView(data);
  });
  function parseJs(js) {
    return { raw: js };
  }
  function renderNotebookView(data) {
    return "";
  }
  function renderOutputCode(data) {
    return hljs.highlight(data.raw, { language: "js" }).value;
  }
})();
//# sourceMappingURL=bundle.js.map
