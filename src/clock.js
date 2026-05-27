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
