const jome = require('jome')


const {AppPage} = require("../lib/app.built.js");

var content = `<h2>Utils</h2>
<p>Utils start with the # character.</p>
<p>It can be a constant, a function or a function acting upon a variable.</p>
<pre><code class="language-jome"><span class="hljs-comment">// A constant</span>
<span class="hljs-keyword">let</span> <span class="hljs-variable">x</span> = #<span class="hljs-title class_">PI</span>/<span class="hljs-number">2</span>
<span class="hljs-keyword">let</span> <span class="hljs-variable">e</span> = #<span class="hljs-variable">e</span> <span class="hljs-comment">// Euler&#x27;s number</span>

<span class="hljs-comment">// A function</span>
<span class="hljs-keyword">let</span> <span class="hljs-variable">angle</span> = #<span class="hljs-title function_">sin</span>(<span class="hljs-variable">x</span>)
#<span class="hljs-title function_">log</span>(<span class="hljs-string">&quot;The angle is:&quot;</span>, <span class="hljs-variable">angle</span>) <span class="hljs-comment">// #log is a shorthand for console.log</span>

<span class="hljs-comment">// A function acting upon a variable</span>
<span class="hljs-keyword">let</span> <span class="hljs-variable">keys</span> = <span class="hljs-variable">obj</span>.#<span class="hljs-variable">keys</span> <span class="hljs-comment">// === #keys(obj) === Object.keys(obj)</span>
<span class="hljs-number">10.</span>#<span class="hljs-title function_">times</span>(<span class="hljs-variable">i</span> =&gt; <span class="hljs-comment">/* ... */</span>)

<span class="hljs-comment">// Chaining example</span>
<span class="hljs-variable">obj</span>.#<span class="hljs-variable">keys</span>.#<span class="hljs-title function_">filter</span>(<span class="hljs-variable">key</span> -&gt; <span class="hljs-variable">key</span>.<span class="hljs-title function_">startsWith</span>(<span class="hljs-string">&#x27;:&#x27;</span>)).#<span class="hljs-title function_">each</span>(<span class="hljs-variable">el</span> =&gt; <span class="hljs-comment">/* ... */</span>)
</code></pre>
<h3>Jome specific utils</h3>
<p>#params, #props, #children, #removeChildren</p>
<p>obj.#params // The list of props given to an object constructor
obj.#props // The list of props given to an object constructor
obj.#children // The list of children of a node
obj.#removeChildren // Remove all children of a node</p>
<h3>Math</h3>
<p>#PI, #sin, #cos, #tan, ...,</p>
<h4>#cos</h4>
<h4>#PI</h4>
<h4>#rand?</h4>
<h4>#sin</h4>
<h4>#tan</h4>
<h3>console</h3>
<p>#log, ...</p>
<h3>process</h3>
<p>#argv #cwd, #env...</p>
<h3>underscore.js</h3>
<p>#keys, #values, #entries, #map, #reduce, ...</p>
<h3>Others</h3>
<p>#each</p>
<p>#dirname, #filename, ...</p>
<p>#dirname: The directory of the current file. (Equivalent of __dirname)
#filename: The name of the current file. (Equivalent of __filename)</p>
<p>// TODO
obj.#isBlank // Like Rails blank // ou bien isBlank?
obj.#isPresent // The opposite of Rails blank // ou bien isPresent?</p>
<h3>Colors</h3>
<p>Nahhhhhhh, because what would be the good value, I want jome utils to be universally accepted, not dependant on the context
TODO: All html colors: MAYBEEE? Because I don't know in what format I would want the value to be... so probably don't do this</p>
<ul>
<li>#red: 0xFF0000</li>
<li>...
Maybe #red_i32 or stuff like that, but that's ugly?</li>
</ul>
`
module.exports = new AppPage({title: 'Jome utils', className: "utils-page", content: content}).toString()