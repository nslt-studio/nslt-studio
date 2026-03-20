import { previousUrl } from '../state.js'

export function initDetails() {
  const backLink = document.getElementById('backLink')
  if (backLink) backLink.href = previousUrl
}
