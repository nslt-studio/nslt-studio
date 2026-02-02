"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ── Scroll to top (disable browser scroll restoration) ────── */

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  requestAnimationFrame(() => {
    window.scrollTo(0, 0);

    const page = document.querySelector(".page-wrapper");
    if (page) page.style.opacity = "1";
  });

  /* ── Time (Paris) & Year ───────────────────────────────────── */

  (() => {
    const timeEls = document.querySelectorAll("[data-time]");
    const yearEls = document.querySelectorAll("[data-year]");

    if (timeEls.length) {
      const formatter = new Intl.DateTimeFormat("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const updateTime = () => {
        const value = formatter.format(new Date()) + " CET";
        timeEls.forEach((el) => (el.textContent = value));
      };

      updateTime();
      setInterval(updateTime, 1000);
    }

    if (yearEls.length) {
      const year = "\u00A9" + new Date().getFullYear();
      yearEls.forEach((el) => (el.textContent = year));
    }
  })();

  /* ── Mirror scroll (window -> #mirror) ─────────────────────── */

  (() => {
    const mirror = document.querySelector("#mirror");
    if (!mirror) return;

    let latestScroll = 0;
    let ticking = false;

    const update = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const mirrorMax = mirror.scrollHeight - mirror.clientHeight || 1;
      mirror.scrollTop = (latestScroll / docHeight) * mirrorMax;
      ticking = false;
    };

    const onScroll = () => {
      latestScroll = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ── Profile scroll animation (nav <-> profile-nslt) ───────── */

  (() => {
    const nav = document.querySelector("#nav-nslt");
    const profile = document.querySelector("#profile-nslt");
    if (!nav || !profile) return;

    nav.classList.add("hidden");
    profile.classList.remove("hidden");

    let prevDelta = null;

    const checkCrossing = () => {
      const delta =
        profile.getBoundingClientRect().top - nav.getBoundingClientRect().top;

      if (prevDelta !== null) {
        if ((prevDelta > 0 && delta <= 0) || (prevDelta < 0 && delta >= 0)) {
          nav.classList.toggle("hidden");
          profile.classList.toggle("hidden");
        }
      }

      prevDelta = delta;
      requestAnimationFrame(checkCrossing);
    };

    requestAnimationFrame(checkCrossing);
  })();

  /* ── .pb-end dynamic padding ───────────────────────────────── */

  (() => {
    const pbEnds = document.querySelectorAll(".pb-end");
    if (!pbEnds.length) return;

    const applyPadding = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      const target = vh * 0.25;

      pbEnds.forEach((el) => {
        el.style.paddingBottom = Math.max(0, target - el.offsetHeight) + "px";
      });
    };

    applyPadding();
    window.addEventListener("resize", applyPadding);
  })();

  /* ── Analog clock (smooth seconds) ─────────────────────────── */

  (() => {
    const clocks = document.querySelectorAll(".clock");
    if (!clocks.length) return;

    const tick = () => {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      clocks.forEach((clock) => {
        const r = clock.clientWidth / 2;

        const setHand = (sel, deg, mul) => {
          const el = clock.querySelector(sel);
          if (!el) return;
          el.style.transform =
            "translate(-50%,-50%) rotate(" +
            deg +
            "deg) translateY(-" +
            r * mul +
            "px)";
        };

        setHand(".hand.hour", h * 30, 0.2);
        setHand(".hand.minute", m * 6, 0.4);
        setHand(".hand.second", s * 6, 0.8);
      });

      requestAnimationFrame(tick);
    };

    tick();
  })();

  /* ── Text scramble on viewport (h1, h2) ────────────────────── */

  (() => {
    const CHARS =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};:<>?,./";
    const titles = document.querySelectorAll("h1, h2");
    if (!titles.length) return;

    const splitText = (el) => {
      const text = el.textContent;
      el.textContent = "";

      [...text].forEach((char) => {
        const span = document.createElement("span");
        span.className = "scramble-char";
        span.dataset.char = char;
        span.textContent = char === " " ? " " : "";
        el.appendChild(span);
      });
    };

    const scramble = (el) => {
      el.querySelectorAll(".scramble-char").forEach((span, i) => {
        const finalChar = span.dataset.char;
        if (finalChar === " ") return;

        setTimeout(() => {
          const start = performance.now();
          const duration = 400;

          const frame = (now) => {
            if (now - start < duration) {
              span.textContent =
                CHARS[Math.floor(Math.random() * CHARS.length)];
              requestAnimationFrame(frame);
            } else {
              span.textContent = finalChar;
            }
          };

          requestAnimationFrame(frame);
        }, i * 40);
      });
    };

    titles.forEach(splitText);

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          scramble(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    titles.forEach((t) => observer.observe(t));
  })();
});
