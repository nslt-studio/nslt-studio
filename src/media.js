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

  // Videos — reveal on first frame, play/pause on viewport
  viewportObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.isIntersecting ? entry.target.play() : entry.target.pause()
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
