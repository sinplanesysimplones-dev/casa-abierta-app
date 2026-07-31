'use client'

import { useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import ResultCard from '../components/ResultCard'
import type { IkigaiResponse, QuestionData } from '../types'
import { classifyWithClaude } from '../utils/api'

const QUESTIONS: QuestionData[] = [
  {
    key: 'love',
    question: '¿Qué harías gratis aunque no te pagaran?',
    placeholder: 'Graba tu respuesta...',
    ikigaiPillar: 'Lo que AMO'
  },
  {
    key: 'good',
    question: '¿Qué se te hace fácil, pero notas que a otros les cuesta?',
    placeholder: 'Graba tu respuesta...',
    ikigaiPillar: 'En lo que soy BUENO'
  },
  {
    key: 'needed',
    question: '¿Para qué te busca la gente cuando necesita ayuda?',
    placeholder: 'Graba tu respuesta...',
    ikigaiPillar: 'Lo que el MUNDO NECESITA'
  },
  {
    key: 'paid',
    question: 'Si alguien te pagara hoy mismo por algo que sabes hacer, ¿qué sería?',
    placeholder: 'Graba tu respuesta...',
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
        <div className="loading-spinner">
          <div className="spinner-animation">✨</div>
          <p>Analizando tus respuestas...</p>
        </div>
      </div>
    )
  }

  const question = QUESTIONS[currentQuestion]
  const hasAnswer = answers[question.key].trim().length > 0

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
          className={`btn btn-primary ${!hasAnswer ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!hasAnswer}
        >
          {currentQuestion === QUESTIONS.length - 1 ? '🚀 Ver Mi Arquetipo' : 'Siguiente Pregunta →'}
        </button>
      </div>
    </div>
  )
}
