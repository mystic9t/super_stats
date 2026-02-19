import {
  ZodiacSign,
  CompatibilityScore,
  CompatibilityReading,
} from "@vibes/shared-types";

// Element groupings
type Element = "fire" | "earth" | "air" | "water";
type Modality = "cardinal" | "fixed" | "mutable";

const SIGN_ELEMENTS: Record<ZodiacSign, Element> = {
  [ZodiacSign.ARIES]: "fire",
  [ZodiacSign.TAURUS]: "earth",
  [ZodiacSign.GEMINI]: "air",
  [ZodiacSign.CANCER]: "water",
  [ZodiacSign.LEO]: "fire",
  [ZodiacSign.VIRGO]: "earth",
  [ZodiacSign.LIBRA]: "air",
  [ZodiacSign.SCORPIO]: "water",
  [ZodiacSign.SAGITTARIUS]: "fire",
  [ZodiacSign.CAPRICORN]: "earth",
  [ZodiacSign.AQUARIUS]: "air",
  [ZodiacSign.PISCES]: "water",
};

const SIGN_MODALITIES: Record<ZodiacSign, Modality> = {
  [ZodiacSign.ARIES]: "cardinal",
  [ZodiacSign.TAURUS]: "fixed",
  [ZodiacSign.GEMINI]: "mutable",
  [ZodiacSign.CANCER]: "cardinal",
  [ZodiacSign.LEO]: "fixed",
  [ZodiacSign.VIRGO]: "mutable",
  [ZodiacSign.LIBRA]: "cardinal",
  [ZodiacSign.SCORPIO]: "fixed",
  [ZodiacSign.SAGITTARIUS]: "mutable",
  [ZodiacSign.CAPRICORN]: "cardinal",
  [ZodiacSign.AQUARIUS]: "fixed",
  [ZodiacSign.PISCES]: "mutable",
};

// Zodiac wheel order for calculating angular distance
const ZODIAC_ORDER: ZodiacSign[] = [
  ZodiacSign.ARIES,
  ZodiacSign.TAURUS,
  ZodiacSign.GEMINI,
  ZodiacSign.CANCER,
  ZodiacSign.LEO,
  ZodiacSign.VIRGO,
  ZodiacSign.LIBRA,
  ZodiacSign.SCORPIO,
  ZodiacSign.SAGITTARIUS,
  ZodiacSign.CAPRICORN,
  ZodiacSign.AQUARIUS,
  ZodiacSign.PISCES,
];

// Element compatibility matrix (0-1 scale)
const ELEMENT_COMPAT: Record<Element, Record<Element, number>> = {
  fire: { fire: 0.8, earth: 0.4, air: 0.9, water: 0.3 },
  earth: { fire: 0.4, earth: 0.8, air: 0.35, water: 0.85 },
  air: { fire: 0.9, earth: 0.35, air: 0.75, water: 0.4 },
  water: { fire: 0.3, earth: 0.85, air: 0.4, water: 0.8 },
};

// Aspect-based compatibility (angular distance in sign positions)
// 0=conjunction, 1=semi-sextile, 2=sextile, 3=square, 4=trine, 5=quincunx, 6=opposition
const ASPECT_SCORES: Record<number, number> = {
  0: 0.75, // Conjunction - same sign, strong but can be too similar
  1: 0.4, // Semi-sextile - adjacent signs, friction
  2: 0.85, // Sextile - harmonious, easy flow
  3: 0.45, // Square - tension, growth through challenge
  4: 0.95, // Trine - natural harmony, effortless
  5: 0.35, // Quincunx - adjustment needed, misunderstanding
  6: 0.7, // Opposition - magnetic attraction, complementary
};

function getSignDistance(sign1: ZodiacSign, sign2: ZodiacSign): number {
  const idx1 = ZODIAC_ORDER.indexOf(sign1);
  const idx2 = ZODIAC_ORDER.indexOf(sign2);
  const dist = Math.abs(idx1 - idx2);
  return dist > 6 ? 12 - dist : dist;
}

