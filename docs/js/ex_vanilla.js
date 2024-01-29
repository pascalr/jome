document.addEventListener("DOMContentLoaded", function () {
  let el = document.getElementById("ex-vanilla-hello");
  el.innerHTML = "Hello world! This is vanilla js!";

  let count = 0;
  let button = document.getElementById("ex-vanilla-counter");
  button.addEventListener("click", function () {
    count = count + 1;
    button.textContent = `Clicked ${count} ${count === 1 ? "time" : "times"}`;
  });
});
