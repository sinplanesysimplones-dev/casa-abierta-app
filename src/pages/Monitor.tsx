import { useState, useEffect } from 'react'
import type { IkigaiResponse } from '../types'
import '../styles/Monitor.css'

export default function Monitor() {
  const [responses, setResponses] = useState<IkigaiResponse[]>([])

  useEffect(() => {
    // TODO: Conectar con Firebase Realtime Database
    // Por ahora, escuchamos localStorage para propósitos de desarrollo
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

  return (
    <div className="monitor-container">
      <header className="monitor-header">
        <h1>🎯 Descubre tu Arquetipo - Mural en Vivo</h1>
        <p className="live-indicator">● EN VIVO</p>
      </header>

      <div className="results-grid">
        {responses.length === 0 ? (
          <div className="empty-state">
            <p>Esperando participantes...</p>
            <p className="subtitle">Los resultados aparecerán aquí en tiempo real</p>
          </div>
        ) : (
          responses.map(response => (
            <div key={response.id} className="result-card-monitor">
              <div className="archetype-header">
                <div className="archetype-badge">
                  <span className="emoji">🦁</span>
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
          ))
        )}
      </div>
    </div>
  )
}
