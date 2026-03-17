import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import { useLanguage } from './languageContext'
import { pickI18n } from './i18nUtils'
import { t } from './uiStrings'
import './DisabilityActivism.css'

const DISABILITY_ACTIVISM_QUERY = `*[_type == "disabilityActivismPage" && _id == "disabilityActivismPage"][0]{
  pageTitle,
  pageTitleI18n,
  subtitle,
  subtitleI18n,
  intro,
  introI18n,
  sections[]{
    title,
    titleI18n,
    content
    ,contentI18n
  },
  principlesSection{
    intro,
    principles[]{
      number,
      title,
      description
    }
  },
  externalLinks[]{
    label,
    url
  },
  sources[]{
    text,
    url
  }
}`

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export default function DisabilityActivism() {
  const lang = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const result = await sanity.fetch(DISABILITY_ACTIVISM_QUERY)
        setData(result)
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Failed to load content.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="container" id="main-content">
        <Breadcrumb />
        <p aria-live="polite">{t(lang, 'pages.disabilityActivism.loading')}</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container" id="main-content">
        <Breadcrumb />
        <div className="error-container">
          <p>{error}</p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </main>
    )
  }

  const title = pickI18n(data?.pageTitleI18n, lang, data?.pageTitle) ?? 'Disability Activism'
  const subtitle = pickI18n(data?.subtitleI18n, lang, data?.subtitle) ?? ''
  const intro = pickI18n(data?.introI18n, lang, data?.intro) ?? ''
  const sections = data?.sections ?? []
  const principlesSection = data?.principlesSection ?? {}
  const principles = principlesSection?.principles ?? []
  const externalLinks = data?.externalLinks ?? []
  const sources = data?.sources ?? []

  const tocItems = [
    ...sections.map((s) => {
      const sectionTitle = pickI18n(s?.titleI18n, lang, s?.title)
      return { title: sectionTitle, slug: slugify(sectionTitle) }
    }),
    ...(principles.length > 0
      ? [{ title: 'Ten Principles of Disability Justice', slug: 'ten-principles' }]
      : []),
    ...(externalLinks.length > 0 ? [{ title: 'Further Reading', slug: 'further-reading' }] : []),
    ...(sources.length > 0 ? [{ title: 'Sources', slug: 'sources' }] : []),
  ]

  return (
    <main className="container disability-activism" id="main-content">
      <Breadcrumb />
      <header className="disability-activism-header">
        <Link to="/" className="back-link">{t(lang, 'pages.disabilityActivism.backHome')}</Link>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {intro && (
          <div className="intro">
            {intro.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
      </header>

      {tocItems.length > 0 && (
        <nav className="disability-activism-toc" aria-labelledby="toc-heading">
          <h2 id="toc-heading">Jump to a Section</h2>
          <ul className="toc-list">
            {tocItems.map((item) => (
              <li key={item.slug}>
                <a href={`#${item.slug}`}>{item.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="disability-activism-content">
        {sections.map((section, index) => (
          <article
            key={index}
            id={slugify(pickI18n(section?.titleI18n, lang, section?.title))}
            className="disability-activism-section"
            aria-labelledby={`heading-${slugify(pickI18n(section?.titleI18n, lang, section?.title))}`}
          >
            <h2 id={`heading-${slugify(pickI18n(section?.titleI18n, lang, section?.title))}`}>
              {pickI18n(section?.titleI18n, lang, section?.title)}
            </h2>
            {pickI18n(section?.contentI18n, lang, section?.content) && (
              <div className="section-content">
                {pickI18n(section?.contentI18n, lang, section?.content).split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </article>
        ))}

        {principles.length > 0 && (
          <article
            id="ten-principles"
            className="disability-activism-section principles-section"
            aria-labelledby="heading-ten-principles"
          >
            <h2 id="heading-ten-principles">Ten Principles of Disability Justice</h2>
            {principlesSection?.intro && (
              <p className="principles-intro">{principlesSection.intro}</p>
            )}
            <ol className="principles-list">
              {principles
                .sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
                .map((principle, index) => (
                  <li key={index} className="principle-item">
                    <strong>{principle.title}</strong>
                    {principle.description && (
                      <span className="principle-desc">{principle.description}</span>
                    )}
                  </li>
                ))}
            </ol>
          </article>
        )}

        {externalLinks.length > 0 && (
          <article
            id="further-reading"
            className="disability-activism-section"
            aria-labelledby="heading-further-reading"
          >
            <h2 id="heading-further-reading">{t(lang, 'pages.disabilityActivism.furtherReading')}</h2>
            <ul className="external-links-list">
              {externalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    {link.label || link.url}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        )}

        {sources.length > 0 && (
          <article
            id="sources"
            className="disability-activism-section sources-section"
            aria-labelledby="heading-sources"
          >
            <h2 id="heading-sources">{t(lang, 'pages.disabilityActivism.sources')}</h2>
            <ul className="sources-list">
              {sources.map((source, index) => (
                <li key={index}>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      {source.text || source.url}
                    </a>
                  ) : (
                    <span>{source.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>

      <p className="return-top">
        <a href="#main-content">{t(lang, 'pages.disabilityActivism.returnTop')}</a>
      </p>
    </main>
  )
}
