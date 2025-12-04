/**
 * Test utility for Gemini API
 * Run in browser console: window.testGemini("What sho")
 */

import { predictNextLettersGemini } from './geminiPredictor'

// Make it available globally for console testing
declare global {
  interface Window {
    testGemini: (text: string) => Promise<void>
    testGeminiRaw: (text: string) => Promise<void>
  }
}

// Test the full prediction flow
window.testGemini = async (text: string) => {
  console.log('🧪 Testing Gemini with:', text)
  console.log('📍 API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'SET ✅' : 'NOT SET ❌')
  
  try {
    const predictions = await predictNextLettersGemini(text)
    console.log('✅ SUCCESS! Predictions:', predictions)
    return
  } catch (error) {
    console.error('❌ FAILED:', error)
  }
}

// Test raw API call
window.testGeminiRaw = async (text: string) => {
  console.log('🧪 Testing RAW Gemini API call')
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent'
  
  if (!GEMINI_API_KEY) {
    console.error('❌ No API key found!')
    return
  }
  
  console.log('📍 API Key prefix:', GEMINI_API_KEY.slice(0, 10) + '...')
  console.log('📍 API URL:', GEMINI_API_URL)
  
  const prompt = `Given the text: "${text}", predict the next 4 most likely characters. Return JSON only: [{"letter":"U","confidence":0.9},{"letter":"W","confidence":0.5},{"letter":"P","confidence":0.3},{"letter":"M","confidence":0.2}]`
  
  try {
    console.log('📤 Sending request...')
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
          temperature: 0.3,
          maxOutputTokens: 100,
        }
      })
    })
    
    console.log('📥 Response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error response:', errorText)
      return
    }
    
    const data = await response.json()
    console.log('✅ SUCCESS! Response:', JSON.stringify(data, null, 2))
    
    const text_response = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    console.log('📝 Text:', text_response)
  } catch (error) {
    console.error('❌ Request failed:', error)
  }
}

console.log('✅ Gemini test utilities loaded!')
console.log('📝 Usage:')
console.log('  testGemini("What sho")     - Test full prediction flow')
console.log('  testGeminiRaw("What sho")  - Test raw API call')
