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
    const cursor = item.querySelector('.cursor')

    const updateDots = (index) => {
      dots.forEach((di, i) => di.querySelector('.dot')?.classList.toggle('active', i === index))
    }

    // --- cursor helpers ---
    function dotCenterX(di) {
      if (!cursor) return 0
      const pr = (cursor.offsetParent || cursor.parentElement).getBoundingClientRect()
      const dr = di.getBoundingClientRect()
      return dr.left - pr.left + dr.width / 2
    }

    function moveCursorTo(di, animated = true) {
      if (!cursor) return
      cursor.style.transition = animated ? '' : 'none'
      cursor.style.left = dotCenterX(di) + 'px'
      // top is never touched
    }

    function nearestDotByX(x) {
      return dots.reduce((best, di) => {
        const d = Math.abs(x - dotCenterX(di))
        return d < best.dist ? { di, dist: d } : best
      }, { di: dots[0], dist: Infinity }).di
    }

    // click on dot-inner
    dots.forEach((di, i) => {
      di.addEventListener('click', () => {
        moveCursorTo(di)
        embla.scrollTo(i)
      })
    })

    // drag cursor — horizontal only, clamped to first/last dot
    if (cursor) {
      let lastIndex = -1

      const getRange = () => ({
        pr:   (cursor.offsetParent || cursor.parentElement).getBoundingClientRect(),
        minX: dotCenterX(dots[0]),
        maxX: dotCenterX(dots[dots.length - 1]),
      })

      const onDragStart = () => {
        cursor.classList.add('is-dragging')
        lastIndex = current
      }

      const onDragMove = (clientX) => {
        const { pr, minX, maxX } = getRange()
        const x = Math.min(maxX, Math.max(minX, clientX - pr.left))
        cursor.style.left = x + 'px'
        const di = nearestDotByX(x)
        const idx = dots.indexOf(di)
        if (idx !== lastIndex) {
          lastIndex = idx
          updateDots(idx)
          embla.scrollTo(idx)
        }
      }

      const onDragEnd = (clientX) => {
        cursor.classList.remove('is-dragging')
        const { pr, minX, maxX } = getRange()
        const x = Math.min(maxX, Math.max(minX, clientX - pr.left))
        moveCursorTo(nearestDotByX(x))
        embla.scrollTo(dots.indexOf(nearestDotByX(x)))
      }

      // mouse (pointer capture)
      cursor.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse') return
        cursor.setPointerCapture(e.pointerId)
        onDragStart()
        e.preventDefault()
      })
      cursor.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse' || !cursor.hasPointerCapture(e.pointerId)) return
        onDragMove(e.clientX)
      })
      cursor.addEventListener('pointerup', e => {
        if (e.pointerType !== 'mouse' || !cursor.hasPointerCapture(e.pointerId)) return
        onDragEnd(e.clientX)
      })

      // touch (mobile / tablet) — passive:false pour stopper le scroll de la page
      cursor.addEventListener('touchstart', e => {
        e.preventDefault()
        onDragStart()
      }, { passive: false })
      cursor.addEventListener('touchmove', e => {
        e.preventDefault()
        onDragMove(e.touches[0].clientX)
      }, { passive: false })
      cursor.addEventListener('touchend', e => {
        onDragEnd(e.changedTouches[0].clientX)
      })
    }

    let current = 0
    activateSlide(slides[0])
    updateDots(0)

    embla.on('select', () => {
      deactivateSlide(slides[current])
      current = embla.selectedScrollSnap()
      activateSlide(slides[current])
      updateDots(current)
      moveCursorTo(dots[current])
    })

    item.querySelector('.embla__prev')?.addEventListener('click', () => embla.scrollPrev())
    item.querySelector('.embla__next')?.addEventListener('click', () => embla.scrollNext())

  })
}
