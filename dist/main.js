function Tt(t) {
  return typeof t == "number";
}
function xt(t) {
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
  const r = at(C(t), C(e));
  return C(r / t);
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
  return Array.from(Array(t), (r, o) => e + o);
}
function ft(t) {
  return Object.keys(t);
}
function Rt(t, e) {
  return [t, e].reduce((r, o) => (ft(o).forEach((c) => {
    const s = r[c], n = o[c], l = Bt(s) && Bt(n);
    r[c] = l ? Rt(s, n) : n;
  }), r), {});
}
function Lt(t, e) {
  return typeof e.MouseEvent < "u" && t instanceof e.MouseEvent;
}
function ne(t, e) {
  const r = {
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
  function n(i, u) {
    return xt(t) ? r[t](i) : t(e, i, u);
  }
  return {
    measure: n
  };
}
function dt() {
  let t = [];
  function e(c, s, n, l = {
    passive: !0
  }) {
    let i;
    if ("addEventListener" in c)
      c.addEventListener(s, n, l), i = () => c.removeEventListener(s, n, l);
    else {
      const u = c;
      u.addListener(n), i = () => u.removeListener(n);
    }
    return t.push(i), o;
  }
  function r() {
    t = t.filter((c) => c());
  }
  const o = {
    add: e,
    clear: r
  };
  return o;
}
function oe(t, e, r, o) {
  const c = dt(), s = 1e3 / 60;
  let n = null, l = 0, i = 0;
  function u() {
    c.add(t, "visibilitychange", () => {
      t.hidden && a();
    });
  }
  function g() {
    S(), c.clear();
  }
  function d(h) {
    if (!i) return;
    n || (n = h, r(), r());
    const f = h - n;
    for (n = h, l += f; l >= s; )
      r(), l -= s;
    const v = l / s;
    o(v), i && (i = e.requestAnimationFrame(d));
  }
  function m() {
    i || (i = e.requestAnimationFrame(d));
  }
  function S() {
    e.cancelAnimationFrame(i), n = null, l = 0, i = 0;
  }
  function a() {
    n = null, l = 0;
  }
  return {
    init: u,
    destroy: g,
    start: m,
    stop: S,
    update: r,
    render: o
  };
}
function re(t, e) {
  const r = e === "rtl", o = t === "y", c = o ? "y" : "x", s = o ? "x" : "y", n = !o && r ? -1 : 1, l = g(), i = d();
  function u(a) {
    const {
      height: p,
      width: h
    } = a;
    return o ? p : h;
  }
  function g() {
    return o ? "top" : r ? "right" : "left";
  }
  function d() {
    return o ? "bottom" : r ? "left" : "right";
  }
  function m(a) {
    return a * n;
  }
  return {
    scroll: c,
    cross: s,
    startEdge: l,
    endEdge: i,
    measureSize: u,
    direction: m
  };
}
function tt(t = 0, e = 0) {
  const r = C(t - e);
  function o(u) {
    return u < t;
  }
  function c(u) {
    return u > e;
  }
  function s(u) {
    return o(u) || c(u);
  }
  function n(u) {
    return s(u) ? o(u) ? t : e : u;
  }
  function l(u) {
    return r ? u - r * Math.ceil((u - e) / r) : u;
  }
  return {
    length: r,
    max: e,
    min: t,
    constrain: n,
    reachedAny: s,
    reachedMax: c,
    reachedMin: o,
    removeOffset: l
  };
}
function Xt(t, e, r) {
  const {
    constrain: o
  } = tt(0, t), c = t + 1;
  let s = n(e);
  function n(m) {
    return r ? C((c + m) % c) : o(m);
  }
  function l() {
    return s;
  }
  function i(m) {
    return s = n(m), d;
  }
  function u(m) {
    return g().set(l() + m);
  }
  function g() {
    return Xt(t, l(), r);
  }
  const d = {
    get: l,
    set: i,
    add: u,
    clone: g
  };
  return d;
}
function se(t, e, r, o, c, s, n, l, i, u, g, d, m, S, a, p, h, f, v) {
  const {
    cross: y,
    direction: b
  } = t, w = ["INPUT", "SELECT", "TEXTAREA"], T = {
    passive: !1
  }, x = dt(), L = dt(), I = tt(50, 225).constrain(S.measure(20)), P = {
    mouse: 300,
    touch: 400
  }, D = {
    mouse: 500,
    touch: 600
  }, F = a ? 43 : 25;
  let V = !1, H = 0, R = 0, J = !1, K = !1, _ = !1, Y = !1;
  function rt(E) {
    if (!v) return;
    function k(O) {
      (gt(v) || v(E, O)) && it(O);
    }
    const M = e;
    x.add(M, "dragstart", (O) => O.preventDefault(), T).add(M, "touchmove", () => {
    }, T).add(M, "touchend", () => {
    }).add(M, "touchstart", k).add(M, "mousedown", k).add(M, "touchcancel", q).add(M, "contextmenu", q).add(M, "click", $, !0);
  }
  function X() {
    x.clear(), L.clear();
  }
  function et() {
    const E = Y ? r : e;
    L.add(E, "touchmove", N, T).add(E, "touchend", q).add(E, "mousemove", N, T).add(E, "mouseup", q);
  }
  function nt(E) {
    const k = E.nodeName || "";
    return w.includes(k);
  }
  function j() {
    return (a ? D : P)[Y ? "mouse" : "touch"];
  }
  function st(E, k) {
    const M = d.add(It(E) * -1), O = g.byDistance(E, !a).distance;
    return a || C(E) < I ? O : h && k ? O * 0.5 : g.byIndex(M.get(), 0).distance;
  }
  function it(E) {
    const k = Lt(E, o);
    Y = k, _ = a && k && !E.buttons && V, V = at(c.get(), n.get()) >= 2, !(k && E.button !== 0) && (nt(E.target) || (J = !0, s.pointerDown(E), u.useFriction(0).useDuration(0), c.set(n), et(), H = s.readPoint(E), R = s.readPoint(E, y), m.emit("pointerDown")));
  }
  function N(E) {
    if (!Lt(E, o) && E.touches.length >= 2) return q(E);
    const M = s.readPoint(E), O = s.readPoint(E, y), G = at(M, H), U = at(O, R);
    if (!K && !Y && (!E.cancelable || (K = G > U, !K)))
      return q(E);
    const Z = s.pointerMove(E);
    G > p && (_ = !0), u.useFriction(0.3).useDuration(0.75), l.start(), c.add(b(Z)), E.preventDefault();
  }
  function q(E) {
    const M = g.byDistance(0, !1).index !== d.get(), O = s.pointerUp(E) * j(), G = st(b(O), M), U = te(O, G), Z = F - 10 * U, Q = f + U / 50;
    K = !1, J = !1, L.clear(), u.useDuration(Z).useFriction(Q), i.distance(G, !a), Y = !1, m.emit("pointerUp");
  }
  function $(E) {
    _ && (E.stopPropagation(), E.preventDefault(), _ = !1);
  }
  function B() {
    return J;
  }
  return {
    init: rt,
    destroy: X,
    pointerDown: B
  };
}
function ie(t, e) {
  let o, c;
  function s(d) {
    return d.timeStamp;
  }
  function n(d, m) {
    const a = `client${(m || t.scroll) === "x" ? "X" : "Y"}`;
    return (Lt(d, e) ? d : d.touches[0])[a];
  }
  function l(d) {
    return o = d, c = d, n(d);
  }
  function i(d) {
    const m = n(d) - n(c), S = s(d) - s(o) > 170;
    return c = d, S && (o = d), m;
  }
  function u(d) {
    if (!o || !c) return 0;
    const m = n(c) - n(o), S = s(d) - s(o), a = s(d) - s(c) > 170, p = m / S;
    return S && !a && C(p) > 0.1 ? p : 0;
  }
  return {
    pointerDown: l,
    pointerMove: i,
    pointerUp: u,
    readPoint: n
  };
}
function ce() {
  function t(r) {
    const {
      offsetTop: o,
      offsetLeft: c,
      offsetWidth: s,
      offsetHeight: n
    } = r;
    return {
      top: o,
      right: c + s,
      bottom: o + n,
      left: c,
      width: s,
      height: n
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
function ae(t, e, r, o, c, s, n) {
  const l = [t].concat(o);
  let i, u, g = [], d = !1;
  function m(h) {
    return c.measureSize(n.measure(h));
  }
  function S(h) {
    if (!s) return;
    u = m(t), g = o.map(m);
    function f(v) {
      for (const y of v) {
        if (d) return;
        const b = y.target === t, w = o.indexOf(y.target), T = b ? u : g[w], x = m(b ? t : o[w]);
        if (C(x - T) >= 0.5) {
          h.reInit(), e.emit("resize");
          break;
        }
      }
    }
    i = new ResizeObserver((v) => {
      (gt(s) || s(h, v)) && f(v);
    }), r.requestAnimationFrame(() => {
      l.forEach((v) => i.observe(v));
    });
  }
  function a() {
    d = !0, i && i.disconnect();
  }
  return {
    init: S,
    destroy: a
  };
}
function le(t, e, r, o, c, s) {
  let n = 0, l = 0, i = c, u = s, g = t.get(), d = 0;
  function m() {
    const T = o.get() - t.get(), x = !i;
    let L = 0;
    return x ? (n = 0, r.set(o), t.set(o), L = T) : (r.set(t), n += T / i, n *= u, g += n, t.add(n), L = g - d), l = It(L), d = g, w;
  }
  function S() {
    const T = o.get() - e.get();
    return C(T) < 1e-3;
  }
  function a() {
    return i;
  }
  function p() {
    return l;
  }
  function h() {
    return n;
  }
  function f() {
    return y(c);
  }
  function v() {
    return b(s);
  }
  function y(T) {
    return i = T, w;
  }
  function b(T) {
    return u = T, w;
  }
  const w = {
    direction: p,
    duration: a,
    velocity: h,
    seek: m,
    settled: S,
    useBaseFriction: v,
    useBaseDuration: f,
    useFriction: b,
    useDuration: y
  };
  return w;
}
function fe(t, e, r, o, c) {
  const s = c.measure(10), n = c.measure(50), l = tt(0.1, 0.99);
  let i = !1;
  function u() {
    return !(i || !t.reachedAny(r.get()) || !t.reachedAny(e.get()));
  }
  function g(S) {
    if (!u()) return;
    const a = t.reachedMin(e.get()) ? "min" : "max", p = C(t[a] - e.get()), h = r.get() - e.get(), f = l.constrain(p / n);
    r.subtract(h * f), !S && C(h) < s && (r.set(t.constrain(r.get())), o.useDuration(25).useBaseFriction());
  }
  function d(S) {
    i = !S;
  }
  return {
    shouldConstrain: u,
    constrain: g,
    toggleActive: d
  };
}
function de(t, e, r, o, c) {
  const s = tt(-e + t, 0), n = d(), l = g(), i = m();
  function u(a, p) {
    return at(a, p) <= 1;
  }
  function g() {
    const a = n[0], p = z(n), h = n.lastIndexOf(a), f = n.indexOf(p) + 1;
    return tt(h, f);
  }
  function d() {
    return r.map((a, p) => {
      const {
        min: h,
        max: f
      } = s, v = s.constrain(a), y = !p, b = wt(r, p);
      return y ? f : b || u(h, v) ? h : u(f, v) ? f : v;
    }).map((a) => parseFloat(a.toFixed(3)));
  }
  function m() {
    if (e <= t + c) return [s.max];
    if (o === "keepSnaps") return n;
    const {
      min: a,
      max: p
    } = l;
    return n.slice(a, p);
  }
  return {
    snapsContained: i,
    scrollContainLimit: l
  };
}
function pe(t, e, r) {
  const o = e[0], c = r ? o - t : z(e);
  return {
    limit: tt(c, o)
  };
}
function me(t, e, r, o) {
  const s = e.min + 0.1, n = e.max + 0.1, {
    reachedMin: l,
    reachedMax: i
  } = tt(s, n);
  function u(m) {
    return m === 1 ? i(r.get()) : m === -1 ? l(r.get()) : !1;
  }
  function g(m) {
    if (!u(m)) return;
    const S = t * (m * -1);
    o.forEach((a) => a.add(S));
  }
  return {
    loop: g
  };
}
function ge(t) {
  const {
    max: e,
    length: r
  } = t;
  function o(s) {
    const n = s - e;
    return r ? n / -r : 0;
  }
  return {
    get: o
  };
}
function he(t, e, r, o, c) {
  const {
    startEdge: s,
    endEdge: n
  } = t, {
    groupSlides: l
  } = c, i = d().map(e.measure), u = m(), g = S();
  function d() {
    return l(o).map((p) => z(p)[n] - p[0][s]).map(C);
  }
  function m() {
    return o.map((p) => r[s] - p[s]).map((p) => -C(p));
  }
  function S() {
    return l(u).map((p) => p[0]).map((p, h) => p + i[h]);
  }
  return {
    snaps: u,
    snapsAligned: g
  };
}
function ye(t, e, r, o, c, s) {
  const {
    groupSlides: n
  } = c, {
    min: l,
    max: i
  } = o, u = g();
  function g() {
    const m = n(s), S = !t || e === "keepSnaps";
    return r.length === 1 ? [s] : S ? m : m.slice(l, i).map((a, p, h) => {
      const f = !p, v = wt(h, p);
      if (f) {
        const y = z(h[0]) + 1;
        return zt(y);
      }
      if (v) {
        const y = pt(s) - z(h)[0] + 1;
        return zt(y, z(h)[0]);
      }
      return a;
    });
  }
  return {
    slideRegistry: u
  };
}
function Se(t, e, r, o, c) {
  const {
    reachedAny: s,
    removeOffset: n,
    constrain: l
  } = o;
  function i(a) {
    return a.concat().sort((p, h) => C(p) - C(h))[0];
  }
  function u(a) {
    const p = t ? n(a) : l(a), h = e.map((v, y) => ({
      diff: g(v - p, 0),
      index: y
    })).sort((v, y) => C(v.diff) - C(y.diff)), {
      index: f
    } = h[0];
    return {
      index: f,
      distance: p
    };
  }
  function g(a, p) {
    const h = [a, a + r, a - r];
    if (!t) return a;
    if (!p) return i(h);
    const f = h.filter((v) => It(v) === p);
    return f.length ? i(f) : z(h) - r;
  }
  function d(a, p) {
    const h = e[a] - c.get(), f = g(h, p);
    return {
      index: a,
      distance: f
    };
  }
  function m(a, p) {
    const h = c.get() + a, {
      index: f,
      distance: v
    } = u(h), y = !t && s(h);
    if (!p || y) return {
      index: f,
      distance: a
    };
    const b = e[f] - v, w = a + g(b, 0);
    return {
      index: f,
      distance: w
    };
  }
  return {
    byDistance: m,
    byIndex: d,
    shortcut: g
  };
}
function ve(t, e, r, o, c, s, n) {
  function l(d) {
    const m = d.distance, S = d.index !== e.get();
    s.add(m), m && (o.duration() ? t.start() : (t.update(), t.render(1), t.update())), S && (r.set(e.get()), e.set(d.index), n.emit("select"));
  }
  function i(d, m) {
    const S = c.byDistance(d, m);
    l(S);
  }
  function u(d, m) {
    const S = e.clone().set(d), a = c.byIndex(S.get(), m);
    l(a);
  }
  return {
    distance: i,
    index: u
  };
}
function Ee(t, e, r, o, c, s, n, l) {
  const i = {
    passive: !0,
    capture: !0
  };
  let u = 0;
  function g(S) {
    if (!l) return;
    function a(p) {
      if ((/* @__PURE__ */ new Date()).getTime() - u > 10) return;
      n.emit("slideFocusStart"), t.scrollLeft = 0;
      const v = r.findIndex((y) => y.includes(p));
      Tt(v) && (c.useDuration(0), o.index(v, 0), n.emit("slideFocus"));
    }
    s.add(document, "keydown", d, !1), e.forEach((p, h) => {
      s.add(p, "focus", (f) => {
        (gt(l) || l(S, f)) && a(h);
      }, i);
    });
  }
  function d(S) {
    S.code === "Tab" && (u = (/* @__PURE__ */ new Date()).getTime());
  }
  return {
    init: g
  };
}
function ut(t) {
  let e = t;
  function r() {
    return e;
  }
  function o(i) {
    e = n(i);
  }
  function c(i) {
    e += n(i);
  }
  function s(i) {
    e -= n(i);
  }
  function n(i) {
    return Tt(i) ? i : i.get();
  }
  return {
    get: r,
    set: o,
    add: c,
    subtract: s
  };
}
function Gt(t, e) {
  const r = t.scroll === "x" ? n : l, o = e.style;
  let c = null, s = !1;
  function n(m) {
    return `translate3d(${m}px,0px,0px)`;
  }
  function l(m) {
    return `translate3d(0px,${m}px,0px)`;
  }
  function i(m) {
    if (s) return;
    const S = ee(t.direction(m));
    S !== c && (o.transform = r(S), c = S);
  }
  function u(m) {
    s = !m;
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
function xe(t, e, r, o, c, s, n, l, i) {
  const g = lt(c), d = lt(c).reverse(), m = f().concat(v());
  function S(x, L) {
    return x.reduce((I, P) => I - c[P], L);
  }
  function a(x, L) {
    return x.reduce((I, P) => S(I, L) > 0 ? I.concat([P]) : I, []);
  }
  function p(x) {
    return s.map((L, I) => ({
      start: L - o[I] + 0.5 + x,
      end: L + e - 0.5 + x
    }));
  }
  function h(x, L, I) {
    const P = p(L);
    return x.map((D) => {
      const F = I ? 0 : -r, V = I ? r : 0, H = I ? "end" : "start", R = P[D][H];
      return {
        index: D,
        loopPoint: R,
        slideLocation: ut(-1),
        translate: Gt(t, i[D]),
        target: () => l.get() > R ? F : V
      };
    });
  }
  function f() {
    const x = n[0], L = a(d, x);
    return h(L, r, !1);
  }
  function v() {
    const x = e - n[0] - 1, L = a(g, x);
    return h(L, -r, !0);
  }
  function y() {
    return m.every(({
      index: x
    }) => {
      const L = g.filter((I) => I !== x);
      return S(L, e) <= 0.1;
    });
  }
  function b() {
    m.forEach((x) => {
      const {
        target: L,
        translate: I,
        slideLocation: P
      } = x, D = L();
      D !== P.get() && (I.to(D), P.set(D));
    });
  }
  function w() {
    m.forEach((x) => x.translate.clear());
  }
  return {
    canLoop: y,
    clear: w,
    loop: b,
    loopPoints: m
  };
}
function Le(t, e, r) {
  let o, c = !1;
  function s(i) {
    if (!r) return;
    function u(g) {
      for (const d of g)
        if (d.type === "childList") {
          i.reInit(), e.emit("slidesChanged");
          break;
        }
    }
    o = new MutationObserver((g) => {
      c || (gt(r) || r(i, g)) && u(g);
    }), o.observe(t, {
      childList: !0
    });
  }
  function n() {
    o && o.disconnect(), c = !0;
  }
  return {
    init: s,
    destroy: n
  };
}
function be(t, e, r, o) {
  const c = {};
  let s = null, n = null, l, i = !1;
  function u() {
    l = new IntersectionObserver((a) => {
      i || (a.forEach((p) => {
        const h = e.indexOf(p.target);
        c[h] = p;
      }), s = null, n = null, r.emit("slidesInView"));
    }, {
      root: t.parentElement,
      threshold: o
    }), e.forEach((a) => l.observe(a));
  }
  function g() {
    l && l.disconnect(), i = !0;
  }
  function d(a) {
    return ft(c).reduce((p, h) => {
      const f = parseInt(h), {
        isIntersecting: v
      } = c[f];
      return (a && v || !a && !v) && p.push(f), p;
    }, []);
  }
  function m(a = !0) {
    if (a && s) return s;
    if (!a && n) return n;
    const p = d(a);
    return a && (s = p), a || (n = p), p;
  }
  return {
    init: u,
    destroy: g,
    get: m
  };
}
function Te(t, e, r, o, c, s) {
  const {
    measureSize: n,
    startEdge: l,
    endEdge: i
  } = t, u = r[0] && c, g = a(), d = p(), m = r.map(n), S = h();
  function a() {
    if (!u) return 0;
    const v = r[0];
    return C(e[l] - v[l]);
  }
  function p() {
    if (!u) return 0;
    const v = s.getComputedStyle(z(o));
    return parseFloat(v.getPropertyValue(`margin-${i}`));
  }
  function h() {
    return r.map((v, y, b) => {
      const w = !y, T = wt(b, y);
      return w ? m[y] + g : T ? m[y] + d : b[y + 1][l] - v[l];
    }).map(C);
  }
  return {
    slideSizes: m,
    slideSizesWithGaps: S,
    startGap: g,
    endGap: d
  };
}
function Ie(t, e, r, o, c, s, n, l, i) {
  const {
    startEdge: u,
    endEdge: g,
    direction: d
  } = t, m = Tt(r);
  function S(f, v) {
    return lt(f).filter((y) => y % v === 0).map((y) => f.slice(y, y + v));
  }
  function a(f) {
    return f.length ? lt(f).reduce((v, y, b) => {
      const w = z(v) || 0, T = w === 0, x = y === pt(f), L = c[u] - s[w][u], I = c[u] - s[y][g], P = !o && T ? d(n) : 0, D = !o && x ? d(l) : 0, F = C(I - D - (L + P));
      return b && F > e + i && v.push(y), x && v.push(f.length), v;
    }, []).map((v, y, b) => {
      const w = Math.max(b[y - 1] || 0);
      return f.slice(w, v);
    }) : [];
  }
  function p(f) {
    return m ? S(f, r) : a(f);
  }
  return {
    groupSlides: p
  };
}
function we(t, e, r, o, c, s, n) {
  const {
    align: l,
    axis: i,
    direction: u,
    startIndex: g,
    loop: d,
    duration: m,
    dragFree: S,
    dragThreshold: a,
    inViewThreshold: p,
    slidesToScroll: h,
    skipSnaps: f,
    containScroll: v,
    watchResize: y,
    watchSlides: b,
    watchDrag: w,
    watchFocus: T
  } = s, x = 2, L = ce(), I = L.measure(e), P = r.map(L.measure), D = re(i, u), F = D.measureSize(I), V = ue(F), H = ne(l, F), R = !d && !!v, J = d || !!v, {
    slideSizes: K,
    slideSizesWithGaps: _,
    startGap: Y,
    endGap: rt
  } = Te(D, I, P, r, J, c), X = Ie(D, F, h, d, I, P, Y, rt, x), {
    snaps: et,
    snapsAligned: nt
  } = he(D, H, I, P, X), j = -z(et) + z(_), {
    snapsContained: st,
    scrollContainLimit: it
  } = de(F, j, nt, v, x), N = R ? st : nt, {
    limit: q
  } = pe(j, N, d), $ = Xt(pt(N), g, d), B = $.clone(), A = lt(r), E = ({
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
    previousLocation: jt,
    scrollLooper: $t,
    slideLooper: Ut,
    dragHandler: Kt,
    animation: Qt,
    eventHandler: Pt,
    scrollBounds: Jt,
    options: {
      loop: Mt
    }
  }, qt) => {
    const Ot = ot.settled(), Zt = !Jt.shouldConstrain(), Ft = Mt ? Ot : Ot && Zt, Nt = Ft && !Kt.pointerDown();
    Nt && Qt.stop();
    const Wt = Et.get() * qt + jt.get() * (1 - qt);
    mt.set(Wt), Mt && ($t.loop(ot.direction()), Ut.loop()), vt.to(mt.get()), Nt && Pt.emit("settle"), Ft || Pt.emit("scroll");
  }, M = oe(o, c, () => E(St), (ot) => k(St, ot)), O = 0.68, G = N[$.get()], U = ut(G), Z = ut(G), Q = ut(G), W = ut(G), ct = le(U, Q, Z, W, m, O), ht = Se(d, N, j, q, W), yt = ve(M, $, B, ct, ht, W, n), kt = ge(q), At = dt(), _t = be(e, r, n, p), {
    slideRegistry: Ct
  } = ye(R, v, N, it, X, A), Yt = Ee(t, r, Ct, yt, ct, At, n, T), St = {
    ownerDocument: o,
    ownerWindow: c,
    eventHandler: n,
    containerRect: I,
    slideRects: P,
    animation: M,
    axis: D,
    dragHandler: se(D, t, o, c, W, ie(D, c), U, M, yt, ct, ht, $, n, V, S, a, f, O, w),
    eventStore: At,
    percentOfView: V,
    index: $,
    indexPrevious: B,
    limit: q,
    location: U,
    offsetLocation: Q,
    previousLocation: Z,
    options: s,
    resizeHandler: ae(e, n, c, r, D, y, L),
    scrollBody: ct,
    scrollBounds: fe(q, Q, W, ct, V),
    scrollLooper: me(j, q, Q, [U, Q, Z, W]),
    scrollProgress: kt,
    scrollSnapList: N.map(kt.get),
    scrollSnaps: N,
    scrollTarget: ht,
    scrollTo: yt,
    slideLooper: xe(D, F, j, K, _, et, N, Q, r),
    slideFocus: Yt,
    slidesHandler: Le(e, n, b),
    slidesInView: _t,
    slideIndexes: A,
    slideRegistry: Ct,
    slidesToScroll: X,
    target: W,
    translate: Gt(D, e)
  };
  return St;
}
function De() {
  let t = {}, e;
  function r(u) {
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
  function n(u, g) {
    return t[u] = o(u).filter((d) => d !== g), i;
  }
  function l() {
    t = {};
  }
  const i = {
    init: r,
    emit: c,
    off: n,
    on: s,
    clear: l
  };
  return i;
}
const ke = {
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
  function e(s, n) {
    return Rt(s, n || {});
  }
  function r(s) {
    const n = s.breakpoints || {}, l = ft(n).filter((i) => t.matchMedia(i).matches).map((i) => n[i]).reduce((i, u) => e(i, u), {});
    return e(s, l);
  }
  function o(s) {
    return s.map((n) => ft(n.breakpoints || {})).reduce((n, l) => n.concat(l), []).map(t.matchMedia);
  }
  return {
    mergeOptions: e,
    optionsAtMedia: r,
    optionsMediaQueries: o
  };
}
function Ce(t) {
  let e = [];
  function r(s, n) {
    return e = n.filter(({
      options: l
    }) => t.optionsAtMedia(l).active !== !1), e.forEach((l) => l.init(s, t)), n.reduce((l, i) => Object.assign(l, {
      [i.name]: i
    }), {});
  }
  function o() {
    e = e.filter((s) => s.destroy());
  }
  return {
    init: r,
    destroy: o
  };
}
function Dt(t, e, r) {
  const o = t.ownerDocument, c = o.defaultView, s = Ae(c), n = Ce(s), l = dt(), i = De(), {
    mergeOptions: u,
    optionsAtMedia: g,
    optionsMediaQueries: d
  } = s, {
    on: m,
    off: S,
    emit: a
  } = i, p = D;
  let h = !1, f, v = u(ke, Dt.globalOptions), y = u(v), b = [], w, T, x;
  function L() {
    const {
      container: A,
      slides: E
    } = y;
    T = (xt(A) ? t.querySelector(A) : A) || t.children[0];
    const M = xt(E) ? T.querySelectorAll(E) : E;
    x = [].slice.call(M || T.children);
  }
  function I(A) {
    const E = we(t, T, x, o, c, A, i);
    if (A.loop && !E.slideLooper.canLoop()) {
      const k = Object.assign({}, A, {
        loop: !1
      });
      return I(k);
    }
    return E;
  }
  function P(A, E) {
    h || (v = u(v, A), y = g(v), b = E || b, L(), f = I(y), d([v, ...b.map(({
      options: k
    }) => k)]).forEach((k) => l.add(k, "change", D)), y.active && (f.translate.to(f.location.get()), f.animation.init(), f.slidesInView.init(), f.slideFocus.init(B), f.eventHandler.init(B), f.resizeHandler.init(B), f.slidesHandler.init(B), f.options.loop && f.slideLooper.loop(), T.offsetParent && x.length && f.dragHandler.init(B), w = n.init(B, b)));
  }
  function D(A, E) {
    const k = X();
    F(), P(u({
      startIndex: k
    }, A), E), i.emit("reInit");
  }
  function F() {
    f.dragHandler.destroy(), f.eventStore.clear(), f.translate.clear(), f.slideLooper.clear(), f.resizeHandler.destroy(), f.slidesHandler.destroy(), f.slidesInView.destroy(), f.animation.destroy(), n.destroy(), l.clear();
  }
  function V() {
    h || (h = !0, l.clear(), F(), i.emit("destroy"), i.clear());
  }
  function H(A, E, k) {
    !y.active || h || (f.scrollBody.useBaseFriction().useDuration(E === !0 ? 0 : y.duration), f.scrollTo.index(A, k || 0));
  }
  function R(A) {
    const E = f.index.add(1).get();
    H(E, A, -1);
  }
  function J(A) {
    const E = f.index.add(-1).get();
    H(E, A, 1);
  }
  function K() {
    return f.index.add(1).get() !== X();
  }
  function _() {
    return f.index.add(-1).get() !== X();
  }
  function Y() {
    return f.scrollSnapList;
  }
  function rt() {
    return f.scrollProgress.get(f.offsetLocation.get());
  }
  function X() {
    return f.index.get();
  }
  function et() {
    return f.indexPrevious.get();
  }
  function nt() {
    return f.slidesInView.get();
  }
  function j() {
    return f.slidesInView.get(!1);
  }
  function st() {
    return w;
  }
  function it() {
    return f;
  }
  function N() {
    return t;
  }
  function q() {
    return T;
  }
  function $() {
    return x;
  }
  const B = {
    canScrollNext: K,
    canScrollPrev: _,
    containerNode: q,
    internalEngine: it,
    destroy: V,
    off: S,
    on: m,
    emit: a,
    plugins: st,
    previousScrollSnap: et,
    reInit: p,
    rootNode: N,
    scrollNext: R,
    scrollPrev: J,
    scrollProgress: rt,
    scrollSnapList: Y,
    scrollTo: H,
    selectedScrollSnap: X,
    slideNodes: $,
    slidesInView: nt,
    slidesNotInView: j
  };
  return P(e, r), setTimeout(() => i.emit("init"), 0), B;
}
Dt.globalOptions = void 0;
const Pe = 100;
function Vt(t) {
  const e = t.querySelector("img");
  if (e) {
    const c = () => {
      e.style.opacity = "1";
    };
    e.complete && e.naturalWidth ? c() : e.addEventListener("load", c, { once: !0 });
  }
  const r = t.querySelector("video");
  if (!r) return;
  r.style.opacity = "1";
  const o = r.querySelector("source[data-src]");
  o && !o.src && o.dataset.src && (o.src = o.dataset.src, r.load()), r.readyState >= 3 ? r.play().catch(() => {
  }) : r.addEventListener("canplay", () => r.play().catch(() => {
  }), { once: !0 });
}
function Me(t) {
  var e;
  (e = t.querySelector("video")) == null || e.pause();
}
function qe() {
  const t = document.querySelector(".header");
  t && (t.style.opacity = "1"), document.querySelectorAll(".work-list .work-item").forEach((e, r) => {
    setTimeout(() => {
      e.style.opacity = "1", e.style.transform = "translateY(0)";
    }, Pe * (r + 1));
  }), document.querySelectorAll(".work-item").forEach((e) => {
    var m, S;
    e.addEventListener("click", () => e.scrollIntoView({ behavior: "smooth", block: "center" }));
    const r = e.querySelector(".embla__viewport");
    if (!r) return;
    const o = Dt(r, { loop: !0, watchDrag: !1, duration: 0 }), c = o.slideNodes();
    if (!c.length) return;
    const s = [...e.querySelectorAll(".dot-inner")], n = e.querySelector(".cursor"), l = (a) => {
      s.forEach((p, h) => {
        var f;
        return (f = p.querySelector(".dot")) == null ? void 0 : f.classList.toggle("active", h === a);
      });
    };
    function i(a) {
      if (!n) return 0;
      const p = (n.offsetParent || n.parentElement).getBoundingClientRect(), h = a.getBoundingClientRect();
      return h.left - p.left + h.width / 2;
    }
    function u(a, p = !0) {
      n && (n.style.transition = p ? "" : "none", n.style.left = i(a) + "px");
    }
    function g(a) {
      return s.reduce((p, h) => {
        const f = Math.abs(a - i(h));
        return f < p.dist ? { di: h, dist: f } : p;
      }, { di: s[0], dist: 1 / 0 }).di;
    }
    if (s.forEach((a, p) => {
      a.addEventListener("click", () => {
        u(a), o.scrollTo(p);
      });
    }), n) {
      let a = -1;
      const p = () => ({
        pr: (n.offsetParent || n.parentElement).getBoundingClientRect(),
        minX: i(s[0]),
        maxX: i(s[s.length - 1])
      }), h = () => {
        n.classList.add("is-dragging"), a = d;
      }, f = (y) => {
        const { pr: b, minX: w, maxX: T } = p(), x = Math.min(T, Math.max(w, y - b.left));
        n.style.left = x + "px";
        const L = g(x), I = s.indexOf(L);
        I !== a && (a = I, l(I), o.scrollTo(I));
      }, v = (y) => {
        n.classList.remove("is-dragging");
        const { pr: b, minX: w, maxX: T } = p(), x = Math.min(T, Math.max(w, y - b.left));
        u(g(x)), o.scrollTo(s.indexOf(g(x)));
      };
      n.addEventListener("pointerdown", (y) => {
        y.pointerType === "mouse" && (n.setPointerCapture(y.pointerId), h(), y.preventDefault());
      }), n.addEventListener("pointermove", (y) => {
        y.pointerType !== "mouse" || !n.hasPointerCapture(y.pointerId) || f(y.clientX);
      }), n.addEventListener("pointerup", (y) => {
        y.pointerType !== "mouse" || !n.hasPointerCapture(y.pointerId) || v(y.clientX);
      }), n.addEventListener("touchstart", (y) => {
        y.preventDefault(), h();
      }, { passive: !1 }), n.addEventListener("touchmove", (y) => {
        y.preventDefault(), f(y.touches[0].clientX);
      }, { passive: !1 }), n.addEventListener("touchend", (y) => {
        v(y.changedTouches[0].clientX);
      });
    }
    let d = 0;
    Vt(c[0]), l(0), o.on("select", () => {
      Me(c[d]), d = o.selectedScrollSnap(), Vt(c[d]), l(d), u(s[d]);
    }), (m = e.querySelector(".embla__prev")) == null || m.addEventListener("click", () => o.scrollPrev()), (S = e.querySelector(".embla__next")) == null || S.addEventListener("click", () => o.scrollNext());
  });
}
const bt = "vimeo_cache", Oe = 600 * 1e3;
function Fe() {
  try {
    const t = sessionStorage.getItem(bt);
    if (!t) return {};
    const { ts: e, data: r } = JSON.parse(t);
    return Date.now() - e > Oe ? (sessionStorage.removeItem(bt), {}) : r;
  } catch {
    return {};
  }
}
function Ne(t) {
  try {
    sessionStorage.setItem(bt, JSON.stringify({ ts: Date.now(), data: t }));
  } catch {
  }
}
async function Be() {
  const t = "c9496452bd623b32565ddf7e6973d68c", e = window.innerWidth >= 768 ? "1080p" : "720p", r = 200, o = document.querySelectorAll(".work-video[vimeo-id]");
  if (!o.length) return;
  const c = [...new Set([...o].map((i) => i.getAttribute("vimeo-id")).filter(Boolean))], s = Fe(), n = c.filter((i) => !s[i]);
  n.length && ((await Promise.allSettled(
    n.map(
      (u) => fetch(`https://api.vimeo.com/videos/${u}?fields=pictures,files`, {
        headers: { Authorization: `Bearer ${t}` }
      }).then((g) => g.ok ? g.json().then((d) => ({ id: u, data: d })) : { id: u, data: {} }).catch(() => ({ id: u, data: {} }))
    )
  )).forEach((u) => {
    var h;
    if (u.status !== "fulfilled") return;
    const { id: g, data: d } = u.value, m = ((h = d.pictures) == null ? void 0 : h.sizes) ?? [], S = m.find((f) => f.width >= r) ?? m[m.length - 1], a = d.files ?? [], p = a.find((f) => f.rendition === e) ?? a.find((f) => f.quality === "hd") ?? a[0];
    s[g] = { poster: (S == null ? void 0 : S.link) ?? "", mp4: (p == null ? void 0 : p.link) ?? "" };
  }), Ne(s));
  const l = new IntersectionObserver((i, u) => {
    i.forEach((g) => {
      if (!g.isIntersecting) return;
      const d = g.target, m = s[d.getAttribute("vimeo-id")];
      if (!m) return;
      const S = d.querySelector(".video-poster");
      if (S && m.poster) {
        S.src = m.poster;
        const h = () => {
          S.style.opacity = "1";
        };
        S.complete && S.naturalWidth ? h() : S.addEventListener("load", h, { once: !0 });
      }
      const a = d.querySelector("video"), p = a == null ? void 0 : a.querySelector("source[data-src]");
      if (p && m.mp4 && !p.src) {
        p.src = m.mp4, a.load();
        const h = () => {
          a.style.opacity = "1";
        };
        a.readyState >= 2 ? h() : a.addEventListener("loadeddata", h, { once: !0 }), new IntersectionObserver(([f]) => {
          f.isIntersecting ? a.play().catch(() => {
          }) : a.pause();
        }, { threshold: 0 }).observe(a);
      }
      u.unobserve(d);
    });
  }, { rootMargin: "300px" });
  o.forEach((i) => l.observe(i));
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
    const r = () => {
      e.textContent = (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !1
      });
    };
    r(), Ht = setInterval(r, 1e3);
  }
}
const Ve = 400, He = 150;
function Re() {
  const t = document.querySelector(".info"), e = document.querySelector("#infoButton"), r = document.querySelector(".main-wrapper"), o = document.querySelector("#infoText");
  if (!t || !e || !r) return;
  let c = !1, s = null, n = 0;
  const l = () => {
    t.style.height = "", n = t.getBoundingClientRect().height, t.style.height = `${n}px`, c && (r.style.transform = `translateY(${n}px)`);
  };
  l(), window.addEventListener("resize", l);
  const i = () => {
    c = !0, clearTimeout(s), document.body.style.overflow = "hidden", t.style.transform = "translateY(0%)", r.style.transform = `translateY(${n}px)`, e.textContent = "Close", o && (o.style.opacity = "0", s = setTimeout(() => {
      o.style.opacity = "1";
    }, Ve));
  }, u = () => {
    c = !1, clearTimeout(s), document.body.style.overflow = "", e.textContent = "Information", o ? (o.style.opacity = "0", s = setTimeout(() => {
      t.style.transform = "translateY(-100%)", r.style.transform = "translateY(0)";
    }, He)) : (t.style.transform = "translateY(-100%)", r.style.transform = "translateY(0)");
  };
  e.addEventListener("click", () => c ? u() : i()), document.addEventListener("keydown", (g) => {
    g.key === "Escape" && c && u();
  }), document.addEventListener("click", (g) => {
    c && !t.contains(g.target) && g.target !== e && !g.target.closest("a[href]") && u();
  }, !0);
}
function Xe() {
  const t = document.querySelector("#inquiryButton"), e = document.querySelector("#closeInquiry"), r = document.querySelector(".overlay"), o = document.querySelector(".form");
  if (!t || !r || !o) return;
  let c = !1;
  const s = () => {
    c = !0, document.body.style.overflow = "hidden", r.style.opacity = "1", r.style.pointerEvents = "auto", o.style.transform = "translateX(0%)", o.style.pointerEvents = "auto";
  }, n = () => {
    c = !1, document.body.style.overflow = "", r.style.opacity = "0", r.style.pointerEvents = "none", o.style.transform = "translateX(100%)", o.style.pointerEvents = "none";
  };
  o.addEventListener("click", (l) => {
    if (l.target.matches('input[type="checkbox"]')) return;
    const i = l.target.closest(".option");
    if (!i) return;
    l.preventDefault();
    const u = i.querySelector('input[type="checkbox"]'), g = i.dataset.radio;
    if (g) {
      const d = i.classList.contains("checked");
      o.querySelectorAll(`.option[data-radio="${g}"]`).forEach((m) => {
        const S = m.querySelector('input[type="checkbox"]');
        S && (S.checked = !1), m.classList.remove("checked");
      }), d || (u && (u.checked = !0), i.classList.add("checked"));
    } else
      u && (u.checked = !u.checked), i.classList.toggle("checked");
  }), t.addEventListener("click", s), e == null || e.addEventListener("click", n), document.addEventListener("keydown", (l) => {
    l.key === "Escape" && c && n();
  }), document.addEventListener("click", (l) => {
    c && !o.contains(l.target) && l.target !== t && n();
  }, !0);
}
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
ze();
Be();
qe();
Re();
Xe();
