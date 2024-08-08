//~jome 0.0.1

/*~ <h1>Torque Calculator Example</h1> */

//~!begin input(name: "force", unit: "N*", type: "number", defaultValue: "10", comment: "Newtons or equivalent", onSave: "setValue"}
//~begin input {"name": "force", "unit": "N*", "type": "number", "defaultValue": "10", "comment": "Newtons or equivalent", "onSave": "setValue"}
  let force = 10;
//~end
//~begin input {"name": "distance", "unit": "m*", "type": "number", "defaultValue": "2", "comment": "meters or equivalent", "onSave": "setValue"}
  let distance = 2;
//~end

/*~! svg {
  <!-- Draw the rectangle (beam) -->
  <rect x="50" y="50" width="200" height="20" fill="steelblue" />
  <!-- Draw the triangle (pivot point) -->
  <polygon points="150,80 140,100 160,100" fill="gray" />
  <!-- Draw the vertical red arrow pointing downward -->
  <line x1="30" y1="50" x2="30" y2="80" stroke="red" stroke-width="2" />
  <polygon points="30,80 25,70 35,70" fill="red" />
}*/

/*~svg:
  <!-- Draw the rectangle (beam) -->
  <rect x="50" y="50" width="200" height="20" fill="steelblue" />
  <!-- Draw the triangle (pivot point) -->
  <polygon points="150,80 140,100 160,100" fill="gray" />
  <!-- Draw the vertical red arrow pointing downward -->
  <line x1="30" y1="50" x2="30" y2="80" stroke="red" stroke-width="2" />
  <polygon points="30,80 25,70 35,70" fill="red" />
*/

/*~ Torque is the result of a force multiplied by a distance from a pivot point. */

/*~!
We use a jome tag because it's a script that can be run
The unit checker can infer that this block returns a value
with N*m or equivalent as a unit and shows it.
*/

//~begin code(startRun: 1)
let torque = force * distance;
//~end