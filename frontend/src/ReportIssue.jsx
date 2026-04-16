import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sanity } from './sanityClient'
import Breadcrumb from './Breadcrumb'
import { useLanguage } from './languageContext'
import { t } from './uiStrings'
import './ReportIssue.css'

const initialFormState = {
  subject: '',
  details: '',
  pageUrl: '',
  locationDescription: '',
  submitterName: '',
  submitterEmail: '',
  image: null,
}

function ReportIssue() {
  const lang = useLanguage()
  const [formData, setFormData] = useState(initialFormState)
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files?.[0] || null }))
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      let imageField
      if (formData.image) {
        const asset = await sanity.assets.upload('image', formData.image)
        imageField = {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        }
      }

      await sanity.create({
        _type: 'siteIssueReport',
        status: 'draft',
        subject: formData.subject,
        details: formData.details,
        pageUrl: formData.pageUrl || undefined,
        locationDescription: formData.locationDescription || '',
        submitterName: formData.submitterName || '',
        submitterEmail: formData.submitterEmail || '',
        ...(imageField ? { image: imageField } : {}),
      })

      setStatus('success')
      setFormData(initialFormState)
    } catch (err) {
      console.error('Report issue submission error:', err)
      setStatus('error')
    }
  }

  return (
    <main className="container">
      <Breadcrumb />
      <header className="report-header">
        <Link to="/" className="back-link">
          {t(lang, 'pages.reportIssue.backHome')}
        </Link>
        <h1>{t(lang, 'pages.reportIssue.title')}</h1>
        <p className="subtitle">{t(lang, 'pages.reportIssue.subtitle')}</p>
      </header>

      <section className="report-location-redirect" aria-label={t(lang, 'pages.reportIssue.locationRedirectTitle')}>
        <p className="report-location-redirect-title">{t(lang, 'pages.reportIssue.locationRedirectTitle')}</p>
        <p className="report-location-redirect-text">{t(lang, 'pages.reportIssue.locationRedirectBody')}</p>
        <Link to="/map?openReportForm=1" className="report-location-redirect-button">
          {t(lang, 'pages.reportIssue.locationRedirectButton')}
        </Link>
      </section>

      <form className="report-form-page" onSubmit={handleSubmit}>
        <label className="report-label" htmlFor="subject">
          {t(lang, 'pages.reportIssue.subjectLabel')}
          <input id="subject" name="subject" type="text" required value={formData.subject} onChange={handleChange} />
        </label>

        <label className="report-label" htmlFor="details">
          {t(lang, 'pages.reportIssue.detailsLabel')}
          <textarea id="details" name="details" rows={5} required value={formData.details} onChange={handleChange} />
        </label>

        <label className="report-label" htmlFor="image">
          {t(lang, 'pages.reportIssue.photoLabel')}
          <input id="image" name="image" type="file" accept="image/*" onChange={handleChange} />
        </label>

        <label className="report-label" htmlFor="pageUrl">
          {t(lang, 'pages.reportIssue.pageUrlLabel')}
          <input id="pageUrl" name="pageUrl" type="url" value={formData.pageUrl} onChange={handleChange} placeholder="https://..." />
        </label>

        <label className="report-label" htmlFor="locationDescription">
          {t(lang, 'pages.reportIssue.locationDescriptionLabel')}
          <input id="locationDescription" name="locationDescription" type="text" value={formData.locationDescription} onChange={handleChange} />
        </label>

        <label className="report-label" htmlFor="submitterName">
          {t(lang, 'pages.reportIssue.nameLabel')}
          <input id="submitterName" name="submitterName" type="text" value={formData.submitterName} onChange={handleChange} />
        </label>

        <label className="report-label" htmlFor="submitterEmail">
          {t(lang, 'pages.reportIssue.emailLabel')}
          <input id="submitterEmail" name="submitterEmail" type="email" value={formData.submitterEmail} onChange={handleChange} />
        </label>

        <button type="submit" className="report-submit-button" disabled={status === 'submitting'}>
          {status === 'submitting' ? t(lang, 'pages.reportIssue.submitting') : t(lang, 'pages.reportIssue.submitButton')}
        </button>

        {status === 'success' && <p className="report-status success">{t(lang, 'pages.reportIssue.successMessage')}</p>}
        {status === 'error' && <p className="report-status error">{t(lang, 'pages.reportIssue.errorMessage')}</p>}
      </form>
    </main>
  )
}

export default ReportIssue
