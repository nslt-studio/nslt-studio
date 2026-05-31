import EmblaCarousel from 'embla-carousel'

const STAGGER = 100

function activateSlide(slide) {
  const img = slide.querySelector('img')
  if (img) {
    const show = () => { img.style.opacity = '1' }
    img.complete && img.naturalWidth ? show() : img.addEventListener('load', show, { once: true })
  }

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
  if (header) header.style.opacity = '1'

  document.querySelectorAll('.work-list .work-item').forEach((item, i) => {
    setTimeout(() => {
      item.style.opacity   = '1'
      item.style.transform = 'translateY(0)'
    }, STAGGER * (i + 1))
  })

  document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('click', () => item.scrollIntoView({ behavior: 'smooth', block: 'center' }))

    const viewport = item.querySelector('.embla__viewport')
    if (!viewport) return

    const embla = EmblaCarousel(viewport, { loop: true, watchDrag: false, duration: 0 })
    const slides = embla.slideNodes()
    if (!slides.length) return

    const dots = [...item.querySelectorAll('.dot-inner')]

    const updateDots = (index) => {
      dots.forEach((di, i) => di.querySelector('.dot')?.classList.toggle('active', i === index))
    }

    dots.forEach((di, i) => di.addEventListener('click', () => embla.scrollTo(i)))

    let current = 0
    activateSlide(slides[0])
    updateDots(0)

    embla.on('select', () => {
      deactivateSlide(slides[current])
      current = embla.selectedScrollSnap()
      activateSlide(slides[current])
      updateDots(current)
    })

    item.querySelector('.embla__prev')?.addEventListener('click', () => embla.scrollPrev())
    item.querySelector('.embla__next')?.addEventListener('click', () => embla.scrollNext())

  })
}
