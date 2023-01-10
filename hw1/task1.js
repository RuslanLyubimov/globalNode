const prompt = require("prompt-sync")({ sigint: true });
const CONSTANTS = require("./constants");

while (CONSTANTS.INFINITE) {
  let input = prompt();
  const answer = input.split("").reverse().join("");
  console.log(answer, "\n\n");
}
