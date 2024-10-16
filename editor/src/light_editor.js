import { NeutralinoApp } from './neutralino_app'

import { Canvas } from './renderers/Canvas';
import { Field } from './components/Field';
import { Calc } from './components/Calc';
import { Rect } from './components/drawing/Rect';
import { Line } from './components/drawing/Line';
import { Isogon } from './components/drawing/Isogon';

import { Rect as PrimitiveRect } from './components/primitives/rect';

document.addEventListener('DOMContentLoaded', async () => {

  let app = new NeutralinoApp()
  app.registerComponents([Canvas, Field, Calc, Rect, Line, Isogon])
  app.registerPrimitives([PrimitiveRect])

  await app.setup(document.getElementById('root')) // TODO: Rename this
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}