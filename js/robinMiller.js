class RobinMiller {
  constructor(bit, pField) {
    this.bit = bit;
    this.pField = pField;
    this.minA = null;
    this.maxA = null;
  }

  randomNumberBit(size) {
    let result = [];

    for (let i = 0; i < size; i++) {
      result.push(Math.random() * 10 > 5 ? "1" : "0");
    }

    console.log(`${this.bit} bit:`, result.join(""));

    result[0] = "1";
    result[result.length - 1] = "1";

    console.log(`${this.bit} bit:`, result.join(""));

    return parseInt(result.join(""), 2);
  }

  isPrime(number) {
    if (number <= 1) return false;

    for (let i = 2; i < number; i++) {
      if (number % i === 0) {
        return false;
      }
    }

    return true;
  }

  isPrimeArray(number) {
    let result = [];

    for (let i = 0; i < number; i++) {
      if (this.isPrime(i)) {
        result.push(i);
      }
    }

    return result;
  }

  checkValidP(pValue, arrayValues) {
    for (let i = 0; i < arrayValues.length; i++) {
      if (pValue % arrayValues[i] === 0) {
        console.log(`${pValue} % ${arrayValues[i]} = 0`);
        return false;
      }
    }
    console.log(`Подходит: ${pValue}`);
    return true;
  }

  setIntervalA(aValue, pValue) {
    this.minA = aValue;
    this.maxA = pValue - 1;
  }

  randomValueA(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  sumMod(a, x, n) {
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

  mValueAndValueB(pValue) {
    let b = 1;
    let m = Math.floor((pValue - 1) / 2);

    console.log(`b: ${b}, m: ${m}`);

    for (let i = 2; i < pValue; i++) {
      if (m % Math.pow(2, i) === 0) {
        b++;
        m /= 2;

        console.log(`b: ${b}, m: ${m}`);
      } else break;
    }

    return [b, m];
  }

  rabinMiller(pValue, testCount) {
    let [b, m] = this.mValueAndValueB(pValue);

    console.log(`a ∈ [${this.minA}, ${this.maxA}]`);

    let testPassed = false;

    for (let i = 0; i < testCount; i++) {
      console.log(`Тест: ${i}`);

      let a = this.randomValueA(this.minA, this.maxA);

      console.log("a = ", a);

      let z = this.sumMod(a, m, pValue);

      console.log(
        `Вычисляем z = a<sup>m</sup> mod p = ${a}<sup>${m}</sup> mod ${pValue} = ${z}`
      );

      if (z === 1 || z === pValue - 1) {
        console.log(`✅ z = ${z} (равно 1 или p-1), тест пройден`);
        testPassed = true;
      } else {
        console.log(`z = ${z} (не равно 1 или p-1), продолжаем проверку`);

        for (let j = 0; j < b; j++) {
          console.log(`j = ${j}`);

          z = this.sumMod(z, 2, pValue);

          console.log(`z = z<sup>2</sup> mod p = ${z}² mod ${pValue} = ${z}`);

          if (z === pValue - 1) {
            console.log(
              `✅ z = ${z} (равно p-1), тест пройден на шаге j = ${j}`
            );
            testPassed = true;
            break;
          }

          if (j > 0 && z === 1) {
            console.log(`❌ j > 0 (j = ${j}) и z = 1, тест НЕ пройден`);
            break;
          }

          if (j === b - 1 && z !== pValue - 1) {
            console.log(
              `❌ j = b-1 (j = ${j}) и z ≠ p-1 (z = ${z}), тест НЕ пройден`
            );
            break;
          }
        }
      }

      console.log(testPassed ? `Тест ${i + 1} ✅` : `Тест ${i + 1} ❌`);
    }

    console.log(
      testPassed
        ? `<div class="row"><h3>Все ${testCount} тестов завершены.</h3> <h3>Вероятность составного числа: ${Math.pow(
            1 / 4,
            testCount
          )}</h3> </div>`
        : `<h3>${testCount} не пройден(о)</h3>`
    );

    if (!testPassed) {
      console.log(
        "-------------------------------------------------------------------------------------------"
      );

      this.generatePrimeNumberRabinMiller();
      return;
    } else {
      this.pField.value = pValue;
    }
  }

  generatePrimeNumberRabinMiller() {
    let bitValue = Number(this.bit);
    let p = this.randomNumberBit(bitValue);
    console.log("p =", p);

    let maxPrime = 2000;
    let arrayPrime = [];
    arrayPrime = this.isPrimeArray(maxPrime);

    console.log(arrayPrime);

    while (!this.checkValidP(p, arrayPrime)) {
      p += 2;

      if (p > 2097151) {
        this.generatePrimeNumberRabinMiller();
        return;
      }
    }

    this.setIntervalA(2, p);

    this.rabinMiller(p, 5);
  }
}

export { RobinMiller };
