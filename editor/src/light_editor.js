import { NeutralinoApp } from './neutralino_app'

import { HelloWorld } from './components/HelloWorld';
import { Field } from './components/Field';

customElements.define("jome-hello-world", HelloWorld)
customElements.define("jome-field", Field)

document.addEventListener('DOMContentLoaded', async () => {

  let app = new NeutralinoApp()

  await app.setup()
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}