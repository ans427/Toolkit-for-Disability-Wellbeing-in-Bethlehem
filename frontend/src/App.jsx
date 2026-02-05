import { useEffect, useState } from 'react'
import './App.css'
import { sanity } from './sanityClient'

function App() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    sanity
      .fetch(
        `*[_type == "resource"] | order(title asc){
          _id,
          title,
          category,
          url,
          description
        }`
      )
      .then((data) => {
        setResources(data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Failed to load resources')
        setLoading(false)
      })
  }, [])

  return (
    <main className="container">
      <header>
        <h1>Toolkit for Disability Wellbeing</h1>
        <p className="subtitle">Bethlehem, Pennsylvania</p>
      </header>

      <section>
        <h2>About the Toolkit</h2>
        <p>
          This toolkit shares lived experiences of disability in Bethlehem and
          provides resources for individuals, policymakers, and local
          organizations to better understand accessibility challenges and
          opportunities.
        </p>
      </section>

      <section>
        <h2>What You’ll Find Here</h2>
        <ul>
          <li>Stories from community members</li>
          <li>Information about accessible and inaccessible spaces</li>
          <li>Local resources and organizations</li>
        </ul>
      </section>

      <section>
        <h2>Community Resources</h2>

        {loading && <p>Loading resources…</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        {!loading && !error && (
          <ul>
            {resources.map((resource) => (
              <li key={resource._id}>
                <strong>{resource.title}</strong>
                {resource.category && <em> ({resource.category})</em>}
                {resource.url && (
                  <>
                    {' '}
                    —{' '}
                    <a href={resource.url} target="_blank" rel="noreferrer">
                      visit
                    </a>
                  </>
                )}
                {resource.description && <p>{resource.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer>
        <p>
          Created in collaboration with Lehigh University and the Bethlehem
          community.
        </p>
      </footer>
    </main>
  )
}

export default App