export function pickI18n(field, lang, fallback) {
  if (field && typeof field === 'object') {
    return field[lang] ?? field.en ?? fallback ?? ''
  }
  return field ?? fallback ?? ''
}

