import sample01 from '../samples/torque_calculator.js.txt'

document.addEventListener('DOMContentLoaded', function() {
  let src = sample01
  let highlighted = hljs.highlight(src, {language: 'js'}).value
  document.getElementById('output-editor').innerHTML = highlighted
  console.log(sample01)
});