'use client'

import { useRef, useState } from 'react'
import { ref, push, set } from 'firebase/database'
import type { IkigaiResponse } from '../types'
import { downloadResultAsImage } from '../utils/download'
import { getArchetype } from '../config/archetypes'
import { db } from '../config/firebase'

interface Props {
  response: IkigaiResponse
  onRestart: () => void
}

export default function ResultCard({ response, onRestart }: Props) {
  const resultRef = useRef<HTMLDivElement>(null)
  const archetype = getArchetype(response.result.arquetipo)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleDownload = async () => {
    if (resultRef.current) {
      await downloadResultAsImage(resultRef.current, response.id)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const responsesRef = ref(db, 'responses')
      await set(push(responsesRef), response)
      setSaved(true)
    } catch (error) {
      console.error('Error guardando en el mural:', error)
      alert('No se pudo guardar en el mural. Intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="result-container">
      <div
        className="result-content"
        ref={resultRef}
        style={archetype ? { borderColor: archetype.color } : {}}
      >
        <div className="result-header">
          <h1>Tu Arquetipo Profesional</h1>
        </div>

        <div className="archetype-display">
          <div className="animal-emoji" style={archetype ? { color: archetype.color } : {}}>
            {archetype?.emoji}
          </div>
          <div className="archetype-info">
            <h2 style={archetype ? { color: archetype.color } : {}}>
              {response.result.arquetipo}
            </h2>
            <p className="archetype-subtitle">{archetype?.description}</p>
          </div>
        </div>

        <div className="slogan-section">
          <p className="slogan">"{response.result.frase_sticker}"</p>
        </div>

        <div className="summary-section">
          <h3>Tu Síntesis Ikigai</h3>
          <p className="summary-text">{response.result.resumen_ikigai}</p>
        </div>

        <div className="ideas-section">
          <h3>3 Caminos Profesionales</h3>
          <div className="ideas-list">
            {response.result.ideas.map((idea, i) => (
              <div key={i} className="idea-item">
                <span className="idea-number">{i + 1}</span>
                <span className="idea-text">{idea}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ikigai-breakdown">
          <h3>Tu Marco Ikigai</h3>
          <div className="breakdown-grid">
            <div className="breakdown-item">
              <span className="label">❤️ Amo</span>
              <p>{response.answers.love}</p>
            </div>
            <div className="breakdown-item">
              <span className="label">⭐ Soy Bueno</span>
              <p>{response.answers.good}</p>
            </div>
            <div className="breakdown-item">
              <span className="label">🌍 Se Necesita</span>
              <p>{response.answers.needed}</p>
            </div>
            <div className="breakdown-item">
              <span className="label">💰 Me Pagan</span>
              <p>{response.answers.paid}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={handleDownload}
        >
          📥 Descargar como PNG
        </button>

        <button
          className="btn btn-success"
          onClick={handleSave}
          disabled={isSaving || saved}
        >
          {saved ? '✓ Guardado en Mural' : isSaving ? '⏳ Guardando...' : '💾 Guardar en Mural'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onRestart}
        >
          🔄 Intentar de Nuevo
        </button>
      </div>
    </div>
  )
}
