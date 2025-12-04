/**
 * Configuration for prediction system
 * Uses Gemini AI for smart predictions, falls back to local
 */

export type PredictionMode = 'local' | 'gemini' | 'hybrid'

export interface PredictorConfig {
  mode: PredictionMode
  useCache: boolean
  cacheSize: number
}

export const defaultConfig: PredictorConfig = {
  mode: 'gemini', // Uses Gemini API if key is set, otherwise local
  useCache: true,
  cacheSize: 1000,
}

/**
 * Prediction System:
 * 
 * 1. Gemini API (Recommended - FREE):
 *    - Fast and accurate
 *    - Context-aware predictions
 *    - 60 requests/min, 1500/day free
 *    - Get key at: https://aistudio.google.com/app/apikey
 * 
 * 2. Local Smart Predictor (Fallback):
 *    - Trigram-based predictions
 *    - No API calls needed
 *    - Good for privacy
 *    - Works offline
 * 
 * The system automatically uses Gemini if VITE_GEMINI_API_KEY is set,
 * otherwise falls back to local predictor.
 */
