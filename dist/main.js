function Tt(t) {
  return typeof t == "number";
}
function bt(t) {
  return typeof t == "string";
}
function gt(t) {
  return typeof t == "boolean";
}
function Bt(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
function M(t) {
  return Math.abs(t);
}
function It(t) {
  return Math.sign(t);
}
function at(t, e) {
  return M(t - e);
}
function te(t, e) {
  if (t === 0 || e === 0 || M(t) <= M(e)) return 0;
  const n = at(M(t), M(e));
  return M(n / t);
}
function ee(t) {
  return Math.round(t * 100) / 100;
}
function lt(t) {
  return ft(t).map(Number);
}
function z(t) {
  return t[pt(t)];
}
function pt(t) {
  return Math.max(0, t.length - 1);
}
function wt(t, e) {
  return e === pt(t);
}
function zt(t, e = 0) {
  return Array.from(Array(t), (n, o) => e + o);
}
function ft(t) {
  return Object.keys(t);
}
function Gt(t, e) {
  return [t, e].reduce((n, o) => (ft(o).forEach((c) => {
    const s = n[c], r = o[c], d = Bt(s) && Bt(r);
    n[c] = d ? Gt(s, r) : r;
  }), n), {});
}
function xt(t, e) {
  return typeof e.MouseEvent < "u" && t instanceof e.MouseEvent;
}
function ne(t, e) {
  const n = {
    start: o,
    center: c,
    end: s
  };
  function o() {
    return 0;
  }
  function c(i) {
    return s(i) / 2;
  }
  function s(i) {
    return e - i;
  }
  function r(i, u) {
    return bt(t) ? n[t](i) : t(e, i, u);
  }
  return {
    measure: r
  };
}
function dt() {
  let t = [];
  function e(c, s, r, d = {
    passive: !0
  }) {
    let i;
    if ("addEventListener" in c)
      c.addEventListener(s, r, d), i = () => c.removeEventListener(s, r, d);
    else {
      const u = c;
      u.addListener(r), i = () => u.removeListener(r);
    }
    return t.push(i), o;
  }
  function n() {
    t = t.filter((c) => c());
  }
  const o = {
    add: e,
    clear: n
  };
  return o;
}
function oe(t, e, n, o) {
  const c = dt(), s = 1e3 / 60;
  let r = null, d = 0, i = 0;
  function u() {
    c.add(t, "visibilitychange", () => {
      t.hidden && f();
    });
  }
  function g() {
    y(), c.clear();
  }
  function l(h) {
    if (!i) return;
    r || (r = h, n(), n());
    const a = h - r;
    for (r = h, d += a; d >= s; )
      n(), d -= s;
    const S = d / s;
    o(S), i && (i = e.requestAnimationFrame(l));
  }
  function p() {
    i || (i = e.requestAnimationFrame(l));
  }
  function y() {
    e.cancelAnimationFrame(i), r = null, d = 0, i = 0;
  }
  function f() {
    r = null, d = 0;
  }
  return {
    init: u,
    destroy: g,
    start: p,
    stop: y,
    update: n,
    render: o
  };
}
function re(t, e) {
  const n = e === "rtl", o = t === "y", c = o ? "y" : "x", s = o ? "x" : "y", r = !o && n ? -1 : 1, d = g(), i = l();
  function u(f) {
    const {
      height: m,
      width: h
    } = f;
    return o ? m : h;
  }
  function g() {
    return o ? "top" : n ? "right" : "left";
  }
  function l() {
    return o ? "bottom" : n ? "left" : "right";
  }
  function p(f) {
    return f * r;
  }
  return {
    scroll: c,
    cross: s,
    startEdge: d,
    endEdge: i,
    measureSize: u,
    direction: p
  };
}
function tt(t = 0, e = 0) {
  const n = M(t - e);
  function o(u) {
    return u < t;
  }
  function c(u) {
    return u > e;
  }
  function s(u) {
    return o(u) || c(u);
  }
  function r(u) {
    return s(u) ? o(u) ? t : e : u;
  }
  function d(u) {
    return n ? u - n * Math.ceil((u - e) / n) : u;
  }
  return {
    length: n,
    max: e,
    min: t,
    constrain: r,
    reachedAny: s,
    reachedMax: c,
    reachedMin: o,
    removeOffset: d
  };
}
function Rt(t, e, n) {
  const {
    constrain: o
  } = tt(0, t), c = t + 1;
  let s = r(e);
  function r(p) {
    return n ? M((c + p) % c) : o(p);
  }
  function d() {
    return s;
  }
  function i(p) {
    return s = r(p), l;
  }
  function u(p) {
    return g().set(d() + p);
  }
  function g() {
    return Rt(t, d(), n);
  }
  const l = {
    get: d,
    set: i,
    add: u,
    clone: g
  };
  return l;
}
function se(t, e, n, o, c, s, r, d, i, u, g, l, p, y, f, m, h, a, S) {
  const {
    cross: v,
    direction: L
  } = t, D = ["INPUT", "SELECT", "TEXTAREA"], T = {
    passive: !1
  }, b = dt(), x = dt(), I = tt(50, 225).constrain(y.measure(20)), P = {
    mouse: 300,
    touch: 400
  }, w = {
    mouse: 500,
    touch: 600
  }, F = f ? 43 : 25;
  let V = !1, H = 0, G = 0, X = !1, Q = !1, Y = !1, j = !1;
  function rt(E) {
    if (!S) return;
    function A(q) {
      (gt(S) || S(E, q)) && it(q);
    }
    const k = e;
    b.add(k, "dragstart", (q) => q.preventDefault(), T).add(k, "touchmove", () => {
    }, T).add(k, "touchend", () => {
    }).add(k, "touchstart", A).add(k, "mousedown", A).add(k, "touchcancel", O).add(k, "contextmenu", O).add(k, "click", U, !0);
  }
  function R() {
    b.clear(), x.clear();
  }
  function et() {
    const E = j ? n : e;
    x.add(E, "touchmove", N, T).add(E, "touchend", O).add(E, "mousemove", N, T).add(E, "mouseup", O);
  }
  function nt(E) {
    const A = E.nodeName || "";
    return D.includes(A);
  }
  function $() {
    return (f ? w : P)[j ? "mouse" : "touch"];
  }
  function st(E, A) {
    const k = l.add(It(E) * -1), q = g.byDistance(E, !f).distance;
    return f || M(E) < I ? q : h && A ? q * 0.5 : g.byIndex(k.get(), 0).distance;
  }
  function it(E) {
    const A = xt(E, o);
    j = A, Y = f && A && !E.buttons && V, V = at(c.get(), r.get()) >= 2, !(A && E.button !== 0) && (nt(E.target) || (X = !0, s.pointerDown(E), u.useFriction(0).useDuration(0), c.set(r), et(), H = s.readPoint(E), G = s.readPoint(E, v), p.emit("pointerDown")));
  }
  function N(E) {
    if (!xt(E, o) && E.touches.length >= 2) return O(E);
    const k = s.readPoint(E), q = s.readPoint(E, v), _ = at(k, H), K = at(q, G);
    if (!Q && !j && (!E.cancelable || (Q = _ > K, !Q)))
      return O(E);
    const Z = s.pointerMove(E);
    _ > m && (Y = !0), u.useFriction(0.3).useDuration(0.75), d.start(), c.add(L(Z)), E.preventDefault();
  }
  function O(E) {
    const k = g.byDistance(0, !1).index !== l.get(), q = s.pointerUp(E) * $(), _ = st(L(q), k), K = te(q, _), Z = F - 10 * K, J = a + K / 50;
    Q = !1, X = !1, x.clear(), u.useDuration(Z).useFriction(J), i.distance(_, !f), j = !1, p.emit("pointerUp");
  }
  function U(E) {
    Y && (E.stopPropagation(), E.preventDefault(), Y = !1);
  }
  function B() {
    return X;
  }
  return {
    init: rt,
    destroy: R,
    pointerDown: B
  };
}
function ie(t, e) {
  let o, c;
  function s(l) {
    return l.timeStamp;
  }
  function r(l, p) {
    const f = `client${(p || t.scroll) === "x" ? "X" : "Y"}`;
    return (xt(l, e) ? l : l.touches[0])[f];
  }
  function d(l) {
    return o = l, c = l, r(l);
  }
  function i(l) {
    const p = r(l) - r(c), y = s(l) - s(o) > 170;
    return c = l, y && (o = l), p;
  }
  function u(l) {
    if (!o || !c) return 0;
    const p = r(c) - r(o), y = s(l) - s(o), f = s(l) - s(c) > 170, m = p / y;
    return y && !f && M(m) > 0.1 ? m : 0;
  }
  return {
    pointerDown: d,
    pointerMove: i,
    pointerUp: u,
    readPoint: r
  };
}
function ce() {
  function t(n) {
    const {
      offsetTop: o,
      offsetLeft: c,
      offsetWidth: s,
      offsetHeight: r
    } = n;
    return {
      top: o,
      right: c + s,
      bottom: o + r,
      left: c,
      width: s,
      height: r
    };
  }
  return {
    measure: t
  };
}
function ue(t) {
  function e(o) {
    return t * (o / 100);
  }
  return {
    measure: e
  };
}
function ae(t, e, n, o, c, s, r) {
  const d = [t].concat(o);
  let i, u, g = [], l = !1;
  function p(h) {
    return c.measureSize(r.measure(h));
  }
  function y(h) {
    if (!s) return;
    u = p(t), g = o.map(p);
    function a(S) {
      for (const v of S) {
        if (l) return;
        const L = v.target === t, D = o.indexOf(v.target), T = L ? u : g[D], b = p(L ? t : o[D]);
        if (M(b - T) >= 0.5) {
          h.reInit(), e.emit("resize");
          break;
        }
      }
    }
    i = new ResizeObserver((S) => {
      (gt(s) || s(h, S)) && a(S);
    }), n.requestAnimationFrame(() => {
      d.forEach((S) => i.observe(S));
    });
  }
  function f() {
    l = !0, i && i.disconnect();
  }
  return {
    init: y,
    destroy: f
  };
}
function le(t, e, n, o, c, s) {
  let r = 0, d = 0, i = c, u = s, g = t.get(), l = 0;
  function p() {
    const T = o.get() - t.get(), b = !i;
    let x = 0;
    return b ? (r = 0, n.set(o), t.set(o), x = T) : (n.set(t), r += T / i, r *= u, g += r, t.add(r), x = g - l), d = It(x), l = g, D;
  }
  function y() {
    const T = o.get() - e.get();
    return M(T) < 1e-3;
  }
  function f() {
    return i;
  }
  function m() {
    return d;
  }
  function h() {
    return r;
  }
  function a() {
    return v(c);
  }
  function S() {
    return L(s);
  }
  function v(T) {
    return i = T, D;
  }
  function L(T) {
    return u = T, D;
  }
  const D = {
    direction: m,
    duration: f,
    velocity: h,
    seek: p,
    settled: y,
    useBaseFriction: S,
    useBaseDuration: a,
    useFriction: L,
    useDuration: v
  };
  return D;
}
function fe(t, e, n, o, c) {
  const s = c.measure(10), r = c.measure(50), d = tt(0.1, 0.99);
  let i = !1;
  function u() {
    return !(i || !t.reachedAny(n.get()) || !t.reachedAny(e.get()));
  }
  function g(y) {
    if (!u()) return;
    const f = t.reachedMin(e.get()) ? "min" : "max", m = M(t[f] - e.get()), h = n.get() - e.get(), a = d.constrain(m / r);
    n.subtract(h * a), !y && M(h) < s && (n.set(t.constrain(n.get())), o.useDuration(25).useBaseFriction());
  }
  function l(y) {
    i = !y;
  }
  return {
    shouldConstrain: u,
    constrain: g,
    toggleActive: l
  };
}
function de(t, e, n, o, c) {
  const s = tt(-e + t, 0), r = l(), d = g(), i = p();
  function u(f, m) {
    return at(f, m) <= 1;
  }
  function g() {
    const f = r[0], m = z(r), h = r.lastIndexOf(f), a = r.indexOf(m) + 1;
    return tt(h, a);
  }
  function l() {
    return n.map((f, m) => {
      const {
        min: h,
        max: a
      } = s, S = s.constrain(f), v = !m, L = wt(n, m);
      return v ? a : L || u(h, S) ? h : u(a, S) ? a : S;
    }).map((f) => parseFloat(f.toFixed(3)));
  }
  function p() {
    if (e <= t + c) return [s.max];
    if (o === "keepSnaps") return r;
    const {
      min: f,
      max: m
    } = d;
    return r.slice(f, m);
  }
  return {
    snapsContained: i,
    scrollContainLimit: d
  };
}
function pe(t, e, n) {
  const o = e[0], c = n ? o - t : z(e);
  return {
    limit: tt(c, o)
  };
}
function me(t, e, n, o) {
  const s = e.min + 0.1, r = e.max + 0.1, {
    reachedMin: d,
    reachedMax: i
  } = tt(s, r);
  function u(p) {
    return p === 1 ? i(n.get()) : p === -1 ? d(n.get()) : !1;
  }
  function g(p) {
    if (!u(p)) return;
    const y = t * (p * -1);
    o.forEach((f) => f.add(y));
  }
  return {
    loop: g
  };
}
function ge(t) {
  const {
    max: e,
    length: n
  } = t;
  function o(s) {
    const r = s - e;
    return n ? r / -n : 0;
  }
  return {
    get: o
  };
}
function he(t, e, n, o, c) {
  const {
    startEdge: s,
    endEdge: r
  } = t, {
    groupSlides: d
  } = c, i = l().map(e.measure), u = p(), g = y();
  function l() {
    return d(o).map((m) => z(m)[r] - m[0][s]).map(M);
  }
  function p() {
    return o.map((m) => n[s] - m[s]).map((m) => -M(m));
  }
  function y() {
    return d(u).map((m) => m[0]).map((m, h) => m + i[h]);
  }
  return {
    snaps: u,
    snapsAligned: g
  };
}
function ye(t, e, n, o, c, s) {
  const {
    groupSlides: r
  } = c, {
    min: d,
    max: i
  } = o, u = g();
  function g() {
    const p = r(s), y = !t || e === "keepSnaps";
    return n.length === 1 ? [s] : y ? p : p.slice(d, i).map((f, m, h) => {
      const a = !m, S = wt(h, m);
      if (a) {
        const v = z(h[0]) + 1;
        return zt(v);
      }
      if (S) {
        const v = pt(s) - z(h)[0] + 1;
        return zt(v, z(h)[0]);
      }
      return f;
    });
  }
  return {
    slideRegistry: u
  };
}
function Se(t, e, n, o, c) {
  const {
    reachedAny: s,
    removeOffset: r,
    constrain: d
  } = o;
  function i(f) {
    return f.concat().sort((m, h) => M(m) - M(h))[0];
  }
  function u(f) {
    const m = t ? r(f) : d(f), h = e.map((S, v) => ({
      diff: g(S - m, 0),
      index: v
    })).sort((S, v) => M(S.diff) - M(v.diff)), {
      index: a
    } = h[0];
    return {
      index: a,
      distance: m
    };
  }
  function g(f, m) {
    const h = [f, f + n, f - n];
    if (!t) return f;
    if (!m) return i(h);
    const a = h.filter((S) => It(S) === m);
    return a.length ? i(a) : z(h) - n;
  }
  function l(f, m) {
    const h = e[f] - c.get(), a = g(h, m);
    return {
      index: f,
      distance: a
    };
  }
  function p(f, m) {
    const h = c.get() + f, {
      index: a,
      distance: S
    } = u(h), v = !t && s(h);
    if (!m || v) return {
      index: a,
      distance: f
    };
    const L = e[a] - S, D = f + g(L, 0);
    return {
      index: a,
      distance: D
    };
  }
  return {
    byDistance: p,
    byIndex: l,
    shortcut: g
  };
}
function Ee(t, e, n, o, c, s, r) {
  function d(l) {
    const p = l.distance, y = l.index !== e.get();
    s.add(p), p && (o.duration() ? t.start() : (t.update(), t.render(1), t.update())), y && (n.set(e.get()), e.set(l.index), r.emit("select"));
  }
  function i(l, p) {
    const y = c.byDistance(l, p);
    d(y);
  }
  function u(l, p) {
    const y = e.clone().set(l), f = c.byIndex(y.get(), p);
    d(f);
  }
  return {
    distance: i,
    index: u
  };
}
function ve(t, e, n, o, c, s, r, d) {
  const i = {
    passive: !0,
    capture: !0
  };
  let u = 0;
  function g(y) {
    if (!d) return;
    function f(m) {
      if ((/* @__PURE__ */ new Date()).getTime() - u > 10) return;
      r.emit("slideFocusStart"), t.scrollLeft = 0;
      const S = n.findIndex((v) => v.includes(m));
      Tt(S) && (c.useDuration(0), o.index(S, 0), r.emit("slideFocus"));
    }
    s.add(document, "keydown", l, !1), e.forEach((m, h) => {
      s.add(m, "focus", (a) => {
        (gt(d) || d(y, a)) && f(h);
      }, i);
    });
  }
  function l(y) {
    y.code === "Tab" && (u = (/* @__PURE__ */ new Date()).getTime());
  }
  return {
    init: g
  };
}
function ut(t) {
  let e = t;
  function n() {
    return e;
  }
  function o(i) {
    e = r(i);
  }
  function c(i) {
    e += r(i);
  }
  function s(i) {
    e -= r(i);
  }
  function r(i) {
    return Tt(i) ? i : i.get();
  }
  return {
    get: n,
    set: o,
    add: c,
    subtract: s
  };
}
function _t(t, e) {
  const n = t.scroll === "x" ? r : d, o = e.style;
  let c = null, s = !1;
  function r(p) {
    return `translate3d(${p}px,0px,0px)`;
  }
  function d(p) {
    return `translate3d(0px,${p}px,0px)`;
  }
  function i(p) {
    if (s) return;
    const y = ee(t.direction(p));
    y !== c && (o.transform = n(y), c = y);
  }
  function u(p) {
    s = !p;
  }
  function g() {
    s || (o.transform = "", e.getAttribute("style") || e.removeAttribute("style"));
  }
  return {
    clear: g,
    to: i,
    toggleActive: u
  };
}
function be(t, e, n, o, c, s, r, d, i) {
  const g = lt(c), l = lt(c).reverse(), p = a().concat(S());
  function y(b, x) {
    return b.reduce((I, P) => I - c[P], x);
  }
  function f(b, x) {
    return b.reduce((I, P) => y(I, x) > 0 ? I.concat([P]) : I, []);
  }
  function m(b) {
    return s.map((x, I) => ({
      start: x - o[I] + 0.5 + b,
      end: x + e - 0.5 + b
    }));
  }
  function h(b, x, I) {
    const P = m(x);
    return b.map((w) => {
      const F = I ? 0 : -n, V = I ? n : 0, H = I ? "end" : "start", G = P[w][H];
      return {
        index: w,
        loopPoint: G,
        slideLocation: ut(-1),
        translate: _t(t, i[w]),
        target: () => d.get() > G ? F : V
      };
    });
  }
  function a() {
    const b = r[0], x = f(l, b);
    return h(x, n, !1);
  }
  function S() {
    const b = e - r[0] - 1, x = f(g, b);
    return h(x, -n, !0);
  }
  function v() {
    return p.every(({
      index: b
    }) => {
      const x = g.filter((I) => I !== b);
      return y(x, e) <= 0.1;
    });
  }
  function L() {
    p.forEach((b) => {
      const {
        target: x,
        translate: I,
        slideLocation: P
      } = b, w = x();
      w !== P.get() && (I.to(w), P.set(w));
    });
  }
  function D() {
    p.forEach((b) => b.translate.clear());
  }
  return {
    canLoop: v,
    clear: D,
    loop: L,
    loopPoints: p
  };
}
function xe(t, e, n) {
  let o, c = !1;
  function s(i) {
    if (!n) return;
    function u(g) {
      for (const l of g)
        if (l.type === "childList") {
          i.reInit(), e.emit("slidesChanged");
          break;
        }
    }
    o = new MutationObserver((g) => {
      c || (gt(n) || n(i, g)) && u(g);
    }), o.observe(t, {
      childList: !0
    });
  }
  function r() {
    o && o.disconnect(), c = !0;
  }
  return {
    init: s,
    destroy: r
  };
}
function Le(t, e, n, o) {
  const c = {};
  let s = null, r = null, d, i = !1;
  function u() {
    d = new IntersectionObserver((f) => {
      i || (f.forEach((m) => {
        const h = e.indexOf(m.target);
        c[h] = m;
      }), s = null, r = null, n.emit("slidesInView"));
    }, {
      root: t.parentElement,
      threshold: o
    }), e.forEach((f) => d.observe(f));
  }
  function g() {
    d && d.disconnect(), i = !0;
  }
  function l(f) {
    return ft(c).reduce((m, h) => {
      const a = parseInt(h), {
        isIntersecting: S
      } = c[a];
      return (f && S || !f && !S) && m.push(a), m;
    }, []);
  }
  function p(f = !0) {
    if (f && s) return s;
    if (!f && r) return r;
    const m = l(f);
    return f && (s = m), f || (r = m), m;
  }
  return {
    init: u,
    destroy: g,
    get: p
  };
}
function Te(t, e, n, o, c, s) {
  const {
    measureSize: r,
    startEdge: d,
    endEdge: i
  } = t, u = n[0] && c, g = f(), l = m(), p = n.map(r), y = h();
  function f() {
    if (!u) return 0;
    const S = n[0];
    return M(e[d] - S[d]);
  }
  function m() {
    if (!u) return 0;
    const S = s.getComputedStyle(z(o));
    return parseFloat(S.getPropertyValue(`margin-${i}`));
  }
  function h() {
    return n.map((S, v, L) => {
      const D = !v, T = wt(L, v);
      return D ? p[v] + g : T ? p[v] + l : L[v + 1][d] - S[d];
    }).map(M);
  }
  return {
    slideSizes: p,
    slideSizesWithGaps: y,
    startGap: g,
    endGap: l
  };
}
function Ie(t, e, n, o, c, s, r, d, i) {
  const {
    startEdge: u,
    endEdge: g,
    direction: l
  } = t, p = Tt(n);
  function y(a, S) {
    return lt(a).filter((v) => v % S === 0).map((v) => a.slice(v, v + S));
  }
  function f(a) {
    return a.length ? lt(a).reduce((S, v, L) => {
      const D = z(S) || 0, T = D === 0, b = v === pt(a), x = c[u] - s[D][u], I = c[u] - s[v][g], P = !o && T ? l(r) : 0, w = !o && b ? l(d) : 0, F = M(I - w - (x + P));
      return L && F > e + i && S.push(v), b && S.push(a.length), S;
    }, []).map((S, v, L) => {
      const D = Math.max(L[v - 1] || 0);
      return a.slice(D, S);
    }) : [];
  }
  function m(a) {
    return p ? y(a, n) : f(a);
  }
  return {
    groupSlides: m
  };
}
function we(t, e, n, o, c, s, r) {
  const {
    align: d,
    axis: i,
    direction: u,
    startIndex: g,
    loop: l,
    duration: p,
    dragFree: y,
    dragThreshold: f,
    inViewThreshold: m,
    slidesToScroll: h,
    skipSnaps: a,
    containScroll: S,
    watchResize: v,
    watchSlides: L,
    watchDrag: D,
    watchFocus: T
  } = s, b = 2, x = ce(), I = x.measure(e), P = n.map(x.measure), w = re(i, u), F = w.measureSize(I), V = ue(F), H = ne(d, F), G = !l && !!S, X = l || !!S, {
    slideSizes: Q,
    slideSizesWithGaps: Y,
    startGap: j,
    endGap: rt
  } = Te(w, I, P, n, X, c), R = Ie(w, F, h, l, I, P, j, rt, b), {
    snaps: et,
    snapsAligned: nt
  } = he(w, H, I, P, R), $ = -z(et) + z(Y), {
    snapsContained: st,
    scrollContainLimit: it
  } = de(F, $, nt, S, b), N = G ? st : nt, {
    limit: O
  } = pe($, N, l), U = Rt(pt(N), g, l), B = U.clone(), C = lt(n), E = ({
    dragHandler: ot,
    scrollBody: Et,
    scrollBounds: vt,
    options: {
      loop: mt
    }
  }) => {
    mt || vt.constrain(ot.pointerDown()), Et.seek();
  }, A = ({
    scrollBody: ot,
    translate: Et,
    location: vt,
    offsetLocation: mt,
    previousLocation: $t,
    scrollLooper: Ut,
    slideLooper: Kt,
    dragHandler: Qt,
    animation: Jt,
    eventHandler: Pt,
    scrollBounds: Xt,
    options: {
      loop: kt
    }
  }, Ot) => {
    const qt = ot.settled(), Zt = !Xt.shouldConstrain(), Ft = kt ? qt : qt && Zt, Nt = Ft && !Qt.pointerDown();
    Nt && Jt.stop();
    const Wt = vt.get() * Ot + $t.get() * (1 - Ot);
    mt.set(Wt), kt && (Ut.loop(ot.direction()), Kt.loop()), Et.to(mt.get()), Nt && Pt.emit("settle"), Ft || Pt.emit("scroll");
  }, k = oe(o, c, () => E(St), (ot) => A(St, ot)), q = 0.68, _ = N[U.get()], K = ut(_), Z = ut(_), J = ut(_), W = ut(_), ct = le(K, J, Z, W, p, q), ht = Se(l, N, $, O, W), yt = Ee(k, U, B, ct, ht, W, r), Dt = ge(O), Ct = dt(), Yt = Le(e, n, r, m), {
    slideRegistry: Mt
  } = ye(G, S, N, it, R, C), jt = ve(t, n, Mt, yt, ct, Ct, r, T), St = {
    ownerDocument: o,
    ownerWindow: c,
    eventHandler: r,
    containerRect: I,
    slideRects: P,
    animation: k,
    axis: w,
    dragHandler: se(w, t, o, c, W, ie(w, c), K, k, yt, ct, ht, U, r, V, y, f, a, q, D),
    eventStore: Ct,
    percentOfView: V,
    index: U,
    indexPrevious: B,
    limit: O,
    location: K,
    offsetLocation: J,
    previousLocation: Z,
    options: s,
    resizeHandler: ae(e, r, c, n, w, v, x),
    scrollBody: ct,
    scrollBounds: fe(O, J, W, ct, V),
    scrollLooper: me($, O, J, [K, J, Z, W]),
    scrollProgress: Dt,
    scrollSnapList: N.map(Dt.get),
    scrollSnaps: N,
    scrollTarget: ht,
    scrollTo: yt,
    slideLooper: be(w, F, $, Q, Y, et, N, J, n),
    slideFocus: jt,
    slidesHandler: xe(e, r, L),
    slidesInView: Yt,
    slideIndexes: C,
    slideRegistry: Mt,
    slidesToScroll: R,
    target: W,
    translate: _t(w, e)
  };
  return St;
}
function Ae() {
  let t = {}, e;
  function n(u) {
    e = u;
  }
  function o(u) {
    return t[u] || [];
  }
  function c(u) {
    return o(u).forEach((g) => g(e, u)), i;
  }
  function s(u, g) {
    return t[u] = o(u).concat([g]), i;
  }
  function r(u, g) {
    return t[u] = o(u).filter((l) => l !== g), i;
  }
  function d() {
    t = {};
  }
  const i = {
    init: n,
    emit: c,
    off: r,
    on: s,
    clear: d
  };
  return i;
}
const De = {
  align: "center",
  axis: "x",
  container: null,
  slides: null,
  containScroll: "trimSnaps",
  direction: "ltr",
  slidesToScroll: 1,
  inViewThreshold: 0,
  breakpoints: {},
  dragFree: !1,
  dragThreshold: 10,
  loop: !1,
  skipSnaps: !1,
  duration: 25,
  startIndex: 0,
  active: !0,
  watchDrag: !0,
  watchResize: !0,
  watchSlides: !0,
  watchFocus: !0
};
function Ce(t) {
  function e(s, r) {
    return Gt(s, r || {});
  }
  function n(s) {
    const r = s.breakpoints || {}, d = ft(r).filter((i) => t.matchMedia(i).matches).map((i) => r[i]).reduce((i, u) => e(i, u), {});
    return e(s, d);
  }
  function o(s) {
    return s.map((r) => ft(r.breakpoints || {})).reduce((r, d) => r.concat(d), []).map(t.matchMedia);
  }
  return {
    mergeOptions: e,
    optionsAtMedia: n,
    optionsMediaQueries: o
  };
}
function Me(t) {
  let e = [];
  function n(s, r) {
    return e = r.filter(({
      options: d
    }) => t.optionsAtMedia(d).active !== !1), e.forEach((d) => d.init(s, t)), r.reduce((d, i) => Object.assign(d, {
      [i.name]: i
    }), {});
  }
  function o() {
    e = e.filter((s) => s.destroy());
  }
  return {
    init: n,
    destroy: o
  };
}
function At(t, e, n) {
  const o = t.ownerDocument, c = o.defaultView, s = Ce(c), r = Me(s), d = dt(), i = Ae(), {
    mergeOptions: u,
    optionsAtMedia: g,
    optionsMediaQueries: l
  } = s, {
    on: p,
    off: y,
    emit: f
  } = i, m = w;
  let h = !1, a, S = u(De, At.globalOptions), v = u(S), L = [], D, T, b;
  function x() {
    const {
      container: C,
      slides: E
    } = v;
    T = (bt(C) ? t.querySelector(C) : C) || t.children[0];
    const k = bt(E) ? T.querySelectorAll(E) : E;
    b = [].slice.call(k || T.children);
  }
  function I(C) {
    const E = we(t, T, b, o, c, C, i);
    if (C.loop && !E.slideLooper.canLoop()) {
      const A = Object.assign({}, C, {
        loop: !1
      });
      return I(A);
    }
    return E;
  }
  function P(C, E) {
    h || (S = u(S, C), v = g(S), L = E || L, x(), a = I(v), l([S, ...L.map(({
      options: A
    }) => A)]).forEach((A) => d.add(A, "change", w)), v.active && (a.translate.to(a.location.get()), a.animation.init(), a.slidesInView.init(), a.slideFocus.init(B), a.eventHandler.init(B), a.resizeHandler.init(B), a.slidesHandler.init(B), a.options.loop && a.slideLooper.loop(), T.offsetParent && b.length && a.dragHandler.init(B), D = r.init(B, L)));
  }
  function w(C, E) {
    const A = R();
    F(), P(u({
      startIndex: A
    }, C), E), i.emit("reInit");
  }
  function F() {
    a.dragHandler.destroy(), a.eventStore.clear(), a.translate.clear(), a.slideLooper.clear(), a.resizeHandler.destroy(), a.slidesHandler.destroy(), a.slidesInView.destroy(), a.animation.destroy(), r.destroy(), d.clear();
  }
  function V() {
    h || (h = !0, d.clear(), F(), i.emit("destroy"), i.clear());
  }
  function H(C, E, A) {
    !v.active || h || (a.scrollBody.useBaseFriction().useDuration(E === !0 ? 0 : v.duration), a.scrollTo.index(C, A || 0));
  }
  function G(C) {
    const E = a.index.add(1).get();
    H(E, C, -1);
  }
  function X(C) {
    const E = a.index.add(-1).get();
    H(E, C, 1);
  }
  function Q() {
    return a.index.add(1).get() !== R();
  }
  function Y() {
    return a.index.add(-1).get() !== R();
  }
  function j() {
    return a.scrollSnapList;
  }
  function rt() {
    return a.scrollProgress.get(a.offsetLocation.get());
  }
  function R() {
    return a.index.get();
  }
  function et() {
    return a.indexPrevious.get();
  }
  function nt() {
    return a.slidesInView.get();
  }
  function $() {
    return a.slidesInView.get(!1);
  }
  function st() {
    return D;
  }
  function it() {
    return a;
  }
  function N() {
    return t;
  }
  function O() {
    return T;
  }
  function U() {
    return b;
  }
  const B = {
    canScrollNext: Q,
    canScrollPrev: Y,
    containerNode: O,
    internalEngine: it,
    destroy: V,
    off: y,
    on: p,
    emit: f,
    plugins: st,
    previousScrollSnap: et,
    reInit: m,
    rootNode: N,
    scrollNext: G,
    scrollPrev: X,
    scrollProgress: rt,
    scrollSnapList: j,
    scrollTo: H,
    selectedScrollSnap: R,
    slideNodes: U,
    slidesInView: nt,
    slidesNotInView: $
  };
  return P(e, n), setTimeout(() => i.emit("init"), 0), B;
}
At.globalOptions = void 0;
const Pe = 100;
function Vt(t) {
  const e = t.querySelector("img");
  if (e) {
    const c = () => {
      e.style.opacity = "1";
    };
    e.complete && e.naturalWidth ? c() : e.addEventListener("load", c, { once: !0 });
  }
  const n = t.querySelector("video");
  if (!n) return;
  n.style.opacity = "1";
  const o = n.querySelector("source[data-src]");
  o && !o.src && o.dataset.src && (o.src = o.dataset.src, n.load()), n.readyState >= 3 ? n.play().catch(() => {
  }) : n.addEventListener("canplay", () => n.play().catch(() => {
  }), { once: !0 });
}
function ke(t) {
  var e;
  (e = t.querySelector("video")) == null || e.pause();
}
function Oe() {
  const t = document.querySelector(".header");
  t && (t.style.opacity = "1"), document.querySelectorAll(".work-list .work-item").forEach((n, o) => {
    setTimeout(() => {
      n.style.opacity = "1", n.style.transform = "translateY(0)";
    }, Pe * (o + 1));
  });
  let e = null;
  document.querySelectorAll(".work-item").forEach((n) => {
    var f, m;
    n.addEventListener("click", () => n.scrollIntoView({ behavior: "smooth", block: "center" }));
    const o = n.querySelector(".embla__viewport");
    if (!o) return;
    const c = At(o, { loop: !0, watchDrag: !1, duration: 0 }), s = c.slideNodes();
    if (!s.length) return;
    const r = [...n.querySelectorAll(".dot-inner")], d = n.querySelector(".more-button"), i = n.querySelector(".embla"), u = n.querySelector(".description"), g = (h) => {
      r.forEach((a, S) => {
        var v;
        return (v = a.querySelector(".dot")) == null ? void 0 : v.classList.toggle("active", S === h);
      });
    };
    let l = !1;
    const p = () => {
      l && (l = !1, i.style.opacity = "1", i.style.pointerEvents = "auto", u.style.opacity = "0", u.style.pointerEvents = "none", d.textContent = "+", e === p && (e = null));
    };
    r.forEach((h, a) => h.addEventListener("click", () => {
      e == null || e(), c.scrollTo(a);
    }));
    let y = 0;
    Vt(s[0]), g(0), c.on("select", () => {
      ke(s[y]), y = c.selectedScrollSnap(), Vt(s[y]), g(y);
    }), (f = n.querySelector(".embla__prev")) == null || f.addEventListener("click", () => {
      e == null || e(), c.scrollPrev();
    }), (m = n.querySelector(".embla__next")) == null || m.addEventListener("click", () => {
      e == null || e(), c.scrollNext();
    }), n.querySelectorAll("[data-url]").forEach((h) => {
      const a = h.getAttribute("href");
      if (a)
        try {
          h.textContent = new URL(a).hostname.replace(/^www\./, "");
        } catch {
        }
    }), d && i && u && d.addEventListener("click", () => {
      !l && e && e(), l = !l, i.style.opacity = l ? "0" : "1", i.style.pointerEvents = l ? "none" : "auto", u.style.opacity = l ? "1" : "0", u.style.pointerEvents = l ? "auto" : "none", d.textContent = l ? "-" : "+", e = l ? p : null;
    });
  });
}
const Lt = "vimeo_cache", qe = 600 * 1e3;
function Fe() {
  try {
    const t = sessionStorage.getItem(Lt);
    if (!t) return {};
    const { ts: e, data: n } = JSON.parse(t);
    return Date.now() - e > qe ? (sessionStorage.removeItem(Lt), {}) : n;
  } catch {
    return {};
  }
}
function Ne(t) {
  try {
    sessionStorage.setItem(Lt, JSON.stringify({ ts: Date.now(), data: t }));
  } catch {
  }
}
async function Be() {
  const t = "c9496452bd623b32565ddf7e6973d68c", e = window.innerWidth >= 768 ? "1080p" : "720p", n = 200, o = document.querySelectorAll(".work-video[vimeo-id]");
  if (!o.length) return;
  const c = [...new Set([...o].map((i) => i.getAttribute("vimeo-id")).filter(Boolean))], s = Fe(), r = c.filter((i) => !s[i]);
  r.length && ((await Promise.allSettled(
    r.map(
      (u) => fetch(`https://api.vimeo.com/videos/${u}?fields=pictures,files`, {
        headers: { Authorization: `Bearer ${t}` }
      }).then((g) => g.ok ? g.json().then((l) => ({ id: u, data: l })) : { id: u, data: {} }).catch(() => ({ id: u, data: {} }))
    )
  )).forEach((u) => {
    var h;
    if (u.status !== "fulfilled") return;
    const { id: g, data: l } = u.value, p = ((h = l.pictures) == null ? void 0 : h.sizes) ?? [], y = p.find((a) => a.width >= n) ?? p[p.length - 1], f = l.files ?? [], m = f.find((a) => a.rendition === e) ?? f.find((a) => a.quality === "hd") ?? f[0];
    s[g] = { poster: (y == null ? void 0 : y.link) ?? "", mp4: (m == null ? void 0 : m.link) ?? "" };
  }), Ne(s));
  const d = new IntersectionObserver((i, u) => {
    i.forEach((g) => {
      if (!g.isIntersecting) return;
      const l = g.target, p = s[l.getAttribute("vimeo-id")];
      if (!p) return;
      const y = l.querySelector(".video-poster");
      if (y && p.poster) {
        y.src = p.poster;
        const h = () => {
          y.style.opacity = "1";
        };
        y.complete && y.naturalWidth ? h() : y.addEventListener("load", h, { once: !0 });
      }
      const f = l.querySelector("video"), m = f == null ? void 0 : f.querySelector("source[data-src]");
      if (m && p.mp4 && !m.src) {
        m.src = p.mp4, f.load();
        const h = () => {
          f.style.opacity = "1";
        };
        f.readyState >= 2 ? h() : f.addEventListener("loadeddata", h, { once: !0 }), new IntersectionObserver(([a]) => {
          a.isIntersecting ? f.play().catch(() => {
          }) : f.pause();
        }, { threshold: 0 }).observe(f);
      }
      u.unobserve(l);
    });
  }, { rootMargin: "300px" });
  o.forEach((i) => d.observe(i));
}
let Ht;
function ze() {
  clearInterval(Ht);
  const t = document.querySelector("#date"), e = document.querySelector("#time");
  if (!(!t && !e) && (t && (t.textContent = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    timeZone: "Europe/Paris",
    weekday: "long",
    month: "long",
    day: "numeric"
  })), e)) {
    const n = () => {
      e.textContent = (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !1
      });
    };
    n(), Ht = setInterval(n, 1e3);
  }
}
const Ve = 400, He = 150;
function Ge() {
  const t = document.querySelector(".info"), e = document.querySelector("#infoButton"), n = document.querySelector(".main-wrapper"), o = document.querySelector("#infoText");
  if (!t || !e || !n) return;
  let c = !1, s = null, r = 0;
  const d = () => {
    t.style.height = "", r = t.getBoundingClientRect().height, t.style.height = `${r}px`, c && (n.style.transform = `translateY(${r}px)`);
  };
  d(), window.addEventListener("resize", d);
  const i = () => {
    c = !0, clearTimeout(s), document.body.style.overflow = "hidden", t.style.transform = "translateY(0%)", n.style.transform = `translateY(${r}px)`, e.textContent = "Close", o && (o.style.opacity = "0", s = setTimeout(() => {
      o.style.opacity = "1";
    }, Ve));
  }, u = () => {
    c = !1, clearTimeout(s), document.body.style.overflow = "", e.textContent = "Information", o ? (o.style.opacity = "0", s = setTimeout(() => {
      t.style.transform = "translateY(-100%)", n.style.transform = "translateY(0)";
    }, He)) : (t.style.transform = "translateY(-100%)", n.style.transform = "translateY(0)");
  };
  e.addEventListener("click", () => c ? u() : i()), document.addEventListener("keydown", (g) => {
    g.key === "Escape" && c && u();
  }), document.addEventListener("click", (g) => {
    c && !t.contains(g.target) && g.target !== e && !g.target.closest("a[href]") && u();
  }, !0);
}
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
ze();
Be();
Oe();
Ge();
