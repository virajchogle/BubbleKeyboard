import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Keyboard from './components/Keyboard'
import TextDisplay from './components/TextDisplay'
import PredictionWheel from './components/PredictionWheel'
import StudyFlow from './components/Study/StudyFlow'
import ResearcherDashboard from './components/Dashboard/ResearcherDashboard'
import DemoMode from './components/Demo/DemoMode'
import { predictNextLetters } from './utils/apiPredictor'
import './utils/testGemini' // Load Gemini test utilities
import './App.css'

function DemoKeyboard() {
  const [text, setText] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const [predictions, setPredictions] = useState<string[]>([])
  const [useWheelMode, setUseWheelMode] = useState(true)
  const [showWheelOverlay, setShowWheelOverlay] = useState(true)
  const [smallScreenMode, setSmallScreenMode] = useState(false)

  useEffect(() => {
    // Fetch initial predictions
    predictNextLetters('', true).then(preds => {
      setPredictions(preds.map(p => p.letter))
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    predictNextLetters(text, true).then(preds => {
      if (!cancelled) {
        setPredictions(preds.map(p => p.letter))
      }
    })
    return () => { cancelled = true }
  }, [text])

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
  }, [text, useWheelMode])

  const handleKeyPress = (key: string) => {
    // Show wheel when any key is pressed
    if (useWheelMode) {
      setShowWheelOverlay(true)
    }

    if (key === 'Backspace') {
      setText(prev => prev.slice(0, -1))
    } else if (key === 'Enter') {
      setText(prev => prev + '\n')
    } else {
      setText(prev => prev + key)
    }
  }

  const handleWheelSelect = (letter: string) => {
    setText(prev => prev + letter)
  }

  const handleToggleWheel = () => {
    setShowWheelOverlay(prev => !prev)
  }

  // Show wheel when wheel mode is enabled and wheel overlay is shown
  const showWheel = useWheelMode && showWheelOverlay

  if (showDemo) {
    return <DemoMode onClose={() => setShowDemo(false)} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col p-4 pt-20 md:pt-24 md:p-8">
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Predictive Text System
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Advanced AI-powered keyboard with contextual predictions
            </p>
          </div>
          <div className="flex gap-3 md:gap-4 flex-wrap">
            <button
              onClick={() => setUseWheelMode(!useWheelMode)}
              className={`px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium shadow-sm transition-all border ${
                useWheelMode 
                  ? 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-white' 
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              {useWheelMode ? 'Wheel Mode: ON' : 'Wheel Mode: OFF'}
            </button>
            <button
              onClick={() => setSmallScreenMode(!smallScreenMode)}
              className={`px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium shadow-sm transition-all border ${
                smallScreenMode 
                  ? 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-white' 
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              {smallScreenMode ? 'Small Screen: ON' : 'Small Screen: OFF'}
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="px-5 py-2.5 md:px-6 md:py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg text-sm md:text-base font-medium shadow-sm transition-all"
            >
              Auto Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`mx-auto flex-1 flex flex-col transition-all duration-300 ${
        smallScreenMode ? 'w-full max-w-[240px] gap-2' : 'w-full max-w-6xl gap-6'
      }`}>
        {smallScreenMode && (
          <div className="text-center mb-1">
            <span className="text-[9px] px-2 py-0.5 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-medium">
              Small Screen (240px)
            </span>
          </div>
        )}
        
        {/* Text Display - Adaptive size */}
        <div className={`flex-1 ${smallScreenMode ? 'min-h-[60px]' : 'min-h-[200px] md:min-h-[300px]'}`}>
          <TextDisplay text={text} compact={smallScreenMode} />
        </div>
        
        {/* Keyboard Section - Properly Sized */}
        <div className={`w-full mx-auto ${smallScreenMode ? 'max-w-full' : 'max-w-4xl'}`}>
          <Keyboard 
            onKeyPress={handleKeyPress} 
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

function Navigation() {
  const location = useLocation()
  
  if (location.pathname === '/researcher') {
    return null
  }

  return (
    <nav className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex gap-2 sm:gap-3">
      <Link
        to="/"
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
          location.pathname === '/'
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
        }`}
      >
        Demo
      </Link>
      <Link
        to="/study"
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
          location.pathname === '/study'
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
        }`}
      >
        Study
      </Link>
      <Link
        to="/researcher"
        className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
      >
        Dashboard
      </Link>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<DemoKeyboard />} />
        <Route path="/study" element={<StudyFlow />} />
        <Route path="/researcher" element={<ResearcherDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
