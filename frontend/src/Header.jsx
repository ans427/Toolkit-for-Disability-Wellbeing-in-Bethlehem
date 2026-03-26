import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { t } from './uiStrings'
import './Header.css'

function Header({
  onAccessibilityClick,
  accessibilityOpen,
  language,
  onLanguageChange,
}) {
  const [langOpen, setLangOpen] = useState(false)
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ]

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.lang-wrapper')) {
        setLangOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const currentLabel = languages.find((l) => l.code === language)?.label ?? 'English'

  return (
    <header className="site-header" role="banner">
      <a href="#main-content" className="skip-link">
        {t(language, 'skipToMain')}
      </a>

      <div className="header-inner">
        <Link to="/" className="site-title">
          {t(language, 'appTitle')}
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <ul>
            <li><Link to="/about">{t(language, 'nav.about')}</Link></li>
            <li><Link to="/resources">{t(language, 'nav.resources')}</Link></li>
            <li><Link to="/community-stories">{t(language, 'nav.stories')}</Link></li>
            <li><Link to="/map">{t(language, 'nav.map')}</Link></li>
            <li><Link to="/policy-gaps">{t(language, 'nav.advocacy')}</Link></li>
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
              {currentLabel} <span aria-hidden="true">▼</span>
            </button>
            {langOpen && (
              <div className="language-dropdown" role="menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onLanguageChange?.(lang.code)
                      setLangOpen(false)
                    }}
                  >
                    {lang.label}
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
            {t(language, 'accessibility')}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
