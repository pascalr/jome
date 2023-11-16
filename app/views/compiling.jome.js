import jome from 'jome'


import {AppPage} from "../lib/app.built.js";

var content2 = `<h2>Compiling</h2>
<p>FIXME: This has changed a lot. I don't want to do something similar to CoffeeScript with jomec.</p>
<p>I want more to execute files directly.</p>
<p>DEPRECATED:</p>
<p>For compiling you need jomec.</p>
  <h3 id="jomec">jomec</h3>
<pre><code class="language-sh"><span class="hljs-comment"># Usage</span>
jomec <span class="hljs-comment"># compiles based on jomeconfig.json</span>
jomec <span class="hljs-string">&quot;file.jome&quot;</span> <span class="hljs-comment"># compile the given file and it&#x27;s dependencies</span>
jomec <span class="hljs-string">&quot;views/*.jome&quot;</span> <span class="hljs-comment"># compile all the files that matches the path and their dependencies</span>
</code></pre>
  <h3 id="jomeconfig">jomeconfig.jome</h3>
<p>Example config file:</p>
<pre><code class="language-jome"><span class="hljs-keyword">import</span> {<span class="hljs-title class_">JomeConfig</span>} <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;jome-config&#x27;</span>

{
  <span class="hljs-title class_">JomeConfig</span>
    compilerOptions:
      <span class="hljs-variable">outDir</span> = <span class="hljs-string">&quot;docs&quot;</span>
      <span class="hljs-variable">removeComments</span> = <span class="hljs-keyword">true</span>
      <span class="hljs-variable">sourceMap</span> = <span class="hljs-keyword">true</span>
      <span class="hljs-variable">addReturnStatements</span> = <span class="hljs-keyword">true</span>
    <span class="hljs-variable">files</span> = [
      <span class="hljs-string">&quot;views/*.jome&quot;</span>
    ]
}
</code></pre>
  <h3>jomeconfig.json</h3>
<p>Example config file:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;compilerOptions&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;outDir&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;docs&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;removeComments&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;sourceMap&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;files&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
    <span class="hljs-string">&quot;views/*.jome&quot;</span>
  <span class="hljs-punctuation">]</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>TODO: List all the possible options</p>
`
export default new AppPage({title: 'Compiling Jome', content: content2}).toString()