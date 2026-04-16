import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import { useLanguage } from './languageContext'
import { pickI18n } from './i18nUtils'
import { t, tFormat } from './uiStrings'
import { Link, useSearchParams } from 'react-router-dom'
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

// Custom marker icons
const reportIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const resourceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// DivIcon for user-placed pin with plus sign
const pinIcon = L.divIcon({
  className: 'custom-pin-icon',
  html: '<span class="pin-plus">+</span>',
  iconSize: [30, 30],
  iconAnchor: [15, 30]
})

// State abbreviations for US
const STATE_ABBREVS = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
  'District of Columbia': 'DC'
}

// Simple geocoding cache
const geocodeCache = new Map()

// Simple geocoding function using US Census Bureau Geocoder (free, no API key needed)
async function geocodeAddress(address, retries = 2) {
  const parts = [address.street, address.city, address.state, address.zipCode].filter(Boolean)
  const fullAddress = parts.join(', ')
  const cacheKey = fullAddress.toLowerCase().trim()

  if (geocodeCache.has(cacheKey)) {
    console.log('Geocode cache hit for:', fullAddress, geocodeCache.get(cacheKey))
    return geocodeCache.get(cacheKey)
  }

  if (!address.street || !address.city) {
    console.warn('Skipping geocoding for incomplete address:', address)
    return null // Skip incomplete addresses
  }

  // Clean the address: remove PO Box prefix or take part before first comma
  let cleanedStreet = address.street
  if (cleanedStreet.toLowerCase().startsWith('po box')) {
    cleanedStreet = cleanedStreet.replace(/^po box[^,]+,\s*/i, '')
  } else {
    const commaIndex = cleanedStreet.indexOf(',')
    if (commaIndex > 0) {
      cleanedStreet = cleanedStreet.substring(0, commaIndex).trim()
    }
  }

  console.log('Trying geocoding for:', fullAddress, 'cleaned street:', cleanedStreet)

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Try ArcGIS Geocoding API (free, reliable)
      const singleLine = [cleanedStreet, address.city, STATE_ABBREVS[address.state] || address.state, address.zipCode].filter(Boolean).join(', ')
      const arcgisUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${encodeURIComponent(singleLine)}&f=json&maxLocations=1`
      console.log('ArcGIS API request:', arcgisUrl)
      const response = await fetch(arcgisUrl)
      console.log('ArcGIS API response status:', response.status)
      const data = await response.json()
      console.log('ArcGIS API response data:', data)

      if (data?.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0]
        const coords = [candidate.location.y, candidate.location.x]
        console.log('Geocoded with ArcGIS:', singleLine, 'to', coords)
        geocodeCache.set(cacheKey, coords)
        return coords
      } else {
        console.warn('No geocoding results from ArcGIS for:', singleLine)
      }
    } catch (error) {
      console.error('ArcGIS geocoding error for:', cleanedStreet, error)
      if (attempt < retries) {
        console.log(`Retrying geocoding in ${1000 * (attempt + 1)}ms...`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }

  // Fallback: try Nominatim as backup
  console.log('Trying Nominatim fallback for:', fullAddress)
  try {
    const cleanedParts = [cleanedStreet, address.city, address.state, address.zipCode].filter(Boolean)
    const cleanedAddress = cleanedParts.join(', ')
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanedAddress)}&countrycodes=US&limit=1`,
      {
        headers: {
          'User-Agent': 'Bethlehem Disability Toolkit'
        }
      }
    )
    const data = await response.json()

    if (data && data.length > 0) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      console.log('Geocoded with Nominatim fallback:', cleanedAddress, 'to', coords)
      geocodeCache.set(cacheKey, coords)
      return coords
    }
  } catch (error) {
    console.error('Nominatim fallback error:', error)
  }

  // Final fallback: place at Bethlehem with small spread
  const baseLat = 40.6259
  const baseLng = -75.3705
  const offset = 0.01 // ~1km spread
  const lat = baseLat + (Math.random() - 0.5) * offset
  const lng = baseLng + (Math.random() - 0.5) * offset
  const coords = [lat, lng]
  console.warn('Using approximate coords for:', fullAddress, coords)
  geocodeCache.set(cacheKey, coords)
  return coords
}

