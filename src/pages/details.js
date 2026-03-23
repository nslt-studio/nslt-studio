import EmblaCarousel from 'embla-carousel'
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

  const embla = EmblaCarousel(viewport, { loop: true, align: 'center' })

  const prev = root.querySelector('.embla__prev')
  const next = root.querySelector('.embla__next')

  if (prev) prev.addEventListener('click', () => embla.scrollPrev())
  if (next) next.addEventListener('click', () => embla.scrollNext())

  const slides = embla.slideNodes()
  const updateActive = () => {
    const index = embla.selectedScrollSnap()
    slides.forEach((s, i) => s.classList.toggle('active', i === index))
  }
  embla.on('select', updateActive)
  updateActive()
}
