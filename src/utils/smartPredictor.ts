/**
 * Smart Prediction Engine with Context Awareness
 * Uses n-grams, word context, and learning
 */

export interface Prediction {
  letter: string
  confidence: number
  reason?: string
}

// Common trigrams (3-letter sequences) in English with frequencies
const TRIGRAMS: Record<string, Record<string, number>> = {
  'TH': { 'E': 0.85, 'I': 0.05, 'A': 0.04, 'O': 0.03, 'R': 0.02 },
  'HE': { 'R': 0.30, 'N': 0.20, ' ': 0.15, 'Y': 0.10, 'A': 0.10, 'L': 0.08, 'I': 0.05, 'S': 0.02 },
  'IN': { 'G': 0.40, 'E': 0.20, 'T': 0.15, ' ': 0.10, 'D': 0.08, 'K': 0.05, 'S': 0.02 },
  'ER': { 'E': 0.20, 'S': 0.18, ' ': 0.15, 'Y': 0.12, 'I': 0.10, 'A': 0.08, 'N': 0.08, 'T': 0.05, 'R': 0.04 },
  'AN': { 'D': 0.30, 'T': 0.20, 'Y': 0.15, 'G': 0.10, 'C': 0.08, ' ': 0.08, 'S': 0.05, 'K': 0.04 },
  'RE': { 'D': 0.15, 'A': 0.15, 'S': 0.15, ' ': 0.12, 'N': 0.10, 'E': 0.10, 'M': 0.08, 'L': 0.08, 'T': 0.05, 'C': 0.02 },
  'ED': { ' ': 0.70, 'I': 0.10, 'N': 0.05, 'U': 0.05, 'A': 0.05, 'W': 0.03, 'S': 0.02 },
  'ON': { 'E': 0.20, ' ': 0.18, 'G': 0.15, 'S': 0.12, 'T': 0.10, 'A': 0.08, 'C': 0.05, 'D': 0.05, 'I': 0.05, 'L': 0.02 },
  'ND': { ' ': 0.50, 'E': 0.15, 'I': 0.10, 'A': 0.08, 'S': 0.07, 'O': 0.05, 'R': 0.03, 'L': 0.02 },
  'HA': { 'T': 0.30, 'V': 0.20, 'N': 0.15, 'D': 0.10, 'S': 0.10, 'L': 0.08, 'R': 0.05, 'P': 0.02 },
  'SH': { 'O': 0.30, 'E': 0.25, 'I': 0.15, 'A': 0.12, ' ': 0.10, 'U': 0.05, 'Y': 0.02, 'T': 0.01 },
  'HO': { 'U': 0.35, 'W': 0.20, 'P': 0.15, 'M': 0.10, 'T': 0.08, 'R': 0.07, 'N': 0.03, 'L': 0.02 },
  'EN': { 'T': 0.25, 'D': 0.20, ' ': 0.15, 'C': 0.12, 'G': 0.10, 'S': 0.08, 'E': 0.05, 'A': 0.03, 'I': 0.02 },
  'AT': { 'E': 0.25, 'I': 0.20, ' ': 0.18, 'H': 0.12, 'T': 0.10, 'O': 0.08, 'S': 0.05, 'C': 0.02 },
  'OR': { 'E': 0.25, 'Y': 0.20, ' ': 0.15, 'D': 0.12, 'K': 0.10, 'M': 0.08, 'T': 0.05, 'I': 0.03, 'S': 0.02 },
  'TE': { 'D': 0.25, 'R': 0.20, ' ': 0.15, 'N': 0.12, 'M': 0.10, 'S': 0.08, 'A': 0.05, 'L': 0.03, 'X': 0.02 },
  'IS': { ' ': 0.40, 'T': 0.20, 'E': 0.15, 'H': 0.10, 'S': 0.08, 'I': 0.05, 'O': 0.02 },
  'IT': { ' ': 0.35, 'H': 0.20, 'Y': 0.15, 'I': 0.10, 'E': 0.08, 'S': 0.07, 'T': 0.03, 'A': 0.02 },
  'AR': { 'E': 0.30, 'Y': 0.20, 'T': 0.15, 'D': 0.12, ' ': 0.10, 'K': 0.05, 'I': 0.05, 'S': 0.03 },
  'OU': { 'T': 0.30, 'R': 0.20, 'L': 0.15, 'N': 0.12, 'G': 0.10, 'S': 0.08, 'P': 0.03, 'D': 0.02 },
  'AL': { 'L': 0.40, ' ': 0.20, 'E': 0.15, 'I': 0.10, 'S': 0.08, 'K': 0.05, 'T': 0.02 },
  'LE': { ' ': 0.30, 'D': 0.20, 'S': 0.15, 'R': 0.12, 'A': 0.10, 'T': 0.08, 'N': 0.03, 'C': 0.02 },
  'SE': { ' ': 0.30, 'S': 0.20, 'D': 0.15, 'R': 0.12, 'N': 0.10, 'L': 0.08, 'E': 0.03, 'A': 0.02 },
  'IO': { 'N': 0.90, 'U': 0.05, 'S': 0.03, 'R': 0.02 },
  'ST': { ' ': 0.25, 'E': 0.20, 'A': 0.15, 'R': 0.12, 'O': 0.10, 'I': 0.08, 'U': 0.05, 'H': 0.03, 'Y': 0.02 },
  'TO': { ' ': 0.40, 'N': 0.15, 'R': 0.12, 'P': 0.10, 'W': 0.08, 'O': 0.07, 'M': 0.05, 'T': 0.02, 'L': 0.01 },
  'NT': { ' ': 0.35, 'E': 0.20, 'I': 0.15, 'S': 0.12, 'A': 0.08, 'R': 0.05, 'O': 0.03, 'H': 0.02 },
  'NG': { ' ': 0.50, 'E': 0.15, 'S': 0.12, 'L': 0.10, 'T': 0.08, 'I': 0.03, 'A': 0.02 },
  'VE': { ' ': 0.35, 'R': 0.30, 'D': 0.15, 'N': 0.10, 'S': 0.08, 'L': 0.02 },
  'CO': { 'N': 0.30, 'M': 0.25, 'U': 0.15, 'L': 0.10, 'R': 0.08, 'V': 0.07, 'O': 0.03, 'S': 0.02 },
  'LY': { ' ': 0.95, 'I': 0.03, 'N': 0.02 },
  'DE': { ' ': 0.25, 'R': 0.20, 'D': 0.15, 'N': 0.12, 'S': 0.10, 'A': 0.08, 'T': 0.05, 'C': 0.03, 'L': 0.02 },
  'RA': { 'N': 0.25, 'T': 0.20, 'L': 0.15, 'I': 0.12, 'C': 0.10, 'D': 0.08, 'M': 0.05, 'Y': 0.03, 'G': 0.02 },
  'ME': { ' ': 0.30, 'N': 0.25, 'R': 0.15, 'S': 0.12, 'D': 0.08, 'A': 0.05, 'T': 0.03, 'L': 0.02 },
  'RI': { 'N': 0.25, 'T': 0.20, 'C': 0.15, 'G': 0.12, 'S': 0.10, 'E': 0.08, 'A': 0.05, 'O': 0.03, 'D': 0.02 },
  'IC': { 'E': 0.25, 'A': 0.20, 'H': 0.15, 'K': 0.12, ' ': 0.10, 'T': 0.08, 'I': 0.05, 'S': 0.03, 'O': 0.02 },
  'WH': { 'A': 0.30, 'O': 0.25, 'E': 0.20, 'I': 0.15, 'Y': 0.08, 'R': 0.02 },
  'WA': { 'S': 0.30, 'T': 0.25, 'N': 0.15, 'Y': 0.12, 'R': 0.08, 'L': 0.05, 'K': 0.03, 'I': 0.02 },
  'CH': { 'E': 0.30, 'A': 0.20, 'I': 0.15, 'O': 0.12, ' ': 0.10, 'R': 0.08, 'T': 0.03, 'U': 0.02 },
  'TI': { 'O': 0.40, 'N': 0.20, 'M': 0.15, 'C': 0.10, 'V': 0.08, 'E': 0.05, 'T': 0.02 },
  'PH': { 'O': 0.40, 'Y': 0.25, 'E': 0.15, 'A': 0.10, 'I': 0.08, 'R': 0.02 },
  'GH': { 'T': 0.60, ' ': 0.20, 'E': 0.10, 'O': 0.05, 'A': 0.03, 'I': 0.02 },
  'CK': { ' ': 0.50, 'E': 0.20, 'S': 0.12, 'I': 0.08, 'A': 0.05, 'L': 0.03, 'Y': 0.02 },
  'LI': { 'N': 0.25, 'K': 0.20, 'T': 0.15, 'E': 0.12, 'G': 0.10, 'C': 0.08, 'F': 0.05, 'S': 0.03, 'V': 0.02 },
  'QU': { 'E': 0.50, 'I': 0.30, 'A': 0.10, 'O': 0.08, 'R': 0.02 },
}

