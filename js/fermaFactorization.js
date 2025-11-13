class FermaFactorization {
  constructor() {
    this.primeNumbers = [];
    this.steps = [];
  }

  getResult() {
    return this.primeNumbers;
  }

  factorize(n) {
    this.primeNumbers = [];
    this.steps = [];

    if (typeof n === "string") {
      n = n.trim();
    }

    if (!this.validInput(n)) {
      throw new Error("Неверный ввод: число должно быть целым и больше 2");
    }

    const number = this.parseInputNumber(n);

    this.steps.push(`Начало факторизации числа: ${number}`);

    this.factorizeFerma(number);

    this.steps.push(
      `Факторизация завершена. Множители: [${this.primeNumbers.join(", ")}]`
    );

    return {
      factors: [...this.primeNumbers],
      steps: [...this.steps],
    };
  }

  parseInputNumber(value) {
    if (value.length < 16) {
      const num = Number(value);
      if (Number.isInteger(num) && num > 2) {
        return num;
      }
    }
    return BigInt(value);
  }

  validInput(value) {
    if (isNaN(Number(value))) {
      return false;
    }

    if (!Number.isInteger(Number(value))) {
      return false;
    }

    if (Number(value) < 2) {
      return false;
    }

    return true;
  }

  factorizeFerma(n, depth = 0) {
    let s;
    const stepPrefix = depth === 0 ? "" : `Рекурсия ${depth}: `;

    if (depth === 0) {
      this.primeNumbers = [];
    }

    if (typeof n !== "bigint") {
      if (this.isPrime(n)) {
        this.steps.push(`${stepPrefix}n = ${n} является простым`);
        this.primeNumbers.push(n);
        return;
      }

      s = this.calculateS(n);

      this.steps.push(`${stepPrefix}Начинаем факторизацию n = ${n}`);
      this.steps.push(`${stepPrefix}s = [√${n}] = ${s[1]}`);

      let k = 0;

      while (true) {
        const x = s[1] + k;
        const y = x * x - n;
        const sqrtY = Math.sqrt(y);

        if (Number.isInteger(sqrtY)) {
          const a = x + sqrtY;
          const b = x - sqrtY;

          this.steps.push(
            `${stepPrefix}Найдено на k = ${k}: y = ${y}, √y = ${sqrtY}`
          );
          this.steps.push(
            `${stepPrefix}a = ${x} + ${sqrtY} = ${a}, b = ${x} - ${sqrtY} = ${b}`
          );

          if (a > 1) {
            if (!this.isPrime(a)) {
              this.factorizeFerma(a, depth + 1);
            } else {
              this.primeNumbers.push(a);
            }
          }

          if (b > 1) {
            if (!this.isPrime(b)) {
              this.factorizeFerma(b, depth + 1);
            } else {
              this.primeNumbers.push(b);
            }
          }

          return;
        }

        if (k >= 100000000) {
          this.steps.push(`${stepPrefix}Прервано: достигнут предел k = ${k}`);
          return;
        }

        k++;
      }
    } else {
      if (this.isPrimeBigInt(n)) {
        this.steps.push(`${stepPrefix}n = ${n} является простым`);
        this.primeNumbers.push(n);
        return;
      }

      s = this.calculateBigIntS(n);

      this.steps.push(`${stepPrefix}Начинаем факторизацию n = ${n}`);
      this.steps.push(`${stepPrefix}s = [√${n}] = ${s[1]}`);

      let k = 0n;

      while (true) {
        const x = s[1] + k;
        const y = x * x - n;
        const sqrtY = this.sqrtBigInt(y);

        if (sqrtY !== null) {
          const a = x + sqrtY;
          const b = x - sqrtY;

          this.steps.push(
            `${stepPrefix}Найдено на k = ${k}: y = ${y}, √y = ${sqrtY}`
          );
          this.steps.push(
            `${stepPrefix}a = ${x} + ${sqrtY} = ${a}, b = ${x} - ${sqrtY} = ${b}`
          );

          if (a > 1n) {
            if (!this.isPrimeBigInt(a)) {
              this.factorizeFerma(a, depth + 1);
            } else {
              this.primeNumbers.push(a);
            }
          }

          if (b > 1n) {
            if (!this.isPrimeBigInt(b)) {
              this.factorizeFerma(b, depth + 1);
            } else {
              this.primeNumbers.push(b);
            }
          }

          return;
        }

        if (k >= 100000000n) {
          this.steps.push(`${stepPrefix}Прервано: достигнут предел k = ${k}`);
          return;
        }

        k++;
      }
    }
  }

  calculateS(n) {
    return [Math.sqrt(n), Math.ceil(Math.sqrt(n))];
  }

  calculateBigIntS(n) {
    let guess = n;
    while (guess * guess > n) {
      guess = (guess + n / guess) / 2n;
    }
    return [guess, guess + 1n];
  }

  sqrtBigInt(n) {
    if (n < 0n) return null;
    if (n === 0n) return 0n;

    let x = n;
    let y = (x + 1n) / 2n;
    while (y < x) {
      x = y;
      y = (x + n / x) / 2n;
    }

    return x * x === n ? x : null;
  }

  isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }

    return true;
  }

  isPrimeBigInt(num) {
    if (num <= 1n) return false;
    if (num <= 3n) return true;
    if (num % 2n === 0n || num % 3n === 0n) return false;

    const smallPrimes = [
      5n,
      7n,
      11n,
      13n,
      17n,
      19n,
      23n,
      29n,
      31n,
      37n,
      41n,
      43n,
      47n,
    ];
    for (const prime of smallPrimes) {
      if (num === prime) return true;
      if (num % prime === 0n) return false;
    }

    if (num > 100000000n) {
      return this.isProbablePrime(num, 5);
    }

    let i = 5n;
    while (i * i <= num && i < 100000000n) {
      if (num % i === 0n || num % (i + 2n) === 0n) return false;
      i += 6n;
    }

    return true;
  }

  isProbablePrime(n, k) {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n) return false;

    let r = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
      d /= 2n;
      r += 1n;
    }

    for (let i = 0; i < k; i++) {
      const a = this.getRandomBigInt(2n, n - 2n);
      let x = this.modPow(a, d, n);

      if (x === 1n || x === n - 1n) continue;

      let continueLoop = false;
      for (let j = 1n; j < r; j++) {
        x = this.modPow(x, 2n, n);
        if (x === n - 1n) {
          continueLoop = true;
          break;
        }
      }

      if (!continueLoop) return false;
    }

    return true;
  }

  modPow(base, exponent, modulus) {
    if (modulus === 1n) return 0n;

    let result = 1n;
    base = base % modulus;

    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus;
      }
      exponent = exponent >> 1n;
      base = (base * base) % modulus;
    }

    return result;
  }

  getRandomBigInt(min, max) {
    const range = max - min;
    const bits = range.toString(2).length;
    let result;

    do {
      result = BigInt(
        "0b" +
          Array.from({ length: bits }, () =>
            Math.random() > 0.5 ? "1" : "0"
          ).join("")
      );
    } while (result > range);

    return result + min;
  }
}

export { FermaFactorization };
