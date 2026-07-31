'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <div className="hero-icon">🎯</div>
          <h1 className="hero-title">Descubre tu Arquetipo</h1>
          <p className="tagline">
            Orientación profesional instantánea a través del marco Ikigai
          </p>
        </div>

        <div className="mode-selector">
          <Link href="/jugar" className="btn btn-large btn-primary">
            <span className="btn-icon">🎤</span>
            <span className="btn-text">Descubrir mi Arquetipo</span>
          </Link>

          <Link href="/monitor" className="btn btn-large btn-secondary">
            <span className="btn-icon">📊</span>
            <span className="btn-text">Ver Mural en Vivo</span>
          </Link>
        </div>

        <div className="info-section">
          <h3>¿Cómo funciona?</h3>
          <div className="steps-grid">
            <div className="step">
              <span className="step-number">1</span>
              <p>Graba respuestas a 4 preguntas</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>IA clasifica tu arquetipo</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>Obtén personalizadas ideas de carrera</p>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <p>Aparece en el mural en vivo</p>
            </div>
          </div>
        </div>

        <div className="archetypes-preview">
          <h4>5 Arquetipos Profesionales</h4>
          <div className="archetypes-showcase">
            <div className="archetype-preview">🦉 Búho</div>
            <div className="archetype-preview">🦊 Zorro</div>
            <div className="archetype-preview">🐆 Guepardo</div>
            <div className="archetype-preview">🐝 Abeja</div>
            <div className="archetype-preview">🐢 Tortuga</div>
          </div>
        </div>
      </div>
    </div>
  )
}
