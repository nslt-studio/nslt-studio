const getSwiperDirection = () => {
  return window.innerWidth >= 992 ? "horizontal" : "vertical";
};

const initWorkDetail = () => {
  const swiperEl = document.querySelector(".swiper");
  if (!swiperEl) return;

  /* ============================================================
   * 0. REMOVE WEBFLOW CONDITIONAL ELEMENTS
   * ============================================================ */

  swiperEl
    .querySelectorAll(".w-condition-invisible")
    .forEach((el) => el.remove());

  const wrapper = swiperEl.querySelector(".swiper-wrapper");
  let slides = Array.from(wrapper?.querySelectorAll(".swiper-slide") || []);

  if (!wrapper || !slides.length) return;

  /* ============================================================
   * 1. RANDOMIZE SLIDE ORDER (ONCE)
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
      slide.style.opacity = isDragging ? "0.4" : "0.2";
    });
  };

  /* ============================================================
   * 3. INIT / REINIT SWIPER
   * ============================================================ */

  let swiper = null;
  let currentDirection = getSwiperDirection();

  const initSwiper = () => {
    swiper = new Swiper(swiperEl, {
      direction: currentDirection,
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

    requestAnimationFrame(() => swiper.update());
  };

  initSwiper();

  /* ============================================================
   * 4. HANDLE RESIZE (BREAKPOINT SWITCH)
   * ============================================================ */

  const onResize = () => {
    const newDirection = getSwiperDirection();
    if (newDirection === currentDirection) return;

    currentDirection = newDirection;

    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }

    initSwiper();
  };

  window.addEventListener("resize", onResize);

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

  /* ============================================================
   * 6. CLEANUP ON PAGE LEAVE (CRUCIAL)
   * ============================================================ */

  if (window.swup) {
    swup.hooks.once("page:view", () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);

      if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }
    });
  }
};