function calculateRawScores(
  sign1: ZodiacSign,
  sign2: ZodiacSign,
): CompatibilityScore {
  const el1 = SIGN_ELEMENTS[sign1];
  const el2 = SIGN_ELEMENTS[sign2];
  const mod1 = SIGN_MODALITIES[sign1];
  const mod2 = SIGN_MODALITIES[sign2];
  const distance = getSignDistance(sign1, sign2);

  const elementScore = ELEMENT_COMPAT[el1][el2];
  const aspectScore = ASPECT_SCORES[distance] ?? 0.5;

  // Modality interaction
  let modalityBonus = 0;
  if (mod1 === mod2) {
    // Same modality: competitive but understanding
    modalityBonus = -0.05;
  } else if (
    (mod1 === "cardinal" && mod2 === "mutable") ||
    (mod1 === "mutable" && mod2 === "cardinal")
  ) {
    modalityBonus = 0.05; // Leader + adapter
  } else if (
    (mod1 === "fixed" && mod2 === "mutable") ||
    (mod1 === "mutable" && mod2 === "fixed")
  ) {
    modalityBonus = 0.03; // Stability + flexibility
  }

  // Love: weighted toward element + aspect (romance thrives on chemistry)
  const loveRaw =
    elementScore * 0.45 + aspectScore * 0.45 + modalityBonus + 0.1;

  // Friendship: weighted toward aspect (ease of getting along)
  const friendshipRaw =
    elementScore * 0.35 + aspectScore * 0.5 + modalityBonus + 0.15;

  // Work: modality matters more (complementary skills)
  const workRaw =
    elementScore * 0.3 +
    aspectScore * 0.4 +
    modalityBonus +
    0.15 +
    (mod1 !== mod2 ? 0.1 : 0.0);

  const clamp = (v: number) => Math.round(Math.min(100, Math.max(10, v * 100)));

  const love = clamp(loveRaw);
  const friendship = clamp(friendshipRaw);
  const work = clamp(workRaw);
  const overall = Math.round(love * 0.4 + friendship * 0.35 + work * 0.25);

  return { overall, love, friendship, work };
}

// --- Text generation data ---

const SIGN_DISPLAY: Record<ZodiacSign, string> = {
  [ZodiacSign.ARIES]: "Aries",
  [ZodiacSign.TAURUS]: "Taurus",
  [ZodiacSign.GEMINI]: "Gemini",
  [ZodiacSign.CANCER]: "Cancer",
  [ZodiacSign.LEO]: "Leo",
  [ZodiacSign.VIRGO]: "Virgo",
  [ZodiacSign.LIBRA]: "Libra",
  [ZodiacSign.SCORPIO]: "Scorpio",
  [ZodiacSign.SAGITTARIUS]: "Sagittarius",
  [ZodiacSign.CAPRICORN]: "Capricorn",
  [ZodiacSign.AQUARIUS]: "Aquarius",
  [ZodiacSign.PISCES]: "Pisces",
};

// Pair-specific overrides for well-known pairings (keyed by sorted sign pair)
const PAIR_DATA: Record<
  string,
  {
    summary: string;
    loveSummary: string;
    friendshipSummary: string;
    workSummary: string;
    strengths: string[];
    challenges: string[];
    tip: string;
  }
