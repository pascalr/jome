module.exports = () => {
  return `
  <div class="navbar">
    <span class="navbrand" href="#">Jome</span>
    <a href="${global._URL}/editor">Editor</a>
    <a href="${global._URL}/">Home</a>
    <a href="${global._URL}/#lang-ref">Language Reference</a>
    <a href="${global._URL}/ex">Examples</a>
    <a href="${global._URL}/lib">Librairies</a>
    <a href="${global._URL}/utils">Utils</a>
    <a href="https://github.com/pascalr/jome">GitHub</a>
  </div>
`;
};
