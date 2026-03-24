import EmblaCarousel from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import { previousUrl } from '../state.js'

export function initDetails() {
  const backLink = document.getElementById('backLink')
  if (backLink) backLink.href = previousUrl

  initSlider()
}

function initSlider() {
  const root     = document.querySelector('.embla')
  const viewport = document.querySelector('.embla__viewport')
  if (!root || !viewport) return

  const container = viewport.querySelector('.embla__container') || viewport.firstElementChild
  if (container) {
    const slides = [...container.children]
    for (let i = slides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      container.appendChild(slides[j])
      slides.splice(j, 1)
    }
  }

  const embla = EmblaCarousel(viewport, { loop: true, dragFree: true }, [AutoScroll({ speed: 0.5, startDelay: 300, stopOnInteraction: true })])

  embla.on('pointerUp', () => {
    let timer = null
    const onScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        embla.off('scroll', onScroll)
        embla.plugins().autoScroll.play()
      }, 50)
    }
    embla.on('scroll', onScroll)
  })
}
