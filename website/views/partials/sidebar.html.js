module.exports = () => {
  return `
  <div id="left-nav" class="scrollable">
    <ul class="nav-list">
      <li><a href="${ROOT}/">Home</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${ROOT}/#overview">Overview</a></li>
        <li><a href="${ROOT}/#install">Install</a></li>
        <li><a href="${ROOT}/#usage">Usage</a></li>
        <li><a href="${ROOT}/#hello-world">Hello world</a></li>
        <li><a href="${ROOT}/#index-jome">index.jome</a></li>
        <li><a href="${ROOT}/#partials">Partials</a></li>
      </ul>
      <li><a href="${ROOT}/#lang-ref">Language Reference</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${ROOT}/#syntax">Syntax</a></li>
        <ul class="nav-list nav-sub-sub">
          <li><a href="${ROOT}/#keywords">Keywords</a></li>
          <li><a href="${ROOT}/#comments">Comments</a></li>
        </ul>
        <li><a href="${ROOT}/#builtins">Built-Ins</a></li>
        <li><a href="${ROOT}/#strings">Strings</a></li>
        <ul class="nav-list nav-sub-sub">
          <li><a href="${ROOT}/#formatting">Formatting</a></li>
          <li><a href="${ROOT}/#heredocs">Heredocs</a></li>
          <li><a href="${ROOT}/#paths">Paths</a></li>
        </ul>
        <li><a href="${ROOT}/#conditions">Conditions</a></li>
        <li><a href="${ROOT}/#loops">Loops</a></li>
        <li><a href="${ROOT}/#switch-case">Switch/Case</a></li>
        <li><a href="${ROOT}/#with">With keyword</a></li>
        <li><a href="${ROOT}/#classes">Classes</a></li>
        <ul class="nav-list nav-sub-sub">
          <li><a href="${ROOT}/#formatting">Instance properties (@)</a></li>
        </ul>
        <li><a href="${ROOT}/#exports">Modules and exports</a></li>
        <li><a href="${ROOT}/#along">Along keyword</a></li>
        <li><a href="${ROOT}/#threads">Threads</a></li>
        <li><a href="${ROOT}/#private">Private</a></li>
        <li><a href="${ROOT}/#env">Environment variables</a></li>
        <li><a href="${ROOT}/#global">Global variables</a></li>
        <li><a href="${ROOT}/#chain">Chain</a></li>
        <li><a href="${ROOT}/#contributing">Contributing</a></li>
        <li><a href="${ROOT}/#ack">Acknowledgements</a></li>
      </ul>
      <li><a href="${ROOT}/lib">Librairies</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${ROOT}/lib/html">Html</a></li>
        <li><a href="${ROOT}/lib/html-layout">Html Layout</a></li>
        <li><a href="${ROOT}/lib/express-server">Express Server</a></li>
      </ul>
      <li><a href="${ROOT}/ex">Examples</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${ROOT}/ex#hello-world">Hello world</a></li>
        <li><a href="${ROOT}/ex#snake">Snake</a></li>
        <li><a href="${ROOT}/ex">Script</a></li>
      </ul>
    </ul>
  </div>`;
};