// Common word transitions (what word typically follows what)
const WORD_TRANSITIONS: Record<string, string[]> = {
  'the': ['quick', 'best', 'most', 'first', 'second', 'only', 'same', 'other', 'next', 'new'],
  'quick': ['brown', 'and', 'response', 'way', 'answer', 'fix', 'solution'],
  'brown': ['fox', 'bear', 'dog', 'eyes', 'hair', 'color'],
  'fox': ['jumps', 'runs', 'is', 'and', 'was'],
  'jumps': ['over', 'on', 'to', 'up', 'down', 'into', 'off'],
  'over': ['the', 'to', 'there', 'here', 'and', 'again', 'time'],
  'lazy': ['dog', 'person', 'day', 'weekend', 'afternoon', 'cat'],
  'dog': ['is', 'was', 'barks', 'runs', 'eats', 'sleeps', 'plays', 'loves'],
  'i': ['am', 'was', 'have', 'had', 'will', 'can', 'would', 'think', 'know', 'love'],
  'am': ['a', 'not', 'here', 'going', 'happy', 'glad', 'sorry', 'sure'],
  'is': ['a', 'not', 'the', 'it', 'this', 'that', 'very', 'so', 'good'],
  'are': ['you', 'we', 'they', 'not', 'the', 'a', 'very', 'so'],
  'you': ['are', 'can', 'have', 'will', 'know', 'see', 'want', 'need'],
  'can': ['be', 'see', 'do', 'make', 'help', 'you', 'i', 'we'],
  'have': ['a', 'to', 'been', 'you', 'no', 'some', 'any', 'more'],
  'will': ['be', 'not', 'have', 'you', 'i', 'we', 'they'],
  'would': ['be', 'like', 'have', 'you', 'not', 'it'],
  'should': ['be', 'not', 'have', 'you', 'i', 'we'],
  'this': ['is', 'was', 'will', 'can', 'could', 'has', 'looks'],
  'that': ['is', 'was', 'will', 'would', 'looks', 'seems'],
  'to': ['be', 'the', 'do', 'make', 'see', 'get', 'have', 'go', 'use'],
  'of': ['the', 'a', 'course', 'all', 'them', 'us', 'it'],
  'in': ['the', 'a', 'order', 'this', 'that', 'my', 'our'],
  'for': ['the', 'a', 'you', 'me', 'them', 'us', 'this'],
  'on': ['the', 'a', 'this', 'that', 'it', 'top'],
  'with': ['the', 'a', 'you', 'me', 'them', 'us', 'this'],
  'at': ['the', 'a', 'this', 'that', 'least', 'most'],
}

