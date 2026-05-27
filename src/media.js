const CACHE_KEY = 'vimeo_cache'
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return {}
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(CACHE_KEY); return {} }
    return data
  } catch { return {} }
}

function writeCache(data) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })) } catch {}
}

export async function initVimeo() {
  const TOKEN        = 'c9496452bd623b32565ddf7e6973d68c'
  const RENDITION    = window.innerWidth >= 768 ? '1080p' : '720p'
  const TARGET_WIDTH = 200

  const items = document.querySelectorAll('.work-video[vimeo-id]')
  if (!items.length) return

  const ids = [...new Set([...items].map(el => el.getAttribute('vimeo-id')).filter(Boolean))]

  const stored = readCache()
  const missing = ids.filter(id => !stored[id])

  if (missing.length) {
    const results = await Promise.allSettled(
      missing.map(id =>
        fetch(`https://api.vimeo.com/videos/${id}?fields=pictures,files`, {
          headers: { Authorization: `Bearer ${TOKEN}` }
        })
        .then(r => r.ok ? r.json().then(data => ({ id, data })) : { id, data: {} })
        .catch(() => ({ id, data: {} }))
      )
    )

    results.forEach(result => {
      if (result.status !== 'fulfilled') return
      const { id, data } = result.value
      const sizes    = data.pictures?.sizes ?? []
      const bestSize = sizes.find(s => s.width >= TARGET_WIDTH) ?? sizes[sizes.length - 1]
      const files    = data.files ?? []
      const file     = files.find(f => f.rendition === RENDITION)
                    ?? files.find(f => f.quality === 'hd')
                    ?? files[0]
      stored[id] = { poster: bestSize?.link ?? '', mp4: file?.link ?? '' }
    })

    writeCache(stored)
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const wrapper = entry.target
      const assets  = stored[wrapper.getAttribute('vimeo-id')]
      if (!assets) return

      const img = wrapper.querySelector('.video-poster')
      if (img && assets.poster) {
        img.src = assets.poster
        const show = () => { img.style.opacity = '1' }
        img.complete && img.naturalWidth ? show() : img.addEventListener('load', show, { once: true })
      }

      const video  = wrapper.querySelector('video')
      const source = video?.querySelector('source[data-src]')
      if (source && assets.mp4 && !source.src) {
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
