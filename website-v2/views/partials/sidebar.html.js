module.exports = () => {
  return `
  <div id="left-nav" class="scrollable">
    <ul class="nav-list">
      <li><a href="${global.g_URL}/">Home</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${global.g_URL}/#overview">Overview</a></li>
        <li><a href="${global.g_URL}/#install">Install</a></li>
        <li><a href="${global.g_URL}/#usage">Usage</a></li>
        <li><a href="${global.g_URL}/#hello-world">Hello world</a></li>
        <li><a href="${global.g_URL}/#index-jome">index.jome</a></li>
        <li><a href="${global.g_URL}/#partials">Partials</a></li>
      </ul>
      <li><a href="${global.g_URL}/#lang-ref">Language Reference</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${global.g_URL}/#syntax">Syntax</a></li>
        <ul class="nav-list nav-sub-sub">
          <li><a href="${global.g_URL}/#keywords">Keywords</a></li>
          <li><a href="${global.g_URL}/#comments">Comments</a></li>
        </ul>
        <li><a href="${global.g_URL}/#built-ins">Built-Ins</a></li>
        <li><a href="${global.g_URL}/#scripts">Scripts</a></li>
        <li><a href="${global.g_URL}/#chain">Chain</a></li>
        <li><a href="${global.g_URL}/#instance-props">Instance properties (@)</a></li>
        <li><a href="${global.g_URL}/#paths">Paths</a></li>
        <li><a href="${global.g_URL}/#loops">Loops</a></li>
        <li><a href="${global.g_URL}/#conditions">Conditions</a></li>
        <li><a href="${global.g_URL}/#comments">Comments</a></li>
        <li><a href="${global.g_URL}/#switch-case">Switch/Case</a></li>
        <li><a href="${global.g_URL}/#classes">Classes</a></li>
        <li><a href="${global.g_URL}/#exports">Modules and exports</a></li>
        <li><a href="${global.g_URL}/#with">With keyword</a></li>
        <li><a href="${global.g_URL}/#along">Along keyword</a></li>
        <li><a href="${global.g_URL}/#strings">Strings</a></li>
        <li><a href="${global.g_URL}/#formating">Formatting</a></li>
        <li><a href="${global.g_URL}/#threads">Threads</a></li>
        <li><a href="${global.g_URL}/#private">Private</a></li>
        <li><a href="${global.g_URL}/#env">Environment variables</a></li>
        <li><a href="${global.g_URL}/#global">Global variables</a></li>
        <li><a href="${global.g_URL}/#contributing">Contributing</a></li>
        <li><a href="${global.g_URL}/#ack">Acknowledgements</a></li>
      </ul>
      <li><a href="${global.g_URL}/lib">Librairies</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${global.g_URL}/lib/html">Html</a></li>
        <li><a href="${global.g_URL}/lib/html-layout">Html Layout</a></li>
        <li><a href="${global.g_URL}/lib/express-server">Express Server</a></li>
      </ul>
      <li><a href="${global.g_URL}/ex">Examples</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${global.g_URL}/ex#hello-world">Hello world</a></li>
        <li><a href="${global.g_URL}/ex#snake">Snake</a></li>
        <li><a href="${global.g_URL}/ex">Script</a></li>
      </ul>
    </ul>
  </div>
`;
};
