export function initNav() {
  setActiveNav()

  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', () => setActiveNav(link.dataset.link))
  })
}

export function setActiveNav(key) {
  const links     = document.querySelectorAll('[data-link]')
  const indicator = document.querySelector('.indicator')
  const activeKey = key ?? document.querySelector('[data-swup]')?.dataset.swup

  if (!activeKey) return

  links.forEach(l => l.classList.remove('w--current'))

  const active = document.querySelector(`[data-link="${activeKey}"]`)
  if (!active) return

  active.classList.add('w--current')

  if (indicator) {
    indicator.style.left  = `${active.offsetLeft}px`
    indicator.style.width = `${active.offsetWidth}px`
  }
}
