import { NeutralinoApp } from './neutralino_app'

import { HelloWorld } from './components/HelloWorld';

customElements.define("jome-hello-world", HelloWorld)

document.addEventListener('DOMContentLoaded', async () => {

  let app = new NeutralinoApp()

  await app.setup()
});

//function highlight(doc, code) {
//  return hljs.highlight(code, {language: doc.extension}).value
//}