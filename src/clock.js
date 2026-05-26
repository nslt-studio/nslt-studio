const DOT_DURATION = 1500
const DOT_MAX      = 1.25
const DOT_MIN      = 0.75

let clockInterval

export function initClock() {
  clearInterval(clockInterval)

  const dateEl = document.querySelector('#date')
  const timeEl = document.querySelector('#time')
  if (!dateEl && !timeEl) return

  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      timeZone: 'Europe/Paris',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  if (timeEl) {
    const update = () => {
      timeEl.textContent = new Date().toLocaleTimeString('fr-FR', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    }
    update()
    clockInterval = setInterval(update, 1000)
  }
}

export function initFooterDot() {
  const dot = document.querySelector('.footer-dot')
  if (!dot) return

  let start = null
  const tick = (ts) => {
    if (!start) start = ts
    const t = ((ts - start) % DOT_DURATION) / DOT_DURATION
    const wave = t < 0.5 ? t * 2 : (1 - t) * 2
    dot.style.transform = `scale(${DOT_MAX - (DOT_MAX - DOT_MIN) * wave})`
    dot.style.opacity   = `${1 - wave}`
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

