import { RobinMillerAlg } from "./robinMillerAlg.js";
import { FermaFactorization } from "./fermaFactorization.js";

const pValueField = document.getElementById("pValueField");
const bitValue = document.getElementById("bitValue");
const generateBtn = document.getElementById("generateBtn");
const infoContent = document.getElementById("infoContent");

const nextBtns = document.querySelectorAll(".next-btn");

let step = 0;
let p = null;
let phiP = null;
let phiArrayP = [];
let zArray = [];
let pUnique = [];
let validNumberG = [];
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

function validateNumberField(field, max, min = 7) {
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
  infoContent.innerHTML = "";

  const pMinusOne = p - 1;

  const step1Div = document.createElement("div");
  step1Div.className = "calculation-step";
  step1Div.innerHTML = `<h3>Шаг 2.1: Исходное простое число</h3>
                       <p>p = ${p}</p>`;
  infoContent.appendChild(step1Div);

  zArray = createZArrayP(p);
  const step2Div = document.createElement("div");
  step2Div.className = "calculation-step";
  step2Div.innerHTML = `<h3>Шаг 2.2: Множество {0, ..., p - 1}</h3>`;
  step2Div.innerHTML +=
    zArray.length > 8
      ? `<p>Z<sub>${p}</sub> = {${zArray.splice(0, 5).join(", ")}, ..., ${zArray
          .splice(-3)
          .join(", ")}}</p>`
      : `<p>Z<sub>${p}</sub> = {${zArray.join(", ")}}</p>`;
  infoContent.appendChild(step2Div);

  const step3Div = document.createElement("div");
  step3Div.className = "calculation-step";
  step3Div.innerHTML = `<h3>Шаг 2.3: Вычисляем p-1</h3>
                       <p>p - 1 = ${p} - 1 = ${pMinusOne}</p>
                       `;
  infoContent.appendChild(step3Div);

  const factorizationResult = fermaFactorizationAlg.factorize(
    pMinusOne.toString()
  );
  const factors = factorizationResult.factors;

  const step4Div = document.createElement("div");
  step4Div.className = "calculation-step";
  step4Div.innerHTML = `<h3>Шаг 2.4: Факторизация ${pMinusOne} (разложение числа на простые множители)</h3>
                       <p>${pMinusOne} = ${factors.join(" × ")}</p>
                      `;
  infoContent.appendChild(step4Div);

  pUnique = [...new Set(factors)];

  const step5Div = document.createElement("div");
  step5Div.className = "calculation-step";
  step5Div.innerHTML = `<h3>Шаг 2.5: Уникальные простые множители</h3>
                       <p>Уникальные множители числа ${pMinusOne} = {${pUnique.join(
    ", "
  )}}</p>`;
  infoContent.appendChild(step5Div);

  const step6Div = document.createElement("div");
  step6Div.className = "calculation-step";
  step6Div.innerHTML = `<h3>Шаг 2.6: Что такое первообразный корень?</h3>
                       <p>Число g называется первообразным корнем по модулю p, если:</p>
                       <p>g<sup>(p-1)/q</sup> mod p ≠ 1 для всех простых делителей q числа p-1</p>
                       <p>Это означает, что g порождает группу Z<sub>${p}</sub></p>`;
  infoContent.appendChild(step6Div);

  validNumberG = checkValidNumberG(p, pUnique);

  const step7Div = document.createElement("div");
  step7Div.className = "calculation-step";
  step7Div.innerHTML = `<h3>Шаг 2.7: Найденные первообразные корни</h3>`;
  step7Div.innerHTML += ` <p>Для p = ${p} существует ${validNumberG.length} первообразных корней:</p>`;
  step7Div.innerHTML +=
    validNumberG.length > 8
      ? `<p>g = {${validNumberG.slice(0, 5).join(", ")}, ..., ${validNumberG
          .slice(-3)
          .join(", ")}}</p>`
      : `<p>g = {${validNumberG.join(", ")}}</p>`;
  infoContent.appendChild(step7Div);

  const step8Div = document.createElement("div");
  step8Div.className = "calculation-step";
  step8Div.innerHTML = `<h3>Шаг 2.8: Выберите первообразный корень g</h3>
                       <p>Выберите один из первообразных корней для продолжения (Приведены только первые 10):</p>`;

  const validSelectGDiv = document.createElement("div");
  validSelectGDiv.className = "valid-select-g";
  validSelectGDiv.innerHTML = "g = ";
  const validSelectG = document.createElement("select");
  validSelectG.id = "gValues";

  validSelectGDiv.appendChild(validSelectG);
  step8Div.appendChild(validSelectGDiv);
  infoContent.appendChild(step8Div);

  createSelectG(validNumberG);

  phiArrayP = [];
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

  generateKeys();
}

function checkValidNumberG(p, uniqueFactors) {
  const roots = [];
  const pMinusOne = p - 1;

  for (let g = 2; g < p; g++) {
    let isPrimitiveRoot = true;

    for (const q of uniqueFactors) {
      const e = pMinusOne / q;
      const result = mod(g, e, p);

      if (result === 1) {
        isPrimitiveRoot = false;
        break;
      }
    }

    if (isPrimitiveRoot) {
      roots.push(g);
    }
  }

  return roots;
}

function createSelectG(arrayG) {
  const gValues = document.getElementById("gValues");
  for (let i = 0; i < arrayG.length; i++) {
    const option = document.createElement("option");
    option.value = arrayG[i];
    option.innerHTML = arrayG[i];
    gValues.appendChild(option);
    if (i === 9) break;
  }
}

function createZArrayP(p) {
  const result = [];
  for (let i = 0; i < p; i++) {
    result.push(i);
  }
  return result;
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
