const OPEN_DELAY  = 350
const CLOSE_DELAY = 150

export function initInfo() {
  const info        = document.querySelector('.info')
  const btn         = document.querySelector('#infoButton')
  const mainWrapper = document.querySelector('.main-wrapper')
  const infoText    = document.querySelector('#infoText')
  if (!info || !btn || !mainWrapper) return

  let open        = false
  let textTimeout = null

  let height = 0
  const updateHeight = () => {
    info.style.height = ''
    height = info.getBoundingClientRect().height
    info.style.height = `${height}px`
    if (open) mainWrapper.style.transform = `translateY(${height}px)`
  }
  updateHeight()
  window.addEventListener('resize', updateHeight)

  const openPanel = () => {
    open = true
    clearTimeout(textTimeout)
    document.body.style.overflow = 'hidden'
    info.style.transform        = 'translateY(0%)'
    mainWrapper.style.transform = `translateY(${height}px)`
    btn.textContent             = 'Close'
    if (infoText) {
      infoText.style.opacity = '0'
      textTimeout = setTimeout(() => { infoText.style.opacity = '1' }, OPEN_DELAY)
    }
  }

  const closePanel = () => {
    open = false
    clearTimeout(textTimeout)
    document.body.style.overflow = ''
    btn.textContent = 'Information'
    if (infoText) {
      infoText.style.opacity = '0'
      textTimeout = setTimeout(() => {
        info.style.transform        = 'translateY(-100%)'
        mainWrapper.style.transform = 'translateY(0)'
      }, CLOSE_DELAY)
    } else {
      info.style.transform        = 'translateY(-100%)'
      mainWrapper.style.transform = 'translateY(0)'
    }
  }

  btn.addEventListener('click', () => open ? closePanel() : openPanel())

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) closePanel()
  })

  document.addEventListener('click', e => {
    if (!open) return
    if (!info.contains(e.target) && e.target !== btn && !e.target.closest('a[href]')) closePanel()
  }, true)
}
