import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/resources">Immediate Resources</Link></li>
            <li><Link to="/community-stories">Community Stories</Link></li>
            <li><Link to="/policy-gaps">Policy & Service Gaps</Link></li>
            <li><Link to="/submit">Submit a Resource or Story</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Information</h3>
          <ul>
            <li><Link to="/sitemap">Site Map</Link></li>
            <li><Link to="/disclaimers">Disclaimers</Link></li>
            <li><Link to="/accessibility-statement">Accessibility Statement</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:example@example.org">example@example.org</a></p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: Bethlehem, PA 18015</p>
        </div>

        <div className="footer-section">
          <h3>About</h3>
          <p>The Toolkit for Disability Wellbeing is a community-driven initiative supporting disabled residents in Bethlehem, PA through accessible resources and shared experiences.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Toolkit for Disability Wellbeing. All rights reserved. Created in collaboration with Lehigh University and the Bethlehem community.</p>
      </div>
    </footer>
  )
}

export default Footer
