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

  // Default center on Bethlehem, PA
  const defaultCenter = [40.6259, -75.3705]

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
      )}
    </main>
  )
}

export default AccessibilityMap