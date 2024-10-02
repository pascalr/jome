import { NeutralinoApp } from './neutralino_app'

import { HelloWorld } from './components/HelloWorld';
import { Drawing } from './components/Drawing';
import { Field } from './components/Field';
import { Calc } from './components/Calc';

customElements.define("jome-hello-world", HelloWorld)
customElements.define("jome-drawing", Drawing)
customElements.define("jome-field", Field)
customElements.define("jome-calc", Calc)

document.addEventListener('DOMContentLoaded', async () => {

  let app = new NeutralinoApp()

  await app.setup()
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}