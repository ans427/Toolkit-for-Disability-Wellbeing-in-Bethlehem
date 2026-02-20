import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import './ImmediateResources.css'

/* Human-readable category labels for filter and display */
const CATEGORY_LABELS = {
  'legal-aid': 'Legal Aid',
  'community-organizations': 'Community Organizations',
  'mutual-aid-support': 'Mutual Aid Support',
  'interdependency-support': 'Interdependency Support',
  'mental-health-support': 'Mental Health Support',
  'general': 'General',
}

function getCategoryLabel(value) {
  return CATEGORY_LABELS[value] || value || 'General'
}

function ImmediateResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setError(null)
        const data = await sanity.fetch(
          `*[_type == "resource"] | order(title asc){
            _id,
            title,
            category,
            url,
            description,
            contactEmail,
            contactPhone,
            address{
              street,
              city,
              state,
              zipCode
            },
            image{
              asset->{ url },
              alt
            }
          }`
        )
        setResources(data || [])
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Failed to load resources. Check your connection and try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const categories = useMemo(() => {
    const seen = new Set()
    resources.forEach((r) => {
      const cat = r.category || 'general'
      seen.add(cat)
    })
    return ['', ...Array.from(seen).sort()]
  }, [resources])

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const byCategory = !categoryFilter
      ? resources
      : resources.filter((r) => (r.category || 'general') === categoryFilter)
    if (!query) return byCategory
    return byCategory.filter((r) => {
      const title = (r.title || '').toLowerCase()
      const description = (r.description || '').toLowerCase()
      const category = getCategoryLabel(r.category || 'general').toLowerCase()
      return title.includes(query) || description.includes(query) || category.includes(query)
    })
  }, [resources, categoryFilter, searchQuery])

  return (
    <main className="container">
      <Breadcrumb />
      <header className="resource-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Immediate Resources</h1>
        <p className="subtitle">Healthcare, legal, and community support in Bethlehem.</p>
      </header>

      {loading ? (
        <p>Loading resources...</p>
      ) : error ? (
        <p className="resource-error">
          {error}
        </p>
      ) : (
        <>
          <section
            className="resource-filter"
            aria-label="Search and filter resources"
          >
            <div className="resource-filter-controls">
              <div className="resource-search-wrap">
                <label htmlFor="resource-search" className="resource-search-label">
                  Search resources
                </label>
                <input
                  id="resource-search"
                  type="search"
                  className="resource-search-input"
                  placeholder="Search by name, description, or category…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search resources by name, description, or category"
                  aria-describedby="filter-results-count"
                  autoComplete="off"
                />
              </div>

              <fieldset className="resource-filter-fieldset">
                <legend className="resource-filter-legend">
                  Filter by category
                </legend>
                <select
                  id="resource-category-filter"
                  className="resource-filter-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filter resources by category"
                  aria-describedby="filter-results-count"
                >
                  <option value="">All categories</option>
                  {categories.filter(Boolean).map((cat) => (
                    <option key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </option>
                  ))}
                </select>
              </fieldset>
            </div>

            <p
              id="filter-results-count"
              className="resource-filter-count"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {filteredResources.length === 0
                ? 'No resources match your search.'
                : `Showing ${filteredResources.length} ${filteredResources.length === 1 ? 'resource' : 'resources'}.`}
            </p>
          </section>

          <div className="resource-grid">
            {filteredResources.map((resource) => (
            <article key={resource._id} className="resource-card">

              {/* 1. IMAGE AREA */}
              {resource.image?.asset?.url && (
                <div className="card-image-wrapper">
                  <img
                    src={resource.image.asset.url}
                    alt={resource.image.alt || resource.title}
                    className="card-image"
                  />
                </div>
              )}

              {/* 2. CONTENT AREA */}
              <div className="card-content">
                <span className="card-category">
                  {getCategoryLabel(resource.category || 'general')}
                </span>

                <h3 className="card-title">
                  {resource.title}
                </h3>

                <p className="card-description">
                  {resource.description}
                </p>

                {/* Contact Info */}
                {(resource.contactEmail || resource.contactPhone || resource.address) && (
                  <div className="card-contact">

                    {resource.contactPhone && (
                      <p>
                        📞 <a href={`tel:${resource.contactPhone}`}>
                          {resource.contactPhone}
                        </a>
                      </p>
                    )}

                    {resource.contactEmail && (
                      <p>
                        ✉️ <a href={`mailto:${resource.contactEmail}`}>
                          {resource.contactEmail}
                        </a>
                      </p>
                    )}

                    {resource.address?.street && (
                      <p className="card-address">
                        📍 {resource.address.street}<br />
                        {resource.address.city}, {resource.address.state} {resource.address.zipCode}
                      </p>
                    )}

                  </div>
                )}


                {/* The Button */}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-button"
                >
                  Visit Website ↗
                </a>
              </div>
            </article>
          ))}
          </div>
        </>
      )}
    </main>
  )
}

export default ImmediateResources