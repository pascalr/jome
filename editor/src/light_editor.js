import { NeutralinoApp } from './neutralino_app'

import { Drawing } from './components/Drawing';
import { Field } from './components/Field';
import { Calc } from './components/Calc';
import { Rect } from './components/drawing/Rect';
import { Line } from './components/drawing/Line';
import { Polygon } from './components/drawing/Polygon';

;[Drawing, Field, Calc, Rect, Line, Polygon].map(k => k.register())

document.addEventListener('DOMContentLoaded', async () => {

  let app = new NeutralinoApp()

  await app.setup()
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}