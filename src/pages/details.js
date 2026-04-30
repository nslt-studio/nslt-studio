import gsap from 'gsap'
import EmblaCarousel from 'embla-carousel'

export function initDetails() {
  const emblaNode = document.querySelector('.embla')
  const headerEl  = document.querySelector('.header')

  // Hide current-page work-link, exclude it from the list
  const allWorkLinks = [...document.querySelectorAll('.work-list .work-item .work-link')]
  const currentLink  = allWorkLinks.find(el => el.classList.contains('w--current'))
  if (currentLink) currentLink.closest('.work-item').style.display = 'none'
  const workLinks = allWorkLinks.filter(el => !el.classList.contains('w--current'))

  const indexBtns = [...document.querySelectorAll('[data-button="index"]')]

  // Work item indices
  document.querySelectorAll('.work-list .work-item').forEach((item, i) => {
    const p = item.querySelector('p[data-index]')
    if (p) p.textContent = String(i + 1).padStart(3, '0')
  })

  // Work item hover media — data-src lazy load (desktop only)
  if (window.innerWidth >= 992) document.querySelectorAll('.work-list .work-item').forEach(item => {
    const link  = item.querySelector('.work-link')
    const media = item.querySelector('.work-media')
    if (!link || !media || link.classList.contains('w--current')) return

    const video    = media.querySelector('video[data-src]')
    const img      = media.querySelector('img')
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
      if (img) showMedia([img])

      if (video) {
        if (!videoStarted) {
          videoStarted = true
          video.src = video.dataset.src
          video.load()
          video.addEventListener('canplay', () => {
            videoReady = true
            if (hovering) {
              showMedia([video])
              video.play().catch(() => {})
            }
          }, { once: true })
        } else if (videoReady) {
          showMedia([video])
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

  // Work links start hidden
  gsap.set(workLinks, { opacity: 0, pointerEvents: 'none' })

  // Index toggle — only embla dims (not header)
  const indexEl = document.querySelector('.index')
  let indexOpen = false

  const openIndex = () => {
    indexOpen = true
    indexBtns.forEach(btn => (btn.textContent = 'Close Index'))
    gsap.set(workLinks, { backgroundColor: 'var(--light-black)' })
    gsap.timeline()
      .to(workLinks, { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.04, pointerEvents: 'auto' })
      .call(() => {
        workLinks.forEach(el => {
          el.style.transition = 'background-color 600ms ease'
          el.style.backgroundColor = 'transparent'
        })
        setTimeout(() => workLinks.forEach(el => {
          el.style.transition = ''
          el.style.backgroundColor = ''
        }), 650)
      })
    if (indexEl) indexEl.style.pointerEvents = 'auto'
    if (emblaNode) gsap.to(emblaNode, { opacity: 0.1, duration: 0.6, ease: 'power1.inOut', pointerEvents: 'none' })
  }

  const closeIndex = () => {
    indexOpen = false
    indexBtns.forEach(btn => (btn.textContent = 'Index'))
    if (indexEl) indexEl.style.pointerEvents = 'none'
    gsap.to(workLinks, { opacity: 0, duration: 0.6, ease: 'power1.inOut', pointerEvents: 'none' })
    if (emblaNode) gsap.to(emblaNode, { opacity: 1, duration: 0.6, ease: 'power1.inOut', pointerEvents: 'auto' })
  }

  indexBtns.forEach(btn => btn.addEventListener('click', () => indexOpen ? closeIndex() : openIndex()))

  // Embla init
  let showCurrentSlide = null

  if (emblaNode) {
    const viewport  = emblaNode.querySelector('.embla__viewport')
    const prevBtn   = emblaNode.querySelector('.embla__prev')
    const nextBtn   = emblaNode.querySelector('.embla__next')
    const container = viewport.querySelector('.embla__container')
    const slides    = [...container.querySelectorAll('.embla__slide')]

    for (let i = slides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      container.appendChild(slides[j])
      slides.splice(j, 1)
    }

    const embla = EmblaCarousel(viewport, { loop: true, duration: 0, dragFree: false })
    prevBtn?.addEventListener('click', () => embla.scrollPrev())
    nextBtn?.addEventListener('click', () => embla.scrollNext())

    const slideNodes = embla.slideNodes()
    slideNodes.forEach(slide => gsap.set(slide.querySelectorAll('img, video'), { opacity: 0 }))

    const showSlideMedia = (slide) => {
      const els = [...slide.querySelectorAll('img, video')]
      if (!els.length) return
      gsap.to(els, { opacity: 1, duration: 0.6, ease: 'power1.inOut', delay: 0.3 })
      slide.querySelectorAll('video').forEach(v => v.play().catch(() => {}))
    }

    const hideSlideMedia = (slide) => {
      const els = [...slide.querySelectorAll('img, video')]
      if (!els.length) return
      gsap.killTweensOf(els)
      gsap.set(els, { opacity: 0 })
      slide.querySelectorAll('video').forEach(v => v.pause())
    }

    embla.on('select', () => {
      hideSlideMedia(slideNodes[embla.previousScrollSnap()])
      showSlideMedia(slideNodes[embla.selectedScrollSnap()])
    })

    showCurrentSlide = () => showSlideMedia(slideNodes[embla.selectedScrollSnap()])
    gsap.set(emblaNode, { opacity: 0, pointerEvents: 'none' })
  }

  // Header + footer entrance
  const headerEls = [...(headerEl?.children ?? [])]
  const footerEls = [...(document.querySelector('.footer')?.children ?? [])]
  const all = [...headerEls, ...footerEls]

  if (!all.length) {
    if (emblaNode) gsap.to(emblaNode, { opacity: 1, duration: 0.6, ease: 'power1.inOut', pointerEvents: 'auto', onComplete: () => showCurrentSlide?.() })
    return
  }

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

      if (emblaNode) {
        gsap.to(emblaNode, { opacity: 1, duration: 0.6, ease: 'power1.inOut', pointerEvents: 'auto', onComplete: () => showCurrentSlide?.() })
      }
    },
  })
  .to(headerEls, { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.04 })
  .to(footerEls, { opacity: 1, duration: 0.6, ease: 'power1.inOut', stagger: 0.04 }, '<')
}
