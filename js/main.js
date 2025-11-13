import { RobinMillerAlg } from "./robinMillerAlg.js";
import { FermaFactorization } from "./fermaFactorization.js";

const pValueField = document.getElementById("pValueField");
const bitValue = document.getElementById("bitValue");
const generateBtn = document.getElementById("generateBtn");

const nextBtns = document.querySelectorAll(".next-btn");

let step = 0;
let p = null;
let z = [];
let phiP = null;
let phiArrayP = [];
let phiPminuOne = [];
let g = null;

const robinMillerAlg = new RobinMillerAlg();
const ferma = new FermaFactorization();

function mod(a, x, n) {
  let p = 1n;
  let base = BigInt(a);
  let exponent = BigInt(x);
  const modulus = BigInt(n);

  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      p = (p * base) % modulus;
    }
    base = (base * base) % modulus;
    exponent = exponent >> 1n;
  }

  return Number(p);
}

updateActiveH(step);

function updateActiveH(step) {
  const headersTwo = document.querySelectorAll("section h2");

  headersTwo.forEach((header, index) => {
    if (step === index) {
      header.classList.add("current-step");

      if (step !== 0) {
        const headerTop =
          header.getBoundingClientRect().top + window.pageYOffset;
        const offset = 32;

        window.scrollTo({
          top: headerTop - offset,
          behavior: "smooth",
        });
      }
    } else {
      header.classList.remove("current-step");
    }
  });
}

function validateNumberField(field, max, min = 2) {
  const value = field.value.trim();

  if (!value) {
    field.classList.add("field-error");
    return false;
  }

  const numValue = Number(value);
  if (
    isNaN(numValue) ||
    !Number.isInteger(numValue) ||
    numValue < min ||
    numValue > max
  ) {
    field.classList.add("field-error");
    return false;
  } else {
    field.classList.remove("field-error");
    return true;
  }
}

pValueField.addEventListener("change", () => {
  validateNumberField(pValueField, Number.MAX_SAFE_INTEGER);
});

bitValue.addEventListener("change", () => {
  validateNumberField(bitValue, 21, 11);
});

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
      if (!validateNumberField(pValueField, Number.MAX_SAFE_INTEGER, 2)) {
        step = index;
        return false;
      }

      p = Number(pValueField.value);

      let isPrime;
      if (p < 2000) {
        isPrime = robinMillerAlg.isPrime(p);
      } else {
        isPrime = robinMillerAlg.rabinMiller(p);
      }

      if (isPrime) {
        diffiChalman();
        step = index + 1;
        return true;
      } else {
        step = index;
        pValueField.classList.add("field-error");
        return false;
      }

    default:
      console.warn(`Шаг ${index} не получился`);
      return false;
  }
}

generateBtn.addEventListener("click", () => {
  console.clear();

  if (!validateNumberField(bitValue, 21, 11)) {
    return;
  }

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

  const pMinusOne = p - 1;
  console.log("p =", p);
  console.log("p-1 =", pMinusOne);

  const factorizationResult = ferma.factorize(pMinusOne.toString());
  const factors = factorizationResult.factors;
  console.log("Множители p-1:", factors);

  z = [...new Set(factors)];
  console.log("Множество Z (уникальные множители):", z);

  phiArrayP = [];
  for (let i = 1; i < p; i++) {
    let isCoprime = true;
    for (const factor of z) {
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
