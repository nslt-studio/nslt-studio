import * as state from './state.js'

let clockInterval      = null
let isHoveringServices = false
let defaultFirstText   = null
let frozen             = false

export function initButtons() {
  if (clockInterval) { clearInterval(clockInterval); clockInterval = null }
  isHoveringServices = false
  frozen             = false

  const yearEl = document.getElementById('currentYear')
  if (yearEl) yearEl.textContent = new Date().getFullYear()

  const first  = document.getElementById('first')
  const second = document.getElementById('second')
  if (!first || !second) return

  const firstP  = first.querySelector('p')
  const secondP = second.querySelector('p')

  // Details page: freeze buttons with project data, no clock, no hover
  const isDetails = document.querySelector('[data-swup]')?.dataset.swup === 'details'
  if (isDetails) {
    const swupEl   = document.querySelector('[data-swup="details"]')
    const name     = state.detailsName     || swupEl?.dataset.name     || ''
    const services = state.detailsServices || swupEl?.dataset.services || ''

    if (firstP  && name)     { firstP.textContent  = name;     first.style.width  = measureWidth(first,  name)     + 'px' }
    if (secondP && services) { secondP.textContent = services; second.style.width = measureWidth(second, services) + 'px' }
    return
  }

  // Capture the default text once (from data-default attr or DOM), never overwritten
  if (defaultFirstText === null) {
    defaultFirstText = first.dataset.default || firstP?.textContent || ''
  }

  // Always reset #first to its original value when landing on a non-details page
  if (firstP) {
    firstP.textContent = defaultFirstText
    first.style.width  = measureWidth(first, defaultFirstText) + 'px'
  }

  // #second: always reset to current time
  const currentTime = getCETTime()
  if (secondP) {
    secondP.textContent = currentTime
    second.style.width  = measureWidth(second, currentTime) + 'px'
  }

  // Start clock
  clockInterval = setInterval(() => {
    if (!isHoveringServices && secondP) secondP.textContent = getCETTime()
  }, 1000)

  if (window.matchMedia('(hover: hover)').matches) {
    // Desktop — hover
    document.querySelectorAll('[data-name]').forEach(el => {
      el.addEventListener('mouseenter', () => { if (!frozen) swap(first, firstP, el.dataset.name) })
      el.addEventListener('mouseleave', () => { if (!frozen) swap(first, firstP, defaultFirstText) })
    })
    document.querySelectorAll('[data-services]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (frozen) return
        isHoveringServices = true
        swap(second, secondP, el.dataset.services)
      })
      el.addEventListener('mouseleave', () => {
        if (frozen) return
        isHoveringServices = false
        swap(second, secondP, getCETTime())
      })
    })
  } else {
    // Mobile/tablet — click
    document.querySelectorAll('[data-name]').forEach(el => {
      el.addEventListener('click', () => { if (!frozen) swap(first, firstP, el.dataset.name) })
    })
    document.querySelectorAll('[data-services]').forEach(el => {
      el.addEventListener('click', () => {
        if (frozen) return
        isHoveringServices = true
        swap(second, secondP, el.dataset.services)
      })
    })
  }
}

// Called immediately on click toward a details page
export function applyDetailsButtons(name, services) {
  frozen = true
  if (clockInterval) {
    clearInterval(clockInterval)
    clockInterval = null
  }

  const first  = document.getElementById('first')
  const second = document.getElementById('second')
  if (!first || !second) return

  const firstP  = first.querySelector('p')
  const secondP = second.querySelector('p')

  if (firstP && name) {
    firstP.textContent = name
    first.style.width  = measureWidth(first, name) + 'px'
  }
  if (secondP && services) {
    secondP.textContent = services
    second.style.width  = measureWidth(second, services) + 'px'
  }
}

// Called immediately when the user clicks away from details
// so the buttons reset during the exit transition (not after)
export function resetButtons() {
  const first  = document.getElementById('first')
  const second = document.getElementById('second')
  if (!first || !second) return

  const firstP  = first.querySelector('p')
  const secondP = second.querySelector('p')

  const resetFirst = first.dataset.default || defaultFirstText || ''
  if (firstP && resetFirst) swap(first, firstP, resetFirst)
  if (secondP) swap(second, secondP, getCETTime())
}

// Fade out → update text + resize → fade in
function swap(btn, p, newText) {
  p.style.opacity = '0'

  setTimeout(() => {
    p.textContent   = newText
    btn.style.width = measureWidth(btn, newText) + 'px'
    p.style.opacity = '1'
  }, 200)
}

// Clone the button off-screen to measure its natural width with new text
function measureWidth(btn, text) {
  const clone = btn.cloneNode(true)
  Object.assign(clone.style, {
    position:      'absolute',
    visibility:    'hidden',
    width:         'auto',
    transition:    'none',
    pointerEvents: 'none',
  })
  const p = clone.querySelector('p')
  if (p) p.textContent = text
  document.body.appendChild(clone)
  const w = clone.offsetWidth
  document.body.removeChild(clone)
  return w
}

function getCETTime() {
  return new Date().toLocaleTimeString('fr-FR', {
    timeZone: 'Europe/Paris',
    hour:     '2-digit',
    minute:   '2-digit',
    second:   '2-digit',
    hour12:   false,
  }) + ' CET'
}
