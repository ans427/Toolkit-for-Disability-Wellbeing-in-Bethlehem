import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import './CommunityStories.css'

function CommunityStories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await sanity.fetch(
          `*[_type == "communityStory"] | order(coalesce(date, _createdAt) desc){
            _id,
            title,
            personName,
            location,
            summary,
            story,
            date
          }`
        )
        setStories(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  return (
    <main className="container">
      <header className="stories-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <h1>Community Stories</h1>
        <p className="subtitle">
          Lived experiences from disabled residents and their communities in Bethlehem.
        </p>
      </header>

      {loading ? (
        <p>Loading stories...</p>
      ) : stories.length === 0 ? (
        <p>No stories have been added yet. Check back soon.</p>
      ) : (
        <section className="stories-list" aria-label="Community stories">
          {stories.map((story) => (
            <article key={story._id} className="story-card">
              <header className="story-card-header">
                <h2 className="story-title">{story.title}</h2>
                <p className="story-meta">
                  {story.personName && <span>{story.personName}</span>}
                  {story.location && (
                    <>
                      {story.personName && ' · '}
                      <span>{story.location}</span>
                    </>
                  )}
                </p>
              </header>

              {story.summary && (
                <p className="story-summary">
                  {story.summary}
                </p>
              )}

              {story.story && (
                <p className="story-body">
                  {story.story}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default CommunityStories

