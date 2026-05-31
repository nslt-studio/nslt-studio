export function initInquiry() {
  const btn      = document.querySelector('#inquiryButton')
  const closeBtn = document.querySelector('#closeInquiry')
  const overlay  = document.querySelector('.overlay')
  const form     = document.querySelector('.form')
  if (!btn || !overlay || !form) return

  let open = false

  const openPanel = () => {
    open = true
    document.body.style.overflow = 'hidden'
    overlay.style.opacity        = '1'
    overlay.style.pointerEvents  = 'auto'
    form.style.transform         = 'translateX(0%)'
    form.style.pointerEvents     = 'auto'
  }

  const closePanel = () => {
    open = false
    document.body.style.overflow = ''
    overlay.style.opacity        = '0'
    overlay.style.pointerEvents  = 'none'
    form.style.transform         = 'translateX(100%)'
    form.style.pointerEvents     = 'none'
  }

  form.addEventListener('click', e => {
    if (e.target.matches('input[type="checkbox"]')) return
    const option = e.target.closest('.option')
    if (!option) return
    e.preventDefault()
    const checkbox = option.querySelector('input[type="checkbox"]')
    const group = option.dataset.radio

    if (group) {
      const isChecked = option.classList.contains('checked')
      form.querySelectorAll(`.option[data-radio="${group}"]`).forEach(opt => {
        const cb = opt.querySelector('input[type="checkbox"]')
        if (cb) cb.checked = false
        opt.classList.remove('checked')
      })
      if (!isChecked) {
        if (checkbox) checkbox.checked = true
        option.classList.add('checked')
      }
    } else {
      if (checkbox) checkbox.checked = !checkbox.checked
      option.classList.toggle('checked')
    }
  })

  btn.addEventListener('click', openPanel)
  closeBtn?.addEventListener('click', closePanel)

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) closePanel()
  })

  document.addEventListener('click', e => {
    if (!open) return
    if (!form.contains(e.target) && e.target !== btn) closePanel()
  }, true)
}
