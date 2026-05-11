function shuffle(parent) {
  const n = parent.children.length
  const orders = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [orders[i], orders[j]] = [orders[j], orders[i]]
  }
  ;[...parent.children].forEach((el, i) => { el.style.order = orders[i] })
}

function initScrollFade(items) {
  const BOTTOM_OFFSET = 120

  const update = () => {
    items.forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.top >= 0) {
        el.style.opacity = '1'
        return
      }
      const fadeDistance = rect.height - BOTTOM_OFFSET
      if (fadeDistance <= 0) {
        el.style.opacity = rect.bottom <= BOTTOM_OFFSET ? '0' : '1'
        return
      }
      const t = Math.min(1, -rect.top / fadeDistance)
      el.style.opacity = 1 - (t * t)
    })
  }

  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false })
      ticking = true
    }
  }, { passive: true })

  update()
}

export function initMedia() {
  const allItems = []

  document.querySelectorAll('.work-list .work-item .work-media').forEach(media => {
    shuffle(media)

    allItems.push(...media.children)

    media.querySelectorAll('img').forEach(img => {
      img.style.opacity = '0'
      img.style.transition = 'opacity 0.6s ease-in-out'
      const show = () => { img.style.opacity = '1' }
      img.complete && img.naturalWidth ? show() : img.addEventListener('load', show, { once: true })
    })

    media.querySelectorAll('video').forEach(video => {
      video.style.opacity = '0'
      video.style.transition = 'opacity 0.6s ease-in-out'
      requestAnimationFrame(() => { video.style.opacity = '1' })

      new IntersectionObserver(([entry]) => {
        entry.isIntersecting ? video.play().catch(() => {}) : video.pause()
      }, { threshold: 0 }).observe(video)
    })
  })

  if (allItems.length) initScrollFade(allItems)
}
