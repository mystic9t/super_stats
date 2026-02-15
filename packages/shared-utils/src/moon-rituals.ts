import {
  MoonPhase,
  MoonRitual,
  ZodiacMoonInfluence,
  ZodiacSign,
} from "@vibes/shared-types";

/**
 * Get rituals and practices for current moon phase and zodiac sign
 */
export function getMoonRituals(
  phase: MoonPhase,
  sunSign: ZodiacSign,
): MoonRitual[] {
  const rituals: MoonRitual[] = [];

  // Base rituals for each moon phase
  const baseRituals: Record<MoonPhase, MoonRitual[]> = {
    [MoonPhase.NEW_MOON]: [
      {
        title: "Intention Setting",
        description: "Set clear intentions for the lunar cycle ahead",
        actions: [
          "Write down 3-5 goals",
          "Visualize success",
          "Create a vision board",
        ],
        zodiacFocus: [ZodiacSign.ARIES, ZodiacSign.LEO, ZodiacSign.SAGITTARIUS],
      },
      {
        title: "Cleansing Ritual",
        description: "Clear old energy to make space for new beginnings",
        actions: [
          "Sage or palo santo cleansing",
          "Salt bath",
          "Declutter your space",
        ],
        zodiacFocus: [ZodiacSign.CANCER, ZodiacSign.SCORPIO, ZodiacSign.PISCES],
      },
      {
        title: "Seed Planting",
        description: "Literal or metaphorical planting of seeds",
        actions: [
          "Plant herbs or flowers",
          "Start a new journal",
          "Begin a new habit",
        ],
        zodiacFocus: [
          ZodiacSign.TAURUS,
          ZodiacSign.VIRGO,
          ZodiacSign.CAPRICORN,
        ],
      },
      {
        title: "Social Connection",
        description: "Connect with community and share intentions",
        actions: [
          "Host a dinner party",
          "Join a new group",
          "Share goals with friends",
        ],
        zodiacFocus: [ZodiacSign.GEMINI, ZodiacSign.LIBRA, ZodiacSign.AQUARIUS],
      },
    ],
    [MoonPhase.WAXING_CRESCENT]: [
      {
        title: "Action Taking",
        description: "Take first steps toward your intentions",
        actions: [
          "Make that phone call",
          "Send the email",
          "Take the first step",
        ],
        zodiacFocus: [ZodiacSign.ARIES, ZodiacSign.LEO, ZodiacSign.CAPRICORN],
      },
      {
        title: "Learning & Growth",
        description: "Expand your knowledge and skills",
        actions: [
          "Read a book on your goal",
          "Take a class",
          "Research thoroughly",
        ],
        zodiacFocus: [
          ZodiacSign.GEMINI,
          ZodiacSign.VIRGO,
          ZodiacSign.SAGITTARIUS,
        ],
      },
      {
        title: "Creative Expression",
        description: "Express your intentions creatively",
        actions: ["Paint or draw", "Write poetry", "Dance or move your body"],
        zodiacFocus: [ZodiacSign.TAURUS, ZodiacSign.LIBRA, ZodiacSign.PISCES],
      },
    ],
    [MoonPhase.FIRST_QUARTER]: [
      {
        title: "Overcoming Challenges",
        description: "Face obstacles head-on with courage",
        actions: [
          "Identify what's blocking you",
          "Make a plan to overcome it",
          "Ask for help",
        ],
        zodiacFocus: [
          ZodiacSign.ARIES,
          ZodiacSign.SCORPIO,
          ZodiacSign.CAPRICORN,
        ],
      },
      {
        title: "Decision Making",
        description: "Make important choices with confidence",
        actions: [
          "List pros and cons",
          "Trust your intuition",
          "Commit to a path",
        ],
        zodiacFocus: [ZodiacSign.LIBRA, ZodiacSign.GEMINI, ZodiacSign.AQUARIUS],
      },
      {
        title: "Physical Activity",
        description: "Move your body to clear mental blocks",
        actions: ["Go for a run", "Practice yoga", "Dance vigorously"],
        zodiacFocus: [ZodiacSign.LEO, ZodiacSign.SAGITTARIUS, ZodiacSign.ARIES],
      },
    ],
    [MoonPhase.WAXING_GIBBOUS]: [
      {
        title: "Refinement",
        description: "Fine-tune your approach and adjust course",
        actions: [
          "Review your progress",
          "Adjust your strategy",
          "Seek feedback",
        ],
        zodiacFocus: [
          ZodiacSign.VIRGO,
          ZodiacSign.CAPRICORN,
          ZodiacSign.AQUARIUS,
        ],
      },
      {
        title: "Patience Practice",
        description: "Trust the process and practice patience",
        actions: [
          "Meditate on patience",
          "Practice deep breathing",
          "Trust divine timing",
        ],
        zodiacFocus: [ZodiacSign.TAURUS, ZodiacSign.CANCER, ZodiacSign.PISCES],
      },
    ],
    [MoonPhase.FULL_MOON]: [
      {
        title: "Celebration & Gratitude",
        description: "Celebrate your achievements and express gratitude",
        actions: [
          "Full moon ritual",
          "Charge crystals in moonlight",
          "Express gratitude",
        ],
        zodiacFocus: [ZodiacSign.LEO, ZodiacSign.LIBRA, ZodiacSign.PISCES],
      },
      {
        title: "Release Ceremony",
        description: "Let go of what no longer serves you",
        actions: [
          "Write what to release and burn it",
          "Forgive yourself and others",
          "Take a cleansing bath",
        ],
        zodiacFocus: [ZodiacSign.SCORPIO, ZodiacSign.CANCER, ZodiacSign.VIRGO],
      },
      {
        title: "Manifestation",
        description: "Amplify your intentions with full moon energy",
        actions: [
          "Create a manifestation altar",
          "Speak affirmations aloud",
          "Visualize vividly",
        ],
        zodiacFocus: [
          ZodiacSign.ARIES,
          ZodiacSign.SAGITTARIUS,
          ZodiacSign.AQUARIUS,
        ],
      },
      {
        title: "Connection",
        description: "Gather with community under the full moon",
        actions: [
          "Host a moon circle",
          "Share with friends",
          "Dance under the moon",
        ],
        zodiacFocus: [ZodiacSign.GEMINI, ZodiacSign.LIBRA, ZodiacSign.LEO],
      },
    ],
    [MoonPhase.WANING_GIBBOUS]: [
      {
        title: "Gratitude Practice",
        description: "Deepen your gratitude for recent blessings",
        actions: [
          "Write a gratitude list",
          "Thank someone important",
          "Appreciate small things",
        ],
        zodiacFocus: [ZodiacSign.TAURUS, ZodiacSign.CANCER, ZodiacSign.PISCES],
      },
      {
        title: "Teaching & Sharing",
        description: "Share your wisdom and experiences",
        actions: ["Mentor someone", "Write about your journey", "Give advice"],
        zodiacFocus: [
          ZodiacSign.LEO,
          ZodiacSign.SAGITTARIUS,
          ZodiacSign.AQUARIUS,
        ],
      },
    ],
    [MoonPhase.LAST_QUARTER]: [
      {
        title: "Letting Go",
        description: "Release attachments and forgive",
        actions: [
          "Forgiveness meditation",
          "Cut energetic cords",
          "Release grudges",
        ],
        zodiacFocus: [ZodiacSign.SCORPIO, ZodiacSign.CANCER, ZodiacSign.PISCES],
      },
      {
        title: "Surrender",
        description: "Surrender control and trust the universe",
        actions: [
          "Practice acceptance",
          "Let go of outcomes",
          "Trust the process",
        ],
        zodiacFocus: [
          ZodiacSign.VIRGO,
          ZodiacSign.CAPRICORN,
          ZodiacSign.TAURUS,
        ],
      },
      {
        title: "Self-Care",
        description: "Nurture yourself deeply",
        actions: [
          "Take a long bath",
          "Get extra sleep",
          "Eat nourishing foods",
        ],
        zodiacFocus: [ZodiacSign.TAURUS, ZodiacSign.LIBRA, ZodiacSign.LEO],
      },
    ],
    [MoonPhase.WANING_CRESCENT]: [
      {
        title: "Rest & Restore",
        description: "Honor your need for rest and recovery",
        actions: ["Sleep in", "Take naps", "Minimize commitments"],
        zodiacFocus: [ZodiacSign.CANCER, ZodiacSign.PISCES, ZodiacSign.TAURUS],
      },
      {
        title: "Inner Reflection",
        description: "Turn inward and contemplate",
        actions: [
          "Journal deeply",
          "Meditate in silence",
          "Reflect on the cycle",
        ],
        zodiacFocus: [
          ZodiacSign.SCORPIO,
          ZodiacSign.VIRGO,
          ZodiacSign.CAPRICORN,
        ],
      },
      {
        title: "Preparation",
        description: "Prepare for the new cycle ahead",
        actions: ["Clean your space", "Organize your plans", "Set up systems"],
        zodiacFocus: [
          ZodiacSign.VIRGO,
          ZodiacSign.CAPRICORN,
          ZodiacSign.AQUARIUS,
        ],
      },
    ],
  };

  // Get rituals for current phase
  const phaseRituals = baseRituals[phase] || [];

  // Sort rituals by relevance to user's sun sign
  // Rituals that include user's sign are prioritized
  return phaseRituals.sort((a, b) => {
    const aRelevance = a.zodiacFocus.includes(sunSign) ? 1 : 0;
    const bRelevance = b.zodiacFocus.includes(sunSign) ? 1 : 0;
    return bRelevance - aRelevance;
  });
}

