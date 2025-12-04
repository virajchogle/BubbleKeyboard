import { motion } from 'framer-motion'

interface TextDisplayProps {
  text: string
  compact?: boolean
}

export default function TextDisplay({ text, compact = false }: TextDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-y-auto border border-gray-200 dark:border-gray-800 ${
        compact ? 'p-2' : 'p-2 md:p-4 lg:p-6'
      }`}
    >
      <div className={`break-words whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-light ${
        compact ? 'text-xs leading-tight' : 'text-sm md:text-xl lg:text-3xl leading-snug md:leading-relaxed'
      }`}>
        {text.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-600">
            {compact ? 'Type...' : (
              <>
                <span className="md:hidden">Type here...</span>
                <span className="hidden md:inline">Begin typing to see predictions</span>
              </>
            )}
          </span>
        ) : (
          <>
            {text.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                {char}
              </motion.span>
            ))}
          </>
        )}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className={`inline-block bg-gray-900 dark:bg-white ml-1 align-middle ${
            compact ? 'w-0.5 h-3' : 'w-0.5 h-4 md:w-0.5 md:h-6 lg:w-1 lg:h-10'
          }`}
        />
      </div>
    </motion.div>
  )
}

