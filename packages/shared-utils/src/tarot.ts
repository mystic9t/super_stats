import { TarotCard, DrawnCard, TarotReading, TarotState, TarotPosition } from '@super-stats/shared-types';
import { MAJOR_ARCANA_KV, getAllCardIds, POSITION_DESCRIPTIONS } from './tarot-data';

const TAROT_STORAGE_KEY = 'super_stats_tarot';
const REVERSAL_CHANCE = 0.3; // 30% chance for a card to be reversed

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Draw 3 random cards from the Major Arcana with potential reversals
 */
export const drawThreeCards = (): [DrawnCard, DrawnCard, DrawnCard] => {
    const allIds = getAllCardIds();
    const shuffled = shuffleArray(allIds);
    const positions: TarotPosition[] = ['situation', 'challenge', 'outcome'];

    const drawnCards = shuffled.slice(0, 3).map((cardId, index) => {
        const card = MAJOR_ARCANA_KV[cardId];
        const isReversed = Math.random() < REVERSAL_CHANCE;
        return {
            card,
            position: positions[index],
            isReversed
        } as DrawnCard;
    });

    return drawnCards as [DrawnCard, DrawnCard, DrawnCard];
};

/**
 * Generate a combined narrative summary for the reading
 */
export const generateReadingSummary = (cards: [DrawnCard, DrawnCard, DrawnCard]): string => {
    const [situation, challenge, outcome] = cards;

    const situationMeaning = situation.isReversed
        ? situation.card.reversedMeaning
        : situation.card.uprightMeaning;

    const challengeMeaning = challenge.isReversed
        ? challenge.card.reversedMeaning
        : challenge.card.uprightMeaning;

    const outcomeMeaning = outcome.isReversed
        ? outcome.card.reversedMeaning
        : outcome.card.uprightMeaning;

    // Helper to format card name (avoid "The The Moon" - just use name as-is)
    const formatCardName = (name: string) => name;

    // Generate narrative based on the cards
    const situationIntro = situation.isReversed
        ? `Your current situation is marked by ${formatCardName(situation.card.name)} reversed, suggesting ${situationMeaning.toLowerCase()}`
        : `Your current situation is illuminated by ${formatCardName(situation.card.name)}, bringing ${situationMeaning.toLowerCase()}`;

    const challengeTransition = challenge.isReversed
        ? `However, ${formatCardName(challenge.card.name)} reversed appears as your challenge, indicating ${challengeMeaning.toLowerCase()}`
        : `${formatCardName(challenge.card.name)} emerges as your challenge, asking you to work with ${challengeMeaning.toLowerCase()}`;

    const outcomeConclusion = outcome.isReversed
        ? `Looking ahead, ${formatCardName(outcome.card.name)} reversed suggests the path leads toward ${outcomeMeaning.toLowerCase()}. Reflect on what needs adjustment.`
        : `${formatCardName(outcome.card.name)} shines as your potential outcome, promising ${outcomeMeaning.toLowerCase()}. Stay true to your path.`;

    return `${situationIntro}. ${challengeTransition}. ${outcomeConclusion}`;
};

import { UserProfile } from '@super-stats/shared-types';

/**
 * Generate a unique storage key for the user
 */
const getUserKey = (profile: UserProfile): string => {
    const dob = new Date(profile.dateOfBirth).toISOString().split('T')[0];
    const safeName = profile.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${TAROT_STORAGE_KEY}_${safeName}_${dob}`;
};

/**
 * Create a full tarot reading
 */
export const createTarotReading = (): TarotReading => {
    const cards = drawThreeCards();
    const summary = generateReadingSummary(cards);
    const date = getTodayDate();

    return {
        cards,
        date,
        summary
    };
};

/**
 * Get the tarot state for a specific user from localStorage
 */
export const getTarotState = (profile: UserProfile): TarotState => {
    if (typeof window === 'undefined') {
        return { lastReading: null, lastDrawDate: null };
    }

    try {
        const key = getUserKey(profile);
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error reading tarot state:', error);
    }

    return { lastReading: null, lastDrawDate: null };
};

/**
 * Save the tarot state for a specific user to localStorage
 */
export const saveTarotState = (state: TarotState, profile: UserProfile): void => {
    if (typeof window === 'undefined') return;

    try {
        const key = getUserKey(profile);
        localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving tarot state:', error);
    }
};

/**
 * Check if the user can draw cards today
 */
export const canDrawToday = (profile: UserProfile): boolean => {
    const state = getTarotState(profile);
    if (!state.lastDrawDate) return true;

    const today = getTodayDate();
    return state.lastDrawDate !== today;
};

/**
 * Perform a tarot draw if allowed, and save the result
 */
export const performTarotDraw = (profile: UserProfile): TarotReading | null => {
    if (!canDrawToday(profile)) {
        return null;
    }

    const reading = createTarotReading();
    const state: TarotState = {
        lastReading: reading,
        lastDrawDate: reading.date
    };

    saveTarotState(state, profile);
    return reading;
};

/**
 * Get the last reading from storage for a specific user
 */
export const getLastReading = (profile: UserProfile): TarotReading | null => {
    const state = getTarotState(profile);
    return state.lastReading;
};

/**
 * Get position description for display
 */
export const getPositionDescription = (position: TarotPosition) => {
    return POSITION_DESCRIPTIONS[position];
};

/**
 * Clear tarot state for a specific user (for testing)
 */
export const clearTarotState = (profile: UserProfile): void => {
    if (typeof window === 'undefined') return;
    const key = getUserKey(profile);
    localStorage.removeItem(key);
};
