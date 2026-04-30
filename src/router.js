import { initHome } from './pages/home.js'
import { initDetails } from './pages/details.js'

export function initPage() {
  const namespace = document.querySelector('[data-swup]')?.dataset.swup

  switch (namespace) {
    case 'home':    initHome();    break
    case 'details': initDetails(); break
  }
}
