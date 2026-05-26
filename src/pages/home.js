import EmblaCarousel from 'embla-carousel'

const STAGGER = 100

function activateSlide(slide) {
  const img = slide.querySelector('img')
  if (img) img.style.opacity = '1'

  const video = slide.querySelector('video')
  if (!video) return

  video.style.opacity = '1'

  const source = video.querySelector('source[data-src]')
  if (source && !source.src && source.dataset.src) {
    source.src = source.dataset.src
    video.load()
  }

  if (video.readyState >= 3) {
    video.play().catch(() => {})
  } else {
    video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true })
  }
}

function deactivateSlide(slide) {
  slide.querySelector('video')?.pause()
}

export function initHome() {
  const header = document.querySelector('.header')
  const work   = document.querySelector('.work')

  if (header) header.style.opacity = '1'
  setTimeout(() => {
    if (work) { work.style.opacity = '1'; work.style.transform = 'translateY(0)' }
  }, STAGGER)

  let closeCurrentDesc = null

  document.querySelectorAll('.work-item').forEach(item => {
    const viewport = item.querySelector('.embla__viewport')
    if (!viewport) return

    const embla = EmblaCarousel(viewport, { loop: true, watchDrag: false, duration: 0 })
    const slides = embla.slideNodes()
    if (!slides.length) return

    const dots    = [...item.querySelectorAll('.dot-inner')]
    const infoBtn = item.querySelector('.more-button')
    const emblaEl = item.querySelector('.embla')
    const descEl  = item.querySelector('.description')

    const updateDots = (index) => {
      dots.forEach((di, i) => di.querySelector('.dot')?.classList.toggle('active', i === index))
    }

    let open = false

    const closeDesc = () => {
      if (!open) return
      open = false
      emblaEl.style.opacity       = '1'
      emblaEl.style.pointerEvents = 'auto'
      descEl.style.opacity        = '0'
      descEl.style.pointerEvents  = 'none'
      infoBtn.textContent         = '+'
      if (closeCurrentDesc === closeDesc) closeCurrentDesc = null
    }

    dots.forEach((di, i) => di.addEventListener('click', () => {
      closeCurrentDesc?.()
      embla.scrollTo(i)
    }))

    let current = 0
    activateSlide(slides[0])
    updateDots(0)

    embla.on('select', () => {
      deactivateSlide(slides[current])
      current = embla.selectedScrollSnap()
      activateSlide(slides[current])
      updateDots(current)
    })

    item.querySelector('.embla__prev')?.addEventListener('click', () => { closeCurrentDesc?.(); embla.scrollPrev() })
    item.querySelector('.embla__next')?.addEventListener('click', () => { closeCurrentDesc?.(); embla.scrollNext() })

    item.querySelectorAll('[data-url]').forEach(el => {
      const url = el.getAttribute('href')
      if (!url) return
      try { el.textContent = new URL(url).hostname.replace(/^www\./, '') } catch {}
    })

    if (infoBtn && emblaEl && descEl) {
      infoBtn.addEventListener('click', () => {
        if (!open && closeCurrentDesc) closeCurrentDesc()
        open = !open
        emblaEl.style.opacity       = open ? '0' : '1'
        emblaEl.style.pointerEvents = open ? 'none' : 'auto'
        descEl.style.opacity        = open ? '1' : '0'
        descEl.style.pointerEvents  = open ? 'auto' : 'none'
        infoBtn.textContent         = open ? '-' : '+'
        closeCurrentDesc            = open ? closeDesc : null
      })
    }
  })
}
