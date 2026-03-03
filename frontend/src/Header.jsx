import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Header.css'

function Header({
  onAccessibilityClick,
  accessibilityOpen,
}) {
  const [language, setLanguage] = useState('English')
  const [langOpen, setLangOpen] = useState(false)
  const languages = ['English', 'Spanish', 'Chinese', 'Arabic']

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.header-lang-btn')) {
        setLangOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <header className="site-header" role="banner">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="header-inner">
        <Link to="/" className="site-title">
          Toolkit for Disability Wellbeing
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/community-stories">Stories</Link></li>
            <li><Link to="/">Map</Link></li>
            <li><Link to="/policy-gaps">Advocacy</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>

        <div className="header-controls">
          <div className="lang-wrapper">
            <button
              type="button"
              className="header-lang-btn"
              aria-haspopup="true"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((v) => !v)}
              title="Select language"
            >
              {language} <span aria-hidden="true">▼</span>
            </button>
            {langOpen && (
              <div className="language-dropdown" role="menu">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setLanguage(lang)
                      setLangOpen(false)
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="header-accessibility-btn"
            aria-expanded={accessibilityOpen}
            aria-controls="accessibility-panel"
            onClick={onAccessibilityClick}
            title="Accessibility options"
          >
            <span className="header-accessibility-icon" aria-hidden="true">♿</span>
            Accessibility
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
