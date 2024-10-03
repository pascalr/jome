import { NeutralinoApp } from './neutralino_app'

import { HelloWorld } from './components/HelloWorld';
import { Drawing } from './components/Drawing';
import { Field } from './components/Field';
import { Calc } from './components/Calc';
import { Rect } from './components/drawing/Rect';
import { Line } from './components/drawing/Line';
import { Polygon } from './components/drawing/Polygon';

console.log('own', Rect.constructor.ownAttributes)

customElements.define("jome-hello-world", HelloWorld)
customElements.define("jome-drawing", Drawing)
customElements.define("jome-field", Field)
customElements.define("jome-calc", Calc)
customElements.define("jome-rect", Rect)
customElements.define("jome-line", Line)
customElements.define("jome-polygon", Polygon)

document.addEventListener('DOMContentLoaded', async () => {

  let app = new NeutralinoApp()

  await app.setup()
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}