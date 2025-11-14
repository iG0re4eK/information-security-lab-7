import { RobinMillerAlg } from "./robinMillerAlg.js";
import { FermaFactorization } from "./fermaFactorization.js";

const pValueField = document.getElementById("pValueField");
const bitValue = document.getElementById("bitValue");
const generateBtn = document.getElementById("generateBtn");
const infoContent = document.getElementById("infoContent");

const nextBtns = document.querySelectorAll(".next-btn");

let step = 0;
let p = null;
let z = [];
let phiP = null;
let phiArrayP = [];
let zArray = [];
let pUnique = [];
let g = null;

const robinMillerAlg = new RobinMillerAlg();
const fermaFactorizationAlg = new FermaFactorization();

function mod(a, x, n) {
  let p = 1;
  let i = x;

  while (i > 0) {
    const s = i % 2;

    if (s === 1) {
      p = (p * a) % n;
    }

    a = (a * a) % n;
    i = Math.floor((i - s) / 2);
  }

  return p;
}

updateActiveH(step);
createBitValueOptions(11, 22);

function createBitValueOptions(min, max) {
  for (let i = min; i < max; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    bitValue.appendChild(option);
  }
  bitValue.value = max - 1;
}

function updateActiveH(step) {
  const headersTwo = document.querySelectorAll("section h2");

  headersTwo.forEach((header, index) => {
    if (step === index) {
      header.classList.add("current-step");

      if (step !== 0) {
        const headerTop =
          header.getBoundingClientRect().top + window.pageYOffset;
        const offset = 32;
        const delayMs = 500;

        setTimeout(() => {
          window.scrollTo({
            top: headerTop - offset,
            behavior: "smooth",
          });
        }, delayMs);
      }
    } else {
      header.classList.remove("current-step");
    }
  });
}

function validateNumberField(field, max, min = 13) {
  const value = field.value.trim();
  const fieldMsg = field.parentElement.querySelector(".field-msg");
  field.classList.remove("field-valid");
  fieldMsg.classList.remove("valid-msg");

  if (!value) {
    field.classList.add("field-error");
    fieldMsg.classList.add("error-msg");
    fieldMsg.textContent = "Поле не может быть пустым";
    return false;
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    field.classList.add("field-error");
    fieldMsg.classList.add("error-msg");
    fieldMsg.textContent = "Введите число";
    return false;
  }

  if (!Number.isInteger(numValue)) {
    field.classList.add("field-error");
    fieldMsg.classList.add("error-msg");
    fieldMsg.textContent = "Число должно быть целым";
    return false;
  }

  if (numValue < min || numValue > max) {
    field.classList.add("field-error");
    fieldMsg.classList.add("error-msg");
    fieldMsg.textContent = `Число должно быть от ${min} до ${max}`;
    return false;
  }

  p = Number(pValueField.value);

  let isPrime;
  if (p < 2000) {
    isPrime = robinMillerAlg.isPrime(p);
  } else {
    isPrime = robinMillerAlg.rabinMiller(p);
  }

  if (!isPrime) {
    field.classList.add("field-error");
    fieldMsg.classList.add("error-msg");
    fieldMsg.textContent = `Число непростое`;
    return false;
  }

  fieldMsg.classList.remove("error-msg");
  fieldMsg.classList.add("valid-msg");
  field.classList.remove("field-error");
  field.classList.add("field-valid");
  fieldMsg.textContent = "Число простое";
  return true;
}

nextBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    console.clear();
    if (validateStep(index)) {
      updateActiveH(step);
    }
  });
});

function validateStep(index) {
  switch (index) {
    case 0:
      if (!validateNumberField(pValueField, Number.MAX_SAFE_INTEGER)) {
        step = index;
        return false;
      } else {
        diffiChalman();
        step = index + 1;
        return true;
      }

    default:
      console.warn(`Шаг ${index} не получился`);
      return false;
  }
}

generateBtn.addEventListener("click", () => {
  console.clear();

  pValueField.classList.remove("field-error");
  robinMillerAlg.setBit(Number(bitValue.value));
  p = robinMillerAlg.generatePrimeNumber();

  if (p && robinMillerAlg.rabinMiller(p)) {
    pValueField.value = p;

    pValueField.classList.remove("field-error");
  } else {
    pValueField.classList.add("field-error");
  }
});

