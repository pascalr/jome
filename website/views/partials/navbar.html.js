module.exports = () => {
  return `
  <div class="navbar">
    <span class="navbrand" href="#">Jome</span>
    <a href="${ROOT}/editor">Editor</a>
    <a href="${ROOT}/">Home</a>
    <a href="${ROOT}/#lang-ref">Language Reference</a>
    <a href="${ROOT}/ex">Examples</a>
    <a href="${ROOT}/lib">Librairies</a>
    <a href="${ROOT}/formats">Formats</a>
    <a href="${ROOT}/utils">Utils</a>
    <a href="https://github.com/pascalr/jome">GitHub</a>
  </div>`;
};
