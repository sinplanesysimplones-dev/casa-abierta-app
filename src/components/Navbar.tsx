import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <div className="logo-sonar">
          <svg viewBox="0 0 32 32" className="logo-icon">
            <circle cx="16" cy="16" r="3" fill="currentColor" />
            <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          </svg>
          <span className="logo-text">Sonar</span>
        </div>
      </Link>
    </nav>
  )
}
