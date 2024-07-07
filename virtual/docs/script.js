/*_* @sync_source #../samples/torque_calculator.js */
let sample01 = `/**
* @md
* # Torque Calculator Example
*/

/**
* @with
* @arg force, @unit N*, @comment Newtons or equivalent
* @arg distance, @unit m*, @comment meters or equivalent
*/
let force, distance;


/** @md Torque is the result of a force multiplied by a distance from a pivot point. */

// We use a jome tag because it's a script that can be run
// The unit checker can infer that this block returns a value
// with N*m or equivalent as a unit and shows it.

/**
* @main
* @arg force, @unit N*, @comment Newtons or equivalent
* @arg distance, @unit m*, @comment meters or equivalent
*/
function main(force, distance) {
 /** @run */
 return force * distance // the last value from a Jome tag is returned
 /** @end */
}`

document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('output-editor').innerText = sample01

});