//~jome("v": "0.0.1")

let thisIsSomeCodeBefore;

/*~
<h1>Torque Calculator Example</h1>

{
  "cmd": "input",
  "args": [
    "id": "force",
    "unit": "N",
    "enableEquivalentUnits": "true",
    "type": "number",
    "defaultValue": "10",
    "comment": "Newtons or equivalent",
    "onSave": "setValue"
  ]
}*/
let force = 10;
/*

{
  "cmd": "input",
  "args": [
    "id": "distance",
    "unit": "m",
    "enableEquivalentUnits": "true",
    "type": "number",
    "defaultValue": "2",
    "comment": "meters or equivalent",
    "onSave": "setValue"
  ]
}*/
let distance = 10;
/*

{
  "cmd": "canvas",
  "args": [
    "width": 600,
    "height": 400,
    "background-color": "#ffffff",
    "children": "number",
  ],
  "children": [
    {
      "cmd": "rect",
      "args": [
        "p1": [100, 100],
        "p2": [500, 300],
      ]
    }
  ]
}

Torque is the result of a force multiplied by a distance from a pivot point.

<!-- Calc is like a single cell sheet -->
calc("id": "torque", "data": "=force*distance") {*/
  let torque = force * distance;
/*}
~*/

let thisIsSomeCodeAfter;