// User typing history for adaptation
class TypingHistory {
  private recentWords: string[] = []
  private wordFrequency: Map<string, number> = new Map()
  private bigramFrequency: Map<string, number> = new Map()

  addWord(word: string) {
    word = word.toLowerCase().trim()
    if (!word) return

    // Add to recent words
    this.recentWords.push(word)
    if (this.recentWords.length > 50) {
      this.recentWords.shift()
    }

    // Update word frequency
    this.wordFrequency.set(word, (this.wordFrequency.get(word) || 0) + 1)
  }

  addBigram(word1: string, word2: string) {
    const bigram = `${word1.toLowerCase()} ${word2.toLowerCase()}`
    this.bigramFrequency.set(bigram, (this.bigramFrequency.get(bigram) || 0) + 1)
  }

  getWordFrequency(word: string): number {
    return this.wordFrequency.get(word.toLowerCase()) || 0
  }

  getRecentWords(): string[] {
    return this.recentWords.slice(-10)
  }

  isRecentWord(word: string): boolean {
    return this.recentWords.slice(-10).includes(word.toLowerCase())
  }
}

const typingHistory = new TypingHistory()

/**
 * Get words from text and update history
 */
function getWords(text: string): string[] {
  const words = text.trim().toLowerCase().split(/\s+/).filter(w => w.length > 0)
  
  // Update history
  if (words.length > 0) {
    typingHistory.addWord(words[words.length - 1])
  }
  if (words.length > 1) {
    typingHistory.addBigram(words[words.length - 2], words[words.length - 1])
  }
  
  return words
}