> = {
  "aries-leo": {
    summary:
      "A fiery, passionate pairing. Both signs radiate confidence and thrive on excitement, creating a dynamic and energetic bond.",
    loveSummary:
      "Sparks fly instantly. Both love grand gestures and adventure, making this a thrilling romance full of passion and playfulness.",
    friendshipSummary:
      "An unstoppable duo. Your shared enthusiasm and loyalty create a friendship that's always exciting and deeply supportive.",
    workSummary:
      "A powerhouse team. Aries brings initiative while Leo brings vision, but watch out for ego clashes over leadership.",
    strengths: [
      "Shared enthusiasm and energy",
      "Mutual respect and admiration",
      "Both are fiercely loyal",
    ],
    challenges: [
      "Competing for the spotlight",
      "Both can be stubborn",
      "Tempers can flare quickly",
    ],
    tip: "Take turns being in the spotlight - your bond is strongest when you celebrate each other's wins.",
  },
  "aries-libra": {
    summary:
      "Opposite signs on the zodiac wheel, creating a magnetic attraction. You balance each other beautifully when you find middle ground.",
    loveSummary:
      "The classic opposites-attract romance. Aries' boldness captivates Libra's charm, creating an intoxicating push-pull dynamic.",
    friendshipSummary:
      "You see the world differently, which makes conversations endlessly interesting. Libra smooths Aries' rough edges while Aries energizes Libra.",
    workSummary:
      "Aries drives action while Libra ensures fairness and diplomacy. Together you cover all bases - just agree on decision-making speed.",
    strengths: [
      "Natural magnetic attraction",
      "Complementary strengths",
      "Both value honesty",
    ],
    challenges: [
      "Different decision-making styles",
      "Aries' bluntness vs Libra's diplomacy",
      "Balancing independence with partnership",
    ],
    tip: "Embrace your differences as superpowers - what one lacks, the other provides.",
  },
  "taurus-cancer": {
    summary:
      "A deeply nurturing and stable pairing. Both signs value security, home, and emotional connection above all else.",
    loveSummary:
      "A tender, devoted romance. Taurus provides the stability Cancer craves, while Cancer offers the emotional depth Taurus secretly needs.",
    friendshipSummary:
      "The comfort-food friendship. You're each other's safe space, always ready with a listening ear and practical support.",
    workSummary:
      "A reliable, productive team. Taurus handles the practical details while Cancer reads the room and manages relationships.",
    strengths: [
      "Deep emotional understanding",
      "Shared love of comfort and security",
      "Unwavering loyalty",
    ],
    challenges: [
      "Both can be possessive",
      "Resistance to change",
      "Mood swings meeting stubbornness",
    ],
    tip: "Build your cozy world together, but remember to step outside your comfort zone occasionally.",
  },
  "gemini-sagittarius": {
    summary:
      "Opposite signs united by curiosity and a love of learning. Together you explore ideas, places, and possibilities endlessly.",
    loveSummary:
      "A whirlwind romance of adventure and intellectual stimulation. Neither will ever be bored - commitment is the only real challenge.",
    friendshipSummary:
      "The ultimate adventure buddies. Every conversation leads somewhere unexpected, and you push each other to grow.",
    workSummary:
      "Brilliant at brainstorming and big-picture thinking. You'll need someone else to handle the details, though.",
    strengths: [
      "Endless intellectual stimulation",
      "Shared love of adventure",
      "Mutual respect for freedom",
    ],
    challenges: [
      "Neither wants to be pinned down",
      "Can be scattered together",
      "Honesty can sometimes be too blunt",
    ],
    tip: "Channel your shared restlessness into joint adventures rather than running in different directions.",
  },
  "cancer-capricorn": {
    summary:
      "Opposite signs that create a powerful foundation. Cancer brings heart while Capricorn brings structure - together, you build empires.",
    loveSummary:
      "A slow-burning, deeply committed romance. It takes time to build trust, but once established, this bond is nearly unbreakable.",
    friendshipSummary:
      "You balance each other perfectly. Cancer reminds Capricorn to feel, while Capricorn helps Cancer build real-world security.",
    workSummary:
      "An exceptional professional pairing. Capricorn's ambition meets Cancer's intuition, creating both strategy and heart in every project.",
    strengths: [
      "Complementary strengths",
      "Both value loyalty and commitment",
      "Strong foundation-builders",
    ],
    challenges: [
      "Emotional vs practical approaches",
      "Capricorn's workaholism vs Cancer's need for closeness",
      "Both can be controlling",
    ],
    tip: "Schedule quality time together - your bond deepens through shared rituals and traditions.",
  },
  "leo-aquarius": {
    summary:
      "Opposite signs with a shared love of standing out. Leo rules the heart while Aquarius rules the mind - together, you're unforgettable.",
    loveSummary:
      "A dramatic, exciting romance. Leo's warmth melts Aquarius' cool exterior, while Aquarius keeps Leo intellectually fascinated.",
    friendshipSummary:
      "The 'power couple' friendship. You inspire each other to be bold, creative, and unapologetically yourselves.",
    workSummary:
      "Leo's charisma and Aquarius' innovation make you a formidable creative team. Just agree on who gets final say.",
    strengths: [
      "Mutual admiration",
      "Both are fiercely independent",
      "Shared creativity and vision",
    ],
    challenges: [
      "Leo's need for attention vs Aquarius' detachment",
      "Stubbornness on both sides",
      "Different emotional languages",
    ],
    tip: "Celebrate what makes each of you unique - trying to change each other will only create friction.",
  },
  "virgo-pisces": {
    summary:
      "Opposite signs connected by a desire to serve and heal. Virgo brings order to Pisces' dreams, while Pisces adds magic to Virgo's reality.",
    loveSummary:
      "A gentle, soulful romance. Pisces sees Virgo's hidden softness, and Virgo gives Pisces' dreams a tangible form.",
    friendshipSummary:
      "A beautifully balanced friendship. You help each other grow - Virgo with practical advice, Pisces with emotional wisdom.",
    workSummary:
      "Pisces brings the creative vision, Virgo executes flawlessly. Together you create something both beautiful and functional.",
    strengths: [
      "Deep mutual understanding",
      "Complementary skills",
      "Both are devoted helpers",
    ],
    challenges: [
      "Virgo's criticism can wound sensitive Pisces",
      "Pisces' vagueness frustrates detail-oriented Virgo",
      "Different approaches to problem-solving",
    ],
    tip: "Lead with gentleness. Virgo, soften your feedback. Pisces, be more direct about your needs.",
  },
  "scorpio-taurus": {
    summary:
      "Opposite signs with an intense, magnetic connection. Both are deeply loyal and value commitment, creating a bond that runs soul-deep.",
    loveSummary:
      "One of the most passionate pairings in the zodiac. The physical and emotional chemistry is off the charts.",
    friendshipSummary:
      "A ride-or-die friendship. Once trust is established, nothing can break this bond. You'd go to war for each other.",
    workSummary:
      "Both are determined and resourceful. When you agree on a goal, nothing can stop you. The challenge is agreeing.",
    strengths: [
      "Intense loyalty and devotion",
      "Powerful physical chemistry",
      "Shared determination",
    ],
    challenges: [
      "Both are incredibly stubborn",
      "Possessiveness and jealousy",
      "Power struggles",
    ],
    tip: "Trust is everything for this pairing. Build it slowly and never betray it - the consequences are permanent.",
  },
};

