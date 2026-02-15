import { ZodiacSign } from "@vibes/shared-types";

const DAILY_INTROS = [
  "The stars align in your favor today,",
  "Cosmic energies surround you,",
  "The universe whispers secrets,",
  "Celestial movements suggest",
  "Planetary influences indicate",
  "The cosmos has a message:",
  "Divine energies flow toward you,",
  "The heavens are speaking,",
];

const DAILY_BODIES: Record<ZodiacSign, string[]> = {
  [ZodiacSign.ARIES]: [
    "Your fiery spirit is ready to take on new challenges. Trust your instincts and lead with confidence.",
    "Mars fuels your ambition today. Channel this energy into productive pursuits and watch your goals materialize.",
    "Bold moves lead to breakthroughs. Your natural leadership shines bright, attracting opportunities your way.",
  ],
  [ZodiacSign.TAURUS]: [
    "Steady progress brings satisfaction. Your practical approach to problems yields tangible results.",
    "Venus blesses you with patience and persistence. What you build today will stand the test of time.",
    "Comfort and security call to you. Balance your need for stability with occasional adventure.",
  ],
  [ZodiacSign.GEMINI]: [
    "Your curiosity opens unexpected doors. Communication flows effortlessly, making this an ideal day for negotiations.",
    "Mercury quickens your wit. Ideas spark like lightning, and your adaptability turns challenges into opportunities.",
    "Social connections prove valuable. Your gift of gab opens hearts and minds wherever you go.",
  ],
  [ZodiacSign.CANCER]: [
    "Emotional tides bring insight. Trust your intuition, as it guides you toward nurturing connections.",
    "Home and family take center stage. Create the sanctuary you need to recharge your spiritual batteries.",
    "The Moon illuminates your deepest feelings. Honor your emotions while maintaining healthy boundaries.",
  ],
  [ZodiacSign.LEO]: [
    "Your radiant energy attracts admirers. Step into the spotlight, as recognition for your talents arrives.",
    "The Sun amplifies your natural charisma. Creative pursuits bring joy and potentially lucrative rewards.",
    "Generosity flows from your heart. Your warm spirit lifts others, and karma returns the favor.",
  ],
  [ZodiacSign.VIRGO]: [
    "Attention to detail pays dividends. Your analytical mind spots opportunities others overlook.",
    "Service to others brings unexpected rewards. Your helpful nature creates ripples of positive change.",
    "Health and wellness call for attention. Small improvements in routine lead to significant benefits.",
  ],
  [ZodiacSign.LIBRA]: [
    "Harmony and balance guide your day. Diplomatic skills smooth rough waters in relationships.",
    "Venus graces you with charm and grace. Partnerships flourish when approached with fairness.",
    "Beauty surrounds you, waiting to be appreciated. Artistic pursuits bring deep satisfaction.",
  ],
  [ZodiacSign.SCORPIO]: [
    "Transformation is your ally today. What ends makes room for powerful new beginnings.",
    "Your penetrating insight cuts through confusion. Trust your ability to see beneath the surface.",
    "Passion intensifies in all areas of life. Channel this energy wisely for profound results.",
  ],
  [ZodiacSign.SAGITTARIUS]: [
    "Adventure calls your name. Expand your horizons through travel, learning, or philosophical exploration.",
    "Jupiter brings abundance and optimism. Your enthusiasm is contagious, inspiring those around you.",
    "Freedom and truth guide your path. Honest expression opens doors to meaningful connections.",
  ],
  [ZodiacSign.CAPRICORN]: [
    "Ambition meets opportunity. Your disciplined approach turns dreams into concrete achievements.",
    "Saturn rewards your persistence. Professional advancement comes through steady, calculated effort.",
    "Authority and responsibility align. Your leadership skills are recognized and respected.",
  ],
  [ZodiacSign.AQUARIUS]: [
    "Innovation sparks breakthrough thinking. Your unique perspective offers solutions others miss.",
    "Uranus brings unexpected but welcome changes. Embrace the unconventional path.",
    "Community and friendship flourish. Your vision for a better world inspires collective action.",
  ],
  [ZodiacSign.PISCES]: [
    "Intuition flows like water. Your sensitivity to unseen realms guides you toward spiritual growth.",
    "Neptune enhances your creative and compassionate nature. Artistic and healing pursuits thrive.",
    "Dreams carry important messages. Pay attention to synchronicities and signs from the universe.",
  ],
};

