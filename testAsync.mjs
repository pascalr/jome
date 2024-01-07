async function printNumbers() {
  for (let i = 1; i <= 10; i++) {
    console.log(i);
    await new Promise(resolve => setTimeout(resolve, 500)); // Pause for 0.5 second
  }
}

printNumbers();
await printNumbers();
printNumbers();
