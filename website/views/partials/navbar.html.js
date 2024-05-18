module.exports = () => {
  return `
  <div class="navbar">
    <a class="navbrand" href="${ROOT}/" style="margin-left: 4em;">Jome</a>
    <span style="flex-grow: 2;"></span>
    <a href="${ROOT}/getting_started">Getting started</a>
    <a href="${ROOT}/ref">Language Reference</a>
    <a href="${ROOT}/ex">Examples</a>
    <a href="${ROOT}/jome_lib">JomeLib</a>
    <a href="${ROOT}/in_depth">In depth</a>
    <a href="${ROOT}/editor">Editor</a>
    <a href="https://github.com/pascalr/jome">GitHub</a>
    <span style="flex-grow: 1;"></span>
  </div>`;
};