function diffiChalman() {
  console.log("=== НАЧАЛО АЛГОРИТМА ДИФФИ-ХЕЛЛМАНА ===");

  infoContent.innerHTML = "";

  const pMinusOne = p - 1;
  console.log("p =", p);
  console.log("p-1 =", pMinusOne);

  const pDiv = document.createElement("div");
  pDiv.innerHTML = `p = ${p}`;
  infoContent.appendChild(pDiv);

  zArray = createZArrayP(p);
  console.log(zArray);

  const zDiv = document.createElement("div");
  zDiv.innerHTML = `Z<sub>${p}</sub> = {${zArray
    .splice(0, 5)
    .join(", ")}, ..., ${zArray
    .splice(zArray.length - 3, zArray.length - 1)
    .join(", ")}}`;
  infoContent.appendChild(zDiv);

  const pMinusOneDiv = document.createElement("div");
  pMinusOneDiv.innerHTML = `p - 1 = ${pMinusOne}`;
  infoContent.appendChild(pMinusOneDiv);

  const factorizationResult = fermaFactorizationAlg.factorize(
    pMinusOne.toString()
  );
  const factors = factorizationResult.factors;
  console.log("Множители p-1:", factors);

  const factorsDiv = document.createElement("div");
  factorsDiv.innerHTML = `${pMinusOne} = ${factors.join(" * ")}`;
  infoContent.append(factorsDiv);

  pUnique = [...new Set(factors)];
  console.log("Множество Zzzz (уникальные множители):", pUnique);

  const pUniqueDiv = document.createElement("div");
  pUniqueDiv.innerHTML = `Уникальные множители числа ${pMinusOne} = {${pUnique.join(
    ", "
  )}}`;
  infoContent.appendChild(pUniqueDiv);

  for (let i = 1; i < p; i++) {
    let isCoprime = true;
    for (const factor of pUnique) {
      if (i % factor === 0) {
        isCoprime = false;
        break;
      }
    }
    if (isCoprime) {
      phiArrayP.push(i);
    }
  }

  phiP = phiArrayP.length;
  console.log("φ(p) количество:", phiP);
  console.log("φ(p) массив (первые 10 элементов):", phiArrayP.slice(0, 10));

  g = findGenerator();
  if (!g) {
    console.error("Не удалось найти генератор!");
    return;
  }

  generateKeys();
}

function createZArrayP(p) {
  const result = [];
  for (let i = 0; i < p; i++) {
    result.push(i);
  }
  return result;
}

function findGenerator() {
  console.log("\n=== ПОИСК ГЕНЕРАТОРА g ===");
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    const candidate = phiArrayP[Math.floor(Math.random() * phiArrayP.length)];
    let isGenerator = true;

    console.log(`\nПроверяем кандидата g = ${candidate}:`);

    for (const factor of z) {
      const result = mod(candidate, factor, p);
      console.log(`  ${candidate}^${factor} mod ${p} = ${result}`);

      if (result === 1) {
        console.log(`  ❌ Не подходит: ${candidate}^${factor} mod ${p} = 1`);
        isGenerator = false;
        break;
      }
    }

    if (isGenerator) {
      console.log(`✅ Найден генератор g = ${candidate}`);
      return candidate;
    }

    attempts++;
  }

  console.error(`❌ Не удалось найти генератор за ${maxAttempts} попыток`);
  return null;
}

function generateKeys() {
  console.log("\n=== ГЕНЕРАЦИЯ КЛЮЧЕЙ ===");

  let Xa, Xb;
  let attempts = 0;

  do {
    Xa = phiArrayP[Math.floor(Math.random() * phiArrayP.length)];
    Xb = phiArrayP[Math.floor(Math.random() * phiArrayP.length)];
    attempts++;

    if (attempts > 20) {
      Xa = 5;
      Xb = 7;
      break;
    }
  } while (Xa === Xb || Xa === g || Xb === g);

  console.log(`Секретные ключи: Xa = ${Xa}, Xb = ${Xb}`);

  const Ya = mod(g, Xa, p);
  const Yb = mod(g, Xb, p);

  console.log(`Открытые ключи:`);
  console.log(`  Ya = ${g}^${Xa} mod ${p} = ${Ya}`);
  console.log(`  Yb = ${g}^${Xb} mod ${p} = ${Yb}`);

  const Ka = mod(Yb, Xa, p);
  const Kb = mod(Ya, Xb, p);
  const Kg = mod(g, Xa * Xb, p);

  console.log(`\nОбщий секретный ключ:`);
  console.log(`  Ka = ${Yb}^${Xa} mod ${p} = ${Ka}`);
  console.log(`  Kb = ${Ya}^${Xb} mod ${p} = ${Kb}`);
  console.log(`  K = ${g}^(${Xa}*${Xb}) mod ${p} = ${Kg}`);

  if (Ka === Kb && Ka === Kg) {
    console.log(`✅ УСПЕХ: Все ключи совпадают! K = ${Ka}`);
  } else {
    console.log(`❌ ОШИБКА: Ключи не совпадают!`);
    console.log(`   Ka = ${Ka}, Kb = ${Kb}, Kg = ${Kg}`);
  }

  console.log("\n=== АЛГОРИТМ ДИФФИ-ХЕЛЛМАНА ЗАВЕРШЕН ===");
}
