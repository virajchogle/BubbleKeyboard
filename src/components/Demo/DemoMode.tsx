import { useState, useEffect, useRef } from 'react'
import Keyboard from '../Keyboard'
import TextDisplay from '../TextDisplay'
import PredictionWheel from '../PredictionWheel'
import { predictNextLetters as smartPredict } from '../../utils/smartPredictor'

interface DemoModeProps {
  onClose: () => void
}

const DEMO_SENTENCES = [
  'The quick brown fox jumps over the lazy dog',
  'Predictive text helps people type faster',
  'Machine learning improves user experience',
]

// Hardcoded prediction logic for demo (saves API tokens)
function getDemoPredictions(text: string): string[] {
  // Use local smart predictor only (no API calls)
  return smartPredict(text).map(p => p.letter)
}

export default function DemoMode({ onClose }: DemoModeProps) {
  const [text, setText] = useState('')
  const [currentSentence, setCurrentSentence] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [predictions, setPredictions] = useState<string[]>([])
  const [stats, setStats] = useState({ wpm: 0, errors: 0, accuracy: 0 })
  const [showWheelOverlay, setShowWheelOverlay] = useState(true)
  const [smallScreenMode, setSmallScreenMode] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Initial predictions
  useEffect(() => {
    setPredictions(getDemoPredictions(''))
  }, [])

  useEffect(() => {
    if (isPlaying) {
      const sentence = DEMO_SENTENCES[currentSentence]
      let index = 0
      const startTime = Date.now()
      let currentText = ''
      let correctPredictions = 0
      let totalPredictions = 0
      let currentPredictions = getDemoPredictions('')
      
      // Reset wheel overlay for new sentence
      setShowWheelOverlay(true)

      intervalRef.current = window.setInterval(() => {
        if (index < sentence.length) {
          const char = sentence[index]
          
          // Check if current predictions include the next character (case-insensitive)
          const charUpper = char.toUpperCase()
          const charLower = char.toLowerCase()
          const isInPredictions = currentPredictions.length > 0 && (
            currentPredictions.includes(charUpper) || 
            currentPredictions.includes(charLower) || 
            currentPredictions.includes(char)
          )
          
          if (currentPredictions.length > 0) {
            if (isInPredictions) {
              correctPredictions++
            }
            totalPredictions++
          }
          
          // Hide wheel if next character is NOT in predictions (show keyboard instead)
          if (index + 1 < sentence.length) {
            const nextChar = sentence[index + 1]
            const nextCharUpper = nextChar.toUpperCase()
            const nextCharLower = nextChar.toLowerCase()
            const willBeInPredictions = currentPredictions.includes(nextCharUpper) || 
                                       currentPredictions.includes(nextCharLower) || 
                                       currentPredictions.includes(nextChar)
            setShowWheelOverlay(willBeInPredictions)
          } else {
            setShowWheelOverlay(true) // Show wheel at end
          }
          
          currentText += char
          setText(currentText)
          
          // Update predictions for NEXT character using local predictor only (saves API tokens)
          currentPredictions = getDemoPredictions(currentText)
          setPredictions(currentPredictions)

          // Update stats
          const elapsed = (Date.now() - startTime) / 60000
          const words = currentText.trim().split(/\s+/).length
          const accuracy = totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 100
          
          setStats({
            wpm: Math.round((words / elapsed) || 0),
            errors: 0, // Auto-typing has no errors
            accuracy: accuracy,
          })

          index++
        } else {
          // Sentence complete - clear interval and move to next
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          
          if (currentSentence < DEMO_SENTENCES.length - 1) {
            setTimeout(() => {
              setCurrentSentence(prev => prev + 1)
              setText('')
              setShowWheelOverlay(true) // Reset for next sentence
            }, 2000)
          } else {
            setIsPlaying(false)
            setShowWheelOverlay(true) // Reset at end
          }
        }
      }, 150) // Typing speed: 150ms per character

      return () => {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
  }, [isPlaying, currentSentence])

  const handleReset = () => {
    setText('')
    setCurrentSentence(0)
    setIsPlaying(false)
    setStats({ wpm: 0, errors: 0, accuracy: 0 })
    setShowWheelOverlay(true)
    setPredictions(getDemoPredictions(''))
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleWheelSelect = (letter: string) => {
    // In demo mode, wheel selection is just visual
    console.log('Wheel selected:', letter)
  }

  const handleToggleWheel = () => {
    setShowWheelOverlay(prev => !prev)
  }

  const showWheel = showWheelOverlay

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col p-4 pt-20 md:pt-24 md:p-8">
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Automated Demonstration
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Watch automated typing with real-time predictions (uses local predictor only)
            </p>
          </div>
          <div className="flex gap-3 md:gap-4 flex-wrap">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-5 py-2.5 md:px-6 md:py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm md:text-base font-medium transition-all"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleToggleWheel}
              className={`px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all border ${
                showWheelOverlay
                  ? 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              {showWheelOverlay ? 'Wheel: ON' : 'Wheel: OFF'}
            </button>
            <button
              onClick={() => setSmallScreenMode(!smallScreenMode)}
              className={`px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all border ${
                smallScreenMode
                  ? 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              {smallScreenMode ? 'Small Screen: ON' : 'Small Screen: OFF'}
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 md:px-6 md:py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg text-sm md:text-base font-medium transition-all"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 md:px-6 md:py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg text-sm md:text-base font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 mb-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-lg text-center border border-gray-200 dark:border-gray-800">
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-500 mb-2 font-medium">Typing Speed</div>
            <div className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">{stats.wpm}</div>
            <div className="text-xs text-gray-400 mt-1">WPM</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-lg text-center border border-gray-200 dark:border-gray-800">
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-500 mb-2 font-medium">Prediction Accuracy</div>
            <div className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">{stats.accuracy}%</div>
            <div className="text-xs text-gray-400 mt-1">Next char in top 4</div>
          </div>
        </div>
        
        {/* Info note */}
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> Demo uses local predictor only (no API calls). 
            The wheel automatically hides when the next character isn't predicted, showing the keyboard instead.
            Accuracy: 30-50% is typical for local prediction. Gemini AI achieves 70-90%+ accuracy.
          </p>
        </div>

        {/* Current Sentence */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-sm md:text-base text-gray-500 dark:text-gray-500 mb-2 font-medium">
            Sentence {currentSentence + 1} of {DEMO_SENTENCES.length}
          </div>
          <div className="text-lg md:text-2xl lg:text-3xl font-medium text-gray-900 dark:text-white">
            {DEMO_SENTENCES[currentSentence]}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`mx-auto flex-1 flex flex-col transition-all duration-300 ${
        smallScreenMode ? 'w-full max-w-[240px] gap-1' : 'w-full max-w-6xl gap-2'
      }`}>
        {smallScreenMode && (
          <div className="text-center mb-1">
            <span className="text-[9px] px-2 py-0.5 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-medium">
              Small Screen (240px)
            </span>
          </div>
        )}
        
        {/* Text Display - Adaptive size */}
        <div className={smallScreenMode ? 'h-[60px]' : 'h-[50px] md:h-[120px] lg:h-[180px]'}>
          <TextDisplay text={text} compact={smallScreenMode} />
        </div>

        {/* Keyboard Section - Properly Sized */}
        <div className={`w-full mx-auto ${smallScreenMode ? 'max-w-full' : 'max-w-4xl'}`}>
          <Keyboard
            onKeyPress={() => {}} // Disabled in demo mode
            predictedLetters={predictions}
            showWheel={showWheel}
            wheelComponent={
              <PredictionWheel
                predictions={predictions}
                onSelect={handleWheelSelect}
                onBackspace={handleToggleWheel}
                visible={showWheel}
                currentText={text}
                compact={smallScreenMode}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

