/*~
<jome-meta>
  "v": "0.0.1",
  "links": [
    {"t": "txt1", "k": "text", "v": "=force"},
    {"t": "txt2", "k": "text", "v": "=distance"},
  ]
</jome-meta>
~*/

let thisIsSomeCodeBefore;

// TODO: afficher sur le dessin la force et la distance.
// Quand tu les modifies, elles devraient changer sur le dessin.

/*~
<h1>Torque Calculator Example</h1>

<jome-field name="force" type="number" unit="N" enable-equivalent-units="true" value="10" comment="Newtons or equivalent">
  */let force = 10;/*
</jome-field>

<jome-field name="distance" type="number" unit="m" enable-equivalent-units="true" value="2" comment="meters or equivalent">
  */let distance = 2;/*
</jome-field>

<jome-canvas width="600" height="300" margin="1em 0 0 0">
  <txt x="100" y="50" fill="red" text="XX N"></txt>
  <rect x="100" y="150" width="400" height="50" thickness="4" color="black"></rect>
  <isogon x="499" y="220" sides="3" radius="20" thickness="4" rotate="30"></isogon>
  <txt x="300" y="250" fill="red" text="XX m"></txt>
</jome-canvas>

<p>Torque is the result of a force multiplied by a distance from a pivot point.</p>

<!-- Calc is like a single cell sheet -->
<jome-calc name="torque" formula="=force*distance">
  */let torque = force * distance;/*
</jome-calc>
~*/

let thisIsSomeCodeAfter;