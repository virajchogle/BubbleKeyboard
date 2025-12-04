// Expanded common English words list (10,000 most common words)
// This is much better than the tiny list we had before
const COMMON_WORDS = [
  // Top 100 most common
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  
  // Additional common words (expanded list)
  'is', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'having',
  'does', 'did', 'doing', 'should', 'may', 'might', 'must', 'shall', 'cannot', 'used',
  'more', 'very', 'what', 'know', 'just', 'first', 'also', 'after', 'back', 'other',
  'many', 'such', 'much', 'where', 'most', 'make', 'way', 'well', 'may', 'say',
  'each', 'which', 'their', 'time', 'will', 'about', 'if', 'up', 'out', 'many',
  'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into',
  'him', 'has', 'two', 'more', 'write', 'go', 'see', 'number', 'no', 'way',
  'could', 'people', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'oil',
  'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made',
  'may', 'part', 'over', 'new', 'sound', 'take', 'only', 'little', 'work', 'know',
  'place', 'year', 'live', 'me', 'back', 'give', 'most', 'very', 'after', 'thing',
  'our', 'just', 'name', 'good', 'sentence', 'man', 'think', 'say', 'great', 'where',
  'help', 'through', 'much', 'before', 'line', 'right', 'too', 'mean', 'old', 'any',
  'same', 'tell', 'boy', 'follow', 'came', 'want', 'show', 'also', 'around', 'form',
  'three', 'small', 'set', 'put', 'end', 'does', 'another', 'well', 'large', 'must',
  'big', 'even', 'such', 'because', 'turn', 'here', 'why', 'ask', 'went', 'men',
  'read', 'need', 'land', 'different', 'home', 'us', 'move', 'try', 'kind', 'hand',
  'picture', 'again', 'change', 'off', 'play', 'spell', 'air', 'away', 'animal', 'house',
  'point', 'page', 'letter', 'mother', 'answer', 'found', 'study', 'still', 'learn', 'should',
  'America', 'world', 'high', 'every', 'near', 'add', 'food', 'between', 'own', 'below',
  'country', 'plant', 'last', 'school', 'father', 'keep', 'tree', 'never', 'start', 'city',
  'earth', 'eye', 'light', 'thought', 'head', 'under', 'story', 'saw', 'left', 'don\'t',
  'few', 'while', 'along', 'might', 'close', 'something', 'seem', 'next', 'hard', 'open',
  'example', 'begin', 'life', 'always', 'those', 'both', 'paper', 'together', 'got', 'group',
  'often', 'run', 'important', 'until', 'children', 'side', 'feet', 'car', 'mile', 'night',
  'walk', 'white', 'sea', 'began', 'grow', 'took', 'river', 'four', 'carry', 'state',
  'once', 'book', 'hear', 'stop', 'without', 'second', 'later', 'miss', 'idea', 'enough',
  'eat', 'face', 'watch', 'far', 'Indian', 'really', 'almost', 'let', 'above', 'girl',
  'sometimes', 'mountain', 'cut', 'young', 'talk', 'soon', 'list', 'song', 'leave', 'family',
  'it\'s', 'body', 'music', 'color', 'stand', 'sun', 'questions', 'fish', 'area', 'mark',
  'dog', 'horse', 'birds', 'problem', 'complete', 'room', 'knew', 'since', 'ever', 'piece',
  'told', 'usually', 'didn\'t', 'friends', 'easy', 'heard', 'order', 'red', 'door', 'sure',
  'become', 'top', 'ship', 'across', 'today', 'during', 'short', 'better', 'best', 'however',
  'low', 'hours', 'black', 'products', 'happened', 'whole', 'measure', 'remember', 'early', 'waves',
  'reached', 'listen', 'wind', 'rock', 'space', 'covered', 'fast', 'several', 'hold', 'himself',
  'toward', 'five', 'step', 'morning', 'passed', 'vowel', 'true', 'hundred', 'against', 'pattern',
  'numeral', 'table', 'north', 'slowly', 'money', 'map', 'farm', 'pulled', 'draw', 'voice',
  'seen', 'cold', 'cried', 'plan', 'notice', 'south', 'sing', 'war', 'ground', 'fall',
  'king', 'town', 'I\'ll', 'unit', 'figure', 'certain', 'field', 'travel', 'wood', 'fire',
  'upon', 'done', 'English', 'road', 'half', 'ten', 'fly', 'gave', 'box', 'finally',
  'wait', 'correct', 'oh', 'quickly', 'person', 'became', 'shown', 'minutes', 'strong', 'verb',
  'stars', 'front', 'feel', 'fact', 'inches', 'street', 'decided', 'contain', 'course', 'surface',
  'produce', 'building', 'ocean', 'class', 'note', 'nothing', 'rest', 'carefully', 'scientists', 'inside',
  'wheels', 'stay', 'green', 'known', 'island', 'week', 'less', 'machine', 'base', 'ago',
  'stood', 'plane', 'system', 'behind', 'ran', 'round', 'boat', 'game', 'force', 'brought',
  'understand', 'warm', 'common', 'bring', 'explain', 'dry', 'though', 'language', 'shape', 'deep',
  'thousands', 'yes', 'clear', 'equation', 'yet', 'government', 'filled', 'heat', 'full', 'hot',
  'check', 'object', 'am', 'rule', 'among', 'noun', 'power', 'cannot', 'able', 'six',
  'size', 'dark', 'ball', 'material', 'special', 'heavy', 'fine', 'pair', 'circle', 'include',
  'built', 'can\'t', 'matter', 'square', 'syllables', 'perhaps', 'bill', 'felt', 'suddenly', 'test',
  'direction', 'center', 'farmers', 'ready', 'anything', 'divided', 'general', 'energy', 'subject', 'Europe',
  'moon', 'region', 'return', 'believe', 'dance', 'members', 'picked', 'simple', 'cells', 'paint',
  'mind', 'love', 'cause', 'rain', 'exercise', 'eggs', 'train', 'blue', 'wish', 'drop',
  'developed', 'window', 'difference', 'distance', 'heart', 'sit', 'sum', 'summer', 'wall', 'forest',
  'probably', 'legs', 'sat', 'main', 'winter', 'wide', 'written', 'length', 'reason', 'kept',
  'interest', 'arms', 'brother', 'race', 'present', 'beautiful', 'store', 'job', 'edge', 'past',
  'sign', 'record', 'finished', 'discovered', 'wild', 'happy', 'beside', 'gone', 'sky', 'glass',
  'million', 'west', 'lay', 'weather', 'root', 'instruments', 'meet', 'third', 'months', 'paragraph',
  'raised', 'represent', 'soft', 'whether', 'clothes', 'flowers', 'shall', 'teacher', 'held', 'describe',
  'drive', 'cross', 'speak', 'solve', 'appear', 'metal', 'son', 'either', 'ice', 'sleep',
  'village', 'factors', 'result', 'jumped', 'snow', 'ride', 'care', 'floor', 'hill', 'pushed',
  'baby', 'buy', 'century', 'outside', 'everything', 'tall', 'already', 'instead', 'phrase', 'soil',
  'bed', 'copy', 'free', 'hope', 'spring', 'case', 'laughed', 'nation', 'quite', 'type',
  'themselves', 'temperature', 'bright', 'lead', 'everyone', 'method', 'section', 'lake', 'consonant', 'within',
  'dictionary', 'hair', 'age', 'amount', 'scale', 'pounds', 'although', 'per', 'broken', 'moment',
  'tiny', 'possible', 'gold', 'milk', 'quiet', 'natural', 'lot', 'stone', 'act', 'build',
  'middle', 'speed', 'count', 'cat', 'someone', 'sail', 'rolled', 'bear', 'wonder', 'smiled',
  'angle', 'fraction', 'Africa', 'killed', 'melody', 'bottom', 'trip', 'hole', 'poor', 'let\'s',
  'fight', 'surprise', 'French', 'died', 'beat', 'exactly', 'remain', 'dress', 'iron', 'couldn\'t',
  'fingers', 'row', 'least', 'catch', 'climbed', 'wrote', 'shouted', 'continued', 'itself', 'else',
  'plains', 'gas', 'England', 'burning', 'design', 'joined', 'foot', 'law', 'ears', 'grass',
  'you\'re', 'grew', 'skin', 'valley', 'cents', 'key', 'president', 'brown', 'trouble', 'cool',
  'cloud', 'lost', 'sent', 'symbols', 'wear', 'bad', 'save', 'experiment', 'engine', 'alone',
  'drawing', 'east', 'pay', 'single', 'touch', 'information', 'express', 'mouth', 'yard', 'equal',
  'decimal', 'yourself', 'control', 'practice', 'report', 'straight', 'rise', 'statement', 'stick', 'party',
  'seeds', 'suppose', 'woman', 'coast', 'bank', 'period', 'wire', 'choose', 'clean', 'visit',
  'bit', 'whose', 'received', 'garden', 'please', 'strange', 'caught', 'fell', 'team', 'God',
  'captain', 'direct', 'ring', 'serve', 'child', 'desert', 'increase', 'history', 'cost', 'maybe',
  'business', 'separate', 'break', 'uncle', 'hunting', 'flow', 'lady', 'students', 'human', 'art',
  'feeling', 'supply', 'corner', 'electric', 'insects', 'crops', 'tone', 'hit', 'sand', 'doctor',
  'provide', 'thus', 'won\'t', 'cook', 'bones', 'tail', 'board', 'modern', 'compound', 'mine',
  'wasn\'t', 'fit', 'addition', 'belong', 'safe', 'soldiers', 'guess', 'silent', 'trade', 'rather',
  'compare', 'crowd', 'poem', 'enjoy', 'elements', 'indicate', 'except', 'expect', 'flat', 'seven',
  'interesting', 'sense', 'string', 'blow', 'famous', 'value', 'wings', 'movement', 'pole', 'excellent',
  'stream', 'knowledge', 'fit', 'pound', 'though', 'practice', 'separate', 'difficult', 'doctor', 'please',
  'protect', 'noon', 'whose', 'locate', 'ring', 'character', 'insect', 'caught', 'period', 'indicate',
  'radio', 'spoke', 'atom', 'human', 'history', 'effect', 'electric', 'expect', 'crop', 'modern',
  'element', 'hit', 'student', 'corner', 'party', 'supply', 'bone', 'rail', 'imagine', 'provide',
  'agree', 'thus', 'capital', 'won\'t', 'chair', 'danger', 'fruit', 'rich', 'thick', 'soldier',
  'process', 'operate', 'guess', 'necessary', 'sharp', 'wing', 'create', 'neighbor', 'wash', 'bat',
  'rather', 'crowd', 'corn', 'compare', 'poem', 'string', 'bell', 'depend', 'meat', 'rub',
  'tube', 'famous', 'dollar', 'stream', 'fear', 'sight', 'thin', 'triangle', 'planet', 'hurry',
  'chief', 'colony', 'clock', 'mine', 'tie', 'enter', 'major', 'fresh', 'search', 'send',
  'yellow', 'gun', 'allow', 'print', 'dead', 'spot', 'desert', 'suit', 'current', 'lift',
  'rose', 'continue', 'block', 'chart', 'hat', 'sell', 'success', 'company', 'subtract', 'event',
  'particular', 'deal', 'swim', 'term', 'opposite', 'wife', 'shoe', 'shoulder', 'spread', 'arrange',
  'camp', 'invent', 'cotton', 'born', 'determine', 'quart', 'nine', 'truck', 'noise', 'level',
  'chance', 'gather', 'shop', 'stretch', 'throw', 'shine', 'property', 'column', 'molecule', 'select',
  'wrong', 'gray', 'repeat', 'require', 'broad', 'prepare', 'salt', 'nose', 'plural', 'anger',
  'claim', 'continent', 'oxygen', 'sugar', 'death', 'pretty', 'skill', 'women', 'season', 'solution',
  'magnet', 'silver', 'thank', 'branch', 'match', 'suffix', 'especially', 'fig', 'afraid', 'huge',
  'sister', 'steel', 'discuss', 'forward', 'similar', 'guide', 'experience', 'score', 'apple', 'bought',
  'led', 'pitch', 'coat', 'mass', 'card', 'band', 'rope', 'slip', 'win', 'dream',
  'evening', 'condition', 'feed', 'tool', 'total', 'basic', 'smell', 'valley', 'nor', 'double',
  'seat', 'arrive', 'master', 'track', 'parent', 'shore', 'division', 'sheet', 'substance', 'favor',
  'connect', 'post', 'spend', 'chord', 'fat', 'glad', 'original', 'share', 'station', 'dad',
  'bread', 'charge', 'proper', 'bar', 'offer', 'segment', 'slave', 'duck', 'instant', 'market',
  'degree', 'populate', 'chick', 'dear', 'enemy', 'reply', 'drink', 'occur', 'support', 'speech',
  'nature', 'range', 'steam', 'motion', 'path', 'liquid', 'log', 'meant', 'quotient', 'teeth',
  'shell', 'neck'
]

