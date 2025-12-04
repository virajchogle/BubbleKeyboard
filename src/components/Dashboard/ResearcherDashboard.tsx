import { useState, useEffect } from 'react'
import { dataLogger } from '../../utils/dataLogger'
import type { SessionData, Metrics } from '../../utils/dataLogger'

export default function ResearcherDashboard() {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (authenticated) {
      loadSessions()
    }
  }, [authenticated])

  const loadSessions = () => {
    const allSessions = dataLogger.getAllSessions()
    setSessions(allSessions)
  }

  const handleLogin = () => {
    // Simple password protection - in production, use proper auth
    if (password === 'researcher2024' || password === 'admin') {
      setAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  const calculateAggregateMetrics = () => {
    const standardSessions = sessions.filter(s => s.condition === 'standard')
    const predictiveSessions = sessions.filter(s => s.condition === 'predictive')

    const calculateAvg = (sessions: SessionData[], key: keyof Metrics) => {
      if (sessions.length === 0) return 0
      const sum = sessions.reduce((acc, session) => {
        const metrics = dataLogger.calculateMetrics(session)
        return acc + (metrics[key] as number)
      }, 0)
      return sum / sessions.length
    }

    return {
      totalParticipants: sessions.length,
      standard: {
        count: standardSessions.length,
        avgWpm: calculateAvg(standardSessions, 'wpm'),
        avgErrorRate: calculateAvg(standardSessions, 'errorRate'),
        avgSatisfaction: 0, // Would need to load from questionnaires
      },
      predictive: {
        count: predictiveSessions.length,
        avgWpm: calculateAvg(predictiveSessions, 'wpm'),
        avgErrorRate: calculateAvg(predictiveSessions, 'errorRate'),
        avgPredictionAccuracy: calculateAvg(predictiveSessions, 'predictionAccuracy'),
        avgSatisfaction: 0,
      },
    }
  }

  const handleExportAll = () => {
    const jsonData = dataLogger.exportData('json')
    const csvData = dataLogger.exportData('csv')

    const jsonBlob = new Blob([jsonData], { type: 'application/json' })
    const csvBlob = new Blob([csvData], { type: 'text/csv' })

    const jsonUrl = URL.createObjectURL(jsonBlob)
    const csvUrl = URL.createObjectURL(csvBlob)

    const jsonLink = document.createElement('a')
    jsonLink.href = jsonUrl
    jsonLink.download = `bubble-keyboard-all-sessions-${Date.now()}.json`
    jsonLink.click()

    const csvLink = document.createElement('a')
    csvLink.href = csvUrl
    csvLink.download = `bubble-keyboard-all-sessions-${Date.now()}.csv`
    csvLink.click()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Researcher Dashboard</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              placeholder="Enter password"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  const metrics = calculateAggregateMetrics()
  const improvement = metrics.standard.avgWpm > 0
    ? ((metrics.predictive.avgWpm - metrics.standard.avgWpm) / metrics.standard.avgWpm) * 100
    : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Researcher Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={loadSessions}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              Refresh
            </button>
            <button
              onClick={handleExportAll}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Export All Data
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Participants</div>
            <div className="text-3xl font-bold">{metrics.totalParticipants}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Standard Condition</div>
            <div className="text-3xl font-bold">{metrics.standard.count}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Predictive Condition</div>
            <div className="text-3xl font-bold">{metrics.predictive.count}</div>
          </div>
        </div>

        {/* Comparison Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Average WPM</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Standard</span>
                  <span className="font-semibold">{metrics.standard.avgWpm.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${Math.min((metrics.standard.avgWpm / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Predictive</span>
                  <span className="font-semibold">{metrics.predictive.avgWpm.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${Math.min((metrics.predictive.avgWpm / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>
              {improvement !== 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}% improvement
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Average Error Rate</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Standard</span>
                  <span className="font-semibold">{metrics.standard.avgErrorRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-red-500 h-4 rounded-full"
                    style={{ width: `${Math.min(metrics.standard.avgErrorRate, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Predictive</span>
                  <span className="font-semibold">{metrics.predictive.avgErrorRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-orange-500 h-4 rounded-full"
                    style={{ width: `${Math.min(metrics.predictive.avgErrorRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">All Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2">Session ID</th>
                  <th className="text-left p-2">Participant</th>
                  <th className="text-left p-2">Condition</th>
                  <th className="text-left p-2">WPM</th>
                  <th className="text-left p-2">Error Rate</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const metrics = dataLogger.calculateMetrics(session)
                  return (
                    <tr
                      key={session.sessionId}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => setSelectedSession(session)}
                    >
                      <td className="p-2 font-mono text-xs">{session.sessionId.slice(-8)}</td>
                      <td className="p-2">{session.participantId}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded ${
                            session.condition === 'predictive'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}
                        >
                          {session.condition}
                        </span>
                      </td>
                      <td className="p-2">{metrics.wpm.toFixed(1)}</td>
                      <td className="p-2">{metrics.errorRate.toFixed(1)}%</td>
                      <td className="p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const json = JSON.stringify(session, null, 2)
                            const blob = new Blob([json], { type: 'application/json' })
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = `session-${session.sessionId}.json`
                            link.click()
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Export
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Session Detail Modal */}
        {selectedSession && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSession(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Session Details</h3>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <strong>Session ID:</strong> {selectedSession.sessionId}
                </div>
                <div>
                  <strong>Participant:</strong> {selectedSession.participantId}
                </div>
                <div>
                  <strong>Condition:</strong> {selectedSession.condition}
                </div>
                <div>
                  <strong>Metrics:</strong>
                  <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded overflow-x-auto">
                    {JSON.stringify(dataLogger.calculateMetrics(selectedSession), null, 2)}
                  </pre>
                </div>
                <div>
                  <strong>Keystrokes:</strong> {selectedSession.keystrokes.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

