import { motion, AnimatePresence } from 'framer-motion'

interface PredictionWheelProps {
  predictions: string[]
  onSelect: (letter: string) => void
  onBackspace: () => void
  visible: boolean
  currentText?: string
  compact?: boolean
}

export default function PredictionWheel({
  predictions,
  onSelect,
  onBackspace,
  visible,
  currentText = '',
  compact = false,
}: PredictionWheelProps) {
  if (!visible) {
    return null
  }

  // Determine if we should use uppercase or lowercase
  const shouldCapitalize = () => {
    if (!currentText || currentText.trim().length === 0) {
      return true // Start of sentence
    }
    
    const lastChar = currentText.slice(-1)
    // Capitalize after period, question mark, exclamation mark, or at start
    if (lastChar === '.' || lastChar === '?' || lastChar === '!' || lastChar === ' ' && /[.!?]\s*$/.test(currentText.slice(0, -1))) {
      return true
    }
    
    return false
  }

  // Get top 4 predictions with proper case
  const topPredictions = predictions.slice(0, 4).map(letter => {
    if (!letter) return ''
    
    // Apply context-aware case
    if (shouldCapitalize()) {
      return letter.toUpperCase()
    } else {
      return letter.toLowerCase()
    }
  })
  
  while (topPredictions.length < 4) {
    topPredictions.push('')
  }

  // Responsive sizing: smaller on mobile, larger on desktop
  const wheelSize = compact ? 150 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 240)

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/50 dark:bg-black/50 backdrop-blur-lg z-40 pointer-events-none rounded-lg"
          />
          
          {/* Single unified wheel centered on keyboard */}
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ width: wheelSize, height: wheelSize }}
              className="relative"
            >
              {/* SVG for the entire wheel */}
              <svg
                width={wheelSize}
                height={wheelSize}
                viewBox="0 0 100 100"
                className="absolute inset-0"
              >
                {/* Define the 4 pie slices */}
                {topPredictions.map((letter, index) => {
                  if (!letter) return null
                  
                  // Each slice is 90 degrees (quarter circle)
                  const startAngle = index * 90
                  const endAngle = (index + 1) * 90
                  
                  // Convert to radians
                  const startRad = ((startAngle - 90) * Math.PI) / 180
                  const endRad = ((endAngle - 90) * Math.PI) / 180
                  
                  // Outer arc points
                  const x1 = 50 + 50 * Math.cos(startRad)
                  const y1 = 50 + 50 * Math.sin(startRad)
                  const x2 = 50 + 50 * Math.cos(endRad)
                  const y2 = 50 + 50 * Math.sin(endRad)
                  
                  // Inner arc points (for donut shape with center hole)
                  const innerRadius = 18 // Smaller center for back button
                  const ix1 = 50 + innerRadius * Math.cos(startRad)
                  const iy1 = 50 + innerRadius * Math.sin(startRad)
                  const ix2 = 50 + innerRadius * Math.cos(endRad)
                  const iy2 = 50 + innerRadius * Math.sin(endRad)
                  
                  // Path: outer arc + line to inner arc + inner arc back + close
                  const pathData = `
                    M ${x1} ${y1}
                    A 50 50 0 0 1 ${x2} ${y2}
                    L ${ix2} ${iy2}
                    A ${innerRadius} ${innerRadius} 0 0 0 ${ix1} ${iy1}
                    Z
                  `
                  
                  // Colors by priority - professional grayscale
                  const colors = [
                    '#111827', // gray-900 (highest priority)
                    '#374151', // gray-700
                    '#6B7280', // gray-500
                    '#9CA3AF', // gray-400 (lowest priority)
                  ]
                  
                  return (
                    <motion.path
                      key={`slice-${index}`}
                      d={pathData}
                      fill={colors[index]}
                      className="cursor-pointer transition-all hover:opacity-80"
                      onClick={() => onSelect(letter)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    />
                  )
                })}
                
                {/* Center circle for back button */}
                <circle
                  cx="50"
                  cy="50"
                  r="18"
                  fill="url(#centerGradient)"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={onBackspace}
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#1F2937', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#111827', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                
                {/* Labels on slices - using SVG text for perfect centering */}
                {topPredictions.map((letter, index) => {
                  if (!letter) return null
                  
                  // Calculate the middle angle of each slice
                  const middleAngle = index * 90 + 45
                  const angleRad = ((middleAngle - 90) * Math.PI) / 180
                  
                  // Position at the middle of the donut ring (between inner and outer radius)
                  const textRadius = (50 + 18) / 2 // midpoint between outer (50) and inner (18)
                  
                  const x = 50 + textRadius * Math.cos(angleRad)
                  const y = 50 + textRadius * Math.sin(angleRad)
                  
                  // Display space as visible character
                  const displayChar = letter === ' ' ? '⎵' : letter
                  
                  return (
                    <motion.text
                      key={`label-${index}`}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-white font-bold pointer-events-none select-none"
                      style={{ fontSize: '18px' }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      {displayChar}
                    </motion.text>
                  )
                })}
                
                {/* Center back button - just a back arrow */}
                <motion.text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-white pointer-events-none select-none font-bold"
                  style={{ fontSize: '24px' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ←
                </motion.text>
              </svg>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
