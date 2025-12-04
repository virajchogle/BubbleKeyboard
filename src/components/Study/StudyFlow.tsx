import { useState, useEffect } from 'react'
import WelcomeScreen from './WelcomeScreen'
import TaskScreen from './TaskScreen'
import QuestionnaireScreen from './QuestionnaireScreen'
import type { QuestionnaireResponses } from './QuestionnaireScreen'
import ResultsScreen from './ResultsScreen'
import { dataLogger } from '../../utils/dataLogger'

const STUDY_SENTENCES = [
  'The quick brown fox jumps over the lazy dog',
  'Machine learning improves user experience significantly',
  'Mobile keyboards should be easy to use',
  'Predictive text helps people type faster',
  'User interfaces adapt to human behavior',
]

type StudyPhase = 'welcome' | 'task' | 'questionnaire' | 'results'

export default function StudyFlow() {
  const [phase, setPhase] = useState<StudyPhase>('welcome')
  const [participantId, setParticipantId] = useState('')
  const [condition, setCondition] = useState<'standard' | 'predictive'>('standard')
  const [currentTask, setCurrentTask] = useState(0)

  const handleStart = (id: string, cond: 'standard' | 'predictive') => {
    setParticipantId(id)
    setCondition(cond)
    dataLogger.startSession(id, cond)
    setPhase('task')
    setCurrentTask(0)
  }

  const handleTaskComplete = () => {
    if (currentTask < STUDY_SENTENCES.length - 1) {
      setCurrentTask(prev => prev + 1)
    } else {
      setPhase('questionnaire')
    }
  }

  const handleQuestionnaireComplete = (responses: QuestionnaireResponses) => {
    // Save questionnaire responses to session
    const session = dataLogger.getCurrentSession()
    if (session) {
      // Store in localStorage with session
      try {
        const stored = localStorage.getItem('bubbleKeyboard_questionnaires') || '{}'
        const questionnaires = JSON.parse(stored)
        questionnaires[session.sessionId] = responses
        localStorage.setItem('bubbleKeyboard_questionnaires', JSON.stringify(questionnaires))
      } catch (error) {
        console.error('Error saving questionnaire:', error)
      }
    }
    dataLogger.endSession()
    setPhase('results')
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (phase !== 'results') {
        dataLogger.endSession()
      }
    }
  }, [phase])

  if (phase === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />
  }

  if (phase === 'task') {
    return (
      <TaskScreen
        taskId={currentTask + 1}
        sentence={STUDY_SENTENCES[currentTask]}
        condition={condition}
        onComplete={handleTaskComplete}
      />
    )
  }

  if (phase === 'questionnaire') {
    return <QuestionnaireScreen onComplete={handleQuestionnaireComplete} />
  }

  if (phase === 'results') {
    return <ResultsScreen participantId={participantId} />
  }

  return null
}