// Generic text generators based on element/aspect relationships
function generateGenericSummary(
  sign1: ZodiacSign,
  sign2: ZodiacSign,
  scores: CompatibilityScore,
): string {
  const n1 = SIGN_DISPLAY[sign1];
  const n2 = SIGN_DISPLAY[sign2];
  const el1 = SIGN_ELEMENTS[sign1];
  const el2 = SIGN_ELEMENTS[sign2];

  if (el1 === el2) {
    return `${n1} and ${n2} share the ${el1} element, creating an intuitive understanding. You speak the same emotional language, which makes connection effortless - though you may amplify each other's tendencies.`;
  }

  const distance = getSignDistance(sign1, sign2);
  if (distance === 4) {
    return `${n1} and ${n2} form a harmonious trine aspect, one of the most naturally compatible connections in astrology. Your energies flow together effortlessly.`;
  }
  if (distance === 6) {
    return `${n1} and ${n2} sit opposite each other on the zodiac wheel, creating a powerful magnetic attraction. You mirror and complete each other in fascinating ways.`;
  }
  if (distance === 2) {
    return `${n1} and ${n2} form a supportive sextile aspect. Your different elements (${el1} and ${el2}) complement each other, creating a balanced and stimulating connection.`;
  }
  if (distance === 3) {
    return `${n1} and ${n2} form a challenging square aspect. There's undeniable tension, but this friction can spark incredible growth if you both stay open.`;
  }

  if (scores.overall >= 70) {
    return `${n1} and ${n2} share a naturally harmonious energy. Your different qualities complement each other well, creating a balanced and enriching connection.`;
  }
  if (scores.overall >= 50) {
    return `${n1} and ${n2} have a connection that requires effort but offers rich rewards. Your differences can be a source of growth when approached with patience.`;
  }
  return `${n1} and ${n2} approach life from very different angles. This pairing challenges both signs to grow beyond their comfort zones.`;
}

