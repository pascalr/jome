const jome = require('jome')


const {JomeBuilder} = require("jomec");
const {ExpressServer} = require("../lib/express_server.built.js");
const execSh = require("jome/lib/exec_sh");

global._URL = '/jome'
execSh(`
  touch docs/useless # Otherwise rm complains when the folder is empty
  rm -R docs/* # FIXME: Use the variables above
`);
jome(new JomeBuilder({projectAbsPath: process.cwd()}))
  .call(o => o.asset({as: 'highlight.js.min.css'}, 'node_modules/highlight.js/styles/default.min.css'))
  .call(o => o.asset({as: 'reset.css'}, 'website/app/css/reset.css'))
  .call(o => o.asset({as: 'jome-html.css'}, 'website/app/css/jome-html.css'))
  .call(o => o.assets({into: '/'}, 'website/app/favicon/*'))
  .call(o => o.build({as: 'stylesheet.css'}, 'website/app/css/stylesheet.jome'))
  .call(o => o.build({as: 'index.html'}, 'website/app/views/home.jome'))
  .call(o => o.build({as: 'ex/index.html'}, 'website/app/views/examples.jome'))
  .call(o => o.build({as: 'utils/index.html'}, 'website/app/views/utils.jome'))
  .call(o => o.build({as: 'lib/index.html'}, 'website/app/views/librairies.jome'))
  .call(o => o.build({as: 'lib/html/index.html'}, 'website/app/views/lib/html.jome'))
  .call(o => o.build({as: 'lib/express-server/index.html'}, 'website/app/views/lib/express-server.jome'))
  .call(o => o.build({as: 'lib/html-layout/index.html'}, 'website/app/views/lib/html-layout.jome'))
  .call(o => o.build({as: 'editor/index.html'}, 'website/app/views/editor.jome'))
  .call(o => o.build({as: 'index.html'}, 'website/app/views/home.jome'))
  .node()
  .run()
jome(new ExpressServer({port: 3000}))
  .call(o => o.useStatic('/jome', 'docs'))
  .call(o => o.get('/', (req, res) => {
  return res.redirect('/jome')
}))
  .node()
  .run()