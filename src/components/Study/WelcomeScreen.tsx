import { useState } from 'react'
import { motion } from 'framer-motion'

interface WelcomeScreenProps {
  onStart: (participantId: string, condition: 'standard' | 'predictive') => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [participantId, setParticipantId] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)

  const handleStart = () => {
    if (!participantId.trim()) {
      alert('Please enter a participant ID')
      return
    }

    // Randomly assign condition
    const condition = Math.random() < 0.5 ? 'standard' : 'predictive'
    onStart(participantId.trim(), condition)
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 pt-24 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
        >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Instructions</h2>
        <div className="space-y-4 text-left text-gray-700 dark:text-gray-300">
          <p>You will be asked to type 5 sentences using the keyboard.</p>
          <p>Please type as quickly and accurately as possible.</p>
          <p>Use the backspace key to correct any mistakes.</p>
          <p>Click "Continue to Next Task" when you finish typing each sentence.</p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowInstructions(false)}
            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium transition-all"
          >
            Back
          </button>
          <button
            onClick={handleStart}
            className="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium transition-all"
          >
            Start Study
          </button>
        </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 pt-24 sm:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
      >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Thank you for participating in this keyboard study.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Participant ID
        </label>
        <input
          type="text"
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
          placeholder="Enter your participant ID"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowInstructions(true)}
          className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium transition-all"
        >
          Instructions
        </button>
        <button
          onClick={handleStart}
          disabled={!participantId.trim()}
          className="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start
        </button>
      </div>
      </motion.div>
    </div>
  )
}

