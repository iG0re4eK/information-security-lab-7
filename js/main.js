import { RobinMiller } from "./robinMiller.js";

const pValueField = document.getElementById("pValueField");
const bitValue = document.getElementById("bitValue");
const generateBtn = document.getElementById("generateBtn");

const robinMiller = new RobinMiller(Number(bitValue.value), pValueField);

generateBtn.addEventListener("click", () => {
  console.clear();
  console.log("Generate");

  robinMiller.bit = Number(bitValue.value);
  robinMiller.pField = pValueField;

  robinMiller.generatePrimeNumberRabinMiller();
});
