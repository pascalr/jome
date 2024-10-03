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

<jome-drawing width=600 height=400 margin="1em 0 0 0">
  <jome-text x=100 y=50 content="{force}" />
  <jome-rect x=100 y=100 width=400 height=300 />
</jome-drawing>

<p>Torque is the result of a force multiplied by a distance from a pivot point.</p>

<!-- Calc is like a single cell sheet -->
<jome-calc name="torque" formula="=force*distance">
  */let torque = force * distance;/*
</jome-calc>
~*/

let thisIsSomeCodeAfter;