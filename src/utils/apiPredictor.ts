/**
 * API-based prediction using Gemini AI
 * Falls back to local prediction if API fails
 * Includes smart caching to avoid rate limits
 */

import { predictNextLetters as smartPredict } from './smartPredictor'
import { predictNextLettersGemini } from './geminiPredictor'

export interface Prediction {
  letter: string
  confidence: number
}

// Simple cache to reduce API calls
interface CacheEntry {
  predictions: Prediction[]
  timestamp: number
}

const predictionCache = new Map<string, CacheEntry>()
const CACHE_DURATION = 5000 // 5 seconds
const MAX_CACHE_SIZE = 50

// Rate limiting
let lastAPICall = 0
const MIN_API_INTERVAL = 150 // Minimum 150ms between API calls (max ~6.7 calls/sec = ~400/min << 15/min limit)

function getCacheKey(text: string): string {
  // Cache based on last 30 characters to balance cache hits and relevance
  return text.slice(-30)
}

function getCachedPredictions(text: string): Prediction[] | null {
  const key = getCacheKey(text)
  const cached = predictionCache.get(key)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached predictions')
    return cached.predictions
  }
  
  return null
}

function cachePredictions(text: string, predictions: Prediction[]) {
  const key = getCacheKey(text)
  
  // Simple cache size management
  if (predictionCache.size >= MAX_CACHE_SIZE) {
    const firstKey = predictionCache.keys().next().value
    if (firstKey) {
      predictionCache.delete(firstKey)
    }
  }
  
  predictionCache.set(key, {
    predictions,
    timestamp: Date.now()
  })
}

/**
 * Remove duplicate predictions (case-insensitive)
 */
function deduplicatePredictions(predictions: Prediction[]): Prediction[] {
  const seen = new Set<string>()
  return predictions.filter(p => {
    const normalized = p.letter.toUpperCase()
    if (seen.has(normalized)) {
      return false
    }
    seen.add(normalized)
    return true
  })
}

/**
 * Predicts next letters using Gemini API if available,
 * otherwise falls back to improved local prediction
 */
export async function predictNextLetters(
  currentText: string,
  useAPI: boolean = true
): Promise<Prediction[]> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
  
  console.log('🔍 [Predictor Debug]', {
    useAPI,
    hasApiKey: !!GEMINI_API_KEY,
    keyLength: GEMINI_API_KEY.length,
    currentText: currentText.slice(-20) // Last 20 chars
  })
  
  // Check cache first
  const cached = getCachedPredictions(currentText)
  if (cached) {
    return cached
  }
  
  // Use Gemini API (free, fast, accurate) with rate limiting
  if (useAPI && GEMINI_API_KEY && GEMINI_API_KEY !== '') {
    // Rate limiting: Check if enough time has passed since last API call
    const now = Date.now()
    const timeSinceLastCall = now - lastAPICall
    
    if (timeSinceLastCall < MIN_API_INTERVAL) {
      console.log(`⏱️  Rate limited, using local predictor (${MIN_API_INTERVAL - timeSinceLastCall}ms remaining)`)
      const localResult = deduplicatePredictions(smartPredict(currentText))
      cachePredictions(currentText, localResult)
      return localResult
    }
    
    try {
      console.log('🤖 Calling Gemini API...')
      lastAPICall = now
      const result = await predictNextLettersGemini(currentText)
      console.log('✅ Gemini returned:', result)
      
      // Deduplicate and cache the result
      const dedupedResult = deduplicatePredictions(result)
      cachePredictions(currentText, dedupedResult)
      return dedupedResult
    } catch (error) {
      console.warn('❌ Gemini API failed, using local smart predictor:', error)
      const localResult = deduplicatePredictions(smartPredict(currentText))
      cachePredictions(currentText, localResult)
      return localResult
    }
  }
  
  console.log('📍 Using local predictor (no API key or useAPI=false)')
  // Fallback to smart local prediction
  const localResult = deduplicatePredictions(smartPredict(currentText))
  cachePredictions(currentText, localResult)
  return localResult
}

// Export synchronous version for compatibility
export function predictNextLettersSync(currentText: string): Prediction[] {
  return deduplicatePredictions(smartPredict(currentText))
}
