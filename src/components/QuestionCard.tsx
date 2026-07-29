import type { QuestionData } from '../types'
import '../styles/QuestionCard.css'

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
        className="answer-input"
        value={answer}
        onChange={e => onAnswerChange(e.target.value)}
        placeholder={question.placeholder}
        autoFocus
      />

      <div className="char-count">
        {answer.length} caracteres
      </div>
    </div>
  )
}
