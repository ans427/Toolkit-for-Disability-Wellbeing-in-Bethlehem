import { useEffect, useRef } from 'react'

// Informational cards are one reading stop. Their complete visible text is the
// accessible name, while descendants retain headings, lists, and usable links.
const readingCards = '.policy-section, .disability-activism-section, .about-section, .statement-section, .disclaimer-section, .resource-about'

export default function SectionNavigation({ children }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const managed = new Map()
    const attributes = ['tabindex', 'aria-label', 'aria-labelledby', 'role']
    const restore = (card, original) => {
      for (const [name, value] of Object.entries(original)) {
        if (value === null) card.removeAttribute(name)
        else card.setAttribute(name, value)
      }
      card.removeAttribute('data-reading-card')
    }
    const update = () => {
      for (const [card, original] of managed) {
        if (!root.contains(card)) {
          restore(card, original)
          managed.delete(card)
        }
      }
      root.querySelectorAll(readingCards).forEach(card => {
        if (card.closest('a, button, [inert], [hidden], [aria-hidden="true"]')) return
        if (!managed.has(card)) {
          managed.set(card, Object.fromEntries(attributes.map(name => [name, card.getAttribute(name)])))
        }
        const text = card.innerText.replace(/\s+/g, ' ').trim()
        if (!text) return
        card.setAttribute('tabindex', '0')
        // aria-labelledby takes precedence over aria-label; remove the old
        // title-only reference so the body is included in the focus announcement.
        card.removeAttribute('aria-labelledby')
        if (card.getAttribute('aria-label') !== text) card.setAttribute('aria-label', text)
        // Named sections should not create a landmark for every reading card.
        if (card.tagName === 'SECTION' && !card.hasAttribute('role')) card.setAttribute('role', 'group')
        card.setAttribute('data-reading-card', '')
      })
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { childList: true, subtree: true, characterData: true })
    return () => {
      observer.disconnect()
      for (const [card, original] of managed) restore(card, original)
    }
  }, [])

  const handleClick = event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target.closest('a[href^="#"]')
    if (!link) {
      // Clicking reading text selects the same card as Tab. Embedded controls
      // keep their own focus and behavior; selecting text is not interrupted.
      const card = event.target.closest('[data-reading-card]')
      if (card && !event.target.closest('a, button, input, select, textarea, [role="button"], [contenteditable]') && !window.getSelection()?.toString()) {
        if (document.activeElement !== card) card.focus({ preventScroll: true })
      }
      return
    }
    if (link.hasAttribute('download') || link.target === '_blank') return
    const hash = link.getAttribute('href')
    if (hash.length < 2) return
    let id
    try { id = decodeURIComponent(hash.slice(1)) } catch { return }
    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    const readingCard = target.closest('[data-reading-card]')
    const focusTarget = readingCard || (target.matches('h1, h2, h3, h4, h5, h6, input, select, textarea, button, a[href]')
      ? target
      : target.querySelector('h1, h2, h3, h4, h5, h6, input, select, textarea, button, a[href]') || target)
    const card = focusTarget.closest('article, section')
    const addedTabIndex = !focusTarget.hasAttribute('tabindex') && focusTarget.tabIndex < 0
    if (addedTabIndex) focusTarget.setAttribute('tabindex', '-1')
    focusTarget.setAttribute('data-jump-focus', '')
    if (card) card.setAttribute('data-jump-card', '')
    focusTarget.addEventListener('blur', () => {
      focusTarget.removeAttribute('data-jump-focus')
      if (card) card.removeAttribute('data-jump-card')
      if (addedTabIndex) focusTarget.removeAttribute('tabindex')
    }, { once: true })
    focusTarget.focus({ preventScroll: true })
    target.scrollIntoView({ behavior: 'instant', block: 'start' })
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
  }

  return <div ref={rootRef} className="section-navigation" onClick={handleClick}>{children}</div>
}
