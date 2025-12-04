export interface KeystrokeEvent {
  timestamp: number
  key: string
  isPredicted: boolean
  confidence?: number
  position: number
  isBackspace: boolean
}

export interface SessionData {
  sessionId: string
  participantId: string
  condition: 'standard' | 'predictive'
  startTime: number
  endTime?: number
  keystrokes: KeystrokeEvent[]
  tasks: TaskData[]
}

export interface TaskData {
  taskId: number
  sentence: string
  startTime: number
  endTime?: number
  keystrokes: KeystrokeEvent[]
  errors: number
}

export interface Metrics {
  wpm: number
  cpm: number
  errorRate: number
  averageInterKeyInterval: number
  predictionAccuracy: number
  taskCompletionTime: number
}

class DataLogger {
  private currentSession: SessionData | null = null
  private currentTask: TaskData | null = null

  startSession(participantId: string, condition: 'standard' | 'predictive'): string {
    if (!participantId || participantId.trim().length === 0) {
      throw new Error('Participant ID is required')
    }
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    
    this.currentSession = {
      sessionId,
      participantId: participantId.trim(),
      condition,
      startTime: Date.now(),
      keystrokes: [],
      tasks: [],
    }

    this.saveToLocalStorage()
    return sessionId
  }

  startTask(taskId: number, sentence: string): void {
    if (!this.currentSession) {
      console.warn('No active session. Creating a default session.')
      this.startSession('unknown', 'standard')
    }

    // End previous task if exists
    if (this.currentTask) {
      this.endTask()
    }

    this.currentTask = {
      taskId,
      sentence: sentence || '',
      startTime: Date.now(),
      keystrokes: [],
      errors: 0,
    }
  }

  logKeystroke(
    key: string,
    isPredicted: boolean = false,
    confidence?: number,
    currentText: string = ''
  ): void {
    if (!this.currentSession) {
      console.warn('No active session. Keystroke not logged.')
      return
    }

    const now = Date.now()
    const isBackspace = key === 'Backspace'
    const position = currentText.length

    const event: KeystrokeEvent = {
      timestamp: now,
      key,
      isPredicted,
      confidence,
      position,
      isBackspace,
    }

    this.currentSession.keystrokes.push(event)

    if (this.currentTask) {
      this.currentTask.keystrokes.push(event)
      if (isBackspace) {
        this.currentTask.errors++
      }
    }

    this.saveToLocalStorage()
  }

  logError(): void {
    if (this.currentTask) {
      this.currentTask.errors++
    }
    this.saveToLocalStorage()
  }

  endTask(): void {
    if (this.currentTask) {
      this.currentTask.endTime = Date.now()
      if (this.currentSession) {
        this.currentSession.tasks.push(this.currentTask)
      }
      this.currentTask = null
    }
    this.saveToLocalStorage()
  }

  endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now()
      this.saveToLocalStorage()
      this.currentSession = null
    }
  }

  calculateMetrics(sessionData?: SessionData): Metrics {
    const session = sessionData || this.currentSession
    if (!session || session.keystrokes.length === 0) {
      return {
        wpm: 0,
        cpm: 0,
        errorRate: 0,
        averageInterKeyInterval: 0,
        predictionAccuracy: 0,
        taskCompletionTime: 0,
      }
    }

    const keystrokes = session.keystrokes
    const totalTime = (session.endTime || Date.now()) - session.startTime
    const totalTimeMinutes = totalTime / 60000

    // Calculate characters typed (excluding backspaces)
    const charactersTyped = keystrokes.filter(k => !k.isBackspace).length
    const wordsTyped = charactersTyped / 5 // Average word length is 5 characters

    // WPM and CPM
    const wpm = wordsTyped / totalTimeMinutes
    const cpm = charactersTyped / totalTimeMinutes

    // Error rate
    const backspaces = keystrokes.filter(k => k.isBackspace).length
    const errorRate = keystrokes.length > 0 ? backspaces / keystrokes.length : 0

    // Average inter-key interval
    const intervals: number[] = []
    for (let i = 1; i < keystrokes.length; i++) {
      intervals.push(keystrokes[i].timestamp - keystrokes[i - 1].timestamp)
    }
    const averageInterKeyInterval =
      intervals.length > 0
        ? intervals.reduce((a, b) => a + b, 0) / intervals.length
        : 0

    // Prediction accuracy (only for predictive condition)
    let predictionAccuracy = 0
    if (session.condition === 'predictive') {
      const predictedKeystrokes = keystrokes.filter(k => k.isPredicted && !k.isBackspace)
      predictionAccuracy =
        predictedKeystrokes.length > 0
          ? predictedKeystrokes.length / keystrokes.filter(k => !k.isBackspace).length
          : 0
    }

    // Task completion time
    const taskCompletionTime = session.tasks.reduce((sum, task) => {
      const taskTime = (task.endTime || Date.now()) - task.startTime
      return sum + taskTime
    }, 0)

    return {
      wpm: Math.round(wpm * 100) / 100,
      cpm: Math.round(cpm * 100) / 100,
      errorRate: Math.round(errorRate * 10000) / 100, // Percentage
      averageInterKeyInterval: Math.round(averageInterKeyInterval),
      predictionAccuracy: Math.round(predictionAccuracy * 10000) / 100, // Percentage
      taskCompletionTime: Math.round(taskCompletionTime / 1000), // Seconds
    }
  }

  exportData(format: 'json' | 'csv' = 'json'): string {
    const allSessions = this.getAllSessions()
    
    if (format === 'json') {
      return JSON.stringify(allSessions, null, 2)
    } else {
      // CSV format
      const headers = [
        'Session ID',
        'Participant ID',
        'Condition',
        'Start Time',
        'End Time',
        'WPM',
        'CPM',
        'Error Rate %',
        'Prediction Accuracy %',
        'Total Keystrokes',
        'Total Errors',
      ]

      const rows = allSessions.map(session => {
        const metrics = this.calculateMetrics(session)
        return [
          session.sessionId,
          session.participantId,
          session.condition,
          new Date(session.startTime).toISOString(),
          session.endTime ? new Date(session.endTime).toISOString() : '',
          metrics.wpm.toString(),
          metrics.cpm.toString(),
          metrics.errorRate.toString(),
          metrics.predictionAccuracy.toString(),
          session.keystrokes.length.toString(),
          session.keystrokes.filter(k => k.isBackspace).length.toString(),
        ]
      })

      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
  }

  getAllSessions(): SessionData[] {
    try {
      const stored = localStorage.getItem('bubbleKeyboard_sessions')
      if (!stored) return []
      return JSON.parse(stored)
    } catch (error) {
      console.error('Error reading sessions from localStorage:', error)
      return []
    }
  }

  getCurrentSession(): SessionData | null {
    return this.currentSession
  }

  private saveToLocalStorage(): void {
    if (!this.currentSession) return

    try {
      const allSessions = this.getAllSessions()
      const existingIndex = allSessions.findIndex(
        s => s.sessionId === this.currentSession!.sessionId
      )

      if (existingIndex >= 0) {
        allSessions[existingIndex] = this.currentSession
      } else {
        allSessions.push(this.currentSession)
      }

      localStorage.setItem('bubbleKeyboard_sessions', JSON.stringify(allSessions))
    } catch (error) {
      console.error('Error saving session to localStorage:', error)
    }
  }

  clearAllData(): void {
    localStorage.removeItem('bubbleKeyboard_sessions')
    this.currentSession = null
    this.currentTask = null
  }
}

export const dataLogger = new DataLogger()

