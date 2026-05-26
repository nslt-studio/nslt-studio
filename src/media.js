export async function initVimeo() {
  const TOKEN        = 'c9496452bd623b32565ddf7e6973d68c'
  const RENDITION    = window.innerWidth >= 768 ? '720p' : '540p'
  const TARGET_WIDTH = 200

  const items = document.querySelectorAll('.work-video[vimeo-id]')
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
