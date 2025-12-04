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
        compact ? 'p-2' : 'p-6 md:p-8 lg:p-10'
      }`}
    >
      <div className={`break-words whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-light ${
        compact ? 'text-xs leading-tight' : 'text-2xl md:text-4xl lg:text-5xl leading-relaxed'
      }`}>
        {text.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-600">
            {compact ? 'Type...' : 'Begin typing to see predictions'}
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
            compact ? 'w-0.5 h-3' : 'w-1 h-8 md:h-12 lg:h-16'
          }`}
        />
      </div>
    </motion.div>
  )
}

