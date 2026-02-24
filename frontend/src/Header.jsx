import { Link } from 'react-router-dom'
import './Header.css'

function Header({
  onAccessibilityClick,
  accessibilityOpen,
}) {
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
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/community-stories">Stories</Link></li>
            <li><Link to="/">Map</Link></li>
            <li><Link to="/policy-gaps">Advocacy</Link></li>
          </ul>
        </nav>

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
    </header>
  )
}

export default Header
