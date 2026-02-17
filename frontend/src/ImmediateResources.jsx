import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import './ImmediateResources.css'

function ImmediateResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        <div className="resource-grid">
          {resources.map((resource) => (
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
                  {resource.category ? resource.category : 'General'}
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
      )}
    </main>
  )
}

export default ImmediateResources