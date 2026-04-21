import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'
import { sanity } from './sanityClient'
import { useLanguage } from './languageContext'
import { pickI18n } from './i18nUtils'
import { t } from './uiStrings'
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
  },
  getInvolved{
    heading,
    headingI18n,
    body,
    bodyI18n,
    buttonLabel,
    buttonLabelI18n,
    buttonHref
  },
  contact{
    heading,
    headingI18n,
    emailLabel,
    emailLabelI18n,
    email,
    phoneLabel,
    phoneLabelI18n,
    phone,
    body,
    bodyI18n
  },
  funding,
  fundingI18n
}`

const CONTRIBUTORS = {
  faculty: [
    'Christina Chi Zhang, Assistant Professor, Department of Art, Architecture & Design',
    'Austin Duncan, Assistant Professor, Department of Community & Global Health',
    'Jiin Jung, Assistant Professor, Department of Psychology',
    'Jenny Kowalski, Assistant Professor, Department of Art, Architecture & Design',
    'Thomas Micklas, Adjunct Professor, Computer Science Capstone',
  ],
  students: {
    researchAndWriting: [
      'Demi Benard',
      'Corinn Brewer',
      'Allison Bronson',
      'Karleigh Groves',
      'Hannah Letzer',
      'Julie Wright',
      'Kyra Zimmerman',
    ],
    translationSupport: ['Naomi Barragan'],
    designAndDevelopment: [
      'Angelina Le',
      'Melina Sawyers',
      'Anna Seftenberg',
      'Ellee Segal',
    ],
  },
}

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
  const getInvolved = content?.getInvolved || null
  const contact = content?.contact || null
  const contactEmail = contact?.email || 'inclusivebethlehem@gmail.com'
  const phoneNumber = contact?.phone || ''
  const gmailContactLink = contactEmail
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`
    : ''

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

        <section className="about-section">
          <h2>Team</h2>
          <h3>Faculty</h3>
          <ul>
            {CONTRIBUTORS.faculty.map((facultyMember) => (
              <li key={facultyMember}>{facultyMember}</li>
            ))}
          </ul>
          <h3>Students</h3>
          <h4>Research and Writing</h4>
          <ul>
            {CONTRIBUTORS.students.researchAndWriting.map((student) => (
              <li key={student}>{student}</li>
            ))}
          </ul>
          <h4>Translation Support</h4>
          <ul>
            {CONTRIBUTORS.students.translationSupport.map((student) => (
              <li key={student}>{student}</li>
            ))}
          </ul>
          <h4>Design and Development</h4>
          <ul>
            {CONTRIBUTORS.students.designAndDevelopment.map((student) => (
              <li key={student}>{student}</li>
            ))}
          </ul>
        </section>

        { (content?.funding || content?.fundingI18n) && (
          <section className="about-section">
            <h2>{t(lang, 'about.fundingHeading') || 'Funding'}</h2>
            <p>{pickI18n(content?.fundingI18n, lang, content?.funding)}</p>
          </section>
        )}

        {getInvolved && (
          <section className="about-section">
            <h2>{pickI18n(getInvolved?.headingI18n, lang, getInvolved?.heading) || 'Get Involved'}</h2>
            {(pickI18n(getInvolved?.bodyI18n, lang, getInvolved?.body) || '')
              .split(/\n\s*\n/g)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((p, idx) => <p key={idx}>{p}</p>)}
            <p>
              <Link to={getInvolved?.buttonHref || '/submit'} className="inline-link">
                {pickI18n(getInvolved?.buttonLabelI18n, lang, getInvolved?.buttonLabel) || 'Submit a Resource or Story'}
              </Link>
            </p>
          </section>
        )}

        {contact && (
          <section className="about-section about-contact">
            <h2>{pickI18n(contact?.headingI18n, lang, contact?.heading) || 'Contact Us'}</h2>
            <p>
              {(pickI18n(contact?.emailLabelI18n, lang, contact?.emailLabel) || 'Email')}: {' '}
              {contactEmail ? (
                <a href={gmailContactLink} target="_blank" rel="noopener noreferrer">{contactEmail}</a>
              ) : <span>—</span>}
            </p>
            {phoneNumber && (
              <p>
                {(pickI18n(contact?.phoneLabelI18n, lang, contact?.phoneLabel) || 'Phone')}: {' '}
                <a href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}>{phoneNumber}</a>
              </p>
            )}
            {(pickI18n(contact?.bodyI18n, lang, contact?.body) || '')
              .split(/\n\s*\n/g)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((p, idx) => <p key={idx}>{p}</p>)}
          </section>
        )}
      </main>
    </>
  )
}

export default About
