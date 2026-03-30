import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'
import { sanity } from './sanityClient'
import { useLanguage } from './languageContext'
import { pickI18n } from './i18nUtils'
import './About.css'

const ABOUT_PAGE_QUERY = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  pageTitle,
  pageTitleI18n,
  sections[]{
    heading,
    headingI18n,
    body,
    bodyI18n,
    listType,
    listItems[]{
      text,
      textI18n
    }
  }
}`

function About() {
  const lang = useLanguage()
  const [content, setContent] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sanity.fetch(ABOUT_PAGE_QUERY)
        setContent(data || null)
      } catch (err) {
        console.error('Failed to load About page content from Sanity:', err)
      }
    }
    load()
  }, [])

  const title = pickI18n(content?.pageTitleI18n, lang, content?.pageTitle) || 'About Us'
  const sections = Array.isArray(content?.sections) ? content.sections : []

  const renderBodyParagraphs = (section) => {
    const body = pickI18n(section?.bodyI18n, lang, section?.body) || ''
    return body
      .split(/\n\s*\n/g)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p, idx) => <p key={idx}>{p}</p>)
  }

  const renderList = (section) => {
    const items = (section?.listItems || [])
      .map((item) => pickI18n(item?.textI18n, lang, item?.text))
      .filter(Boolean)

    if (!items.length || section?.listType === 'none') return null
    if (section?.listType === 'number') {
      return (
        <ol>
          {items.map((item, idx) => <li key={idx}>{item}</li>)}
        </ol>
      )
    }
    return (
      <ul>
        {items.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    )
  }

  return (
    <>
      <main className="container">
        <Breadcrumb />
        <div className="about">
          <header className="about-header">
            <Link to="/" className="back-link">← Back Home</Link>
            <h1>{title}</h1>
          </header>

          {sections.map((section, idx) => (
            <section key={idx} className="about-section">
              <h2>{pickI18n(section?.headingI18n, lang, section?.heading)}</h2>
              {renderBodyParagraphs(section)}
              {renderList(section)}
            </section>
          ))}

          {sections.length === 0 && (
            <section className="about-section">
              <p>About content has not been configured in Sanity yet.</p>
            </section>
          )}
        </div>
      </main>
    </>
  )
}

export default About
