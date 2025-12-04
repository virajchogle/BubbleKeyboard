import { useState } from 'react'
import { motion } from 'framer-motion'

interface KeyboardProps {
  onKeyPress: (key: string) => void
  predictedLetters: string[]
  showWheel?: boolean
  wheelComponent?: React.ReactNode
}

// Letter layouts
const ROW1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
const ROW2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
const ROW3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']

// Number layout
const NUMBERS_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
const NUMBERS_ROW2 = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"']
const NUMBERS_ROW3 = ['.', ',', '?', '!', "'", '_', '%', '+', '=', '\\']

// Symbols layout
const SYMBOLS_ROW1 = ['[', ']', '{', '}', '#', '%', '^', '*', '+', '=']
const SYMBOLS_ROW2 = ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•']
const SYMBOLS_ROW3 = ['.', ',', '?', '!', "'", '"', ':', ';', '(', ')']

type KeyboardMode = 'letters' | 'numbers' | 'symbols'

export default function Keyboard({ onKeyPress, predictedLetters, showWheel = false, wheelComponent }: KeyboardProps) {
  const [mode, setMode] = useState<KeyboardMode>('letters')
  const [isShift, setIsShift] = useState(false)
  const [isCapsLock, setIsCapsLock] = useState(false)

  const handleKeyClick = (key: string) => {
    console.log('Key pressed:', key)
    
    // Handle special keys
    if (key === 'Shift') {
      setIsShift(prev => !prev)
      return
    }
    
    if (key === 'CapsLock') {
      setIsCapsLock(prev => !prev)
      setIsShift(false) // Turn off shift when caps lock is on
      return
    }
    
    if (key === '123' || key === 'ABC' || key === '#+=') {
      if (key === '123') setMode('numbers')
      else if (key === 'ABC') setMode('letters')
      else if (key === '#+=') setMode('symbols')
      setIsShift(false) // Reset shift when switching modes
      return
    }
    
    // Handle special action keys - pass them through as-is
    if (key === 'Backspace' || key === 'Enter') {
      onKeyPress(key)
      return
    }
    
    // Apply shift/caps lock to letters
    let outputKey = key
    if (mode === 'letters' && /[A-Z]/.test(key)) {
      if (isShift || isCapsLock) {
        outputKey = key.toUpperCase()
      } else {
        outputKey = key.toLowerCase()
      }
      // Turn off shift after using it (unless caps lock is on)
      if (isShift && !isCapsLock) {
        setIsShift(false)
      }
    }
    
    onKeyPress(outputKey)
  }

  const isPredicted = (letter: string) => {
    if (mode !== 'letters') return false
    const upper = letter.toUpperCase()
    const lower = letter.toLowerCase()
    return predictedLetters.includes(upper) || predictedLetters.includes(lower)
  }
  
  const getPredictionIndex = (letter: string) => {
    if (mode !== 'letters') return -1
    const upper = letter.toUpperCase()
    const lower = letter.toLowerCase()
    const upperIndex = predictedLetters.indexOf(upper)
    const lowerIndex = predictedLetters.indexOf(lower)
    if (upperIndex !== -1) return upperIndex
    if (lowerIndex !== -1) return lowerIndex
    return -1
  }

  const getScale = (letter: string) => {
    if (!isPredicted(letter)) return 1
    const index = getPredictionIndex(letter)
    const scales = [1.4, 1.3, 1.2, 1.15, 1.15]
    return scales[index] || 1
  }

  const renderKey = (key: string, className: string = '') => {
    const predicted = isPredicted(key)
    const predictionIndex = getPredictionIndex(key)
    const scale = getScale(key)
    
    // Determine display text
    let displayText = key
    if (mode === 'letters' && /[A-Z]/.test(key)) {
      displayText = (isShift || isCapsLock) ? key.toUpperCase() : key.toLowerCase()
    }
    
    return (
      <motion.button
        key={key}
        data-key={key}
        onClick={() => handleKeyClick(key)}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: predicted ? scale : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: 0.3,
        }}
        className={`
          min-h-[48px] md:min-h-[56px] lg:min-h-[64px] px-2 md:px-3 py-2 md:py-3 rounded-lg 
          font-medium text-base md:text-xl lg:text-2xl
          transition-all duration-200 border
          ${predicted 
            ? `bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-white ${
                predictionIndex === 0 ? 'ring-2 ring-gray-400 dark:ring-gray-600' : ''
              }` 
            : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
          }
          touch-manipulation select-none relative
          flex items-center justify-center
          ${className}
        `}
        aria-label={`Key ${key}`}
      >
        {displayText}
        <motion.span
          className="absolute inset-0 rounded-xl bg-white opacity-0"
          whileTap={{
            opacity: [0, 0.3, 0],
            scale: [1, 1.5, 2],
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.button>
    )
  }

  const renderSpecialKey = (
    label: string,
    onClick: () => void,
    className: string = '',
    icon?: string
  ) => {
    return (
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        className={`
          min-h-[48px] md:min-h-[56px] lg:min-h-[64px] px-3 md:px-4 py-2 md:py-3 rounded-lg 
          font-medium text-sm md:text-lg lg:text-xl border
          bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700
          active:bg-gray-400 dark:active:bg-gray-600 touch-manipulation select-none
          flex items-center justify-center transition-all
          ${className}
        `}
        aria-label={label}
      >
        {icon || label}
      </motion.button>
    )
  }

  const renderLettersLayout = () => (
    <>
      {/* Row 1 */}
      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-1 md:mb-2">
        {ROW1.map(key => renderKey(key))}
      </div>

      {/* Row 2 - Indented */}
      <div className="grid grid-cols-9 gap-1 md:gap-2 mb-1 md:mb-2 ml-2 md:ml-6 lg:ml-8">
        {ROW2.map(key => renderKey(key))}
      </div>

      {/* Row 3 - More indented with Shift, letters, Backspace */}
      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-1 md:mb-2 ml-1 md:ml-3 lg:ml-4">
        {renderSpecialKey(
          'Shift',
          () => handleKeyClick('Shift'),
          isShift || isCapsLock ? 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-white' : '',
          isShift || isCapsLock ? '↓' : '↑'
        )}
        {ROW3.map(key => renderKey(key))}
        {renderSpecialKey('⌫', () => handleKeyClick('Backspace'), '', '⌫')}
      </div>
    </>
  )

  const renderNumbersLayout = () => (
    <>
      {/* Row 1 */}
      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-1 md:mb-2">
        {NUMBERS_ROW.map(key => renderKey(key))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-1 md:mb-2">
        {NUMBERS_ROW2.map(key => renderKey(key))}
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-1 md:mb-2">
        {NUMBERS_ROW3.map(key => renderKey(key))}
      </div>
    </>
  )

  const renderSymbolsLayout = () => (
    <>
      {/* Row 1 */}
      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-1 md:mb-2">
        {SYMBOLS_ROW1.map(key => renderKey(key))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-1 md:mb-2">
        {SYMBOLS_ROW2.map(key => renderKey(key))}
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-1 md:mb-2">
        {SYMBOLS_ROW3.map(key => renderKey(key))}
      </div>
    </>
  )

  return (
    <div className="relative w-full bg-gray-50 dark:bg-gray-900 p-3 md:p-4 lg:p-6 rounded-lg max-w-full overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Main keyboard layout */}
      <div className={showWheel ? 'blur-sm transition-all duration-300' : ''}>
        {mode === 'letters' && renderLettersLayout()}
        {mode === 'numbers' && renderNumbersLayout()}
        {mode === 'symbols' && renderSymbolsLayout()}

        {/* Bottom row with mode switcher, space, enter */}
        <div className="mt-1 sm:mt-2 md:mt-3 flex gap-1 md:gap-2">
        {/* Mode switcher */}
        {mode === 'letters' && (
          renderSpecialKey('123', () => handleKeyClick('123'), 'flex-1')
        )}
        {mode === 'numbers' && (
          <>
            {renderSpecialKey('ABC', () => handleKeyClick('ABC'), 'flex-1')}
            {renderSpecialKey('#+=', () => handleKeyClick('#+='), 'flex-1')}
          </>
        )}
        {mode === 'symbols' && (
          renderSpecialKey('123', () => handleKeyClick('123'), 'flex-1')
        )}

        {/* Space Bar */}
        <motion.button
          onClick={() => handleKeyClick(' ')}
          whileTap={{ scale: 0.95 }}
          className="flex-1 min-h-[48px] md:min-h-[56px] lg:min-h-[64px] rounded-lg font-medium text-sm md:text-lg lg:text-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 touch-manipulation select-none flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
          aria-label="Space"
        >
          Space
        </motion.button>

        {/* Enter/Return */}
        {renderSpecialKey('⏎', () => handleKeyClick('Enter'), 'flex-1', '⏎')}
        </div>
      </div>

      {/* Prediction Wheel Overlay */}
      {showWheel && wheelComponent && (
        <div className="absolute inset-0 z-50 overflow-hidden rounded-2xl">
          {wheelComponent}
        </div>
      )}
    </div>
  )
}
