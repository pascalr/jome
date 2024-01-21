module.exports = () => {
  return `
  body {
    margin: 0;
    background-color: #f9f4f4;
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

  pre {
    background-color: #dce0e8;
    padding: 1em;
    border-radius: 4px;
  }
  code:not(pre code) {
    background-color: #dce0e8;
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
    color: #333;
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
    background-color: #e6e1df;;
    margin-right: 1.5em;
    flex-shrink: 0;
  }

  .onglets {
    display: flex;
  }

  .onglets > * {
    padding: 10px;
    background-color: #eee;
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
  }

    /* Add some basic CSS for the navbar */
  .navbar {
    background-color: #333;
    color: #fff;
    padding: 10px;
    height: 30px;
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
    padding: 14px 16px;
    font-weight: bold;
  }
`;
};
