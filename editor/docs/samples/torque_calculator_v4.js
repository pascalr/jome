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

<jome-drawing width=600 height=300 margin="1em 0 0 0">
  <rect width="200" height="100" x="10" y="10" rx="20" ry="20" fill="blue"></rect>
  <jome-text x=100 y=50 content="{force}"></jome-text>
  <jome-rect x=100 y=150 width=400 height=50 thickness=8></jome-rect>
  <jome-polygon x=500 y=200 sides=3></jome-polygon>
</jome-drawing>

<p>Torque is the result of a force multiplied by a distance from a pivot point.</p>

<!-- Calc is like a single cell sheet -->
<jome-calc name="torque" formula="=force*distance">
  */let torque = force * distance;/*
</jome-calc>
~*/

let thisIsSomeCodeAfter;