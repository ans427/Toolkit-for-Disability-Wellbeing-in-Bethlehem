import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import { useLanguage } from './languageContext'
import { pickI18n } from './i18nUtils'
import { t, tFormat } from './uiStrings'
import './ImmediateResources.css'

/* Human-readable category labels for filter and display */
const CATEGORY_LABELS = {
  'legal-aid': 'Legal Aid',
  'community-organizations': 'Community Organizations',
  'mutual-aid-support': 'Mutual Aid Support',
  'collaborative-support': 'Collaborative Support',
  'mental-health-support': 'Mental Health Support',
  'employment-support': 'Employment Support',
  'food-access-and-housing-support': 'Food Access and Housing Support',
  'healthcare-support': 'Healthcare Support',
  'transportation-services': 'Transportation Services',
  'multilingual-support': 'Multilingual Support',
  'general': 'General',
}

const CATEGORY_LABELS_ES = {
  'legal-aid': 'Asistencia legal',
  'community-organizations': 'Organizaciones comunitarias',
  'mutual-aid-support': 'Apoyo de ayuda mutua',
  'collaborative-support': 'Apoyo colaborativo',
  'mental-health-support': 'Apoyo de salud mental',
  'employment-support': 'Apoyo al empleo',
  'food-access-and-housing-support': 'Apoyo de vivienda y acceso a alimentos',
  'healthcare-support': 'Apoyo de atención médica',
  'transportation-services': 'Servicios de transporte',
  'multilingual-support': 'Soporte multilingüe',
  'general': 'General',
}

function getCategoryLabel(value, lang = 'en') {
  if (lang === 'es') {
    return CATEGORY_LABELS_ES[value] || CATEGORY_LABELS[value] || value || 'General'
  }
  return CATEGORY_LABELS[value] || value || 'General'
}