function generateLoveSummary(
  sign1: ZodiacSign,
  sign2: ZodiacSign,
  score: number,
): string {
  const n1 = SIGN_DISPLAY[sign1];
  const n2 = SIGN_DISPLAY[sign2];
  if (score >= 85)
    return `A deeply passionate and harmonious romantic connection. ${n1} and ${n2} naturally understand each other's needs, creating a love that feels fated.`;
  if (score >= 70)
    return `Strong romantic chemistry with a natural flow. ${n1} and ${n2} can build a beautiful love story with mutual respect and shared values.`;
  if (score >= 55)
    return `A romance that grows stronger with effort. ${n1} and ${n2} may need to work on communication, but the rewards of this partnership are worth it.`;
  if (score >= 40)
    return `A challenging but potentially transformative romance. ${n1} and ${n2} must learn to appreciate their differences to make love flourish.`;
  return `An unconventional romantic pairing that requires significant compromise. ${n1} and ${n2} can learn profound lessons from each other if willing to adapt.`;
}

function generateFriendshipSummary(
  sign1: ZodiacSign,
  sign2: ZodiacSign,
  score: number,
): string {
  const n1 = SIGN_DISPLAY[sign1];
  const n2 = SIGN_DISPLAY[sign2];
  if (score >= 85)
    return `A natural, easy friendship. ${n1} and ${n2} click instantly and can spend hours together without running out of things to share.`;
  if (score >= 70)
    return `A solid, reliable friendship built on mutual respect. ${n1} and ${n2} bring out the best in each other.`;
  if (score >= 55)
    return `A friendship that deepens over time. ${n1} and ${n2} may not click immediately, but shared experiences build a lasting bond.`;
  if (score >= 40)
    return `A friendship of contrasts. ${n1} and ${n2} can broaden each other's worldview, even if they don't always see eye to eye.`;
  return `An unlikely friendship that, when it works, offers both ${n1} and ${n2} perspectives they'd never discover alone.`;
}

function generateWorkSummary(
  sign1: ZodiacSign,
  sign2: ZodiacSign,
  score: number,
): string {
  const n1 = SIGN_DISPLAY[sign1];
  const n2 = SIGN_DISPLAY[sign2];
  if (score >= 85)
    return `An exceptional professional partnership. ${n1} and ${n2} complement each other's working styles perfectly, achieving more together than apart.`;
  if (score >= 70)
    return `A productive working relationship. ${n1} and ${n2} can leverage their different strengths to tackle complex projects effectively.`;
  if (score >= 55)
    return `A workable professional pairing that benefits from clear role definition. ${n1} and ${n2} should establish boundaries and responsibilities early.`;
  if (score >= 40)
    return `A challenging work dynamic that requires clear communication. ${n1} and ${n2} have different approaches that need deliberate coordination.`;
  return `A professional pairing that works best with defined lanes. ${n1} and ${n2} should focus on their individual strengths and minimize overlap.`;
}

