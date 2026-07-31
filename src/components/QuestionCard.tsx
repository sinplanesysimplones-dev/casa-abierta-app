'use client'

import type { QuestionData } from '../types'

interface Props {
  question: QuestionData
  answer: string
  onAnswerChange: (text: string) => void
  questionNumber: number
  totalQuestions: number
}

export default function QuestionCard({
  question,
  answer,
  onAnswerChange,
  questionNumber,
  totalQuestions
}: Props) {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="pillar-badge">{question.ikigaiPillar}</span>
        <span className="counter">{questionNumber}/{totalQuestions}</span>
      </div>

      <h2 className="question-text">{question.question}</h2>

      <textarea
        className="answer-textarea"
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Escribe tu respuesta aquí..."
        rows={5}
      />
    </div>
  )
}
