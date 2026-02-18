# TBD - Features That Would Cost Money

Features that require paid APIs or services. Keeping track for when budget allows.

## Geocoding for Birth Location

- **What:** Convert birth location text (e.g., "London, UK") to latitude/longitude coordinates for accurate birth chart house calculations
- **Why:** Currently the birth location field is stored as text but never converted to coordinates. The birth chart API accepts lat/lng but they're never populated from the form.
- **Options:**
  - Google Maps Geocoding API (~$5 per 1000 requests)
  - Mapbox Geocoding (free tier: 100k requests/month)
  - OpenCage Geocoding ($50/month for 2500 req/day)
  - Nominatim (free, but rate-limited and less reliable)

## AI-Powered Horoscope Generation

- **What:** Use LLM APIs to generate personalized, high-quality horoscope text instead of template-based fallback
- **Options:**
  - OpenAI API
  - Anthropic Claude API
  - Google Gemini API

## Push Notifications

- **What:** Daily horoscope push notifications
- **Options:**
  - Firebase Cloud Messaging (free tier available)
  - OneSignal

## Premium Tarot Artwork - User Response : The artwork we are currently using is custom

- **What:** Commission custom tarot card artwork instead of using public domain images
- **Cost:** $50-200 per card illustration (22 Major Arcana = $1100-4400)
