import { motion } from 'framer-motion'
import { dataLogger } from '../../utils/dataLogger'
import type { Metrics } from '../../utils/dataLogger'

interface ResultsScreenProps {
  participantId: string
  onExport?: () => void
}

export default function ResultsScreen({ participantId, onExport }: ResultsScreenProps) {
  const session = dataLogger.getCurrentSession()
  const metrics: Metrics = session ? dataLogger.calculateMetrics(session) : {
    wpm: 0,
    cpm: 0,
    errorRate: 0,
    averageInterKeyInterval: 0,
    predictionAccuracy: 0,
    taskCompletionTime: 0,
  }

  const handleExport = () => {
    const jsonData = dataLogger.exportData('json')
    const csvData = dataLogger.exportData('csv')

    // Create download links
    const jsonBlob = new Blob([jsonData], { type: 'application/json' })
    const csvBlob = new Blob([csvData], { type: 'text/csv' })

    const jsonUrl = URL.createObjectURL(jsonBlob)
    const csvUrl = URL.createObjectURL(csvBlob)

    const jsonLink = document.createElement('a')
    jsonLink.href = jsonUrl
    jsonLink.download = `bubble-keyboard-${participantId}-${Date.now()}.json`
    jsonLink.click()

    const csvLink = document.createElement('a')
    csvLink.href = csvUrl
    csvLink.download = `bubble-keyboard-${participantId}-${Date.now()}.csv`
    csvLink.click()

    if (onExport) onExport()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 pt-24 sm:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 space-y-6"
      >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Complete</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Thank you for participating. Here are your results:
      </p>

      <div className="space-y-3">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-500 font-medium mb-1">Words Per Minute</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.wpm.toFixed(1)}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-500 font-medium mb-1">Error Rate</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.errorRate.toFixed(1)}%</div>
        </div>

        {session?.condition === 'predictive' && (
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-500 font-medium mb-1">Prediction Accuracy</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.predictionAccuracy.toFixed(1)}%</div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleExport}
          className="w-full py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium transition-all"
        >
          Export Data
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-500 text-center font-medium">
        Thank you for your participation
      </p>
      </motion.div>
    </div>
  )
}

