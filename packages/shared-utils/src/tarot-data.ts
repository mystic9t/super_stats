import { TarotCard } from '@vibes/shared-types';

// KV Store for Major Arcana cards
// Images from public domain Rider-Waite deck at sacred-texts.com
export const MAJOR_ARCANA_KV: Record<number, TarotCard> = {
    0: {
        id: 0,
        name: 'The Fool',
        shortName: 'ar00',
        uprightMeaning: 'New beginnings, innocence, spontaneity, free spirit, adventure, potential.',
        reversedMeaning: 'Recklessness, naivety, foolishness, risk-taking, carelessness.',
        description: 'A young man stands at the edge of a cliff, ready to step into the unknown with a small bag of possessions and a white rose.',
        imageUrl: '/tarot/00_the_fool.png'
    },
    1: {
        id: 1,
        name: 'The Magician',
        shortName: 'ar01',
        uprightMeaning: 'Manifestation, resourcefulness, power, inspired action, willpower.',
        reversedMeaning: 'Manipulation, poor planning, untapped talents, deception.',
        description: 'A figure stands with one hand pointing to the sky and the other to the earth, with all four suit symbols before him.',
        imageUrl: '/tarot/01_the_magician.png'
    },
    2: {
        id: 2,
        name: 'The High Priestess',
        shortName: 'ar02',
        uprightMeaning: 'Intuition, sacred knowledge, divine feminine, the subconscious mind.',
        reversedMeaning: 'Secrets, disconnected from intuition, withdrawal, silence.',
        description: 'A serene woman sits between two pillars, holding a scroll of esoteric wisdom.',
        imageUrl: '/tarot/02_the_high_priestess.png'
    },
    3: {
        id: 3,
        name: 'The Empress',
        shortName: 'ar03',
        uprightMeaning: 'Femininity, beauty, nature, nurturing, abundance, fertility.',
        reversedMeaning: 'Creative block, dependence on others, emptiness, lack of growth.',
        description: 'A regal woman surrounded by lush nature, symbolizing mother earth and creation.',
        imageUrl: '/tarot/03_the_empress.png'
    },
    4: {
        id: 4,
        name: 'The Emperor',
        shortName: 'ar04',
        uprightMeaning: 'Authority, structure, control, fatherhood, stability, leadership.',
        reversedMeaning: 'Tyranny, rigidity, coldness, domination, excessive control.',
        description: 'A powerful ruler sits on a throne adorned with ram heads, symbolizing authority and structure.',
        imageUrl: '/tarot/04_the_emperor.png'
    },
    5: {
        id: 5,
        name: 'The Hierophant',
        shortName: 'ar05',
        uprightMeaning: 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions.',
        reversedMeaning: 'Personal beliefs, freedom, challenging the status quo, rebellion.',
        description: 'A religious figure sits between two pillars, blessing two followers before him.',
        imageUrl: '/tarot/05_the_hierophant.png'
    },
    6: {
        id: 6,
        name: 'The Lovers',
        shortName: 'ar06',
        uprightMeaning: 'Love, harmony, relationships, values alignment, choices, union.',
        reversedMeaning: 'Self-love, disharmony, imbalance, misalignment of values.',
        description: 'Two figures stand beneath an angel, representing divine love and conscious connections.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg'
    },
    7: {
        id: 7,
        name: 'The Chariot',
        shortName: 'ar07',
        uprightMeaning: 'Control, willpower, success, action, determination, victory.',
        reversedMeaning: 'Self-discipline, opposition, lack of direction, aggression.',
        description: 'A warrior rides a chariot pulled by two sphinxes, representing triumph through willpower.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg'
    },
    8: {
        id: 8,
        name: 'Strength',
        shortName: 'ar08',
        uprightMeaning: 'Courage, patience, control, compassion, inner strength, bravery.',
        reversedMeaning: 'Self-doubt, weakness, insecurity, low energy, raw emotion.',
        description: 'A woman gently closes a lion\'s mouth, showing strength through compassion.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg'
    },
    9: {
        id: 9,
        name: 'The Hermit',
        shortName: 'ar09',
        uprightMeaning: 'Soul-searching, introspection, inner guidance, solitude, contemplation.',
        reversedMeaning: 'Isolation, loneliness, withdrawal, rejection of guidance.',
        description: 'An old man stands alone on a mountain peak, holding a lantern of wisdom.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg'
    },
    10: {
        id: 10,
        name: 'Wheel of Fortune',
        shortName: 'ar10',
        uprightMeaning: 'Good luck, karma, life cycles, destiny, turning point, change.',
        reversedMeaning: 'Bad luck, resistance to change, breaking cycles, unwelcome change.',
        description: 'A great wheel turns with mystical creatures, representing the cycles of fate.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg'
    },
    11: {
        id: 11,
        name: 'Justice',
        shortName: 'ar11',
        uprightMeaning: 'Justice, fairness, truth, cause and effect, law, balance.',
        reversedMeaning: 'Unfairness, lack of accountability, dishonesty, injustice.',
        description: 'A figure sits holding scales and a sword, representing impartial judgment.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg'
    },
    12: {
        id: 12,
        name: 'The Hanged Man',
        shortName: 'ar12',
        uprightMeaning: 'Pause, surrender, letting go, new perspectives, sacrifice.',
        reversedMeaning: 'Delays, resistance, stalling, indecision, needless sacrifice.',
        description: 'A man hangs upside down from a tree, serene in his suspension, gaining new perspective.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg'
    },
    13: {
        id: 13,
        name: 'Death',
        shortName: 'ar13',
        uprightMeaning: 'Endings, change, transformation, transition, letting go.',
        reversedMeaning: 'Resistance to change, personal transformation, inner purging.',
        description: 'A skeleton in armor rides a white horse, representing inevitable transformation.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg'
    },
    14: {
        id: 14,
        name: 'Temperance',
        shortName: 'ar14',
        uprightMeaning: 'Balance, moderation, patience, purpose, meaning, middle path.',
        reversedMeaning: 'Imbalance, excess, self-healing, realignment needed.',
        description: 'An angel pours water between two cups, representing the flow of life and balance.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg'
    },
    15: {
        id: 15,
        name: 'The Devil',
        shortName: 'ar15',
        uprightMeaning: 'Shadow self, attachment, addiction, restriction, sexuality.',
        reversedMeaning: 'Releasing limiting beliefs, exploring dark thoughts, detachment.',
        description: 'A horned figure presides over two chained figures, representing bondage to material.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg'
    },
    16: {
        id: 16,
        name: 'The Tower',
        shortName: 'ar16',
        uprightMeaning: 'Sudden change, upheaval, chaos, revelation, awakening.',
        reversedMeaning: 'Personal transformation, fear of change, averting disaster.',
        description: 'A tower is struck by lightning with figures falling, representing sudden upheaval.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg'
    },
    17: {
        id: 17,
        name: 'The Star',
        shortName: 'ar17',
        uprightMeaning: 'Hope, faith, purpose, renewal, spirituality, inspiration.',
        reversedMeaning: 'Lack of faith, despair, self-trust, disconnection.',
        description: 'A naked woman kneels by water under stars, pouring water onto land and pool.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg'
    },
    18: {
        id: 18,
        name: 'The Moon',
        shortName: 'ar18',
        uprightMeaning: 'Illusion, fear, anxiety, subconscious, intuition, dreams.',
        reversedMeaning: 'Release of fear, repressed emotion, inner confusion clearing.',
        description: 'A moon shines over a path between two towers, with a dog and wolf howling.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg'
    },
    19: {
        id: 19,
        name: 'The Sun',
        shortName: 'ar19',
        uprightMeaning: 'Positivity, fun, warmth, success, vitality, joy, confidence.',
        reversedMeaning: 'Inner child, feeling down, overly optimistic, temporary depression.',
        description: 'A child rides a white horse under a bright sun, radiating pure joy.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg'
    },
    20: {
        id: 20,
        name: 'Judgement',
        shortName: 'ar20',
        uprightMeaning: 'Judgement, rebirth, inner calling, absolution, reflection.',
        reversedMeaning: 'Self-doubt, inner critic, ignoring the call, lack of self-awareness.',
        description: 'An angel blows a trumpet as figures rise from graves, representing spiritual awakening.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg'
    },
    21: {
        id: 21,
        name: 'The World',
        shortName: 'ar21',
        uprightMeaning: 'Completion, integration, accomplishment, travel, fulfillment.',
        reversedMeaning: 'Seeking personal closure, short-cuts, delays, lack of completion.',
        description: 'A dancing figure in a wreath surrounded by four creatures, representing wholeness.',
        imageUrl: 'https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg'
    }
};

// Position descriptions for the 3-card spread
export const POSITION_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
    situation: {
        title: 'Situation',
        description: 'Your current circumstances and the energy surrounding you right now.'
    },
    challenge: {
        title: 'Challenge',
        description: 'The obstacle or energy you need to overcome or work with.'
    },
    outcome: {
        title: 'Outcome',
        description: 'The potential resolution or direction things are heading.'
    }
};

// Get a card by ID from the KV store
export const getCardById = (id: number): TarotCard | undefined => {
    return MAJOR_ARCANA_KV[id];
};

// Get all Major Arcana card IDs
export const getAllCardIds = (): number[] => {
    return Object.keys(MAJOR_ARCANA_KV).map(Number);
};
