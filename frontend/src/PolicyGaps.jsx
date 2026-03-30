import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import { useLanguage } from './languageContext'
import { pickI18n } from './i18nUtils'
import { t } from './uiStrings'
import './PolicyGaps.css'

const POLICY_GAPS_QUERY = `*[_type == "policyGap"] | order(title asc){
  _id,
  title,
  titleI18n,
  "slug": slug.current,
  experience,
  experienceI18n,
  experienceHeading,
  experienceHeadingI18n,
  conditions,
  conditionsI18n,
  conditionsHeading,
  conditionsHeadingI18n,
  gaps,
  gapsI18n,
  gapsHeading,
  gapsHeadingI18n,
  implications,
  implicationsI18n,
  implicationsHeading,
  implicationsHeadingI18n,
  subsections[]{
    heading,
    headingI18n,
    body,
    bodyI18n
  },
  image{
    asset->{ url },
    alt,
    caption
  }
}`

const POLICY_GAPS_PAGE_QUERY = `*[_type == "policyGapsPage" && _id == "policyGapsPage"][0]{
  pageTitle,
  pageTitleI18n,
  subtitle,
  subtitleI18n,
  sectionHeadings{
    tocHeading,
    tocHeadingI18n,
    experienceHeading,
    experienceHeadingI18n,
    conditionsHeading,
    conditionsHeadingI18n,
    gapsHeading,
    gapsHeadingI18n,
    implicationsHeading,
    implicationsHeadingI18n,
    actionHeading,
    actionHeadingI18n,
    overlappingThemesHeading,
    overlappingThemesHeadingI18n,
    forPolicymakersHeading,
    forPolicymakersHeadingI18n,
    forActivistsHeading,
    forActivistsHeadingI18n,
    returnTopLabel,
    returnTopLabelI18n
  },
  actionSection{
    overlappingThemes,
    forPolicymakers,
    forPolicymakersI18n,
    forActivists,
    forActivistsI18n
  }
}`

