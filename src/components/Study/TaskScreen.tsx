import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Keyboard from '../Keyboard'
import TextDisplay from '../TextDisplay'
import PredictionWheel from '../PredictionWheel'
import { predictNextLetters } from '../../utils/apiPredictor'
import { dataLogger } from '../../utils/dataLogger'

interface TaskScreenProps {
  taskId: number
  sentence: string
  condition: 'standard' | 'predictive'
  onComplete: () => void
}

const STUDY_SENTENCES = [
  'The quick brown fox jumps over the lazy dog',
  'Machine learning improves user experience significantly',
  'Mobile keyboards should be easy to use',
  'Predictive text helps people type faster',
  'User interfaces adapt to human behavior',
]

export default function TaskScreen({
  taskId,
  sentence,
  condition,
  onComplete,
}: TaskScreenProps) {
  const [text, setText] = useState('')
  const [predictions, setPredictions] = useState<string[]>([])
  const [useWheelMode] = useState(true) // Wheel mode enabled for study
  const [showWheelOverlay, setShowWheelOverlay] = useState(true) // Start with wheel visible

  useEffect(() => {
    dataLogger.startTask(taskId, sentence)
    // Fetch initial predictions at start
    if (condition === 'predictive') {
      predictNextLetters('', true).then(preds => {
        setPredictions(preds.map(p => p.letter))
      })
    }
  }, [taskId, sentence, condition])

  useEffect(() => {
    if (condition === 'predictive') {
      let cancelled = false
      predictNextLetters(text, true).then(preds => {
        if (!cancelled) {
          setPredictions(preds.map(p => p.letter))
        }
      })
      return () => { cancelled = true }
    } else {
      setPredictions([])
    }
  }, [text, condition])

  // Listen for physical keyboard input
  useEffect(() => {
    const handlePhysicalKeyboard = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Prevent default for keys we handle
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
        e.preventDefault()
      }

      if (e.key === 'Backspace') {
        handleKeyPress('Backspace')
      } else if (e.key === 'Enter') {
        handleKeyPress('Enter')
      } else if (e.key.length === 1) {
        // Single character - letter, number, space, punctuation
        handleKeyPress(e.key)
      }
    }

    window.addEventListener('keydown', handlePhysicalKeyboard)
    return () => window.removeEventListener('keydown', handlePhysicalKeyboard)
  }, [text, condition, useWheelMode, predictions])

  const handleKeyPress = async (key: string) => {
    // Show wheel when any key is pressed (if in predictive mode)
    if (condition === 'predictive' && useWheelMode) {
      setShowWheelOverlay(true)
    }

    const isPredicted = condition === 'predictive' && predictions.includes(key.toUpperCase())
    const preds = await predictNextLetters(text, true)
    const pred = preds.find(p => p.letter === key.toUpperCase() || p.letter === key)
    const confidence = pred?.confidence

    dataLogger.logKeystroke(key, isPredicted, confidence, text)

    if (key === 'Backspace') {
      setText(prev => prev.slice(0, -1))
    } else if (key === 'Enter') {
      setText(prev => prev + '\n')
    } else {
      setText(prev => prev + key)
    }
  }

  const handleWheelSelect = async (letter: string) => {
    const isPredicted = condition === 'predictive' && predictions.includes(letter.toUpperCase())
    const preds = await predictNextLetters(text, true)
    const pred = preds.find(p => p.letter === letter.toUpperCase() || p.letter === letter)
    const confidence = pred?.confidence

    dataLogger.logKeystroke(letter, isPredicted, confidence, text)
    setText(prev => prev + letter)
  }

  const handleToggleWheel = () => {
    // Toggle between wheel and normal keyboard view
    setShowWheelOverlay(prev => !prev)
  }

  // Show wheel when wheel mode is enabled, condition is predictive, and wheel overlay is shown
  const showWheel = useWheelMode && condition === 'predictive' && showWheelOverlay

  const handleNext = () => {
    dataLogger.endTask()
    onComplete()
  }

  const isComplete = text.trim().toLowerCase() === sentence.toLowerCase().trim() && text.length > 0

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col p-4 pt-20 md:pt-24 md:p-8">
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto mb-6">
        <div className="text-sm md:text-base text-gray-500 dark:text-gray-500 mb-3 font-medium">
          Task {taskId} of {STUDY_SENTENCES.length}
        </div>
        <div className="text-lg md:text-2xl lg:text-3xl font-medium mb-4 bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          {sentence}
        </div>
        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-500 font-medium">
          Mode: {condition === 'predictive' ? 'Predictive Input' : 'Standard Input'}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col gap-6">
        {/* Text Display */}
        <div className="flex-1 min-h-[200px] md:min-h-[300px]">
          <TextDisplay text={text} />
        </div>

        {/* Keyboard Section */}
        <div className="w-full max-w-4xl mx-auto">
          <Keyboard
            onKeyPress={handleKeyPress}
            predictedLetters={condition === 'predictive' ? predictions : []}
            showWheel={showWheel}
          wheelComponent={
            <PredictionWheel
              predictions={predictions}
              onSelect={handleWheelSelect}
              onBackspace={handleToggleWheel}
              visible={showWheel}
              currentText={text}
            />
          }
          />

          <motion.button
            onClick={handleNext}
            disabled={!isComplete}
            whileTap={{ scale: 0.95 }}
            className={`
              mt-4 md:mt-6 w-full py-3 md:py-4 rounded-lg font-medium text-base md:text-lg border transition-all
              ${isComplete
                ? 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-800 cursor-not-allowed'
              }
            `}
          >
            {isComplete ? 'Continue to Next Task' : 'Complete the sentence to continue'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