const DAILY_OUTROS = [
  "Embrace the cosmic flow and let the stars guide your journey.",
  "Remember, the universe supports those who dare to dream.",
  "Trust in the timing of your life. Everything unfolds as it should.",
  "Your cosmic alignment brings opportunities for growth and joy.",
  "The stars encourage you to stay true to your authentic self.",
  "Let celestial wisdom illuminate your path forward.",
];

const MOODS = [
  "Optimistic",
  "Reflective",
  "Energetic",
  "Calm",
  "Creative",
  "Focused",
  "Adventurous",
  "Grounded",
  "Passionate",
  "Thoughtful",
  "Social",
  "Intuitive",
];

const COLORS = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "White",
  "Gold",
  "Silver",
  "Indigo",
  "Emerald",
  "Turquoise",
  "Ruby",
  "Coral",
  "Lavender",
];

const COMPATIBILITY = Object.values(ZodiacSign);

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

export function generateDailyHoroscope(
  sign: ZodiacSign,
  date: string,
): {
  description: string;
  mood: string;
  color: string;
  compatibility: string;
  lucky_number: number;
  lucky_time: string;
} {
  const seedStr = `${date}-${sign}`;
  const hash = hashCode(seedStr);
  const random = seededRandom(hash);

  const intro = DAILY_INTROS[Math.floor(random() * DAILY_INTROS.length)];
  const bodies = DAILY_BODIES[sign] || DAILY_BODIES[ZodiacSign.ARIES];
  const body = bodies[Math.floor(random() * bodies.length)];
  const outro = DAILY_OUTROS[Math.floor(random() * DAILY_OUTROS.length)];

  const mood = MOODS[Math.floor(random() * MOODS.length)];
  const color = COLORS[Math.floor(random() * COLORS.length)];
  const compatibleSign =
    COMPATIBILITY[Math.floor(random() * COMPATIBILITY.length)];
  const luckyNumber = Math.floor(random() * 9) + 1;

  const hours = Math.floor(random() * 12) + 1;
  const ampm = random() > 0.5 ? "AM" : "PM";
  const luckyTime = `${hours}:00 ${ampm}`;

  return {
    description: `${intro} ${body} ${outro}`,
    mood,
    color,
    compatibility: compatibleSign,
    lucky_number: luckyNumber,
    lucky_time: luckyTime,
  };
}

const WEEKLY_THEMES = [
  "This week invites transformation",
  "Growth opportunities abound this week",
  "Balance is your cosmic theme this week",
  "This week brings clarity and insight",
  "Creative energy flows strongly this week",
  "This week encourages bold action",
  "Harmony and peace define this week",
  "This week rewards patience and persistence",
];

export function generateWeeklyHoroscope(
  sign: ZodiacSign,
  weekStr: string,
): {
  description: string;
  mood: string;
  color: string;
  compatibility: string;
  lucky_number: number;
} {
  const seedStr = `${weekStr}-${sign}`;
  const hash = hashCode(seedStr);
  const random = seededRandom(hash);

  const theme = WEEKLY_THEMES[Math.floor(random() * WEEKLY_THEMES.length)];
  const bodies = DAILY_BODIES[sign] || DAILY_BODIES[ZodiacSign.ARIES];
  const body = bodies[Math.floor(random() * bodies.length)];

  const mood = MOODS[Math.floor(random() * MOODS.length)];
  const color = COLORS[Math.floor(random() * COLORS.length)];
  const compatibleSign =
    COMPATIBILITY[Math.floor(random() * COMPATIBILITY.length)];
  const luckyNumber = Math.floor(random() * 9) + 1;

  return {
    description: `${theme}. ${body} Trust the process and remain open to the universe's guidance throughout this period.`,
    mood,
    color,
    compatibility: compatibleSign,
    lucky_number: luckyNumber,
  };
}
