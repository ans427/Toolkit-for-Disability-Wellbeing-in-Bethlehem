import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'
import { sanity } from './sanityClient'
import { useLanguage } from './languageContext'
import { pickI18n } from './i18nUtils'
import { t } from './uiStrings'
import './AccessibilityStatement.css'

const ACCESSIBILITY_STATEMENT_QUERY = `*[_type == "accessibilityStatementPage" && _id == "accessibilityStatementPage"][0]{
  pageTitle,
  pageTitleI18n,
  intro,
  introI18n,
  sections[]{
    heading,
    headingI18n,
    body,
    bodyI18n,
    listItems[]{
      text,
      textI18n
    }
  },
  contactEmail,
  contactEmailLabel,
  contactEmailLabelI18n
}`

function AccessibilityStatement() {
  const lang = useLanguage()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sanity.fetch(ACCESSIBILITY_STATEMENT_QUERY)
        setContent(data || null)
      } catch (err) {
        console.error('Failed to load Accessibility Statement content from Sanity:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const title = pickI18n(content?.pageTitleI18n, lang, content?.pageTitle) || t(lang, 'breadcrumb.accessibilityStatement')
  const intro = pickI18n(content?.introI18n, lang, content?.intro)
  const sections = Array.isArray(content?.sections) ? content.sections : []
  const contactEmail = content?.contactEmail || ''
  const gmailContactLink = contactEmail
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`
    : ''
  const contactEmailLabel =
    pickI18n(content?.contactEmailLabelI18n, lang, content?.contactEmailLabel) || 'Email'

  if (loading) {
    return (
      <main className="container">
        <Breadcrumb />
        <p aria-live="polite">Loading accessibility statement...</p>
      </main>
    )
  }

  return (
    <main className="container">
      <Breadcrumb />
      <div className="accessibility-statement">
        <header className="accessibility-statement-header">
          <Link to="/" className="back-link">{t(lang, 'pages.reportIssue.backHome')}</Link>
          <h1>{title}</h1>
          {intro && <p className="subtitle">{intro}</p>}
        </header>

        {sections.map((section, idx) => {
          const heading = pickI18n(section?.headingI18n, lang, section?.heading)
          const body = pickI18n(section?.bodyI18n, lang, section?.body)
          const listItems = (section?.listItems || [])
            .map((item) => pickI18n(item?.textI18n, lang, item?.text))
            .filter(Boolean)

          return (
            <section className="statement-section" key={idx}>
              {heading && <h2>{heading}</h2>}
              {body && body.split(/\n\s*\n/g).map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph.trim()}</p>
              ))}
              {listItems.length > 0 && (
                <ul>
                  {listItems.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}

        {contactEmail && (
          <section className="statement-section">
            <p>
              {contactEmailLabel}: <a href={gmailContactLink} target="_blank" rel="noopener noreferrer">{contactEmail}</a>
            </p>
          </section>
        )}

        <section className="statement-section">
          <p>{t(lang, 'pages.accessibilityStatement.feedbackText')}</p>
          <Link to="/report-issue" className="statement-feedback-button">
            {t(lang, 'pages.accessibilityStatement.feedbackLinkLabel')}
          </Link>
        </section>

        {sections.length === 0 && (
          <section className="statement-section">
            <p>Accessibility Statement content has not been configured in Sanity yet.</p>
          </section>
        )}
      </div>
    </main>
  )
}

export default AccessibilityStatement
