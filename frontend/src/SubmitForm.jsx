import { useState } from 'react'
import { Link } from 'react-router-dom'
import './SubmitForm.css'

function SubmitForm() {
  const [type, setType] = useState('resource')
  const [formData, setFormData] = useState({
    submitterName: '',
    submitterEmail: '',
    resourceTitle: '',
    resourceUrl: '',
    resourceDescription: '',
    resourceCategory: '',
    resourceContactEmail: '',
    resourceContactPhone: '',
    resourceAddressStreet: '',
    resourceAddressCity: '',
    resourceAddressState: '',
    resourceAddressZipCode: '',
    storyTitle: '',
    storyPersonName: '',
    storyLocation: '',
    storySummary: '',
    storyBody: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...formData }),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      setStatus('success')
      setFormData({
        submitterName: '',
        submitterEmail: '',
        resourceTitle: '',
        resourceUrl: '',
        resourceDescription: '',
        resourceCategory: '',
        resourceContactEmail: '',
        resourceContactPhone: '',
        resourceAddressStreet: '',
        resourceAddressCity: '',
        resourceAddressState: '',
        resourceAddressZipCode: '',
        storyTitle: '',
        storyPersonName: '',
        storyLocation: '',
        storySummary: '',
        storyBody: '',
      })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <main className="container">
      <header className="submit-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <h1>Submit a Resource or Community Story</h1>
        <p className="subtitle">
          Your submission will be reviewed by the Toolkit team before being added to the site.
        </p>
      </header>

      <section className="submit-section">
        <form onSubmit={handleSubmit} className="submit-form">
          <fieldset className="submit-fieldset">
            <legend>What would you like to share?</legend>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="resource"
                checked={type === 'resource'}
                onChange={() => setType('resource')}
              />
              <span>Submit a resource (organization, service, or program)</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="communityStory"
                checked={type === 'communityStory'}
                onChange={() => setType('communityStory')}
              />
              <span>Submit a community story</span>
            </label>
          </fieldset>

          <fieldset className="submit-fieldset">
            <legend>Your contact (optional)</legend>
            <label className="submit-label">
              Your name
              <input
                type="text"
                name="submitterName"
                value={formData.submitterName}
                onChange={handleChange}
              />
            </label>
            <label className="submit-label">
              Email address
              <input
                type="email"
                name="submitterEmail"
                value={formData.submitterEmail}
                onChange={handleChange}
              />
            </label>
          </fieldset>

          {type === 'resource' && (
            <fieldset className="submit-fieldset">
              <legend>Resource details</legend>
              <label className="submit-label">
                Resource name
                <input
                  type="text"
                  name="resourceTitle"
                  required
                  value={formData.resourceTitle}
                  onChange={handleChange}
                />
              </label>
              <label className="submit-label">
                Website link
                <input
                  type="url"
                  name="resourceUrl"
                  value={formData.resourceUrl}
                  onChange={handleChange}
                />
              </label>
              <label className="submit-label">
                Category
                <select
                  name="resourceCategory"
                  value={formData.resourceCategory}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  <option value="legal-aid">Legal Aid</option>
                  <option value="community-organizations">Community Organizations</option>
                  <option value="mutual-aid-support">Mutual Aid Support</option>
                  <option value="interdependency-support">Interdependency Support</option>
                  <option value="mental-health-support">Mental Health Support</option>
                </select>
              </label>
              <label className="submit-label">
                Description
                <textarea
                  name="resourceDescription"
                  rows={4}
                  required
                  value={formData.resourceDescription}
                  onChange={handleChange}
                />
              </label>
              <label className="submit-label">
                Contact email
                <input
                  type="email"
                  name="resourceContactEmail"
                  value={formData.resourceContactEmail}
                  onChange={handleChange}
                />
              </label>
              <label className="submit-label">
                Contact phone
                <input
                  type="tel"
                  name="resourceContactPhone"
                  value={formData.resourceContactPhone}
                  onChange={handleChange}
                />
              </label>
              <fieldset className="submit-fieldset" style={{ border: 'none', padding: 0, margin: '0 0 1rem 0' }}>
                <legend style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Address (optional)</legend>
                <label className="submit-label">
                  Street address
                  <input
                    type="text"
                    name="resourceAddressStreet"
                    value={formData.resourceAddressStreet}
                    onChange={handleChange}
                  />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <label className="submit-label">
                    City
                    <input
                      type="text"
                      name="resourceAddressCity"
                      value={formData.resourceAddressCity}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="submit-label">
                    State
                    <input
                      type="text"
                      name="resourceAddressState"
                      value={formData.resourceAddressState}
                      onChange={handleChange}
                      placeholder="PA"
                    />
                  </label>
                </div>
                <label className="submit-label">
                  ZIP code
                  <input
                    type="text"
                    name="resourceAddressZipCode"
                    value={formData.resourceAddressZipCode}
                    onChange={handleChange}
                  />
                </label>
              </fieldset>
            </fieldset>
          )}

          {type === 'communityStory' && (
            <fieldset className="submit-fieldset">
              <legend>Story details</legend>
              <label className="submit-label">
                Story title
                <input
                  type="text"
                  name="storyTitle"
                  required
                  value={formData.storyTitle}
                  onChange={handleChange}
                />
              </label>
              <label className="submit-label">
                Name or pseudonym
                <input
                  type="text"
                  name="storyPersonName"
                  value={formData.storyPersonName}
                  onChange={handleChange}
                />
              </label>
              <label className="submit-label">
                Location
                <input
                  type="text"
                  name="storyLocation"
                  value={formData.storyLocation}
                  onChange={handleChange}
                />
              </label>
              <label className="submit-label">
                Short summary (1–2 sentences)
                <textarea
                  name="storySummary"
                  rows={3}
                  value={formData.storySummary}
                  onChange={handleChange}
                />
              </label>
              <label className="submit-label">
                Full story
                <textarea
                  name="storyBody"
                  rows={6}
                  required
                  value={formData.storyBody}
                  onChange={handleChange}
                />
              </label>
            </fieldset>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending...' : 'Send submission'}
          </button>

          {status === 'success' && (
            <p className="submit-message success">
              Thank you. Your submission has been received and will be reviewed
              by the Toolkit team.
            </p>
          )}
          {status === 'error' && (
            <p className="submit-message error">
              Something went wrong. Please try again later.
            </p>
          )}
        </form>
      </section>
    </main>
  )
}

export default SubmitForm

