//~<jome-rc v="0.0.1" />

let thisIsSomeCodeBefore;

// TODO: afficher sur le dessin la force et la distance.
// Quand tu les modifies, elles devraient changer sur le dessin.

/*~
<h1>Torque Calculator Example</h1>

<jome-field name="force" type="number" unit="N" enable-equivalent-units="true" value=10 comment="Newtons or equivalent">
  */let force = 10;/*
</jome-field>

<jome-field name="distance" type="number" unit="m" enable-equivalent-units="true" value=2 comment="Newtons or equivalent">
  */let distance = 2;/*
</jome-field>

<jome-canvas width=600 height=300 margin="1em 0 0 0">
  <rect width="200" height="100" x="10" y="10" fill="blue"></rect>
  <jome-text x=100 y=50 content="{force}"></jome-text>
  <rect x=100 y=150 width=400 height=50 thickness=4 color="black"></rect>
  <jome-polygon x=499 y=220 sides=3 radius=20 thickness=4 rotate=30></jome-polygon>
</jome-canvas>

<p>Torque is the result of a force multiplied by a distance from a pivot point.</p>

<!-- Calc is like a single cell sheet -->
<jome-calc name="torque" formula="=force*distance">
  */let torque = force * distance;/*
</jome-calc>
~*/

let thisIsSomeCodeAfter;