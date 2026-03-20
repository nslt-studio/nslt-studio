import Swup from 'swup'
import { initPage } from './router.js'
import { initMedia } from './media.js'
import { setActiveNav } from './nav.js'
import { initButtons, resetButtons, applyDetailsButtons } from './buttons.js'
import { setPreviousUrl, setDetailsData } from './state.js'

let swup

export function initSwup() {
  swup = new Swup({
    containers: ['#swup'],
    animationSelector: '[class*="transition-"]',
  })

  // Immediately on click:
  // — entering details → hide nav/meet right away
  // — leaving details  → hide close right away, keep nav/meet hidden during transition
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]')
    if (!link) return

    const trigger = e.target.closest('[data-to="details"]')
    if (trigger) {
      const name     = trigger.dataset.name     ?? ''
      const services = trigger.dataset.services ?? ''
      setDetailsData(name, services)
      applyDetailsButtons(name, services)
      document.body.classList.add('details-transition')
    } else if (document.body.classList.contains('on-details')) {
      document.body.classList.remove('on-details')
      document.body.classList.add('details-transition')
      resetButtons()
    }
  }, true)

  // Save current URL before any non-details navigation
  swup.hooks.on('visit:start', () => {
    const ns = document.querySelector('[data-swup]')?.dataset.swup
    if (ns !== 'details') setPreviousUrl(window.location.pathname)
  })

  // When new content is in DOM (before in-animation): finalize body classes
  swup.hooks.on('animation:in:start', () => {
    const ns = document.querySelector('[data-swup]')?.dataset.swup
    if (ns === 'details') {
      document.body.classList.add('on-details')
      document.body.classList.remove('details-transition')
    } else {
      document.body.classList.remove('on-details', 'details-transition')
    }
  })

  swup.hooks.on('page:view', () => {
    setActiveNav()
    initPage()
    initMedia()
    initButtons()
  })
}

export { swup }
