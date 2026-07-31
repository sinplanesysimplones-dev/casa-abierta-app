'use client'

import { useState, useEffect } from 'react'
import type { IkigaiResponse } from '../types'
import { getArchetype } from '../config/archetypes'

export default function Monitor() {
  const [responses, setResponses] = useState<IkigaiResponse[]>([])

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('ikigai_responses')
      if (stored) {
        setResponses(JSON.parse(stored))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    handleStorageChange()

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const archetypeCounts = responses.reduce(
    (acc, response) => {
      const archetype = response.result.arquetipo
      acc[archetype] = (acc[archetype] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="monitor-container">
      <header className="monitor-header">
        <h1>🎯 Descubre tu Arquetipo - Mural en Vivo</h1>
        <div className="monitor-stats">
          <p className="live-indicator">● EN VIVO</p>
          <p className="participant-count">{responses.length} participantes</p>
        </div>
      </header>

      <div className="archetype-counter">
        <div className="counter-items">
          {Object.entries(archetypeCounts).map(([archetype, count]) => {
            const archetypeData = getArchetype(archetype)
            return (
              <div key={archetype} className="counter-item">
                <span className="emoji" style={archetypeData ? { color: archetypeData.color } : {}}>
                  {archetypeData?.emoji}
                </span>
                <div className="counter-info">
                  <p className="counter-name">{archetype}</p>
                  <p className="counter-value">{count}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="results-grid">
        {responses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-animation">✨</div>
            <p>Esperando participantes...</p>
            <p className="subtitle">Los resultados aparecerán aquí en tiempo real</p>
          </div>
        ) : (
          responses.map(response => {
            const archetypeData = getArchetype(response.result.arquetipo)
            return (
              <div
                key={response.id}
                className="result-card-monitor"
                style={archetypeData ? { borderColor: archetypeData.color } : {}}
              >
                <div className="archetype-header">
                  <div
                    className="archetype-badge"
                    style={archetypeData ? { backgroundColor: archetypeData.color } : {}}
                  >
                    <span className="emoji">{archetypeData?.emoji}</span>
                    <span className="name">{response.result.arquetipo}</span>
                  </div>
                </div>

                <p className="slogan">"{response.result.frase_sticker}"</p>

                <div className="ideas-preview">
                  {response.result.ideas.slice(0, 2).map((idea, i) => (
                    <span key={i} className="idea-tag">{idea}</span>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
