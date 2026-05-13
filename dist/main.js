function y(e) {
  const n = e.children.length, t = Array.from({ length: n }, (o, r) => r);
  for (let o = n - 1; o > 0; o--) {
    const r = Math.floor(Math.random() * (o + 1));
    [t[o], t[r]] = [t[r], t[o]];
  }
  [...e.children].forEach((o, r) => {
    o.style.order = t[r];
  });
}
function d(e) {
  const t = () => {
    e.forEach((r) => {
      const a = r.getBoundingClientRect();
      if (a.top >= 0) {
        r.style.opacity = "1";
        return;
      }
      const s = a.height - 120;
      if (s <= 0) {
        r.style.opacity = a.bottom <= 120 ? "0" : "1";
        return;
      }
      const l = Math.min(1, -a.top / s);
      r.style.opacity = 1 - l * l;
    });
  };
  let o = !1;
  window.addEventListener("scroll", () => {
    o || (requestAnimationFrame(() => {
      t(), o = !1;
    }), o = !0);
  }, { passive: !0 }), t();
}
function m() {
  const e = [];
  document.querySelectorAll(".work-list .work-item .work-media").forEach((n) => {
    y(n), e.push(...n.children), n.querySelectorAll("img").forEach((t) => {
      t.style.opacity = "0", t.style.transition = "opacity 0.6s ease-in-out";
      const o = () => {
        t.style.opacity = "1";
      };
      t.complete && t.naturalWidth ? o() : t.addEventListener("load", o, { once: !0 });
    }), n.querySelectorAll("video").forEach((t) => {
      t.setAttribute("playsinline", ""), t.muted = !0, t.style.opacity = "0", t.style.transition = "opacity 0.6s ease-in-out";
      const o = () => {
        t.style.opacity = "1";
      };
      t.readyState >= 2 ? o() : t.addEventListener("loadeddata", o, { once: !0 }), new IntersectionObserver(([r]) => {
        r.isIntersecting ? t.play().catch(() => {
        }) : t.pause();
      }, { threshold: 0 }).observe(t);
    });
  }), e.length && d(e);
}
let u, c, i;
function f() {
  clearInterval(u);
  const e = document.querySelectorAll('[aria-label="time"]');
  if (!e.length) return;
  const n = () => {
    const t = (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !1
    });
    e.forEach((o) => o.textContent = `${t} CET`);
  };
  n(), u = setInterval(n, 1e3);
}
function p() {
  const e = document.querySelectorAll('[aria-label="freelance"]');
  if (!e.length) return;
  cancelAnimationFrame(c), i = null;
  const n = 600, t = (o) => {
    i || (i = o);
    const r = (o - i) % (n * 2) / n, a = r < 1 ? 1 - r : r - 1;
    e.forEach((s) => s.style.opacity = a), c = requestAnimationFrame(t);
  };
  e.forEach((o) => o.style.opacity = "1"), c = requestAnimationFrame(t);
}
function h() {
  const e = {
    delay: 600,
    rotate: 600,
    holdRotate: 300,
    move: 400,
    loaderFade: 400
  }, n = document.querySelector(".loader"), t = n == null ? void 0 : n.querySelector(".circle-inner");
  !n || !t || (document.body.style.overflow = "hidden", t.style.transition = "none", t.style.transformOrigin = "center center", t.style.right = "50%", t.style.top = "50%", t.style.transform = "translate(50%, -50%) rotate(0deg)", t.getBoundingClientRect(), t.style.transition = `transform ${e.rotate}ms ease`, setTimeout(() => {
    t.style.transform = "translate(50%, -50%) rotate(360deg)", setTimeout(() => {
      t.style.transition = `right ${e.move}ms ease, top ${e.move}ms ease, transform ${e.move}ms ease`, t.style.right = "0%", t.style.transform = "translate(0%, -50%) rotate(360deg)", setTimeout(() => {
        t.style.top = "0%", t.style.transform = "translate(0%, 0%) rotate(360deg)", setTimeout(() => {
          document.body.style.overflow = "", n.style.transition = `opacity ${e.loaderFade}ms ease`, n.style.opacity = "0", setTimeout(() => n.remove(), e.loaderFade);
        }, e.move);
      }, e.move);
    }, e.rotate + e.holdRotate);
  }, e.delay));
}
function E() {
  const e = document.querySelector("#mode");
  if (!e) return;
  let n = localStorage.getItem("mode") || "white";
  const t = (o) => {
    document.documentElement.classList.remove("mode-white", "mode-black"), document.documentElement.classList.add(`mode-${o}`), localStorage.setItem("mode", o), n = o;
  };
  t(n), e.addEventListener("click", () => {
    t(n === "black" ? "white" : "black");
  });
}
function v() {
  const e = document.querySelector(".inactive"), n = document.querySelector(".overlay");
  if (!e) return;
  const t = e.querySelector("video");
  let o;
  if (t) {
    t.setAttribute("playsinline", ""), t.muted = !0, t.style.opacity = "0", t.style.transition = "opacity 0.6s ease-in-out";
    const l = () => {
      t.style.opacity = "1";
    };
    t.readyState >= 2 ? l() : t.addEventListener("loadeddata", l, { once: !0 });
  }
  const r = () => {
    e.style.opacity = "1", e.style.pointerEvents = "auto", n && (n.style.opacity = "1", n.style.pointerEvents = "auto"), t == null || t.play().catch(() => {
    });
  }, a = () => {
    e.style.opacity = "0", e.style.pointerEvents = "none", n && (n.style.opacity = "0", n.style.pointerEvents = "none"), t == null || t.pause();
  }, s = () => {
    a(), clearTimeout(o), o = setTimeout(r, 15e3);
  };
  ["mousemove", "scroll", "touchstart"].forEach(
    (l) => window.addEventListener(l, s, { passive: !0 })
  ), s();
}
function S() {
  document.querySelectorAll(".work-list .work-item").forEach((t, o) => {
    const r = t.querySelector("p[data-index]");
    r && (r.textContent = String(o + 1).padStart(3, "0"));
  }), E(), h(), m(), f(), p(), v();
  const e = document.querySelector("#top"), n = document.querySelector(".about");
  e && n && (new IntersectionObserver(([t]) => {
    const o = t.boundingClientRect.bottom <= 0;
    e.style.transform = o ? "translate(-50%, 0%)" : "translate(-50%, 100%)", e.style.opacity = o ? "1" : "0";
  }).observe(n), e.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })));
}
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
S();
