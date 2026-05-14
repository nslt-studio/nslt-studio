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

export async function initVimeo() {
  const TOKEN        = 'c9496452bd623b32565ddf7e6973d68c'
  const RENDITION    = window.innerWidth >= 768 ? '1080p' : '720p'
  const TARGET_WIDTH = window.innerWidth >= 768 ? 960 : 640

  const items = document.querySelectorAll('.work-video-inner[vimeo-id]')
  if (!items.length) return

  const ids = [...new Set([...items].map(el => el.getAttribute('vimeo-id')).filter(Boolean))]

  const results = await Promise.allSettled(
    ids.map(id =>
      fetch(`https://api.vimeo.com/videos/${id}?fields=pictures,files`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      })
      .then(r => r.ok ? r.json().then(data => ({ id, data })) : { id, data: {} })
      .catch(() => ({ id, data: {} }))
    )
  )

  const cache = {}
  results.forEach(result => {
    if (result.status !== 'fulfilled') return
    const { id, data } = result.value
    const sizes    = data.pictures?.sizes ?? []
    const bestSize = sizes.find(s => s.width >= TARGET_WIDTH) ?? sizes[sizes.length - 1]
    const files    = data.files ?? []
    const file     = files.find(f => f.rendition === RENDITION)
                  ?? files.find(f => f.quality === 'hd')
                  ?? files[0]
    cache[id] = { poster: bestSize?.link ?? '', mp4: file?.link ?? '' }
  })

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const wrapper = entry.target
      const assets  = cache[wrapper.getAttribute('vimeo-id')]
      if (!assets) return

      const img = wrapper.querySelector('.video-poster')
      if (img && assets.poster) {
        img.style.opacity   = '0'
        img.style.transition = 'opacity 0.6s ease-in-out'
        img.src = assets.poster
        const show = () => { img.style.opacity = '1' }
        img.complete && img.naturalWidth ? show() : img.addEventListener('load', show, { once: true })
      }

      const video  = wrapper.querySelector('video')
      const source = video?.querySelector('source[data-src]')
      if (source && assets.mp4 && !source.src) {
        video.style.opacity   = '0'
        video.style.transition = 'opacity 0.6s ease-in-out'
        source.src = assets.mp4
        video.load()
        const reveal = () => { video.style.opacity = '1' }
        video.readyState >= 2 ? reveal() : video.addEventListener('loadeddata', reveal, { once: true })
        new IntersectionObserver(([e]) => {
          e.isIntersecting ? video.play().catch(() => {}) : video.pause()
        }, { threshold: 0 }).observe(video)
      }

      obs.unobserve(wrapper)
    })
  }, { rootMargin: '300px' })

  items.forEach(el => observer.observe(el))
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
      video.setAttribute('playsinline', '')
      video.muted = true
      video.style.opacity = '0'
      video.style.transition = 'opacity 0.6s ease-in-out'

      const reveal = () => { video.style.opacity = '1' }
      video.readyState >= 2 ? reveal() : video.addEventListener('loadeddata', reveal, { once: true })

      new IntersectionObserver(([entry]) => {
        entry.isIntersecting ? video.play().catch(() => {}) : video.pause()
      }, { threshold: 0 }).observe(video)
    })
  })

  if (allItems.length) initScrollFade(allItems)
}
