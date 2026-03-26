import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from './languageContext'
import { t } from './uiStrings'
import './Breadcrumb.css'

function Breadcrumb({ storyTitle, resourceTitle }) {
  const lang = useLanguage()
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  if (pathnames.length === 0) return null // Don't show on home page

  const breadcrumbMap = {
    'resources': t(lang, 'breadcrumb.resources'),
    'community-stories': t(lang, 'breadcrumb.communityStories'),
    'map': t(lang, 'breadcrumb.map'),
    'policy-gaps': t(lang, 'breadcrumb.policyGaps'),
    'disability-activism': t(lang, 'breadcrumb.disabilityActivism'),
    'submit': t(lang, 'breadcrumb.submit'),
    'accessibility-statement': t(lang, 'breadcrumb.accessibilityStatement'),
    'about': t(lang, 'breadcrumb.about'),
    'privacy-policy': t(lang, 'breadcrumb.privacyPolicy'),
    'sitemap': t(lang, 'breadcrumb.sitemap'),
    'disclaimers': t(lang, 'breadcrumb.disclaimers'),
  }

  // Format kebab-case slug to Title Case
  const formatSlug = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Resource/story IDs: show friendly label for detail pages
  const getLabel = (value, index) => {
    if (index > 0 && pathnames[index - 1] === 'resources') return t(lang, 'breadcrumb.resource')
    if (index > 0 && pathnames[index - 1] === 'community-stories') return t(lang, 'breadcrumb.story')
    return breadcrumbMap[value] || formatSlug(value)
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">{t(lang, 'breadcrumb.home')}</Link>
      {pathnames.map((value, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        // identify whether this segment follows the resources or community-stories path
        const isStoryId = pathnames[index - 1] === 'community-stories'
        const isResourceId = pathnames[index - 1] === 'resources'
        let label = getLabel(value, index)
        
        if (storyTitle && isStoryId) {
          label = storyTitle
        }
        if (resourceTitle && isResourceId) {
          label = resourceTitle
        }
        
        const isLast = index === pathnames.length - 1

        return (
          <span key={routeTo}>
            <span>/ </span>
            {isLast ? <span>{label}</span> : <Link to={routeTo}>{label}</Link>}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
