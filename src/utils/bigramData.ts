// English bigram frequency data (top 200 most common)
// Frequencies are normalized percentages
export const bigramFrequencies: Record<string, number> = {
  'TH': 3.56, 'HE': 3.07, 'IN': 2.43, 'ER': 2.05, 'AN': 1.99,
  'RE': 1.85, 'ON': 1.76, 'AT': 1.49, 'EN': 1.45, 'ND': 1.35,
  'TI': 1.34, 'ES': 1.34, 'OR': 1.28, 'TE': 1.20, 'OF': 1.17,
  'ED': 1.17, 'IS': 1.13, 'IT': 1.12, 'AL': 1.09, 'AR': 1.07,
  'ST': 1.05, 'TO': 1.04, 'NT': 1.04, 'NG': 0.95, 'SE': 0.93,
  'HA': 0.93, 'AS': 0.87, 'OU': 0.87, 'IO': 0.83, 'LE': 0.83,
  'VE': 0.83, 'CO': 0.79, 'ME': 0.79, 'DE': 0.76, 'HI': 0.76,
  'RI': 0.73, 'RO': 0.73, 'IC': 0.70, 'NE': 0.69, 'EA': 0.69,
  'RA': 0.69, 'CE': 0.65, 'LI': 0.62, 'CH': 0.60, 'LL': 0.58,
  'BE': 0.58, 'MA': 0.57, 'SI': 0.55, 'OM': 0.55, 'UR': 0.54,
  'CA': 0.54, 'EL': 0.53, 'TA': 0.52, 'LA': 0.52, 'NS': 0.51,
  'DI': 0.50, 'FO': 0.50, 'HO': 0.50, 'PE': 0.49, 'EC': 0.49,
  'PR': 0.49, 'NO': 0.49, 'CT': 0.46, 'US': 0.46, 'AC': 0.45,
  'OT': 0.45, 'IL': 0.45, 'TR': 0.44, 'LY': 0.43, 'NC': 0.43,
  'ET': 0.42, 'UT': 0.42, 'SS': 0.41, 'SO': 0.41, 'RS': 0.40,
  'UN': 0.40, 'LO': 0.40, 'WA': 0.40, 'GE': 0.39, 'IE': 0.39,
  'WH': 0.38, 'EE': 0.38, 'WI': 0.38, 'EM': 0.38, 'AD': 0.37,
  'OL': 0.37, 'RT': 0.37, 'PO': 0.36, 'WE': 0.36, 'NA': 0.35,
  'UL': 0.35, 'NI': 0.35, 'TS': 0.34, 'MO': 0.34, 'OW': 0.34,
  'PA': 0.33, 'IM': 0.33, 'MI': 0.33, 'AI': 0.33, 'SH': 0.33,
  'IR': 0.32, 'SU': 0.32, 'ID': 0.31, 'OS': 0.31, 'IV': 0.31,
  'IA': 0.31, 'AM': 0.30, 'FI': 0.30, 'CI': 0.30, 'VI': 0.29,
  'PL': 0.29, 'IG': 0.28, 'TU': 0.28, 'EV': 0.28, 'LD': 0.28,
  'RY': 0.27, 'MP': 0.27, 'FE': 0.27, 'BL': 0.27, 'AB': 0.26,
  'GH': 0.26, 'TY': 0.26, 'OP': 0.26, 'WO': 0.25, 'SA': 0.25,
  'AY': 0.25, 'EX': 0.24, 'KE': 0.24, 'FR': 0.24, 'OO': 0.24,
  'AV': 0.23, 'AG': 0.23, 'IQ': 0.23, 'YE': 0.23, 'OB': 0.22,
  'FF': 0.22, 'PH': 0.22, 'EP': 0.22, 'TT': 0.21, 'KA': 0.21,
  'OC': 0.20, 'FA': 0.20, 'GO': 0.19,
}