function generateStrengths(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
  const el1 = SIGN_ELEMENTS[sign1];
  const el2 = SIGN_ELEMENTS[sign2];
  const mod1 = SIGN_MODALITIES[sign1];
  const mod2 = SIGN_MODALITIES[sign2];
  const strengths: string[] = [];

  if (el1 === el2) {
    strengths.push("Intuitive understanding of each other's needs");
    strengths.push("Shared values and emotional wavelength");
  }

  if ((el1 === "fire" && el2 === "air") || (el1 === "air" && el2 === "fire")) {
    strengths.push("Exciting, stimulating energy together");
    strengths.push("Mutual inspiration and motivation");
  }
  if (
    (el1 === "earth" && el2 === "water") ||
    (el1 === "water" && el2 === "earth")
  ) {
    strengths.push("Deep emotional and practical bond");
    strengths.push("Shared appreciation for security");
  }

  if (mod1 !== mod2) {
    strengths.push("Complementary approaches to challenges");
  }

  if (strengths.length < 3) {
    strengths.push("Potential for significant personal growth");
    strengths.push("Learning from different perspectives");
  }

  return strengths.slice(0, 3);
}

function generateChallenges(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
  const el1 = SIGN_ELEMENTS[sign1];
  const el2 = SIGN_ELEMENTS[sign2];
  const mod1 = SIGN_MODALITIES[sign1];
  const mod2 = SIGN_MODALITIES[sign2];
  const challenges: string[] = [];

  if (
    (el1 === "fire" && el2 === "water") ||
    (el1 === "water" && el2 === "fire")
  ) {
    challenges.push("Emotional intensity can lead to conflict");
    challenges.push("Different communication styles");
  }
  if (
    (el1 === "earth" && el2 === "air") ||
    (el1 === "air" && el2 === "earth")
  ) {
    challenges.push("Practical vs theoretical approaches may clash");
    challenges.push("Different social needs and energy levels");
  }

  if (mod1 === mod2 && mod1 === "fixed") {
    challenges.push("Both can be extremely stubborn");
  }
  if (mod1 === mod2 && mod1 === "cardinal") {
    challenges.push("Power struggles over who leads");
  }

  if (challenges.length < 3) {
    challenges.push("Finding common ground takes patience");
    challenges.push("Respecting different rhythms and priorities");
  }

  return challenges.slice(0, 3);
}

function generateTip(
  sign1: ZodiacSign,
  sign2: ZodiacSign,
  scores: CompatibilityScore,
): string {
  const el1 = SIGN_ELEMENTS[sign1];
  const el2 = SIGN_ELEMENTS[sign2];

  if (scores.overall >= 80)
    return "Your natural harmony is a gift - use it as a foundation to tackle life's bigger challenges together.";
  if (el1 === el2)
    return "You understand each other deeply, but make sure to seek outside perspectives to avoid echo-chamber thinking.";
  if (scores.love > scores.friendship)
    return "Your romantic chemistry is strong - invest equally in building a genuine friendship to make love last.";
  if (scores.work > scores.love)
    return "You work brilliantly together - let that mutual respect and admiration naturally deepen into other areas of life.";
  if (scores.overall >= 50)
    return "Communication is your superpower. When in doubt, talk it out - understanding bridges any astrological gap.";
  return "Patience and curiosity are key. Approach your differences as fascinating puzzles rather than frustrating obstacles.";
}

/**
 * Calculate zodiac compatibility between two signs.
 * Pure function - no side effects, no API calls.
 */
export function calculateCompatibility(
  sign1: ZodiacSign,
  sign2: ZodiacSign,
): CompatibilityReading {
  const scores = calculateRawScores(sign1, sign2);

  // Check for pair-specific overrides
  const pairKey = [sign1, sign2].sort().join("-");
  const pairOverride = PAIR_DATA[pairKey];

  if (pairOverride) {
    return {
      sign1,
      sign2,
      scores,
      ...pairOverride,
    };
  }

  // Generate generic reading
  return {
    sign1,
    sign2,
    scores,
    summary: generateGenericSummary(sign1, sign2, scores),
    loveSummary: generateLoveSummary(sign1, sign2, scores.love),
    friendshipSummary: generateFriendshipSummary(
      sign1,
      sign2,
      scores.friendship,
    ),
    workSummary: generateWorkSummary(sign1, sign2, scores.work),
    strengths: generateStrengths(sign1, sign2),
    challenges: generateChallenges(sign1, sign2),
    tip: generateTip(sign1, sign2, scores),
  };
}
