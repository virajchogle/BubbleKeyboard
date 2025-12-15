import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { predictNextLetters } from '../../utils/apiPredictor'

interface AppleWatchSimulatorProps {
  onClose?: () => void
}

export default function AppleWatchSimulator({ onClose }: AppleWatchSimulatorProps) {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [predictions, setPredictions] = useState<string[]>([])
  const [showWheel, setShowWheel] = useState(true) // Start with wheel view to showcase bubble keyboard
  const [isShift, setIsShift] = useState(true) // Start with shift on for first letter
  const [watchColor, setWatchColor] = useState<'blue' | 'black' | 'silver'>('blue')

  // Fetch initial predictions
  useEffect(() => {
    predictNextLetters('', true).then(preds => {
      setPredictions(preds.map(p => p.letter))
    })
  }, [])

  // Update predictions when text changes
  useEffect(() => {
    let cancelled = false
    predictNextLetters(text, true).then(preds => {
      if (!cancelled) {
        setPredictions(preds.map(p => p.letter))
      }
    })
    return () => { cancelled = true }
  }, [text])

  // Auto-shift after sentence ending
  useEffect(() => {
    if (!text) {
      setIsShift(true)
    } else {
      const lastChar = text.slice(-1)
      if (lastChar === '.' || lastChar === '?' || lastChar === '!') {
        setIsShift(true)
      }
    }
  }, [text])

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === 'Backspace') {
        e.preventDefault()
        setText(prev => prev.slice(0, -1))
      } else if (e.key === ' ') {
        e.preventDefault()
        setText(prev => prev + ' ')
        setIsShift(false)
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        e.preventDefault()
        const char = isShift ? e.key.toUpperCase() : e.key.toLowerCase()
        setText(prev => prev + char)
        setIsShift(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [text, isShift])

  const handleKeyPress = (key: string) => {
    if (key === 'Backspace') {
      setText(prev => prev.slice(0, -1))
    } else if (key === 'Space') {
      setText(prev => prev + ' ')
      setIsShift(false)
    } else if (key === 'Shift') {
      setIsShift(prev => !prev)
    } else {
      const char = isShift ? key.toUpperCase() : key.toLowerCase()
      setText(prev => prev + char)
      setIsShift(false)
    }
  }

  const handleWheelSelect = (letter: string) => {
    setText(prev => prev + letter)
    setIsShift(false)
  }

  // Remove duplicates and get predictions
  const uniquePredictions = predictions.reduce((acc: string[], letter) => {
    if (!letter) return acc
    const normalizedLetter = letter.toUpperCase()
    if (!acc.some(l => l.toUpperCase() === normalizedLetter)) {
      acc.push(letter)
    }
    return acc
  }, []).slice(0, 4)

  const topPredictions = uniquePredictions.map(letter => {
    if (!letter) return ''
    return isShift ? letter.toUpperCase() : letter.toLowerCase()
  })

  while (topPredictions.length < 4) {
    topPredictions.push('')
  }

  // Watch case colors
  const caseColors = {
    blue: {
      body: 'linear-gradient(145deg, #4a6fa5 0%, #2d4a73 50%, #4a6fa5 100%)',
      bezel: 'linear-gradient(145deg, #5a7fb5, #3d5a83)',
      crown: 'linear-gradient(90deg, #3d5a83, #5a7fb5, #3d5a83)',
      name: 'Blue'
    },
    black: {
      body: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
      bezel: 'linear-gradient(145deg, #2a2a2a, #0a0a0a)',
      crown: 'linear-gradient(90deg, #1a1a1a, #333, #1a1a1a)',
      name: 'Midnight'
    },
    silver: {
      body: 'linear-gradient(145deg, #d4d4d4 0%, #a8a8a8 50%, #d4d4d4 100%)',
      bezel: 'linear-gradient(145deg, #e0e0e0, #b0b0b0)',
      crown: 'linear-gradient(90deg, #c0c0c0, #e0e0e0, #c0c0c0)',
      name: 'Silver'
    }
  }

  const handleBack = () => {
    if (onClose) {
      onClose()
    } else {
      navigate('/')
    }
  }

  const handleSend = () => {
    if (text.trim()) {
      alert(`Message sent: "${text}"`)
      setText('')
      setIsShift(true)
    }
  }

  const handleCancel = () => {
    setText('')
    setIsShift(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 relative">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          ← Back
        </button>
        
        {/* Color Selector */}
        <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1.5 border border-gray-200 dark:border-gray-700 shadow-sm">
          {(['blue', 'black', 'silver'] as const).map((color) => (
            <button
              key={color}
              onClick={() => setWatchColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                watchColor === color ? 'border-blue-500 scale-110' : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{
                background: color === 'blue' ? '#4a6fa5' : color === 'black' ? '#1a1a1a' : '#d4d4d4'
              }}
              title={caseColors[color].name}
            />
          ))}
        </div>
      </div>

      {/* Apple Watch Frame */}
      <div className="relative mt-8">
        {/* Watch Body */}
        <div 
          className="relative rounded-[52px] p-[4px]"
          style={{
            background: caseColors[watchColor].body,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.15)',
          }}
        >
          {/* Inner bezel */}
          <div 
            className="rounded-[48px] p-[3px]"
            style={{
              background: caseColors[watchColor].bezel,
            }}
          >
            {/* Watch Screen - OLED Black */}
            <div 
              className="w-[200px] h-[244px] rounded-[45px] overflow-hidden relative"
              style={{
                background: '#000',
              }}
            >
              {/* Header Bar - Cancel & Send */}
              <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-3 flex justify-between items-center">
                <button 
                  onClick={handleCancel}
                  className="text-[15px] font-normal text-white"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSend}
                  className="text-[15px] font-semibold"
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    color: '#007AFF'
                  }}
                >
                  Send
                </button>
              </div>

              {/* Main Content Area */}
              <div className="absolute inset-0 pt-[42px] pb-2 px-2 flex flex-col">
                {/* Text Input Row */}
                <div className="flex items-center gap-1 mb-3 px-1">
                  <div className="flex-1 flex items-center">
                    <span 
                      className="text-[17px] text-white"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                    >
                      {text || <span className="text-gray-500">Message</span>}
                    </span>
                    <motion.span 
                      className="w-[2px] h-[18px] bg-[#007AFF] ml-0.5"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  {/* Backspace button */}
                  <motion.button
                    onClick={() => handleKeyPress('Backspace')}
                    whileTap={{ scale: 0.9 }}
                    className="w-[28px] h-[28px] rounded-full bg-[#3a3a3c] flex items-center justify-center"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 7L4 12L9 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9 7H18C19.1046 7 20 7.89543 20 9V15C20 16.1046 19.1046 17 18 17H9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="14" y1="10" x2="16" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="16" y1="10" x2="14" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </motion.button>
                </div>

                {/* Keyboard / Wheel Area */}
                <div className="flex-1 relative">
                  <AnimatePresence mode="wait">
                    {showWheel ? (
                      <motion.div
                        key="wheel"
                        initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                      >
                        {/* Bubble Wheel Label */}
                        <div className="text-[10px] text-[#30d158] font-semibold mb-1 tracking-wider">
                          BUBBLE WHEEL
                        </div>
                        
                        {/* Prediction Wheel */}
                        <div className="relative w-[120px] h-[120px]">
                          <svg
                            width="120"
                            height="120"
                            viewBox="0 0 100 100"
                            className="absolute inset-0"
                          >
                            {/* Outer glow ring */}
                            <circle
                              cx="50"
                              cy="50"
                              r="48"
                              fill="none"
                              stroke="#30d158"
                              strokeWidth="1"
                              opacity="0.3"
                            />
                            
                            {/* Pie segments */}
                            {topPredictions.map((letter, index) => {
                              if (!letter) return null
                              
                              const startAngle = index * 90
                              const endAngle = (index + 1) * 90
                              const startRad = ((startAngle - 90) * Math.PI) / 180
                              const endRad = ((endAngle - 90) * Math.PI) / 180
                              
                              const outerRadius = 46
                              const innerRadius = 16
                              
                              const x1 = 50 + outerRadius * Math.cos(startRad)
                              const y1 = 50 + outerRadius * Math.sin(startRad)
                              const x2 = 50 + outerRadius * Math.cos(endRad)
                              const y2 = 50 + outerRadius * Math.sin(endRad)
                              const ix1 = 50 + innerRadius * Math.cos(startRad)
                              const iy1 = 50 + innerRadius * Math.sin(startRad)
                              const ix2 = 50 + innerRadius * Math.cos(endRad)
                              const iy2 = 50 + innerRadius * Math.sin(endRad)
                              
                              const pathData = `
                                M ${x1} ${y1}
                                A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2}
                                L ${ix2} ${iy2}
                                A ${innerRadius} ${innerRadius} 0 0 0 ${ix1} ${iy1}
                                Z
                              `
                              
                              // Green gradient - brightest for top prediction
                              const colors = ['#34c759', '#2eb84d', '#28a745', '#22963d']
                              
                              return (
                                <motion.path
                                  key={`slice-${index}`}
                                  d={pathData}
                                  fill={colors[index]}
                                  className="cursor-pointer"
                                  onClick={() => handleWheelSelect(letter)}
                                  whileHover={{ filter: 'brightness(1.3)' }}
                                  whileTap={{ scale: 0.95 }}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05, type: 'spring' }}
                                  style={{
                                    filter: index === 0 ? 'drop-shadow(0 0 6px rgba(52, 199, 89, 0.6))' : 'none'
                                  }}
                                />
                              )
                            })}
                            
                            {/* Segment dividers */}
                            {[0, 90, 180, 270].map((angle) => {
                              const rad = ((angle - 90) * Math.PI) / 180
                              const x1 = 50 + 16 * Math.cos(rad)
                              const y1 = 50 + 16 * Math.sin(rad)
                              const x2 = 50 + 46 * Math.cos(rad)
                              const y2 = 50 + 46 * Math.sin(rad)
                              return (
                                <line
                                  key={angle}
                                  x1={x1} y1={y1} x2={x2} y2={y2}
                                  stroke="#000"
                                  strokeWidth="2"
                                  opacity="0.4"
                                />
                              )
                            })}
                            
                            {/* Center button */}
                            <circle
                              cx="50"
                              cy="50"
                              r="14"
                              fill="#1c1c1e"
                              stroke="#3a3a3c"
                              strokeWidth="1"
                              className="cursor-pointer"
                              onClick={() => setShowWheel(false)}
                            />
                            
                            {/* Letter labels */}
                            {topPredictions.map((letter, index) => {
                              if (!letter) return null
                              const middleAngle = index * 90 + 45
                              const angleRad = ((middleAngle - 90) * Math.PI) / 180
                              const textRadius = 31
                              const x = 50 + textRadius * Math.cos(angleRad)
                              const y = 50 + textRadius * Math.sin(angleRad)
                              
                              return (
                                <text
                                  key={`label-${index}`}
                                  x={x}
                                  y={y}
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fill="white"
                                  fontSize={index === 0 ? "20" : "17"}
                                  fontWeight="700"
                                  fontFamily="-apple-system, 'SF Pro Display', sans-serif"
                                  className="pointer-events-none"
                                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                                >
                                  {letter === ' ' ? '␣' : letter}
                                </text>
                              )
                            })}
                            
                            {/* Center ABC label */}
                            <text
                              x="50"
                              y="50"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#8e8e93"
                              fontSize="9"
                              fontWeight="600"
                              className="pointer-events-none"
                            >
                              ABC
                            </text>
                          </svg>
                        </div>
                        
                        {/* Keyboard toggle button */}
                        <motion.button
                          onClick={() => setShowWheel(false)}
                          whileTap={{ scale: 0.95 }}
                          className="mt-2 px-4 py-1 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#2c2c2e' }}
                        >
                          <span className="text-[10px] font-medium text-white">⌨ Keyboard</span>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="keyboard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col justify-start"
                      >
                        {/* QWERTY Keyboard - Bubble Style with scaling */}
                        <div className="flex flex-col gap-[5px]">
                          {/* Row 1: q w e r t y u i o p */}
                          <div className="flex justify-center gap-[2px] items-end h-[32px]">
                            {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((key) => {
                              const predIndex = predictions.findIndex(p => p.toLowerCase() === key)
                              const isPredicted = predIndex !== -1
                              const scale = isPredicted ? [1.35, 1.25, 1.15, 1.1][predIndex] || 1.1 : 1
                              return (
                                <motion.button
                                  key={key}
                                  onClick={() => handleKeyPress(key)}
                                  whileTap={{ scale: 0.85 }}
                                  animate={{ scale }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  className="w-[17px] h-[26px] rounded-[5px] flex items-center justify-center"
                                  style={{
                                    backgroundColor: isPredicted ? '#30d158' : '#2c2c2e',
                                    fontSize: isPredicted ? '15px' : '13px',
                                    fontWeight: isPredicted ? '600' : '400',
                                    fontFamily: '-apple-system, "SF Pro Text", sans-serif',
                                    color: isPredicted ? '#000' : '#fff',
                                    zIndex: isPredicted ? 10 : 1,
                                    boxShadow: isPredicted ? '0 2px 8px rgba(48, 209, 88, 0.5)' : 'none',
                                  }}
                                >
                                  {isShift ? key.toUpperCase() : key}
                                </motion.button>
                              )
                            })}
                          </div>
                          
                          {/* Row 2: a s d f g h j k l */}
                          <div className="flex justify-center gap-[2px] items-end h-[32px]">
                            {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map((key) => {
                              const predIndex = predictions.findIndex(p => p.toLowerCase() === key)
                              const isPredicted = predIndex !== -1
                              const scale = isPredicted ? [1.35, 1.25, 1.15, 1.1][predIndex] || 1.1 : 1
                              return (
                                <motion.button
                                  key={key}
                                  onClick={() => handleKeyPress(key)}
                                  whileTap={{ scale: 0.85 }}
                                  animate={{ scale }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  className="w-[17px] h-[26px] rounded-[5px] flex items-center justify-center"
                                  style={{
                                    backgroundColor: isPredicted ? '#30d158' : '#2c2c2e',
                                    fontSize: isPredicted ? '15px' : '13px',
                                    fontWeight: isPredicted ? '600' : '400',
                                    fontFamily: '-apple-system, "SF Pro Text", sans-serif',
                                    color: isPredicted ? '#000' : '#fff',
                                    zIndex: isPredicted ? 10 : 1,
                                    boxShadow: isPredicted ? '0 2px 8px rgba(48, 209, 88, 0.5)' : 'none',
                                  }}
                                >
                                  {isShift ? key.toUpperCase() : key}
                                </motion.button>
                              )
                            })}
                          </div>
                          
                          {/* Row 3: ⇧ z x c v b n m [123] */}
                          <div className="flex justify-center gap-[2px] items-end h-[32px]">
                            {/* Shift key */}
                            <motion.button
                              onClick={() => handleKeyPress('Shift')}
                              whileTap={{ scale: 0.9 }}
                              className="w-[22px] h-[26px] rounded-[5px] flex items-center justify-center"
                              style={{
                                backgroundColor: isShift ? '#fff' : '#2c2c2e',
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path 
                                  d="M12 4L4 12H8V20H16V12H20L12 4Z" 
                                  stroke={isShift ? '#000' : '#fff'} 
                                  strokeWidth="2" 
                                  fill={isShift ? '#000' : 'none'}
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </motion.button>
                            
                            {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((key) => {
                              const predIndex = predictions.findIndex(p => p.toLowerCase() === key)
                              const isPredicted = predIndex !== -1
                              const scale = isPredicted ? [1.35, 1.25, 1.15, 1.1][predIndex] || 1.1 : 1
                              return (
                                <motion.button
                                  key={key}
                                  onClick={() => handleKeyPress(key)}
                                  whileTap={{ scale: 0.85 }}
                                  animate={{ scale }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  className="w-[17px] h-[26px] rounded-[5px] flex items-center justify-center"
                                  style={{
                                    backgroundColor: isPredicted ? '#30d158' : '#2c2c2e',
                                    fontSize: isPredicted ? '15px' : '13px',
                                    fontWeight: isPredicted ? '600' : '400',
                                    fontFamily: '-apple-system, "SF Pro Text", sans-serif',
                                    color: isPredicted ? '#000' : '#fff',
                                    zIndex: isPredicted ? 10 : 1,
                                    boxShadow: isPredicted ? '0 2px 8px rgba(48, 209, 88, 0.5)' : 'none',
                                  }}
                                >
                                  {isShift ? key.toUpperCase() : key}
                                </motion.button>
                              )
                            })}
                            
                            {/* 123 key */}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="w-[22px] h-[26px] rounded-[5px] flex items-center justify-center"
                              style={{
                                backgroundColor: '#2c2c2e',
                                fontSize: '9px',
                                fontWeight: '500',
                                fontFamily: '-apple-system, "SF Pro Text", sans-serif',
                                color: '#fff',
                              }}
                            >
                              123
                            </motion.button>
                          </div>
                          
                          {/* Row 4: SPACE */}
                          <div className="flex justify-center mt-1">
                            <motion.button
                              onClick={() => handleKeyPress('Space')}
                              whileTap={{ scale: 0.95, backgroundColor: '#505050' }}
                              className="px-6 h-[26px] rounded-[5px] flex items-center justify-center"
                              style={{
                                backgroundColor: '#2c2c2e',
                                fontSize: '11px',
                                fontWeight: '500',
                                fontFamily: '-apple-system, "SF Pro Text", sans-serif',
                                color: '#fff',
                              }}
                            >
                              SPACE
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* Bottom icons row */}
                        <div className="flex justify-between items-center px-3 mt-2">
                          {/* Emoji */}
                          <button className="text-[18px]">😊</button>
                          
                          {/* Bubble Wheel toggle */}
                          <motion.button
                            onClick={() => setShowWheel(true)}
                            whileTap={{ scale: 0.9 }}
                            className="px-3 py-1 rounded-full flex items-center justify-center gap-1"
                            style={{ backgroundColor: '#30d158' }}
                          >
                            <span className="text-[10px] font-semibold text-black">Wheel</span>
                          </motion.button>
                          
                          {/* Microphone */}
                          <button>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <rect x="9" y="2" width="6" height="12" rx="3" stroke="#fff" strokeWidth="2"/>
                              <path d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M12 19V22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Screen edge highlight */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-[45px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Digital Crown */}
        <div 
          className="absolute right-[-12px] top-[60px] w-[12px] h-[36px] rounded-r-[5px]"
          style={{
            background: caseColors[watchColor].crown,
            boxShadow: '2px 0 6px rgba(0,0,0,0.4)',
          }}
        >
          {/* Crown ridges */}
          <div className="absolute inset-x-[2px] top-[4px] bottom-[4px] flex flex-col justify-between">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[1px] bg-black opacity-30" />
            ))}
          </div>
        </div>
        
        {/* Side Button */}
        <div 
          className="absolute right-[-10px] top-[108px] w-[10px] h-[22px] rounded-r-[3px]"
          style={{
            background: caseColors[watchColor].crown,
            boxShadow: '2px 0 4px rgba(0,0,0,0.3)',
          }}
        />

        {/* Band slots */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 -top-[6px] w-[100px] h-[10px] rounded-t-md"
          style={{
            background: watchColor === 'blue' 
              ? 'linear-gradient(180deg, #2d4a73, #4a6fa5)' 
              : watchColor === 'black'
              ? 'linear-gradient(180deg, #0a0a0a, #1a1a1a)'
              : 'linear-gradient(180deg, #a0a0a0, #c0c0c0)',
          }}
        />
        <div 
          className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-[100px] h-[10px] rounded-b-md"
          style={{
            background: watchColor === 'blue' 
              ? 'linear-gradient(0deg, #2d4a73, #4a6fa5)' 
              : watchColor === 'black'
              ? 'linear-gradient(0deg, #0a0a0a, #1a1a1a)'
              : 'linear-gradient(0deg, #a0a0a0, #c0c0c0)',
          }}
        />
      </div>

      {/* Info Panel */}
      <div className="mt-8 text-center max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Apple Watch Series 9 • 45mm • {caseColors[watchColor].name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Bubble Wheel Keyboard Demo
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Green keys = predicted</span>
          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Tap ◎ for wheel mode</span>
          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Physical keyboard works</span>
        </div>
      </div>
    </div>
  )
}
