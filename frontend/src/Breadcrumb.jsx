import { Link, useLocation } from 'react-router-dom'
import './Breadcrumb.css'

function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  if (pathnames.length === 0) return null // Don't show on home page

  const breadcrumbMap = {
    'resources': 'Immediate Resources',
    'community-stories': 'Community Stories',
    'policy-gaps': 'Policy & Service Gaps'
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {pathnames.map((value, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const label = breadcrumbMap[value] || value
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
