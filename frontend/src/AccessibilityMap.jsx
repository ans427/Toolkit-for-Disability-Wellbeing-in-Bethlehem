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

const reportIconSelected = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [32, 53],
  iconAnchor: [16, 53],
  popupAnchor: [1, -42],
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

const resourceIconSelected = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [32, 53],
  iconAnchor: [16, 53],
  popupAnchor: [1, -42],
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

function MapBackgroundClickHandler({ onBackgroundClick }) {
  useMapEvents({
    click(e) {
      if (e.target && e.target.tagName === 'IMG') return // Clicked on marker
      onBackgroundClick()
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
  const mapContainerRef = useRef(null)
  const reportFormRef = useRef(null)
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
  const [selectedMapResource, setSelectedMapResource] = useState(null)
  const [selectedReportMarker, setSelectedReportMarker] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const searchBarRef = useRef(null)
  const [panelWidth, setPanelWidth] = useState(null)

  useEffect(() => {
    const updateWidth = () => {
      if (isPanelOpen && searchBarRef.current) {
        // make panel a bit wider than the input for visual breathing room
        setPanelWidth(`${searchBarRef.current.offsetWidth + 16}px`)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [isPanelOpen])

  useEffect(() => {
    if (!isPanelOpen) setPanelWidth(null)
  }, [isPanelOpen])

  // Close panel when clicking outside (for mobile) - only on map area, not when opening
  useEffect(() => {
    if (!isPanelOpen) return

    const handleBackgroundClick = (e) => {
      const panel = document.querySelector('.map-side-panel')
      const searchBar = document.querySelector('.search-bar-container')
      const mapContainer = document.querySelector('.map-container-wrapper')
      const controls = document.querySelector('.map-controls-top')
      
      // Only close if clicking on the map itself (not when trying to open the panel)
      if (mapContainer && mapContainer.contains(e.target) && 
          !panel?.contains(e.target) && 
          !searchBar?.contains(e.target) &&
          !controls?.contains(e.target)) {
        setIsPanelOpen(false)
      }
    }

    // Use a small delay to prevent immediate closing when opening
    const timer = setTimeout(() => {
      document.addEventListener('click', handleBackgroundClick)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleBackgroundClick)
    }
  }, [isPanelOpen])

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

  // Filter resources and reports based on search query
  // When search is empty, show all results; when searching, filter by query
  const filteredResources = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return geocodedResources
    return geocodedResources.filter(r => 
      pickI18n(r.titleI18n, lang, r.title).toLowerCase().includes(query) ||
      pickI18n(r.descriptionI18n, lang, r.description).toLowerCase().includes(query) ||
      (r.category && r.category.toLowerCase().includes(query))
    )
  }, [geocodedResources, searchQuery, lang])

  const filteredReports = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return geocodedReports
    return geocodedReports.filter(r =>
      r.subject.toLowerCase().includes(query) ||
      r.details.toLowerCase().includes(query)
    )
  }, [geocodedReports, searchQuery])

  const currentSelected = selectedMapResource || selectedReportMarker

  useEffect(() => {
    if (!selectedResourceId || !mapContainerRef.current || loading) return
    mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [selectedResourceId, loading])

  useEffect(() => {
    if (!shouldOpenReportForm) return
    setShowForm(true)
  }, [shouldOpenReportForm])

  useEffect(() => {
    if (!shouldOpenReportForm || !showForm || loading || !reportFormRef.current) return
    reportFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [shouldOpenReportForm, showForm, loading])

  useEffect(() => {
    if (!selectedResourceId || !selectedResource || !selectedMarkerRef.current) return
    selectedMarkerRef.current.openPopup()
  }, [selectedResourceId, selectedResource, geocodedResources])

  useEffect(() => {
    if (!selectedResourceId || !selectedResource) return

    // When arriving from "View on map", hydrate full selection UI state.
    setShowResources(true)
    setSelectedMapResource(selectedResource)
    setSelectedReportMarker(null)
    setSearchQuery(pickI18n(selectedResource.titleI18n, lang, selectedResource.title))
    setIsTyping(false)
    setIsPanelOpen(true)
  }, [selectedResourceId, selectedResource, lang])

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
          <nav className="map-skip-links" aria-label={t(lang, 'pages.accessibilityMap.skipNavAria')}>
            <a href="#map-quick-actions">{t(lang, 'pages.accessibilityMap.skipToQuickActions')}</a>
          </nav>

          {/* Controls above everything */}
          <div className="map-controls-top" style={{ marginBottom: '1rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="search-bar-container">
                <div className="search-input-wrapper">
                  <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    ref={searchBarRef}
                    type="text"
                    placeholder="Search resources and reports..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setIsTyping(true) }}
                    onFocus={() => {
                      setIsTyping(true)
                      setIsPanelOpen(true)
                      // set panel width to match input
                      if (searchBarRef.current) {
                        setPanelWidth(`${searchBarRef.current.offsetWidth}px`)
                      }
                    }}
                    onClick={() => {
                      setIsPanelOpen(true)
                      if (searchBarRef.current) {
                        setPanelWidth(`${searchBarRef.current.offsetWidth}px`)
                      }
                    }}
                    className="search-input"
                    aria-label="Search resources and reports"
                  />
                  <button
                    className="search-clear-btn"
                    onClick={() => {
                      // Clear search text (if any) and always collapse the panel
                      setSearchQuery('')
                      setIsTyping(false)
                      setIsPanelOpen(false)
                    }}
                    aria-label="Clear search and close panel"
                  >
                    ✕
                  </button>
                </div>

                {/* Suggestions shown only when user is typing */}
                {isTyping && searchQuery.trim() && (
                  (() => {
                    const suggestions = [
                      ...filteredResources.map(r => ({ type: 'resource', id: r._id, label: pickI18n(r.titleI18n, lang, r.title), item: r })),
                      ...filteredReports.map(r => ({ type: 'report', id: r._id, label: r.subject, item: r })),
                    ].slice(0, 6)

                    return (
                      <div className="search-suggestions">
                        {suggestions.length > 0 ? (
                          suggestions.map(s => (
                            <button
                              key={`suggest-${s.type}-${s.id}`}
                              className="suggestion-item"
                              onClick={() => {
                                if (s.type === 'resource') {
                                  setSelectedMapResource(s.item)
                                  setSelectedReportMarker(null)
                                } else {
                                  setSelectedReportMarker(s.item)
                                  setSelectedMapResource(null)
                                }
                                setIsTyping(false)
                                setSearchQuery(s.label)
                                setIsPanelOpen(true)
                              }}
                            >
                              <span className="suggestion-title">{s.label}</span>
                            </button>
                          ))
                        ) : (
                          <div className="no-suggestions"><p>No results found</p></div>
                        )}
                      </div>
                    )
                  })()
                )}
              </div>

            <label>
              <input type="checkbox" checked={showReports} onChange={() => setShowReports(s => !s)} /> 
              {t(lang, 'pages.accessibilityMap.showReports')}
            </label>
            <label>
              <input type="checkbox" checked={showResources} onChange={() => setShowResources(s => !s)} /> 
              {t(lang, 'pages.accessibilityMap.showResources')}
            </label>
          </div>

          <div className={`map-layout ${isMapFullscreen ? 'fullscreen' : ''}`}>
          {/* Left Panel */}
          <div className={`map-side-panel ${isPanelOpen ? 'open' : 'closed'}`}>
            {isPanelOpen && (
              <>
                {/* Mobile-only drag handle + close button */}
                <div className="mobile-panel-header">
                  <div className="panel-drag-handle" aria-hidden="true" />
                  <button
                    className="panel-close-btn-mobile"
                    onClick={() => setIsPanelOpen(false)}
                    aria-label="Close panel"
                  >
                    ✕
                  </button>
                </div>
                <div className="panel-content">
                  {/* Panel header removed; search bar controls live in top controls */}

                  {/* Selected Item Details */}
                  {currentSelected && (
                    <div className="selected-item-details">
                      <h3>
                        {currentSelected.title ? pickI18n(currentSelected.titleI18n, lang, currentSelected.title) : currentSelected.subject}
                      </h3>
                      
                      {currentSelected.title && (
                        <>
                          {currentSelected.category && (
                            <p className="item-category">{currentSelected.category}</p>
                          )}
                          {currentSelected.address && (
                            <p className="item-address">
                              {`${currentSelected.address.street || ''}${currentSelected.address.city ? `, ${currentSelected.address.city}` : ''}${currentSelected.address.state ? `, ${currentSelected.address.state}` : ''}${currentSelected.address.zipCode ? ` ${currentSelected.address.zipCode}` : ''}`}
                            </p>
                          )}
                          <p className="item-description">
                            {pickI18n(currentSelected.descriptionI18n, lang, currentSelected.description)}
                          </p>
                          <Link to={`/resources/${currentSelected._id}`} className="details-link">
                            {t(lang, 'pages.accessibilityMap.viewDetails')}
                          </Link>
                        </>
                      )}

                      {currentSelected.subject && (
                        <>
                          <p className="item-description">{currentSelected.details}</p>
                          {currentSelected.image?.asset?.url && (
                            <img
                              src={currentSelected.image.asset.url}
                              alt={currentSelected.image.alt || `${currentSelected.subject} - accessibility issue`}
                              className="selected-item-image"
                            />
                          )}
                        </>
                      )}

                      <button
                        onClick={() => {
                          setSelectedMapResource(null)
                          setSelectedReportMarker(null)
                        }}
                        className="clear-selection-btn"
                      >
                        Clear Selection
                      </button>
                    </div>
                  )}

                  {/* Search Results List */}
                  <div className="search-results-container">
                    {filteredResources.length > 0 && (
                      <>
                        <h3>Resources ({filteredResources.length})</h3>
                        <ul className="items-list">
                          {filteredResources.map(resource => (
                            <li key={`res-list-${resource._id}`}>
                              <button
                                className={`list-item-btn ${selectedMapResource?._id === resource._id ? 'selected' : ''}`}
                                onClick={() => {
                                  setSelectedMapResource(resource)
                                  setSelectedReportMarker(null)
                                }}
                              >
                                <strong>{pickI18n(resource.titleI18n, lang, resource.title)}</strong>
                                {resource.category && <span className="item-category-badge">{resource.category}</span>}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {showReports && filteredReports.length > 0 && (
                      <>
                        <h3>Accessibility Reports ({filteredReports.length})</h3>
                        <ul className="items-list">
                          {filteredReports.map(report => (
                            <li key={`report-list-${report._id}`}>
                              <button
                                className={`list-item-btn ${selectedReportMarker?._id === report._id ? 'selected' : ''}`}
                                onClick={() => {
                                  setSelectedReportMarker(report)
                                  setSelectedMapResource(null)
                                }}
                              >
                                <strong>{report.subject}</strong>
                                <span className="item-type-badge">Report</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {filteredResources.length === 0 && filteredReports.length === 0 && searchQuery.trim() && (
                      <p className="no-results">No results found</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Map Section */}
          <div className="map-main-content">
            <section className="inaccessible-locations-section" ref={mapSectionRef}>
              <div className="map-container-wrapper" ref={mapContainerRef}>
                <MapContainer
                  center={selectedResourceCenter || defaultCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  aria-label={t(lang, 'pages.accessibilityMap.mapAriaLabel')}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <FocusSelectedResource coordinates={selectedResourceCenter} />

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

                  <MapBackgroundClickHandler
                    onBackgroundClick={() => setIsPanelOpen(false)}
                  />

                  {showReports && geocodedReports.map((report) => {
                    const pos = normalizeCoordinates(report.coordinates)
                    if (!pos) return null
                    const isSelected = selectedReportMarker?._id === report._id
                    return (
                      <Marker
                        key={`report-${report._id}`}
                        position={pos}
                        icon={isSelected ? reportIconSelected : reportIcon}
                        eventHandlers={{
                          click: (e) => {
                                setSelectedReportMarker(report)
                                setSelectedMapResource(null)
                                // show report subject in search bar but don't show suggestions
                                setSearchQuery(report.subject)
                                setIsTyping(false)
                                setIsPanelOpen(true)
                          }
                        }}
                      >
                      </Marker>
                    )
                  })}

                  {showResources && geocodedResources.map((resource) => {
                    const pos = normalizeCoordinates(resource.coordinates)
                    if (!pos) return null
                    const isSelected = selectedMapResource?._id === resource._id
                    return (
                      <Marker
                        key={`res-${resource._id}`}
                        position={pos}
                        icon={isSelected ? resourceIconSelected : resourceIcon}
                        eventHandlers={{
                          click: (e) => {
                            setSelectedMapResource(resource)
                            setSelectedReportMarker(null)
                            // show resource title in search bar but don't trigger suggestions
                            setSearchQuery(pickI18n(resource.titleI18n, lang, resource.title))
                            setIsTyping(false)
                            setIsPanelOpen(true)
                          }
                        }}
                        ref={resource._id === selectedResourceId ? selectedMarkerRef : null}
                      >
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

              <section id="map-quick-actions" className="cta-band-group resource-page-cta-group map-cta-group" aria-label={t(lang, 'pages.immediateResources.ctaAriaLabel')}>
                <section className="cta-band">
                  <p className="cta-band-text">{t(lang, 'home.cta.text')}</p>
                  <Link to="/submit" className="cta-band-button">
                    {t(lang, 'home.cta.button')}
                  </Link>
                </section>
                <section className="cta-band">
                  <p className="cta-band-text">{t(lang, 'home.reportCta.text')}</p>
                  <button
                    type="button"
                    className="cta-band-button"
                    onClick={() => setShowForm((prev) => !prev)}
                  >
                    {formStatus === 'success'
                      ? t(lang, 'pages.accessibilityMap.reportAnother')
                      : showForm
                      ? t(lang, 'pages.accessibilityMap.cancel')
                      : t(lang, 'home.reportCta.button')}
                  </button>
                </section>
              </section>

              {/* search bar now lives at the top controls; removed floating button */}
              {formStatus === 'success' && !showForm && (
                <p className="report-success-message">
                  {t(lang, 'pages.accessibilityMap.successMessage')}
                </p>
              )}
              {showForm && (
                <form onSubmit={handleSubmitReport} className="report-form" ref={reportFormRef}>
                  <fieldset>
                    <legend>{t(lang, 'pages.accessibilityMap.reportDetails')}</legend>
                    <label className="report-field-label">
                      <span>{t(lang, 'pages.accessibilityMap.subjectLabel')}</span>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleFormChange}
                        required
                      />
                    </label>
                    <label className="report-field-label">
                      <span>{t(lang, 'pages.accessibilityMap.detailsLabel')}</span>
                      <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleFormChange}
                        required
                      />
                    </label>
                    <label className="report-field-label">
                      <span>{t(lang, 'pages.accessibilityMap.photoLabel')}</span>
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
                      {t(lang, 'pages.accessibilityMap.placePinOnMap')}
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
                            <p>{t(lang, 'pages.accessibilityMap.pinInstructions')}</p>
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
          </div>
        </div>
        </>
      )}
    </main>
  )
}

export default AccessibilityMap