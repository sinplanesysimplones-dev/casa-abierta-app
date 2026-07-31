'use client'

import { useEffect } from 'react'
import type { QuestionData } from '../types'
import { useAudioRecorder } from '../hooks/useAudioRecorder'

interface Props {
  question: QuestionData
  answer: string
  onAnswerChange: (text: string) => void
  questionNumber: number
  totalQuestions: number
}

export default function QuestionCard({
  question,
  onAnswerChange,
  questionNumber,
  totalQuestions
}: Props) {
  const {
    isRecording,
    duration,
    audioBlob,
    transcript,
    isTranscribing,
    startRecording,
    stopRecording,
    resetRecording,
    transcribeAudio
  } = useAudioRecorder()

  useEffect(() => {
    if (transcript) {
      onAnswerChange(transcript)
    }
  }, [transcript, onAnswerChange])

  const handleStartRecording = async () => {
    resetRecording()
    await startRecording()
  }

  const handleStopAndTranscribe = async () => {
    await stopRecording()
    setTimeout(async () => {
      await transcribeAudio()
    }, 500)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="pillar-badge">{question.ikigaiPillar}</span>
        <span className="counter">{questionNumber}/{totalQuestions}</span>
      </div>

      <h2 className="question-text">{question.question}</h2>

      <div className="audio-recorder">
        <div className="recording-status">
          {isRecording ? (
            <div className="recording-active">
              <span className="recording-indicator">● GRABANDO</span>
              <span className="recording-duration">{formatDuration(duration)}</span>
            </div>
          ) : audioBlob ? (
            <div className="recording-ready">
              <span className="check-icon">✓</span>
              <span className="status-text">Grabación lista</span>
            </div>
          ) : (
            <div className="recording-idle">
              <span className="status-text">Presiona el botón para grabar</span>
            </div>
          )}
        </div>

        <div className="button-group-audio">
          {!isRecording && !audioBlob ? (
            <button
              className="btn btn-record"
              onClick={handleStartRecording}
              disabled={isTranscribing}
            >
              🎤 Grabar
            </button>
          ) : isRecording ? (
            <button
              className="btn btn-stop"
              onClick={handleStopAndTranscribe}
            >
              ⏹️ Detener
            </button>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => resetRecording()}
                disabled={isTranscribing}
              >
                🔄 Grabar de Nuevo
              </button>
              <button
                className="btn btn-success"
                onClick={transcribeAudio}
                disabled={isTranscribing}
              >
                {isTranscribing ? '⏳ Transcribiendo...' : '✓ Usar Grabación'}
              </button>
            </>
          )}
        </div>

        {transcript && (
          <div className="transcript-box">
            <p className="transcript-text">{transcript}</p>
          </div>
        )}
      </div>

      {isTranscribing && (
        <div className="transcribing-status">
          <span className="spinner">⏳</span> Transcribiendo audio...
        </div>
      )}
    </div>
  )
}
