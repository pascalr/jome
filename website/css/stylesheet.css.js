module.exports = () => {
  return `
  body {
    margin: 0;
    color: #fff;
    background-color: #080e14;
  }

  .scrollable {
    overflow-x: hidden;
    overflow-y: auto;
  }

  /* Style the title and text */
  .title {
    font-size: 24px;
    margin-top: 20px;
  }

  .content {
    font-size: 16px;
    max-width: 60em;
    margin: auto;
  }

  .d-flex {
    display: flex;
  }

  .flex-column {
    flex-direction: column;
  }

  .code {
    border: 2px solid black;
    padding: 1em;
    border-radius: 1em;
  }

  .preview {
    border: 2px solid black;
    padding: 1em;
    border-radius: 1em;
  }

  pre code {
    display: block;
    background: black;
    color: #eaeaea;
    font-family: Menlo, Monaco, Consolas, monospace;
    line-height: 1.5;
    border: 1px solid #ccc;
    padding: 10px;
  }

  code:not(pre code) {
    background-color: #181d2b;
    padding: 0.2em;
    border-radius: 4px;
  }

  ul.nav-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  ul.nav-list li {
    margin: 0;
    padding: 0;
  }

  ul.nav-list li a {
    text-decoration: none;
    color: white;
    padding: 10px;
    display: block;
  }

  ul.nav-list.nav-sub li a {
    margin-top: -7px;
    padding: 7px 10px 7px 25px;
    font-size: 0.9em;
  }

  ul.nav-list.nav-sub-sub li a {
    margin-top: -7px;
    padding: 7px 10px 7px 40px;
    font-size: 0.85em;
  }

  ul.nav-list li a:hover {
    background-color: #f0f0f0;
  }

  .main {
    font-size: 16px;
    max-width: 60em;
  }

  .main li {
    margin-bottom: 0.6em;
  }

  .main p {
    line-height: 1.7;
  }

  .main a {
    color: blue;
    text-decoration: none;
  }

  #left-nav {
    width: 18em;
    margin-right: 1.5em;
    flex-shrink: 0;
    border-right: 1px solid white;
  }

  .onglets {
    display: flex;
    border: 1px solid black;
    background-color: #eee;
  }

  .onglets > * {
    padding: 7px 12px;
    cursor: pointer;
  }

  .onglets > *.active {
    background-color: #cdcdcd;
  }

  .example pre {
    margin: 0;
  }

  .example-content {
    background-color: #dce0e8;
    border: 1px solid black;
    margin-top: 0;
  }

    /* Add some basic CSS for the navbar */
  .navbar {
    background-color: #040609;
    border-bottom: 1px solid white;
    color: #fff;
    height: 3em;
    display: flex;
    align-items: center;
  }

  /* Style for navbar links */
  .navbar a {
    color: #fff;
    padding: 14px 16px;
    text-decoration: none;
  }

  /* Change the color of navbar links on hover */
  .navbar a:hover {
    background-color: #ddd;
    color: black;
  }
  
  .navbrand {
    font-size: 1.4em;
    font-weight: bold;
  }

  .example-result {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 0.8em;
  }`;
};
