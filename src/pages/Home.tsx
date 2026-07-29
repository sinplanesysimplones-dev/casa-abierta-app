import { Link } from 'react-router-dom'
import '../styles/Home.css'

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🎯 SONAR 🎯 - Descubre tu Arquetipo</h1>
        <p className="tagline">Orientación profesional a través del marco Ikigai</p>

        <div className="mode-selector">
          <Link to="/jugar" className="btn btn-large btn-primary">
            🎯 Descubrir mi Arquetipo
          </Link>

          <Link to="/monitor" className="btn btn-large btn-secondary">
            📺 Ver Mural (Monitor)
          </Link>
        </div>

        <div className="info-box">
          <h3>¿Cómo funciona?</h3>
          <ul>
            <li>Responde 4 preguntas basadas en el marco Ikigai</li>
            <li>Descubre tu arquetipo profesional único</li>
            <li>Obtén 3 ideas de carrera personalizadas</li>
            <li>Descarga tu resultado como sticker</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
