import { TarotReading, UserProfile } from '@vibes/shared-types';
import { canDrawToday, performTarotDraw, getLastReading } from '@vibes/shared-utils';
import { ServiceResponse } from '@/types';

class TarotService {
  /**
   * Check if user can draw tarot cards today
   */
  canDrawToday(profile: UserProfile): boolean {
    return canDrawToday(profile);
  }

  /**
   * Perform a tarot draw for the user
   */
  drawTarotCards(profile: UserProfile): ServiceResponse<TarotReading> {
    try {
      if (!this.canDrawToday(profile)) {
        const reading = getLastReading(profile);
        if (reading) {
          return { success: true, data: reading };
        }
        return { success: false, error: 'Already drawn today. No previous reading found.' };
      }

      const reading = performTarotDraw(profile);
      if (!reading) {
        return { success: false, error: 'Failed to draw cards' };
      }

      return { success: true, data: reading };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to draw tarot cards';
      console.error('Tarot Service Error:', message);
      return { success: false, error: message };
    }
  }

  /**
   * Force a new tarot draw, overriding the 24-hour limit
   * Resets the timer for the next draw
   */
  forceRedrawTarotCards(profile: UserProfile): ServiceResponse<TarotReading> {
    try {
      // Force a new draw regardless of 24hr limit
      const reading = performTarotDraw(profile);
      if (!reading) {
        return { success: false, error: 'Failed to redraw cards' };
      }

      return { success: true, data: reading };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to redraw tarot cards';
      console.error('Tarot Service Error:', message);
      return { success: false, error: message };
    }
  }

  /**
   * Get last tarot reading for the user
   */
  getLastReading(profile: UserProfile): ServiceResponse<TarotReading> {
    try {
      const reading = getLastReading(profile);
      if (reading) {
        return { success: true, data: reading };
      }
      return { success: false, error: 'No previous reading found' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch reading';
      console.error('Tarot Service Error:', message);
      return { success: false, error: message };
    }
  }

  /**
   * Force refresh tarot reading - overrides 24hr limit and resets timer
   */
  refreshTarotCards(profile: UserProfile): ServiceResponse<TarotReading> {
    try {
      // Force a new draw regardless of time limit
      const reading = performTarotDraw(profile);
      if (!reading) {
        return { success: false, error: 'Failed to refresh tarot cards' };
      }

      return { success: true, data: reading };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh tarot cards';
      console.error('Tarot Service Error:', message);
      return { success: false, error: message };
    }
  }
}

export const tarotService = new TarotService();
