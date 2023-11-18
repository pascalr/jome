const jome = require('jome')


const {AppPage} = require("../lib/app.built.js");

class Example {
  toString() {
    return `
    <div class='example'>
      <div class='onglets'>
        <div class='active'>Code</div>
        <div>Compilé</div>
        <div>Résultat</div>
      </div>
      <div class='example-content'>
        Test 1212
      </div>
    </div>
  `
  }
}

var ex = new Example()
var conten = `<h2>Jome examples</h2>
  <h3 id="hello-world">Hello world</h3>
<pre><code class="language-jome"><span class="hljs-variable">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&quot;Hello world!&quot;</span>) <span class="hljs-comment">// jome compiles to javascript, so you can use javascript</span>
</code></pre>
  <h3 id="html-library">Html library</h3>
<pre><code class="language-jome"><span class="hljs-variable">html</span> = «
  <span class="hljs-title class_">IFrame</span> <span class="hljs-comment">// for demo only</span>
    <span class="hljs-title class_">Html</span> title: <span class="hljs-string">&#x27;My html page&#x27;</span>
      page: <span class="hljs-title class_">Col</span>
        navbar: <span class="hljs-title class_">Row</span>
          <span class="hljs-title class_">Link</span> <span class="hljs-string">&#x27;Some page&#x27;</span>
          <span class="hljs-title class_">Link</span> <span class="hljs-string">&#x27;Another page&#x27;</span>
          <span class="hljs-title class_">Link</span> <span class="hljs-string">&#x27;Yet another page&#x27;</span>
»
</code></pre>
  <h3 id="snake">Snake</h3>
  ${ex}
  <h3 id="html-button">Html button</h3>
<pre><code class="language-jome"><span class="hljs-keyword">import</span> {<span class="hljs-title class_">Btn</span>, <span class="hljs-title class_">Txt</span>, <span class="hljs-variable">renderHTML</span>} <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;html&quot;</span>

<span class="hljs-title function_">renderHTML</span>(target: <span class="hljs-string">&#x27;#div-id&#x27;</span>, {
  <span class="hljs-title class_">Btn</span> %count: <span class="hljs-number">0</span>, ~click: =&gt; (%<span class="hljs-variable">count</span> += <span class="hljs-number">1</span>)
    <span class="hljs-title class_">Txt</span> =&gt; <span class="hljs-string">&quot;Clicked {%count} {%count == 1 ? &#x27;time&#x27; : &#x27;times&#x27;}&quot;</span>
})
</code></pre>
<p>Example compiled JavaScript output:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> jome <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;jome_lib&#x27;</span>
<span class="hljs-keyword">import</span> {<span class="hljs-title class_">Btn</span>, <span class="hljs-title class_">Txt</span>, renderHTML} <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;html&quot;</span>

<span class="hljs-keyword">var</span> btn

<span class="hljs-comment">// Add a button to the scene which has a text as a children</span>
btn = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Btn</span>({<span class="hljs-attr">__signal__click</span>: <span class="hljs-function">() =&gt;</span> {<span class="hljs-variable language_">this</span>.<span class="hljs-property">count</span> += <span class="hljs-number">1</span>}})
btn.<span class="hljs-property">count</span> = <span class="hljs-number">0</span>
jome.<span class="hljs-title function_">createObj</span>($, btn)
jome.<span class="hljs-title function_">createObj</span>($.$.$btn, <span class="hljs-keyword">new</span> <span class="hljs-title class_">Txt</span>(<span class="hljs-function">() =&gt;</span> (
  <span class="hljs-string">\`Clicked <span class="hljs-subst">\${<span class="hljs-variable language_">this</span>.count}</span> <span class="hljs-subst">\${<span class="hljs-variable language_">this</span>.count == <span class="hljs-number">1</span> ? <span class="hljs-string">&#x27;time&#x27;</span> : <span class="hljs-string">&#x27;times&#x27;</span>}</span>\`</span>
)))

<span class="hljs-comment">// Compile all the objects of the scene and write the html to #jome-placeholder div</span>
<span class="hljs-title function_">renderHTML</span>({<span class="hljs-attr">target</span>: <span class="hljs-string">&#x27;jome-placeholder&#x27;</span>}, $)
</code></pre>
<h2>Recipe?</h2>
<pre><code class="language-jome">{
  <span class="hljs-title class_">Recipe</span> (
    name: <span class="hljs-string">&#x27;Chickpea balls&#x27;</span>
  )
    <span class="hljs-title class_">Ing</span> <span class="hljs-variable">1cup</span>, <span class="hljs-string">&quot;dry chickpeas&quot;</span>
    <span class="hljs-title class_">Ing</span> <span class="hljs-variable">2cup</span>, <span class="hljs-string">&quot;water&quot;</span>
    <span class="hljs-title class_">Ing</span> <span class="hljs-variable">2tbsp</span>, <span class="hljs-string">&quot;parmesan&quot;</span>
    <span class="hljs-title class_">Step</span> <span class="hljs-string">\`Put {@.ing(1)} into {@.ing(2)}...\`</span> <span class="hljs-comment">// Here @ would reference to Recipe?</span>
    <span class="hljs-title class_">Step</span> <span class="hljs-string">&quot;Mix ...&quot;</span>
    <span class="hljs-title class_">Step</span> <span class="hljs-string">&quot;Blah blah ...&quot;</span>
}
<span class="hljs-comment">// or </span>
&lt;<span class="hljs-variable">recipe</span>&gt;
  ?
&lt;/<span class="hljs-variable">recipe</span>&gt;
</code></pre>
<h2>A format database like?</h2>
<pre><code class="language-jome"><span class="hljs-variable">data</span> = {
  <span class="hljs-string">&quot;comma&quot;</span>, <span class="hljs-string">&quot;separated&quot;</span>, <span class="hljs-string">&quot;values&quot;</span>
  <span class="hljs-number">1</span>,       <span class="hljs-string">&quot;foo&quot;</span>,       <span class="hljs-number">10.0</span>
  <span class="hljs-number">2</span>,       <span class="hljs-string">&quot;bar&quot;</span>,       <span class="hljs-number">20.0</span>
}
</code></pre>
  <csv>
    "comma", "separated", "values"
    1,       "foo",       10.0
    2,       "bar",       20.0
  </csv>
<h2>Sqlite3 export to CSV JavaScript</h2>
<p>Faire un petit script en Jome qui convertit un fichier .sqlite3 en un dossier avec des .csv pour chaques table un .csv pour le metadata</p>
<p>TODO: Save metadata too.</p>
<pre><code class="language-jome"><span class="hljs-keyword">let</span> <span class="hljs-variable">tables</span> = <span class="language-shell">&lt;sh&gt;sqlite3 &lt; % = ARGV[1] % &gt; &quot;.table&quot;&lt;/sh&gt;</span>
<span class="language-shell">&lt;sh&gt;mkdir &lt; % = ARGV[2] % &gt;&lt;/sh&gt;</span>
<span class="hljs-variable">tables</span>#<span class="hljs-title function_">each</span>(<span class="hljs-variable">table</span> =&gt; (
  <span class="language-shell">&lt;sh&gt;sqlite3 -header -csv &lt; % = ARGV[1] % &gt; &quot;select * from &lt; % = table % &gt;;&quot; &gt; &lt; % = table % &gt;.csv&lt;/sh&gt;</span>
))
</code></pre>
`
module.exports = new AppPage({title: 'Jome examples', content: conten}).toString()