import jome from 'jome'


import {AppPage} from "../../lib/app.built.js";

export default new AppPage({title: 'Jome express server', content: `<h1>Express Server</h1>
<p>ExpressServer is a wrapper for express in Jome.</p>
<h2>Usage</h2>
<pre><code class="language-jome">{
  <span class="hljs-title class_">ExpressServer</span> port: <span class="hljs-number">3000</span>
    <span class="hljs-variable">useStatic</span> <span class="hljs-string">&#x27;/jome&#x27;</span>, <span class="hljs-string">&#x27;docs&#x27;</span>
    <span class="hljs-variable">get</span> <span class="hljs-string">&#x27;/&#x27;</span>, |<span class="hljs-variable">req</span>, <span class="hljs-variable">res</span>| =&gt; (
      <span class="hljs-variable">res</span>.<span class="hljs-title function_">redirect</span>(<span class="hljs-string">&#x27;/jome&#x27;</span>)
    )
}
<span class="hljs-variable">run</span>
</code></pre>
`}).toString()