const normalizeText = (text) =>
  (text || '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

function ImmediateResources() {
  const lang = useLanguage()
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
            titleI18n,
            category,
            url,
            description,
            descriptionI18n,
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
    const query = normalizeText(searchQuery.trim())

    // Simple intent mapping for natural language queries (supported in English and Spanish)
    const INTENT_MAP = [
      {
        triggers: /\b(job|work|employment|hiring|hire|career|apply for a job|finding a job|trabajo|empleo|contratar|carrera|solicitar empleo)\b/i,
        categories: ['employment-support'],
        keywords: ['job', 'employment', 'work', 'career', 'resume', 'interview', 'hiring', 'trabajo', 'empleo', 'contratar', 'empleador']
      },
      {
        triggers: /\b(food|food bank|pantry|meal|hunger|comida|banco de alimentos|despensa|hambre)\b/i,
        categories: ['food-access-and-housing-support'],
        keywords: ['food', 'pantry', 'meals', 'food bank', 'comida', 'despensa', 'banco de alimentos']
      },
      {
        triggers: /\b(housing|shelter|rent|evict|homeless|vivienda|refugio|alquiler|desalojo|sin hogar)\b/i,
        categories: ['food-access-and-housing-support'],
        keywords: ['housing', 'shelter', 'rent', 'eviction', 'vivienda', 'refugio', 'alquiler', 'desalojado']
      },
      {
        triggers: /\b(therapy|mental|counseling|counsellor|psychologist|terapia|mental|consejeria|consejero|psicologo)\b/i,
        categories: ['mental-health-support', 'healthcare-support'],
        keywords: ['mental health', 'therapy', 'counseling', 'counsellor', 'psychologist', 'terapia', 'salud mental', 'consejeria', 'psicologo']
      },
      {
        triggers: /\b(legal|lawyer|attorney|rights|legal aid|SSI|SSDI|file a claim|legalidad|abogado|derechos|asistencia legal|discapacidad)\b/i,
        categories: ['legal-aid'],
        keywords: ['legal', 'lawyer', 'attorney', 'rights', 'legal aid', 'SSI', 'SSDI', 'file a claim', 'abogado', 'derechos', 'asistencia legal']
      },
      {
        triggers: /\b(transport|bus|train|ride|accessible transit|transportation|transporte|autobus|bus|tren|movilidad)\b/i,
        categories: ['transportation-services'],
        keywords: ['transport', 'bus', 'train', 'transit', 'transportation', 'transporte', 'autobus', 'tren', 'movilidad']
      },
      {
        triggers: /\b(community|neighborhood|local organization|community center|nonprofit|ngo|non-profit|advocacy|comunidad|vecindario|organizacion comunitaria|ONG|sin fines de lucro|activismo)\b/i,
        categories: ['community-organizations'],
        keywords: ['community', 'neighborhood', 'nonprofit', 'ngo', 'community center', 'local org', 'advocacy', 'comunidad', 'ONG', 'organizacion comunitaria']
      },
      {
        triggers: /\b(mutual aid|mutual-aid|mutualaid|volunteer|volunteering|peer support|grassroots|ayuda mutua|voluntariado|voluntario)\b/i,
        categories: ['mutual-aid-support'],
        keywords: ['mutual aid', 'volunteer', 'volunteering', 'peer support', 'grassroots', 'ayuda mutua', 'voluntariado', 'voluntario']
      },
      {
        triggers: /\b(collaborative|cooperative|co-op|collective|peer-led|partnership|collaboration|colaborativo|cooperativa|colectivo|asociacion)\b/i,
        categories: ['collaborative-support'],
        keywords: ['collaborative', 'cooperative', 'collective', 'partnership', 'peer-led', 'colaborativo', 'cooperativa', 'colectivo']
      },
      {
        triggers: /\b(doctor|clinic|medical|healthcare|hospital|nurse|appointment|medical care|doctor|clinica|medico|atencion medica|hospital|enfermero)\b/i,
        categories: ['healthcare-support'],
        keywords: ['medical', 'clinic', 'doctor', 'healthcare', 'hospital', 'nurse', 'clinica', 'medico', 'atencion medica']
      },
      {
        triggers: /\b(translate|interpreter|translation|translating|multilingual|interpretation|spanish|hispanic|espanol|english|bilingual|traducir|interprete|interpretacion|bilingue)\b/i,
        categories: ['multilingual-support'],
        keywords: ['translate', 'interpreter', 'translation', 'translating', 'spanish', 'hispanic', 'espanol', 'language', 'multilingual', 'interpretation', 'bilingual', 'traducir', 'interprete', 'interpretacion', 'bilingue']
      },
    ]

    const detectIntent = (q) => {
      const intents = { categories: new Set(), keywords: new Set() }
      if (!q) return intents
      for (const m of INTENT_MAP) {
        if (m.triggers.test(q)) {
          ;(m.categories || []).forEach((c) => intents.categories.add(c))
          ;(m.keywords || []).forEach((k) => intents.keywords.add(k))
        }
      }
      return intents
    }

    const intent = detectIntent(query)

    const byCategory = showAll
      ? resources
      : resources.filter((r) => selectedCategories.has(r.category || 'general'))

    if (!query) return byCategory

    // Check each resource against the typed query and detected intent keywords/categories
    return byCategory.filter((r) => {
      const titleActive = pickI18n(r.titleI18n, lang, r.title)
      const descActive = pickI18n(r.descriptionI18n, lang, r.description)
      const rawTitle = titleActive || r.title || ''
      const rawDescription = descActive || r.description || ''
      const title = normalizeText(rawTitle)
      const description = normalizeText(rawDescription)
      const titleEn = normalizeText(pickI18n(r.titleI18n, 'en', r.title))
      const descEn = normalizeText(pickI18n(r.descriptionI18n, 'en', r.description))
      const titleEs = normalizeText(pickI18n(r.titleI18n, 'es', r.title) || '')
      const descEs = normalizeText(pickI18n(r.descriptionI18n, 'es', r.description) || '')
      const categoryKey = r.category || 'general'
      const categoryLabel = normalizeText(getCategoryLabel(categoryKey, lang))
      const categoryLabelEn = normalizeText(getCategoryLabel(categoryKey, 'en'))

      // direct substring match
      if (
        title.includes(query) ||
        description.includes(query) ||
        titleEn.includes(query) ||
        descEn.includes(query) ||
        titleEs.includes(query) ||
        descEs.includes(query) ||
        categoryLabel.includes(query) ||
        categoryLabelEn.includes(query)
      ) return true

      // split words match (handles simple natural phrasing)
      const qWords = query.split(/[^\w]+/).filter(Boolean)
      if (
        qWords.every(
          (w) =>
            title.includes(w) ||
            description.includes(w) ||
            titleEn.includes(w) ||
            descEn.includes(w) ||
            titleEs.includes(w) ||
            descEs.includes(w)
        )
      ) return true

      // intent-based category match
      if (intent.categories.has(categoryKey)) return true

      // intent-based keyword match in text
      for (const kw of intent.keywords) {
        if (
          title.includes(kw) ||
          description.includes(kw) ||
          titleEn.includes(kw) ||
          descEn.includes(kw) ||
          titleEs.includes(kw) ||
          descEs.includes(kw)
        ) return true
      }

      return false
    })
  }, [resources, showAll, selectedCategories, searchQuery, lang])

  return (
    <main className="container">
      <Breadcrumb />
      <header className="resource-header">
        <Link to="/" className="back-link">{t(lang, 'pages.immediateResources.backHome')}</Link>
        <h1>{t(lang, 'pages.immediateResources.title')}</h1>
        <p className="subtitle">{t(lang, 'pages.immediateResources.subtitle')}</p>
      </header>

      {loading ? (
        <p>{t(lang, 'pages.immediateResources.loading')}</p>
      ) : error ? (
        <p className="resource-error">
          {error}
        </p>
      ) : (
        <>
          <section
            className="resource-filter"
            aria-label={t(lang, 'pages.immediateResources.searchFilterAria')}
          >
            <div className="resource-filter-controls">
              <div className="resource-search-wrap">
                <label htmlFor="resource-search" className="resource-search-label">
                  {t(lang, 'pages.immediateResources.searchLabel')}
                </label>
                <input
                  id="resource-search"
                  type="search"
                  className="resource-search-input"
                  placeholder={t(lang, 'pages.immediateResources.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={t(lang, 'pages.immediateResources.searchInputAria')}
                  aria-describedby="filter-results-count"
                  autoComplete="off"
                />
              </div>

              <div
                className="resource-filter-chips"
                role="group"
                aria-label={t(lang, 'pages.immediateResources.filterGroupAria')}
                aria-describedby="filter-results-count"
              >
                <span className="resource-filter-legend">{t(lang, 'pages.immediateResources.filterLegend')}</span>
                <div className="resource-filter-chip-list">
                  <button
                      id="filter-all"
                      type="button"
                      className={`resource-filter-chip ${showAll ? 'resource-filter-chip--selected' : ''}`}
                      onClick={() => setSelectedCategories(new Set())}
                      onKeyDown={(e) => handleChipKeyDown(e, 0)}
                      aria-pressed={showAll}
                      aria-label={t(lang, 'pages.immediateResources.showAllAria')}
                    >
                      {t(lang, 'pages.immediateResources.filterAll')}
                    </button>
                  {categories.map((cat, i) => {
                    const label = getCategoryLabel(cat, lang)
                    return (
                      <button
                        key={cat}
                        id={`filter-${cat}`}
                        type="button"
                        className={`resource-filter-chip ${selectedCategories.has(cat) ? 'resource-filter-chip--selected' : ''}`}
                        onClick={() => toggleCategory(cat)}
                        onKeyDown={(e) => handleChipKeyDown(e, i + 1)}
                        aria-pressed={selectedCategories.has(cat)}
<<<<<<< HEAD
                        aria-label={t(lang, 'pages.immediateResources.filterLegend') + ': ' + label}
=======
                        aria-label={tFormat(lang, 'pages.immediateResources.filterByAria', { category: getCategoryLabel(cat) })}
>>>>>>> 2be0c03 (optimizing for text to speech and fixing some translations)
                      >
                        {label}
                      </button>
                    )
                  })}
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
                ? t(lang, 'pages.immediateResources.resultsNone')
                : tFormat(lang, 'pages.immediateResources.resultsCount', {
                    count: filteredResources.length,
                    item:
                      filteredResources.length === 1
                        ? t(lang, 'pages.immediateResources.resultsItemSingular')
                        : t(lang, 'pages.immediateResources.resultsItemPlural'),
                  })}
            </p>
          </section>

          <div className="resource-grid">
            {filteredResources.map((resource) => (
            <Link
              key={resource._id}
              to={`/resources/${resource._id}`}
              className="resource-card"
              aria-label={tFormat(lang, 'pages.immediateResources.cardAriaLabel', {
                title: pickI18n(resource.titleI18n, lang, resource.title),
                category: getCategoryLabel(resource.category || 'general'),
              })}
            >
              {resource.image?.asset?.url && (
                <div className="card-image-wrapper">
                  <img
                    src={resource.image.asset.url}
                    alt={resource.image.alt || pickI18n(resource.titleI18n, lang, resource.title)}
                    className="card-image"
                  />
                </div>
              )}

              <div className="card-content">
                <span className="card-category">
                  {getCategoryLabel(resource.category || 'general', lang)}
                </span>

                <h3 className="card-title">
                  {pickI18n(resource.titleI18n, lang, resource.title)}
                </h3>

                <p className="card-description">
                  {pickI18n(resource.descriptionI18n, lang, resource.description)}
                </p>

                {((resource.helpfulCount ?? 0) + (resource.notHelpfulCount ?? 0)) > 0 && (
                  <p className="card-helpful-count" aria-label={t(lang, 'pages.immediateResources.communityFeedbackAria')}>
                    <span aria-hidden>👍 </span>
                    {tFormat(lang, 'pages.immediateResources.foundHelpful', { count: resource.helpfulCount ?? 0 })}
                    {(resource.notHelpfulCount ?? 0) > 0 && (
                      <>
                        {' '}· <span aria-hidden>👎 </span>
                        {tFormat(lang, 'pages.immediateResources.didNot', { count: resource.notHelpfulCount })}
                      </>
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

                <span className="card-link-hint" aria-hidden="true">{t(lang, 'pages.immediateResources.viewDetails')}</span>
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