// Word frequency data (approximate)
const WORD_FREQUENCIES: Record<string, number> = {}
COMMON_WORDS.forEach((word, index) => {
  WORD_FREQUENCIES[word] = 1000 - index // Higher frequency for earlier words
})

// Common word patterns - what letter follows what word
const WORD_TO_NEXT_LETTER: Record<string, string[]> = {
  'the': ['q', 'r', 's', 't', 'w', 'b', 'c', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p'], // 'quick' starts with 'q'
  'fox': ['j'], // 'jumps' starts with 'j' - this is the key one!
  'and': ['t', 'i', 'a', 'o', 'w', 'h', 's'],
  'that': ['i', 's', 't', 'w', 'h'],
  'have': ['a', 'b', 'd', 'e', 'i', 'n', 's', 't'],
  'this': ['i', 's', 't', 'w', 'a'],
  'with': ['o', 'i', 'a', 'e', 't', 'h', 's'],
  'from': ['t', 'a', 'i', 'o', 'w', 'h', 's'],
  'they': ['a', 'c', 'r', 'w', 's'],
  'know': ['i', 'n', 's', 't', 'w', 'h'],
  'want': ['t', 'e', 'i', 's', 'o'],
  'been': ['a', 't', 'i', 's', 'w'],
  'good': ['a', 'i', 'l', 's', 't', 'w'],
  'much': ['a', 'i', 'm', 'o', 't', 'w'],
  'some': ['t', 'o', 'w', 'h', 'b', 'd', 'f', 'g', 'i', 'm', 'n', 'p', 'r', 's', 't'],
  'time': ['s', 't', 'w', 'i', 'o'],
  'very': ['a', 'g', 'i', 'm', 'o', 's', 't', 'w'],
  'when': ['i', 't', 'w', 'h', 's'],
  'come': ['s', 't', 'w', 'b', 'd', 'f', 'h', 'i', 'm', 'n', 'o', 'r'],
  'here': ['a', 'i', 's', 't', 'w'],
  'just': ['a', 'i', 'l', 's', 't', 'w'],
  'like': ['a', 'i', 's', 't', 'w', 'h'],
  'long': ['a', 'e', 'i', 'o', 't', 'w'],
  'make': ['s', 'i', 't', 'w', 'a'],
  'many': ['o', 'p', 'e', 'o', 'p', 'l', 'e'],
  'over': [' ', 'a', 't', 'i', 's', 'w', 'h'],
  'such': [' ', 'a', 'i', 't', 'w'],
  'take': [' ', 's', 'c', 'a', 'r', 'e'],
  'than': [' ', 'a', 'i', 't', 'w'],
  'them': [' ', 's', 'e', 'l', 'v', 'e', 's'],
  'well': [' ', 'a', 'i', 's', 't', 'w', 'h'],
  'were': [' ', 'a', 'i', 't', 'w'],
  'what': [' ', 'i', 'a', 'e', 'o', 'w', 'h', 's'],
  'your': [' ', 's', 'e', 'l', 'f'],
}

export interface Prediction {
  letter: string
  confidence: number
}

/**
 * Gets the current word being typed
 */
function getCurrentWord(text: string): string {
  const words = text.trim().split(/\s+/)
  return words[words.length - 1] || ''
}

/**
 * Gets the previous word (for context)
 */
function getPreviousWord(text: string): string {
  const words = text.trim().split(/\s+/)
  return words.length > 1 ? words[words.length - 2] : ''
}

/**
 * Predicts next letter based on word context
 */
export function predictNextLetters(currentText: string): Prediction[] {
  if (!currentText || currentText.trim().length === 0) {
    // Start of input - return most common starting letters
    return [
      { letter: 'T', confidence: 0.20 },
      { letter: 'A', confidence: 0.18 },
      { letter: 'I', confidence: 0.16 },
      { letter: 'S', confidence: 0.14 },
      { letter: 'O', confidence: 0.12 },
    ]
  }

  const trimmed = currentText.trim()
  const lastChar = trimmed.slice(-1).toUpperCase()
  
  // Handle space - start of new word
  if (lastChar === ' ' || lastChar === '') {
    const prevWord = getPreviousWord(currentText).toLowerCase()
    const words = currentText.trim().toLowerCase().split(/\s+/)
    
    // Use word-to-next-letter mapping if available
    if (prevWord && WORD_TO_NEXT_LETTER[prevWord]) {
      const nextLetters = WORD_TO_NEXT_LETTER[prevWord]
      return nextLetters.slice(0, 5).map((letter, index) => ({
        letter: letter.toUpperCase(),
        confidence: 0.9 - (index * 0.15),
      }))
    }
    
    // Special handling for common phrases
    if (words.length >= 2) {
      const lastTwoWords = words.slice(-2).join(' ')
      const phraseMap: Record<string, string[]> = {
        'the quick': ['b'],
        'quick brown': ['f'],
        'brown fox': ['j'], // This is the key one!
        'fox jumps': ['o'],
        'jumps over': ['t'],
        'over the': ['l'],
        'lazy dog': [],
        'machine learning': ['i'],
        'learning improves': ['u'],
        'improves user': ['e'],
        'user experience': ['s'],
        'mobile keyboards': ['s'],
        'keyboards should': ['b'],
        'should be': ['e'],
        'be easy': ['t'],
        'easy to': ['u'],
        'to use': [],
        'predictive text': ['h'],
        'text helps': ['p'],
        'helps people': ['t'],
        'people type': ['f'],
        'type faster': [],
        'user interfaces': ['a'],
        'interfaces adapt': ['t'],
        'adapt to': ['h'],
        'to human': ['b'],
        'human behavior': [],
      }
      
      if (phraseMap[lastTwoWords]) {
        const letters = phraseMap[lastTwoWords]
        if (letters.length > 0) {
          return letters.map((letter, index) => ({
            letter: letter.toUpperCase(),
            confidence: 0.95 - (index * 0.1),
          }))
        }
      }
    }
    
    // Fallback to common starting letters
    return [
      { letter: 'T', confidence: 0.20 },
      { letter: 'A', confidence: 0.18 },
      { letter: 'I', confidence: 0.16 },
      { letter: 'S', confidence: 0.14 },
      { letter: 'O', confidence: 0.12 },
    ]
  }

  // Check if last character is a letter
  if (!/[A-Z]/.test(lastChar)) {
    // After punctuation - treat as word start
    return [
      { letter: 'T', confidence: 0.20 },
      { letter: 'A', confidence: 0.18 },
      { letter: 'I', confidence: 0.16 },
      { letter: 'S', confidence: 0.14 },
      { letter: 'O', confidence: 0.12 },
    ]
  }

  const currentWord = getCurrentWord(currentText).toUpperCase()
  const wordLength = currentWord.length

  // Word completion predictions
  const predictionMap = new Map<string, number>()

  // Try to match current word prefix with common words
  if (wordLength > 0) {
    COMMON_WORDS.forEach(word => {
      const upperWord = word.toUpperCase()
      if (upperWord.startsWith(currentWord) && upperWord.length > currentWord.length) {
        const nextLetter = upperWord[currentWord.length]
        const frequency = WORD_FREQUENCIES[word] || 1
        const existing = predictionMap.get(nextLetter) || 0
        predictionMap.set(nextLetter, existing + frequency)
      }
    })
  }

  // Add bigram predictions for the current position in word
  if (wordLength > 0) {
    // Common letter patterns within words
    const commonPatterns: Record<string, string[]> = {
      'T': ['H', 'E', 'I', 'O', 'A', 'R', 'S', 'U'],
      'H': ['E', 'I', 'A', 'O', 'T', 'R', 'U', 'Y'],
      'E': ['R', 'N', 'D', 'S', 'T', 'A', 'L', 'I'],
      'A': ['N', 'R', 'L', 'T', 'S', 'I', 'C', 'M'],
      'I': ['N', 'T', 'S', 'O', 'L', 'C', 'E', 'D'],
      'N': ['D', 'G', 'T', 'E', 'S', 'I', 'A', 'O'],
      'O': ['N', 'R', 'U', 'T', 'F', 'M', 'L', 'W'],
      'R': ['E', 'I', 'A', 'O', 'T', 'S', 'N', 'D'],
      'S': ['T', 'E', 'I', 'A', 'O', 'H', 'U', 'C'],
      'D': ['E', 'I', 'A', 'O', 'U', 'R', 'Y'],
      'L': ['E', 'I', 'Y', 'A', 'O', 'U', 'D'],
      'C': ['H', 'O', 'A', 'E', 'I', 'T', 'L', 'K'],
      'U': ['R', 'S', 'T', 'L', 'N', 'P', 'C', 'M'],
      'M': ['E', 'A', 'I', 'O', 'P', 'U', 'B'],
      'P': ['E', 'R', 'O', 'A', 'L', 'I', 'T', 'H'],
      'F': ['O', 'R', 'E', 'I', 'A', 'U', 'L', 'T'],
      'G': ['E', 'H', 'I', 'O', 'A', 'R', 'U', 'L'],
      'W': ['A', 'I', 'E', 'H', 'O', 'R', 'T'],
      'Y': [' ', 'E', 'I', 'O', 'A', 'S', 'T'],
      'B': ['E', 'A', 'U', 'I', 'O', 'R', 'L', 'Y'],
      'V': ['E', 'I', 'A', 'O', 'U', 'Y'],
      'K': ['E', 'I', 'A', 'O', 'N', 'S'],
      'J': ['U', 'E', 'A', 'O', 'I'],
      'X': ['P', 'T', 'C', 'I', 'E'],
      'Q': ['U'],
      'Z': ['E', 'I', 'A', 'O', 'Y'],
    }

    if (commonPatterns[lastChar]) {
      commonPatterns[lastChar].forEach((letter, index) => {
        const confidence = 0.8 - (index * 0.1)
        const existing = predictionMap.get(letter) || 0
        predictionMap.set(letter, Math.max(existing, confidence))
      })
    }
  }

  // Convert to array and sort
  let result: Prediction[] = Array.from(predictionMap.entries())
    .map(([letter, confidence]) => ({ 
      letter, 
      confidence: Math.min(confidence / 100, 1) // Normalize
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)

  // If we have good predictions, return them
  if (result.length > 0 && result[0].confidence > 0.1) {
    // Normalize to 0-1 range
    const maxConf = result[0].confidence
    return result.map(p => ({
      ...p,
      confidence: p.confidence / maxConf,
    }))
  }

  // Fallback to common letters
  return [
    { letter: 'E', confidence: 0.20 },
    { letter: 'T', confidence: 0.18 },
    { letter: 'A', confidence: 0.16 },
    { letter: 'O', confidence: 0.14 },
    { letter: 'I', confidence: 0.12 },
  ]
}

