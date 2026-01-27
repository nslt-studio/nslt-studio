const initWorkDetail = () => {
  const swiperEl = document.querySelector(".swiper");
  if (!swiperEl) return;

  /* ============================================================
   * 0. REMOVE WEBFLOW CONDITIONAL ELEMENTS (CRUCIAL)
   * ============================================================ */

  swiperEl
    .querySelectorAll(".w-condition-invisible")
    .forEach((el) => el.remove());

  const wrapper = swiperEl.querySelector(".swiper-wrapper");
  let slides = Array.from(wrapper?.querySelectorAll(".swiper-slide") || []);

  if (!wrapper || !slides.length) return;

  /* ============================================================
   * 1. RANDOMIZE SLIDE ORDER
   * ============================================================ */

  for (let i = slides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slides[i], slides[j]] = [slides[j], slides[i]];
  }

  slides.forEach((slide) => wrapper.appendChild(slide));

  /* ============================================================
   * 2. DRAGGING STATE
   * ============================================================ */

  const setDraggingState = (isDragging) => {
    wrapper.style.cursor = isDragging ? "grabbing" : "grab";
    slides.forEach((slide) => {
      slide.style.opacity = isDragging ? "0.2" : "0";
    });
  };

  /* ============================================================
   * 3. INIT SWIPER (AFTER DOM IS CLEAN)
   * ============================================================ */

  const swiper = new Swiper(swiperEl, {
    slidesPerView: "auto",
    centeredSlides: true,
    speed: 225,
    loop: true,
    keyboard: true,
    navigation: {
      nextEl: ".swiper-next",
      prevEl: ".swiper-prev",
    },
    on: {
      touchStart: () => setDraggingState(true),
      touchEnd: () => setDraggingState(false),
      sliderMove: () => setDraggingState(true),
      transitionEnd: () => setDraggingState(false),
    },
  });

  /* ============================================================
   * 4. FORCE FINAL CALCULATION
   * ============================================================ */

  requestAnimationFrame(() => {
    swiper.update();
  });

  /* ============================================================
   * 5. ESC KEY SUPPORT → TRIGGER #close
   * ============================================================ */

  const closeLink = document.querySelector("#close");
  if (!closeLink) return;

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeLink.click();
    }
  };

  document.addEventListener("keydown", onKeyDown);

  if (window.swup) {
    swup.hooks.once("page:view", () => {
      document.removeEventListener("keydown", onKeyDown);
    });
  }
};