/**
 * Get current incomplete word
 */
function getCurrentWord(text: string): string {
  const words = text.split(/\s+/)
  const lastWord = words[words.length - 1] || ''
  return lastWord.toUpperCase()
}

/**
 * Get previous complete word
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPreviousWord(text: string): string {
  const words = text.trim().toLowerCase().split(/\s+/)
  return words.length > 1 ? words[words.length - 2] : ''
}

/**
 * Predict next letter after space (start of new word)
 */
function predictWordStart(text: string): Prediction[] {
  const words = getWords(text)
  const prevWord = words[words.length - 1] || ''
  
  // Check word transitions for context-aware predictions
  if (prevWord && WORD_TRANSITIONS[prevWord]) {
    const nextWords = WORD_TRANSITIONS[prevWord]
    const letterCounts = new Map<string, number>()
    
    nextWords.forEach(word => {
      const firstLetter = word[0].toUpperCase()
      letterCounts.set(firstLetter, (letterCounts.get(firstLetter) || 0) + 1)
    })
    
    const predictions = Array.from(letterCounts.entries())
      .map(([letter, count]) => ({
        letter,
        confidence: count / nextWords.length,
        reason: `After "${prevWord}"`
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 4)
    
    if (predictions.length > 0) {
      return predictions
    }
  }
  
  // Fallback: most common word starting letters
  return [
    { letter: 'T', confidence: 0.16, reason: 'Common start' },
    { letter: 'A', confidence: 0.12, reason: 'Common start' },
    { letter: 'I', confidence: 0.10, reason: 'Common start' },
    { letter: 'W', confidence: 0.09, reason: 'Common start' },
  ]
}

/**
 * Predict next letter within a word
 */
function predictNextInWord(currentWord: string): Prediction[] {
  const len = currentWord.length
  const predictions: Prediction[] = []
  
  if (len >= 2) {
    // Use trigram model
    const lastTwo = currentWord.slice(-2)
    if (TRIGRAMS[lastTwo]) {
      const trigramPreds = Object.entries(TRIGRAMS[lastTwo])
        .map(([letter, prob]) => ({
          letter: letter === ' ' ? ' ' : letter,
          confidence: prob,
          reason: `After "${lastTwo}"`
        }))
        .sort((a, b) => b.confidence - a.confidence)
      
      // Include space prediction if it exists in trigrams
      const spacePred = trigramPreds.find(p => p.letter === ' ')
      const letterPreds = trigramPreds.filter(p => p.letter !== ' ')
      
      // If there's a space prediction (word might be ending), include it
      if (spacePred && spacePred.confidence > 0.15) {
        predictions.push(spacePred)
      }
      
      // Add letter predictions
      predictions.push(...letterPreds.slice(0, 3))
      
      if (predictions.length > 0) {
        return predictions.slice(0, 4)
      }
    }
  }
  
  // Fallback: most common letters in English
  return [
    { letter: 'E', confidence: 0.13, reason: 'Most common' },
    { letter: 'T', confidence: 0.09, reason: 'Common' },
    { letter: 'A', confidence: 0.08, reason: 'Common' },
    { letter: 'O', confidence: 0.08, reason: 'Common' },
  ]
}

/**
 * Smart prediction combining multiple strategies
 */
export function predictNextLetters(currentText: string): Prediction[] {
  // Empty input
  if (!currentText || currentText.trim().length === 0) {
    return [
      { letter: 'T', confidence: 0.16, reason: 'Common start' },
      { letter: 'A', confidence: 0.12, reason: 'Common start' },
      { letter: 'I', confidence: 0.11, reason: 'Common start' },
      { letter: 'W', confidence: 0.09, reason: 'Common start' },
    ]
  }
  
  const lastChar = currentText.slice(-1)
  
  // After space or punctuation - predict word start
  if (lastChar === ' ' || /[.!?,;:]/.test(lastChar)) {
    return predictWordStart(currentText)
  }
  
  // Within a word - use trigram model
  const currentWord = getCurrentWord(currentText)
  return predictNextInWord(currentWord)
}

// Export for updating history externally
export function updateTypingHistory(word: string) {
  typingHistory.addWord(word)
}

export function getTypingStats() {
  return {
    recentWords: typingHistory.getRecentWords(),
  }
}
