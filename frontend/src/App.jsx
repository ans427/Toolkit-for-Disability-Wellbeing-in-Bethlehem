import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Header from './Header'
import ImmediateResources from './ImmediateResources'
import ResourceDetail from './ResourceDetail'
import CommunityStories from './CommunityStories'
import StoryDetail from './StoryDetail'
import SubmitForm from './SubmitForm'
import PolicyGaps from './PolicyGaps'
import DisabilityActivism from './DisabilityActivism'
import AccessibilityMap from './AccessibilityMap'
import Sitemap from './Sitemap'
import Disclaimers from './Disclaimers'
import AccessibilityStatement from './AccessibilityStatement'
import About from './About'
import PrivacyPolicy from './PrivacyPolicy'
import Footer from './Footer'
import { LanguageProvider } from './languageContext'
import { t } from './uiStrings'
import { useLanguage } from './languageContext'
import './App.css'
import './Header.css'
import './AccessibilityToolbar.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function HomePage() {
  const lang = useLanguage()
  return (
    <main className="container">
      <header>
        <h1>{t(lang, 'home.title')}</h1>
      </header>

      <section className="homepage-grid">
        {/* Immediate Resources */}
        <Link
          to="/resources"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>{t(lang, 'home.cards.resourcesTitle')}</h2>
            <p>{t(lang, 'home.cards.resourcesBody')}</p>
          </div>
        </Link>

        {/* Community Stories */}
        <Link
          to="/community-stories"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>{t(lang, 'home.cards.storiesTitle')}</h2>
            <p>{t(lang, 'home.cards.storiesBody')}</p>
          </div>
        </Link>

        <Link
          to="/map"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>{t(lang, 'home.cards.mapTitle')}</h2>
            <p>{t(lang, 'home.cards.mapBody')}</p>
          </div>
        </Link>

        <Link
          to="/policy-gaps"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>{t(lang, 'home.cards.policyTitle')}</h2>
            <p>{t(lang, 'home.cards.policyBody')}</p>
          </div>
        </Link>

        <Link
          to="/disability-activism"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>{t(lang, 'home.cards.activismTitle')}</h2>
            <p>{t(lang, 'home.cards.activismBody')}</p>
          </div>
        </Link>

        <div className="nav-card">
          <h2>{t(lang, 'home.cards.reportTitle')}</h2>
          <p>{t(lang, 'home.cards.reportBody')}</p>
        </div>

        <Link
          to="/submit"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>{t(lang, 'home.cards.submitTitle')}</h2>
            <p>{t(lang, 'home.cards.submitBody')}</p>
          </div>
        </Link>

        <Link
          to="/about"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>{t(lang, 'home.cards.aboutTitle')}</h2>
            <p>{t(lang, 'home.cards.aboutBody')}</p>
          </div>
        </Link>
      </section>

      <section className="cta-band">
        <p className="cta-band-text">{t(lang, 'home.cta.text')}</p>
        <Link to="/submit" className="cta-band-button">
          {t(lang, 'home.cta.button')}
        </Link>
      </section>

      {/* <footer>
        <p>
          Created in collaboration with Lehigh University and the Bethlehem
          community.
        </p>
      </footer> */}
    </main>
  )
}

