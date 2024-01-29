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
    return () => {
      button.removeEventListener("click", handleClick);
    }
    // Instead of all the lifecycle methods, can I do a less performant, but simpler version
    // where I only have a mount function which returns a unmount function?
    // There seems to be 3 important lifecycles, mount, update and unmount. Let's see how to do update this way...

    // I also have an idea that you could wrap code and create new document variable so that it references a wrapper
    // and does a lot of smart stuff for you. For ex, handle to remove event listeners.
  }
  renderCounter() // Who would handle the unmount?
});
