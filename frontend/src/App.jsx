import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ImmediateResources from './ImmediateResources'
import './App.css'

function HomePage() {
  return (
    <main className="container">
      <header>
        <h1>Toolkit for Disability Wellbeing</h1>
      </header>

      <section className="homepage-grid">
        {/* THIS CARD LINKS TO THE NEW PAGE */}
        <Link to="/resources" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="nav-card">
            <h2>Immediate Resources</h2>
            <p>Find healthcare, legal, housing, and community support.</p>
          </div>
        </Link>

        <div className="nav-card">
          <h2>Community Stories</h2>
          <p>Read lived experiences from disabled residents.</p>
        </div>

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

        <div className="nav-card">
          <h2>Submit a Resource</h2>
          <p>Suggest a helpful organization or support service.</p>
        </div>

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resources" element={<ImmediateResources />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App