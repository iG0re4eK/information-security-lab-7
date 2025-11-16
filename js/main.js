import { RobinMillerAlg } from "./robinMillerAlg.js";
import { FermaFactorization } from "./fermaFactorization.js";

const pValueField = document.getElementById("pValueField");
const bitValue = document.getElementById("bitValue");
const generateBtn = document.getElementById("generateBtn");
const infoContent = document.getElementById("infoContent");

const startPageBtn = document.getElementById("startPageBtn");

const alicePrivateSelect = document.getElementById("alicePrivateSelect");
const bobPrivateSelect = document.getElementById("bobPrivateSelect");

const aliceSecret = document.getElementById("aliceSecret");
const bobSecret = document.getElementById("bobSecret");

const nextBtns = document.querySelectorAll(".next-btn");

let step = 0;
let p = null;
let phiP = null;
let phiArrayP = [];
let phiPminusOne = null;
let phiArrayPminusOne = [];
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

startPageBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  step = 0;
  updateActiveH(step);
  clearValidField();
});

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

function clearValidField() {
  const fieldMsg = pValueField.parentElement.querySelector(".field-msg");
  pValueField.classList.remove("field-valid", "field-error");
  fieldMsg.classList.remove("valid-msg", "error-msg");
  fieldMsg.textContent = "";
}

pValueField.addEventListener("input", () => {
  clearValidField();
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

        createSelectorPrivateKey(alicePrivateSelect, p, 25);
        createSelectorPrivateKey(bobPrivateSelect, p, 25);

        return true;
      }

    case 1:
      g = parseInt(document.getElementById("gValues").value);
      generateKeys(
        Number(alicePrivateSelect.value),
        Number(bobPrivateSelect.value)
      );
      step = index + 1;
      return true;

    case 2:
      step = index + 1;
      return true;

    default:
      console.warn(`Шаг ${index} не получился`);
      return false;
  }
}

