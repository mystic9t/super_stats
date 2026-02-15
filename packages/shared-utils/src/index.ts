export * from "./zodiac/calculator";
export * from "./storage";
export * from "./numerology-data";
export * from "./tarot-data";
export * from "./tarot";
export * from "./chinese-zodiac";
export * from "./moon-phase";
export * from "./moon-rituals";
export * from "./horoscope-generator";

// Basic Numerology Utils
export const calculateLifePathNumber = (date: Date): number => {
  const d = date.getDate();
  const m = date.getMonth() + 1; // 0-indexed
  const y = date.getFullYear();

  const reduce = (n: number): number => {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
      // Master numbers usually preserved, but for simplicity we might reduce or keep. Let's strictly reduce for now unless specifically asked for Master calculation. Standard reduction:
      let sum = 0;
      while (n > 0) {
        sum += n % 10;
        n = Math.floor(n / 10);
      }
      n = sum;
    }
    return n;
  };

  // Method: Reduce each unit (Day, Month, Year) then sum and reduce again.
  return reduce(reduce(d) + reduce(m) + reduce(y));
};

export const calculateDestinyNumber = (name: string): number => {
  const map: Record<string, number> = {
    a: 1,
    j: 1,
    s: 1,
    b: 2,
    k: 2,
    t: 2,
    c: 3,
    l: 3,
    u: 3,
    d: 4,
    m: 4,
    v: 4,
    e: 5,
    n: 5,
    w: 5,
    f: 6,
    o: 6,
    x: 6,
    g: 7,
    p: 7,
    y: 7,
    h: 8,
    q: 8,
    z: 8,
  };

  const clean = name.toLowerCase().replace(/[^a-z]/g, "");
  let sum = 0;
  for (const char of clean) {
    sum += map[char] || 0;
  }

  const reduce = (n: number): number => {
    while (n > 9) {
      let s = 0;
      while (n > 0) {
        s += n % 10;
        n = Math.floor(n / 10);
      }
      n = s;
    }
    return n;
  };
  return reduce(sum);
};

// Helper function for reduction with master number support
const reduceToSingleDigit = (n: number, allowMaster: boolean): number => {
  while (n > 9) {
    if (allowMaster && (n === 11 || n === 22 || n === 33)) {
      return n; // Master numbers
    }
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    n = sum;
  }
  return n;
};

// Soul Urge (Heart's Desire) - from vowels in name
export const calculateSoulUrgeNumber = (name: string): number => {
  const vowels: Record<string, number> = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const clean = name.toLowerCase().replace(/[^a-z]/g, "");
  let sum = 0;
  for (const char of clean) {
    sum += vowels[char] || 0;
  }
  // Reduce to single digit or master number (11, 22, 33)
  return reduceToSingleDigit(sum, true);
};

// Personality (Outer Self) - from consonants in name
export const calculatePersonalityNumber = (name: string): number => {
  const vowels = ["a", "e", "i", "o", "u"];
  const map: Record<string, number> = {
    b: 2,
    c: 3,
    d: 4,
    f: 6,
    g: 7,
    h: 8,
    j: 1,
    k: 2,
    l: 3,
    m: 4,
    n: 5,
    p: 7,
    q: 8,
    r: 9,
    s: 1,
    t: 2,
    v: 4,
    w: 5,
    x: 6,
    y: 7,
    z: 8,
  };
  const clean = name.toLowerCase().replace(/[^a-z]/g, "");
  let sum = 0;
  for (const char of clean) {
    if (!vowels.includes(char)) {
      sum += map[char] || 0;
    }
  }
  return reduceToSingleDigit(sum, false);
};

// Birthday Number - day of birth (1-31, reduced to 1-9)
export const calculateBirthdayNumber = (date: Date): number => {
  const day = date.getDate();
  return reduceToSingleDigit(day, false);
};

// Personal Year Number - current year + birth month/day
export const calculatePersonalYearNumber = (date: Date): number => {
  const currentYear = new Date().getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const sum = currentYear + month + day;
  return reduceToSingleDigit(sum, false);
};
