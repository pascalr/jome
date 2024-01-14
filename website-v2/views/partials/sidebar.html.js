module.exports = () => {
  return `
  <div id="left-nav" class="scrollable">
    <ul class="nav-list">
      <li><a href="${global.g_URL}/">Home</a></li>
      <li><a href="${global.g_URL}/#lang-ref">Language Reference</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${global.g_URL}/#syntax">Syntax</a></li>
        <li><a href="${global.g_URL}/#blocks">Blocks</a></li>
        <li><a href="${global.g_URL}/#nodes">Nodes</a></li>
        <li><a href="${global.g_URL}/#scripts">Scripts</a></li>
        <li><a href="${global.g_URL}/#named-parameters">Named parameters</a></li>
        <li><a href="${global.g_URL}/#classes">Classes</a></li>
        <li><a href="${global.g_URL}/#interfaces">Interfaces</a></li>
        <li><a href="${global.g_URL}/#arrow-getter">Arrow getter</a></li>
        <li><a href="${global.g_URL}/#instance-driven-dev">Instance driven development</a></li>
        <li><a href="${global.g_URL}/#verbatim">Verbatim string literals</a></li>
        <li><a href="${global.g_URL}/#units">Units</a></li>
        <li><a href="${global.g_URL}/#hyphens">Hyphen</a></li>
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
