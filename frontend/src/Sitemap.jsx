import { Link } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'
import './Sitemap.css'

function Sitemap() {
  return (
    <>
      <Breadcrumb />
      <main className="container">
      <div className="sitemap">
        <header className="sitemap-header">
          <Link to="/" className="back-link">← Back Home</Link>
          <h1>Site Map</h1>
        </header>

        <section className="sitemap-section">
          <h2>Main Pages</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/resources">Immediate Resources</Link></li>
            <li><Link to="/community-stories">Community Stories</Link></li>
            <li><Link to="/policy-gaps">Policy & Service Gaps</Link></li>
            <li><Link to="/submit">Submit a Resource or Story</Link></li>
          </ul>
        </section>

        <section className="sitemap-section">
          <h2>Information & Support</h2>
          <ul>
            <li><Link to="/sitemap">Site Map</Link></li>
            <li><Link to="/disclaimers">Disclaimers</Link></li>
            <li><Link to="/accessibility-statement">Accessibility Statement</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </section>

        {/* <section className="sitemap-section">
          <h2>Resources by Category</h2>
          <ul>
            <li>Healthcare Resources</li>
            <li>Legal Aid Services</li>
            <li>Housing & Accessibility</li>
            <li>Community Support</li>
            <li>Employment Services</li>
          </ul>
        </section> */}

        {/* <section className="sitemap-section">
          <h2>Community Content</h2>
          <p>Browse individual community stories and lived experiences shared by disabled residents of Bethlehem.</p>
          <Link to="/community-stories" className="inline-link">View All Stories</Link>
        </section> */}
      </div>
      </main>
    </>
  )
}

export default Sitemap
