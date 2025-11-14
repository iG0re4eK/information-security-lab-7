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
    return Number(value);
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

    if (this.isPrime(n)) {
      this.steps.push(`${stepPrefix}n = ${n} является простым`);
      this.primeNumbers.push(n);
      return;
    }

    while (n % 2 === 0) {
      this.primeNumbers.push(2);
      n = Math.floor(n / 2);
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

      if (k >= 10000000) {
        this.steps.push(`${stepPrefix}Прервано: достигнут предел k = ${k}`);
        return;
      }

      k++;
    }
  }

  calculateS(n) {
    return [Math.sqrt(n), Math.ceil(Math.sqrt(n))];
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
}

export { FermaFactorization };
