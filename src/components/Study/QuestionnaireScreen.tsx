import { useState } from 'react'
import { motion } from 'framer-motion'

interface QuestionnaireScreenProps {
  onComplete: (responses: QuestionnaireResponses) => void
}

export interface QuestionnaireResponses {
  difficulty: number
  perceivedSpeed: number
  satisfaction: number
  wouldUse: boolean
  feedback?: string
}

export default function QuestionnaireScreen({ onComplete }: QuestionnaireScreenProps) {
  const [difficulty, setDifficulty] = useState(3)
  const [perceivedSpeed, setPerceivedSpeed] = useState(3)
  const [satisfaction, setSatisfaction] = useState(3)
  const [wouldUse, setWouldUse] = useState<boolean | null>(null)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = () => {
    if (wouldUse === null) {
      alert('Please answer all questions')
      return
    }

    onComplete({
      difficulty,
      perceivedSpeed,
      satisfaction,
      wouldUse,
      feedback: feedback.trim() || undefined,
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 pt-24 sm:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 space-y-6"
      >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post-Study Questionnaire</h2>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          How difficult was it to type? (1 = Very Easy, 5 = Very Difficult)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setDifficulty(value)}
              className={`
                flex-1 py-2.5 rounded-lg font-medium border transition-all
                ${difficulty === value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          How fast did you feel you were typing? (1 = Very Slow, 5 = Very Fast)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setPerceivedSpeed(value)}
              className={`
                flex-1 py-2.5 rounded-lg font-medium border transition-all
                ${perceivedSpeed === value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          How satisfied were you with the keyboard? (1 = Not Satisfied, 5 = Very Satisfied)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setSatisfaction(value)}
              className={`
                flex-1 py-2.5 rounded-lg font-medium border transition-all
                ${satisfaction === value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Would you use this keyboard?
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setWouldUse(true)}
            className={`
              flex-1 py-2.5 rounded-lg font-medium border transition-all
              ${wouldUse === true
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            Yes
          </button>
          <button
            onClick={() => setWouldUse(false)}
            className={`
              flex-1 py-2.5 rounded-lg font-medium border transition-all
              ${wouldUse === false
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            No
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Additional Feedback (Optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px] focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
          placeholder="Any comments or suggestions..."
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium transition-all"
      >
        Submit
      </button>
      </motion.div>
    </div>
  )
}

