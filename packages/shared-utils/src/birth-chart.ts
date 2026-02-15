import {
  ZodiacSign,
  Planet,
  PlanetPosition,
  BirthChart,
  BirthChartReading,
  HouseReading,
} from "@vibes/shared-types";
import { getZodiacDisplay, getZodiacSymbol } from "./zodiac/calculator";

const ZODIAC_SIGNS = Object.values(ZodiacSign);

function normalizeDegree(degree: number): number {
  return ((degree % 360) + 360) % 360;
}

function degreeToZodiac(degree: number): { sign: ZodiacSign; degree: number } {
  const normalized = normalizeDegree(degree);
  const signIndex = Math.floor(normalized / 30);
  const signDegree = normalized % 30;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: signDegree,
  };
}

function calculateJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    hour / 24 +
    b -
    1524.5
  );
}

function getPlanetPositions(jd: number): Record<Planet, number> {
  const t = (jd - 2451545.0) / 36525;

  const sun = normalizeDegree(
    280.4664567 + 360007.6982779 * t + 0.0003032 * t * t,
  );
  const moon = normalizeDegree(
    218.3164477 + 481267.88123421 * t - 0.0015786 * t * t,
  );
  const mercury = normalizeDegree(252.2509 + 149472.6746 * t);
  const venus = normalizeDegree(181.9798 + 58517.8156 * t);
  const mars = normalizeDegree(355.433 + 19140.2993 * t);
  const jupiter = normalizeDegree(34.351 + 3034.9057 * t);
  const saturn = normalizeDegree(50.077 + 1222.1138 * t);
  const uranus = normalizeDegree(314.055 + 428.4669 * t);
  const neptune = normalizeDegree(304.349 + 218.4862 * t);
  const pluto = normalizeDegree(238.929 + 145.2078 * t);

  return {
    sun,
    moon,
    mercury,
    venus,
    mars,
    jupiter,
    saturn,
    uranus,
    neptune,
    pluto,
  };
}

function isRetrograde(planet: Planet, jd: number): boolean {
  const innerPlanets: Planet[] = ["mercury", "venus"];
  if (innerPlanets.includes(planet)) {
    const t = (jd - 2451545.0) / 36525;
    const sunLon = normalizeDegree(280.4664567 + 360007.6982779 * t);

    if (planet === "mercury") {
      const mercuryLon = normalizeDegree(252.2509 + 149472.6746 * t);
      const elongation = Math.abs(normalizeDegree(mercuryLon - sunLon));
      return elongation > 160 || elongation < 20;
    }
    if (planet === "venus") {
      const venusLon = normalizeDegree(181.9798 + 58517.8156 * t);
      const elongation = Math.abs(normalizeDegree(venusLon - sunLon));
      return elongation > 150;
    }
  }

  if (planet === "mars" || planet === "jupiter" || planet === "saturn") {
    const t = (jd - 2451545.0) / 36525;
    const sunLon = normalizeDegree(280.4664567 + 360007.6982779 * t);

    const positions: Record<string, number> = {
      mars: normalizeDegree(355.433 + 19140.2993 * t),
      jupiter: normalizeDegree(34.351 + 3034.9057 * t),
      saturn: normalizeDegree(50.077 + 1222.1138 * t),
    };

    const planetLon = positions[planet];
    const elongation = normalizeDegree(sunLon - planetLon);
    return elongation > 120 && elongation < 240;
  }

  return Math.random() < 0.2;
}

export function calculateBirthChart(
  birthDate: Date,
  birthTime?: string,
  latitude?: number,
  longitude?: number,
): BirthChart {
  let birthDateTime = new Date(birthDate);
  if (birthTime) {
    const [hours, minutes] = birthTime.split(":").map(Number);
    birthDateTime.setHours(hours, minutes, 0, 0);
  }

  const jd = calculateJulianDay(birthDateTime);
  const positions = getPlanetPositions(jd);

  const planetPositions: PlanetPosition[] = [];
  const signMap: Partial<Record<Planet, ZodiacSign>> = {};

  for (const planet of Object.keys(positions) as Planet[]) {
    const { sign, degree } = degreeToZodiac(positions[planet]);
    signMap[planet] = sign;

    planetPositions.push({
      planet,
      sign,
      degree,
      minutes: Math.round((degree % 1) * 60),
      isRetrograde: isRetrograde(planet, jd),
    });
  }

  const lat = latitude ?? 0;
  const ascendant = calculateAscendant(jd, lat);
  const { sign: risingSign, degree: ascendantDegree } =
    degreeToZodiac(ascendant);

  const midheaven = calculateMidheaven(jd);
  const { degree: midheavenDegree } = degreeToZodiac(midheaven);

  const houses = calculateHouses(ascendant);

  return {
    sunSign: signMap.sun!,
    moonSign: signMap.moon!,
    risingSign,
    mercurySign: signMap.mercury!,
    venusSign: signMap.venus!,
    marsSign: signMap.mars!,
    jupiterSign: signMap.jupiter!,
    saturnSign: signMap.saturn!,
    uranusSign: signMap.uranus!,
    neptuneSign: signMap.neptune!,
    plutoSign: signMap.pluto!,
    planets: planetPositions,
    houses,
    ascendantDegree,
    midheavenDegree,
  };
}