export default function PolicyGaps() {
  const lang = useLanguage()
  const [policyData, setPolicyData] = useState([])
  const [pageConfig, setPageConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [gaps, config] = await Promise.all([
          sanity.fetch(POLICY_GAPS_QUERY),
          sanity.fetch(POLICY_GAPS_PAGE_QUERY),
        ])
        setPolicyData(gaps || [])
        setPageConfig(config)
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
        <p aria-live="polite">{t(lang, 'pages.policyGaps.loading')}</p>
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

  const title = pickI18n(pageConfig?.pageTitleI18n, lang, pageConfig?.pageTitle) || 'Policy & Service Gaps'
  const subtitle = pickI18n(pageConfig?.subtitleI18n, lang, pageConfig?.subtitle) || 'Bridging the gap between policy and lived experience. A living document of accessibility challenges in Bethlehem and recommendations for change.'
  const actionSection = pageConfig?.actionSection ?? {}
  const sectionHeadings = pageConfig?.sectionHeadings ?? {}
  const overlappingThemes = actionSection?.overlappingThemes ?? []
  const forPolicymakers = pickI18n(actionSection?.forPolicymakersI18n, lang, actionSection?.forPolicymakers) ?? ''
  const forActivists = pickI18n(actionSection?.forActivistsI18n, lang, actionSection?.forActivists) ?? ''
  const tocHeading = pickI18n(sectionHeadings?.tocHeadingI18n, lang, sectionHeadings?.tocHeading) || 'Jump to a Section'
  const experienceHeading = pickI18n(sectionHeadings?.experienceHeadingI18n, lang, sectionHeadings?.experienceHeading) || 'The Resident Experience'
  const conditionsHeading = pickI18n(sectionHeadings?.conditionsHeadingI18n, lang, sectionHeadings?.conditionsHeading) || 'Current Conditions'
  const gapsHeading = pickI18n(sectionHeadings?.gapsHeadingI18n, lang, sectionHeadings?.gapsHeading) || 'Analyzing the Gap'
  const implicationsHeading = pickI18n(sectionHeadings?.implicationsHeadingI18n, lang, sectionHeadings?.implicationsHeading) || 'Policy Implications'
  const actionHeading = pickI18n(sectionHeadings?.actionHeadingI18n, lang, sectionHeadings?.actionHeading) || 'Moving Forward: From Observation to Action'
  const overlappingThemesHeading =
    pickI18n(sectionHeadings?.overlappingThemesHeadingI18n, lang, sectionHeadings?.overlappingThemesHeading) || 'Overlapping Themes'
  const forPolicymakersHeading =
    pickI18n(sectionHeadings?.forPolicymakersHeadingI18n, lang, sectionHeadings?.forPolicymakersHeading) || 'For Policymakers'
  const forActivistsHeading =
    pickI18n(sectionHeadings?.forActivistsHeadingI18n, lang, sectionHeadings?.forActivistsHeading) || 'For Activists and Community Members'
  const returnTopLabel =
    pickI18n(sectionHeadings?.returnTopLabelI18n, lang, sectionHeadings?.returnTopLabel) || '↑ Return to Top'

  return (
    <main className="container" id="main-content">
      <Breadcrumb />
      <header className="policy-header">
        <Link to="/" className="back-link">{t(lang, 'pages.policyGaps.backHome')}</Link>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </header>

      <nav className="policy-toc" aria-labelledby="toc-heading">
        <h2 id="toc-heading">{tocHeading}</h2>
        <ul className="toc-list">
          {policyData.map((item) => (
            <li key={`toc-${item._id}`}>
              <a href={`#${item.slug || item._id}`}>{pickI18n(item.titleI18n, lang, item.title)}</a>
            </li>
          ))}
          <li><a href="#action">{actionHeading}</a></li>
        </ul>
      </nav>

      <div className="policy-content">
        {policyData.map((area) => (
          <article
            key={area._id}
            id={area.slug || area._id}
            className="policy-section"
            aria-labelledby={`heading-${area.slug || area._id}`}
          >
            <h2 id={`heading-${area.slug || area._id}`}>{pickI18n(area.titleI18n, lang, area.title)}</h2>

            <div className={`policy-grid${area.image?.asset?.url ? ' policy-grid--with-image' : ''}`}>
              <>
                <div className="policy-block">
                  <h3>{pickI18n(area.experienceHeadingI18n, lang, area.experienceHeading) || experienceHeading}</h3>
                  <p>{pickI18n(area.experienceI18n, lang, area.experience)}</p>
                </div>

                <div className="policy-block">
                  <h3>{pickI18n(area.conditionsHeadingI18n, lang, area.conditionsHeading) || conditionsHeading}</h3>
                  <p>{pickI18n(area.conditionsI18n, lang, area.conditions)}</p>
                </div>

                <div className="policy-block">
                  <h3>{pickI18n(area.gapsHeadingI18n, lang, area.gapsHeading) || gapsHeading}</h3>
                  <p>{pickI18n(area.gapsI18n, lang, area.gaps)}</p>
                </div>

                {(Array.isArray(area.subsections) && area.subsections.length > 0) &&
                  area.subsections.map((section, index) => (
                    <div className="policy-block" key={`${area._id}-subsection-${index}`}>
                      <h3>{pickI18n(section?.headingI18n, lang, section?.heading)}</h3>
                      <p>{pickI18n(section?.bodyI18n, lang, section?.body)}</p>
                    </div>
                  ))}
              </>

              {area.image?.asset?.url && (
                <figure className="policy-block policy-block-image">
                  <img
                    src={area.image.asset.url}
                    alt={area.image.alt || ''}
                    loading="lazy"
                  />
                  {area.image.caption && (
                    <figcaption>{area.image.caption}</figcaption>
                  )}
                </figure>
              )}

              <div className="policy-block highlight-block policy-block-full-width">
                <h3>{pickI18n(area.implicationsHeadingI18n, lang, area.implicationsHeading) || implicationsHeading}</h3>
                <ul>
                  {(area.implications || []).map((imp, index) => (
                    <li key={index}>{pickI18n(area.implicationsI18n?.[index], lang, imp)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}

        <article id="action" className="policy-section" aria-labelledby="heading-action">
          <h2 id="heading-action">{actionHeading}</h2>

          {overlappingThemes.length > 0 && (
            <>
              <h3>{overlappingThemesHeading}</h3>
              <ul>
                {overlappingThemes.map((theme, index) => (
                  <li key={index}>
                    {theme?.label && <strong>{theme.label}:</strong>}{' '}
                    {theme?.description}
                  </li>
                ))}
              </ul>
            </>
          )}

          {forPolicymakers && (
            <>
              <h3>{forPolicymakersHeading}</h3>
              <p>{forPolicymakers}</p>
            </>
          )}

          {forActivists && (
            <>
              <h3>{forActivistsHeading}</h3>
              <p>{forActivists}</p>
            </>
          )}
        </article>
      </div>

      <p className="return-top">
        <a href="#main-content">{returnTopLabel}</a>
      </p>
    </main>
  )
}
