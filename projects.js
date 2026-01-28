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

  items.forEach((item) => list.appendChild(item));

  /* ============================================================
   * 2. RANDOM WIDTH (40 → 70 by 5)
   * ============================================================ */

  const getRandomWidthConfig = () => {
    const w = window.innerWidth;

    if (w >= 992) {
      return { min: 45, max: 65, step: 5 };
    }

    if (w >= 768) {
      return { min: 65, max: 100, step: 5 };
    }

    return { min: 100, max: 100, step: 5 };
  };

  const { min, max, step } = getRandomWidthConfig();

  items.forEach((item) => {
    const steps = (max - min) / step + 1;
    const randomWidth = min + step * Math.floor(Math.random() * steps);
    item.style.width = `${randomWidth}%`;
  });
};
