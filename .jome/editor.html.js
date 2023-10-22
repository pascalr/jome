import jome from 'jome'


import {HtmlPage} from "./lib/html-page.built.js";
import {Col, Row, Screen, Panel} from "./lib/jome-html.built.js";

var bgColor1 = "#ded9d1"
var bgColor2 = "#c9c2b5"
var bgColorSelected = "#c8b099"
var bgColor3 = "#bfbbb3"
var bgColor4 = "#b2b2b2"
new HtmlPage({title: 'Jome editor', stylesheets: ['reset.css', 'jome-html.css'], body: new Screen().toString()}).toString()