import {
  ChineseZodiacSign,
  ChineseZodiacProfile,
  ChineseZodiacReading,
} from "@vibes/shared-types";

// Chinese zodiac years cycle every 12 years starting from 1900 (Rat)
const ZODIAC_ANIMALS = [
  ChineseZodiacSign.RAT,
  ChineseZodiacSign.OX,
  ChineseZodiacSign.TIGER,
  ChineseZodiacSign.RABBIT,
  ChineseZodiacSign.DRAGON,
  ChineseZodiacSign.SNAKE,
  ChineseZodiacSign.HORSE,
  ChineseZodiacSign.GOAT,
  ChineseZodiacSign.MONKEY,
  ChineseZodiacSign.ROOSTER,
  ChineseZodiacSign.DOG,
  ChineseZodiacSign.PIG,
];

// Elements cycle every 2 years within the 12-year cycle
const ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

export const calculateChineseZodiac = (
  dateOfBirth: Date,
): ChineseZodiacProfile => {
  const year = dateOfBirth.getFullYear();
  const month = dateOfBirth.getMonth(); // 0 = January, 1 = February, etc.
  const day = dateOfBirth.getDate();

  // Chinese zodiac year starts in late January/early February
  // Before Feb 5th (month=1, day<5) is considered the previous zodiac year
  let zodiacYear = year;
  if (month === 0 && day < 5) {
    // January 1-4: use previous year
    zodiacYear = year - 1;
  } else if (month === 1 && day < 5) {
    // February 1-4: use previous year (Chinese New Year hasn't started yet)
    zodiacYear = year - 1;
  }

  // Calculate zodiac sign (12-year cycle starting from 1900 as Rat)
  const yearDiff = zodiacYear - 1900;
  const signIndex = yearDiff % 12;
  const sign = ZODIAC_ANIMALS[signIndex];

  // Calculate element (5-year cycle)
  // 1900: Wood, 1902: Fire, 1904: Earth, 1906: Metal, 1908: Water
  const elementCycle = Math.floor((yearDiff % 10) / 2);
  const element = ELEMENTS[elementCycle];

  const chineseYear = `${element} ${sign.charAt(0).toUpperCase() + sign.slice(1)}`;

  return {
    sign,
    year: zodiacYear,
    element,
    chineseYear,
  };
};

