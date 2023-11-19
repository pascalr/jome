const jome = require('jome')


const {AppPage} = require("../lib/app.built.js");

module.exports = new AppPage({title: 'Simple HTML Page', content: (`<h1>Jome</h1>
<p>Jome is a language that compiles to JavaScript. It has a node structure like in Godot, it has types like Typescript,
it has goodies like CoffeeScript and underscore.js, it handles state like in React and it has some (new?) ideas.</p>
<p>Well that's the idea at least. Right now it is very much in experimental phase. There are a lot of bugs and not many tests are written yet.</p>
<p>You can read from top to bottom to learn the language, or you can jump to any section if you are only curious.</p>
<h2>Overview</h2>
<p>Example Jome code: TODO: Make this like the examples so you can click see compiled and result</p>
<p>Here is some code to show what Jome looks like. You can look at the <a href="/examples">examples</a> page to see more.</p>
<pre><code class="language-jome"><span class="hljs-comment">// Classes</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">Character</span> |<span class="hljs-variable">@name</span>, <span class="hljs-variable">@weapon</span>?| =&gt; {
  attack: |<span class="hljs-variable">enemy</span>| =&gt; (

  )
}
<span class="hljs-keyword">class</span> <span class="hljs-title class_">Weapon</span> |<span class="hljs-variable">damage</span>?, <span class="hljs-variable">range</span>?| =&gt; {}

<span class="hljs-comment">// Inheritence and properties</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">Dagger</span> { super: <span class="hljs-title class_">Weapon</span> range: <span class="hljs-number">50</span> }
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeakDagger</span> { super: <span class="hljs-title class_">Dagger</span> damage: <span class="hljs-number">50</span> }
<span class="hljs-keyword">class</span> <span class="hljs-title class_">StrongDagger</span> { super: <span class="hljs-title class_">Dagger</span> damage: <span class="hljs-number">200</span> }

<span class="hljs-comment">// Instantiation</span>
<span class="hljs-keyword">var</span> <span class="hljs-variable">startingWeapon</span> = { <span class="hljs-title class_">WeakDagger</span> }
<span class="hljs-keyword">var</span> <span class="hljs-variable">hero</span> = { <span class="hljs-title class_">Character</span> <span class="hljs-string">&quot;Paul&quot;</span>, weapon: <span class="hljs-variable">startingWeapon</span> }

<span class="hljs-comment">// Scripts (any language, here shell)</span>
<span class="hljs-keyword">var</span> <span class="hljs-variable">gameSaved</span> = <span class="language-shell">&lt;sh&gt;cat &quot;saved-gamed.json&quot;&lt;/sh&gt;</span>

<span class="hljs-comment">// Functions</span>
<span class="hljs-keyword">def</span> <span class="hljs-variable">announceGameIsStarted</span> = -&gt; (
  <span class="hljs-variable">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;Game started!&#x27;</span>)
)
<span class="hljs-title function_">announceGameIsStarted</span>()
</code></pre>
<h2>Disclaimer</h2>
<p>The language is very, very young and still contains a log of bugs. I don't recommend using yet for any real project.</p>
<p>I don't have a list of bugs yet, because there are too many.</p>
<h2>Installation</h2>
<pre><code class="language-sh"><span class="hljs-comment"># <span class="hljs-doctag">FIXME:</span> NPM PACKAGE IS NOT YET CREATED!</span>
npm install jome
</code></pre>
<h2>Usage</h2>
<pre><code class="language-sh"><span class="hljs-comment"># Usage</span>
jome <span class="hljs-comment"># executes index.jome in current or ancestor directory</span>
jome file.jome <span class="hljs-comment"># execute the given file</span>
jome server start <span class="hljs-comment"># pass the arguments &quot;server&quot; and &quot;start&quot; to index.jome executable</span>
</code></pre>
  <h2 id="lang-ref">Language Reference</h2>
<p>This documentation assumes the reader is familiar with javascript.</p>
<p>Jome is similar to JavaScript, but there are a few distinctions that you must be aware of. Mainly, the syntax is a bit different, there are nodes, named parameters and scripts.</p>
  <h2 id="syntax">Syntax</h2>
<p>Parentheses are used for statement blocks.</p>
<pre><code class="language-jome"><span class="hljs-keyword">if</span> (<span class="hljs-variable">someCondition</span>) (
  <span class="hljs-comment">/* Notice the usage of parentheses and not curly braces */</span>
)
</code></pre>
<p>Curly braces are used for <a href="#blocks">blocks</a>.</p>
<pre><code class="language-jome"><span class="hljs-keyword">def</span> <span class="hljs-variable">someFunction</span> = -&gt; (<span class="hljs-keyword">return</span> <span class="hljs-number">10</span> + <span class="hljs-number">20</span>) <span class="hljs-comment">// ok</span>
<span class="hljs-keyword">def</span> <span class="hljs-variable">someFunction</span> = -&gt; {<span class="hljs-keyword">return</span> <span class="hljs-number">10</span> + <span class="hljs-number">20</span>} <span class="hljs-comment">// WRONG!</span>
<span class="hljs-keyword">def</span> <span class="hljs-variable">someFunction</span> = -&gt; {x: <span class="hljs-number">10</span>} <span class="hljs-comment">// ok</span>
</code></pre>
<p>Vertical bars are used for function parameters.</p>
<pre><code class="language-jome"><span class="hljs-keyword">def</span> <span class="hljs-variable">addXY</span> = |<span class="hljs-variable">x</span>, <span class="hljs-variable">y</span>| -&gt; (<span class="hljs-variable">x</span> + <span class="hljs-variable">y</span>)
</code></pre>
<p>TODO: Try an idea: -&gt; and =&gt; are optional</p>
<pre><code class="language-jome"><span class="hljs-keyword">def</span> <span class="hljs-variable">addXY</span> = |<span class="hljs-variable">x</span>, <span class="hljs-variable">y</span>| (<span class="hljs-variable">x</span> + <span class="hljs-variable">y</span>)
[<span class="hljs-number">1</span>,<span class="hljs-number">2</span>,<span class="hljs-number">3</span>,<span class="hljs-number">4</span>,<span class="hljs-number">5</span>,<span class="hljs-number">6</span>,<span class="hljs-number">7</span>,<span class="hljs-number">8</span>,<span class="hljs-number">9</span>].<span class="hljs-title function_">filter</span>(|<span class="hljs-variable">nb</span>| <span class="hljs-variable">nb</span> &gt; <span class="hljs-number">5</span>)
<span class="hljs-comment">// Et pour quand il n&#x27;y a pas d&#x27;argument?</span>
<span class="hljs-keyword">def</span> <span class="hljs-variable">sayHello</span> = | | (#<span class="hljs-title function_">log</span>(<span class="hljs-string">&quot;Hello!&quot;</span>)) <span class="hljs-comment">// Noooooon ça c&#x27;est laid...</span>
</code></pre>
<h3>Keywords</h3>
<p>Declaration keywords:</p>
<ul>
<li><a href="#declaration">var</a>: To declare variables</li>
<li><a href="#declaration">def</a>: To declare functions</li>
<li><a href="#declaration">let</a>: To declare anything</li>
</ul>
<h3>Bilingual</h3>
<p>Jome is bilingual in french and english. There are french keywords equivalent to english keywords.</p>
<ul>
<li>vrai: true</li>
<li>faux: false</li>
<li>si: if</li>
<li>sinon: else</li>
<li>requiert: require</li>
<li>...</li>
</ul>
  <h2 id="blocks">Blocks</h2>
<p>Blocks are a key component of Jome. They use indentation to build objects in a short and subjectively pretty way.
It is also the syntax required to build <a href="#nodes">nodes</a>.</p>
<p>Blocks are surrounded by curly braces. The result of a block can be an object, a list, a node or a value.</p>
<pre><code class="language-jome"><span class="hljs-comment">// objects</span>
<span class="hljs-variable">position</span> = {x: <span class="hljs-number">10</span>, y: <span class="hljs-number">10</span>}
<span class="hljs-variable">destination</span> = {
  x: <span class="hljs-number">40</span>
  y: <span class="hljs-number">50</span>
}
<span class="hljs-variable">details</span> = {
  distanceX: <span class="hljs-number">30</span>, distanceY: <span class="hljs-number">40</span> <span class="hljs-comment">// comma is optional</span>
  totalDistance: <span class="hljs-number">50</span>, eta: <span class="hljs-variable">10min</span>
}

<span class="hljs-comment">// lists</span>
<span class="hljs-variable">numbers</span> = {<span class="hljs-number">1</span>,<span class="hljs-number">2</span>,<span class="hljs-number">3</span>,<span class="hljs-number">4</span>} <span class="hljs-comment">// but [1,2,3,4] is preferred when on a single line</span>
<span class="hljs-variable">names</span> = {
  <span class="hljs-string">&quot;Jean&quot;</span>
  <span class="hljs-string">&quot;Jacques&quot;</span>
  <span class="hljs-string">&quot;Paul&quot;</span>
}
<span class="hljs-variable">matrix</span> = {
  <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">0</span>
  <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">0</span>
  <span class="hljs-number">0</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>
}

<span class="hljs-comment">// nodes</span>
<span class="hljs-variable">node</span> = {
  <span class="hljs-title class_">Obj</span> some: <span class="hljs-string">&#x27;obj&#x27;</span>
    <span class="hljs-string">&#x27;String child&#x27;</span>
    <span class="hljs-title class_">Nested</span> prop: <span class="hljs-string">&#x27;val&#x27;</span>
}

<span class="hljs-comment">// values</span>
<span class="hljs-variable">singleObj</span> = {<span class="hljs-title class_">Obj</span> prop: <span class="hljs-string">&#x27;val&#x27;</span>}
<span class="hljs-variable">chainResult</span> = {
  <span class="hljs-title class_">Obj</span> prop: <span class="hljs-string">&#x27;val&#x27;</span>
    <span class="hljs-title class_">Nested</span> prop: <span class="hljs-string">&#x27;val&#x27;</span>
      <span class="hljs-title class_">Nested</span> prop: <span class="hljs-string">&#x27;val&#x27;</span>
    <span class="hljs-variable">run</span>
} <span class="hljs-comment">// The value will be the result of the function run of the object created.</span>
</code></pre>
<h3>Shorthand key syntax</h3>
<p>The short key syntax is different that in javascript, because it could be confused with list. In Jome, it starts with a colon</p>
<pre><code class="language-jome"><span class="hljs-variable">obj</span> = {:<span class="hljs-variable">content</span>, :<span class="hljs-variable">value</span>}
<span class="hljs-comment">// same as</span>
<span class="hljs-variable">obj</span> = {content: <span class="hljs-variable">content</span>, value: <span class="hljs-variable">value</span>}
</code></pre>
<h3>Functions inside blocks</h3>
<p>A variable name nested under a node is a function call.</p>
<p>If you want to refer to the variable to add it as a children, you use the = sign at the beginning.</p>
<pre><code class="language-jome"><span class="hljs-comment">// Create a server, add a get handler and start it</span>
{
  <span class="hljs-title class_">ExpressServer</span> port: <span class="hljs-number">3000</span>
    <span class="hljs-variable">get</span> <span class="hljs-string">&#x27;/&#x27;</span>, |<span class="hljs-variable">req</span>, <span class="hljs-variable">res</span>| =&gt; (
      <span class="hljs-variable">res</span>.<span class="hljs-title function_">send</span>(<span class="hljs-variable">homePage</span>)
    )
    <span class="hljs-variable">start</span>
}

<span class="hljs-variable">obj</span> = {
  <span class="hljs-title class_">Obj</span> prop: <span class="hljs-string">&#x27;val&#x27;</span>
    =<span class="hljs-title function_">addChild</span>(<span class="hljs-string">&#x27;arg&#x27;</span>)
    <span class="hljs-variable">executeFunction</span>
}
</code></pre>
<h3>List with single element</h3>
<p>In a block, you can't have a list with a single element because it that case it returns the element directly.
You have to use the square brackets syntax then.</p>
  <h2 id="nodes">Nodes</h2>
<p>Nodes are objects in a tree structure. They can have a parent and they can have children.</p>
<p>You create nodes by using blocks.</p>
<pre><code class="language-jome"><span class="hljs-variable">node</span> = {
  <span class="hljs-title class_">Obj</span> (
    prop: <span class="hljs-string">&#x27;val&#x27;</span>,
    prop2: <span class="hljs-string">&#x27;val2&#x27;</span>
  )
    <span class="hljs-variable">@attr</span> = <span class="hljs-string">&#x27;val3&#x27;</span>
    <span class="hljs-variable">@attr2</span> = <span class="hljs-string">&#x27;val4&#x27;</span>
    child: <span class="hljs-string">&#x27;val5&#x27;</span>
    child2: <span class="hljs-string">&#x27;val6&#x27;</span>
}
</code></pre>
<h3>Adding children to nodes</h3>
<p>In order to add children to nodes, you can use the &lt;&lt; operator.</p>
<pre><code class="language-jome"><span class="hljs-variable">hero</span>.<span class="hljs-variable">inventory</span> &lt;&lt; {
  <span class="hljs-title class_">Sword</span> damage: <span class="hljs-number">10</span>, weight: <span class="hljs-variable">500g</span>
  <span class="hljs-title class_">Shield</span> armor: <span class="hljs-number">8</span>, weight: <span class="hljs-variable">400g</span>
  <span class="hljs-title class_">Scroll</span> <span class="hljs-string">&quot;Scroll of wisdom&quot;</span>
  <span class="hljs-title class_">Belt</span>
    <span class="hljs-title class_">HealingPotion</span> life: <span class="hljs-number">200</span>
    <span class="hljs-title class_">ManaPotion</span> mana: <span class="hljs-number">100</span>
}
</code></pre>
<h3>Children attached with key</h3>
<p>LES NODES N'ONT PAS DE NOM, MAIS TU PEUX LES ATTACHER AVEC UNE CLÉ À UN PARENT
QUAND TU ATTACHES UN CHILDREN AVEC UNE CLÉ, il est là ET il est dans la liste de children.
si tu veux mettre à un attribute, mais pas children, alors utiliser @attr</p>
<pre><code class="language-jome">$ &lt;&lt;
  <span class="hljs-variable">someVar</span> = <span class="hljs-number">10</span>
  page: <span class="hljs-title class_">Page</span>
    navbar: <span class="hljs-title class_">Navbar</span>
      list: <span class="hljs-title class_">List</span>
        <span class="hljs-title class_">Link</span> <span class="hljs-string">&quot;Musics&quot;</span>, to: <span class="hljs-string">&#x27;/musics&#x27;</span>
        <span class="hljs-title class_">Link</span> <span class="hljs-string">&quot;Sports&quot;</span>, to: <span class="hljs-string">&#x27;/sports&#x27;</span>
        <span class="hljs-title class_">Link</span> <span class="hljs-string">&quot;Arts&quot;</span>, to: <span class="hljs-string">&#x27;/arts&#x27;</span>
    <span class="hljs-title class_">Body</span>
      <span class="hljs-title class_">Txt</span> &lt; <span class="hljs-variable">md</span> &gt;
        # <span class="hljs-title class_">Welcome</span>
        <span class="hljs-title class_">Welcome</span> <span class="hljs-variable">to</span> <span class="hljs-variable">this</span> <span class="hljs-variable">website</span>! <span class="hljs-title class_">You</span> <span class="hljs-variable">can</span> <span class="hljs-variable">browse</span> <span class="hljs-variable">links</span> <span class="hljs-variable">at</span> <span class="hljs-variable">the</span> <span class="hljs-variable">top</span>.
      &lt; / <span class="hljs-variable">md</span>&gt;
&gt;&gt;
<span class="hljs-keyword">var</span> <span class="hljs-variable">navLinks</span> = $<span class="hljs-variable">page</span>.<span class="hljs-variable">navbar</span>.<span class="hljs-variable">list</span>-&gt;<span class="hljs-variable">children</span>
</code></pre>
<h3>Under the hood</h3>
<p>Underneath, nodes are objects with a property named '$'. The idea of doing it this way is in order to not clash with user defined properties for
example name.</p>
<p>The property includes the following attributes:</p>
<ul>
<li>children: The list of children of the node.</li>
<li>parent: A link to the node who is it's parent</li>
<li>signals: A list of the signals the node listens to</li>
<li>childrenCount: The number of children of the node. Not sure about this one. TODO: Remove this since I can do children.length</li>
</ul>
  <h2 id="named-parameters">Named parameters and props</h2>
<p>When calling a function, you can add paramters.</p>
<pre><code class="language-jome"><span class="hljs-title function_">someFunc</span>(someParam: <span class="hljs-number">10</span>, otherParam: <span class="hljs-string">&#x27;Jean&#x27;</span>)
</code></pre>
<p>To define parameters when creating a function, you either add ? at the end for an optional parameter, or you add ! for a required parameter.</p>
<pre><code class="language-jome"><span class="hljs-keyword">def</span> <span class="hljs-variable">someFunc</span> = |<span class="hljs-variable">someParam</span>?, <span class="hljs-variable">otherParam</span>? = <span class="hljs-string">&#x27;Pierre&#x27;</span>, <span class="hljs-variable">optionalParam</span>?, <span class="hljs-variable">requiredParam</span>!| =&gt; (
  <span class="hljs-variable">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-variable">someParam</span>) <span class="hljs-comment">// No need to add ? or ! when refering to a parameter</span>
)
</code></pre>
<p>You can pass a parameter that was not defined in the list.</p>
<p>BUT YOU CAN'T PASS a parameter to a function if the function does not take any parameter. Because under the hood,
we add a params argument to the function, so we need at least one to add the argument, then you can pass as many as you want.</p>
<p>When calling a function with named parameters, the order does not matter. You can put them before arguments, after or even in the middle.</p>
<h3>Props</h3>
<p>Props are all the parameters and attributes as parameters passed during an object creation.</p>
<pre><code class="language-jome">« <span class="hljs-title class_">Obj</span> someProp: <span class="hljs-number">10</span>, someAttr: <span class="hljs-string">&#x27;Paul&#x27;</span> »
<span class="hljs-keyword">class</span> <span class="hljs-title class_">Obj</span> |<span class="hljs-variable">someProp</span>?, <span class="hljs-variable">@someAttr</span>?| =&gt; {
}
<span class="hljs-comment">// compiles to</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">Obj</span> {
  <span class="hljs-title function_">constructor</span>(<span class="hljs-variable">__props__</span>) {
    <span class="hljs-variable">this</span>.<span class="hljs-variable">__props__</span> = <span class="hljs-variable">__props__</span>
    <span class="hljs-keyword">let</span> {<span class="hljs-variable">someAttr</span>, ...<span class="hljs-variable">__params___</span>} = <span class="hljs-variable">__props__</span>
    <span class="hljs-variable">this</span>.<span class="hljs-variable">__params__</span> = <span class="hljs-variable">__params__</span>
    <span class="hljs-variable">this</span>.<span class="hljs-variable">someAttr</span> = <span class="hljs-variable">someAttr</span>
  }
}
</code></pre>
<h3>Under the hood</h3>
<p>TODO: Explain how it works</p>
<h2>Classes</h2>
<h3>Inheritence</h3>
<pre><code class="language-jome">  <span class="hljs-keyword">class</span> <span class="hljs-title class_">Base</span> {
    super: <span class="hljs-title class_">Abstract</span> prop: <span class="hljs-string">&#x27;val&#x27;</span>
  }
</code></pre>
<h2>Interfaces</h2>
<p>An interface is a list of props. When you declare a class, you can give an interface so you don't have to specify every time the list of
possible parameters that can be given.</p>
<p>To refer to an interface, you add an ampersand before the name.</p>
<pre><code class="language-jome"><span class="hljs-variable">interface</span> <span class="hljs-title class_">HtmlOptions</span> |
  <span class="hljs-variable">width</span>?,
  <span class="hljs-variable">height</span>?
|

<span class="hljs-keyword">class</span> <span class="hljs-title class_">Div</span> &amp;<span class="hljs-title class_">HtmlOptions</span> =&gt; {<span class="hljs-comment">/* ... */</span>}
<span class="hljs-keyword">class</span> <span class="hljs-title class_">Span</span> |<span class="hljs-variable">arg</span>, &amp;<span class="hljs-title class_">HtmlOptions</span>| =&gt; {<span class="hljs-comment">/* ... */</span>}
</code></pre>
<p>I don't know yet how I want to refer to the interface values. Directly or through the interface name?
Maybe allow both?</p>
<pre><code class="language-jome"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Div</span> &amp;<span class="hljs-title class_">HtmlOption</span> =&gt; {
  toString: =&gt; (
    <span class="hljs-keyword">let</span> <span class="hljs-variable">widthPlus1</span> = <span class="hljs-variable">width</span> + <span class="hljs-number">1</span>
    <span class="hljs-comment">// or</span>
    <span class="hljs-keyword">let</span> <span class="hljs-variable">widthPlus1</span> = <span class="hljs-title class_">HtmlOption</span>.<span class="hljs-variable">width</span> + <span class="hljs-number">1</span>
  )
}
</code></pre>
<p>In an interface, you can define arguments, parameters and attributes.</p>
<pre><code class="language-jome"><span class="hljs-variable">interface</span> <span class="hljs-title class_">Example</span> |
  <span class="hljs-variable">argument</span>,
  <span class="hljs-variable">parameter</span>?,
  <span class="hljs-variable">@requiredAttribute</span>,
  <span class="hljs-variable">@optionalAttribute</span>?
|
</code></pre>
<p>Maybe also latter possible to define function that must be implemented by the class using the interface.</p>
<p>An interface can be used by classes and by functions.</p>
<h3>Functions</h3>
<p>Il doit y avoir un espace avant le -&gt; pour que ce soit une fonction. Sinon, c'est le meta accessor.</p>
<p>By default, Jome adds returns statements to functions. This setting can be disabled in the config file.</p>
<p>It is very nice when prototyping to not have to write return statements. But for production code, it is safer to always write them, this
way you never return by accident a sensitive value that should be hiden from users.</p>
<h2>State variables</h2>
<p>Nodes can have state variables that start with a percentage sign like <code>%stateVar = 10</code></p>
<pre><code class="language-jome">{ <span class="hljs-comment">// %count does not have to be declared in the Btn class, you can attach any state to any node</span>
  <span class="hljs-title class_">Btn</span> %count: <span class="hljs-number">0</span>, ~click: =&gt; (%<span class="hljs-variable">count</span> += <span class="hljs-number">1</span>)
    <span class="hljs-title class_">Txt</span> <span class="hljs-string">&quot;Clicked {%count} {%count == 1 ? &#x27;time&#x27; : &#x27;times&#x27;}&quot;</span>  
}
<span class="hljs-comment">// Txt does not have a %count state variable, so it checks to see if it&#x27;s parent has one. Yes, Btn has a state variable called %count.</span>
<span class="hljs-comment">// So Txt will add itself as a dependency on Btn state. It Btn state changes, then Txt will be updated too.</span>
</code></pre>
<p>C'est OK, mais j'aimerais pouvoir dire à qui appartient le state au lieu d'être à l'aveugle comme ça.</p>
<p>J'aimerais pouvoir setter le state à travers un nom de node? Je ne sais pas ce n'est pas si explicit non plus...</p>
<p>Qu'est-ce qui se passe si le node et ses parents n'ont pas le state?</p>
<p>State variables inside classes.</p>
<p>Class using parent state:</p>
<pre><code class="language-jome"><span class="hljs-comment">// A question mark when dependent on a state or an exclamation mark (silent vs throw exception?)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">ColoredText</span> |<span class="hljs-variable">@text</span>, %<span class="hljs-variable">theme</span>?| {
  print: () =&gt; {
    <span class="hljs-keyword">return</span> <span class="hljs-string">\`&lt;p style=&quot;color: {%theme.textColor}&quot;&gt;{%theme}&lt;/p&gt;\`</span>
  }
}
</code></pre>
<p>Class having state:</p>
<pre><code class="language-jome"><span class="hljs-comment">// No question mark having state</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">App</span> |%<span class="hljs-variable">theme</span>| {
  init: () =&gt; {
    %<span class="hljs-variable">theme</span> = {
      textColor: <span class="hljs-string">&quot;red&quot;</span>
    }
  }
}
</code></pre>
<h3>Documenting state variables</h3>
<p>Declaring state variables is not necessary. You can simply attach them to nodes. But it should be pretty important
to declare them, in order to know what is available.</p>
<pre><code class="language-jome"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Something</span> |%<span class="hljs-variable">someState</span>| =&gt; {

}
</code></pre>
<h2>Optional keys</h2>
<p>:? =&gt; set le key value seulement si il y a une valeur</p>
<pre><code class="language-jome"><span class="hljs-keyword">let</span> <span class="hljs-variable">value</span> = <span class="hljs-keyword">null</span>
<span class="hljs-keyword">let</span> <span class="hljs-variable">obj</span> = {
 key:? <span class="hljs-variable">value</span>
}
<span class="hljs-variable">obj</span> === {} <span class="hljs-comment">// true</span>
<span class="hljs-string">&quot;key&quot;</span> <span class="hljs-variable">in</span> <span class="hljs-variable">obj</span> <span class="hljs-comment">// false</span>
</code></pre>
  <h2 id="scripts">Scripts</h2>
<p>In jome, the idea is that you could include most other programming languages directly using xml tags.</p>
<pre><code class="language-jome"><span class="hljs-comment">// Execute a shell command in a script</span>
<span class="language-shell">&lt;sh&gt;ls -A&lt;/sh&gt;</span>

<span class="hljs-comment">// Ruby is a pretty nice language for scripts too </span>
&lt;<span class="hljs-variable">rb</span>&gt;<span class="hljs-variable">puts</span> (<span class="hljs-number">1.</span><span class="hljs-number">.10</span>).<span class="hljs-title function_">select</span>(&amp;:<span class="hljs-variable">even</span>?).<span class="hljs-variable">sum</span>&lt;/<span class="hljs-variable">rb</span>&gt;
</code></pre>
<p>Supported list for now:</p>
<ul>
<li>sh</li>
<li>html</li>
<li>md</li>
<li>js</li>
</ul>
<p>TODO list:</p>
<ul>
<li>css</li>
<li>bin</li>
<li>oct</li>
<li>hex</li>
<li>rb</li>
<li>sql</li>
<li>txt et/ou str</li>
<li>C</li>
<li>cpp</li>
</ul>
<p>MAYBE list:</p>
<ul>
<li>col: For color, need a way to let the editor know that we want to be picking a color.</li>
</ul>
<h3>Scripts for data</h3>
<p>TODO:</p>
<p>En jome, c'est <bin>01010101</bin> pour faire du binaire et <hex>FF00AA</hex> pour faire de l'hexadécimal.
<oct>12345678</oct> compile en 0o</p>
<p>Ne pas supporter 0xFF00AA et ne pas supporter non plus 0b01010101, ceci est confondant avec les unités.</p>
<p>bin et hex compile en utilisant 0x et 0b</p>
<p>TODO: Rajouter du syntax highligh au hex pour changer de couleur à toute les 2 charactères? Afficher comme des
string et à tous les 2 charactères mettre comme si escaped string pour que la couleur change un peu.</p>
<p>TODO: Supporter la syntaxe 123e4 par contre
let exponentialNumber = 123e4;
console.log(exponentialNumber); // Outputs: 1230000</p>
<h3>Scripts interpolation</h3>
<p>You can add data inside the scripts using the &lt; % =    % &gt; syntax.</p>
<p>Contrary to other template languages like ejs, you must finish the expression given inside the interpolation tag.</p>
<p>If you want to do a condition for example, you use a nesting tag &lt; &gt; ... &lt; / &gt;</p>
<pre><code class="language-jome">&lt; % = <span class="hljs-keyword">if</span> <span class="hljs-keyword">true</span> &lt; &gt;
  &lt;<span class="hljs-variable">div</span> <span class="hljs-keyword">class</span>=<span class="hljs-string">&quot;content&quot;</span>&gt;
    &lt; % = <span class="hljs-variable">content</span> % &gt;
  &lt;/<span class="hljs-variable">div</span>&gt;
<span class="hljs-variable">else</span> &lt; &gt;
  &lt;<span class="hljs-variable">div</span> <span class="hljs-keyword">class</span>=<span class="hljs-string">&quot;content&quot;</span>&gt;
    &lt; % = <span class="hljs-variable">content</span> % &gt;
  &lt;/<span class="hljs-variable">div</span>&gt;
&lt; / &gt; % &gt;
</code></pre>
<p>The behavior will depend on the kind of script.</p>
<p>On html, it will insert a template literal interpolation.</p>
<p>On markdown what do I want to do?</p>
<p>Logically, it would include markdown. But this mean that some markdown would be compiled at compile time,
and that the text inside the interpolation would be compiled at run time. I don't like this because I don't
want the built file to include the javascript of markdown-it. But this could be a feature if that is actually
what the user want.</p>
<p>But right now, I am the user and this is not what I want. So what I want is that the text to be interpolated
be removed from the markdown compile, and that inserted compiled using a template literal.</p>
<p>Basically, I want to inject html and not inject markdown directly.</p>
<h3>.jobj extension</h3>
<p>Files with a .jobj extension would start already in a block.</p>
<p>It think this would be pratical for example for config files.</p>
<h2>PARAMS</h2>
<p>Get the list of parameters given to a function.</p>
<pre><code class="language-jome">  <span class="hljs-keyword">def</span> <span class="hljs-variable">someFunc</span> = =&gt; (
    <span class="hljs-title class_">PARAMS</span> <span class="hljs-comment">// The object containing all the paramters given to the function.</span>
  )  
</code></pre>
  <h2 id="utilities">Utilities</h2>
<p>Utilities start with the # character.</p>
<p>It can be a constant or acting upon a variable.</p>
<p>TODO: To use the previous token as an argument, use &quot;.#&quot; syntax.</p>
<p>obj.#keys === #keys(obj)</p>
<pre><code class="language-jome"><span class="hljs-comment">// Utility constants</span>
<span class="hljs-keyword">let</span> <span class="hljs-variable">angle</span> = #<span class="hljs-title function_">sin</span>(<span class="hljs-number">2</span> * #<span class="hljs-title class_">PI</span> * <span class="hljs-variable">1deg</span>)
<span class="hljs-comment">// Utility acting on variable</span>
<span class="hljs-keyword">let</span> <span class="hljs-variable">objKeys</span> = <span class="hljs-variable">obj</span>.#<span class="hljs-variable">keys</span> <span class="hljs-comment">// same as Object.keys(obj)</span>
</code></pre>
<p>List of jome constants: TODO</p>
<ul>
<li>#sin</li>
<li>#cos</li>
<li>#tan</li>
<li>#PI: 3.14159...</li>
<li>#e: Euler's constat</li>
<li>#dirname: Equivalent of __dirname</li>
<li>#filename: Current filename</li>
</ul>
<p>Actually, it here here that could go every underscore.js function:</p>
<ul>
<li>#map</li>
<li>#reduce</li>
<li>...</li>
</ul>
<p>TODO: All html colors: MAYBEEE? Because I don't know in what format I would want the value to be... so probably don't do this</p>
<ul>
<li>#red: 0xFF0000</li>
<li>...</li>
</ul>
<p>Allows to save keystrokes and is easier to type.
Allows to easily use most of underscore.js features directly.</p>
<pre><code class="language-jome"><span class="hljs-variable">dict</span> = {x: <span class="hljs-number">10</span>, y: <span class="hljs-number">20</span>}
<span class="hljs-variable">dict</span>.#<span class="hljs-variable">keys</span> <span class="hljs-comment">// Object.keys(obj)</span>
<span class="hljs-variable">dict</span>.#<span class="hljs-variable">size</span> <span class="hljs-comment">// Object.keys(obj).length</span>

<span class="hljs-variable">node</span> = {<span class="hljs-comment">/* ... */</span>}
<span class="hljs-variable">node</span>.#<span class="hljs-variable">children</span>.#<span class="hljs-title function_">each</span>(() =&gt; (
  
))

<span class="hljs-comment">// Arrow getter is useful for arrays</span>
<span class="hljs-title class_">TODO</span>

<span class="hljs-comment">// TODO</span>
<span class="hljs-number">10.</span>#<span class="hljs-title function_">times</span>(<span class="hljs-variable">i</span> =&gt; <span class="hljs-comment">/* ... */</span>)
</code></pre>
<p>// TODO: .#each which is the same as .forEach, but 2 characters less</p>
<p>The list of current arrow properties:</p>
<pre><code class="language-jome"><span class="hljs-variable">obj</span>.#<span class="hljs-variable">keys</span> <span class="hljs-comment">// Object.keys(obj)</span>
<span class="hljs-variable">obj</span>.#<span class="hljs-variable">values</span> <span class="hljs-comment">// Object.values(obj)</span>
<span class="hljs-variable">obj</span>.#<span class="hljs-variable">entries</span> <span class="hljs-comment">// Object.entries(obj)</span>
<span class="hljs-variable">obj</span>.#<span class="hljs-variable">params</span> <span class="hljs-comment">// The list of props given to an object constructor</span>
<span class="hljs-variable">obj</span>.#<span class="hljs-variable">props</span> <span class="hljs-comment">// The list of props given to an object constructor</span>
<span class="hljs-variable">obj</span>.#<span class="hljs-variable">children</span> <span class="hljs-comment">// The list of children of a node</span>
<span class="hljs-variable">obj</span>.#<span class="hljs-variable">removeChildren</span> <span class="hljs-comment">// Remove all children of a node</span>
<span class="hljs-comment">// TODO</span>
<span class="hljs-variable">obj</span>.#<span class="hljs-variable">isBlank</span> <span class="hljs-comment">// Like Rails blank // ou bien isBlank?</span>
<span class="hljs-variable">obj</span>.#<span class="hljs-variable">isPresent</span> <span class="hljs-comment">// The opposite of Rails blank // ou bien isPresent?</span>
</code></pre>
<p>obj.#keys.#filter(key -&gt; key.startsWith(':')).#each /* ... */</p>
<p>TODO:
#package_dir: The closest directory to contain a package.json file.
#dirname: The directory of the current file. (Equivalent of __dirname)
#filename: The name of the current file. (Equivalent of __filename)</p>
<p>#log === console.log
#log(&quot;Hello world!&quot;)</p>
  <h2 id="instance-driven-dev">Instance driven development</h2>
  Instance driven development is what I call when the focus is working on concrete objects in Godot software.
  Most of the time you control objects directly inside the editor and simply modify parameters.
<p>It's the same thing as object oriented, but the focus is on the concrete object rather than the abstract class.</p>
  <h2 id="units">Units</h2>
<pre><code class="language-jome"><span class="hljs-variable">debug</span> = |<span class="hljs-variable">arg</span>, <span class="hljs-keyword">unit</span> <span class="hljs-variable">argUnit</span>| =&gt; (
  <span class="hljs-comment">/* ... */</span>
)
</code></pre>
<p>You can add units at the end of numbers like 100g. You can also add units at the end of variables using the middle dot.</p>
<p>This feature is not yet implemented. Right now, it does nothing. The idea, is that if you have a function for example sleep
that takes a time, then you can give it 1s or 1000ms or 0.000ks and it would all do the same thing.</p>
<p>I want everything to be handled at compile time. I don't want to create a datastructure for this.</p>
<p>Also, it's just nice to be able to write a unit beside a number.</p>
<p>An idea also is that I would like to add an operator like variable-&gt;unit =&gt; which gives the unit has a string.
So this way, you have the number for the variable directly, but if the program can infer the unit of the variable,
you can also get it's unit.</p>
<p>density = 105g / 98mL
density-&gt;unit =&gt; &quot;g/mL&quot;</p>
<p>area = 2m * 3m
area-&gt;unit =&gt; &quot;m^2&quot;</p>
<p>maybe, for an argument to a function, well it could be anything, so you either specify what unit you are expecting,
or maybe have a special construct that means that you want the variable and it's unit</p>
<p>func = |anything| =&gt; anything-&gt;unit
func(10g)
// because we are asking for unit here, it means that two args must actually be passed to the function, anything and __unit__anything
so it would be compiled to
function func(anything, __unit__anything) {</p>
<p>}
func(10, &quot;g&quot;)</p>
  <h2 id="verbatim">Verbatim string literals</h2>
<p>Verbatim string literals are strings that do not interpolate. The idea is taken from C#. But in C# it also includes backslashes without escaping
them I don't know if I want to do that. Or I want to offer multiple possibilities.</p>
<pre><code class="language-jome"><span class="hljs-variable">str</span> = @<span class="hljs-string">&quot;This is a string that does \${not} interpolate&quot;</span>
</code></pre>
<h2>signals</h2>
<p>Signals are used for events. They are not very much implemented yet. TODO: Check how Godot handles events, check how js handles events.</p>
<p>In Jome, signals start with a tilde.</p>
<pre><code class="language-jome"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Button</span> {
  ~<span class="hljs-title function_">click</span>() {
    <span class="hljs-variable">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;Button clicked!&#x27;</span>)
  }
}

<span class="hljs-variable">btn</span> = « <span class="hljs-title class_">Button</span> »
<span class="hljs-variable">btn</span>.<span class="hljs-title function_">click</span>()
</code></pre>
<h3>Default signals</h3>
<p>Default signals are created for very common things.</p>
<p>Jome signals:</p>
<ul>
<li>~created: Called when an object is created. I think this would be soooo nice and would be very usefull.
This way, you can create an object and call a lot of methods that define how the object will be created.
Then it will be call automatically. Maybe objects will have a variable isAuto by default true and if true
then it will executed created automatically.</li>
</ul>
<p>Html functions:</p>
<p>click, ...</p>
<h3>Under the hood</h3>
<p>Work in progress</p>
<p>Signals are compiled as functions where the tilde is replaced by the prefix on_. And another
function is created with the same same as the signal to force the signal.</p>
<p>Or maybe just the version without the tilde and that's it?</p>
<pre><code class="language-js"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Button</span> {
  <span class="hljs-title function_">on_click</span>(<span class="hljs-params"></span>) {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;Button clicked!&#x27;</span>)
  }
  <span class="hljs-title function_">click</span>(<span class="hljs-params"></span>) { <span class="hljs-title function_">on_click</span>() }
  <span class="hljs-comment">// or simply</span>
  <span class="hljs-title function_">click</span>(<span class="hljs-params"></span>) {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;Button clicked!&#x27;</span>)
  }
}

btn = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Button</span>()
btn.<span class="hljs-title function_">click</span>()
</code></pre>
  <h2 id="declaration">Declaration</h2>
<p>When you declare a variable without a keyword, the variable will be a constant. To declare a variable, use the var keyword.
To declare a function, use de def function.</p>
<p>TODO: Keywords, var, def, let</p>
<pre><code class="language-jome"><span class="hljs-title class_">PI</span> = <span class="hljs-number">3.1415</span>
<span class="hljs-title class_">PI</span> = <span class="hljs-number">10</span> <span class="hljs-comment">// ERROR. PI is not allowed to be redeclared anywhere nested inside the scope</span>
<span class="hljs-keyword">var</span> <span class="hljs-variable">x</span> = <span class="hljs-number">10</span>
<span class="hljs-variable">x</span> = <span class="hljs-number">20</span>
<span class="hljs-keyword">def</span> <span class="hljs-variable">add10</span> = <span class="hljs-variable">x</span> =&gt; <span class="hljs-variable">x</span> + <span class="hljs-number">10</span>
<span class="hljs-title function_">add10</span>(<span class="hljs-number">20</span>)
<span class="hljs-variable">add10</span> = <span class="hljs-variable">x</span> =&gt; <span class="hljs-variable">x</span> + <span class="hljs-number">20</span> <span class="hljs-comment">// ERROR. add10 can only be redeclared in a nested scope</span>
</code></pre>
<h2>Capture de code</h2>
<p>TODO: Quelque chose que j'aimerais beaucoup avoir. Un système pour capturer le code.</p>
<p>Par exemple,</p>
<pre><code class="language-jome"><span class="hljs-variable">nomDeVariable</span> = <span class="hljs-number">10</span>
<span class="hljs-variable">debug</span> = |<span class="hljs-variable">arg</span>, <span class="hljs-keyword">code</span> <span class="hljs-variable">argCode</span>| =&gt; (
  <span class="hljs-variable">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&quot;Debugging {argCode}: Value {arg}&quot;</span>)
)
<span class="hljs-title function_">debug</span>(<span class="hljs-variable">nomDeVariable</span>) <span class="hljs-comment">// =&gt; Debugging nomDeVariable: Value 10</span>
</code></pre>
<h2>String modifier</h2>
<p>Idée:</p>
<p>J'aimerais pouvoir faire
$&quot;$URL/stylesheet.css&quot;
ou
&quot;$URL/stylesheet.css&quot;$
ou
au lieu de
<code>{$URL}/stylesheet.css</code>
Ça serait plus simple mettre le modificateur avec pour parser, mais c'est plus beau après.</p>
<h2>Main</h2>
<p>The <code>main</code> keyword is compiled to <code>export default</code>.</p>
<p>Waiiiiiiit. Pas sur. Je vais convertir mes trucs en CommonJs, et on va voir après si je peux supporter ça.</p>
<p>Possiblement tu peux faire main ou export, mais pas les deux en même temps, parce que sois tu exécutes, sois tu exportes des fonctions
parce que tu ne peux pas avoir l'équivalent de export et export default en CommonJS je crois.</p>
<h3>Export</h3>
<p>Au lieu de export, le keyword public?</p>
<p>Une idée: Tous est export par défault. Pour mettre privé, mettre un underscore au début.</p>
<p>Ça pourrait être une option de compilation optionelle. (enabled on mode prototypage, disabled en mode securité?)</p>
<pre><code class="language-jome"><span class="hljs-keyword">def</span> <span class="hljs-variable">publicFunc</span> = =&gt; (

)

<span class="hljs-keyword">def</span> <span class="hljs-variable">_privateFunc</span> = =&gt; (
  
)
</code></pre>
<h2>Environment variables</h2>
<p>FIXME: Environment variables do not start with a dollar sign anymore. Global variables do</p>
<p>Use #env for environment variables</p>
<pre><code class="language-jome">#<span class="hljs-variable">env</span>.<span class="hljs-title class_">MY_ENV_VAR</span> = <span class="hljs-string">&#x27;foo&#x27;</span> <span class="hljs-comment">// =&gt; process.env.MY_ENV_VAR = &#x27;foo&#x27;</span>
</code></pre>
<h2>Global variables</h2>
<p>TODO: Global variables start with a dollar sign. For example, <code>$MY_GLOB_VAR = 'foo'</code>.</p>
<h2>Pretty output</h2>
<p>Idéalement, je ne me soucis pas de l'indentation de l'output et tout le tralala qui peut compliquer le compilateur pour rien.</p>
<p>Simplement passer le code dans un formatteur de code.</p>
<p>J'ai essayé prettier et js-beautify.</p>
<p>Je préfère de loin prettier je trouve son output plus beau personnellement.</p>
<p>Le problème est que prettier bug et ne veut pas process mes fichiers s'ils sont dans le .gitignore file............</p>
<h2>Types</h2>
<p>TODO: Support static typing a little like Typescript.</p>
<p>You will be able to add the type of the variable with a colon like in the examples below.</p>
<pre><code class="language-jome"><span class="hljs-keyword">def</span> <span class="hljs-variable">greet</span> = |name: <span class="hljs-variable">string</span>, greeting: <span class="hljs-variable">string</span> = <span class="hljs-string">&quot;Hello&quot;</span>|: <span class="hljs-variable">string</span> =&gt; {
  <span class="hljs-string">\`\${greeting}, \${name}!\`</span>
}
</code></pre>
<pre><code class="language-jome"><span class="hljs-variable">interface</span> <span class="hljs-title class_">Person</span> {
  firstName: <span class="hljs-variable">string</span> = <span class="hljs-string">&quot;John&quot;</span>
  lastName: <span class="hljs-variable">string</span> = <span class="hljs-string">&quot;Doe&quot;</span>
  age: <span class="hljs-variable">number</span>
}
</code></pre>
<pre><code class="language-jome"><span class="hljs-keyword">var</span> answer: <span class="hljs-variable">number</span> = <span class="hljs-number">42</span>
</code></pre>
<p>I don't know Typescript. I don't get why type and interface. Let's just use Jome interface for now.</p>
<h2>Contributing</h2>
<p>I recommend using visual studio code for now because it is super usefull for debugging tokenization. You hit Ctrl+Shift+P,
&quot;inspect editor token and scope&quot;, and you see if it is correct. Also you see using syntax highlighting.</p>
<p>You can make pull requests on github.</p>
<p>You can simply make constructive comments on github.</p>
<p>Keep in mind I am working only 10 hours a week on this project for now.</p>
<h2>Acknowledgements</h2>
<p>TODO: Explain why</p>
<ul>
<li>CoffeeScript: I was kinda lost at some point. I did not have a clear direction for my language. Until I thought, hey, coffeescript did something similar! So it gave me a lot of guidance.</li>
<li>underscore.js: A great library full of goodies.</li>
<li>vscode: Escpecially thank you for creating custom grammar. It is really nice to create a grammar and see live the tokenization.</li>
<li>ChatGPT: I probably never would have had to courage to go through with writing a programming language if I did not have the help from ChatGPT.</li>
</ul>
<p>Thank you to everyone who contributed to any open-sourced library. Escpecially under a license like MIT license. You are awesome!</p>
<p>TODO: Link to the librairies website</p>
<p>Librairies used:</p>
<ul>
<li>express</li>
<li>markdown-it</li>
</ul>
<h2>Thrash</h2>
<p>It's intented main purpose is to be used for prototyping or small projects. It is usefull for concrete applications like making something visual.</p>
<pre><code>«
Page
  Navbar
    List
      Link &quot;Musics&quot;, to: '/musics'
      Link &quot;Sports&quot;, to: '/sports'
      Link &quot;Arts&quot;, to: '/arts'
  Body
    Txt &lt; md &gt;
      # Welcome
      Welcome to this website! You can browse links at the top.
    &lt; / md&gt;
</code></pre>
<p>»</p>
<pre><code>Il est aussi possible de définir des variables dans un bloc. Les variables sont simplement sorties du block et exécuter avant le bloc.
</code></pre>
<p>Avoir un keyword new ou ben simplement toujours utiliser les blocks?</p>
<pre><code class="language-jome"><span class="hljs-variable">obj</span> = <span class="hljs-variable">new</span> <span class="hljs-title function_">Obj</span>(<span class="hljs-comment">/* ... */</span>) <span class="hljs-comment">// Supporter new?</span>
<span class="hljs-variable">obj</span> = {<span class="hljs-title class_">Obj</span> <span class="hljs-comment">/* ... */</span>}
</code></pre>
<p>The advantage is that there is never confusion. You never have an error that tells you you have to add parentheses. For example, in javascript:</p>
<pre><code class="language-js"><span class="hljs-keyword">let</span> <span class="hljs-title function_">someFunction</span> = (<span class="hljs-params"></span>) =&gt; ({<span class="hljs-attr">x</span>: <span class="hljs-number">10</span>}) <span class="hljs-comment">// you often have to add extra parentheses around objects in js</span>
</code></pre>
<h2>Features</h2>
<p>Main ideas:</p>
<ul>
<li><a href="#nodes">Nodes</a> - An object in a tree structure</li>
<li><a href="#integrated-scripts">Integrated scripts</a> - Incoroporate code from other languages</li>
<li><a href="#named-parameters">Named parameters and props</a> - Add optional parameters easily</li>
<li><a href="#instance-driven-dev">Instance driven development</a> - A more approchable way to programming</li>
</ul>
<p>Goodies / Syntaxic sugar:</p>
<ul>
<li><a href="#arrow-getter">Arrow getter</a> - Allows to save keystrokes and is easier to type. ex: obj-&gt;keys =&gt; Object.keys(obj)</li>
<li>Optional let - Not sure about that one...</li>
<li><a href="#verbatim">Verbatim string literals</a> - @\`This is a string that does \${not} interpolate\`</li>
<li><a href="#units">Units</a> - You can add units to numbers. ex: &quot;density = 105g / 98mL&quot;</li>
<li><a href="#hyphens">Hyphen</a> - You can use hyphens in variable names like left-panel. The minus operator should always be surrounded by spaces.</li>
</ul>
`)}).toString()