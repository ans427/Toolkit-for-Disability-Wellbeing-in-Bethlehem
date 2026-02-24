import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Header from './Header'
import ImmediateResources from './ImmediateResources'
import ResourceDetail from './ResourceDetail'
import CommunityStories from './CommunityStories'
import StoryDetail from './StoryDetail'
import SubmitForm from './SubmitForm'
import PolicyGaps from './PolicyGaps'
import Sitemap from './Sitemap'
import Disclaimers from './Disclaimers'
import AccessibilityStatement from './AccessibilityStatement'
import PrivacyPolicy from './PrivacyPolicy'
import Footer from './Footer'
import './App.css'
import './Header.css'
import './AccessibilityToolbar.css'

function HomePage() {
  return (
    <main className="container">
      <header>
        <h1>Toolkit for Disability Wellbeing</h1>
      </header>

      <section className="homepage-grid">
        {/* Immediate Resources */}
        <Link
          to="/resources"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>Immediate Resources</h2>
            <p>Find healthcare, legal, housing, and community support.</p>
          </div>
        </Link>

        {/* Community Stories */}
        <Link
          to="/community-stories"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>Community Stories</h2>
            <p>Read lived experiences from disabled residents.</p>
          </div>
        </Link>

        <div className="nav-card">
          <h2>Accessibility Map</h2>
          <p>Explore accessible and inaccessible spaces in Bethlehem.</p>
        </div>

        <Link
          to="/policy-gaps"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>Policy & Service Gaps</h2>
            <p>Learn about local accessibility challenges and recommendations.</p>
          </div>
        </Link>

        <div className="nav-card">
          <h2>Disability Activism</h2>
          <p>Explore movements and discussions around disability justice.</p>
        </div>

        <div className="nav-card">
          <h2>Report an Issue</h2>
          <p>Share an accessibility barrier in the community.</p>
        </div>

        <Link
          to="/submit"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="nav-card">
            <h2>Submit a Resource or Story</h2>
            <p>Share a resource or community story for review.</p>
          </div>
        </Link>

        <div className="nav-card">
          <h2>About the Toolkit</h2>
          <p>Learn about the project and collaborators.</p>
        </div>
      </section>

      <section className="cta-band">
        <p className="cta-band-text">Know something we don&apos;t? This toolkit grows through community contribution.</p>
        <Link to="/submit" className="cta-band-button">
          Contribute to the Toolkit
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
}) {
  const sizes = [
    { id: 'smaller', label: 'Smaller', description: 'Smaller text' },
    { id: 'normal', label: 'Default', description: 'Default text size' },
    { id: 'large', label: 'Large', description: 'Larger text' },
    { id: 'xlarge', label: 'Extra Large', description: 'Largest text' },
  ]

  const contrastOptions = [
    { id: false, label: 'Default' },
    { id: true, label: 'High Contrast' },
  ]

  const fontOptions = [
    { id: false, label: 'Default' },
    { id: true, label: 'Dyslexia-Friendly' },
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
            aria-label="Accessibility Options"
          >
            <div className="panel-header">
              <h2 className="panel-title">Accessibility Options</h2>
              <button
                type="button"
                className="panel-close"
                onClick={onToggle}
                aria-label="Close accessibility options"
              >
                ×
              </button>
            </div>

            <div className="panel-body">
              <section className="panel-section">
                <h3 className="panel-section-title">Text size</h3>
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
                <h3 className="panel-section-title">Color contrast</h3>
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
                <h3 className="panel-section-title">Reading font</h3>
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
                <p className="panel-hint">Dyslexia-friendly mode uses a clean sans-serif font with wider letter and word spacing.</p>
              </section>

              <section className="panel-section">
                <h3 className="panel-section-title">Motion & layout</h3>
                <div className="panel-toggles">
                  <label className="panel-toggle-row">
                    <span className="panel-toggle-label">Reduce animations</span>
                    <input
                      type="checkbox"
                      checked={reduceAnimations}
                      onChange={(e) => setReduceAnimations(e.target.checked)}
                    />
                  </label>
                  <label className="panel-toggle-row">
                    <span className="panel-toggle-label">Increase spacing</span>
                    <input
                      type="checkbox"
                      checked={increaseSpacing}
                      onChange={(e) => setIncreaseSpacing(e.target.checked)}
                    />
                  </label>
                  <label className="panel-toggle-row">
                    <span className="panel-toggle-label">Underline all links</span>
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
                  Reset all accessibility settings
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

  return (
    <BrowserRouter>
      <Header
        onAccessibilityClick={() => setA11yOpen(v => !v)}
        accessibilityOpen={a11yOpen}
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
      />
      <div id="main-content" className="page-content">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resources/:resourceId" element={<ResourceDetail />} />
        <Route path="/resources" element={<ImmediateResources />} />
        <Route path="/community-stories" element={<CommunityStories />} />
        <Route path="/community-stories/:storyId" element={<StoryDetail />} />
        <Route path="/policy-gaps" element={<PolicyGaps />} />
        <Route path="/submit" element={<SubmitForm />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/disclaimers" element={<Disclaimers />} />
        <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default App