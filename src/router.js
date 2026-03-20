import { initHome } from './pages/home.js'
import { initWork } from './pages/work.js'
import { initInfo } from './pages/info.js'
import { initDetails } from './pages/details.js'

export function initPage() {
  const namespace = document.querySelector('[data-swup]')?.dataset.swup

  switch (namespace) {
    case 'home':    initHome();    break
    case 'work':    initWork();    break
    case 'info':    initInfo();    break
    case 'details': initDetails(); break
  }
}