/**
 * Get zodiac-specific moon influence
 */
export function getZodiacMoonInfluence(
  moonPhase: MoonPhase,
  sunSign: ZodiacSign,
): ZodiacMoonInfluence {
  // Element-based influences
  const fireSigns = [ZodiacSign.ARIES, ZodiacSign.LEO, ZodiacSign.SAGITTARIUS];
  const earthSigns = [
    ZodiacSign.TAURUS,
    ZodiacSign.VIRGO,
    ZodiacSign.CAPRICORN,
  ];
  const airSigns = [ZodiacSign.GEMINI, ZodiacSign.LIBRA, ZodiacSign.AQUARIUS];
  const waterSigns = [ZodiacSign.CANCER, ZodiacSign.SCORPIO, ZodiacSign.PISCES];

  let element = "";
  if (fireSigns.includes(sunSign)) element = "fire";
  else if (earthSigns.includes(sunSign)) element = "earth";
  else if (airSigns.includes(sunSign)) element = "air";
  else if (waterSigns.includes(sunSign)) element = "water";

  const influenceMap: Record<string, Record<MoonPhase, ZodiacMoonInfluence>> = {
    fire: {
      [MoonPhase.NEW_MOON]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Your natural enthusiasm is amplified. Channel this energy into bold new beginnings.",
        focus: [
          "Start passion projects",
          "Take initiative",
          "Lead with confidence",
        ],
        avoid: ["Impulsive decisions", "Burning out", "Ignoring details"],
      },
      [MoonPhase.WAXING_CRESCENT]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Momentum builds. Your drive and determination are at a peak.",
        focus: ["Take action", "Build momentum", "Stay focused"],
        avoid: ["Impatience", "Skipping steps", "Overcommitting"],
      },
      [MoonPhase.FIRST_QUARTER]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Challenges arise but you have the courage to face them head-on.",
        focus: ["Face challenges", "Make bold decisions", "Show leadership"],
        avoid: ["Avoiding conflict", "Giving up", "Being reckless"],
      },
      [MoonPhase.WAXING_GIBBOUS]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Refine your approach. Your creativity helps you find better solutions.",
        focus: ["Polish your work", "Seek feedback", "Adjust course"],
        avoid: ["Perfectionism", "Rushing", "Ignoring advice"],
      },
      [MoonPhase.FULL_MOON]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Your emotions are heightened. Channel this intensity into celebration and release.",
        focus: ["Celebrate wins", "Express emotions", "Release tension"],
        avoid: ["Drama", "Burning bridges", "Impulsive reactions"],
      },
      [MoonPhase.WANING_GIBBOUS]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Share your light with others. Your generosity inspires those around you.",
        focus: ["Teach others", "Share success", "Express gratitude"],
        avoid: ["Hogging spotlight", "Neglecting others", "Resting on laurels"],
      },
      [MoonPhase.LAST_QUARTER]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Time to let go of ego-driven pursuits. Find humility and acceptance.",
        focus: ["Practice humility", "Let go of control", "Forgive yourself"],
        avoid: ["Stubbornness", "Pride", "Holding grudges"],
      },
      [MoonPhase.WANING_CRESCENT]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Rest and recharge. Your energy needs replenishment before the new cycle.",
        focus: ["Rest deeply", "Reflect quietly", "Prepare for renewal"],
        avoid: ["Overworking", "Starting new projects", "Social overload"],
      },
    },
    earth: {
      [MoonPhase.NEW_MOON]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Plant practical seeds. Your grounded nature helps intentions take root.",
        focus: [
          "Set practical goals",
          "Create plans",
          "Start sustainable habits",
        ],
        avoid: ["Overcommitting", "Ignoring intuition", "Rigid thinking"],
      },
      [MoonPhase.WAXING_CRESCENT]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Build steadily. Your persistence creates lasting foundations.",
        focus: [
          "Take consistent action",
          "Build routines",
          "Make progress daily",
        ],
        avoid: ["Procrastination", "Perfectionism", "Rushing"],
      },
      [MoonPhase.FIRST_QUARTER]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Obstacles test your resolve. Your patience and determination overcome all.",
        focus: [
          "Stay steady",
          "Solve problems methodically",
          "Trust your pace",
        ],
        avoid: ["Giving up", " shortcuts", "Impatience"],
      },
      [MoonPhase.WAXING_GIBBOUS]: {
        sign: sunSign,
        moonPhase,
        influence: "Refinement suits you well. Polish your work to perfection.",
        focus: ["Edit and refine", "Improve systems", "Add finishing touches"],
        avoid: ["Overworking details", "Ignoring big picture", "Burnout"],
      },
      [MoonPhase.FULL_MOON]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Celebrate tangible achievements. Your hard work bears fruit now.",
        focus: ["Enjoy results", "Indulge sensually", "Appreciate abundance"],
        avoid: ["Overindulgence", "Materialism", "Ignoring emotions"],
      },
      [MoonPhase.WANING_GIBBOUS]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Share your abundance. Your generosity creates ripples of gratitude.",
        focus: ["Give back", "Share resources", "Express appreciation"],
        avoid: ["Hoarding", "Overspending", "Neglecting needs"],
      },
      [MoonPhase.LAST_QUARTER]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Release attachments to material things. Simplify and declutter.",
        focus: ["Let go of possessions", "Forgive debts", "Simplify life"],
        avoid: ["Clinging to security", "Material attachments", "Stubbornness"],
      },
      [MoonPhase.WANING_CRESCENT]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Rest in nature. Ground yourself before the new cycle begins.",
        focus: ["Connect with earth", "Rest in nature", "Replenish energy"],
        avoid: ["Overworking", "Neglecting rest", "Pushing through fatigue"],
      },
    },
    air: {
      [MoonPhase.NEW_MOON]: {
        sign: sunSign,
        moonPhase,
        influence:
          "New ideas flow freely. Capture them before they float away.",
        focus: [
          "Brainstorm",
          "Write ideas down",
          "Start intellectual projects",
        ],
        avoid: ["Overthinking", "Analysis paralysis", "Too many ideas"],
      },
      [MoonPhase.WAXING_CRESCENT]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Communicate your vision. Your words carry power and inspiration.",
        focus: ["Share ideas", "Network", "Collaborate"],
        avoid: ["Talking without action", "Gossip", "Scattered focus"],
      },
      [MoonPhase.FIRST_QUARTER]: {
        sign: sunSign,
        moonPhase,
        influence: "Mental challenges arise. Use logic and reason to navigate.",
        focus: ["Think critically", "Make rational decisions", "Solve puzzles"],
        avoid: [
          "Over-intellectualizing",
          "Ignoring intuition",
          "Mental exhaustion",
        ],
      },
      [MoonPhase.WAXING_GIBBOUS]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Refine your thinking. Clarity comes through continued learning.",
        focus: ["Research deeply", "Seek knowledge", "Refine ideas"],
        avoid: [
          "Information overload",
          "Overcomplicating",
          "Ignoring simplicity",
        ],
      },
      [MoonPhase.FULL_MOON]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Communications intensify. Speak your truth with clarity and kindness.",
        focus: [
          "Have important conversations",
          "Express truth",
          "Listen deeply",
        ],
        avoid: ["Harsh words", "Over-communication", "Mental overwhelm"],
      },
      [MoonPhase.WANING_GIBBOUS]: {
        sign: sunSign,
        moonPhase,
        influence: "Teach what you've learned. Your wisdom helps others grow.",
        focus: ["Share knowledge", "Write or teach", "Mentor others"],
        avoid: ["Talking too much", "Preaching", "Intellectual pride"],
      },
      [MoonPhase.LAST_QUARTER]: {
        sign: sunSign,
        moonPhase,
        influence: "Release mental chatter. Find stillness and peace.",
        focus: ["Practice silence", "Meditate", "Clear mental clutter"],
        avoid: ["Overthinking", "Mental loops", "Excessive planning"],
      },
      [MoonPhase.WANING_CRESCENT]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Rest your mind. Allow intuitive wisdom to emerge in stillness.",
        focus: ["Quiet contemplation", "Dream work", "Rest mentally"],
        avoid: ["Over-analyzing", "Mental stress", "Information consumption"],
      },
    },
    water: {
      [MoonPhase.NEW_MOON]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Dive deep into your emotions. New feelings and intuitions emerge.",
        focus: ["Feel deeply", "Trust intuition", "Set emotional intentions"],
        avoid: ["Emotional overwhelm", "Escapism", "Ignoring logic"],
      },
      [MoonPhase.WAXING_CRESCENT]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Emotions flow creatively. Channel feelings into art and expression.",
        focus: ["Express creatively", "Feel fully", "Move emotions through"],
        avoid: ["Emotional suppression", "Escaping feelings", "Drama"],
      },
      [MoonPhase.FIRST_QUARTER]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Emotional challenges surface. Navigate with compassion and boundaries.",
        focus: ["Set boundaries", "Feel without drowning", "Navigate emotions"],
        avoid: ["Emotional manipulation", "Overwhelm", "Losing boundaries"],
      },
      [MoonPhase.WAXING_GIBBOUS]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Emotional clarity emerges. Trust your intuition to guide refinement.",
        focus: ["Trust intuition", "Feel into decisions", "Refine emotionally"],
        avoid: [
          "Ignoring feelings",
          "Second-guessing intuition",
          "Emotional extremes",
        ],
      },
      [MoonPhase.FULL_MOON]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Emotions peak. Honor your feelings and release what no longer serves.",
        focus: ["Feel fully", "Release emotions", "Honor intuition"],
        avoid: ["Emotional repression", "Escapism", "Mood swings"],
      },
      [MoonPhase.WANING_GIBBOUS]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Gratitude flows naturally. Share your emotional wisdom with others.",
        focus: ["Express gratitude", "Share feelings", "Nurture others"],
        avoid: ["Emotional depletion", "Overgiving", "Ignoring own needs"],
      },
      [MoonPhase.LAST_QUARTER]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Forgive and release. Let go of emotional baggage and old wounds.",
        focus: ["Practice forgiveness", "Release past", "Heal wounds"],
        avoid: ["Holding grudges", "Emotional attachment", "Drowning in past"],
      },
      [MoonPhase.WANING_CRESCENT]: {
        sign: sunSign,
        moonPhase,
        influence:
          "Surrender completely. Trust the flow and rest in the ocean of peace.",
        focus: ["Surrender", "Float in feelings", "Rest emotionally"],
        avoid: ["Resisting flow", "Emotional turmoil", "Over-processing"],
      },
    },
  };

  return (
    influenceMap[element]?.[moonPhase] || {
      sign: sunSign,
      moonPhase,
      influence: "The moon's energy supports your growth and transformation.",
      focus: ["Trust the process", "Stay present", "Follow intuition"],
      avoid: ["Resistance", "Overthinking", "Fear"],
    }
  );
}

/**
 * Get zodiac element
 */
function getZodiacElement(sign: ZodiacSign): string {
  const fireSigns = [ZodiacSign.ARIES, ZodiacSign.LEO, ZodiacSign.SAGITTARIUS];
  const earthSigns = [
    ZodiacSign.TAURUS,
    ZodiacSign.VIRGO,
    ZodiacSign.CAPRICORN,
  ];
  const airSigns = [ZodiacSign.GEMINI, ZodiacSign.LIBRA, ZodiacSign.AQUARIUS];
  const waterSigns = [ZodiacSign.CANCER, ZodiacSign.SCORPIO, ZodiacSign.PISCES];

  if (fireSigns.includes(sign)) return "fire";
  if (earthSigns.includes(sign)) return "earth";
  if (airSigns.includes(sign)) return "air";
  if (waterSigns.includes(sign)) return "water";
  return "unknown";
}
