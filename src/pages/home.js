import { initMedia } from '../media.js'
import { initClock, initFreelancePulse } from '../clock.js'

function initLoader() {
  const T = {
    delay:         600,
    stagger:        40,
    letterFade:    300,
    holdHeadline:  600,
    headlineFade:  300,
    holdLoader:    300,
    loaderFade:    300,
  }

  const loader = document.querySelector('.loader')
  const headline = loader?.querySelector('.loader-headline')
  if (!loader || !headline) return

  document.body.style.overflow = 'hidden'

  const text = headline.textContent
  const letterSpacing = parseFloat(getComputedStyle(headline).letterSpacing) || 0

  headline.textContent = ''
  headline.style.opacity = '1'

  const chars = [...text]
  const spans = chars.map((char, i) => {
    const span = document.createElement('span')
    span.textContent = char
    span.style.opacity = '0'
    span.style.whiteSpace = 'pre'
    span.style.transform = 'translateZ(0)'
    span.style.transition = `opacity ${T.letterFade}ms ease`
    if (i === chars.length - 1 && letterSpacing > 0) {
      span.style.marginRight = `-${letterSpacing}px`
    }
    headline.appendChild(span)
    return span
  })

  setTimeout(() => {
    spans.forEach((span, i) => {
      setTimeout(() => { span.style.opacity = '1' }, i * T.stagger)
    })

    const allVisible = (spans.length - 1) * T.stagger + T.letterFade

    setTimeout(() => {
      headline.style.transition = `opacity ${T.headlineFade}ms ease`
      headline.style.opacity = '0'

      setTimeout(() => {
        document.body.style.overflow = ''
        loader.style.transition = `opacity ${T.loaderFade}ms ease`
        loader.style.opacity = '0'
        setTimeout(() => loader.remove(), T.loaderFade)
      }, T.headlineFade + T.holdLoader)
    }, allVisible + T.holdHeadline)
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
