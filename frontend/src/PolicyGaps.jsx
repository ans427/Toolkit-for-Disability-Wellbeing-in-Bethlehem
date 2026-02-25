import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import './PolicyGaps.css'

const POLICY_GAPS_QUERY = `*[_type == "policyGap"] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  experience,
  conditions,
  gaps,
  implications,
  image{
    asset->{ url },
    alt,
    caption
  }
}`

const POLICY_GAPS_PAGE_QUERY = `*[_type == "policyGapsPage" && _id == "policyGapsPage"][0]{
  pageTitle,
  subtitle,
  actionSection{
    overlappingThemes,
    forPolicymakers,
    forActivists
  }
}`

export default function PolicyGaps() {
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
        <p aria-live="polite">Loading Policy & Service Gaps...</p>
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

  const title = pageConfig?.pageTitle ?? 'Policy & Service Gaps'
  const subtitle = pageConfig?.subtitle ?? 'Bridging the gap between policy and lived experience. A living document of accessibility challenges in Bethlehem and recommendations for change.'
  const actionSection = pageConfig?.actionSection ?? {}
  const overlappingThemes = actionSection?.overlappingThemes ?? []
  const forPolicymakers = actionSection?.forPolicymakers ?? ''
  const forActivists = actionSection?.forActivists ?? ''

  return (
    <main className="container" id="main-content">
      <Breadcrumb />
      <header className="policy-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </header>

      <nav className="policy-toc" aria-labelledby="toc-heading">
        <h2 id="toc-heading">Jump to a Section</h2>
        <ul className="toc-list">
          {policyData.map((item) => (
            <li key={`toc-${item._id}`}>
              <a href={`#${item.slug || item._id}`}>{item.title}</a>
            </li>
          ))}
          <li><a href="#action">Moving Forward: From Observation to Action</a></li>
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
            <h2 id={`heading-${area.slug || area._id}`}>{area.title}</h2>

            <div className={`policy-grid${area.image?.asset?.url ? ' policy-grid--with-image' : ''}`}>
              <div className="policy-block">
                <h3>The Resident Experience</h3>
                <p>{area.experience}</p>
              </div>

              <div className="policy-block">
                <h3>Current Conditions</h3>
                <p>{area.conditions}</p>
              </div>

              <div className="policy-block">
                <h3>Analyzing the Gap</h3>
                <p>{area.gaps}</p>
              </div>

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
                <h3>Policy Implications</h3>
                <ul>
                  {(area.implications || []).map((imp, index) => (
                    <li key={index}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}

        <article id="action" className="policy-section" aria-labelledby="heading-action">
          <h2 id="heading-action">Moving Forward: From Observation to Action</h2>

          {overlappingThemes.length > 0 && (
            <>
              <h3>Overlapping Themes</h3>
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
              <h3>For Policymakers</h3>
              <p>{forPolicymakers}</p>
            </>
          )}

          {forActivists && (
            <>
              <h3>For Activists and Community Members</h3>
              <p>{forActivists}</p>
            </>
          )}
        </article>
      </div>

      <p className="return-top">
        <a href="#main-content">&uarr; Return to Top</a>
      </p>
    </main>
  )
}
