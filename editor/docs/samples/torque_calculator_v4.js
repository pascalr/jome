//~jome("v": "0.0.1")

let thisIsSomeCodeBefore;

/*~
<h1>Torque Calculator Example</h1>

<Field name="force" type="number" unit="N" enableEquivalentUnits="true" defaultValue=10 comment="Newtons or equivalent">
  */let force = 10;/*
</Field>

<Field name="distance" type="number" unit="m" enableEquivalentUnits="true" defaultValue=2 comment="Newtons or equivalent">
  */let distance = 2;/*
</Field>

<Drawing width=600 height=400 background-color="#ffffff">
  <Rect x=100 y=100 width=400 height=300 />
</Drawing>

Torque is the result of a force multiplied by a distance from a pivot point.

<!-- Calc is like a single cell sheet -->
<Calc name="torque" formula="=force*distance">
  */let torque = force * distance;/*
</Calc>
~*/

let thisIsSomeCodeAfter;