function calculateAscendant(jd: number, latitude: number): number {
  const t = (jd - 2451545.0) / 36525;
  const lst = normalizeDegree(
    280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t,
  );

  const obliquity = 23.439 - 0.0000004 * (jd - 2451545.0);
  const latRad = (latitude * Math.PI) / 180;
  const oblRad = (obliquity * Math.PI) / 180;

  const ascendant = Math.atan2(
    Math.cos((lst * Math.PI) / 180),
    Math.sin((lst * Math.PI) / 180) * Math.cos(oblRad) +
      Math.tan(latRad) * Math.sin(oblRad),
  );

  return normalizeDegree((ascendant * 180) / Math.PI);
}

function calculateMidheaven(jd: number): number {
  const t = (jd - 2451545.0) / 36525;
  const lst = normalizeDegree(
    280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t,
  );

  const obliquity = 23.439 - 0.0000004 * (jd - 2451545.0);
  const oblRad = (obliquity * Math.PI) / 180;

  const mc = Math.atan2(
    Math.sin((lst * Math.PI) / 180),
    Math.cos((lst * Math.PI) / 180) * Math.cos(oblRad),
  );

  return normalizeDegree((mc * 180) / Math.PI);
}

function calculateHouses(ascendant: number): Record<number, ZodiacSign> {
  const houses: Record<number, ZodiacSign> = {};
  for (let i = 1; i <= 12; i++) {
    const houseCusp = normalizeDegree(ascendant + (i - 1) * 30);
    const { sign } = degreeToZodiac(houseCusp);
    houses[i] = sign;
  }
  return houses;
}

const PLANET_INTERPRETATIONS: Record<Planet, Record<ZodiacSign, string>> = {
  sun: createInterpretations(
    "Sun",
    "your core identity, ego, and life purpose",
    "vitality and self-expression",
  ),
  moon: createInterpretations(
    "Moon",
    "your emotions, instincts, and inner self",
    "emotional needs and reactions",
  ),
  mercury: createInterpretations(
    "Mercury",
    "your communication style and thought processes",
    "learning and expression",
  ),
  venus: createInterpretations(
    "Venus",
    "your approach to love, beauty, and values",
    "relationships and pleasures",
  ),
  mars: createInterpretations(
    "Mars",
    "your drive, energy, and how you take action",
    "passion and assertion",
  ),
  jupiter: createInterpretations(
    "Jupiter",
    "your growth, abundance, and wisdom",
    "expansion and opportunities",
  ),
  saturn: createInterpretations(
    "Saturn",
    "your discipline, responsibilities, and limitations",
    "structure and lessons",
  ),
  uranus: createInterpretations(
    "Uranus",
    "your individuality, innovation, and rebellion",
    "change and liberation",
  ),
  neptune: createInterpretations(
    "Neptune",
    "your dreams, intuition, and spirituality",
    "imagination and ideals",
  ),
  pluto: createInterpretations(
    "Pluto",
    "your transformation, power, and deep changes",
    "regeneration and depth",
  ),
};

function createInterpretations(
  planet: string,
  baseMeaning: string,
  theme: string,
): Record<ZodiacSign, string> {
  const interpretations: Partial<Record<ZodiacSign, string>> = {};

  const traits: Record<ZodiacSign, string> = {
    [ZodiacSign.ARIES]: "bold, direct, and pioneering",
    [ZodiacSign.TAURUS]: "grounded, patient, and sensual",
    [ZodiacSign.GEMINI]: "curious, adaptable, and communicative",
    [ZodiacSign.CANCER]: "nurturing, intuitive, and protective",
    [ZodiacSign.LEO]: "dramatic, creative, and confident",
    [ZodiacSign.VIRGO]: "analytical, practical, and detail-oriented",
    [ZodiacSign.LIBRA]: "harmonious, diplomatic, and aesthetic",
    [ZodiacSign.SCORPIO]: "intense, transformative, and deeply emotional",
    [ZodiacSign.SAGITTARIUS]: "adventurous, philosophical, and optimistic",
    [ZodiacSign.CAPRICORN]: "ambitious, disciplined, and responsible",
    [ZodiacSign.AQUARIUS]: "innovative, independent, and humanitarian",
    [ZodiacSign.PISCES]: "compassionate, artistic, and spiritually attuned",
  };

  for (const sign of ZODIAC_SIGNS) {
    interpretations[sign] =
      `With ${planet} in ${getZodiacDisplay(sign)}, ${baseMeaning} is expressed in ways that are ${traits[sign]}. This placement influences your ${theme} with ${getZodiacDisplay(sign)} energy.`;
  }

  return interpretations as Record<ZodiacSign, string>;
}

