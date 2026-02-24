import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import './StoryDetail.css'

function StoryDetail() {
  const { storyId } = useParams()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const data = await sanity.fetch(
          `*[_type == "communityStory" && _id == $storyId][0]{
            _id,
            title,
            personName,
            location,
            summary,
            story,
            date
          }`,
          { storyId }
        )
        
        if (!data) {
          setError('Story not found')
        } else {
          setStory(data)
        }
      } catch (err) {
        console.error('Error fetching story:', err)
        setError('Failed to load story')
      } finally {
        setLoading(false)
      }
    }

    fetchStory()
  }, [storyId])

  if (loading) {
    return (
      <main className="container">
        <Breadcrumb />
        <p>Loading story...</p>
      </main>
    )
  }

  if (error || !story) {
    return (
      <main className="container">
        <Breadcrumb />
        <div className="error-container">
          <p>{error || 'Story not found'}</p>
          <Link to="/community-stories" className="back-link">
            ← Back to Community Stories
          </Link>
        </div>
      </main>
    )
  }

  const paragraphs = story.story
    .split('\n\n')
    .filter(p => p.trim().length > 0)

  return (
    <main className="container">
      <Breadcrumb />
      
      <article className="story-detail">
        <header className="story-detail-header">
          <Link to="/community-stories" className="back-link">
            ← Back to Community Stories
          </Link>
          
          <h1 className="story-title">{story.title}</h1>
          
          <div className="story-meta">
            {story.personName && (
              <div className="story-author">
                <strong>Shared by:</strong> {story.personName}
              </div>
            )}
            
            {story.location && (
              <div className="story-location">
                <strong>Location:</strong> {story.location}
              </div>
            )}
            
            {story.date && (
              <div className="story-date">
                <strong>Date:</strong> {new Date(story.date).toLocaleDateString()}
              </div>
            )}
          </div>

          {story.summary && (
            <p className="story-summary">{story.summary}</p>
          )}
        </header>

        <div className="story-body">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="story-paragraph">{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  )
}

export default StoryDetail
