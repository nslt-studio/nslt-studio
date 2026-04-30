import Swup from 'swup'
import { initPage } from './router.js'

let swup

export function initSwup() {
  swup = new Swup({
    containers: ['#swup'],
    animationSelector: '[class*="transition-"]',
  })

  swup.hooks.on('page:view', () => {
    initPage()
  })
}

export { swup }
