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

function DemoKeyboard({ 
  useWheelMode, 
  smallScreenMode,
  showDemo,
  setShowDemo
}: {
  useWheelMode: boolean
  smallScreenMode: boolean
  showDemo: boolean
  setShowDemo: (value: boolean) => void
}) {
  const [text, setText] = useState('')
  const [predictions, setPredictions] = useState<string[]>([])
  const [showWheelOverlay, setShowWheelOverlay] = useState(true)

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
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col p-4 pt-4 md:pt-8 md:p-8 relative">
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto mb-4 md:mb-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
            Predictive Text System
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
            Advanced AI-powered keyboard with contextual predictions
          </p>
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

function Navigation({ 
  useWheelMode, 
  setUseWheelMode, 
  smallScreenMode, 
  setSmallScreenMode, 
  setShowDemo 
}: { 
  useWheelMode: boolean
  setUseWheelMode: (value: boolean) => void
  smallScreenMode: boolean
  setSmallScreenMode: (value: boolean) => void
  setShowDemo: (value: boolean) => void
}) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  
  if (location.pathname === '/researcher') {
    return null
  }

  return (
    <nav className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[100]">
      {/* Hamburger button - Mobile only */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md z-[101]"
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span className={`block h-0.5 bg-gray-900 dark:bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block h-0.5 bg-gray-900 dark:bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 bg-gray-900 dark:bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </div>
      </button>

      {/* Menu content - Hidden on mobile unless open, always visible on desktop */}
      <div className={`flex-col gap-1.5 sm:gap-2 ${menuOpen ? 'flex' : 'hidden sm:flex'} absolute top-12 right-0 sm:static bg-white dark:bg-gray-950 sm:bg-transparent border sm:border-0 border-gray-200 dark:border-gray-800 rounded-lg p-2 sm:p-0 shadow-lg sm:shadow-none z-[101]`}>
        {/* Page Navigation */}
        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium border transition-all ${
              location.pathname === '/'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            Demo
          </Link>
          <Link
            to="/study"
            onClick={() => setMenuOpen(false)}
            className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium border transition-all ${
              location.pathname === '/study'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            Study
          </Link>
          <Link
            to="/researcher"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2 rounded-md text-xs sm:text-sm font-medium border transition-all bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
          >
            Dashboard
          </Link>
        </div>
        
        {/* Control Buttons - Only show on Demo page */}
        {location.pathname === '/' && (
          <>
            <div className="block sm:hidden h-px bg-gray-200 dark:bg-gray-800 my-1"></div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setUseWheelMode(!useWheelMode)
                  setMenuOpen(false)
                }}
                className={`px-3 py-2 rounded text-xs font-medium shadow-sm transition-all border whitespace-nowrap ${
                  useWheelMode 
                    ? 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-white' 
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                Wheel: {useWheelMode ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => {
                  setSmallScreenMode(!smallScreenMode)
                  setMenuOpen(false)
                }}
                className={`px-3 py-2 rounded text-xs font-medium shadow-sm transition-all border whitespace-nowrap ${
                  smallScreenMode 
                    ? 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-white' 
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                Small: {smallScreenMode ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => {
                  setShowDemo(true)
                  setMenuOpen(false)
                }}
                className="px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium shadow-sm transition-all whitespace-nowrap"
              >
                Auto Demo
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

function AppContent() {
  const [useWheelMode, setUseWheelMode] = useState(true)
  const [smallScreenMode, setSmallScreenMode] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  
  return (
    <>
      <Navigation 
        useWheelMode={useWheelMode}
        setUseWheelMode={setUseWheelMode}
        smallScreenMode={smallScreenMode}
        setSmallScreenMode={setSmallScreenMode}
        setShowDemo={setShowDemo}
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <DemoKeyboard 
              useWheelMode={useWheelMode}
              smallScreenMode={smallScreenMode}
              showDemo={showDemo}
              setShowDemo={setShowDemo}
            />
          } 
        />
        <Route path="/study" element={<StudyFlow />} />
        <Route path="/researcher" element={<ResearcherDashboard />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
