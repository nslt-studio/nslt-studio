import gsap from 'gsap'

let clockInterval

export function initHome() {
  // Work item indices
  document.querySelectorAll('.work-list .work-item').forEach((item, i) => {
    const p = item.querySelector('p[data-index]')
    if (p) p.textContent = String(i + 1).padStart(3, '0')
  })

  // CET clock (live)
  clearInterval(clockInterval)
  const timeEls = document.querySelectorAll('[aria-label="time"]')
  const updateClock = () => {
    const time = new Date().toLocaleTimeString('fr-FR', {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    timeEls.forEach(el => (el.textContent = `${time} CET`))
  }
  updateClock()
  clockInterval = setInterval(updateClock, 1000)

  // Work item hover media (desktop only)
  if (window.innerWidth >= 992) document.querySelectorAll('.work-item').forEach(item => {
    const link  = item.querySelector('.work-link')
    const media = item.querySelector('.work-media')
    if (!link || !media) return

    const video = media.querySelector('video[data-src]')
    const img   = media.querySelector('img')

    const mediaEls = [img, video].filter(Boolean)
    gsap.set(mediaEls, { opacity: 0 })

    const showMedia = els => gsap.to(els, { opacity: 1, duration: 0.6, ease: 'power1.inOut', delay: 0.3 })
    const hideMedia = els => { gsap.killTweensOf(els); gsap.set(els, { opacity: 0 }) }

    let videoStarted = false
    let videoReady   = false
    let hovering     = false

    link.addEventListener('mouseenter', () => {
      hovering = true
      media.style.opacity = '1'

      if (img) showMedia(img)

      if (video) {
        if (!videoStarted) {
          videoStarted = true
          video.src = video.dataset.src
          video.load()
          video.addEventListener('canplay', () => {
            videoReady = true
            if (hovering) {
              showMedia(video)
              video.play().catch(() => {})
            }
          }, { once: true })
        } else if (videoReady) {
          showMedia(video)
          video.play().catch(() => {})
        }
      }
    })

    link.addEventListener('mouseleave', () => {
      hovering = false
      media.style.opacity = '0'
      hideMedia(mediaEls)
      if (video && videoReady) video.pause()
    })
  })

  // Animation groups
  const headerEls = [...(document.querySelector('.header')?.children ?? [])]
  const footerEls = [...(document.querySelector('.footer')?.children ?? [])]

  const group2 = [...(document.querySelector('.about')?.children ?? [])]
  const work = document.querySelector('.work')
  if (work) {
    group2.push(...[...work.children].filter(el => !el.classList.contains('work-wrapper')))
    group2.push(...work.querySelectorAll('.work-list .work-item .work-link'))
  }

  const all = [...headerEls, ...footerEls, ...group2]
  if (!all.length) return

  gsap.set(all, { opacity: 0, backgroundColor: 'var(--light-black)' })

  gsap.timeline({
    onComplete() {
      all.forEach(el => {
        el.style.transition = 'background-color 600ms ease'
        el.style.backgroundColor = 'transparent'
        el.style.pointerEvents = 'auto'
      })
      setTimeout(() => all.forEach(el => {
        el.style.transition = ''
        el.style.backgroundColor = ''
      }), 650)

      gsap.to('[aria-label="freelance"]', {
        opacity: 0,
        duration: 0.6,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })
    },
  })
  .to(headerEls, { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.04 })
  .to(footerEls, { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.04 }, '<')
  .to(group2,    { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.08 })
}