function FocusSelectedResource({ coordinates }) {
  const map = useMap()

  useEffect(() => {
    if (!coordinates) return
    map.setView(coordinates, 15, { animate: false })
  }, [map, coordinates])

  return null
}

function MapClickHandler({ enabled, onClick }) {
  useMapEvents({
    click(e) {
      if (!enabled) return
      onClick(e.latlng)
    }
  })
  return null
}

// Ensure coordinates are numeric [lat, lng]
function normalizeCoordinates(coords) {
  if (!coords) return null
  if (Array.isArray(coords) && coords.length >= 2) {
    const lat = Number(coords[0])
    const lng = Number(coords[1])
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng]
    return null
  }
  if (typeof coords === 'object' && coords.lat != null && coords.lng != null) {
    const lat = Number(coords.lat)
    const lng = Number(coords.lng)
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng]
    return null
  }
  return null
}

function MarkersManager({ geocodedResources, geocodedReports, showResources, showReports, selectedResourceId, selectedMarkerRef, setSelectedMapResource, setSelectedReportMarker, lang, t, pickI18n }) {
  const map = useMap()
  const markersRef = useRef([])

  const renderMarkers = useCallback(() => {
    if (!map) return

    // Get current bounds
    const bounds = map.getBounds()

    // Remove old markers
    markersRef.current.forEach(marker => map.removeLayer(marker))
    markersRef.current = []

    // Add visible report markers
    if (showReports) {
      geocodedReports.forEach(report => {
        const pos = normalizeCoordinates(report.coordinates)
        if (!pos || !bounds.contains(pos)) return

        const marker = L.marker(pos, { icon: reportIcon })
        marker.addTo(map)
        markersRef.current.push(marker)

        marker.on('click', () => setSelectedReportMarker(report))

        const popupContent = `
          <div class="map-popup">
            <h3>${report.subject}</h3>
            ${report.image?.asset?.url ? `<div class="map-popup-image-wrapper"><img src="${report.image.asset.url}" alt="${report.image.alt || `${report.subject} - accessibility issue`}" class="map-popup-image" /></div>` : ''}
            <p class="map-popup-description">${report.details}</p>
          </div>
        `
        marker.bindPopup(popupContent)
      })
    }

    // Add visible resource markers
    if (showResources) {
      geocodedResources.forEach(resource => {
        const pos = normalizeCoordinates(resource.coordinates)
        if (!pos || !bounds.contains(pos)) return

        const marker = L.marker(pos, { icon: resourceIcon })
        marker.addTo(map)
        markersRef.current.push(marker)

        marker.on('click', () => setSelectedMapResource(resource))

        const address = resource.address || {}
        const fullAddress = `${address.street || ''}${address.city ? `, ${address.city}` : ''}${address.state ? `, ${address.state}` : ''}${address.zipCode ? ` ${address.zipCode}` : ''}`
        const popupContent = `
          <div class="map-popup">
            <h3>${pickI18n(resource.titleI18n, lang, resource.title)}</h3>
            <p class="map-popup-category">${resource.category || ''}</p>
            <p class="map-popup-address">${fullAddress}</p>
            <p class="map-popup-description">${pickI18n(resource.descriptionI18n, lang, resource.description)}</p>
            <a href="/resources/${resource._id}" class="map-popup-link">${t(lang, 'pages.accessibilityMap.viewDetails')}</a>
          </div>
        `
        marker.bindPopup(popupContent)

        // Handle selected marker
        if (resource._id === selectedResourceId) {
          selectedMarkerRef.current = marker
          marker.openPopup()
        }
      })
    }
  }, [map, geocodedResources, geocodedReports, showResources, showReports, selectedResourceId, selectedMarkerRef, setSelectedMapResource, setSelectedReportMarker, lang, t, pickI18n])

  useEffect(() => {
    renderMarkers()
    map.on('moveend', renderMarkers)
    map.on('zoomend', renderMarkers)

    return () => {
      map.off('moveend', renderMarkers)
      map.off('zoomend', renderMarkers)
      markersRef.current.forEach(marker => map.removeLayer(marker))
      markersRef.current = []
    }
  }, [map, renderMarkers])

  return null
}

