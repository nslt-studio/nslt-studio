/* ============================================================
 * INIT
 * ============================================================ */

const swup = new Swup();

const getNamespace = () => document.querySelector("#swup")?.dataset.namespace;

/* ============================================================
 * LOGO WIDTH (RESPONSIVE)
 * ============================================================ */

const getLogoWidthForViewport = () => {
  const w = window.innerWidth;

  if (w >= 992) return "16.6667%";
  if (w >= 768) return "33.3334%";
  return "60%";
};

/* ============================================================
 * W--CURRENT (NAV + LOGO)
 * ============================================================ */

const setCurrentNav = (target) => {
  // nav links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("w--current"));

  const activeNav = document.querySelector(`.nav-link#${target}`);
  if (activeNav) activeNav.classList.add("w--current");

  // logo : actif uniquement sur profile
  const logo = document.querySelector(".logo-link");
  if (!logo) return;

  if (target === "profile") {
    logo.classList.add("w--current");
  } else {
    logo.classList.remove("w--current");
  }
};

/* ============================================================
 * LOGO WIDTH CONTROL
 * ============================================================ */

// état final (sécurité après navigation)
const updateLogoWidth = () => {
  const logo = document.querySelector(".logo-link");
  const namespace = getNamespace();

  if (!logo || !namespace) return;

  // work + details = responsive width
  if (namespace === "work" || namespace === "details") {
    logo.style.width = getLogoWidthForViewport();
  } else {
    // profile
    logo.style.width = "100%";
  }
};

// animation immédiate au clic
const animateLogoOnClick = (targetNamespace) => {
  const logo = document.querySelector(".logo-link");
  if (!logo) return;

  if (targetNamespace === "work") {
    logo.style.width = getLogoWidthForViewport();
  }

  if (targetNamespace === "profile") {
    logo.style.width = "100%";
  }
};

/* ============================================================
 * UI VISIBILITY (LOGO + NAV) — INLINE ONLY
 * ============================================================ */

const setChromeVisibility = (visible) => {
  const logo = document.querySelector(".logo-link");
  const nav = document.querySelector(".nav");

  if (!logo || !nav) return;

  const opacity = visible ? "1" : "0";
  const pointerEvents = visible ? "auto" : "none";

  logo.style.opacity = opacity;
  logo.style.pointerEvents = pointerEvents;

  nav.style.opacity = opacity;
  nav.style.pointerEvents = pointerEvents;
};

/* ============================================================
 * DETAILS LINK DETECTION
 * ============================================================ */

const isDetailsLink = (link) => {
  return (
    link.dataset.namespace === "details" ||
    link.classList.contains("work-link") ||
    link.getAttribute("href")?.includes("/work/")
  );
};

/* ============================================================
 * CLICK HANDLER (NAV + LOGO + DETAILS)
 * ============================================================ */

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  // ignore external / new tab
  if (!link.href || link.target === "_blank") return;

  const url = new URL(link.href, window.location.origin);
  if (url.origin !== window.location.origin) return;

  /* ---------- DETAILS ---------- */
  if (isDetailsLink(link)) {
    setChromeVisibility(false);
    return; // Swup gère la navigation
  }

  /* ---------- WORK ---------- */
  if (link.matches(".nav-link#work")) {
    setCurrentNav("work");
    animateLogoOnClick("work");
    setChromeVisibility(true);
  }

  /* ---------- PROFILE ---------- */
  if (link.matches(".nav-link#profile") || link.matches(".logo-link")) {
    setCurrentNav("profile");
    animateLogoOnClick("profile");
    setChromeVisibility(true);
  }
});

/* ============================================================
 * PAGE INIT (SYNC AFTER SWUP)
 * ============================================================ */

const initPage = () => {
  const namespace = getNamespace();

  /* ---------- UI VISIBILITY ---------- */
  if (namespace === "details") {
    setChromeVisibility(false);
  } else {
    setChromeVisibility(true);
  }

  /* ---------- NAV STATE ---------- */
  if (namespace === "work") {
    setCurrentNav("work");
  } else {
    setCurrentNav("profile");
  }

  updateLogoWidth();

  /* ---------- PAGE-SPECIFIC INITS ---------- */
  if (namespace === "work") {
    initWork();
    initGlobal();
  }

  if (namespace === "profile") {
    initGlobal();
  }

  if (namespace === "details") {
    initWorkDetail();
    initGlobal();
  }
};

/* ============================================================
 * RESIZE SYNC
 * ============================================================ */

window.addEventListener("resize", () => {
  const namespace = getNamespace();
  if (namespace === "work" || namespace === "details") {
    updateLogoWidth();
  }
});

/* ============================================================
 * SWUP HOOKS
 * ============================================================ */

swup.hooks.on("page:view", () => {
  initPage();
});

// first load
initPage();