generateBtn.addEventListener("click", () => {
  clearValidField();

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
  step1Div.innerHTML = `<h3>2.1) Исходное простое число</h3>
                       <p>p = ${p}</p>`;
  infoContent.appendChild(step1Div);

  zArray = createZArrayP(p);
  const step2Div = document.createElement("div");
  step2Div.className = "calculation-step";
  step2Div.innerHTML = `<h3>2.2) Множество Z<sub>p</sub> = {0, ..., p - 1}</h3>`;
  step2Div.innerHTML +=
    zArray.length > 8
      ? `<p>Z<sub>${p}</sub> = {${zArray.splice(0, 5).join(", ")}, ..., ${zArray
          .splice(-3)
          .join(", ")}}</p>`
      : `<p>Z<sub>${p}</sub> = {${zArray.join(", ")}}</p>`;
  infoContent.appendChild(step2Div);

  phiArrayP = coprime(p);
  phiP = phiArrayP.length;

  const step3Div = document.createElement("div");
  step3Div.className = "calculation-step";
  step3Div.innerHTML = `<h3>2.3) Вычисляем φ(p)</h3>
                       <p>φ(p) = p - 1 = ${p} - 1 = ${phiP}</p>
                       `;
  infoContent.appendChild(step3Div);

  const factorizationResult = fermaFactorizationAlg.factorize(
    pMinusOne.toString()
  );
  const factors = factorizationResult.factors;

  const step4Div = document.createElement("div");
  step4Div.className = "calculation-step";
  step4Div.innerHTML = `<h3>2.4) Факторизация (p - 1) (разложение числа на простые множители)</h3>
                       <p>${pMinusOne} = ${factors.join(" × ")}</p>
                      `;
  infoContent.appendChild(step4Div);

  pUnique = [...new Set(factors)];

  const step5Div = document.createElement("div");
  step5Div.className = "calculation-step";
  step5Div.innerHTML = `<h3>2.5) Уникальные простые множители (p - 1)</h3>
                       <p>Уникальные множители числа ${pMinusOne} = {${pUnique.join(
    ", "
  )}}</p>`;
  infoContent.appendChild(step5Div);

  phiArrayPminusOne = coprime(pMinusOne);
  phiPminusOne = phiArrayPminusOne.length;

  const step6Div = document.createElement("div");
  step6Div.className = "calculation-step";
  step6Div.innerHTML = `<h3>2.6) Что такое примитивный корень простого числа p?</h3>
                       <p>Число g называется примитивным корнем простого числа p, если:</p>
                       <p>числа g mod p, g<sup>2</sup> mod p, ..., g<sup>p - 1</sup> mod p</p>
                       <p>являются различными и образуют {1, ..., p - 1}</p>
                       <br />
                       <b>Алгоритм:</b>`;
  infoContent.appendChild(step6Div);

  const step6DivStep1 = document.createElement("div");
  step6DivStep1.className = "calculation-step";
  step6DivStep1.innerHTML = `<h4>1. Вычисление функции Эйлера φ(p - 1):</h4>
                       <p>Определяет количество натуральных чисел, меньших ${pMinusOne} и взаимо простых с ним.</p>
                       <p>Количество φ(p - 1) = ${phiPminusOne}</p>`;
  step6DivStep1.innerHTML +=
    phiArrayPminusOne.length > 8
      ? `<p>φ(p - 1) = {${phiArrayPminusOne
          .splice(0, 5)
          .join(", ")}, ..., ${phiArrayPminusOne.splice(-3).join(", ")}}</p>`
      : `<p>φ(p - 1) = {${phiArrayPminusOne.join(", ")}}</p>`;
  infoContent.appendChild(step6DivStep1);

  const step6DivStep2 = document.createElement("div");
  step6DivStep2.className = "calculation-step";
  step6DivStep2.innerHTML = `<h4>2. Перебор элементов:</h4>
                       <p>Для каждого элемента a из поля Z<sub>${p}</sub> проверяем, является ли он примитивным.</p>`;
  infoContent.appendChild(step6DivStep2);

  const step6DivStep3 = document.createElement("div");
  step6DivStep3.className = "calculation-step";
  step6DivStep3.innerHTML = `<h4>3. Проверка на примитивность:</h4>
                       <p>Возводим a в степени d, где d — (p-1)/q для каждого простого делителя q числа (p-1)</p>
                       <p>Если ни для одного делителя d: a<sup>d</sup> ≠ 1 (mod p), то a — примитивный элемент</p>`;
  infoContent.appendChild(step6DivStep3);

  validNumberG = checkValidNumberG(pMinusOne, pUnique);

  const step7Div = document.createElement("div");
  step7Div.className = "calculation-step";
  step7Div.innerHTML = `<h3>2.7) Найденные примитивные корни</h3>`;
  step7Div.innerHTML += ` <p>Для p = ${p} существует ${validNumberG.length} примитивных корней:</p>`;
  step7Div.innerHTML +=
    validNumberG.length > 8
      ? `<p>g = {${validNumberG.slice(0, 5).join(", ")}, ..., ${validNumberG
          .slice(-3)
          .join(", ")}}</p>`
      : `<p>g = {${validNumberG.join(", ")}}</p>`;
  infoContent.appendChild(step7Div);

  const step8Div = document.createElement("div");
  step8Div.className = "calculation-step";
  step8Div.innerHTML = `<h3>2.8) Выберите примитивный корень g</h3>
                       <p>Выберите один из примитивных корней для продолжения (Приведены только последние 10 (если есть 10)):</p>`;

  const validSelectGDiv = document.createElement("div");
  validSelectGDiv.className = "valid-select-g";
  validSelectGDiv.innerHTML = "g = ";
  const validSelectG = document.createElement("select");
  validSelectG.id = "gValues";

  validSelectGDiv.appendChild(validSelectG);
  step8Div.appendChild(validSelectGDiv);
  infoContent.appendChild(step8Div);

  createSelectG(validNumberG);
}

alicePrivateSelect.addEventListener("change", () => {
  generateKeys(
    Number(alicePrivateSelect.value),
    Number(bobPrivateSelect.value)
  );
});

bobPrivateSelect.addEventListener("change", () => {
  generateKeys(
    Number(alicePrivateSelect.value),
    Number(bobPrivateSelect.value)
  );
});

function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function coprime(n) {
  const result = [];
  for (let i = 1; i < n; i++) {
    if (gcd(i, n) === 1) {
      result.push(i);
    }
  }
  return result;
}

function checkValidNumberG(pMinusOne, uniqueFactors) {
  const roots = [];

  for (let g = 2; g <= pMinusOne; g++) {
    let isPrimitiveRoot = true;

    for (const q of uniqueFactors) {
      const d = pMinusOne / q;
      const result = mod(g, d, p);

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
  gValues.innerHTML = "";

  const startIndex = Math.max(0, arrayG.length - 10);
  const lastTen = arrayG.slice(startIndex);

  for (let i = 0; i < lastTen.length; i++) {
    const option = document.createElement("option");
    option.value = lastTen[i];
    option.innerHTML = lastTen[i];
    gValues.appendChild(option);
  }
}

function createZArrayP(p) {
  const result = [];
  for (let i = 0; i < p; i++) {
    result.push(i);
  }
  return result;
}

function createSelectorPrivateKey(thisSelect, p) {
  const select = thisSelect;
  select.innerHTML = "";

  const startValue = Math.max(0, p - 10);

  for (let i = p - 1; i > startValue; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    select.appendChild(option);
  }
}

function generateKeys(aliceXa, bobXb) {
  let Xa, Xb;

  Xa = aliceXa;
  Xb = bobXb;

  const Ya = mod(g, Xa, p);
  const Yb = mod(g, Xb, p);

  const alicePublic = document.getElementById("alicePublic");
  const bobPublic = document.getElementById("bobPublic");

  alicePublic.innerHTML = `Y<sub>a</sub> =  g<sup>X<sub>a</sub></sup> mod p = ${g}<sup>${Xa}</sup> mod ${p} = ${Ya}`;
  bobPublic.innerHTML = `Y<sub>b</sub> =  g<sup>X<sub>b</sub></sup> mod p = ${g}<sup>${Xb}</sup> mod ${p} = ${Yb}`;

  const Ka = mod(Yb, Xa, p);
  const Kb = mod(Ya, Xb, p);

  aliceSecret.innerHTML = `K = (Y<sub>b</sub>)<sup>X<sub>a</sub></sup> mod p = ${Yb}<sup>${Xa}</sup> mod ${p} = ${Ka}`;
  bobSecret.innerHTML = `K = (Y<sub>a</sub>)<sup>X<sub>b</sub></sup> mod p = ${Ya}<sup>${Xb}</sup> mod ${p} = ${Kb}`;

  const generalKey = document.getElementById("generalKey");

  generalKey.innerHTML =
    Ka === Kb
      ? `Совместный секретный ключ: K = ${Ka}`
      : `Не получилось получить совместный ключ, ${Ka} ≠ ${Kb}`;
}
