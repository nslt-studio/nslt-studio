let viewportObserver = null

export function initMedia() {
  if (viewportObserver) {
    viewportObserver.disconnect()
    viewportObserver = null
  }

  // Images
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.style.opacity = '1'
    } else {
      img.addEventListener('load', () => { img.style.opacity = '1' }, { once: true })
    }
  })

  // Videos — lazy-load src on viewport enter, reveal on first frame, play/pause on viewport
  viewportObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target
      if (entry.isIntersecting) {
        if (video.dataset.src && !video.src) {
          video.src = video.dataset.src
          video.load()
        }
        video.play()
      } else {
        video.pause()
      }
    })
  }, { threshold: 0.2 })

  document.querySelectorAll('video').forEach(video => {
    const reveal = () => { video.style.opacity = '1' }

    if (video.readyState >= 2) {
      reveal()
    } else {
      video.addEventListener('loadeddata', reveal, { once: true })
    }

    viewportObserver.observe(video)
  })
}
