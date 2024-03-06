module.exports = () => {
  return `
  <div class="navbar">
    <span style="flex-grow: 1;"></span>
    <a class="navbrand" href="${ROOT}/">Jome</a>
    <span style="flex-grow: 2;"></span>
    <a href="${ROOT}/getting_started">Getting started</a>
    <a href="${ROOT}/ref">Language Reference</a>
    <a href="${ROOT}/ex">Examples</a>
    <a href="${ROOT}/lib">Librairies</a>
    <a href="${ROOT}/formats">Formats</a>
    <a href="${ROOT}/utils">Utils</a>
    <a href="${ROOT}/TODO">Templates</a>
    <a href="${ROOT}/editor">Editor</a>
    <a href="https://github.com/pascalr/jome">GitHub</a>
    <span style="flex-grow: 1;"></span>
  </div>`;
};
