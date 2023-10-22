import jome from 'jome'


import {HtmlPage} from "./lib/html-page.built.js";

let navbar = ((__params__ = {}) => {
  return `
  <div class="navbar">
    <span class="navbrand" href="#">Jome</span>
    <a href="/editor">Editor</a>
    <a href="/">Home</a>
    <a href="/#lang-ref">Language Reference</a>
    <a href="/ex">Examples</a>
    <a href="/lib">Librairies</a>
    <a href="/compiling">Compiling</a>
    <a href="https://github.com/pascalr/jome">GitHub</a>
  </div>
`
})
let sidebar = ((__params__ = {}) => {
  
return `
  <div id="left-nav" class="scrollable">
    <ul class="nav-list">
      <li><a href="/">Home</a></li>
      <li><a href="/#lang-ref">Language Reference</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="/#syntax">Syntax</a></li>
        <li><a href="/#blocks">Blocks</a></li>
        <li><a href="/#nodes">Nodes</a></li>
        <li><a href="/#scripts">Scripts</a></li>
        <li><a href="/#named-parameters">Named parameters</a></li>
        <li><a href="/#classes">Classes</a></li>
        <li><a href="/#interfaces">Interfaces</a></li>
        <li><a href="/#arrow-getter">Arrow getter</a></li>
        <li><a href="/#instance-driven-dev">Instance driven development</a></li>
        <li><a href="/#verbatim">Verbatim string literals</a></li>
        <li><a href="/#units">Units</a></li>
        <li><a href="/#hyphens">Hyphen</a></li>
      </ul>
      <li><a href="/compiling">Compiling</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="/compiling#jomec">jomec</a></li>
        <li><a href="/compiling#jomeconfig">jomeconfig.json</a></li>
      </ul>
      <li><a href="/lib">Librairies</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="/lib/html">Html</a></li>
        <li><a href="/lib/html-layout">Html Layout</a></li>
        <li><a href="/lib/express-server">Express Server</a></li>
      </ul>
      <li><a href="/ex">Examples</a></li>
      <ul class="nav-list nav-sub">
        <li><a href="/ex#hello-world">Hello world</a></li>
        <li><a href="/ex#snake">Snake</a></li>
        <li><a href="/ex">Script</a></li>
      </ul>
    </ul>
  </div>
`
})
export class AppPage {
  constructor(__params__) {
    this.__params__ = __params__
  }
  toString() {
    return new HtmlPage({title: this.__params__.title, body: `
        <div class="d-flex flex-column" style="min-height: 100vh;">
          ${navbar()}
          <div style="flex-grow: 1; height: calc(100vh - 50px);">
            <div class="d-flex" style="height: 100%;">
            ${sidebar()}
            <div class="scrollable" style="width: 100%;">
              <div class="app-content">
                ${this.__params__.content}
              </div>
            </div>
          </div>
          </div>
        </div>
      `, stylesheets: ["/server.built.css", "/highlight.js.min.css"]}).toString()
  }
}

