import { useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import ResultCard from '../components/ResultCard'
import type { IkigaiResponse, QuestionData } from '../types'
import { classifyWithClaude } from '../utils/api'
import '../styles/Play.css'

const QUESTIONS: QuestionData[] = [
  {
    key: 'love',
    question: '¿Qué harías gratis aunque no te pagaran?',
    placeholder: 'Escribe tu respuesta...',
    ikigaiPillar: 'Lo que AMO'
  },
  {
    key: 'good',
    question: '¿Qué se te hace fácil, pero notas que a otros les cuesta?',
    placeholder: 'Escribe tu respuesta...',
    ikigaiPillar: 'En lo que soy BUENO'
  },
  {
    key: 'needed',
    question: '¿Para qué te busca la gente cuando necesita ayuda?',
    placeholder: 'Escribe tu respuesta...',
    ikigaiPillar: 'Lo que el MUNDO NECESITA'
  },
  {
    key: 'paid',
    question: 'Si alguien te pagara hoy mismo por algo que sabes hacer, ¿qué sería?',
    placeholder: 'Escribe tu respuesta...',
    ikigaiPillar: 'Lo que me pueden PAGAR'
  }
]

export default function Play() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({
    love: '',
    good: '',
    needed: '',
    paid: ''
  })
  const [result, setResult] = useState<IkigaiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnswerChange = (text: string) => {
    const question = QUESTIONS[currentQuestion]
    setAnswers(prev => ({
      ...prev,
      [question.key]: text
    }))
  }

  const handleNext = async () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      await submitAnswers()
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitAnswers = async () => {
    setLoading(true)
    try {
      const classifiedResult = await classifyWithClaude(answers)
      const response: IkigaiResponse = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        answers,
        result: classifiedResult
      }
      setResult(response)
    } catch (error) {
      console.error('Error clasificando respuestas:', error)
      alert('Error al procesar tus respuestas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return <ResultCard response={result} onRestart={() => {
      setResult(null)
      setCurrentQuestion(0)
      setAnswers({ love: '', good: '', needed: '', paid: '' })
    }} />
  }

  if (loading) {
    return (
      <div className="play-container loading">
        <div className="loading-spinner">Analizando tus respuestas...</div>
      </div>
    )
  }

  const question = QUESTIONS[currentQuestion]

  return (
    <div className="play-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <QuestionCard
        question={question}
        answer={answers[question.key]}
        onAnswerChange={handleAnswerChange}
        questionNumber={currentQuestion + 1}
        totalQuestions={QUESTIONS.length}
      />

      <div className="button-group">
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          ← Anterior
        </button>

        <button
          className={`btn btn-primary ${!answers[question.key].trim() ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!answers[question.key].trim()}
        >
          {currentQuestion === QUESTIONS.length - 1 ? 'Ver Resultado' : 'Siguiente →'}
        </button>
      </div>
    </div>
  )
}
