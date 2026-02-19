import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
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
      <Breadcrumb />
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
          <fieldset className="submit-fieldset radio-fieldset">
            <legend>What would you like to share?</legend>

            <div className="radio-options">
              <label className={`radio-option-card ${type === 'resource' ? 'radio-option-selected' : ''}`}>
                <input
                  type="radio"
                  name="submissionType"
                  value="resource"
                  checked={type === 'resource'}
                  onChange={() => setType('resource')}
                  className="radio-input-visually-hidden"
                  aria-describedby="resource-description"
                />
                <span className="radio-option-title">Submit a resource</span>
                <span id="resource-description" className="radio-option-description">Share a service, organization, or support (healthcare, legal aid, housing, etc.)</span>
              </label>

              <label className={`radio-option-card ${type === 'communityStory' ? 'radio-option-selected' : ''}`}>
                <input
                  type="radio"
                  name="submissionType"
                  value="communityStory"
                  checked={type === 'communityStory'}
                  onChange={() => setType('communityStory')}
                  className="radio-input-visually-hidden"
                  aria-describedby="story-description"
                />
                <span className="radio-option-title">Submit a community story</span>
                <span id="story-description" className="radio-option-description">Share a lived experience from the Bethlehem disability community</span>
              </label>
            </div>
          </fieldset>

          <fieldset className="submit-fieldset">
            <legend>Your contact (optional)</legend>

            <label className="submit-label" htmlFor="submitterName">
              Your name
              <input
                id="submitterName"
                type="text"
                name="submitterName"
                value={formData.submitterName}
                onChange={handleChange}
              />
            </label>

            <label className="submit-label" htmlFor="submitterEmail">
              Email address
              <input
                id="submitterEmail"
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

              <label className="submit-label" htmlFor="resourceTitle">
                Resource name
                <input
                  id="resourceTitle"
                  type="text"
                  name="resourceTitle"
                  required
                  value={formData.resourceTitle}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="resourceUrl">
                Website link
                <input
                  id="resourceUrl"
                  type="url"
                  name="resourceUrl"
                  value={formData.resourceUrl}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="resourceCategory">
                Category
                <select
                  id="resourceCategory"
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

              <label className="submit-label" htmlFor="resourceDescription">
                Description
                <textarea
                  id="resourceDescription"
                  name="resourceDescription"
                  rows={4}
                  required
                  value={formData.resourceDescription}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="resourceContactEmail">
                Contact email
                <input
                  id="resourceContactEmail"
                  type="email"
                  name="resourceContactEmail"
                  value={formData.resourceContactEmail}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="resourceContactPhone">
                Contact phone
                <input
                  id="resourceContactPhone"
                  type="tel"
                  name="resourceContactPhone"
                  value={formData.resourceContactPhone}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="resourceAddressStreet">
                Street address
                <input
                  id="resourceAddressStreet"
                  type="text"
                  name="resourceAddressStreet"
                  value={formData.resourceAddressStreet}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="resourceAddressCity">
                City
                <input
                  id="resourceAddressCity"
                  type="text"
                  name="resourceAddressCity"
                  value={formData.resourceAddressCity}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="resourceAddressState">
                State
                <input
                  id="resourceAddressState"
                  type="text"
                  name="resourceAddressState"
                  value={formData.resourceAddressState}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="resourceAddressZipCode">
                ZIP code
                <input
                  id="resourceAddressZipCode"
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

              <label className="submit-label" htmlFor="storyTitle">
                Story title
                <input
                  id="storyTitle"
                  type="text"
                  name="storyTitle"
                  required
                  value={formData.storyTitle}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="storyPersonName">
                Name or pseudonym
                <input
                  id="storyPersonName"
                  type="text"
                  name="storyPersonName"
                  value={formData.storyPersonName}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="storyLocation">
                Location
                <input
                  id="storyLocation"
                  type="text"
                  name="storyLocation"
                  value={formData.storyLocation}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="storySummary">
                Short summary
                <textarea
                  id="storySummary"
                  name="storySummary"
                  rows={3}
                  value={formData.storySummary}
                  onChange={handleChange}
                />
              </label>

              <label className="submit-label" htmlFor="storyBody">
                Full story
                <textarea
                  id="storyBody"
                  name="storyBody"
                  rows={6}
                  required
                  value={formData.storyBody}
                  onChange={handleChange}
                />
              </label>
            </fieldset>
          )}

          <button type="submit" className="submit-button" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send submission'}
          </button>

          {status === 'success' && (
            <p className="submit-message success" role="status" aria-live="polite">
              Thank you. Your submission has been received.
            </p>
          )}

          {status === 'error' && (
            <p className="submit-message error" role="alert" aria-live="assertive">
              Something went wrong. Please try again later.
            </p>
          )}
        </form>
      </section>
    </main>
  )
}

export default SubmitForm
