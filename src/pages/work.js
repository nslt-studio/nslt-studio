export function initWork() {
  const list  = document.querySelector('.work-list')
  const items = list ? [...list.querySelectorAll('.work-item')] : []

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]]
  }
  items.forEach(item => list.appendChild(item))

  const counter = document.getElementById('projectsCounter')
  if (counter) counter.textContent = `(${items.length})`
}
