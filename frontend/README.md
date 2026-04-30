# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Sanity submission email notifications

This app includes a Vercel serverless endpoint at `/api/sanity-submission-notify` that can send email alerts for new Sanity submissions.

### What it notifies

- `_type: submission` (resource/story form)
- `_type: accessibilityReport` (map report form)
- `_type: siteIssueReport` (website issue form)

### Provider options

- **Free (recommended):** Google Apps Script + Gmail
- **Optional fallback:** Resend API

The endpoint will use `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` if present. If that variable is not set, it falls back to `RESEND_API_KEY`.

### Required environment variables (Vercel Project Settings)

- `SANITY_WEBHOOK_SECRET` - shared secret used by Sanity webhook `Authorization` header.
- `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` - Apps Script web app URL (free flow), **or** `RESEND_API_KEY` for paid flow.
- `NOTIFY_EMAIL_TO` - email recipient (defaults to `inclusivebethlehem@gmail.com`).
- `NOTIFY_EMAIL_FROM` - sender label metadata for notification payload.
- `SANITY_STUDIO_BASE_URL` (optional) - used to include Studio deep links.

### Google Apps Script setup (free)

1. Go to [script.google.com](https://script.google.com) and create a new project.
2. Replace the default code with:

```javascript
function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');
  const secret = PropertiesService.getScriptProperties().getProperty('SANITY_WEBHOOK_SECRET') || '';

  if (!body.webhookSecret || body.webhookSecret !== secret) {
    return ContentService.createTextOutput('Unauthorized').setMimeType(ContentService.MimeType.TEXT);
  }

  const doc = body.document || {};
  const label = doc._notificationLabel || 'Submission';
  const to = doc._notificationRecipient || 'inclusivebethlehem@gmail.com';
  const studioLink = doc._studioLink || '';

  const subject = '[Toolkit] New ' + label;
  const text = [
    'A new form submission was created in Sanity.',
    '',
    'Type: ' + (doc._type || ''),
    'Document ID: ' + (doc._id || ''),
    'Submitted by: ' + (doc.submitterName || ''),
    'Submitter email: ' + (doc.submitterEmail || ''),
    'Status: ' + (doc.status || ''),
    studioLink ? 'Studio link: ' + studioLink : '',
    '',
    'Raw payload:',
    JSON.stringify(doc, null, 2),
  ].join('\n');

  MailApp.sendEmail(to, subject, text);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
```

1. In Apps Script, open **Project Settings** and add Script Property:
   - Key: `SANITY_WEBHOOK_SECRET`
   - Value: same secret you set in Vercel for `SANITY_WEBHOOK_SECRET`
2. Deploy -> **New deployment** -> type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
3. Copy the Web App URL and set it as `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` in Vercel env vars.

### Sanity webhook setup

In Sanity Manage -> API -> Webhooks:

1. Create a webhook.
2. URL: `https://<your-domain>/api/sanity-submission-notify`
3. Method: `POST`
4. Trigger on `create` events.
5. Filter:
   - `_type in ["submission", "accessibilityReport", "siteIssueReport"]`
6. Header:
   - `Authorization: Bearer <SANITY_WEBHOOK_SECRET>`
7. Payload projection:
   - send full document (default payload is fine).
