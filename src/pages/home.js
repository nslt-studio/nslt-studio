import { initMedia } from '../media.js'
import { initClock, initFreelancePulse } from '../clock.js'

function initLoader() {
  const FACTOR = 6

  const T = {
    delay:      600,
    rotate:     600,
    holdRotate: 300,
    shrink:     300,
    move:       400,
    loaderFade: 400,
  }

  const loader = document.querySelector('.loader')
  const circle = loader?.querySelector('.circle-inner')
  if (!loader || !circle) return

  const circles = [...circle.querySelectorAll('.loader-circle')]

  document.body.style.overflow = 'hidden'

  // Lire et verrouiller les tailles naturelles
  const natural = circles.map(c => {
    const s = getComputedStyle(c)
    return { w: parseFloat(s.width), h: parseFloat(s.height), b: parseFloat(s.borderTopWidth) }
  })
  circles.forEach((c, i) => {
    c.style.transition = 'none'
    c.style.width = `${natural[i].w}px`
    c.style.height = `${natural[i].h}px`
    c.style.borderWidth = `${natural[i].b}px`
  })

  // Lire la position réelle CSS avant tout changement
  const loaderRect = loader.getBoundingClientRect()
  const rectBefore = circle.getBoundingClientRect()

  // Supprimer le transform CSS pour mesurer la position sans transform
  circle.style.transition = 'none'
  circle.style.transform = 'translate(0px, 0px) rotate(0deg)'
  const rectAfter = circle.getBoundingClientRect()

  // Offset du transform CSS (recalcule le centrage quel que soit le CSS Webflow)
  const cssOffX = rectBefore.left - rectAfter.left
  const cssOffY = rectBefore.top - rectAfter.top
  circle.style.transform = `translate(${cssOffX}px, ${cssOffY}px) rotate(0deg)`

  // Forcer reflow puis appliquer transitions
  circle.getBoundingClientRect()
  circle.style.transition = `transform ${T.rotate}ms ease`
  circles.forEach(c => {
    c.style.transition = `width ${T.shrink}ms ease, height ${T.shrink}ms ease, border-width ${T.shrink}ms ease`
  })

  setTimeout(() => {
    circle.style.transform = `translate(${cssOffX}px, ${cssOffY}px) rotate(360deg)`

    setTimeout(() => {
      circle.style.transition = `transform ${T.move}ms ease`

      // Lire le transform exact depuis la matrice du browser — Y garanti inchangé
      const mat1 = new DOMMatrix(getComputedStyle(circle).transform)
      const rect1 = circle.getBoundingClientRect()
      const dxToRight = loaderRect.right - rect1.right

      // Shrink + move right — Y (mat1.m42) strictement inchangé
      circles.forEach((c, i) => {
        c.style.width = `${natural[i].w / FACTOR}px`
        c.style.height = `${natural[i].h / FACTOR}px`
        c.style.borderWidth = `${natural[i].b / FACTOR}px`
      })
      circle.style.transform = `translate(${mat1.m41 + dxToRight}px, ${mat1.m42}px) rotate(360deg)`

      setTimeout(() => {
        // Lire position réelle après le mouvement pour calculer le delta Y exact vers le haut
        const rect2 = circle.getBoundingClientRect()
        const mat2  = new DOMMatrix(getComputedStyle(circle).transform)
        const dyToTop = loaderRect.top - rect2.top

        circle.style.transform = `translate(${mat2.m41}px, ${mat2.m42 + dyToTop}px) rotate(360deg)`

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
