import gsap from 'gsap'
import { initClock, initFreelancePulse } from '../shared.js'

export function initDetails() {
  initClock()

  // Hide current page work-item
  const currentLink = document.querySelector('.work-list .work-item .work-link.w--current')
  if (currentLink) currentLink.closest('.work-item').style.display = 'none'

  // Media items — shuffle, random width, index labels
  const mediaContainer = document.querySelector('.media')
  if (mediaContainer) {
    const items = [...mediaContainer.querySelectorAll('.media-item')]

    // Shuffle array then reorder DOM
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[items[i], items[j]] = [items[j], items[i]]
    }
    items.forEach(item => mediaContainer.appendChild(item))

    const w = window.innerWidth
    const widths = w < 768  ? [100]
                 : w < 992  ? [50, 52.5, 55, 57.5, 60, 62.5, 65, 67.5, 70, 72.5, 75]
                 :             [40, 42.5, 45, 47.5, 50, 52.5, 55, 57.5, 60]
    const total  = String(items.length).padStart(3, '0')

    items.forEach((item, i) => {
      const sizable = item.querySelector('.media-video, .media-img-inner')
      if (sizable) sizable.style.width = widths[Math.floor(Math.random() * widths.length)] + '%'

      const p = item.querySelector('p[media-index]')
      if (p) p.textContent = `${String(i + 1).padStart(3, '0')} / ${total}`
    })
  }

  // Work item indices (same calculation as home)
  document.querySelectorAll('.work-list .work-item').forEach((item, i) => {
    const p = item.querySelector('p[data-index]')
    if (p) p.textContent = String(i + 1).padStart(3, '0')
  })

  // No work-media hover on details page

  // Media items — img/video appear once loaded
  document.querySelectorAll('.media-item').forEach(item => {
    const img   = item.querySelector('img')
    const video = item.querySelector('video')

    if (img) {
      gsap.set(img, { opacity: 0 })
      const show = () => gsap.to(img, { opacity: 1, duration: 0.6, ease: 'power1.inOut', delay: 0.3 })
      img.complete && img.naturalWidth ? show() : img.addEventListener('load', show, { once: true })
    }

    if (video) {
      gsap.set(video, { opacity: 0 })
      video.addEventListener('canplay', () => {
        gsap.to(video, { opacity: 1, duration: 0.6, ease: 'power1.inOut', delay: 0.3 })
        video.play().catch(() => {})
      }, { once: true })
    }
  })

  // Animation — header + footer → .media → about + work
  const headerEls  = [...(document.querySelector('.header')?.children ?? [])]
  const footerEl   = document.querySelector('.footer')
  const footerDone = !!footerEl?.dataset.animated
  const footerEls  = footerDone ? [] : [...(footerEl?.children ?? [])]
  const group1     = [...headerEls, ...footerEls]
  const mediaEl   = document.querySelector('.media')

  const group2 = [...(document.querySelector('.about')?.children ?? [])]
  const work = document.querySelector('.work')
  if (work) {
    group2.push(...[...work.children].filter(el => !el.classList.contains('work-wrapper')))
    group2.push(...work.querySelectorAll('.work-list .work-item .work-link'))
  }

  if (mediaEl) gsap.set(mediaEl, { opacity: 0 })
  if (group2.length) gsap.set(group2, { opacity: 0, backgroundColor: 'var(--light-black)' })

  const flashBg = (els) => {
    els.forEach(el => {
      el.style.transition = 'background-color 600ms ease'
      el.style.backgroundColor = 'transparent'
      el.style.pointerEvents = 'auto'
    })
    setTimeout(() => els.forEach(el => {
      el.style.transition = ''
      el.style.backgroundColor = ''
    }), 650)
  }

  if (!group1.length) {
    if (mediaEl) gsap.to(mediaEl, { opacity: 1, duration: 0.6, ease: 'power1.inOut', pointerEvents: 'auto' })
    return
  }

  gsap.set(group1, { opacity: 0, backgroundColor: 'var(--light-black)' })

  gsap.timeline({
    onComplete() {
      flashBg(group1)
      if (!footerDone && footerEl) footerEl.dataset.animated = 'true'

      if (mediaEl) {
        gsap.to(mediaEl, {
          opacity: 1, duration: 0.6, ease: 'power1.inOut', pointerEvents: 'auto',
          onComplete() {
            if (group2.length) {
              gsap.timeline({ onComplete: () => { flashBg(group2); initFreelancePulse() } })
                .to(group2, { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.08 })
            } else {
              initFreelancePulse()
            }
          },
        })
      } else if (group2.length) {
        gsap.timeline({ onComplete: () => { flashBg(group2); initFreelancePulse() } })
          .to(group2, { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.08 })
      } else {
        initFreelancePulse()
      }
    },
  })
  .to(headerEls, { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.04 })
  .to(footerEls, { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.04 }, '<')
}