function AccessibilityMap() {
  const lang = useLanguage()
  const [searchParams] = useSearchParams()
  // Support both new and legacy query param names.
  const selectedResourceId = searchParams.get('selectedResourceId') || searchParams.get('resourceId')
  const shouldOpenReportForm = searchParams.get('openReportForm') === '1'
  const selectedMarkerRef = useRef(null)
  const mapSectionRef = useRef(null)
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
  const [showReports, setShowReports] = useState(true)
  const [showResources, setShowResources] = useState(true)

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
            },
            coordinates{
              lat,
              lng
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
          if (resource.coordinates && resource.coordinates.lat && resource.coordinates.lng) {
            // Use stored coordinates
            return { ...resource, coordinates: [resource.coordinates.lat, resource.coordinates.lng] }
          } else if (resource.address?.street) {
            // Geocode the address
            const coords = await geocodeAddress(resource.address)
            return coords ? { ...resource, coordinates: coords } : null
          } else {
            return null
          }
        })
      )
      const validGeocoded = geocoded.filter(r => r !== null)
      setGeocodedResources(validGeocoded)
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
  const selectedResource = geocodedResources.find((resource) => resource._id === selectedResourceId)
  const selectedResourceCenter = selectedResource?.coordinates ?? null

  const allCoords = useMemo(() => {
    const coords = []
    geocodedResources.forEach(r => { if (r.coordinates && Array.isArray(r.coordinates)) coords.push(r.coordinates) })
    geocodedReports.forEach(r => { if (r.coordinates && Array.isArray(r.coordinates)) coords.push(r.coordinates) })
    return coords
  }, [geocodedResources, geocodedReports])

  useEffect(() => {
    if (!selectedResourceId || !mapSectionRef.current || loading) return
    mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [selectedResourceId, loading])

  useEffect(() => {
    if (!shouldOpenReportForm) return
    setShowForm(true)
  }, [shouldOpenReportForm])

  useEffect(() => {
    if (!selectedResourceId || !selectedResource || !selectedMarkerRef.current) return
    selectedMarkerRef.current.openPopup()
  }, [selectedResourceId, selectedResource, geocodedResources])

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
      if (data?.address) {
        const addr = data.address
        const parts = []
        // Add name if available (like building name)
        if (addr.amenity || addr.building || addr.name) {
          parts.push(addr.amenity || addr.building || addr.name)
        }
        // Add house number and road
        const street = [addr.house_number, addr.road].filter(Boolean).join(' ')
        if (street) parts.push(street)
        // Add city
        if (addr.city) parts.push(addr.city)
        // Add state and postcode
        const stateAbbrev = STATE_ABBREVS[addr.state] || addr.state
        const stateZip = [stateAbbrev, addr.postcode].filter(Boolean).join(' ')
        if (stateZip) parts.push(stateZip)
        return parts.join(', ')
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
        // Geocode the address and store coordinates
        const coords = await geocodeAddress(formData.address)
        if (coords) {
          doc.coordinates = { lat: coords[0], lng: coords[1] }
          doc.locationType = 'coordinates' // Change to coordinates since we geocoded it
        } else {
          // If geocoding failed, still store the address for manual review
          doc.address = formData.address
        }
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
          <section className="inaccessible-locations-section" ref={mapSectionRef}>
            <div className="map-container">
              <div className="map-controls" style={{ marginBottom: '8px' }}>
                <label style={{ marginRight: '12px' }}>
                  <input type="checkbox" checked={showReports} onChange={() => setShowReports(s => !s)} /> Show inaccessible location reports
                </label>
                <label>
                  <input type="checkbox" checked={showResources} onChange={() => setShowResources(s => !s)} /> Show immediate resources
                </label>
              </div>

              <MapContainer
                center={selectedResourceCenter || defaultCenter}
                zoom={13}
                style={{ height: '420px', width: '100%' }}
                aria-label={t(lang, 'pages.accessibilityMap.mapAriaLabel')}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <FocusSelectedResource coordinates={selectedResourceCenter} />

                {/* <MarkersManager
                  geocodedResources={geocodedResources}
                  geocodedReports={geocodedReports}
                  showResources={showResources}
                  showReports={showReports}
                  selectedResourceId={selectedResourceId}
                  selectedMarkerRef={selectedMarkerRef}
                  setSelectedMapResource={setSelectedMapResource}
                  setSelectedReportMarker={setSelectedReportMarker}
                  lang={lang}
                  t={t}
                  pickI18n={pickI18n}
                /> */}

                <MapClickHandler
                  enabled={showForm && formData.locationType === 'pin'}
                  onClick={async (latlng) => {
                    const lat = latlng.lat
                    const lng = latlng.lng
                    setFormData(prev => ({ ...prev, locationType: 'pin', coordinates: { lat, lng } }))
                    const addressLabel = await reverseGeocodeCoordinates(lat, lng)
                    setCurrentLocationDisplay({ coordinates: { lat, lng }, addressLabel })
                  }}
                />

                {showReports && geocodedReports.map((report) => {
                  const pos = normalizeCoordinates(report.coordinates)
                  if (!pos) return null
                  return (
                    <Marker
                      key={`report-${report._id}`}
                      position={pos}
                      icon={reportIcon}
                      eventHandlers={{
                        click: (e) => {
                          console.log('report marker clicked', report._id, e)
                          setSelectedReportMarker(report)
                        }
                      }}
                    >
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

                {showResources && geocodedResources.map((resource) => {
                  const pos = normalizeCoordinates(resource.coordinates)
                  if (!pos) return null
                  const address = resource.address || {}
                  const fullAddress = `${address.street || ''}${address.city ? `, ${address.city}` : ''}${address.state ? `, ${address.state}` : ''}${address.zipCode ? ` ${address.zipCode}` : ''}`
                  return (
                    <Marker
                      key={`res-${resource._id}`}
                      position={pos}
                      icon={resourceIcon}
                      eventHandlers={{
                        click: (e) => {
                          console.log('resource marker clicked', resource._id, e)
                          setSelectedMapResource(resource)
                        }
                      }}
                      ref={resource._id === selectedResourceId ? selectedMarkerRef : null}
                    >
                      <Popup>
                        <div className="map-popup">
                          <h3>{pickI18n(resource.titleI18n, lang, resource.title)}</h3>
                          <p className="map-popup-category">{typeof getCategoryLabel !== 'undefined' ? getCategoryLabel(resource.category || 'general', lang) : (resource.category || '')}</p>
                          <p className="map-popup-address">{fullAddress}</p>
                          <p className="map-popup-description">{pickI18n(resource.descriptionI18n, lang, resource.description)}</p>
                          <Link to={`/resources/${resource._id}`} className="map-popup-link">{t(lang, 'pages.accessibilityMap.viewDetails')}</Link>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}

                {formData.locationType === 'pin' && formData.coordinates?.lat != null && (
                  <Marker
                    position={[formData.coordinates.lat, formData.coordinates.lng]}
                    icon={pinIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: async (e) => {
                        const { lat, lng } = e.target.getLatLng()
                        setFormData(prev => ({ ...prev, coordinates: { lat, lng } }))
                        const addressLabel = await reverseGeocodeCoordinates(lat, lng)
                        setCurrentLocationDisplay({ coordinates: { lat, lng }, addressLabel })
                      }
                    }}
                  />
                )}
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
                  <label>
                    <input
                      type="radio"
                      name="locationType"
                      value="pin"
                      checked={formData.locationType === 'pin'}
                      onChange={handleFormChange}
                    />
                    Place pin on map
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
                      {formData.locationType === 'coordinates' ? (
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
                      ) : (
                        // pin mode
                        <div className="pin-instructions">
                          <p>Click the map above to place a pin. You can drag the pin to fine-tune its location.</p>
                          {currentLocationDisplay?.addressLabel && (
                            <p>Nearby address: {currentLocationDisplay.addressLabel}</p>
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
            {selectedResource && (
              <p className="map-selected-resource-note" role="status" aria-live="polite">
                {tFormat(lang, 'pages.accessibilityMap.showingResource', {
                  title: pickI18n(selectedResource.titleI18n, lang, selectedResource.title),
                })}{' '}
                <Link to="/map" className="map-selected-resource-clear">
                  {t(lang, 'pages.accessibilityMap.clearSelection')}
                </Link>
              </p>
            )}
              
          </section>
        </>
      )}
    </main>
  )
}

export default AccessibilityMap