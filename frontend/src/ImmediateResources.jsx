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
  const [selectedCategories, setSelectedCategories] = useState(new Set())
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
            helpfulCount,
            notHelpfulCount,
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
    return Array.from(seen).sort()
  }, [resources])

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const allChipIds = ['filter-all', ...categories.map((c) => `filter-${c}`)]

  const handleChipKeyDown = (e, index) => {
    let nextIndex = index
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = Math.min(index + 1, allChipIds.length - 1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = Math.max(index - 1, 0)
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = allChipIds.length - 1
    }
    if (nextIndex !== index) {
      document.getElementById(allChipIds[nextIndex])?.focus()
    }
  }

  const showAll = selectedCategories.size === 0

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const byCategory = showAll
      ? resources
      : resources.filter((r) => selectedCategories.has(r.category || 'general'))
    if (!query) return byCategory
    return byCategory.filter((r) => {
      const title = (r.title || '').toLowerCase()
      const description = (r.description || '').toLowerCase()
      const category = getCategoryLabel(r.category || 'general').toLowerCase()
      return title.includes(query) || description.includes(query) || category.includes(query)
    })
  }, [resources, showAll, selectedCategories, searchQuery])

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

              <div
                className="resource-filter-chips"
                role="group"
                aria-label="Filter by category"
                aria-describedby="filter-results-count"
              >
                <span className="resource-filter-legend">Filter by category</span>
                <div className="resource-filter-chip-list">
                  <button
                      id="filter-all"
                      type="button"
                      className={`resource-filter-chip ${showAll ? 'resource-filter-chip--selected' : ''}`}
                      onClick={() => setSelectedCategories(new Set())}
                      onKeyDown={(e) => handleChipKeyDown(e, 0)}
                      aria-pressed={showAll}
                      aria-label="Show all categories"
                    >
                      All
                    </button>
                  {categories.map((cat, i) => (
                    <button
                        key={cat}
                        id={`filter-${cat}`}
                        type="button"
                        className={`resource-filter-chip ${selectedCategories.has(cat) ? 'resource-filter-chip--selected' : ''}`}
                        onClick={() => toggleCategory(cat)}
                        onKeyDown={(e) => handleChipKeyDown(e, i + 1)}
                        aria-pressed={selectedCategories.has(cat)}
                        aria-label={`Filter by ${getCategoryLabel(cat)}`}
                      >
                        {getCategoryLabel(cat)}
                      </button>
                  ))}
                </div>
              </div>
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
            <Link
              key={resource._id}
              to={`/resources/${resource._id}`}
              className="resource-card"
            >
              {resource.image?.asset?.url && (
                <div className="card-image-wrapper">
                  <img
                    src={resource.image.asset.url}
                    alt={resource.image.alt || resource.title}
                    className="card-image"
                  />
                </div>
              )}

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

                {((resource.helpfulCount ?? 0) + (resource.notHelpfulCount ?? 0)) > 0 && (
                  <p className="card-helpful-count" aria-label="Community feedback">
                    👍 {(resource.helpfulCount ?? 0)} found this helpful
                    {(resource.notHelpfulCount ?? 0) > 0 && (
                      <> · 👎 {resource.notHelpfulCount} did not</>
                    )}
                  </p>
                )}

                {(resource.contactEmail || resource.contactPhone || resource.address) && (
                  <div className="card-contact">

                    {resource.contactPhone && (
                      <p>
                        📞 <span>{resource.contactPhone}</span>
                      </p>
                    )}

                    {resource.contactEmail && (
                      <p>
                        ✉️ <span>{resource.contactEmail}</span>
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

                <span className="card-link-hint">View details →</span>
              </div>
            </Link>
          ))}
          </div>
        </>
      )}
    </main>
  )
}

export default ImmediateResources