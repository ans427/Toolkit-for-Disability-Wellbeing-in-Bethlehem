import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import './SubmitForm.css'

function SubmitForm() {
  const [type, setType] = useState('resource')

  const initialFormState = {
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
  }

  const [formData, setFormData] = useState(initialFormState)
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const doc = {
        _type: 'submission',
        type,
        submitterName: formData.submitterName,
        submitterEmail: formData.submitterEmail,

        // Resource fields
        resourceTitle: formData.resourceTitle,
        resourceUrl: formData.resourceUrl || undefined,
        resourceDescription: formData.resourceDescription,
        resourceCategory: formData.resourceCategory,
        resourceContactEmail: formData.resourceContactEmail,
        resourceContactPhone: formData.resourceContactPhone,

        resourceAddress: {
          street: formData.resourceAddressStreet,
          city: formData.resourceAddressCity,
          state: formData.resourceAddressState,
          zipCode: formData.resourceAddressZipCode,
        },

        // Story fields
        storyTitle: formData.storyTitle,
        storyPersonName: formData.storyPersonName,
        storyLocation: formData.storyLocation,
        storySummary: formData.storySummary,
        storyBody: formData.storyBody,
      }

      await sanity.create(doc)

      setStatus('success')
      setFormData(initialFormState)
    } catch (err) {
      console.error('Sanity submission error:', err)
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
                checked={type === 'resource'}
                onChange={() => setType('resource')}
              />
              <span>Submit a resource</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
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

              <label className="submit-label">
                Street address
                <input
                  type="text"
                  name="resourceAddressStreet"
                  value={formData.resourceAddressStreet}
                  onChange={handleChange}
                />
              </label>

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
                />
              </label>

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
                Short summary
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

          <button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send submission'}
          </button>

          {status === 'success' && (
            <p className="submit-message success">
              Thank you. Your submission has been received.
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
