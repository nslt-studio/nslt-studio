import { initMedia, initVimeo } from '../media.js'
import { initClock, initFreelancePulse } from '../clock.js'

function initLoader() {
  const T = {
    delay:      600,
    rotate:     600,
    holdRotate: 300,
    move:       400,
    loaderFade: 400,
  }

  const loader = document.querySelector('.loader')
  const circle = loader?.querySelector('.circle-inner')
  if (!loader || !circle) return

  document.body.style.overflow = 'hidden'

  circle.style.transition = 'none'
  circle.style.transformOrigin = 'center center'
  circle.style.right = '50%'
  circle.style.top = '50%'
  circle.style.transform = 'translate(50%, -50%) rotate(0deg)'

  circle.getBoundingClientRect()
  circle.style.transition = `transform ${T.rotate}ms ease`

  setTimeout(() => {
    circle.style.transform = 'translate(50%, -50%) rotate(360deg)'

    setTimeout(() => {
      circle.style.transition = `right ${T.move}ms ease, top ${T.move}ms ease, transform ${T.move}ms ease`
      circle.style.right = '0%'
      circle.style.transform = 'translate(0%, -50%) rotate(360deg)'

      setTimeout(() => {
        circle.style.top = '0%'
        circle.style.transform = 'translate(0%, 0%) rotate(360deg)'

        setTimeout(() => {
          document.body.style.overflow = ''
          loader.style.transition = `opacity ${T.loaderFade}ms ease`
          loader.style.opacity = '0'
          setTimeout(() => loader.remove(), T.loaderFade)
        }, T.move)
      }, T.move)
    }, T.rotate + T.holdRotate)
  }, T.delay)
}

function initMode() {
  const btn = document.querySelector('#mode')
  if (!btn) return

  let mode = localStorage.getItem('mode') || 'white'

  const apply = (m) => {
    document.documentElement.classList.remove('mode-white', 'mode-black')
    document.documentElement.classList.add(`mode-${m}`)
    localStorage.setItem('mode', m)
    mode = m
  }

  apply(mode)

  btn.addEventListener('click', () => {
    apply(mode === 'black' ? 'white' : 'black')
  })
}

function initInactive() {
  const el = document.querySelector('.inactive')
  const overlay = document.querySelector('.overlay')
  if (!el) return

  const video = el.querySelector('video')
  let timer

  if (video) {
    video.setAttribute('playsinline', '')
    video.muted = true
    video.style.opacity = '0'
    video.style.transition = 'opacity 0.6s ease-in-out'
    const reveal = () => { video.style.opacity = '1' }
    video.readyState >= 2 ? reveal() : video.addEventListener('loadeddata', reveal, { once: true })
  }

  const show = () => {
    el.style.opacity = '1'
    el.style.pointerEvents = 'auto'
    if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'auto' }
    video?.play().catch(() => {})
  }

  const hide = () => {
    el.style.opacity = '0'
    el.style.pointerEvents = 'none'
    if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none' }
    video?.pause()
  }

  const reset = () => {
    hide()
    clearTimeout(timer)
    timer = setTimeout(show, 15000)
  }

  ;['mousemove', 'scroll', 'touchstart'].forEach(e =>
    window.addEventListener(e, reset, { passive: true })
  )

  reset()
}

export function initHome() {
  document.querySelectorAll('.work-list .work-item').forEach((item, i) => {
    const p = item.querySelector('p[data-index]')
    if (p) p.textContent = String(i + 1).padStart(3, '0')
  })

  initMode()
  initLoader()
  initMedia()
  initVimeo()
  initClock()
  initFreelancePulse()
  initInactive()

  const btn = document.querySelector('#top')
  const about = document.querySelector('.about')
  if (btn && about) {
    new IntersectionObserver(([entry]) => {
      const past = entry.boundingClientRect.bottom <= 0
      btn.style.transform = past ? 'translate(-50%, 0%)' : 'translate(-50%, 100%)'
      btn.style.opacity = past ? '1' : '0'
    }).observe(about)

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }
}
