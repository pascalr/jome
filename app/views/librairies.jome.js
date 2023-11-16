import jome from 'jome'


import {AppPage} from "../lib/app.built.js";

var content = `<h2>Jome librairies</h2>
<p>Librairies should be distributed the same way as CoffeeScript librairies. So I think it is mainly through npm.</p>
<h3>Common librairies</h3>
<ul>
<li><a href="${process.env.URL}/lib/html">Html</a></li>
</ul>
`
export default new AppPage({title: 'Jome examples', className: "examples-page", content: content}).toString()