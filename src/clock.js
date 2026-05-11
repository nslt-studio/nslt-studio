let clockInterval
let freelanceRaf
let freelanceStart

export function initClock() {
  clearInterval(clockInterval)
  const timeEls = document.querySelectorAll('[aria-label="time"]')
  if (!timeEls.length) return

  const update = () => {
    const time = new Date().toLocaleTimeString('fr-FR', {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    timeEls.forEach(el => (el.textContent = `${time} CET`))
  }
  update()
  clockInterval = setInterval(update, 1000)
}

export function initFreelancePulse() {
  const els = document.querySelectorAll('[aria-label="freelance"]')
  if (!els.length) return

  cancelAnimationFrame(freelanceRaf)
  freelanceStart = null

  const duration = 600

  const tick = (ts) => {
    if (!freelanceStart) freelanceStart = ts
    const t = ((ts - freelanceStart) % (duration * 2)) / duration
    const opacity = t < 1 ? 1 - t : t - 1
    els.forEach(el => (el.style.opacity = opacity))
    freelanceRaf = requestAnimationFrame(tick)
  }

  els.forEach(el => (el.style.opacity = '1'))
  freelanceRaf = requestAnimationFrame(tick)
}
