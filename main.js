import { initSwup } from './src/swup.js'
import { initNav } from './src/nav.js'
import { initPage } from './src/router.js'
import { initMedia } from './src/media.js'
import { initButtons } from './src/buttons.js'

// Set initial body class before anything else (handles direct landing on details)
const initialNs = document.querySelector('[data-swup]')?.dataset.swup
document.body.classList.toggle('on-details', initialNs === 'details')

initSwup()
initNav()
initPage()
initMedia()
initButtons()
