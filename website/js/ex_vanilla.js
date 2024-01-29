document.addEventListener("DOMContentLoaded", function () {
  let el = document.getElementById("ex-vanilla-hello");
  el.innerHTML = "Hello world! This is vanilla js!";

  function renderCounter() {
    let count = 0;
    let button = document.getElementById("ex-vanilla-counter");
    function handleClick() {
      count = count + 1;
      button.textContent = `Clicked ${count} ${count === 1 ? "time" : "times"}`;
    }
    button.addEventListener("click", handleClick);
    return function () {
      button.removeEventListener("click", handleClick);
    };
  }
  renderCounter();
});
