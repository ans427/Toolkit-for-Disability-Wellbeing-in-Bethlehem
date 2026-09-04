import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { t } from './uiStrings'
import './Header.css'

function Header({
  onAccessibilityClick,
  accessibilityOpen,
  language,
  onLanguageChange,
  accessibilityButtonRef,
}) {
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const langButtonRef = useRef(null)
  const langMenuRef = useRef(null)
  const mobileNavRef = useRef(null)
  const menuButtonRef = useRef(null)
  const languages = [
    { code: 'en', label: 'English', flag: '🌐' },
    { code: 'es', label: 'Español', flag: '🌐' },
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

  // close menu on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const currentLanguage = languages.find((l) => l.code === language) ?? languages[0]

  const handleMenuToggle = () => {
    setMenuOpen((open) => !open)
  }

  const handleMenuLinkClick = () => {
    setMenuOpen(false)
    setTimeout(() => menuButtonRef.current?.focus(), 0)
  }

  useEffect(() => {
    if (!langOpen) return

    const focusableItems = langMenuRef.current?.querySelectorAll('button') ?? []
    if (focusableItems.length > 0) focusableItems[0].focus()

    const handleLangKeyDown = (e) => {
      if (!langMenuRef.current) return

      const buttons = [...langMenuRef.current.querySelectorAll('button')]
      const currentIndex = buttons.findIndex((button) => button === document.activeElement)

      if (e.key === 'Escape') {
        e.preventDefault()
        setLangOpen(false)
        langButtonRef.current?.focus()
      }

      if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % buttons.length : 0
        buttons[nextIndex]?.focus()
      }

      if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault()
        const prevIndex = currentIndex >= 0 ? (currentIndex - 1 + buttons.length) % buttons.length : buttons.length - 1
        buttons[prevIndex]?.focus()
      }

      if (e.key === 'Home') {
        e.preventDefault()
        buttons[0]?.focus()
      }

      if (e.key === 'End') {
        e.preventDefault()
        buttons[buttons.length - 1]?.focus()
      }

      if (e.key === 'Tab') {
        e.preventDefault()
        setLangOpen(false)
        const nextFocusable = langButtonRef.current?.closest('.header-controls')?.nextElementSibling
          || langButtonRef.current?.closest('.header-controls')?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
          || langButtonRef.current?.nextElementSibling
        if (nextFocusable) nextFocusable.focus()
        else langButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleLangKeyDown)
    return () => document.removeEventListener('keydown', handleLangKeyDown)
  }, [langOpen])

  useEffect(() => {
    if (!menuOpen) return

    const firstLink = mobileNavRef.current?.querySelector('a')
    firstLink?.focus()

    const handleMenuKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleMenuKeyDown)

    const handleMenuFocusTrap = (e) => {
      if (e.key !== 'Tab' || !mobileNavRef.current) return

      const focusable = [...mobileNavRef.current.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      )].filter((element) => !element.hasAttribute('disabled'))

      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleMenuFocusTrap)
    return () => {
      document.removeEventListener('keydown', handleMenuKeyDown)
      document.removeEventListener('keydown', handleMenuFocusTrap)
      menuButtonRef.current?.focus()
    }
  }, [menuOpen])

  // prevent body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open-body')
    } else {
      document.body.classList.remove('menu-open-body')
    }
    return () => document.body.classList.remove('menu-open-body')
  }, [menuOpen])

  useEffect(() => {
    if (!langOpen) return

    const handleFocusOut = (e) => {
      if (!langMenuRef.current) return
      if (!langMenuRef.current.contains(e.relatedTarget)) {
        setLangOpen(false)
      }
    }

    document.addEventListener('focusin', handleFocusOut)
    return () => document.removeEventListener('focusin', handleFocusOut)
  }, [langOpen])

  return (
    <header id="site-header" className="site-header" role="banner">
      <a href="#main-content" className="skip-link">
        {t(language, 'skipToMain')}
      </a>
      <a href="#page-content-start" className="skip-link skip-link-page">
        {t(language, 'skipToPageContent')}
      </a>
      <a href="#site-navigation" className="skip-link skip-link-nav">
        {t(language, 'skipToNav')}
      </a>
      <a href="#site-footer" className="skip-link skip-link-footer">
        {t(language, 'skipToFooter')}
      </a>
      <div className="header-inner">
        <div className="header-top">
          <Link to="/" className="site-title">
            {t(language, 'appTitle')}
          </Link>

          <nav id="site-navigation" className="site-nav" role="navigation" aria-label="Main navigation">
            <button
              ref={menuButtonRef}
              type="button"
              className={`menu-toggle ${menuOpen ? 'open' : ''}`}
              aria-expanded={menuOpen}
              aria-controls="menu-list"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={handleMenuToggle}
            >
              <span aria-hidden="true" className="menu-icon">
                <span className="menu-hamburger">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="menu-close">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              <span className="menu-label">Menu</span>
            </button>
            <ul id="menu-list" className={menuOpen ? 'menu-open' : ''}>
              <li><Link to="/about" onClick={handleMenuLinkClick}>{t(language, 'nav.about')}</Link></li>
              <li><Link to="/resources" onClick={handleMenuLinkClick}>{t(language, 'nav.resources')}</Link></li>
              <li><Link to="/community-stories" onClick={handleMenuLinkClick}>{t(language, 'nav.stories')}</Link></li>
              <li><Link to="/map" onClick={handleMenuLinkClick}>{t(language, 'nav.map')}</Link></li>
              <li><Link to="/disability-activism" onClick={handleMenuLinkClick}>{t(language, 'nav.advocacy')}</Link></li>
            </ul>
          </nav>
        </div>

        <div className="header-controls">
          <div className="lang-wrapper">
            <button
              ref={langButtonRef}
              type="button"
              className={`header-lang-btn ${langOpen ? 'open' : ''}`}
              aria-haspopup="menu"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((v) => !v)}
              title="Select language"
            >
              <span aria-hidden="true" className="lang-flag">{currentLanguage.flag}</span>
              <span>{currentLanguage.label}</span>
              <span aria-hidden="true" className="lang-chevron">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {langOpen && (
              <div ref={langMenuRef} className="language-dropdown" role="menu" aria-label="Language menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onLanguageChange?.(lang.code)
                      setLangOpen(false)
                      langButtonRef.current?.focus()
                    }}
                  >
                    <span aria-hidden="true" className="lang-flag">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            ref={accessibilityButtonRef}
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
      {menuOpen && (
        <div className="menu-overlay">
          <nav ref={mobileNavRef} className="mobile-nav" role="navigation" aria-label="Mobile navigation">
            <ul>
              <li><Link to="/about" onClick={handleMenuLinkClick}>{t(language, 'nav.about')}</Link></li>
              <li><Link to="/resources" onClick={handleMenuLinkClick}>{t(language, 'nav.resources')}</Link></li>
              <li><Link to="/community-stories" onClick={handleMenuLinkClick}>{t(language, 'nav.stories')}</Link></li>
              <li><Link to="/map" onClick={handleMenuLinkClick}>{t(language, 'nav.map')}</Link></li>
              <li><Link to="/disability-activism" onClick={handleMenuLinkClick}>{t(language, 'nav.advocacy')}</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
