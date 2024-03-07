module.exports = () => {
  return `
  <div id="left-nav" class="scrollable">
    <ul class="nav-list">
      <li><a href="${ROOT}/">Home</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${ROOT}/#overview">Overview</a></li>
        <li><a href="${ROOT}/#features">Features</a></li>
      </ul>
      <li><a href="${ROOT}/getting_started">Getting started</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${ROOT}/getting_started/#install">Install</a></li>
        <li><a href="${ROOT}/getting_started/#usage">Usage</a></li>
        <li><a href="${ROOT}/getting_started/#hello-world">Hello world</a></li>
        <li><a href="${ROOT}/getting_started/#index-jome">index.jome</a></li>
        <li><a href="${ROOT}/getting_started/#config-jome">config.jome</a></li>
      </ul>
      <li><a href="${ROOT}/ref">Language Reference</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${ROOT}/ref/#syntax">Syntax</a></li>
        <ul class="nav-list nav-sub-sub">
          <li><a href="${ROOT}/ref/#keywords">Keywords</a></li>
          <li><a href="${ROOT}/ref/#comments">Comments</a></li>
        </ul>
        <li><a href="${ROOT}/ref/#builtins">Built-Ins</a></li>
        <li><a href="${ROOT}/ref/#strings">Strings</a></li>
        <ul class="nav-list nav-sub-sub">
          <li><a href="${ROOT}/ref/#formatting">Formatting</a></li>
          <li><a href="${ROOT}/ref/#heredocs">Heredocs</a></li>
          <li><a href="${ROOT}/ref/#paths">Paths</a></li>
        </ul>
        <li><a href="${ROOT}/ref/#conditions">Conditions</a></li>
        <li><a href="${ROOT}/ref/#loops">Loops</a></li>
        <li><a href="${ROOT}/ref/#switch-case">Switch/Case</a></li>
        <li><a href="${ROOT}/ref/#with">With keyword</a></li>
        <li><a href="${ROOT}/ref/#classes">Classes</a></li>
        <ul class="nav-list nav-sub-sub">
          <li><a href="${ROOT}/ref/#formatting">Instance properties (@)</a></li>
        </ul>
        <li><a href="${ROOT}/ref/#exports">Modules and exports</a></li>
        <li><a href="${ROOT}/ref/#along">Along keyword</a></li>
        <li><a href="${ROOT}/ref/#threads">Threads</a></li>
        <li><a href="${ROOT}/ref/#private">Private</a></li>
        <li><a href="${ROOT}/ref/#env">Environment variables</a></li>
        <li><a href="${ROOT}/ref/#global">Global variables</a></li>
        <li><a href="${ROOT}/ref/#chain">Chain</a></li>
        <li><a href="${ROOT}/ref/#contributing">Contributing</a></li>
        <li><a href="${ROOT}/ref/#ack">Acknowledgements</a></li>
      </ul>
      <li><a href="${ROOT}/ex">Templates and Examples</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${ROOT}/ex/TODO">Basic (TODO: Hello world)</a></li>
        <li><a href="${ROOT}/ex/TODO">Static website (TODO)</a></li>
        <li><a href="${ROOT}/ex/TODO">Web server (TODO)</a></li>
        <li><a href="${ROOT}/ex/TODO">MVC server (TODO)</a></li>
        <li><a href="${ROOT}/ex/TODO">React (TODO)</a></li>
        <li><a href="${ROOT}/ex/TODO">Vue (TODO)</a></li>
        <li><a href="${ROOT}/ex/TODO">Svelte (TODO)</a></li>
        <li><a href="${ROOT}/ex/TODO">2d game (TODO: Snake)</a></li>
        <li><a href="${ROOT}/ex/TODO">3d game (TODO)</a></li>
        <li><a href="${ROOT}/ex/TODO">Android app (TODO)</a></li>
        <li><a href="${ROOT}/ex/TODO">Ios app (TODO)</a></li>
        <li><a href="${ROOT}/ex/TODO">Command line tool (TODO)</a></li>
      </ul>
      <li><a href="${ROOT}/in_depth">In depth</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${ROOT}/utils">Utils</a></li>
        <li><a href="${ROOT}/formats">Formats</a></li>
        <li><a href="${ROOT}/lib">Librairies</a></li>
        <ul class="nav-list nav-sub-sub">
          <li><a href="${ROOT}/lib/html">Html</a></li>
          <li><a href="${ROOT}/lib/html-layout">Html Layout</a></li>
          <li><a href="${ROOT}/lib/express-server">Express Server</a></li>
        </ul>
      </ul>
    </ul>
  </div>`;
};
