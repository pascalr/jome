(() => {
  // samples/torque_calculator.js.txt
  var torque_calculator_js_default = "/**\n * @md\n * # Torque Calculator Example\n */\n\n/**\n * @with\n * @arg force, @unit N*, @comment Newtons or equivalent\n * @arg distance, @unit m*, @comment meters or equivalent\n */\nlet force, distance;\n\n\n/** @md Torque is the result of a force multiplied by a distance from a pivot point. */\n\n// We use a jome tag because it's a script that can be run\n// The unit checker can infer that this block returns a value\n// with N*m or equivalent as a unit and shows it.\n\n/**\n * @main\n * @arg force, @unit N*, @comment Newtons or equivalent\n * @arg distance, @unit m*, @comment meters or equivalent\n */\nfunction main(force, distance) {\n  /** @run */\n  return force * distance // the last value from a Jome tag is returned\n  /** @end */\n}";

  // src/editor.js
  document.addEventListener("DOMContentLoaded", function() {
    let src = torque_calculator_js_default;
    let highlighted = hljs.highlight(src, { language: "js" }).value;
    document.getElementById("output-editor").innerHTML = highlighted;
    console.log(torque_calculator_js_default);
  });
})();
