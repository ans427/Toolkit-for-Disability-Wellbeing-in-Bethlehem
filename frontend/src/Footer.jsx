import { Link } from 'react-router-dom'
import { useLanguage } from './languageContext'
import { t } from './uiStrings'
import './Footer.css'

function Footer() {
  const lang = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer id="site-footer" className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>{t(lang, 'footer.navigation')}</h3>
          <ul>
            <li><Link to="/">{t(lang, 'breadcrumb.home')}</Link></li>
            <li><Link to="/resources">{t(lang, 'breadcrumb.resources')}</Link></li>
            <li><Link to="/community-stories">{t(lang, 'breadcrumb.communityStories')}</Link></li>
            <li><Link to="/policy-gaps">{t(lang, 'breadcrumb.policyGaps')}</Link></li>
            <li><Link to="/submit">{t(lang, 'breadcrumb.submit')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>{t(lang, 'footer.information')}</h3>
          <ul>
            <li><Link to="/about">{t(lang, 'breadcrumb.about')}</Link></li>
            <li><Link to="/sitemap">{t(lang, 'breadcrumb.sitemap')}</Link></li>
            <li><Link to="/disclaimers">{t(lang, 'breadcrumb.disclaimers')}</Link></li>
            <li><Link to="/accessibility-statement">{t(lang, 'breadcrumb.accessibilityStatement')}</Link></li>
            <li><Link to="/privacy-policy">{t(lang, 'breadcrumb.privacyPolicy')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>{t(lang, 'footer.contactUs')}</h3>
          <p>{t(lang, 'footer.emailLabel')}: <a href="mailto:example@example.org">example@example.org</a></p>
          <p>{t(lang, 'footer.phoneLabel')}: (123) 456-7890</p>
          <p>{t(lang, 'footer.addressLabel')}: Bethlehem, PA 18015</p>
        </div>

        <div className="footer-section">
          <h3>{t(lang, 'breadcrumb.about')}</h3>
          <p>{t(lang, 'footer.aboutBody')}</p>
          <p><Link to="/about">{t(lang, 'footer.learnMore')}</Link></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t(lang, 'footer.copyright').replace('{{year}}', currentYear)}</p>
      </div>
    </footer>
  )
}

export default Footer
