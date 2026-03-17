import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import { useLanguage } from './languageContext'
import { pickI18n } from './i18nUtils'
import { t } from './uiStrings'
import './CommunityStories.css'

function CommunityStories() {
  const lang = useLanguage()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await sanity.fetch(
          `*[_type == "communityStory"] | order(coalesce(date, _createdAt) desc){
            _id,
            title,
            titleI18n,
            personName,
            location,
            summary,
            summaryI18n,
            story,
            storyI18n,
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
      <Breadcrumb />
      <header className="stories-header">
        <Link to="/" className="back-link">
          {t(lang, 'pages.communityStories.backHome')}
        </Link>
        <h1>{t(lang, 'pages.communityStories.title')}</h1>
        <p className="subtitle">
          {t(lang, 'pages.communityStories.subtitle')}
        </p>
      </header>

      {loading ? (
        <p>{t(lang, 'pages.communityStories.loading')}</p>
      ) : stories.length === 0 ? (
        <p>{t(lang, 'pages.communityStories.empty')}</p>
      ) : (
        <section className="stories-list" aria-label="Community stories">
          {stories.map((story) => (
            <Link
              key={story._id}
              to={`/community-stories/${story._id}`}
              className="story-card-link"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article className="story-card">
                <header className="story-card-header">
                  <h2 className="story-title">{pickI18n(story.titleI18n, lang, story.title)}</h2>
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

                {pickI18n(story.summaryI18n, lang, story.summary) && (
                  <p className="story-summary">
                    {pickI18n(story.summaryI18n, lang, story.summary)}
                  </p>
                )}

                {pickI18n(story.storyI18n, lang, story.story) && (
                  <p className="story-body">
                    {pickI18n(story.storyI18n, lang, story.story).substring(0, 150)}...
                  </p>
                )}

                <div className="story-card-footer">
                  <button className="read-more-button">
                    {t(lang, 'pages.communityStories.readFull')}
                  </button>
                </div>
              </article>
            </Link>
          ))}
        </section>
      )}
    </main>
  )
}

export default CommunityStories