export const getChineseZodiacReading = (
  sign: ChineseZodiacSign,
): ChineseZodiacReading => {
  const readings: Record<ChineseZodiacSign, ChineseZodiacReading> = {
    [ChineseZodiacSign.RAT]: {
      sign: ChineseZodiacSign.RAT,
      title: "The Rat",
      symbolEmoji: "🐭",
      description:
        "Rats are clever, quick-witted, and resourceful. They are adaptable and can thrive in any environment. Known for their intelligence and charm, Rats are excellent communicators.",
      traits: ["Clever", "Resourceful", "Adaptable", "Charming", "Ambitious"],
      compatibility: ["Ox", "Dragon", "Monkey"],
      luckyNumbers: [2, 3],
      luckyColors: ["Blue", "Gold", "Green"],
      element: "Water/Wood/Fire/Earth/Metal",
      yearRange:
        "1900, 1912, 1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020",
    },
    [ChineseZodiacSign.OX]: {
      sign: ChineseZodiacSign.OX,
      title: "The Ox",
      symbolEmoji: "🐄",
      description:
        "Oxen are dependable, strong, and patient. They are grounded, honest, and work tirelessly toward their goals. Known for their reliability and steady nature.",
      traits: ["Dependable", "Strong", "Patient", "Honest", "Calm"],
      compatibility: ["Rat", "Snake", "Rooster"],
      luckyNumbers: [1, 9],
      luckyColors: ["White", "Yellow"],
      element: "Water/Wood/Fire/Earth/Metal",
      yearRange:
        "1901, 1913, 1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021",
    },
    [ChineseZodiacSign.TIGER]: {
      sign: ChineseZodiacSign.TIGER,
      title: "The Tiger",
      symbolEmoji: "🐯",
      description:
        "Tigers are bold, courageous, and enthusiastic. They are natural leaders with a competitive spirit and passionate nature. Known for their confidence and charisma.",
      traits: ["Bold", "Courageous", "Passionate", "Charismatic", "Leader"],
      compatibility: ["Horse", "Dog", "Pig"],
      luckyNumbers: [1, 3, 4],
      luckyColors: ["Orange", "Blue", "White"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1902, 1914, 1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022",
    },
    [ChineseZodiacSign.RABBIT]: {
      sign: ChineseZodiacSign.RABBIT,
      title: "The Rabbit",
      symbolEmoji: "🐰",
      description:
        "Rabbits are gentle, kind, and intuitive. They seek harmony and are known for their grace and elegance. Sensitive and artistic, they value peace and comfort.",
      traits: ["Gentle", "Kind", "Intuitive", "Artistic", "Peaceful"],
      compatibility: ["Goat", "Dog", "Pig"],
      luckyNumbers: [3, 4, 6],
      luckyColors: ["Pink", "Purple", "Blue"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1903, 1915, 1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023",
    },
    [ChineseZodiacSign.DRAGON]: {
      sign: ChineseZodiacSign.DRAGON,
      title: "The Dragon",
      symbolEmoji: "🐉",
      description:
        "Dragons are powerful, majestic, and full of energy. They are ambitious and visionary with natural magnetism. Known for their strength and prosperity-bringing nature.",
      traits: ["Powerful", "Ambitious", "Charismatic", "Creative", "Energetic"],
      compatibility: ["Rat", "Monkey", "Rooster"],
      luckyNumbers: [1, 6, 7],
      luckyColors: ["Gold", "Silver", "Red"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1904, 1916, 1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024",
    },
    [ChineseZodiacSign.SNAKE]: {
      sign: ChineseZodiacSign.SNAKE,
      title: "The Snake",
      symbolEmoji: "🐍",
      description:
        "Snakes are wise, mysterious, and intuitive. They are thoughtful and analytical with a deep understanding of life. Known for their grace and sophistication.",
      traits: ["Wise", "Mysterious", "Analytical", "Graceful", "Sophisticated"],
      compatibility: ["Ox", "Rooster", "Monkey"],
      luckyNumbers: [2, 8, 9],
      luckyColors: ["Red", "Yellow", "Black"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1905, 1917, 1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025",
    },
    [ChineseZodiacSign.HORSE]: {
      sign: ChineseZodiacSign.HORSE,
      title: "The Horse",
      symbolEmoji: "🐴",
      description:
        "Horses are free-spirited, energetic, and enthusiastic. They are warm-hearted and love freedom and adventure. Known for their loyalty and positive energy.",
      traits: [
        "Energetic",
        "Free-spirited",
        "Warm-hearted",
        "Loyal",
        "Enthusiastic",
      ],
      compatibility: ["Tiger", "Goat", "Dog"],
      luckyNumbers: [2, 3, 7],
      luckyColors: ["Green", "Red", "Purple"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1906, 1918, 1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026",
    },
    [ChineseZodiacSign.GOAT]: {
      sign: ChineseZodiacSign.GOAT,
      title: "The Goat",
      symbolEmoji: "🐐",
      description:
        "Goats are creative, gentle, and artistic. They are compassionate and seek harmony in relationships. Known for their sensitivity and imagination.",
      traits: [
        "Creative",
        "Gentle",
        "Artistic",
        "Compassionate",
        "Imaginative",
      ],
      compatibility: ["Rabbit", "Horse", "Pig"],
      luckyNumbers: [3, 4, 9],
      luckyColors: ["Green", "Purple", "Pink"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1907, 1919, 1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027",
    },
    [ChineseZodiacSign.MONKEY]: {
      sign: ChineseZodiacSign.MONKEY,
      title: "The Monkey",
      symbolEmoji: "🐵",
      description:
        "Monkeys are intelligent, playful, and witty. They are quick-thinking and adaptable with a great sense of humor. Known for their cleverness and mischievous charm.",
      traits: ["Intelligent", "Witty", "Playful", "Quick-thinking", "Clever"],
      compatibility: ["Rat", "Dragon", "Rooster"],
      luckyNumbers: [1, 7, 8],
      luckyColors: ["White", "Blue", "Gold"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1908, 1920, 1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028",
    },
    [ChineseZodiacSign.ROOSTER]: {
      sign: ChineseZodiacSign.ROOSTER,
      title: "The Rooster",
      symbolEmoji: "🐓",
      description:
        "Roosters are honest, straightforward, and courageous. They are diligent and responsible with a keen eye for detail. Known for their reliability and integrity.",
      traits: [
        "Honest",
        "Straightforward",
        "Courageous",
        "Diligent",
        "Responsible",
      ],
      compatibility: ["Ox", "Snake", "Dragon"],
      luckyNumbers: [5, 7, 8],
      luckyColors: ["Red", "Purple", "Gold"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1909, 1921, 1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029",
    },
    [ChineseZodiacSign.DOG]: {
      sign: ChineseZodiacSign.DOG,
      title: "The Dog",
      symbolEmoji: "🐕",
      description:
        "Dogs are loyal, honest, and faithful. They are dependable friends with a strong sense of justice. Known for their trustworthiness and protective nature.",
      traits: ["Loyal", "Honest", "Faithful", "Dependable", "Protective"],
      compatibility: ["Tiger", "Rabbit", "Horse"],
      luckyNumbers: [3, 4, 9],
      luckyColors: ["Green", "Red", "Purple"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1910, 1922, 1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030",
    },
    [ChineseZodiacSign.PIG]: {
      sign: ChineseZodiacSign.PIG,
      title: "The Pig",
      symbolEmoji: "🐷",
      description:
        "Pigs are generous, compassionate, and honest. They are diligent and sincere with a love for family and friends. Known for their kindness and sincerity.",
      traits: ["Generous", "Compassionate", "Honest", "Diligent", "Sincere"],
      compatibility: ["Rabbit", "Goat", "Tiger"],
      luckyNumbers: [2, 5, 8],
      luckyColors: ["Yellow", "Brown", "Gold"],
      element: "Wood/Fire/Earth/Metal/Water",
      yearRange:
        "1911, 1923, 1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031",
    },
  };

  return readings[sign];
};
