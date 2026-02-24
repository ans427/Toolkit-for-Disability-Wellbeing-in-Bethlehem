import { Link, useLocation } from 'react-router-dom'
import './Breadcrumb.css'

function Breadcrumb({ storyTitle }) {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  if (pathnames.length === 0) return null // Don't show on home page

  const breadcrumbMap = {
    'resources': 'Immediate Resources',
    'community-stories': 'Community Stories',
    'policy-gaps': 'Policy & Service Gaps',
    'submit': 'Submit a Resource or Story',
    'accessibility-statement': 'Accessibility Statement',
    'privacy-policy': 'Privacy Policy',
    'sitemap': 'Site Map',
    'disclaimers': 'Disclaimers'
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
    if (index > 0 && pathnames[index - 1] === 'resources') return 'Resource'
    if (index > 0 && pathnames[index - 1] === 'community-stories') return 'Story'
    return breadcrumbMap[value] || formatSlug(value)
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {pathnames.map((value, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        // Use storyTitle if this is a story detail page (UUID format with dashes)
        const isUUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value)
        const isStoryId = isUUID && pathnames[index - 1] === 'community-stories'
        let label = getLabel(value, index)
        
        if (storyTitle && isStoryId) {
          label = storyTitle
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
