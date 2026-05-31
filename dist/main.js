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
function C(t) {
  return Math.abs(t);
}
function It(t) {
  return Math.sign(t);
}
function at(t, e) {
  return C(t - e);
}
function te(t, e) {
  if (t === 0 || e === 0 || C(t) <= C(e)) return 0;
  const n = at(C(t), C(e));
  return C(n / t);
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
    const s = n[c], r = o[c], a = Bt(s) && Bt(r);
    n[c] = a ? Gt(s, r) : r;
  }), n), {});
}
function Lt(t, e) {
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
  function e(c, s, r, a = {
    passive: !0
  }) {
    let i;
    if ("addEventListener" in c)
      c.addEventListener(s, r, a), i = () => c.removeEventListener(s, r, a);
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
  let r = null, a = 0, i = 0;
  function u() {
    c.add(t, "visibilitychange", () => {
      t.hidden && l();
    });
  }
  function m() {
    y(), c.clear();
  }
  function f(h) {
    if (!i) return;
    r || (r = h, n(), n());
    const d = h - r;
    for (r = h, a += d; a >= s; )
      n(), a -= s;
    const S = a / s;
    o(S), i && (i = e.requestAnimationFrame(f));
  }
  function p() {
    i || (i = e.requestAnimationFrame(f));
  }
  function y() {
    e.cancelAnimationFrame(i), r = null, a = 0, i = 0;
  }
  function l() {
    r = null, a = 0;
  }
  return {
    init: u,
    destroy: m,
    start: p,
    stop: y,
    update: n,
    render: o
  };
}
function re(t, e) {
  const n = e === "rtl", o = t === "y", c = o ? "y" : "x", s = o ? "x" : "y", r = !o && n ? -1 : 1, a = m(), i = f();
  function u(l) {
    const {
      height: g,
      width: h
    } = l;
    return o ? g : h;
  }
  function m() {
    return o ? "top" : n ? "right" : "left";
  }
  function f() {
    return o ? "bottom" : n ? "left" : "right";
  }
  function p(l) {
    return l * r;
  }
  return {
    scroll: c,
    cross: s,
    startEdge: a,
    endEdge: i,
    measureSize: u,
    direction: p
  };
}
function tt(t = 0, e = 0) {
  const n = C(t - e);
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
  function a(u) {
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
    removeOffset: a
  };
}
function Rt(t, e, n) {
  const {
    constrain: o
  } = tt(0, t), c = t + 1;
  let s = r(e);
  function r(p) {
    return n ? C((c + p) % c) : o(p);
  }
  function a() {
    return s;
  }
  function i(p) {
    return s = r(p), f;
  }
  function u(p) {
    return m().set(a() + p);
  }
  function m() {
    return Rt(t, a(), n);
  }
  const f = {
    get: a,
    set: i,
    add: u,
    clone: m
  };
  return f;
}
function se(t, e, n, o, c, s, r, a, i, u, m, f, p, y, l, g, h, d, S) {
  const {
    cross: E,
    direction: x
  } = t, D = ["INPUT", "SELECT", "TEXTAREA"], T = {
    passive: !1
  }, b = dt(), L = dt(), I = tt(50, 225).constrain(y.measure(20)), P = {
    mouse: 300,
    touch: 400
  }, w = {
    mouse: 500,
    touch: 600
  }, F = l ? 43 : 25;
  let V = !1, H = 0, G = 0, J = !1, X = !1, Y = !1, j = !1;
  function rt(v) {
    if (!S) return;
    function k(O) {
      (gt(S) || S(v, O)) && it(O);
    }
    const q = e;
    b.add(q, "dragstart", (O) => O.preventDefault(), T).add(q, "touchmove", () => {
    }, T).add(q, "touchend", () => {
    }).add(q, "touchstart", k).add(q, "mousedown", k).add(q, "touchcancel", M).add(q, "contextmenu", M).add(q, "click", U, !0);
  }
  function R() {
    b.clear(), L.clear();
  }
  function et() {
    const v = j ? n : e;
    L.add(v, "touchmove", N, T).add(v, "touchend", M).add(v, "mousemove", N, T).add(v, "mouseup", M);
  }
  function nt(v) {
    const k = v.nodeName || "";
    return D.includes(k);
  }
  function $() {
    return (l ? w : P)[j ? "mouse" : "touch"];
  }
  function st(v, k) {
    const q = f.add(It(v) * -1), O = m.byDistance(v, !l).distance;
    return l || C(v) < I ? O : h && k ? O * 0.5 : m.byIndex(q.get(), 0).distance;
  }
  function it(v) {
    const k = Lt(v, o);
    j = k, Y = l && k && !v.buttons && V, V = at(c.get(), r.get()) >= 2, !(k && v.button !== 0) && (nt(v.target) || (J = !0, s.pointerDown(v), u.useFriction(0).useDuration(0), c.set(r), et(), H = s.readPoint(v), G = s.readPoint(v, E), p.emit("pointerDown")));
  }
  function N(v) {
    if (!Lt(v, o) && v.touches.length >= 2) return M(v);
    const q = s.readPoint(v), O = s.readPoint(v, E), _ = at(q, H), K = at(O, G);
    if (!X && !j && (!v.cancelable || (X = _ > K, !X)))
      return M(v);
    const Z = s.pointerMove(v);
    _ > g && (Y = !0), u.useFriction(0.3).useDuration(0.75), a.start(), c.add(x(Z)), v.preventDefault();
  }
  function M(v) {
    const q = m.byDistance(0, !1).index !== f.get(), O = s.pointerUp(v) * $(), _ = st(x(O), q), K = te(O, _), Z = F - 10 * K, Q = d + K / 50;
    X = !1, J = !1, L.clear(), u.useDuration(Z).useFriction(Q), i.distance(_, !l), j = !1, p.emit("pointerUp");
  }
  function U(v) {
    Y && (v.stopPropagation(), v.preventDefault(), Y = !1);
  }
  function B() {
    return J;
  }
  return {
    init: rt,
    destroy: R,
    pointerDown: B
  };
}
function ie(t, e) {
  let o, c;
  function s(f) {
    return f.timeStamp;
  }
  function r(f, p) {
    const l = `client${(p || t.scroll) === "x" ? "X" : "Y"}`;
    return (Lt(f, e) ? f : f.touches[0])[l];
  }
  function a(f) {
    return o = f, c = f, r(f);
  }
  function i(f) {
    const p = r(f) - r(c), y = s(f) - s(o) > 170;
    return c = f, y && (o = f), p;
  }
  function u(f) {
    if (!o || !c) return 0;
    const p = r(c) - r(o), y = s(f) - s(o), l = s(f) - s(c) > 170, g = p / y;
    return y && !l && C(g) > 0.1 ? g : 0;
  }
  return {
    pointerDown: a,
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
  const a = [t].concat(o);
  let i, u, m = [], f = !1;
  function p(h) {
    return c.measureSize(r.measure(h));
  }
  function y(h) {
    if (!s) return;
    u = p(t), m = o.map(p);
    function d(S) {
      for (const E of S) {
        if (f) return;
        const x = E.target === t, D = o.indexOf(E.target), T = x ? u : m[D], b = p(x ? t : o[D]);
        if (C(b - T) >= 0.5) {
          h.reInit(), e.emit("resize");
          break;
        }
      }
    }
    i = new ResizeObserver((S) => {
      (gt(s) || s(h, S)) && d(S);
    }), n.requestAnimationFrame(() => {
      a.forEach((S) => i.observe(S));
    });
  }
  function l() {
    f = !0, i && i.disconnect();
  }
  return {
    init: y,
    destroy: l
  };
}
function le(t, e, n, o, c, s) {
  let r = 0, a = 0, i = c, u = s, m = t.get(), f = 0;
  function p() {
    const T = o.get() - t.get(), b = !i;
    let L = 0;
    return b ? (r = 0, n.set(o), t.set(o), L = T) : (n.set(t), r += T / i, r *= u, m += r, t.add(r), L = m - f), a = It(L), f = m, D;
  }
  function y() {
    const T = o.get() - e.get();
    return C(T) < 1e-3;
  }
  function l() {
    return i;
  }
  function g() {
    return a;
  }
  function h() {
    return r;
  }
  function d() {
    return E(c);
  }
  function S() {
    return x(s);
  }
  function E(T) {
    return i = T, D;
  }
  function x(T) {
    return u = T, D;
  }
  const D = {
    direction: g,
    duration: l,
    velocity: h,
    seek: p,
    settled: y,
    useBaseFriction: S,
    useBaseDuration: d,
    useFriction: x,
    useDuration: E
  };
  return D;
}
function fe(t, e, n, o, c) {
  const s = c.measure(10), r = c.measure(50), a = tt(0.1, 0.99);
  let i = !1;
  function u() {
    return !(i || !t.reachedAny(n.get()) || !t.reachedAny(e.get()));
  }
  function m(y) {
    if (!u()) return;
    const l = t.reachedMin(e.get()) ? "min" : "max", g = C(t[l] - e.get()), h = n.get() - e.get(), d = a.constrain(g / r);
    n.subtract(h * d), !y && C(h) < s && (n.set(t.constrain(n.get())), o.useDuration(25).useBaseFriction());
  }
  function f(y) {
    i = !y;
  }
  return {
    shouldConstrain: u,
    constrain: m,
    toggleActive: f
  };
}
function de(t, e, n, o, c) {
  const s = tt(-e + t, 0), r = f(), a = m(), i = p();
  function u(l, g) {
    return at(l, g) <= 1;
  }
  function m() {
    const l = r[0], g = z(r), h = r.lastIndexOf(l), d = r.indexOf(g) + 1;
    return tt(h, d);
  }
  function f() {
    return n.map((l, g) => {
      const {
        min: h,
        max: d
      } = s, S = s.constrain(l), E = !g, x = wt(n, g);
      return E ? d : x || u(h, S) ? h : u(d, S) ? d : S;
    }).map((l) => parseFloat(l.toFixed(3)));
  }
  function p() {
    if (e <= t + c) return [s.max];
    if (o === "keepSnaps") return r;
    const {
      min: l,
      max: g
    } = a;
    return r.slice(l, g);
  }
  return {
    snapsContained: i,
    scrollContainLimit: a
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
    reachedMin: a,
    reachedMax: i
  } = tt(s, r);
  function u(p) {
    return p === 1 ? i(n.get()) : p === -1 ? a(n.get()) : !1;
  }
  function m(p) {
    if (!u(p)) return;
    const y = t * (p * -1);
    o.forEach((l) => l.add(y));
  }
  return {
    loop: m
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
    groupSlides: a
  } = c, i = f().map(e.measure), u = p(), m = y();
  function f() {
    return a(o).map((g) => z(g)[r] - g[0][s]).map(C);
  }
  function p() {
    return o.map((g) => n[s] - g[s]).map((g) => -C(g));
  }
  function y() {
    return a(u).map((g) => g[0]).map((g, h) => g + i[h]);
  }
  return {
    snaps: u,
    snapsAligned: m
  };
}
function ye(t, e, n, o, c, s) {
  const {
    groupSlides: r
  } = c, {
    min: a,
    max: i
  } = o, u = m();
  function m() {
    const p = r(s), y = !t || e === "keepSnaps";
    return n.length === 1 ? [s] : y ? p : p.slice(a, i).map((l, g, h) => {
      const d = !g, S = wt(h, g);
      if (d) {
        const E = z(h[0]) + 1;
        return zt(E);
      }
      if (S) {
        const E = pt(s) - z(h)[0] + 1;
        return zt(E, z(h)[0]);
      }
      return l;
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
    constrain: a
  } = o;
  function i(l) {
    return l.concat().sort((g, h) => C(g) - C(h))[0];
  }
  function u(l) {
    const g = t ? r(l) : a(l), h = e.map((S, E) => ({
      diff: m(S - g, 0),
      index: E
    })).sort((S, E) => C(S.diff) - C(E.diff)), {
      index: d
    } = h[0];
    return {
      index: d,
      distance: g
    };
  }
  function m(l, g) {
    const h = [l, l + n, l - n];
    if (!t) return l;
    if (!g) return i(h);
    const d = h.filter((S) => It(S) === g);
    return d.length ? i(d) : z(h) - n;
  }
  function f(l, g) {
    const h = e[l] - c.get(), d = m(h, g);
    return {
      index: l,
      distance: d
    };
  }
  function p(l, g) {
    const h = c.get() + l, {
      index: d,
      distance: S
    } = u(h), E = !t && s(h);
    if (!g || E) return {
      index: d,
      distance: l
    };
    const x = e[d] - S, D = l + m(x, 0);
    return {
      index: d,
      distance: D
    };
  }
  return {
    byDistance: p,
    byIndex: f,
    shortcut: m
  };
}
function ve(t, e, n, o, c, s, r) {
  function a(f) {
    const p = f.distance, y = f.index !== e.get();
    s.add(p), p && (o.duration() ? t.start() : (t.update(), t.render(1), t.update())), y && (n.set(e.get()), e.set(f.index), r.emit("select"));
  }
  function i(f, p) {
    const y = c.byDistance(f, p);
    a(y);
  }
  function u(f, p) {
    const y = e.clone().set(f), l = c.byIndex(y.get(), p);
    a(l);
  }
  return {
    distance: i,
    index: u
  };
}
function Ee(t, e, n, o, c, s, r, a) {
  const i = {
    passive: !0,
    capture: !0
  };
  let u = 0;
  function m(y) {
    if (!a) return;
    function l(g) {
      if ((/* @__PURE__ */ new Date()).getTime() - u > 10) return;
      r.emit("slideFocusStart"), t.scrollLeft = 0;
      const S = n.findIndex((E) => E.includes(g));
      Tt(S) && (c.useDuration(0), o.index(S, 0), r.emit("slideFocus"));
    }
    s.add(document, "keydown", f, !1), e.forEach((g, h) => {
      s.add(g, "focus", (d) => {
        (gt(a) || a(y, d)) && l(h);
      }, i);
    });
  }
  function f(y) {
    y.code === "Tab" && (u = (/* @__PURE__ */ new Date()).getTime());
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
  const n = t.scroll === "x" ? r : a, o = e.style;
  let c = null, s = !1;
  function r(p) {
    return `translate3d(${p}px,0px,0px)`;
  }
  function a(p) {
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
  function m() {
    s || (o.transform = "", e.getAttribute("style") || e.removeAttribute("style"));
  }
  return {
    clear: m,
    to: i,
    toggleActive: u
  };
}
function be(t, e, n, o, c, s, r, a, i) {
  const m = lt(c), f = lt(c).reverse(), p = d().concat(S());
  function y(b, L) {
    return b.reduce((I, P) => I - c[P], L);
  }
  function l(b, L) {
    return b.reduce((I, P) => y(I, L) > 0 ? I.concat([P]) : I, []);
  }
  function g(b) {
    return s.map((L, I) => ({
      start: L - o[I] + 0.5 + b,
      end: L + e - 0.5 + b
    }));
  }
  function h(b, L, I) {
    const P = g(L);
    return b.map((w) => {
      const F = I ? 0 : -n, V = I ? n : 0, H = I ? "end" : "start", G = P[w][H];
      return {
        index: w,
        loopPoint: G,
        slideLocation: ut(-1),
        translate: _t(t, i[w]),
        target: () => a.get() > G ? F : V
      };
    });
  }
  function d() {
    const b = r[0], L = l(f, b);
    return h(L, n, !1);
  }
  function S() {
    const b = e - r[0] - 1, L = l(m, b);
    return h(L, -n, !0);
  }
  function E() {
    return p.every(({
      index: b
    }) => {
      const L = m.filter((I) => I !== b);
      return y(L, e) <= 0.1;
    });
  }
  function x() {
    p.forEach((b) => {
      const {
        target: L,
        translate: I,
        slideLocation: P
      } = b, w = L();
      w !== P.get() && (I.to(w), P.set(w));
    });
  }
  function D() {
    p.forEach((b) => b.translate.clear());
  }
  return {
    canLoop: E,
    clear: D,
    loop: x,
    loopPoints: p
  };
}
function Le(t, e, n) {
  let o, c = !1;
  function s(i) {
    if (!n) return;
    function u(m) {
      for (const f of m)
        if (f.type === "childList") {
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
function xe(t, e, n, o) {
  const c = {};
  let s = null, r = null, a, i = !1;
  function u() {
    a = new IntersectionObserver((l) => {
      i || (l.forEach((g) => {
        const h = e.indexOf(g.target);
        c[h] = g;
      }), s = null, r = null, n.emit("slidesInView"));
    }, {
      root: t.parentElement,
      threshold: o
    }), e.forEach((l) => a.observe(l));
  }
  function m() {
    a && a.disconnect(), i = !0;
  }
  function f(l) {
    return ft(c).reduce((g, h) => {
      const d = parseInt(h), {
        isIntersecting: S
      } = c[d];
      return (l && S || !l && !S) && g.push(d), g;
    }, []);
  }
  function p(l = !0) {
    if (l && s) return s;
    if (!l && r) return r;
    const g = f(l);
    return l && (s = g), l || (r = g), g;
  }
  return {
    init: u,
    destroy: m,
    get: p
  };
}
function Te(t, e, n, o, c, s) {
  const {
    measureSize: r,
    startEdge: a,
    endEdge: i
  } = t, u = n[0] && c, m = l(), f = g(), p = n.map(r), y = h();
  function l() {
    if (!u) return 0;
    const S = n[0];
    return C(e[a] - S[a]);
  }
  function g() {
    if (!u) return 0;
    const S = s.getComputedStyle(z(o));
    return parseFloat(S.getPropertyValue(`margin-${i}`));
  }
  function h() {
    return n.map((S, E, x) => {
      const D = !E, T = wt(x, E);
      return D ? p[E] + m : T ? p[E] + f : x[E + 1][a] - S[a];
    }).map(C);
  }
  return {
    slideSizes: p,
    slideSizesWithGaps: y,
    startGap: m,
    endGap: f
  };
}
function Ie(t, e, n, o, c, s, r, a, i) {
  const {
    startEdge: u,
    endEdge: m,
    direction: f
  } = t, p = Tt(n);
  function y(d, S) {
    return lt(d).filter((E) => E % S === 0).map((E) => d.slice(E, E + S));
  }
  function l(d) {
    return d.length ? lt(d).reduce((S, E, x) => {
      const D = z(S) || 0, T = D === 0, b = E === pt(d), L = c[u] - s[D][u], I = c[u] - s[E][m], P = !o && T ? f(r) : 0, w = !o && b ? f(a) : 0, F = C(I - w - (L + P));
      return x && F > e + i && S.push(E), b && S.push(d.length), S;
    }, []).map((S, E, x) => {
      const D = Math.max(x[E - 1] || 0);
      return d.slice(D, S);
    }) : [];
  }
  function g(d) {
    return p ? y(d, n) : l(d);
  }
  return {
    groupSlides: g
  };
}
function we(t, e, n, o, c, s, r) {
  const {
    align: a,
    axis: i,
    direction: u,
    startIndex: m,
    loop: f,
    duration: p,
    dragFree: y,
    dragThreshold: l,
    inViewThreshold: g,
    slidesToScroll: h,
    skipSnaps: d,
    containScroll: S,
    watchResize: E,
    watchSlides: x,
    watchDrag: D,
    watchFocus: T
  } = s, b = 2, L = ce(), I = L.measure(e), P = n.map(L.measure), w = re(i, u), F = w.measureSize(I), V = ue(F), H = ne(a, F), G = !f && !!S, J = f || !!S, {
    slideSizes: X,
    slideSizesWithGaps: Y,
    startGap: j,
    endGap: rt
  } = Te(w, I, P, n, J, c), R = Ie(w, F, h, f, I, P, j, rt, b), {
    snaps: et,
    snapsAligned: nt
  } = he(w, H, I, P, R), $ = -z(et) + z(Y), {
    snapsContained: st,
    scrollContainLimit: it
  } = de(F, $, nt, S, b), N = G ? st : nt, {
    limit: M
  } = pe($, N, f), U = Rt(pt(N), m, f), B = U.clone(), A = lt(n), v = ({
    dragHandler: ot,
    scrollBody: vt,
    scrollBounds: Et,
    options: {
      loop: mt
    }
  }) => {
    mt || Et.constrain(ot.pointerDown()), vt.seek();
  }, k = ({
    scrollBody: ot,
    translate: vt,
    location: Et,
    offsetLocation: mt,
    previousLocation: $t,
    scrollLooper: Ut,
    slideLooper: Kt,
    dragHandler: Xt,
    animation: Qt,
    eventHandler: Pt,
    scrollBounds: Jt,
    options: {
      loop: qt
    }
  }, Mt) => {
    const Ot = ot.settled(), Zt = !Jt.shouldConstrain(), Ft = qt ? Ot : Ot && Zt, Nt = Ft && !Xt.pointerDown();
    Nt && Qt.stop();
    const Wt = Et.get() * Mt + $t.get() * (1 - Mt);
    mt.set(Wt), qt && (Ut.loop(ot.direction()), Kt.loop()), vt.to(mt.get()), Nt && Pt.emit("settle"), Ft || Pt.emit("scroll");
  }, q = oe(o, c, () => v(St), (ot) => k(St, ot)), O = 0.68, _ = N[U.get()], K = ut(_), Z = ut(_), Q = ut(_), W = ut(_), ct = le(K, Q, Z, W, p, O), ht = Se(f, N, $, M, W), yt = ve(q, U, B, ct, ht, W, r), Dt = ge(M), At = dt(), Yt = xe(e, n, r, g), {
    slideRegistry: Ct
  } = ye(G, S, N, it, R, A), jt = Ee(t, n, Ct, yt, ct, At, r, T), St = {
    ownerDocument: o,
    ownerWindow: c,
    eventHandler: r,
    containerRect: I,
    slideRects: P,
    animation: q,
    axis: w,
    dragHandler: se(w, t, o, c, W, ie(w, c), K, q, yt, ct, ht, U, r, V, y, l, d, O, D),
    eventStore: At,
    percentOfView: V,
    index: U,
    indexPrevious: B,
    limit: M,
    location: K,
    offsetLocation: Q,
    previousLocation: Z,
    options: s,
    resizeHandler: ae(e, r, c, n, w, E, L),
    scrollBody: ct,
    scrollBounds: fe(M, Q, W, ct, V),
    scrollLooper: me($, M, Q, [K, Q, Z, W]),
    scrollProgress: Dt,
    scrollSnapList: N.map(Dt.get),
    scrollSnaps: N,
    scrollTarget: ht,
    scrollTo: yt,
    slideLooper: be(w, F, $, X, Y, et, N, Q, n),
    slideFocus: jt,
    slidesHandler: Le(e, r, x),
    slidesInView: Yt,
    slideIndexes: A,
    slideRegistry: Ct,
    slidesToScroll: R,
    target: W,
    translate: _t(w, e)
  };
  return St;
}
function ke() {
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
    return t[u] = o(u).filter((f) => f !== m), i;
  }
  function a() {
    t = {};
  }
  const i = {
    init: n,
    emit: c,
    off: r,
    on: s,
    clear: a
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
function Ae(t) {
  function e(s, r) {
    return Gt(s, r || {});
  }
  function n(s) {
    const r = s.breakpoints || {}, a = ft(r).filter((i) => t.matchMedia(i).matches).map((i) => r[i]).reduce((i, u) => e(i, u), {});
    return e(s, a);
  }
  function o(s) {
    return s.map((r) => ft(r.breakpoints || {})).reduce((r, a) => r.concat(a), []).map(t.matchMedia);
  }
  return {
    mergeOptions: e,
    optionsAtMedia: n,
    optionsMediaQueries: o
  };
}
function Ce(t) {
  let e = [];
  function n(s, r) {
    return e = r.filter(({
      options: a
    }) => t.optionsAtMedia(a).active !== !1), e.forEach((a) => a.init(s, t)), r.reduce((a, i) => Object.assign(a, {
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
function kt(t, e, n) {
  const o = t.ownerDocument, c = o.defaultView, s = Ae(c), r = Ce(s), a = dt(), i = ke(), {
    mergeOptions: u,
    optionsAtMedia: m,
    optionsMediaQueries: f
  } = s, {
    on: p,
    off: y,
    emit: l
  } = i, g = w;
  let h = !1, d, S = u(De, kt.globalOptions), E = u(S), x = [], D, T, b;
  function L() {
    const {
      container: A,
      slides: v
    } = E;
    T = (bt(A) ? t.querySelector(A) : A) || t.children[0];
    const q = bt(v) ? T.querySelectorAll(v) : v;
    b = [].slice.call(q || T.children);
  }
  function I(A) {
    const v = we(t, T, b, o, c, A, i);
    if (A.loop && !v.slideLooper.canLoop()) {
      const k = Object.assign({}, A, {
        loop: !1
      });
      return I(k);
    }
    return v;
  }
  function P(A, v) {
    h || (S = u(S, A), E = m(S), x = v || x, L(), d = I(E), f([S, ...x.map(({
      options: k
    }) => k)]).forEach((k) => a.add(k, "change", w)), E.active && (d.translate.to(d.location.get()), d.animation.init(), d.slidesInView.init(), d.slideFocus.init(B), d.eventHandler.init(B), d.resizeHandler.init(B), d.slidesHandler.init(B), d.options.loop && d.slideLooper.loop(), T.offsetParent && b.length && d.dragHandler.init(B), D = r.init(B, x)));
  }
  function w(A, v) {
    const k = R();
    F(), P(u({
      startIndex: k
    }, A), v), i.emit("reInit");
  }
  function F() {
    d.dragHandler.destroy(), d.eventStore.clear(), d.translate.clear(), d.slideLooper.clear(), d.resizeHandler.destroy(), d.slidesHandler.destroy(), d.slidesInView.destroy(), d.animation.destroy(), r.destroy(), a.clear();
  }
  function V() {
    h || (h = !0, a.clear(), F(), i.emit("destroy"), i.clear());
  }
  function H(A, v, k) {
    !E.active || h || (d.scrollBody.useBaseFriction().useDuration(v === !0 ? 0 : E.duration), d.scrollTo.index(A, k || 0));
  }
  function G(A) {
    const v = d.index.add(1).get();
    H(v, A, -1);
  }
  function J(A) {
    const v = d.index.add(-1).get();
    H(v, A, 1);
  }
  function X() {
    return d.index.add(1).get() !== R();
  }
  function Y() {
    return d.index.add(-1).get() !== R();
  }
  function j() {
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
  function M() {
    return T;
  }
  function U() {
    return b;
  }
  const B = {
    canScrollNext: X,
    canScrollPrev: Y,
    containerNode: M,
    internalEngine: it,
    destroy: V,
    off: y,
    on: p,
    emit: l,
    plugins: st,
    previousScrollSnap: et,
    reInit: g,
    rootNode: N,
    scrollNext: G,
    scrollPrev: J,
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
kt.globalOptions = void 0;
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
function qe(t) {
  var e;
  (e = t.querySelector("video")) == null || e.pause();
}
function Me() {
  const t = document.querySelector(".header");
  t && (t.style.opacity = "1"), document.querySelectorAll(".work-list .work-item").forEach((e, n) => {
    setTimeout(() => {
      e.style.opacity = "1", e.style.transform = "translateY(0)";
    }, Pe * (n + 1));
  }), document.querySelectorAll(".work-item").forEach((e) => {
    var i, u;
    e.addEventListener("click", () => e.scrollIntoView({ behavior: "smooth", block: "center" }));
    const n = e.querySelector(".embla__viewport");
    if (!n) return;
    const o = kt(n, { loop: !0, watchDrag: !1, duration: 0 }), c = o.slideNodes();
    if (!c.length) return;
    const s = [...e.querySelectorAll(".dot-inner")], r = (m) => {
      s.forEach((f, p) => {
        var y;
        return (y = f.querySelector(".dot")) == null ? void 0 : y.classList.toggle("active", p === m);
      });
    };
    s.forEach((m, f) => m.addEventListener("click", () => o.scrollTo(f)));
    let a = 0;
    Vt(c[0]), r(0), o.on("select", () => {
      qe(c[a]), a = o.selectedScrollSnap(), Vt(c[a]), r(a);
    }), (i = e.querySelector(".embla__prev")) == null || i.addEventListener("click", () => o.scrollPrev()), (u = e.querySelector(".embla__next")) == null || u.addEventListener("click", () => o.scrollNext());
  });
}
const xt = "vimeo_cache", Oe = 600 * 1e3;
function Fe() {
  try {
    const t = sessionStorage.getItem(xt);
    if (!t) return {};
    const { ts: e, data: n } = JSON.parse(t);
    return Date.now() - e > Oe ? (sessionStorage.removeItem(xt), {}) : n;
  } catch {
    return {};
  }
}
function Ne(t) {
  try {
    sessionStorage.setItem(xt, JSON.stringify({ ts: Date.now(), data: t }));
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
      }).then((m) => m.ok ? m.json().then((f) => ({ id: u, data: f })) : { id: u, data: {} }).catch(() => ({ id: u, data: {} }))
    )
  )).forEach((u) => {
    var h;
    if (u.status !== "fulfilled") return;
    const { id: m, data: f } = u.value, p = ((h = f.pictures) == null ? void 0 : h.sizes) ?? [], y = p.find((d) => d.width >= n) ?? p[p.length - 1], l = f.files ?? [], g = l.find((d) => d.rendition === e) ?? l.find((d) => d.quality === "hd") ?? l[0];
    s[m] = { poster: (y == null ? void 0 : y.link) ?? "", mp4: (g == null ? void 0 : g.link) ?? "" };
  }), Ne(s));
  const a = new IntersectionObserver((i, u) => {
    i.forEach((m) => {
      if (!m.isIntersecting) return;
      const f = m.target, p = s[f.getAttribute("vimeo-id")];
      if (!p) return;
      const y = f.querySelector(".video-poster");
      if (y && p.poster) {
        y.src = p.poster;
        const h = () => {
          y.style.opacity = "1";
        };
        y.complete && y.naturalWidth ? h() : y.addEventListener("load", h, { once: !0 });
      }
      const l = f.querySelector("video"), g = l == null ? void 0 : l.querySelector("source[data-src]");
      if (g && p.mp4 && !g.src) {
        g.src = p.mp4, l.load();
        const h = () => {
          l.style.opacity = "1";
        };
        l.readyState >= 2 ? h() : l.addEventListener("loadeddata", h, { once: !0 }), new IntersectionObserver(([d]) => {
          d.isIntersecting ? l.play().catch(() => {
          }) : l.pause();
        }, { threshold: 0 }).observe(l);
      }
      u.unobserve(f);
    });
  }, { rootMargin: "300px" });
  o.forEach((i) => a.observe(i));
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
  const a = () => {
    t.style.height = "", r = t.getBoundingClientRect().height, t.style.height = `${r}px`, c && (n.style.transform = `translateY(${r}px)`);
  };
  a(), window.addEventListener("resize", a);
  const i = () => {
    c = !0, clearTimeout(s), document.body.style.overflow = "hidden", t.style.transform = "translateY(0%)", n.style.transform = `translateY(${r}px)`, e.textContent = "Close", o && (o.style.opacity = "0", s = setTimeout(() => {
      o.style.opacity = "1";
    }, Ve));
  }, u = () => {
    c = !1, clearTimeout(s), document.body.style.overflow = "", e.textContent = "Information", o ? (o.style.opacity = "0", s = setTimeout(() => {
      t.style.transform = "translateY(-100%)", n.style.transform = "translateY(0)";
    }, He)) : (t.style.transform = "translateY(-100%)", n.style.transform = "translateY(0)");
  };
  e.addEventListener("click", () => c ? u() : i()), document.addEventListener("keydown", (m) => {
    m.key === "Escape" && c && u();
  }), document.addEventListener("click", (m) => {
    c && !t.contains(m.target) && m.target !== e && !m.target.closest("a[href]") && u();
  }, !0);
}
function Re() {
  const t = document.querySelector("#inquiryButton"), e = document.querySelector("#closeInquiry"), n = document.querySelector(".overlay"), o = document.querySelector(".form");
  if (!t || !n || !o) return;
  let c = !1;
  const s = () => {
    c = !0, document.body.style.overflow = "hidden", n.style.opacity = "1", n.style.pointerEvents = "auto", o.style.transform = "translateX(0%)", o.style.pointerEvents = "auto";
  }, r = () => {
    c = !1, document.body.style.overflow = "", n.style.opacity = "0", n.style.pointerEvents = "none", o.style.transform = "translateX(100%)", o.style.pointerEvents = "none";
  };
  o.addEventListener("click", (a) => {
    if (a.target.matches('input[type="checkbox"]')) return;
    const i = a.target.closest(".option");
    if (!i) return;
    a.preventDefault();
    const u = i.querySelector('input[type="checkbox"]'), m = i.dataset.radio;
    if (m) {
      const f = i.classList.contains("checked");
      o.querySelectorAll(`.option[data-radio="${m}"]`).forEach((p) => {
        const y = p.querySelector('input[type="checkbox"]');
        y && (y.checked = !1), p.classList.remove("checked");
      }), f || (u && (u.checked = !0), i.classList.add("checked"));
    } else
      u && (u.checked = !u.checked), i.classList.toggle("checked");
  }), t.addEventListener("click", s), e == null || e.addEventListener("click", r), document.addEventListener("keydown", (a) => {
    a.key === "Escape" && c && r();
  }), document.addEventListener("click", (a) => {
    c && !o.contains(a.target) && a.target !== t && r();
  }, !0);
}
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
ze();
Be();
Me();
Ge();
Re();
