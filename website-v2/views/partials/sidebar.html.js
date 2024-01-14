module.exports = () => {
  return `
  <div id="left-nav" class="scrollable">
    <ul class="nav-list">
      <li><a href="${global._URL}/">Home</a></li>
      <li><a href="${global._URL}/#lang-ref">Language Reference</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${global._URL}/#syntax">Syntax</a></li>
        <li><a href="${global._URL}/#blocks">Blocks</a></li>
        <li><a href="${global._URL}/#nodes">Nodes</a></li>
        <li><a href="${global._URL}/#scripts">Scripts</a></li>
        <li><a href="${global._URL}/#named-parameters">Named parameters</a></li>
        <li><a href="${global._URL}/#classes">Classes</a></li>
        <li><a href="${global._URL}/#interfaces">Interfaces</a></li>
        <li><a href="${global._URL}/#arrow-getter">Arrow getter</a></li>
        <li><a href="${global._URL}/#instance-driven-dev">Instance driven development</a></li>
        <li><a href="${global._URL}/#verbatim">Verbatim string literals</a></li>
        <li><a href="${global._URL}/#units">Units</a></li>
        <li><a href="${global._URL}/#hyphens">Hyphen</a></li>
      </ul>
      <li><a href="${global._URL}/lib">Librairies</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${global._URL}/lib/html">Html</a></li>
        <li><a href="${global._URL}/lib/html-layout">Html Layout</a></li>
        <li><a href="${global._URL}/lib/express-server">Express Server</a></li>
      </ul>
      <li><a href="${global._URL}/ex">Examples</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="${global._URL}/ex#hello-world">Hello world</a></li>
        <li><a href="${global._URL}/ex#snake">Snake</a></li>
        <li><a href="${global._URL}/ex">Script</a></li>
      </ul>
    </ul>
  </div>
`;
};
