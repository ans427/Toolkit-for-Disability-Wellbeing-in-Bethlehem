import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ImmediateResources from './ImmediateResources'
import CommunityStories from './CommunityStories'
import StoryDetail from './StoryDetail'
import SubmitForm from './SubmitForm'
import './App.css'

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

        <div className="nav-card">
          <h2>Policy & Service Gaps</h2>
          <p>Learn about local accessibility challenges and recommendations.</p>
        </div>

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

      <footer>
        <p>
          Created in collaboration with Lehigh University and the Bethlehem
          community.
        </p>
      </footer>
    </main>
  )
}

function AccessibilityToolbar({ textSize, setTextSize }) {
  const sizes = [
    { id: 'normal', label: 'A', description: 'Normal text size' },
    { id: 'large', label: 'A', description: 'Large text size' },
    { id: 'xlarge', label: 'A', description: 'Extra large text size' },
    { id: 'xxlarge', label: 'A', description: 'Largest text size' },
  ]

  return (
    <div
      className="accessibility-toolbar"
      aria-label="Accessibility options"
      role="region"
    >
      <span className="toolbar-label">Text size:</span>
      {sizes.map((size, index) => (
        <button
          key={size.id}
          type="button"
          onClick={() => setTextSize(size.id)}
          className={`text-size-button ${
            textSize === size.id ? 'active' : ''
          }`}
          aria-pressed={textSize === size.id}
          aria-label={size.description}
          style={{ fontSize: `${1 + index * 0.15}rem` }}
        >
          {size.label}
        </button>
      ))}
    </div>
  )
}

function App() {
  const [textSize, setTextSize] = useState('normal')

  useEffect(() => {
    const sizeMap = {
      normal: '16px',
      large: '18px',
      xlarge: '20px',
      xxlarge: '22px',
    }
    document.documentElement.style.fontSize = sizeMap[textSize] || '16px'
  }, [textSize])

  return (
    <BrowserRouter>
      <AccessibilityToolbar textSize={textSize} setTextSize={setTextSize} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resources" element={<ImmediateResources />} />
        <Route path="/community-stories" element={<CommunityStories />} />
        <Route path="/community-stories/:storyId" element={<StoryDetail />} />
        <Route path="/submit" element={<SubmitForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App