// English trigram frequency data (top 100 most common)
export const trigramFrequencies: Record<string, number> = {
  'THE': 3.51, 'AND': 1.59, 'THA': 1.00, 'ENT': 0.42, 'ING': 0.42,
  'ION': 0.42, 'TIO': 0.36, 'FOR': 0.34, 'NDE': 0.33, 'HAS': 0.33,
  'NCE': 0.31, 'EDT': 0.31, 'TIS': 0.31, 'OFT': 0.30, 'STH': 0.30,
  'MEN': 0.28, 'TED': 0.27, 'ERE': 0.27, 'TER': 0.27, 'RES': 0.26,
  'CON': 0.26, 'NED': 0.25, 'VER': 0.25, 'ITH': 0.25, 'HIS': 0.24,
  'THI': 0.24, 'ALL': 0.23, 'HAT': 0.23, 'ATE': 0.22, 'HAD': 0.22,
  'HEN': 0.22, 'HER': 0.22, 'HIN': 0.21, 'ONE': 0.21, 'OUR': 0.21,
  'OUT': 0.20, 'DAY': 0.20, 'GET': 0.20, 'HIM': 0.20, 'ITS': 0.20,
  'MAY': 0.20, 'NEW': 0.20, 'NOW': 0.20, 'OLD': 0.20, 'SEE': 0.20,
  'TWO': 0.20, 'WAY': 0.20, 'WHO': 0.20, 'BOY': 0.19, 'DID': 0.19,
  'LET': 0.19, 'PUT': 0.19, 'SAY': 0.19, 'SHE': 0.19, 'TOO': 0.19,
  'USE': 0.19, 'MAN': 0.18,
}

export interface Prediction {
  letter: string
  confidence: number
}

/**
 * Predicts the next most likely letters based on the current text
 * Uses bigram and trigram frequency analysis
 * @deprecated Use wordPredictor.ts for better predictions
 */
export function predictNextLettersLegacy(currentText: string): Prediction[] {
  if (!currentText || currentText.trim().length === 0) {
    // Start of input - return most common starting letters
    return [
      { letter: 'T', confidence: 0.16 },
      { letter: 'A', confidence: 0.14 },
      { letter: 'I', confidence: 0.13 },
      { letter: 'S', confidence: 0.12 },
      { letter: 'O', confidence: 0.11 },
    ]
  }

  // Get last character (normalized to uppercase)
  const lastChar = currentText.trim().slice(-1).toUpperCase()
  
  // Handle space - start of new word
  if (lastChar === ' ' || lastChar === '') {
    return [
      { letter: 'T', confidence: 0.16 },
      { letter: 'A', confidence: 0.14 },
      { letter: 'I', confidence: 0.13 },
      { letter: 'S', confidence: 0.12 },
      { letter: 'O', confidence: 0.11 },
    ]
  }

  // Check if last character is a letter
  if (!/[A-Z]/.test(lastChar)) {
    // After punctuation or special char - treat as word start
    return [
      { letter: 'T', confidence: 0.16 },
      { letter: 'A', confidence: 0.14 },
      { letter: 'I', confidence: 0.13 },
      { letter: 'S', confidence: 0.12 },
      { letter: 'O', confidence: 0.11 },
    ]
  }

  // Try trigram first (last 2 characters)
  const lastTwo = currentText.trim().slice(-2).toUpperCase().replace(/[^A-Z]/g, '')
  const trigramPredictions: Prediction[] = []
  
  if (lastTwo.length === 2) {
    // Look for trigrams starting with lastTwo
    Object.entries(trigramFrequencies).forEach(([trigram, freq]) => {
      if (trigram.startsWith(lastTwo)) {
        const nextLetter = trigram[2]
        trigramPredictions.push({
          letter: nextLetter,
          confidence: freq * 1.5, // Boost trigram confidence
        })
      }
    })
  }

  // Get bigram predictions
  const bigramPredictions: Prediction[] = []
  Object.entries(bigramFrequencies).forEach(([bigram, freq]) => {
    if (bigram[0] === lastChar) {
      bigramPredictions.push({
        letter: bigram[1],
        confidence: freq,
      })
    }
  })

  // Combine and deduplicate predictions
  const predictionMap = new Map<string, number>()
  
  // Add trigram predictions (higher weight)
  trigramPredictions.forEach(pred => {
    const existing = predictionMap.get(pred.letter) || 0
    predictionMap.set(pred.letter, existing + pred.confidence)
  })
  
  // Add bigram predictions
  bigramPredictions.forEach(pred => {
    const existing = predictionMap.get(pred.letter) || 0
    predictionMap.set(pred.letter, existing + pred.confidence)
  })

  // Convert to array and sort by confidence
  let predictions: Prediction[] = Array.from(predictionMap.entries())
    .map(([letter, confidence]) => ({ letter, confidence }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5) // Top 5

  // If no predictions found, fall back to most common letters
  if (predictions.length === 0) {
    predictions = [
      { letter: 'E', confidence: 0.13 },
      { letter: 'T', confidence: 0.09 },
      { letter: 'A', confidence: 0.08 },
      { letter: 'O', confidence: 0.08 },
      { letter: 'I', confidence: 0.07 },
    ]
  }

  // Normalize confidence scores to 0-1 range
  const maxConfidence = predictions[0]?.confidence || 1
  predictions = predictions.map(p => ({
    ...p,
    confidence: Math.min(p.confidence / maxConfidence, 1),
  }))

  return predictions
}

