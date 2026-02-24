import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import ResourceComments from './ResourceComments'
import WasThisHelpful from './WasThisHelpful'
import './ResourceDetail.css'

const CATEGORY_LABELS = {
  'legal-aid': 'Legal Aid',
  'community-organizations': 'Community Organizations',
  'mutual-aid-support': 'Mutual Aid Support',
  'interdependency-support': 'Interdependency Support',
  'mental-health-support': 'Mental Health Support',
  general: 'General',
}

function getCategoryLabel(value) {
  return CATEGORY_LABELS[value] || value || 'General'
}

function ResourceDetail() {
  const { resourceId } = useParams()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = useCallback((index) => setLightboxIndex(index), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const galleryLengthRef = useRef(0)

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await sanity.fetch(
          `*[_type == "resource" && _id == $resourceId][0]{
            _id,
            title,
            category,
            description,
            url,
            isFree,
            isChildSpecific,
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
            },
            coverImage{
              asset->{ url },
              alt
            },
            gallery[]{
              asset->{ url },
              alt,
              caption
            }
          }`,
          { resourceId }
        )

        if (!data) {
          setError('Resource not found')
        } else {
          setResource(data)
        }
      } catch (err) {
        console.error('Error fetching resource:', err)
        setError('Failed to load resource')
      } finally {
        setLoading(false)
      }
    }

    fetchResource()
  }, [resourceId])

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex == null) return
      const len = galleryLengthRef.current
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i <= 0 ? len - 1 : i - 1))
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i >= len - 1 ? 0 : i + 1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, closeLightbox])

  useEffect(() => {
    if (lightboxIndex != null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxIndex])

  if (loading) {
    return (
      <main className="container">
        <Breadcrumb />
        <p>Loading resource...</p>
      </main>
    )
  }

  if (error || !resource) {
    return (
      <main className="container">
        <Breadcrumb />
        <div className="error-container">
          <p>{error || 'Resource not found'}</p>
          <Link to="/resources" className="back-link">
            ← Back to Immediate Resources
          </Link>
        </div>
      </main>
    )
  }

  const heroImage =
    resource.coverImage?.asset?.url ||
    resource.image?.asset?.url ||
    (resource.gallery?.[0]?.asset?.url ?? null)

  const galleryImages = resource.gallery?.filter((img) => img?.asset?.url) ?? []
  const showGallerySeparately = galleryImages.length > 1 || (galleryImages.length === 1 && heroImage !== galleryImages[0]?.asset?.url)
  const displayGalleryImages = showGallerySeparately
    ? galleryImages.filter((img) => heroImage !== img?.asset?.url)
    : []

  galleryLengthRef.current = displayGalleryImages.length
  const galleryLength = displayGalleryImages.length
  const goToPrev = () => {
    setLightboxIndex((i) => (i <= 0 ? galleryLength - 1 : i - 1))
  }
  const goToNext = () => {
    setLightboxIndex((i) => (i >= galleryLength - 1 ? 0 : i + 1))
  }

  return (
    <main className="resource-detail-page container">
      <Breadcrumb />

      <article className="resource-detail">
        <Link to="/resources" className="resource-back-link">
          ← Back to Immediate Resources
        </Link>

        <header
          className={`resource-hero ${heroImage ? 'resource-hero--with-image' : 'resource-hero--no-image'}`}
        >
          {heroImage && (
            <div className="resource-hero-bg">
              <img src={heroImage} alt="" aria-hidden />
              <div className="resource-hero-overlay" />
            </div>
          )}
          <div className="resource-hero-content">
            <div className="resource-hero-badges">
              <span className="resource-category-pill">
                {getCategoryLabel(resource.category || 'general')}
              </span>
              {resource.isFree && <span className="resource-badge resource-badge--free">Free</span>}
              {resource.isChildSpecific && (
                <span className="resource-badge resource-badge--child">For Children</span>
              )}
            </div>
            <h1 className="resource-hero-title">{resource.title}</h1>
          </div>
        </header>

        <div className="resource-content">
          {resource.url && (
            <div className="resource-cta-wrap">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-cta-button"
              >
                Visit Website ↗
              </a>
            </div>
          )}

          {resource.description && (
            <section className="resource-section resource-about">
              <h2 className="resource-section-title">About this resource</h2>
              <p className="resource-description">{resource.description}</p>
            </section>
          )}

          {showGallerySeparately && (
            <section className="resource-section resource-gallery-section">
              <h2 className="resource-section-title">Photos</h2>
              <div className="resource-gallery">
                {displayGalleryImages.map((img, index) => (
                  <figure
                    key={index}
                    className="resource-gallery-figure"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={img.asset.url}
                      alt={img.alt || `Photo ${index + 1}`}
                      loading="lazy"
                    />
                    {img.caption && <figcaption>{img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {(resource.contactEmail || resource.contactPhone || resource.address) && (
            <section className="resource-section resource-contact-section">
              <h2 className="resource-section-title">Contact</h2>
              <div className="resource-contact-card">
                {resource.contactPhone && (
                  <a href={`tel:${resource.contactPhone}`} className="resource-contact-item">
                    <span className="resource-contact-icon">📞</span>
                    {resource.contactPhone}
                  </a>
                )}
                {resource.contactEmail && (
                  <a href={`mailto:${resource.contactEmail}`} className="resource-contact-item">
                    <span className="resource-contact-icon">✉️</span>
                    {resource.contactEmail}
                  </a>
                )}
                {resource.address?.street && (
                  <div className="resource-contact-item resource-contact-address">
                    <span className="resource-contact-icon">📍</span>
                    <span>
                      {resource.address.street}
                      <br />
                      {resource.address.city}, {resource.address.state} {resource.address.zipCode}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {lightboxIndex != null && displayGalleryImages.length > 0 && (
          <div
            className="resource-lightbox"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="View photo"
          >
            <button
              type="button"
              className="resource-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ×
            </button>
            <button
              type="button"
              className="resource-lightbox-prev"
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <img
              src={displayGalleryImages[lightboxIndex]?.asset?.url}
              alt={displayGalleryImages[lightboxIndex]?.alt || `Photo ${lightboxIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="resource-lightbox-next"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
        )}
      </article>

      <WasThisHelpful
        resourceId={resourceId}
        initialHelpfulCount={resource.helpfulCount ?? 0}
        initialNotHelpfulCount={resource.notHelpfulCount ?? 0}
      />
      <ResourceComments resourceId={resourceId} />
    </main>
  )
}

export default ResourceDetail
