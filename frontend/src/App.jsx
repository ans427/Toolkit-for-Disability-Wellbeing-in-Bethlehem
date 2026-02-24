import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
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

      {/* <footer>
        <p>
          Created in collaboration with Lehigh University and the Bethlehem
          community.
        </p>
      </footer> */}
    </main>
  )
}

function AccessibilityToolbar({ textSize, setTextSize, highContrast, setHighContrast, underlineLinks, setUnderlineLinks }) {
  const [open, setOpen] = useState(false)

  const sizes = [
    { id: 'smaller', label: 'Smaller', description: 'Smaller text' },
    { id: 'normal', label: 'Default', description: 'Default text size' },
    { id: 'large', label: 'Larger', description: 'Larger text' },
    { id: 'xlarge', label: 'Largest', description: 'Largest text' },
  ]

  return (
    <div>
      <button
        className="accessibility-toggle-button"
        aria-expanded={open}
        aria-controls="accessibility-panel"
        onClick={() => setOpen(v => !v)}
        title="Accessibility options"
      >
        ⚙ Accessibility
      </button>

      {open && (
        <div id="accessibility-panel" className="accessibility-panel" role="dialog" aria-label="Accessibility settings">
          <div className="panel-row">
            <strong>Text size</strong>
            <div className="size-buttons">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setTextSize(size.id)}
                  className={`text-size-button ${textSize === size.id ? 'active' : ''}`}
                  aria-pressed={textSize === size.id}
                  aria-label={size.description}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-row">
            <label>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />{' '}
              High contrast
            </label>
          </div>

          <div className="panel-row">
            <label>
              <input
                type="checkbox"
                checked={underlineLinks}
                onChange={(e) => setUnderlineLinks(e.target.checked)}
              />{' '}
              Underline links
            </label>
          </div>

          <div className="panel-actions">
            <button type="button" onClick={() => { setOpen(false) }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('a11y_textSize') || 'normal'
  })
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('a11y_highContrast') === 'true'
  })
  const [underlineLinks, setUnderlineLinks] = useState(() => {
    return localStorage.getItem('a11y_underlineLinks') === 'true'
  })

  useEffect(() => {
    const sizeMap = {
      smaller: '14px',
      normal: '16px',
      large: '18px',
      xlarge: '20px',
    }
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

  return (
    <BrowserRouter>
      <AccessibilityToolbar
        textSize={textSize}
        setTextSize={setTextSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        underlineLinks={underlineLinks}
        setUnderlineLinks={setUnderlineLinks}
      />
      <div id="page-content">
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