function AccessibilityToolbar({
  textSize, setTextSize,
  highContrast, setHighContrast,
  underlineLinks, setUnderlineLinks,
  dyslexiaFont, setDyslexiaFont,
  reduceAnimations, setReduceAnimations,
  increaseSpacing, setIncreaseSpacing,
  onReset, open, onToggle,
  lang,
}) {
  const sizes = [
    { id: 'smaller', label: t(lang, 'accessibilityPanel.textSizeSmaller'), description: t(lang, 'accessibilityPanel.textSizeSmaller') },
    { id: 'normal', label: t(lang, 'accessibilityPanel.textSizeDefault'), description: t(lang, 'accessibilityPanel.textSizeDefault') },
    { id: 'large', label: t(lang, 'accessibilityPanel.textSizeLarge'), description: t(lang, 'accessibilityPanel.textSizeLarge') },
    { id: 'xlarge', label: t(lang, 'accessibilityPanel.textSizeXLarge'), description: t(lang, 'accessibilityPanel.textSizeXLarge') },
  ]

  const contrastOptions = [
    { id: false, label: t(lang, 'accessibilityPanel.contrastDefault') },
    { id: true, label: t(lang, 'accessibilityPanel.contrastHigh') },
  ]

  const fontOptions = [
    { id: false, label: t(lang, 'accessibilityPanel.fontDefault') },
    { id: true, label: t(lang, 'accessibilityPanel.fontDyslexia') },
  ]

  useEffect(() => {
    if (!open) return
    const handleEscape = (e) => {
      if (e.key === 'Escape') onToggle()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onToggle])

  return (
    <>
      {open && (
        <>
          <div className="accessibility-overlay" onClick={onToggle} aria-hidden="true" />
          <aside
            id="accessibility-panel"
            className="accessibility-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t(lang, 'accessibilityPanel.title')}
          >
            <div className="panel-header">
              <h2 className="panel-title">{t(lang, 'accessibilityPanel.title')}</h2>
              <button
                type="button"
                className="panel-close"
                onClick={onToggle}
                aria-label={t(lang, 'accessibilityPanel.close')}
              >
                ×
              </button>
            </div>

            <div className="panel-body">
              <section className="panel-section">
                <h3 className="panel-section-title">{t(lang, 'accessibilityPanel.textSize')}</h3>
                <div className="panel-option-row">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setTextSize(size.id)}
                      className={`panel-option-btn ${textSize === size.id ? 'active' : ''}`}
                      aria-pressed={textSize === size.id}
                      aria-label={size.description}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel-section">
                <h3 className="panel-section-title">{t(lang, 'accessibilityPanel.colorContrast')}</h3>
                <div className="panel-option-row">
                  {contrastOptions.map((opt) => (
                    <button
                      key={String(opt.id)}
                      type="button"
                      onClick={() => setHighContrast(opt.id)}
                      className={`panel-option-btn ${highContrast === opt.id ? 'active' : ''}`}
                      aria-pressed={highContrast === opt.id}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel-section">
                <h3 className="panel-section-title">{t(lang, 'accessibilityPanel.readingFont')}</h3>
                <div className="panel-option-row">
                  {fontOptions.map((opt) => (
                    <button
                      key={String(opt.id)}
                      type="button"
                      onClick={() => setDyslexiaFont(opt.id)}
                      className={`panel-option-btn ${dyslexiaFont === opt.id ? 'active' : ''}`}
                      aria-pressed={dyslexiaFont === opt.id}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="panel-hint">{t(lang, 'accessibilityPanel.dyslexiaHint')}</p>
              </section>

              <section className="panel-section">
                <h3 className="panel-section-title">{t(lang, 'accessibilityPanel.motionLayout')}</h3>
                <div className="panel-toggles">
                  <label className="panel-toggle-row">
                    <span className="panel-toggle-label">{t(lang, 'accessibilityPanel.reduceAnimations')}</span>
                    <input
                      type="checkbox"
                      checked={reduceAnimations}
                      onChange={(e) => setReduceAnimations(e.target.checked)}
                    />
                  </label>
                  <label className="panel-toggle-row">
                    <span className="panel-toggle-label">{t(lang, 'accessibilityPanel.increaseSpacing')}</span>
                    <input
                      type="checkbox"
                      checked={increaseSpacing}
                      onChange={(e) => setIncreaseSpacing(e.target.checked)}
                    />
                  </label>
                  <label className="panel-toggle-row">
                    <span className="panel-toggle-label">{t(lang, 'accessibilityPanel.underlineLinks')}</span>
                    <input
                      type="checkbox"
                      checked={underlineLinks}
                      onChange={(e) => setUnderlineLinks(e.target.checked)}
                    />
                  </label>
                </div>
              </section>

              <div className="panel-footer">
                <button type="button" className="panel-reset-btn" onClick={onReset}>
                  {t(lang, 'accessibilityPanel.reset')}
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

function App() {
  const [textSize, setTextSize] = useState(() => localStorage.getItem('a11y_textSize') || 'normal')
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('a11y_highContrast') === 'true')
  const [underlineLinks, setUnderlineLinks] = useState(() => localStorage.getItem('a11y_underlineLinks') === 'true')
  const [dyslexiaFont, setDyslexiaFont] = useState(() => localStorage.getItem('a11y_dyslexiaFont') === 'true')
  const [reduceAnimations, setReduceAnimations] = useState(() => localStorage.getItem('a11y_reduceAnimations') === 'true')
  const [increaseSpacing, setIncreaseSpacing] = useState(() => localStorage.getItem('a11y_increaseSpacing') === 'true')

  useEffect(() => {
    const sizeMap = { smaller: '14px', normal: '16px', large: '18px', xlarge: '20px' }
    document.documentElement.style.fontSize = sizeMap[textSize] || '16px'
    localStorage.setItem('a11y_textSize', textSize)
  }, [textSize])

  useEffect(() => {
    if (highContrast) document.documentElement.classList.add('a11y-high-contrast')
    else document.documentElement.classList.remove('a11y-high-contrast')
    localStorage.setItem('a11y_highContrast', highContrast)
  }, [highContrast])

  useEffect(() => {
    if (underlineLinks) document.documentElement.classList.add('a11y-underline-links')
    else document.documentElement.classList.remove('a11y-underline-links')
    localStorage.setItem('a11y_underlineLinks', underlineLinks)
  }, [underlineLinks])

  useEffect(() => {
    if (dyslexiaFont) document.documentElement.classList.add('a11y-dyslexia-font')
    else document.documentElement.classList.remove('a11y-dyslexia-font')
    localStorage.setItem('a11y_dyslexiaFont', dyslexiaFont)
  }, [dyslexiaFont])

  useEffect(() => {
    if (reduceAnimations) document.documentElement.classList.add('a11y-reduce-motion')
    else document.documentElement.classList.remove('a11y-reduce-motion')
    localStorage.setItem('a11y_reduceAnimations', reduceAnimations)
  }, [reduceAnimations])

  useEffect(() => {
    if (increaseSpacing) document.documentElement.classList.add('a11y-increase-spacing')
    else document.documentElement.classList.remove('a11y-increase-spacing')
    localStorage.setItem('a11y_increaseSpacing', increaseSpacing)
  }, [increaseSpacing])

  const handleResetAccessibility = () => {
    setTextSize('normal')
    setHighContrast(false)
    setUnderlineLinks(false)
    setDyslexiaFont(false)
    setReduceAnimations(false)
    setIncreaseSpacing(false)
  }

  const [a11yOpen, setA11yOpen] = useState(false)
  const [language, setLanguage] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    localStorage.setItem('lang', language)
    document.documentElement.lang = language
  }, [language])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header
        onAccessibilityClick={() => setA11yOpen(v => !v)}
        accessibilityOpen={a11yOpen}
        language={language}
        onLanguageChange={setLanguage}
      />
      <AccessibilityToolbar
        textSize={textSize}
        setTextSize={setTextSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        underlineLinks={underlineLinks}
        setUnderlineLinks={setUnderlineLinks}
        dyslexiaFont={dyslexiaFont}
        setDyslexiaFont={setDyslexiaFont}
        reduceAnimations={reduceAnimations}
        setReduceAnimations={setReduceAnimations}
        increaseSpacing={increaseSpacing}
        setIncreaseSpacing={setIncreaseSpacing}
        onReset={handleResetAccessibility}
        open={a11yOpen}
        onToggle={() => setA11yOpen(v => !v)}
        lang={language}
      />
      <LanguageProvider value={language}>
        <div id="main-content" className="page-content">
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources/:resourceId" element={<ResourceDetail />} />
          <Route path="/resources" element={<ImmediateResources />} />
          <Route path="/map" element={<AccessibilityMap />} />
          <Route path="/community-stories" element={<CommunityStories />} />
          <Route path="/community-stories/:storyId" element={<StoryDetail />} />
          <Route path="/policy-gaps" element={<PolicyGaps />} />
          <Route path="/disability-activism" element={<DisabilityActivism />} />
          <Route path="/submit" element={<SubmitForm />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/disclaimers" element={<Disclaimers />} />
          <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </div>
      </LanguageProvider>
      <Footer />
    </BrowserRouter>
  )
}

export default App