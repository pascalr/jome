/*_* @sync_source #../samples/torque_calculator.js */
let sample01 = `/*_* @md
# Torque Calculator Example
*/

/*_* @with
@arg force, @unit N*, @comment Newtons or equivalent
@arg distance, @unit m*, @comment meters or equivalent
*/
let force, distance;


/** @md Torque is the result of a force multiplied by a distance from a pivot point. */

// We use a jome tag because it's a script that can be run
// The unit checker can infer that this block returns a value
// with N*m or equivalent as a unit and shows it.

/*_*
@main
@arg force, @unit N*, @comment Newtons or equivalent
@arg distance, @unit m*, @comment meters or equivalent
*/
function main(force, distance) {
 /*_* @run */
 return force * distance // the last value from a Jome tag is returned
 /*_* @end */
}`

document.addEventListener('DOMContentLoaded', function() {
  let src = sample01
  let highlighted = hljs.highlight(src, {language: 'js'}).value
  document.getElementById('output-editor').innerHTML = highlighted
});