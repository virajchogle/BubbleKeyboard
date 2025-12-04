/**
 * Gemini AI-powered prediction
 * Uses Google's Gemini API for smart next-letter prediction
 */

export interface Prediction {
  letter: string
  confidence: number
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
// Use Gemini 2.5 Flash-Lite - faster, no thinking mode (perfect for quick predictions)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent'

/**
 * Predict next letters using Gemini API
 */
export async function predictNextLettersGemini(currentText: string): Promise<Prediction[]> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === '') {
    console.error('❌ Gemini API key not configured')
    throw new Error('Gemini API key not configured')
  }

  console.log('🚀 Gemini API Request:', {
    text: currentText,
    apiKeyPrefix: GEMINI_API_KEY.slice(0, 10) + '...',
  })

  try {
    // Create a smart prompt for next character prediction
    const prompt = `You are a predictive text assistant. Given the text: "${currentText}"

Predict the 4 most likely next characters the user will type. Consider:
- Common English words and phrases
- Context from previous words
- Natural language patterns
- Grammar and sentence structure
- Spaces (use " " for space)
- Punctuation (periods, commas, question marks, exclamation marks, etc.)

Return characters as:
- Letters: uppercase (e.g., "E", "T", "A")
- Space: " " (single space character)
- Punctuation: ".", ",", "!", "?", etc.

Respond ONLY with a JSON array of 4 objects, each with "letter" (single character) and "confidence" (0-1). Examples:
[{"letter":"E","confidence":0.8},{"letter":"T","confidence":0.6},{"letter":" ","confidence":0.5},{"letter":"A","confidence":0.4}]
[{"letter":" ","confidence":0.9},{"letter":".","confidence":0.7},{"letter":"T","confidence":0.3},{"letter":"A","confidence":0.2}]

JSON only, no explanation:`

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3, // Lower temperature for more predictable results
          maxOutputTokens: 100,
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Gemini API HTTP Error:', response.status, errorText)
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('📥 Gemini Raw Response:', JSON.stringify(data, null, 2))
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    console.log('📝 Gemini Text Response:', text)
    
    // Parse JSON response
    const jsonMatch = text.match(/\[.*\]/s)
    if (jsonMatch) {
      const predictions = JSON.parse(jsonMatch[0])
      console.log('✨ Parsed Predictions:', predictions)
      
      // Validate and normalize
      const normalized = predictions
        .filter((p: any) => p.letter && typeof p.confidence === 'number')
        .map((p: any) => ({
          // Only uppercase if it's a letter, not space or punctuation
          letter: /[a-zA-Z]/.test(p.letter) ? p.letter.toUpperCase() : p.letter,
          confidence: Math.max(0, Math.min(1, p.confidence))
        }))
        .slice(0, 4)
      
      console.log('✅ Final Predictions:', normalized)
      return normalized
    }

    console.error('❌ Could not find JSON in response:', text)
    throw new Error('Could not parse Gemini response')
  } catch (error) {
    console.error('Gemini prediction error:', error)
    throw error
  }
}

/**
 * Predict next word using Gemini (for more advanced features)
 */
export async function predictNextWordGemini(currentText: string): Promise<string[]> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === '') {
    throw new Error('Gemini API key not configured')
  }

  try {
    const prompt = `Complete this text naturally with 3 possible next words. Text: "${currentText}"

Respond ONLY with a JSON array of 3 strings (lowercase words). Example: ["quick","brown","the"]

JSON only, no explanation:`

    const WORD_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent'
    const response = await fetch(`${WORD_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 50,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    const jsonMatch = text.match(/\[.*\]/s)
    if (jsonMatch) {
      const words = JSON.parse(jsonMatch[0])
      return words.filter((w: any) => typeof w === 'string').slice(0, 3)
    }

    throw new Error('Could not parse Gemini response')
  } catch (error) {
    console.error('Gemini word prediction error:', error)
    throw error
  }
}
