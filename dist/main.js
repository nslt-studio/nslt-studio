function Lt(t) {
  return typeof t == "number";
}
function vt(t) {
  return typeof t == "string";
}
function gt(t) {
  return typeof t == "boolean";
}
function Nt(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
function P(t) {
  return Math.abs(t);
}
function Tt(t) {
  return Math.sign(t);
}
function at(t, e) {
  return P(t - e);
}
function ee(t, e) {
  if (t === 0 || e === 0 || P(t) <= P(e)) return 0;
  const n = at(P(t), P(e));
  return P(n / t);
}
function ne(t) {
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
function It(t, e) {
  return e === pt(t);
}
function Bt(t, e = 0) {
  return Array.from(Array(t), (n, o) => e + o);
}
function ft(t) {
  return Object.keys(t);
}
function Rt(t, e) {
  return [t, e].reduce((n, o) => (ft(o).forEach((c) => {
    const s = n[c], r = o[c], f = Nt(s) && Nt(r);
    n[c] = f ? Rt(s, r) : r;
  }), n), {});
}
function xt(t, e) {
  return typeof e.MouseEvent < "u" && t instanceof e.MouseEvent;
}
function oe(t, e) {
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
    return vt(t) ? n[t](i) : t(e, i, u);
  }
  return {
    measure: r
  };
}
function dt() {
  let t = [];
  function e(c, s, r, f = {
    passive: !0
  }) {
    let i;
    if ("addEventListener" in c)
      c.addEventListener(s, r, f), i = () => c.removeEventListener(s, r, f);
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
function re(t, e, n, o) {
  const c = dt(), s = 1e3 / 60;
  let r = null, f = 0, i = 0;
  function u() {
    c.add(t, "visibilitychange", () => {
      t.hidden && a();
    });
  }
  function m() {
    S(), c.clear();
  }
  function p(h) {
    if (!i) return;
    r || (r = h, n(), n());
    const d = h - r;
    for (r = h, f += d; f >= s; )
      n(), f -= s;
    const y = f / s;
    o(y), i && (i = e.requestAnimationFrame(p));
  }
  function l() {
    i || (i = e.requestAnimationFrame(p));
  }
  function S() {
    e.cancelAnimationFrame(i), r = null, f = 0, i = 0;
  }
  function a() {
    r = null, f = 0;
  }
  return {
    init: u,
    destroy: m,
    start: l,
    stop: S,
    update: n,
    render: o
  };
}
function se(t, e) {
  const n = e === "rtl", o = t === "y", c = o ? "y" : "x", s = o ? "x" : "y", r = !o && n ? -1 : 1, f = m(), i = p();
  function u(a) {
    const {
      height: g,
      width: h
    } = a;
    return o ? g : h;
  }
  function m() {
    return o ? "top" : n ? "right" : "left";
  }
  function p() {
    return o ? "bottom" : n ? "left" : "right";
  }
  function l(a) {
    return a * r;
  }
  return {
    scroll: c,
    cross: s,
    startEdge: f,
    endEdge: i,
    measureSize: u,
    direction: l
  };
}
function tt(t = 0, e = 0) {
  const n = P(t - e);
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
  function f(u) {
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
    removeOffset: f
  };
}
function _t(t, e, n) {
  const {
    constrain: o
  } = tt(0, t), c = t + 1;
  let s = r(e);
  function r(l) {
    return n ? P((c + l) % c) : o(l);
  }
  function f() {
    return s;
  }
  function i(l) {
    return s = r(l), p;
  }
  function u(l) {
    return m().set(f() + l);
  }
  function m() {
    return _t(t, f(), n);
  }
  const p = {
    get: f,
    set: i,
    add: u,
    clone: m
  };
  return p;
}
function ie(t, e, n, o, c, s, r, f, i, u, m, p, l, S, a, g, h, d, y) {
  const {
    cross: b,
    direction: L
  } = t, D = ["INPUT", "SELECT", "TEXTAREA"], T = {
    passive: !1
  }, v = dt(), x = dt(), I = tt(50, 225).constrain(S.measure(20)), O = {
    mouse: 300,
    touch: 400
  }, w = {
    mouse: 500,
    touch: 600
  }, C = a ? 43 : 25;
  let V = !1, G = 0, H = 0, Z = !1, Q = !1, j = !1, Y = !1;
  function rt(E) {
    if (!y) return;
    function A(F) {
      (gt(y) || y(E, F)) && it(F);
    }
    const k = e;
    v.add(k, "dragstart", (F) => F.preventDefault(), T).add(k, "touchmove", () => {
    }, T).add(k, "touchend", () => {
    }).add(k, "touchstart", A).add(k, "mousedown", A).add(k, "touchcancel", q).add(k, "contextmenu", q).add(k, "click", U, !0);
  }
  function R() {
    v.clear(), x.clear();
  }
  function et() {
    const E = Y ? n : e;
    x.add(E, "touchmove", N, T).add(E, "touchend", q).add(E, "mousemove", N, T).add(E, "mouseup", q);
  }
  function nt(E) {
    const A = E.nodeName || "";
    return D.includes(A);
  }
  function $() {
    return (a ? w : O)[Y ? "mouse" : "touch"];
  }
  function st(E, A) {
    const k = p.add(Tt(E) * -1), F = m.byDistance(E, !a).distance;
    return a || P(E) < I ? F : h && A ? F * 0.5 : m.byIndex(k.get(), 0).distance;
  }
  function it(E) {
    const A = xt(E, o);
    Y = A, j = a && A && !E.buttons && V, V = at(c.get(), r.get()) >= 2, !(A && E.button !== 0) && (nt(E.target) || (Z = !0, s.pointerDown(E), u.useFriction(0).useDuration(0), c.set(r), et(), G = s.readPoint(E), H = s.readPoint(E, b), l.emit("pointerDown")));
  }
  function N(E) {
    if (!xt(E, o) && E.touches.length >= 2) return q(E);
    const k = s.readPoint(E), F = s.readPoint(E, b), _ = at(k, G), K = at(F, H);
    if (!Q && !Y && (!E.cancelable || (Q = _ > K, !Q)))
      return q(E);
    const J = s.pointerMove(E);
    _ > g && (j = !0), u.useFriction(0.3).useDuration(0.75), f.start(), c.add(L(J)), E.preventDefault();
  }
  function q(E) {
    const k = m.byDistance(0, !1).index !== p.get(), F = s.pointerUp(E) * $(), _ = st(L(F), k), K = ee(F, _), J = C - 10 * K, X = d + K / 50;
    Q = !1, Z = !1, x.clear(), u.useDuration(J).useFriction(X), i.distance(_, !a), Y = !1, l.emit("pointerUp");
  }
  function U(E) {
    j && (E.stopPropagation(), E.preventDefault(), j = !1);
  }
  function B() {
    return Z;
  }
  return {
    init: rt,
    destroy: R,
    pointerDown: B
  };
}
function ce(t, e) {
  let o, c;
  function s(p) {
    return p.timeStamp;
  }
  function r(p, l) {
    const a = `client${(l || t.scroll) === "x" ? "X" : "Y"}`;
    return (xt(p, e) ? p : p.touches[0])[a];
  }
  function f(p) {
    return o = p, c = p, r(p);
  }
  function i(p) {
    const l = r(p) - r(c), S = s(p) - s(o) > 170;
    return c = p, S && (o = p), l;
  }
  function u(p) {
    if (!o || !c) return 0;
    const l = r(c) - r(o), S = s(p) - s(o), a = s(p) - s(c) > 170, g = l / S;
    return S && !a && P(g) > 0.1 ? g : 0;
  }
  return {
    pointerDown: f,
    pointerMove: i,
    pointerUp: u,
    readPoint: r
  };
}
function ue() {
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
function ae(t) {
  function e(o) {
    return t * (o / 100);
  }
  return {
    measure: e
  };
}
function le(t, e, n, o, c, s, r) {
  const f = [t].concat(o);
  let i, u, m = [], p = !1;
  function l(h) {
    return c.measureSize(r.measure(h));
  }
  function S(h) {
    if (!s) return;
    u = l(t), m = o.map(l);
    function d(y) {
      for (const b of y) {
        if (p) return;
        const L = b.target === t, D = o.indexOf(b.target), T = L ? u : m[D], v = l(L ? t : o[D]);
        if (P(v - T) >= 0.5) {
          h.reInit(), e.emit("resize");
          break;
        }
      }
    }
    i = new ResizeObserver((y) => {
      (gt(s) || s(h, y)) && d(y);
    }), n.requestAnimationFrame(() => {
      f.forEach((y) => i.observe(y));
    });
  }
  function a() {
    p = !0, i && i.disconnect();
  }
  return {
    init: S,
    destroy: a
  };
}
function fe(t, e, n, o, c, s) {
  let r = 0, f = 0, i = c, u = s, m = t.get(), p = 0;
  function l() {
    const T = o.get() - t.get(), v = !i;
    let x = 0;
    return v ? (r = 0, n.set(o), t.set(o), x = T) : (n.set(t), r += T / i, r *= u, m += r, t.add(r), x = m - p), f = Tt(x), p = m, D;
  }
  function S() {
    const T = o.get() - e.get();
    return P(T) < 1e-3;
  }
  function a() {
    return i;
  }
  function g() {
    return f;
  }
  function h() {
    return r;
  }
  function d() {
    return b(c);
  }
  function y() {
    return L(s);
  }
  function b(T) {
    return i = T, D;
  }
  function L(T) {
    return u = T, D;
  }
  const D = {
    direction: g,
    duration: a,
    velocity: h,
    seek: l,
    settled: S,
    useBaseFriction: y,
    useBaseDuration: d,
    useFriction: L,
    useDuration: b
  };
  return D;
}
function de(t, e, n, o, c) {
  const s = c.measure(10), r = c.measure(50), f = tt(0.1, 0.99);
  let i = !1;
  function u() {
    return !(i || !t.reachedAny(n.get()) || !t.reachedAny(e.get()));
  }
  function m(S) {
    if (!u()) return;
    const a = t.reachedMin(e.get()) ? "min" : "max", g = P(t[a] - e.get()), h = n.get() - e.get(), d = f.constrain(g / r);
    n.subtract(h * d), !S && P(h) < s && (n.set(t.constrain(n.get())), o.useDuration(25).useBaseFriction());
  }
  function p(S) {
    i = !S;
  }
  return {
    shouldConstrain: u,
    constrain: m,
    toggleActive: p
  };
}
function pe(t, e, n, o, c) {
  const s = tt(-e + t, 0), r = p(), f = m(), i = l();
  function u(a, g) {
    return at(a, g) <= 1;
  }
  function m() {
    const a = r[0], g = z(r), h = r.lastIndexOf(a), d = r.indexOf(g) + 1;
    return tt(h, d);
  }
  function p() {
    return n.map((a, g) => {
      const {
        min: h,
        max: d
      } = s, y = s.constrain(a), b = !g, L = It(n, g);
      return b ? d : L || u(h, y) ? h : u(d, y) ? d : y;
    }).map((a) => parseFloat(a.toFixed(3)));
  }
  function l() {
    if (e <= t + c) return [s.max];
    if (o === "keepSnaps") return r;
    const {
      min: a,
      max: g
    } = f;
    return r.slice(a, g);
  }
  return {
    snapsContained: i,
    scrollContainLimit: f
  };
}
function me(t, e, n) {
  const o = e[0], c = n ? o - t : z(e);
  return {
    limit: tt(c, o)
  };
}
function ge(t, e, n, o) {
  const s = e.min + 0.1, r = e.max + 0.1, {
    reachedMin: f,
    reachedMax: i
  } = tt(s, r);
  function u(l) {
    return l === 1 ? i(n.get()) : l === -1 ? f(n.get()) : !1;
  }
  function m(l) {
    if (!u(l)) return;
    const S = t * (l * -1);
    o.forEach((a) => a.add(S));
  }
  return {
    loop: m
  };
}
function he(t) {
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
function ye(t, e, n, o, c) {
  const {
    startEdge: s,
    endEdge: r
  } = t, {
    groupSlides: f
  } = c, i = p().map(e.measure), u = l(), m = S();
  function p() {
    return f(o).map((g) => z(g)[r] - g[0][s]).map(P);
  }
  function l() {
    return o.map((g) => n[s] - g[s]).map((g) => -P(g));
  }
  function S() {
    return f(u).map((g) => g[0]).map((g, h) => g + i[h]);
  }
  return {
    snaps: u,
    snapsAligned: m
  };
}
function Se(t, e, n, o, c, s) {
  const {
    groupSlides: r
  } = c, {
    min: f,
    max: i
  } = o, u = m();
  function m() {
    const l = r(s), S = !t || e === "keepSnaps";
    return n.length === 1 ? [s] : S ? l : l.slice(f, i).map((a, g, h) => {
      const d = !g, y = It(h, g);
      if (d) {
        const b = z(h[0]) + 1;
        return Bt(b);
      }
      if (y) {
        const b = pt(s) - z(h)[0] + 1;
        return Bt(b, z(h)[0]);
      }
      return a;
    });
  }
  return {
    slideRegistry: u
  };
}
function Ee(t, e, n, o, c) {
  const {
    reachedAny: s,
    removeOffset: r,
    constrain: f
  } = o;
  function i(a) {
    return a.concat().sort((g, h) => P(g) - P(h))[0];
  }
  function u(a) {
    const g = t ? r(a) : f(a), h = e.map((y, b) => ({
      diff: m(y - g, 0),
      index: b
    })).sort((y, b) => P(y.diff) - P(b.diff)), {
      index: d
    } = h[0];
    return {
      index: d,
      distance: g
    };
  }
  function m(a, g) {
    const h = [a, a + n, a - n];
    if (!t) return a;
    if (!g) return i(h);
    const d = h.filter((y) => Tt(y) === g);
    return d.length ? i(d) : z(h) - n;
  }
  function p(a, g) {
    const h = e[a] - c.get(), d = m(h, g);
    return {
      index: a,
      distance: d
    };
  }
  function l(a, g) {
    const h = c.get() + a, {
      index: d,
      distance: y
    } = u(h), b = !t && s(h);
    if (!g || b) return {
      index: d,
      distance: a
    };
    const L = e[d] - y, D = a + m(L, 0);
    return {
      index: d,
      distance: D
    };
  }
  return {
    byDistance: l,
    byIndex: p,
    shortcut: m
  };
}
function be(t, e, n, o, c, s, r) {
  function f(p) {
    const l = p.distance, S = p.index !== e.get();
    s.add(l), l && (o.duration() ? t.start() : (t.update(), t.render(1), t.update())), S && (n.set(e.get()), e.set(p.index), r.emit("select"));
  }
  function i(p, l) {
    const S = c.byDistance(p, l);
    f(S);
  }
  function u(p, l) {
    const S = e.clone().set(p), a = c.byIndex(S.get(), l);
    f(a);
  }
  return {
    distance: i,
    index: u
  };
}
function ve(t, e, n, o, c, s, r, f) {
  const i = {
    passive: !0,
    capture: !0
  };
  let u = 0;
  function m(S) {
    if (!f) return;
    function a(g) {
      if ((/* @__PURE__ */ new Date()).getTime() - u > 10) return;
      r.emit("slideFocusStart"), t.scrollLeft = 0;
      const y = n.findIndex((b) => b.includes(g));
      Lt(y) && (c.useDuration(0), o.index(y, 0), r.emit("slideFocus"));
    }
    s.add(document, "keydown", p, !1), e.forEach((g, h) => {
      s.add(g, "focus", (d) => {
        (gt(f) || f(S, d)) && a(h);
      }, i);
    });
  }
  function p(S) {
    S.code === "Tab" && (u = (/* @__PURE__ */ new Date()).getTime());
  }
  return {
    init: m
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
    return Lt(i) ? i : i.get();
  }
  return {
    get: n,
    set: o,
    add: c,
    subtract: s
  };
}
function jt(t, e) {
  const n = t.scroll === "x" ? r : f, o = e.style;
  let c = null, s = !1;
  function r(l) {
    return `translate3d(${l}px,0px,0px)`;
  }
  function f(l) {
    return `translate3d(0px,${l}px,0px)`;
  }
  function i(l) {
    if (s) return;
    const S = ne(t.direction(l));
    S !== c && (o.transform = n(S), c = S);
  }
  function u(l) {
    s = !l;
  }
  function m() {
    s || (o.transform = "", e.getAttribute("style") || e.removeAttribute("style"));
  }
  return {
    clear: m,
    to: i,
    toggleActive: u
  };
}
function xe(t, e, n, o, c, s, r, f, i) {
  const m = lt(c), p = lt(c).reverse(), l = d().concat(y());
  function S(v, x) {
    return v.reduce((I, O) => I - c[O], x);
  }
  function a(v, x) {
    return v.reduce((I, O) => S(I, x) > 0 ? I.concat([O]) : I, []);
  }
  function g(v) {
    return s.map((x, I) => ({
      start: x - o[I] + 0.5 + v,
      end: x + e - 0.5 + v
    }));
  }
  function h(v, x, I) {
    const O = g(x);
    return v.map((w) => {
      const C = I ? 0 : -n, V = I ? n : 0, G = I ? "end" : "start", H = O[w][G];
      return {
        index: w,
        loopPoint: H,
        slideLocation: ut(-1),
        translate: jt(t, i[w]),
        target: () => f.get() > H ? C : V
      };
    });
  }
  function d() {
    const v = r[0], x = a(p, v);
    return h(x, n, !1);
  }
  function y() {
    const v = e - r[0] - 1, x = a(m, v);
    return h(x, -n, !0);
  }
  function b() {
    return l.every(({
      index: v
    }) => {
      const x = m.filter((I) => I !== v);
      return S(x, e) <= 0.1;
    });
  }
  function L() {
    l.forEach((v) => {
      const {
        target: x,
        translate: I,
        slideLocation: O
      } = v, w = x();
      w !== O.get() && (I.to(w), O.set(w));
    });
  }
  function D() {
    l.forEach((v) => v.translate.clear());
  }
  return {
    canLoop: b,
    clear: D,
    loop: L,
    loopPoints: l
  };
}
function Le(t, e, n) {
  let o, c = !1;
  function s(i) {
    if (!n) return;
    function u(m) {
      for (const p of m)
        if (p.type === "childList") {
          i.reInit(), e.emit("slidesChanged");
          break;
        }
    }
    o = new MutationObserver((m) => {
      c || (gt(n) || n(i, m)) && u(m);
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
function Te(t, e, n, o) {
  const c = {};
  let s = null, r = null, f, i = !1;
  function u() {
    f = new IntersectionObserver((a) => {
      i || (a.forEach((g) => {
        const h = e.indexOf(g.target);
        c[h] = g;
      }), s = null, r = null, n.emit("slidesInView"));
    }, {
      root: t.parentElement,
      threshold: o
    }), e.forEach((a) => f.observe(a));
  }
  function m() {
    f && f.disconnect(), i = !0;
  }
  function p(a) {
    return ft(c).reduce((g, h) => {
      const d = parseInt(h), {
        isIntersecting: y
      } = c[d];
      return (a && y || !a && !y) && g.push(d), g;
    }, []);
  }
  function l(a = !0) {
    if (a && s) return s;
    if (!a && r) return r;
    const g = p(a);
    return a && (s = g), a || (r = g), g;
  }
  return {
    init: u,
    destroy: m,
    get: l
  };
}
function Ie(t, e, n, o, c, s) {
  const {
    measureSize: r,
    startEdge: f,
    endEdge: i
  } = t, u = n[0] && c, m = a(), p = g(), l = n.map(r), S = h();
  function a() {
    if (!u) return 0;
    const y = n[0];
    return P(e[f] - y[f]);
  }
  function g() {
    if (!u) return 0;
    const y = s.getComputedStyle(z(o));
    return parseFloat(y.getPropertyValue(`margin-${i}`));
  }
  function h() {
    return n.map((y, b, L) => {
      const D = !b, T = It(L, b);
      return D ? l[b] + m : T ? l[b] + p : L[b + 1][f] - y[f];
    }).map(P);
  }
  return {
    slideSizes: l,
    slideSizesWithGaps: S,
    startGap: m,
    endGap: p
  };
}
function we(t, e, n, o, c, s, r, f, i) {
  const {
    startEdge: u,
    endEdge: m,
    direction: p
  } = t, l = Lt(n);
  function S(d, y) {
    return lt(d).filter((b) => b % y === 0).map((b) => d.slice(b, b + y));
  }
  function a(d) {
    return d.length ? lt(d).reduce((y, b, L) => {
      const D = z(y) || 0, T = D === 0, v = b === pt(d), x = c[u] - s[D][u], I = c[u] - s[b][m], O = !o && T ? p(r) : 0, w = !o && v ? p(f) : 0, C = P(I - w - (x + O));
      return L && C > e + i && y.push(b), v && y.push(d.length), y;
    }, []).map((y, b, L) => {
      const D = Math.max(L[b - 1] || 0);
      return d.slice(D, y);
    }) : [];
  }
  function g(d) {
    return l ? S(d, n) : a(d);
  }
  return {
    groupSlides: g
  };
}
function Ae(t, e, n, o, c, s, r) {
  const {
    align: f,
    axis: i,
    direction: u,
    startIndex: m,
    loop: p,
    duration: l,
    dragFree: S,
    dragThreshold: a,
    inViewThreshold: g,
    slidesToScroll: h,
    skipSnaps: d,
    containScroll: y,
    watchResize: b,
    watchSlides: L,
    watchDrag: D,
    watchFocus: T
  } = s, v = 2, x = ue(), I = x.measure(e), O = n.map(x.measure), w = se(i, u), C = w.measureSize(I), V = ae(C), G = oe(f, C), H = !p && !!y, Z = p || !!y, {
    slideSizes: Q,
    slideSizesWithGaps: j,
    startGap: Y,
    endGap: rt
  } = Ie(w, I, O, n, Z, c), R = we(w, C, h, p, I, O, Y, rt, v), {
    snaps: et,
    snapsAligned: nt
  } = ye(w, G, I, O, R), $ = -z(et) + z(j), {
    snapsContained: st,
    scrollContainLimit: it
  } = pe(C, $, nt, y, v), N = H ? st : nt, {
    limit: q
  } = me($, N, p), U = _t(pt(N), m, p), B = U.clone(), M = lt(n), E = ({
    dragHandler: ot,
    scrollBody: Et,
    scrollBounds: bt,
    options: {
      loop: mt
    }
  }) => {
    mt || bt.constrain(ot.pointerDown()), Et.seek();
  }, A = ({
    scrollBody: ot,
    translate: Et,
    location: bt,
    offsetLocation: mt,
    previousLocation: Ut,
    scrollLooper: Kt,
    slideLooper: Qt,
    dragHandler: Xt,
    animation: Zt,
    eventHandler: Pt,
    scrollBounds: Jt,
    options: {
      loop: Ot
    }
  }, kt) => {
    const qt = ot.settled(), Wt = !Jt.shouldConstrain(), Ft = Ot ? qt : qt && Wt, Ct = Ft && !Xt.pointerDown();
    Ct && Zt.stop();
    const te = bt.get() * kt + Ut.get() * (1 - kt);
    mt.set(te), Ot && (Kt.loop(ot.direction()), Qt.loop()), Et.to(mt.get()), Ct && Pt.emit("settle"), Ft || Pt.emit("scroll");
  }, k = re(o, c, () => E(St), (ot) => A(St, ot)), F = 0.68, _ = N[U.get()], K = ut(_), J = ut(_), X = ut(_), W = ut(_), ct = fe(K, X, J, W, l, F), ht = Ee(p, N, $, q, W), yt = be(k, U, B, ct, ht, W, r), At = he(q), Dt = dt(), Yt = Te(e, n, r, g), {
    slideRegistry: Mt
  } = Se(H, y, N, it, R, M), $t = ve(t, n, Mt, yt, ct, Dt, r, T), St = {
    ownerDocument: o,
    ownerWindow: c,
    eventHandler: r,
    containerRect: I,
    slideRects: O,
    animation: k,
    axis: w,
    dragHandler: ie(w, t, o, c, W, ce(w, c), K, k, yt, ct, ht, U, r, V, S, a, d, F, D),
    eventStore: Dt,
    percentOfView: V,
    index: U,
    indexPrevious: B,
    limit: q,
    location: K,
    offsetLocation: X,
    previousLocation: J,
    options: s,
    resizeHandler: le(e, r, c, n, w, b, x),
    scrollBody: ct,
    scrollBounds: de(q, X, W, ct, V),
    scrollLooper: ge($, q, X, [K, X, J, W]),
    scrollProgress: At,
    scrollSnapList: N.map(At.get),
    scrollSnaps: N,
    scrollTarget: ht,
    scrollTo: yt,
    slideLooper: xe(w, C, $, Q, j, et, N, X, n),
    slideFocus: $t,
    slidesHandler: Le(e, r, L),
    slidesInView: Yt,
    slideIndexes: M,
    slideRegistry: Mt,
    slidesToScroll: R,
    target: W,
    translate: jt(w, e)
  };
  return St;
}
function De() {
  let t = {}, e;
  function n(u) {
    e = u;
  }
  function o(u) {
    return t[u] || [];
  }
  function c(u) {
    return o(u).forEach((m) => m(e, u)), i;
  }
  function s(u, m) {
    return t[u] = o(u).concat([m]), i;
  }
  function r(u, m) {
    return t[u] = o(u).filter((p) => p !== m), i;
  }
  function f() {
    t = {};
  }
  const i = {
    init: n,
    emit: c,
    off: r,
    on: s,
    clear: f
  };
  return i;
}
const Me = {
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
function Pe(t) {
  function e(s, r) {
    return Rt(s, r || {});
  }
  function n(s) {
    const r = s.breakpoints || {}, f = ft(r).filter((i) => t.matchMedia(i).matches).map((i) => r[i]).reduce((i, u) => e(i, u), {});
    return e(s, f);
  }
  function o(s) {
    return s.map((r) => ft(r.breakpoints || {})).reduce((r, f) => r.concat(f), []).map(t.matchMedia);
  }
  return {
    mergeOptions: e,
    optionsAtMedia: n,
    optionsMediaQueries: o
  };
}
function Oe(t) {
  let e = [];
  function n(s, r) {
    return e = r.filter(({
      options: f
    }) => t.optionsAtMedia(f).active !== !1), e.forEach((f) => f.init(s, t)), r.reduce((f, i) => Object.assign(f, {
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
function wt(t, e, n) {
  const o = t.ownerDocument, c = o.defaultView, s = Pe(c), r = Oe(s), f = dt(), i = De(), {
    mergeOptions: u,
    optionsAtMedia: m,
    optionsMediaQueries: p
  } = s, {
    on: l,
    off: S,
    emit: a
  } = i, g = w;
  let h = !1, d, y = u(Me, wt.globalOptions), b = u(y), L = [], D, T, v;
  function x() {
    const {
      container: M,
      slides: E
    } = b;
    T = (vt(M) ? t.querySelector(M) : M) || t.children[0];
    const k = vt(E) ? T.querySelectorAll(E) : E;
    v = [].slice.call(k || T.children);
  }
  function I(M) {
    const E = Ae(t, T, v, o, c, M, i);
    if (M.loop && !E.slideLooper.canLoop()) {
      const A = Object.assign({}, M, {
        loop: !1
      });
      return I(A);
    }
    return E;
  }
  function O(M, E) {
    h || (y = u(y, M), b = m(y), L = E || L, x(), d = I(b), p([y, ...L.map(({
      options: A
    }) => A)]).forEach((A) => f.add(A, "change", w)), b.active && (d.translate.to(d.location.get()), d.animation.init(), d.slidesInView.init(), d.slideFocus.init(B), d.eventHandler.init(B), d.resizeHandler.init(B), d.slidesHandler.init(B), d.options.loop && d.slideLooper.loop(), T.offsetParent && v.length && d.dragHandler.init(B), D = r.init(B, L)));
  }
  function w(M, E) {
    const A = R();
    C(), O(u({
      startIndex: A
    }, M), E), i.emit("reInit");
  }
  function C() {
    d.dragHandler.destroy(), d.eventStore.clear(), d.translate.clear(), d.slideLooper.clear(), d.resizeHandler.destroy(), d.slidesHandler.destroy(), d.slidesInView.destroy(), d.animation.destroy(), r.destroy(), f.clear();
  }
  function V() {
    h || (h = !0, f.clear(), C(), i.emit("destroy"), i.clear());
  }
  function G(M, E, A) {
    !b.active || h || (d.scrollBody.useBaseFriction().useDuration(E === !0 ? 0 : b.duration), d.scrollTo.index(M, A || 0));
  }
  function H(M) {
    const E = d.index.add(1).get();
    G(E, M, -1);
  }
  function Z(M) {
    const E = d.index.add(-1).get();
    G(E, M, 1);
  }
  function Q() {
    return d.index.add(1).get() !== R();
  }
  function j() {
    return d.index.add(-1).get() !== R();
  }
  function Y() {
    return d.scrollSnapList;
  }
  function rt() {
    return d.scrollProgress.get(d.offsetLocation.get());
  }
  function R() {
    return d.index.get();
  }
  function et() {
    return d.indexPrevious.get();
  }
  function nt() {
    return d.slidesInView.get();
  }
  function $() {
    return d.slidesInView.get(!1);
  }
  function st() {
    return D;
  }
  function it() {
    return d;
  }
  function N() {
    return t;
  }
  function q() {
    return T;
  }
  function U() {
    return v;
  }
  const B = {
    canScrollNext: Q,
    canScrollPrev: j,
    containerNode: q,
    internalEngine: it,
    destroy: V,
    off: S,
    on: l,
    emit: a,
    plugins: st,
    previousScrollSnap: et,
    reInit: g,
    rootNode: N,
    scrollNext: H,
    scrollPrev: Z,
    scrollProgress: rt,
    scrollSnapList: Y,
    scrollTo: G,
    selectedScrollSnap: R,
    slideNodes: U,
    slidesInView: nt,
    slidesNotInView: $
  };
  return O(e, n), setTimeout(() => i.emit("init"), 0), B;
}
wt.globalOptions = void 0;
const ke = 100;
function zt(t) {
  const e = t.querySelector("img");
  e && (e.style.opacity = "1");
  const n = t.querySelector("video");
  if (!n) return;
  n.style.opacity = "1";
  const o = n.querySelector("source[data-src]");
  o && !o.src && o.dataset.src && (o.src = o.dataset.src, n.load()), n.readyState >= 3 ? n.play().catch(() => {
  }) : n.addEventListener("canplay", () => n.play().catch(() => {
  }), { once: !0 });
}
function qe(t) {
  var e;
  (e = t.querySelector("video")) == null || e.pause();
}
function Fe() {
  const t = document.querySelector(".header"), e = document.querySelector(".work");
  t && (t.style.opacity = "1"), setTimeout(() => {
    e && (e.style.opacity = "1", e.style.transform = "translateY(0)");
  }, ke);
  let n = null;
  document.querySelectorAll(".work-item").forEach((o) => {
    var g, h;
    const c = o.querySelector(".embla__viewport");
    if (!c) return;
    const s = wt(c, { loop: !0, watchDrag: !1, duration: 0 }), r = s.slideNodes();
    if (!r.length) return;
    const f = [...o.querySelectorAll(".dot-inner")], i = o.querySelector(".more-button"), u = o.querySelector(".embla"), m = o.querySelector(".description"), p = (d) => {
      f.forEach((y, b) => {
        var L;
        return (L = y.querySelector(".dot")) == null ? void 0 : L.classList.toggle("active", b === d);
      });
    };
    let l = !1;
    const S = () => {
      l && (l = !1, u.style.opacity = "1", u.style.pointerEvents = "auto", m.style.opacity = "0", m.style.pointerEvents = "none", i.textContent = "+", n === S && (n = null));
    };
    f.forEach((d, y) => d.addEventListener("click", () => {
      n == null || n(), s.scrollTo(y);
    }));
    let a = 0;
    zt(r[0]), p(0), s.on("select", () => {
      qe(r[a]), a = s.selectedScrollSnap(), zt(r[a]), p(a);
    }), (g = o.querySelector(".embla__prev")) == null || g.addEventListener("click", () => {
      n == null || n(), s.scrollPrev();
    }), (h = o.querySelector(".embla__next")) == null || h.addEventListener("click", () => {
      n == null || n(), s.scrollNext();
    }), o.querySelectorAll("[data-url]").forEach((d) => {
      const y = d.getAttribute("href");
      if (y)
        try {
          d.textContent = new URL(y).hostname.replace(/^www\./, "");
        } catch {
        }
    }), i && u && m && i.addEventListener("click", () => {
      !l && n && n(), l = !l, u.style.opacity = l ? "0" : "1", u.style.pointerEvents = l ? "none" : "auto", m.style.opacity = l ? "1" : "0", m.style.pointerEvents = l ? "auto" : "none", i.textContent = l ? "-" : "+", n = l ? S : null;
    });
  });
}
async function Ce() {
  const t = "c9496452bd623b32565ddf7e6973d68c", e = window.innerWidth >= 768 ? "720p" : "540p", n = 200, o = document.querySelectorAll(".work-video[vimeo-id]");
  if (!o.length) return;
  const c = [...new Set([...o].map((i) => i.getAttribute("vimeo-id")).filter(Boolean))], s = await Promise.allSettled(
    c.map(
      (i) => fetch(`https://api.vimeo.com/videos/${i}?fields=pictures,files`, {
        headers: { Authorization: `Bearer ${t}` }
      }).then((u) => u.ok ? u.json().then((m) => ({ id: i, data: m })) : { id: i, data: {} }).catch(() => ({ id: i, data: {} }))
    )
  ), r = {};
  s.forEach((i) => {
    var g;
    if (i.status !== "fulfilled") return;
    const { id: u, data: m } = i.value, p = ((g = m.pictures) == null ? void 0 : g.sizes) ?? [], l = p.find((h) => h.width >= n) ?? p[p.length - 1], S = m.files ?? [], a = S.find((h) => h.rendition === e) ?? S.find((h) => h.quality === "hd") ?? S[0];
    r[u] = { poster: (l == null ? void 0 : l.link) ?? "", mp4: (a == null ? void 0 : a.link) ?? "" };
  });
  const f = new IntersectionObserver((i, u) => {
    i.forEach((m) => {
      if (!m.isIntersecting) return;
      const p = m.target, l = r[p.getAttribute("vimeo-id")];
      if (!l) return;
      const S = p.querySelector(".video-poster");
      if (S && l.poster) {
        S.src = l.poster;
        const h = () => {
          S.style.opacity = "1";
        };
        S.complete && S.naturalWidth ? h() : S.addEventListener("load", h, { once: !0 });
      }
      const a = p.querySelector("video"), g = a == null ? void 0 : a.querySelector("source[data-src]");
      if (g && l.mp4 && !g.src) {
        g.src = l.mp4, a.load();
        const h = () => {
          a.style.opacity = "1";
        };
        a.readyState >= 2 ? h() : a.addEventListener("loadeddata", h, { once: !0 }), new IntersectionObserver(([d]) => {
          d.isIntersecting ? a.play().catch(() => {
          }) : a.pause();
        }, { threshold: 0 }).observe(a);
      }
      u.unobserve(p);
    });
  }, { rootMargin: "300px" });
  o.forEach((i) => f.observe(i));
}
const Vt = 1500, Gt = 1.25, Ne = 0.75;
let Ht;
function Be() {
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
function ze() {
  const t = document.querySelector(".footer-dot");
  if (!t) return;
  let e = null;
  const n = (o) => {
    e || (e = o);
    const c = (o - e) % Vt / Vt, s = c < 0.5 ? c * 2 : (1 - c) * 2;
    t.style.transform = `scale(${Gt - (Gt - Ne) * s})`, t.style.opacity = `${1 - s}`, requestAnimationFrame(n);
  };
  requestAnimationFrame(n);
}
const Ve = 350, Ge = 150;
function He() {
  const t = document.querySelector(".info"), e = document.querySelector("#infoButton"), n = document.querySelector(".main-wrapper"), o = document.querySelector("#infoText");
  if (!t || !e || !n) return;
  let c = !1, s = null, r = 0;
  const f = () => {
    t.style.height = "", r = t.getBoundingClientRect().height, t.style.height = `${r}px`, c && (n.style.transform = `translateY(${r}px)`);
  };
  f(), window.addEventListener("resize", f);
  const i = () => {
    c = !0, clearTimeout(s), document.body.style.overflow = "hidden", t.style.transform = "translateY(0%)", n.style.transform = `translateY(${r}px)`, e.textContent = "Close", o && (o.style.opacity = "0", s = setTimeout(() => {
      o.style.opacity = "1";
    }, Ve));
  }, u = () => {
    c = !1, clearTimeout(s), document.body.style.overflow = "", e.textContent = "Information", o ? (o.style.opacity = "0", s = setTimeout(() => {
      t.style.transform = "translateY(-100%)", n.style.transform = "translateY(0)";
    }, Ge)) : (t.style.transform = "translateY(-100%)", n.style.transform = "translateY(0)");
  };
  e.addEventListener("click", () => c ? u() : i()), document.addEventListener("keydown", (m) => {
    m.key === "Escape" && c && u();
  }), document.addEventListener("click", (m) => {
    c && !t.contains(m.target) && m.target !== e && !m.target.closest("a[href]") && u();
  }, !0);
}
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
Be();
ze();
Ce();
Fe();
He();
