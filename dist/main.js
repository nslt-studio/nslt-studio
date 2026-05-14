function S(e) {
  const n = e.children.length, t = Array.from({ length: n }, (o, r) => r);
  for (let o = n - 1; o > 0; o--) {
    const r = Math.floor(Math.random() * (o + 1));
    [t[o], t[r]] = [t[r], t[o]];
  }
  [...e.children].forEach((o, r) => {
    o.style.order = t[r];
  });
}
function b(e) {
  const t = () => {
    e.forEach((r) => {
      const l = r.getBoundingClientRect();
      if (l.top >= 0) {
        r.style.opacity = "1";
        return;
      }
      const d = l.height - 120;
      if (d <= 0) {
        r.style.opacity = l.bottom <= 120 ? "0" : "1";
        return;
      }
      const u = Math.min(1, -l.top / d);
      r.style.opacity = 1 - u * u;
    });
  };
  let o = !1;
  window.addEventListener("scroll", () => {
    o || (requestAnimationFrame(() => {
      t(), o = !1;
    }), o = !0);
  }, { passive: !0 }), t();
}
async function T() {
  const e = "c9496452bd623b32565ddf7e6973d68c", n = window.innerWidth >= 768 ? "1080p" : "720p", t = window.innerWidth >= 768 ? 960 : 640, o = document.querySelectorAll(".work-video-inner[vimeo-id]");
  if (!o.length) return;
  const r = [...new Set([...o].map((a) => a.getAttribute("vimeo-id")).filter(Boolean))], l = await Promise.allSettled(
    r.map(
      (a) => fetch(`https://api.vimeo.com/videos/${a}?fields=pictures,files`, {
        headers: { Authorization: `Bearer ${e}` }
      }).then((p) => p.ok ? p.json().then((f) => ({ id: a, data: f })) : { id: a, data: {} }).catch(() => ({ id: a, data: {} }))
    )
  ), d = {};
  l.forEach((a) => {
    var h;
    if (a.status !== "fulfilled") return;
    const { id: p, data: f } = a.value, m = ((h = f.pictures) == null ? void 0 : h.sizes) ?? [], y = m.find((c) => c.width >= t) ?? m[m.length - 1], i = f.files ?? [], s = i.find((c) => c.rendition === n) ?? i.find((c) => c.quality === "hd") ?? i[0];
    d[p] = { poster: (y == null ? void 0 : y.link) ?? "", mp4: (s == null ? void 0 : s.link) ?? "" };
  });
  const u = new IntersectionObserver((a, p) => {
    a.forEach((f) => {
      if (!f.isIntersecting) return;
      const m = f.target, y = d[m.getAttribute("vimeo-id")];
      if (!y) return;
      const i = m.querySelector(".video-poster");
      if (i && y.poster) {
        i.style.opacity = "0", i.style.transition = "opacity 0.6s ease-in-out", i.src = y.poster;
        const c = () => {
          i.style.opacity = "1";
        };
        i.complete && i.naturalWidth ? c() : i.addEventListener("load", c, { once: !0 });
      }
      const s = m.querySelector("video"), h = s == null ? void 0 : s.querySelector("source[data-src]");
      if (h && y.mp4 && !h.src) {
        s.style.opacity = "0", s.style.transition = "opacity 0.6s ease-in-out", h.src = y.mp4, s.load();
        const c = () => {
          s.style.opacity = "1";
        };
        s.readyState >= 2 ? c() : s.addEventListener("loadeddata", c, { once: !0 }), new IntersectionObserver(([g]) => {
          g.isIntersecting ? s.play().catch(() => {
          }) : s.pause();
        }, { threshold: 0 }).observe(s);
      }
      p.unobserve(m);
    });
  }, { rootMargin: "300px" });
  o.forEach((a) => u.observe(a));
}
function q() {
  const e = [];
  document.querySelectorAll(".work-list .work-item .work-media").forEach((n) => {
    S(n), e.push(...n.children), n.querySelectorAll("img").forEach((t) => {
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
  }), e.length && b(e);
}
let w, E, v;
function k() {
  clearInterval(w);
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
  n(), w = setInterval(n, 1e3);
}
function A() {
  const e = document.querySelectorAll('[aria-label="freelance"]');
  if (!e.length) return;
  cancelAnimationFrame(E), v = null;
  const n = 600, t = (o) => {
    v || (v = o);
    const r = (o - v) % (n * 2) / n, l = r < 1 ? 1 - r : r - 1;
    e.forEach((d) => d.style.opacity = l), E = requestAnimationFrame(t);
  };
  e.forEach((o) => o.style.opacity = "1"), E = requestAnimationFrame(t);
}
function I() {
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
function F() {
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
function O() {
  const e = document.querySelector(".inactive"), n = document.querySelector(".overlay");
  if (!e) return;
  const t = e.querySelector("video");
  let o;
  if (t) {
    t.setAttribute("playsinline", ""), t.muted = !0, t.style.opacity = "0", t.style.transition = "opacity 0.6s ease-in-out";
    const u = () => {
      t.style.opacity = "1";
    };
    t.readyState >= 2 ? u() : t.addEventListener("loadeddata", u, { once: !0 });
  }
  const r = () => {
    e.style.opacity = "1", e.style.pointerEvents = "auto", n && (n.style.opacity = "1", n.style.pointerEvents = "auto"), t == null || t.play().catch(() => {
    });
  }, l = () => {
    e.style.opacity = "0", e.style.pointerEvents = "none", n && (n.style.opacity = "0", n.style.pointerEvents = "none"), t == null || t.pause();
  }, d = () => {
    l(), clearTimeout(o), o = setTimeout(r, 15e3);
  };
  ["mousemove", "scroll", "touchstart"].forEach(
    (u) => window.addEventListener(u, d, { passive: !0 })
  ), d();
}
function L() {
  document.querySelectorAll(".work-list .work-item").forEach((t, o) => {
    const r = t.querySelector("p[data-index]");
    r && (r.textContent = String(o + 1).padStart(3, "0"));
  }), F(), I(), q(), T(), k(), A(), O();
  const e = document.querySelector("#top"), n = document.querySelector(".about");
  e && n && (new IntersectionObserver(([t]) => {
    const o = t.boundingClientRect.bottom <= 0;
    e.style.transform = o ? "translate(-50%, 0%)" : "translate(-50%, 100%)", e.style.opacity = o ? "1" : "0";
  }).observe(n), e.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })));
}
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
L();
