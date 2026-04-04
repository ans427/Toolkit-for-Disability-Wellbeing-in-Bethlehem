import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import { useLanguage } from './languageContext'
import { pickI18n } from './i18nUtils'
import { t } from './uiStrings'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './AccessibilityMap.css'

// Fix for default markers in react-leaflet
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Simple geocoding cache
const geocodeCache = new Map()

// Simple geocoding function using Nominatim (OpenStreetMap)
async function geocodeAddress(address) {
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
  const cacheKey = fullAddress.toLowerCase().trim()

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Bethlehem Disability Toolkit'
        }
      }
    )
    const data = await response.json()

    if (data && data.length > 0) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      geocodeCache.set(cacheKey, coords)
      return coords
    }
  } catch (error) {
    console.error('Geocoding error:', error)
  }

  // Fallback: return Bethlehem center with small random offset
  const baseLat = 40.6259
  const baseLng = -75.3705
  const offset = 0.005 // ~500 meters
  const lat = baseLat + (Math.random() - 0.5) * offset
  const lng = baseLng + (Math.random() - 0.5) * offset
  const coords = [lat, lng]
  geocodeCache.set(cacheKey, coords)
  return coords
}

function AccessibilityMap() {
  const lang = useLanguage()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [geocodedResources, setGeocodedResources] = useState([])
  const [reports, setReports] = useState([])
  const [geocodedReports, setGeocodedReports] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    details: '',
    locationType: 'address',
    address: { street: '', city: '', state: '', zipCode: '' },
    coordinates: { lat: null, lng: null },
    image: null,
    submitterName: '',
    submitterEmail: '',
  })
  const [formStatus, setFormStatus] = useState('idle')
  const [currentLocationDisplay, setCurrentLocationDisplay] = useState(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setError(null)
        const data = await sanity.fetch(
          `*[_type == "resource" && defined(address.street)]{
            _id,
            title,
            titleI18n,
            category,
            url,
            description,
            descriptionI18n,
            address{
              street,
              city,
              state,
              zipCode
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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await sanity.fetch(
          `*[_type == "accessibilityReport" && status == "approved"]{
            _id,
            subject,
            details,
            locationType,
            address{
              street,
              city,
              state,
              zipCode
            },
            coordinates{
              lat,
              lng
            },
            image{
              asset->{ url },
              alt
            }
          }`
        )
        console.log('Fetched accessibility reports:', data)
        setReports(data || [])
      } catch (err) {
        console.error('Error fetching reports:', err)
      }
    }

    fetchReports()
  }, [])

  useEffect(() => {
    const geocodeResources = async () => {
      if (resources.length === 0) return

      const geocoded = await Promise.all(
        resources.map(async (resource) => {
          const coords = await geocodeAddress(resource.address)
          return { ...resource, coordinates: coords }
        })
      )
      setGeocodedResources(geocoded)
    }

    geocodeResources()
  }, [resources])

  useEffect(() => {
    const geocodeReports = async () => {
      if (reports.length === 0) return

      const geocoded = await Promise.all(
        reports.map(async (report) => {
          let coords
          if (report.locationType === 'coordinates' && report.coordinates?.lat && report.coordinates?.lng) {
            coords = [report.coordinates.lat, report.coordinates.lng]
            console.log('Using coordinates for report:', report._id, coords)
          } else if (report.address?.street) {
            coords = await geocodeAddress(report.address)
            console.log('Geocoded address for report:', report._id, report.address, coords)
          } else {
            console.log('Skipping report due to missing location data:', report._id)
            return null // Skip this report
          }
          return { ...report, coordinates: coords }
        })
      )
      const validGeocoded = geocoded.filter(r => r !== null)
      console.log('Geocoded reports:', validGeocoded)
      setGeocodedReports(validGeocoded)
    }

    geocodeReports()
  }, [reports])

  // Default center on Bethlehem, PA
  const defaultCenter = [40.6259, -75.3705]

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }))
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] || null }))
    } else if (name === 'locationType') {
      setFormData(prev => ({ ...prev, [name]: value }))
      if (value === 'address') {
        setCurrentLocationDisplay(null)
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const reverseGeocodeCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`,
        {
          headers: {
            'User-Agent': 'Bethlehem Disability Toolkit'
          }
        }
      )
      const data = await response.json()
      if (data?.display_name) {
        return data.display_name
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
    }
    return null
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setFormData(prev => ({
            ...prev,
            locationType: 'coordinates',
            coordinates: { lat, lng }
          }))

          const addressLabel = await reverseGeocodeCoordinates(lat, lng)
          setCurrentLocationDisplay({
            coordinates: { lat, lng },
            addressLabel,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your current location. Please enter address manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const handleSubmitReport = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')

    try {
      let imageAsset = null
      if (formData.image) {
        // Upload the image to Sanity
        imageAsset = await sanity.assets.upload('image', formData.image)
      }

      const doc = {
        _type: 'accessibilityReport',
        status: 'draft',
        subject: formData.subject,
        details: formData.details,
        locationType: formData.locationType,
        submitterName: formData.submitterName,
        submitterEmail: formData.submitterEmail,
      }

      if (formData.locationType === 'address') {
        doc.address = formData.address
      } else {
        doc.coordinates = formData.coordinates
      }

      if (imageAsset) {
        doc.image = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        }
      }

      await sanity.create(doc)

      setFormStatus('success')
      setFormData({
        subject: '',
        details: '',
        locationType: 'address',
        address: { street: '', city: '', state: '', zipCode: '' },
        coordinates: { lat: null, lng: null },
        image: null,
        submitterName: '',
        submitterEmail: '',
      })
      setCurrentLocationDisplay(null)
      setShowForm(false)
    } catch (err) {
      console.error('Error submitting report:', err)
      setFormStatus('error')
    }
  }

  return (
    <main className="container">
      <Breadcrumb />
      <header className="map-header">
        <Link to="/" className="back-link">{t(lang, 'pages.accessibilityMap.backHome')}</Link>
        <h1>{t(lang, 'pages.accessibilityMap.title')}</h1>
        <p className="subtitle">{t(lang, 'pages.accessibilityMap.subtitle')}</p>
      </header>

      {loading ? (
        <p>{t(lang, 'pages.accessibilityMap.loading')}</p>
      ) : error ? (
        <p className="map-error">{error}</p>
      ) : (
        <>
          <section className="inaccessible-locations-section">
            <h2>{t(lang, 'pages.accessibilityMap.inaccessibleLocationsTitle')}</h2>
            <p>{t(lang, 'pages.accessibilityMap.inaccessibleLocationsDescription')}</p>
            <div className="map-container">
              <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
                aria-label="Map of inaccessible locations"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {geocodedReports.map((report) => {
                  console.log('Rendering marker for report:', report._id, report.coordinates)
                  return (
                    <Marker key={report._id} position={report.coordinates}>
                      <Popup>
                        <div className="map-popup">
                          <h3>{report.subject}</h3>
                          {report.image?.asset?.url && (
                            <div className="map-popup-image-wrapper">
                              <img
                                src={report.image.asset.url}
                                alt={report.image.alt || `${report.subject} - accessibility issue`}
                                className="map-popup-image"
                              />
                            </div>
                          )}
                          <p className="map-popup-description">{report.details}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
            <button
              type="button"
              className="submit-report-button"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {formStatus === 'success'
                ? t(lang, 'pages.accessibilityMap.reportAnother')
                : showForm
                ? t(lang, 'pages.accessibilityMap.cancel')
                : t(lang, 'pages.accessibilityMap.reportInaccessibleLocation')}
            </button>
            {formStatus === 'success' && !showForm && (
              <p className="report-success-message">
                {t(lang, 'pages.accessibilityMap.successMessage')}
              </p>
            )}
            {showForm && (
              <form onSubmit={handleSubmitReport} className="report-form">
                <fieldset>
                  <legend>{t(lang, 'pages.accessibilityMap.reportDetails')}</legend>
                  <label>
                    {t(lang, 'pages.accessibilityMap.subjectLabel')}
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    {t(lang, 'pages.accessibilityMap.detailsLabel')}
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    {t(lang, 'pages.accessibilityMap.photoLabel')}
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleFormChange}
                    />
                  </label>
                </fieldset>
                <fieldset>
                  <legend>{t(lang, 'pages.accessibilityMap.locationLegend')}</legend>
                  <label>
                    <input
                      type="radio"
                      name="locationType"
                      value="address"
                      checked={formData.locationType === 'address'}
                      onChange={handleFormChange}
                    />
                    {t(lang, 'pages.accessibilityMap.enterAddress')}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="locationType"
                      value="coordinates"
                      checked={formData.locationType === 'coordinates'}
                      onChange={handleFormChange}
                    />
                    {t(lang, 'pages.accessibilityMap.useCurrentLocation')}
                  </label>
                  {formData.locationType === 'address' ? (
                    <>
                      <label>
                        {t(lang, 'pages.accessibilityMap.streetLabel')}:
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleFormChange}
                        />
                      </label>
                      <label>
                        {t(lang, 'pages.accessibilityMap.cityLabel')}:
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleFormChange}
                        />
                      </label>
                      <label>
                        {t(lang, 'pages.accessibilityMap.stateLabel')}:
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleFormChange}
                        />
                      </label>
                      <label>
                        {t(lang, 'pages.accessibilityMap.zipCodeLabel')}:
                        <input
                          type="text"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleFormChange}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={getCurrentLocation}>
                        {t(lang, 'pages.accessibilityMap.getCurrentLocation')}
                      </button>
                      {currentLocationDisplay?.coordinates?.lat != null && (
                        <div className="current-location-details">
                          <p>
                            {t(lang, 'pages.accessibilityMap.coordinatesFound')} {currentLocationDisplay.coordinates.lat.toFixed(6)}, {currentLocationDisplay.coordinates.lng.toFixed(6)}
                          </p>
                          {currentLocationDisplay.addressLabel && (
                            <p>{t(lang, 'pages.accessibilityMap.nearbyAddress')} {currentLocationDisplay.addressLabel}</p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </fieldset>
                <fieldset>
                  <legend>{t(lang, 'pages.accessibilityMap.contactLegend')}</legend>
                  <label>
                    {t(lang, 'pages.accessibilityMap.nameLabel')}
                    <input
                      type="text"
                      name="submitterName"
                      value={formData.submitterName}
                      onChange={handleFormChange}
                    />
                  </label>
                  <label>
                    {t(lang, 'pages.accessibilityMap.emailLabel')}
                    <input
                      type="email"
                      name="submitterEmail"
                      value={formData.submitterEmail}
                      onChange={handleFormChange}
                    />
                  </label>
                </fieldset>
                <button type="submit" disabled={formStatus === 'submitting'}>
                  {formStatus === 'submitting' ? t(lang, 'pages.accessibilityMap.submitting') : t(lang, 'pages.accessibilityMap.submitReport')}
                </button>
                {formStatus === 'success' && (
                  <p className="report-success-message">
                    {t(lang, 'pages.accessibilityMap.successMessage')}
                  </p>
                )}
                {formStatus === 'error' && <p className="report-error-message">{t(lang, 'pages.accessibilityMap.errorMessage')}</p>}
              </form>
            )}
          </section>

          <section className="resources-section">
            <h2>{t(lang, 'pages.accessibilityMap.accessibleResourcesTitle')}</h2>
            <p>{t(lang, 'pages.accessibilityMap.accessibleResourcesDescription')}</p>
            <div className="map-container">
              <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '600px', width: '100%' }}
                aria-label={t(lang, 'pages.accessibilityMap.mapAriaLabel')}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {geocodedResources.map((resource) => {
                  const address = resource.address
                  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`

                  return (
                    <Marker key={resource._id} position={resource.coordinates}>
                      <Popup>
                        <div className="map-popup">
                          <h3>{pickI18n(resource.titleI18n, lang, resource.title)}</h3>
                          <p className="map-popup-category">{resource.category}</p>
                          <p className="map-popup-address">{fullAddress}</p>
                          <p className="map-popup-description">
                            {pickI18n(resource.descriptionI18n, lang, resource.description)}
                          </p>
                          <Link
                            to={`/resources/${resource._id}`}
                            className="map-popup-link"
                          >
                            {t(lang, 'pages.accessibilityMap.viewDetails')}
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          </section>
        </>
      )}
    </main>
  )
}

export default AccessibilityMap