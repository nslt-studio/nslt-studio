import { initHome } from './src/pages/home.js'
import { initVimeo } from './src/media.js'
import { initClock } from './src/clock.js'
import { initInfo } from './src/info.js'
import { initInquiry } from './src/inquiry.js'

history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

initClock()
initVimeo()
initHome()
initInfo()
initInquiry()
