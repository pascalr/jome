import jome from 'jome'


import {AppPage} from "../../lib/app.built.js";

var text23 = `<h1>Jome lib html</h1>
<p>FIXME: This should be generated automatically from the source code.</p>
<h2>Objects</h2>
<ul>
<li>Screen: A div that has at a minimum the page size, but can be taller</li>
<li>Fullscreen: Takes the full size of the page and hides the overflow</li>
<li>Row: Children are place side by side</li>
<li>Col: Children are place one on top of the other</li>
</ul>
<h2>Html attributes</h2>
<p>Every parameters passed onto the object will be assigned to the html tag.</p>
<pre><code class="language-jome">« <span class="hljs-title class_">Div</span> <span class="hljs-keyword">class</span>: <span class="hljs-string">&#x27;d-flex&#x27;</span> » <span class="hljs-comment">// &lt;div class=&#x27;d-flex&#x27;&gt;&lt;/div&gt;</span>
« <span class="hljs-title class_">Div</span> width: <span class="hljs-variable">100px</span> » <span class="hljs-comment">// &lt;div width=&#x27;100px&#x27;&gt;&lt;/div&gt;</span>
</code></pre>
<pre><code class="language-jome">« <span class="hljs-title class_">Div</span> style: {width: <span class="hljs-variable">100px</span>, color: <span class="hljs-string">&#x27;red&#x27;</span>} » <span class="hljs-comment">// &lt;div style=&#x27;width: 100px; color: red;&#x27;&gt;&lt;/div&gt;</span>
« <span class="hljs-title class_">Div</span> <span class="hljs-variable">style</span>.width: <span class="hljs-variable">100px</span>, <span class="hljs-variable">style</span>.color: <span class="hljs-string">&#x27;red&#x27;</span> » <span class="hljs-comment">// &lt;div style=&#x27;width: 100px; color: red;&#x27;&gt;&lt;/div&gt;</span>
</code></pre>
<p>ou bien</p>
<pre><code class="language-jome">« <span class="hljs-title class_">Div</span> css: {width: <span class="hljs-variable">100px</span>, color: <span class="hljs-string">&#x27;red&#x27;</span>} » <span class="hljs-comment">// &lt;div style=&#x27;width: 100px; color: red;&#x27;&gt;&lt;/div&gt;</span>
« <span class="hljs-title class_">Div</span> <span class="hljs-variable">css</span>.width: <span class="hljs-variable">100px</span>, <span class="hljs-variable">css</span>.color: <span class="hljs-string">&#x27;red&#x27;</span> » <span class="hljs-comment">// &lt;div style=&#x27;width: 100px; color: red;&#x27;&gt;&lt;/div&gt;</span>
</code></pre>
`
export default new AppPage({title: 'Jome lib html', content: text23}).toString()