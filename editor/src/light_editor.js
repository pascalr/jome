import { NeutralinoApp } from './neutralino_app'

import { Canvas } from './renderers/Canvas';
import { Field } from './components/Field';
import { Calc } from './components/Calc';

import { Rect } from './components/primitives/rect';
import { Text } from './components/primitives/txt';
import { Isogon } from './components/primitives/isogon';

document.addEventListener('DOMContentLoaded', async () => {

  let app = new NeutralinoApp()
  app.registerComponents([Canvas, Field, Calc])
  app.registerPrimitives([Rect, Text, Isogon])

  await app.setup(document.getElementById('root')) // TODO: Rename this
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}