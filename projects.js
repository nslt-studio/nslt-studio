const initWork = () => {
  /* ============================================================
   * 0. REMOVE CONDITIONAL ELEMENTS
   * ============================================================ */

  document
    .querySelectorAll(".w-condition-invisible")
    .forEach((el) => el.remove());

  /* ============================================================
   * 1. SHUFFLE ORDER (Fisher–Yates)
   * ============================================================ */

  const list = document.querySelector(".work-list");
  if (!list) return;

  const items = Array.from(list.querySelectorAll(".work-item"));
  if (!items.length) return;

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  // réinjecte dans le DOM dans le nouvel ordre
  items.forEach((item) => list.appendChild(item));
};
