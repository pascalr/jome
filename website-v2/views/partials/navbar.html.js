module.exports = () => {
  return `
  <div class="navbar">
    <span class="navbrand" href="#">Jome</span>
    <a href="${global.g_URL}/editor">Editor</a>
    <a href="${global.g_URL}/">Home</a>
    <a href="${global.g_URL}/#lang-ref">Language Reference</a>
    <a href="${global.g_URL}/ex">Examples</a>
    <a href="${global.g_URL}/lib">Librairies</a>
    <a href="${global.g_URL}/formats">Formats</a>
    <a href="${global.g_URL}/utils">Utils</a>
    <a href="https://github.com/pascalr/jome">GitHub</a>
  </div>`;
};
