import { ZodiacSign, DailyAffirmation } from "@vibes/shared-types";

// Deterministic seed from date + sign (same affirmation all day for same sign)
function seedHash(date: string, sign: string): number {
  const str = `${date}-${sign}-affirmation`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

// ── Sign-specific affirmation pools ──

const SIGN_AFFIRMATIONS: Record<ZodiacSign, string[]> = {
  [ZodiacSign.ARIES]: [
    "I am a fearless pioneer. My courage lights the way for others.",
    "My passion is my superpower. I channel it with intention and grace.",
    "I trust my instincts and take bold action toward my dreams.",
    "I am the spark that ignites change. My energy is unstoppable.",
    "I lead with my heart and trust the fire within me.",
    "My determination turns obstacles into stepping stones.",
    "I embrace new beginnings with excitement and confidence.",
    "My warrior spirit protects what matters most to me.",
  ],
  [ZodiacSign.TAURUS]: [
    "I am grounded in my worth. Abundance flows to me naturally.",
    "I deserve beauty, comfort, and peace in every area of my life.",
    "My patience is my greatest strength. Good things come to those who persist.",
    "I am rooted like an ancient tree — strong, steady, and enduring.",
    "I trust the timing of my life. Everything unfolds in perfect order.",
    "My senses guide me toward what truly nourishes my soul.",
    "I build my dreams on a foundation of self-love and determination.",
    "I release the need to rush. My steady pace creates lasting results.",
  ],
  [ZodiacSign.GEMINI]: [
    "My curiosity is a gift. Every conversation opens a new door.",
    "I honor all sides of myself. My duality is my depth.",
    "My words carry power. I choose them with care and creativity.",
    "I am a bridge between ideas, connecting the dots others cannot see.",
    "My adaptability allows me to thrive in any situation.",
    "I communicate my truth with clarity and compassion.",
    "My mind is sharp, my spirit is light, and my heart is open.",
    "I embrace change as the natural rhythm of my growth.",
  ],
  [ZodiacSign.CANCER]: [
    "My sensitivity is my superpower. I feel deeply and love fiercely.",
    "I create safe spaces wherever I go. My presence is a shelter.",
    "I honor my emotions as sacred messengers guiding my path.",
    "My intuition is a compass that never leads me astray.",
    "I nurture myself with the same devotion I give to others.",
    "My home is within me. I carry peace wherever I go.",
    "I release what no longer serves me and make room for new blessings.",
    "My emotional depth is a wellspring of wisdom and creativity.",
  ],
  [ZodiacSign.LEO]: [
    "I shine unapologetically. My light inspires others to find their own.",
    "I am worthy of love, recognition, and all the joy life offers.",
    "My creativity flows freely. I am a channel for divine expression.",
    "I lead with generosity and warmth. My heart is my crown.",
    "I celebrate myself without apology. Self-love is not selfish.",
    "My presence commands attention because my spirit is authentic.",
    "I am the author of my story, and I write it with courage.",
    "My inner fire burns bright, warming everyone around me.",
  ],
  [ZodiacSign.VIRGO]: [
    "My attention to detail is a form of devotion. I honor the small things.",
    "I release perfectionism and embrace the beauty of progress.",
    "My analytical mind is a gift. I use it to serve, not to judge.",
    "I am whole and complete exactly as I am right now.",
    "My desire to improve the world starts with accepting myself.",
    "I trust that my efforts matter, even when results are not yet visible.",
    "My practical wisdom guides me toward solutions that truly help.",
    "I balance service to others with sacred self-care.",
  ],
  [ZodiacSign.LIBRA]: [
    "I create harmony wherever I go. Balance is my natural state.",
    "I deserve relationships that mirror the love I give.",
    "My sense of justice makes the world more beautiful and fair.",
    "I choose peace without sacrificing my truth.",
    "My aesthetic eye sees beauty where others see ordinary.",
    "I make decisions with confidence, trusting my inner compass.",
    "I am both gentle and strong. My grace is my power.",
    "I attract partnerships that elevate and inspire me.",
  ],
  [ZodiacSign.SCORPIO]: [
    "I transform darkness into light. My depth is my greatest gift.",
    "I release what no longer serves me and rise renewed.",
    "My intensity is magnetic. I channel it with purpose.",
    "I trust the process of transformation, even when it feels uncomfortable.",
    "My power lies in my ability to see beyond the surface.",
    "I embrace vulnerability as the ultimate act of courage.",
    "I am the phoenix. Every ending is a new beginning.",
    "My emotional depth allows me to connect with life's deepest truths.",
  ],
  [ZodiacSign.SAGITTARIUS]: [
    "My optimism is contagious. I spread hope wherever I wander.",
    "Every experience is a teacher. I am a lifelong student of the universe.",
    "I trust the journey, even when the destination is unknown.",
    "My freedom is sacred. I honor my need to explore and expand.",
    "I speak my truth with humor and wisdom.",
    "My adventurous spirit opens doors that fear keeps closed.",
    "I aim my arrow high and trust the universe to guide its flight.",
    "I find meaning in every chapter of my story.",
  ],
  [ZodiacSign.CAPRICORN]: [
    "My ambition is fueled by purpose. I climb with intention.",
    "I am building a legacy that will outlast any temporary setback.",
    "My discipline is an act of self-respect. I honor my commitments.",
    "I balance achievement with rest. Even mountains have valleys.",
    "My resilience is forged in patience. Time is my ally.",
    "I deserve to enjoy the fruits of my labor without guilt.",
    "My practical wisdom turns dreams into tangible reality.",
    "I lead by example, and my integrity speaks louder than words.",
  ],
  [ZodiacSign.AQUARIUS]: [
    "My uniqueness is my contribution to the world. I embrace what makes me different.",
    "I envision a better future and take steps to create it today.",
    "My independence is a strength, not a wall. I connect on my own terms.",
    "I honor my need for freedom while building meaningful connections.",
    "My innovative mind sees solutions where others see dead ends.",
    "I am ahead of my time, and that is exactly where I should be.",
    "I channel my humanitarian spirit into actions that create real change.",
    "My eccentricity is my authenticity. I refuse to dim my light.",
  ],
  [ZodiacSign.PISCES]: [
    "My imagination is a portal to infinite possibilities.",
    "I trust my intuition. It speaks the language of my soul.",
    "My compassion heals. I am a vessel of unconditional love.",
    "I honor my sensitivity as the source of my creative genius.",
    "I set healthy boundaries while keeping my heart open.",
    "My dreams are messages from the universe. I listen with reverence.",
    "I flow with life's currents, trusting they lead me where I need to be.",
    "My spiritual depth connects me to something greater than myself.",
  ],
};

// ── Mantras (universal, selected by seed) ──

const MANTRAS: string[] = [
  "I am aligned with my highest self.",
  "The universe conspires in my favor.",
  "I release resistance and welcome flow.",
  "I am exactly where I need to be.",
  "My energy attracts my destiny.",
  "I trust the wisdom of my body and soul.",
  "I am open to receiving all that is meant for me.",
  "I honor my journey and celebrate my growth.",
  "I breathe in peace, I breathe out fear.",
  "My light is needed in this world.",
  "I choose love over fear in every moment.",
  "I am a magnet for miracles.",
  "I surrender what I cannot control.",
  "My heart knows the way. I follow it.",
  "I am worthy of my wildest dreams.",
  "Every cell in my body vibrates with positive energy.",
];

// ── Cosmic themes (cycled daily) ──

const COSMIC_THEMES: string[] = [
  "Transformation & Rebirth",
  "Abundance & Gratitude",
  "Inner Wisdom & Intuition",
  "Creative Expression",
  "Emotional Healing",
  "Courage & New Beginnings",
  "Connection & Community",
  "Self-Discovery",
  "Surrender & Trust",
  "Manifestation & Intent",
  "Boundaries & Self-Care",
  "Joy & Playfulness",
  "Patience & Perseverance",
  "Authenticity & Truth",
];

// ── Element mapping ──

const SIGN_ELEMENTS: Record<ZodiacSign, "fire" | "earth" | "air" | "water"> = {
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

// ── Chakra associations by element ──

const ELEMENT_CHAKRAS: Record<string, string[]> = {
  fire: ["Solar Plexus", "Sacral", "Crown"],
  earth: ["Root", "Heart", "Solar Plexus"],
  air: ["Throat", "Third Eye", "Heart"],
  water: ["Sacral", "Heart", "Crown"],
};

// ── Colors by element ──

const ELEMENT_COLORS: Record<string, string[]> = {
  fire: ["Crimson Red", "Burnt Orange", "Golden Yellow", "Amber", "Coral"],
  earth: ["Forest Green", "Terracotta", "Warm Brown", "Sage", "Olive"],
  air: ["Sky Blue", "Lavender", "Silver", "Pale Yellow", "Mint"],
  water: ["Ocean Blue", "Teal", "Moonstone White", "Sea Green", "Indigo"],
};

// ── Crystals by element ──

const ELEMENT_CRYSTALS: Record<string, string[]> = {
  fire: [
    "Carnelian",
    "Citrine",
    "Sunstone",
    "Red Jasper",
    "Tiger's Eye",
    "Garnet",
  ],
  earth: [
    "Smoky Quartz",
    "Moss Agate",
    "Black Tourmaline",
    "Malachite",
    "Peridot",
    "Jade",
  ],
  air: [
    "Amethyst",
    "Clear Quartz",
    "Lapis Lazuli",
    "Aquamarine",
    "Fluorite",
    "Selenite",
  ],
  water: [
    "Moonstone",
    "Rose Quartz",
    "Labradorite",
    "Blue Lace Agate",
    "Pearl",
    "Opal",
  ],
};

// ── Journal prompts by sign element ──

const JOURNAL_PROMPTS: Record<string, string[]> = {
  fire: [
    "What lights me up inside, and how can I feed that flame today?",
    "Where in my life am I holding back my true power?",
    "What bold action have I been avoiding, and what would happen if I took it?",
    "How can I channel my passion into something meaningful this week?",
    "What does courage look like for me right now?",
    "When did I last feel truly alive? How can I recreate that feeling?",
  ],
  earth: [
    "What does stability mean to me, and where do I need more of it?",
    "What am I building right now that my future self will thank me for?",
    "How can I better honor my body's needs today?",
    "What simple pleasure have I been overlooking?",
    "Where can I practice more patience with myself?",
    "What does abundance look like in my daily life, beyond material things?",
  ],
  air: [
    "What idea has been circling my mind that deserves more attention?",
    "How can I communicate more authentically in my closest relationships?",
    "What new perspective could transform a current challenge?",
    "Where do I need more mental clarity, and what is clouding my thinking?",
    "What conversation have I been avoiding that could set me free?",
    "How can I balance my need for intellectual stimulation with emotional presence?",
  ],
  water: [
    "What emotion am I carrying that needs to be expressed or released?",
    "How can I better protect my energy while remaining open-hearted?",
    "What is my intuition trying to tell me right now?",
    "Where do I need to set a boundary to preserve my peace?",
    "What dream or vision keeps returning to me, and what does it mean?",
    "How can I nurture my inner world as much as my outer one?",
  ],
};

/**
 * Generate a daily affirmation for a zodiac sign.
 * Pure function - deterministic for the same date + sign combo.
 * No API calls, no cost.
 */
export function generateDailyAffirmation(
  sign: ZodiacSign,
  date?: Date,
): DailyAffirmation {
  const d = date || new Date();
  const dateStr = d.toISOString().split("T")[0];
  const seed = seedHash(dateStr, sign);

  const element = SIGN_ELEMENTS[sign];
  const affirmations = SIGN_AFFIRMATIONS[sign];

  return {
    affirmation: pick(affirmations, seed, 0),
    mantra: pick(MANTRAS, seed, 1),
    cosmicTheme: pick(COSMIC_THEMES, seed, 2),
    element,
    chakra: pick(ELEMENT_CHAKRAS[element], seed, 3),
    color: pick(ELEMENT_COLORS[element], seed, 4),
    crystal: pick(ELEMENT_CRYSTALS[element], seed, 5),
    journalPrompt: pick(JOURNAL_PROMPTS[element], seed, 6),
    date: dateStr,
    sign,
  };
}
