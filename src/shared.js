import gsap from 'gsap'

let clockInterval

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
  gsap.killTweensOf(els)
  gsap.set(els, { opacity: 1 })
  gsap.to(els, { opacity: 0, duration: 0.6, ease: 'none', repeat: -1, yoyo: true })
}