const HOUSE_MEANINGS: Record<number, { meaning: string; areas: string[] }> = {
  1: {
    meaning: "Self, appearance, and first impressions",
    areas: ["identity", "physical body", "approach to life"],
  },
  2: {
    meaning: "Values, possessions, and self-worth",
    areas: ["finances", "material security", "talents"],
  },
  3: {
    meaning: "Communication, siblings, and local environment",
    areas: ["learning", "short trips", "neighbors"],
  },
  4: {
    meaning: "Home, family, and emotional foundations",
    areas: ["roots", "living situation", "inner self"],
  },
  5: {
    meaning: "Creativity, children, and pleasure",
    areas: ["romance", "hobbies", "self-expression"],
  },
  6: {
    meaning: "Daily work, health, and service",
    areas: ["routine", "wellness", "helpful acts"],
  },
  7: {
    meaning: "Partnerships, marriage, and open enemies",
    areas: ["relationships", "contracts", "balance"],
  },
  8: {
    meaning: "Transformation, shared resources, and mysteries",
    areas: ["intimacy", "inheritance", "psychology"],
  },
  9: {
    meaning: "Higher learning, philosophy, and long journeys",
    areas: ["beliefs", "education", "travel"],
  },
  10: {
    meaning: "Career, public image, and achievement",
    areas: ["ambition", "reputation", "authority"],
  },
  11: {
    meaning: "Friends, groups, and aspirations",
    areas: ["community", "hopes", "social networks"],
  },
  12: {
    meaning: "Spirituality, hidden matters, and the unconscious",
    areas: ["dreams", "solitude", "karma"],
  },
};

export function generateBirthChartReading(
  chart: BirthChart,
): BirthChartReading {
  const interpretations: Record<Planet, string> = {} as Record<Planet, string>;

  for (const pos of chart.planets) {
    interpretations[pos.planet] = PLANET_INTERPRETATIONS[pos.planet][pos.sign];
  }

  const houseMeanings: HouseReading[] = [];
  for (let i = 1; i <= 12; i++) {
    const houseInfo = HOUSE_MEANINGS[i];
    houseMeanings.push({
      house: i,
      sign: chart.houses[i],
      meaning: houseInfo.meaning,
      areas: houseInfo.areas,
    });
  }

  const aspects = generateAspects(chart);

  const summary = `Your birth chart reveals a ${getZodiacDisplay(chart.sunSign)} Sun, ${getZodiacDisplay(chart.moonSign)} Moon, and ${getZodiacDisplay(chart.risingSign)} Rising. This combination suggests a personality that combines ${getZodiacSymbol(chart.sunSign)} solar vitality with ${getZodiacSymbol(chart.moonSign)} emotional depth, projected through a ${getZodiacSymbol(chart.risingSign)} ascendant lens.`;

  return {
    chart,
    interpretations,
    houseMeanings,
    aspects,
    summary,
  };
}

function generateAspects(chart: BirthChart): string[] {
  const aspects: string[] = [];
  const majorPlanets = chart.planets.filter((p) =>
    ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"].includes(
      p.planet,
    ),
  );

  for (let i = 0; i < majorPlanets.length; i++) {
    for (let j = i + 1; j < majorPlanets.length; j++) {
      const p1 = majorPlanets[i];
      const p2 = majorPlanets[j];

      const deg1 = p1.degree + ZODIAC_SIGNS.indexOf(p1.sign) * 30;
      const deg2 = p2.degree + ZODIAC_SIGNS.indexOf(p2.sign) * 30;
      const diff = Math.abs(normalizeDegree(deg1 - deg2));

      let aspect = "";
      if (diff < 10 || diff > 350) {
        aspect = "conjunct";
      } else if (Math.abs(diff - 60) < 8) {
        aspect = "sextile";
      } else if (Math.abs(diff - 90) < 8) {
        aspect = "square";
      } else if (Math.abs(diff - 120) < 8) {
        aspect = "trine";
      } else if (Math.abs(diff - 180) < 8) {
        aspect = "opposite";
      }

      if (aspect) {
        aspects.push(
          `${p1.planet.charAt(0).toUpperCase() + p1.planet.slice(1)} in ${getZodiacDisplay(p1.sign)} ${aspect} ${p2.planet.charAt(0).toUpperCase() + p2.planet.slice(1)} in ${getZodiacDisplay(p2.sign)}`,
        );
      }
    }
  }

  return aspects.slice(0, 5);
}

export { getZodiacDisplay, getZodiacSymbol, normalizeDegree };
