const yn = /* @__PURE__ */ new WeakMap();
function vn(s, t, e, n) {
  if (!s && !yn.has(t))
    return !1;
  const i = yn.get(t) ?? /* @__PURE__ */ new WeakMap();
  yn.set(t, i);
  const r = i.get(e) ?? /* @__PURE__ */ new Set();
  i.set(e, r);
  const o = r.has(n);
  return s ? r.add(n) : r.delete(n), o && s;
}
function ls(s, t) {
  let e = s.target;
  if (e instanceof Text && (e = e.parentElement), e instanceof Element && s.currentTarget instanceof Node) {
    const n = e.closest(t);
    if (n && s.currentTarget.contains(n))
      return n;
  }
}
function cs(s, t, e, n = {}) {
  const { signal: i, base: r = document } = n;
  if (i != null && i.aborted)
    return;
  const { once: o, ...a } = n, u = r instanceof Document ? r.documentElement : r, l = !!(typeof n == "object" ? n.capture : n), c = (p) => {
    const _ = ls(p, String(s));
    if (_) {
      const f = Object.assign(p, { delegateTarget: _ });
      e.call(u, f), o && (u.removeEventListener(t, c, a), vn(!1, u, e, h));
    }
  }, h = JSON.stringify({ selector: s, type: t, capture: l });
  vn(!0, u, e, h) || u.addEventListener(t, c, a), i == null || i.addEventListener("abort", () => {
    vn(!1, u, e, h);
  });
}
function Z() {
  return Z = Object.assign ? Object.assign.bind() : function(s) {
    for (var t = 1; t < arguments.length; t++) {
      var e = arguments[t];
      for (var n in e) ({}).hasOwnProperty.call(e, n) && (s[n] = e[n]);
    }
    return s;
  }, Z.apply(null, arguments);
}
const ji = (s, t) => String(s).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || t || "", Le = ({ hash: s } = {}) => window.location.pathname + window.location.search + (s ? window.location.hash : ""), fs = (s, t = {}) => {
  const e = Z({ url: s = s || Le({ hash: !0 }), random: Math.random(), source: "swup" }, t);
  window.history.pushState(e, "", s);
}, Oe = (s = null, t = {}) => {
  s = s || Le({ hash: !0 });
  const e = Z({}, window.history.state || {}, { url: s, random: Math.random(), source: "swup" }, t);
  window.history.replaceState(e, "", s);
}, hs = (s, t, e, n) => {
  const i = new AbortController();
  return n = Z({}, n, { signal: i.signal }), cs(s, t, e, n), { destroy: () => i.abort() };
};
class lt extends URL {
  constructor(t, e = document.baseURI) {
    super(t.toString(), e), Object.setPrototypeOf(this, lt.prototype);
  }
  get url() {
    return this.pathname + this.search;
  }
  static fromElement(t) {
    const e = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
    return new lt(e);
  }
  static fromUrl(t) {
    return new lt(t);
  }
}
class Xe extends Error {
  constructor(t, e) {
    super(t), this.url = void 0, this.status = void 0, this.aborted = void 0, this.timedOut = void 0, this.name = "FetchError", this.url = e.url, this.status = e.status, this.aborted = e.aborted || !1, this.timedOut = e.timedOut || !1;
  }
}
async function ds(s, t = {}) {
  var e;
  s = lt.fromUrl(s).url;
  const { visit: n = this.visit } = t, i = Z({}, this.options.requestHeaders, t.headers), r = (e = t.timeout) != null ? e : this.options.timeout, o = new AbortController(), { signal: a } = o;
  t = Z({}, t, { headers: i, signal: a });
  let u, l = !1, c = null;
  r && r > 0 && (c = setTimeout(() => {
    l = !0, o.abort("timeout");
  }, r));
  try {
    u = await this.hooks.call("fetch:request", n, { url: s, options: t }, (m, { url: g, options: y }) => fetch(g, y)), c && clearTimeout(c);
  } catch (m) {
    throw l ? (this.hooks.call("fetch:timeout", n, { url: s }), new Xe(`Request timed out: ${s}`, { url: s, timedOut: l })) : (m == null ? void 0 : m.name) === "AbortError" || a.aborted ? new Xe(`Request aborted: ${s}`, { url: s, aborted: !0 }) : m;
  }
  const { status: h, url: d } = u, p = await u.text();
  if (h === 500) throw this.hooks.call("fetch:error", n, { status: h, response: u, url: d }), new Xe(`Server error: ${d}`, { status: h, url: d });
  if (!p) throw new Xe(`Empty response: ${d}`, { status: h, url: d });
  const { url: _ } = lt.fromUrl(d), f = { url: _, html: p };
  return !n.cache.write || t.method && t.method !== "GET" || s !== _ || this.cache.set(f.url, f), f;
}
class ps {
  constructor(t) {
    this.swup = void 0, this.pages = /* @__PURE__ */ new Map(), this.swup = t;
  }
  get size() {
    return this.pages.size;
  }
  get all() {
    const t = /* @__PURE__ */ new Map();
    return this.pages.forEach((e, n) => {
      t.set(n, Z({}, e));
    }), t;
  }
  has(t) {
    return this.pages.has(this.resolve(t));
  }
  get(t) {
    const e = this.pages.get(this.resolve(t));
    return e && Z({}, e);
  }
  set(t, e) {
    e = Z({}, e, { url: t = this.resolve(t) }), this.pages.set(t, e), this.swup.hooks.callSync("cache:set", void 0, { page: e });
  }
  update(t, e) {
    t = this.resolve(t);
    const n = Z({}, this.get(t), e, { url: t });
    this.pages.set(t, n);
  }
  delete(t) {
    this.pages.delete(this.resolve(t));
  }
  clear() {
    this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0, void 0);
  }
  prune(t) {
    this.pages.forEach((e, n) => {
      t(n, e) && this.delete(n);
    });
  }
  resolve(t) {
    const { url: e } = lt.fromUrl(t);
    return this.swup.resolveUrl(e);
  }
}
const Cn = (s, t = document) => t.querySelector(s), Gn = (s, t = document) => Array.from(t.querySelectorAll(s)), Ki = () => new Promise((s) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      s();
    });
  });
});
function Qi(s) {
  return !!s && (typeof s == "object" || typeof s == "function") && typeof s.then == "function";
}
function _s(s, t = []) {
  return new Promise((e, n) => {
    const i = s(...t);
    Qi(i) ? i.then(e, n) : e(i);
  });
}
function Ti(s, t) {
  const e = s == null ? void 0 : s.closest(`[${t}]`);
  return e != null && e.hasAttribute(t) ? (e == null ? void 0 : e.getAttribute(t)) || !0 : void 0;
}
class ms {
  constructor(t) {
    this.swup = void 0, this.swupClasses = ["to-", "is-changing", "is-rendering", "is-popstate", "is-animating", "is-leaving"], this.swup = t;
  }
  get selectors() {
    const { scope: t } = this.swup.visit.animation;
    return t === "containers" ? this.swup.visit.containers : t === "html" ? ["html"] : Array.isArray(t) ? t : [];
  }
  get selector() {
    return this.selectors.join(",");
  }
  get targets() {
    return this.selector.trim() ? Gn(this.selector) : [];
  }
  add(...t) {
    this.targets.forEach((e) => e.classList.add(...t));
  }
  remove(...t) {
    this.targets.forEach((e) => e.classList.remove(...t));
  }
  clear() {
    this.targets.forEach((t) => {
      const e = t.className.split(" ").filter((n) => this.isSwupClass(n));
      t.classList.remove(...e);
    });
  }
  isSwupClass(t) {
    return this.swupClasses.some((e) => t.startsWith(e));
  }
}
class Zi {
  constructor(t, e) {
    this.id = void 0, this.state = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, this.animation = void 0, this.trigger = void 0, this.cache = void 0, this.history = void 0, this.scroll = void 0, this.meta = void 0;
    const { to: n, from: i, hash: r, el: o, event: a } = e;
    this.id = Math.random(), this.state = 1, this.from = { url: i ?? t.location.url, hash: t.location.hash }, this.to = { url: n, hash: r }, this.containers = t.options.containers, this.animation = { animate: !0, wait: !1, name: void 0, native: t.options.native, scope: t.options.animationScope, selector: t.options.animationSelector }, this.trigger = { el: o, event: a }, this.cache = { read: t.options.cache, write: t.options.cache }, this.history = { action: "push", popstate: !1, direction: void 0 }, this.scroll = { reset: !0, target: void 0 }, this.meta = {};
  }
  advance(t) {
    this.state < t && (this.state = t);
  }
  abort() {
    this.state = 8;
  }
  get done() {
    return this.state >= 7;
  }
}
function gs(s) {
  return new Zi(this, s);
}
class ys {
  constructor(t) {
    this.swup = void 0, this.registry = /* @__PURE__ */ new Map(), this.hooks = ["animation:out:start", "animation:out:await", "animation:out:end", "animation:in:start", "animation:in:await", "animation:in:end", "animation:skip", "cache:clear", "cache:set", "content:replace", "content:scroll", "enable", "disable", "fetch:request", "fetch:error", "fetch:timeout", "history:popstate", "link:click", "link:self", "link:anchor", "link:newtab", "page:load", "page:view", "scroll:top", "scroll:anchor", "visit:start", "visit:transition", "visit:abort", "visit:end"], this.swup = t, this.init();
  }
  init() {
    this.hooks.forEach((t) => this.create(t));
  }
  create(t) {
    this.registry.has(t) || this.registry.set(t, /* @__PURE__ */ new Map());
  }
  exists(t) {
    return this.registry.has(t);
  }
  get(t) {
    const e = this.registry.get(t);
    if (e) return e;
    console.error(`Unknown hook '${t}'`);
  }
  clear() {
    this.registry.forEach((t) => t.clear());
  }
  on(t, e, n = {}) {
    const i = this.get(t);
    if (!i) return console.warn(`Hook '${t}' not found.`), () => {
    };
    const r = Z({}, n, { id: i.size + 1, hook: t, handler: e });
    return i.set(e, r), () => this.off(t, e);
  }
  before(t, e, n = {}) {
    return this.on(t, e, Z({}, n, { before: !0 }));
  }
  replace(t, e, n = {}) {
    return this.on(t, e, Z({}, n, { replace: !0 }));
  }
  once(t, e, n = {}) {
    return this.on(t, e, Z({}, n, { once: !0 }));
  }
  off(t, e) {
    const n = this.get(t);
    n && e ? n.delete(e) || console.warn(`Handler for hook '${t}' not found.`) : n && n.clear();
  }
  async call(t, e, n, i) {
    const [r, o, a] = this.parseCallArgs(t, e, n, i), { before: u, handler: l, after: c } = this.getHandlers(t, a);
    await this.run(u, r, o);
    const [h] = await this.run(l, r, o, !0);
    return await this.run(c, r, o), this.dispatchDomEvent(t, r, o), h;
  }
  callSync(t, e, n, i) {
    const [r, o, a] = this.parseCallArgs(t, e, n, i), { before: u, handler: l, after: c } = this.getHandlers(t, a);
    this.runSync(u, r, o);
    const [h] = this.runSync(l, r, o, !0);
    return this.runSync(c, r, o), this.dispatchDomEvent(t, r, o), h;
  }
  parseCallArgs(t, e, n, i) {
    return e instanceof Zi || typeof e != "object" && typeof n != "function" ? [e, n, i] : [void 0, e, n];
  }
  async run(t, e = this.swup.visit, n, i = !1) {
    const r = [];
    for (const { hook: o, handler: a, defaultHandler: u, once: l } of t) if (e == null || !e.done) {
      l && this.off(o, a);
      try {
        const c = await _s(a, [e, n, u]);
        r.push(c);
      } catch (c) {
        if (i) throw c;
        console.error(`Error in hook '${o}':`, c);
      }
    }
    return r;
  }
  runSync(t, e = this.swup.visit, n, i = !1) {
    const r = [];
    for (const { hook: o, handler: a, defaultHandler: u, once: l } of t) if (e == null || !e.done) {
      l && this.off(o, a);
      try {
        const c = a(e, n, u);
        r.push(c), Qi(c) && console.warn(`Swup will not await Promises in handler for synchronous hook '${o}'.`);
      } catch (c) {
        if (i) throw c;
        console.error(`Error in hook '${o}':`, c);
      }
    }
    return r;
  }
  getHandlers(t, e) {
    const n = this.get(t);
    if (!n) return { found: !1, before: [], handler: [], after: [], replaced: !1 };
    const i = Array.from(n.values()), r = this.sortRegistrations, o = i.filter(({ before: h, replace: d }) => h && !d).sort(r), a = i.filter(({ replace: h }) => h).filter((h) => !0).sort(r), u = i.filter(({ before: h, replace: d }) => !h && !d).sort(r), l = a.length > 0;
    let c = [];
    if (e && (c = [{ id: 0, hook: t, handler: e }], l)) {
      const h = a.length - 1, { handler: d, once: p } = a[h], _ = (f) => {
        const m = a[f - 1];
        return m ? (g, y) => m.handler(g, y, _(f - 1)) : e;
      };
      c = [{ id: 0, hook: t, once: p, handler: d, defaultHandler: _(h) }];
    }
    return { found: !0, before: o, handler: c, after: u, replaced: l };
  }
  sortRegistrations(t, e) {
    var n, i;
    return ((n = t.priority) != null ? n : 0) - ((i = e.priority) != null ? i : 0) || t.id - e.id || 0;
  }
  dispatchDomEvent(t, e, n) {
    if (e != null && e.done) return;
    const i = { hook: t, args: n, visit: e || this.swup.visit };
    document.dispatchEvent(new CustomEvent("swup:any", { detail: i, bubbles: !0 })), document.dispatchEvent(new CustomEvent(`swup:${t}`, { detail: i, bubbles: !0 }));
  }
  parseName(t) {
    const [e, ...n] = t.split(".");
    return [e, n.reduce((i, r) => Z({}, i, { [r]: !0 }), {})];
  }
}
const vs = (s) => {
  if (s && s.charAt(0) === "#" && (s = s.substring(1)), !s) return null;
  const t = decodeURIComponent(s);
  let e = document.getElementById(s) || document.getElementById(t) || Cn(`a[name='${CSS.escape(s)}']`) || Cn(`a[name='${CSS.escape(t)}']`);
  return e || s !== "top" || (e = document.body), e;
}, je = "transition", wn = "animation";
async function ws({ selector: s, elements: t }) {
  if (s === !1 && !t) return;
  let e = [];
  if (t) e = Array.from(t);
  else if (s && (e = Gn(s, document.body), !e.length)) return void console.warn(`[swup] No elements found matching animationSelector \`${s}\``);
  const n = e.map((i) => (function(r) {
    const { type: o, timeout: a, propCount: u } = (function(l) {
      const c = window.getComputedStyle(l), h = Ke(c, `${je}Delay`), d = Ke(c, `${je}Duration`), p = ki(h, d), _ = Ke(c, `${wn}Delay`), f = Ke(c, `${wn}Duration`), m = ki(_, f), g = Math.max(p, m), y = g > 0 ? p > m ? je : wn : null;
      return { type: y, timeout: g, propCount: y ? y === je ? d.length : f.length : 0 };
    })(r);
    return !(!o || !a) && new Promise((l) => {
      const c = `${o}end`, h = performance.now();
      let d = 0;
      const p = () => {
        r.removeEventListener(c, _), l();
      }, _ = (f) => {
        f.target === r && ((performance.now() - h) / 1e3 < f.elapsedTime || ++d >= u && p());
      };
      setTimeout(() => {
        d < u && p();
      }, a + 1), r.addEventListener(c, _);
    });
  })(i));
  n.filter(Boolean).length > 0 ? await Promise.all(n) : s && console.warn(`[swup] No CSS animation duration defined on elements matching \`${s}\``);
}
function Ke(s, t) {
  return (s[t] || "").split(", ");
}
function ki(s, t) {
  for (; s.length < t.length; ) s = s.concat(s);
  return Math.max(...t.map((e, n) => Ei(e) + Ei(s[n])));
}
function Ei(s) {
  return 1e3 * parseFloat(s);
}
function xs(s, t = {}, e = {}) {
  if (typeof s != "string") throw new Error("swup.navigate() requires a URL parameter");
  if (this.shouldIgnoreVisit(s, { el: e.el, event: e.event })) return void window.location.assign(s);
  const { url: n, hash: i } = lt.fromUrl(s), r = this.createVisit(Z({}, e, { to: n, hash: i }));
  this.performNavigation(r, t);
}
async function Ss(s, t = {}) {
  if (this.navigating) {
    if (this.visit.state >= 6) return s.state = 2, void (this.onVisitEnd = () => this.performNavigation(s, t));
    await this.hooks.call("visit:abort", this.visit, void 0), delete this.visit.to.document, this.visit.state = 8;
  }
  this.navigating = !0, this.visit = s;
  const { el: e } = s.trigger;
  t.referrer = t.referrer || this.location.url, t.animate === !1 && (s.animation.animate = !1), s.animation.animate || this.classes.clear();
  const n = t.history || Ti(e, "data-swup-history");
  typeof n == "string" && ["push", "replace"].includes(n) && (s.history.action = n);
  const i = t.animation || Ti(e, "data-swup-animation");
  var r, o;
  typeof i == "string" && (s.animation.name = i), s.meta = t.meta || {}, typeof t.cache == "object" ? (s.cache.read = (r = t.cache.read) != null ? r : s.cache.read, s.cache.write = (o = t.cache.write) != null ? o : s.cache.write) : t.cache !== void 0 && (s.cache = { read: !!t.cache, write: !!t.cache }), delete t.cache;
  try {
    await this.hooks.call("visit:start", s, void 0), s.state = 3;
    const a = this.hooks.call("page:load", s, { options: t }, async (l, c) => {
      let h;
      return l.cache.read && (h = this.cache.get(l.to.url)), c.page = h || await this.fetchPage(l.to.url, c.options), c.cache = !!h, c.page;
    });
    a.then(({ html: l }) => {
      s.advance(5), s.to.html = l, s.to.document = new DOMParser().parseFromString(l, "text/html");
    });
    const u = s.to.url + s.to.hash;
    if (s.history.popstate || (s.history.action === "replace" || s.to.url === this.location.url ? Oe(u) : (this.currentHistoryIndex++, fs(u, { index: this.currentHistoryIndex }))), this.location = lt.fromUrl(u), s.history.popstate && this.classes.add("is-popstate"), s.animation.name && this.classes.add(`to-${ji(s.animation.name)}`), s.animation.wait && await a, s.done || (await this.hooks.call("visit:transition", s, void 0, async () => {
      if (!s.animation.animate) return await this.hooks.call("animation:skip", void 0), void await this.renderPage(s, await a);
      s.advance(4), await this.animatePageOut(s), s.animation.native && document.startViewTransition ? await document.startViewTransition(async () => await this.renderPage(s, await a)).finished : await this.renderPage(s, await a), await this.animatePageIn(s);
    }), s.done)) return;
    await this.hooks.call("visit:end", s, void 0, () => this.classes.clear()), s.state = 7, this.navigating = !1, this.onVisitEnd && (this.onVisitEnd(), this.onVisitEnd = void 0);
  } catch (a) {
    if (!a || a != null && a.aborted) return void (s.state = 8);
    s.state = 9, console.error(a), this.options.skipPopStateHandling = () => (window.location.assign(s.to.url + s.to.hash), !0), window.history.back();
  } finally {
    delete s.to.document;
  }
}
const bs = async function(s) {
  await this.hooks.call("animation:out:start", s, void 0, () => {
    this.classes.add("is-changing", "is-animating", "is-leaving");
  }), await this.hooks.call("animation:out:await", s, { skip: !1 }, (t, { skip: e }) => {
    if (!e) return this.awaitAnimations({ selector: t.animation.selector });
  }), await this.hooks.call("animation:out:end", s, void 0);
}, Ts = function(s) {
  var t;
  const e = s.to.document;
  if (!e) return !1;
  const n = ((t = e.querySelector("title")) == null ? void 0 : t.innerText) || "";
  document.title = n;
  const i = Gn('[data-swup-persist]:not([data-swup-persist=""])'), r = s.containers.map((o) => {
    const a = document.querySelector(o), u = e.querySelector(o);
    return a && u ? (a.replaceWith(u.cloneNode(!0)), !0) : (a || console.warn(`[swup] Container missing in current document: ${o}`), u || console.warn(`[swup] Container missing in incoming document: ${o}`), !1);
  }).filter(Boolean);
  return i.forEach((o) => {
    const a = o.getAttribute("data-swup-persist"), u = Cn(`[data-swup-persist="${a}"]`);
    u && u !== o && u.replaceWith(o);
  }), r.length === s.containers.length;
}, ks = function(s) {
  const t = { behavior: "auto" }, { target: e, reset: n } = s.scroll, i = e ?? s.to.hash;
  let r = !1;
  return i && (r = this.hooks.callSync("scroll:anchor", s, { hash: i, options: t }, (o, { hash: a, options: u }) => {
    const l = this.getAnchorElement(a);
    return l && l.scrollIntoView(u), !!l;
  })), n && !r && (r = this.hooks.callSync("scroll:top", s, { options: t }, (o, { options: a }) => (window.scrollTo(Z({ top: 0, left: 0 }, a)), !0))), r;
}, Es = async function(s) {
  if (s.done) return;
  const t = this.hooks.call("animation:in:await", s, { skip: !1 }, (e, { skip: n }) => {
    if (!n) return this.awaitAnimations({ selector: e.animation.selector });
  });
  await Ki(), await this.hooks.call("animation:in:start", s, void 0, () => {
    this.classes.remove("is-animating");
  }), await t, await this.hooks.call("animation:in:end", s, void 0);
}, Ps = async function(s, t) {
  if (s.done) return;
  s.advance(6);
  const { url: e } = t;
  this.isSameResolvedUrl(Le(), e) || (Oe(e), this.location = lt.fromUrl(e), s.to.url = this.location.url, s.to.hash = this.location.hash), await this.hooks.call("content:replace", s, { page: t }, (n, {}) => {
    if (this.classes.remove("is-leaving"), n.animation.animate && this.classes.add("is-rendering"), !this.replaceContent(n)) throw new Error("[swup] Container mismatch, aborting");
    n.animation.animate && (this.classes.add("is-changing", "is-animating", "is-rendering"), n.animation.name && this.classes.add(`to-${ji(n.animation.name)}`));
  }), await this.hooks.call("content:scroll", s, void 0, () => this.scrollToContent(s)), await this.hooks.call("page:view", s, { url: this.location.url, title: document.title });
}, Os = function(s) {
  var t;
  if (t = s, !!(t != null && t.isSwupPlugin)) {
    if (s.swup = this, !s._checkRequirements || s._checkRequirements()) return s._beforeMount && s._beforeMount(), s.mount(), this.plugins.push(s), this.plugins;
  } else console.error("Not a swup plugin instance", s);
};
function Cs(s) {
  const t = this.findPlugin(s);
  if (t) return t.unmount(), t._afterUnmount && t._afterUnmount(), this.plugins = this.plugins.filter((e) => e !== t), this.plugins;
  console.error("No such plugin", t);
}
function Ms(s) {
  return this.plugins.find((t) => t === s || t.name === s || t.name === `Swup${String(s)}`);
}
function As(s) {
  if (typeof this.options.resolveUrl != "function") return console.warn("[swup] options.resolveUrl expects a callback function."), s;
  const t = this.options.resolveUrl(s);
  return t && typeof t == "string" ? t.startsWith("//") || t.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), s) : t : (console.warn("[swup] options.resolveUrl needs to return a url"), s);
}
function Ds(s, t) {
  return this.resolveUrl(s) === this.resolveUrl(t);
}
const Ls = { animateHistoryBrowsing: !1, animationSelector: '[class*="transition-"]', animationScope: "html", cache: !0, containers: ["#swup"], hooks: {}, ignoreVisit: (s, { el: t } = {}) => !(t == null || !t.closest("[data-no-swup]")), linkSelector: "a[href]", linkToSelf: "scroll", native: !1, plugins: [], resolveUrl: (s) => s, requestHeaders: { "X-Requested-With": "swup", Accept: "text/html, application/xhtml+xml" }, skipPopStateHandling: (s) => {
  var t;
  return ((t = s.state) == null ? void 0 : t.source) !== "swup";
}, timeout: 0 };
class Rs {
  get currentPageUrl() {
    return this.location.url;
  }
  constructor(t = {}) {
    var e, n;
    this.version = "4.8.3", this.options = void 0, this.defaults = Ls, this.plugins = [], this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, this.location = lt.fromUrl(window.location.href), this.currentHistoryIndex = void 0, this.clickDelegate = void 0, this.navigating = !1, this.onVisitEnd = void 0, this.use = Os, this.unuse = Cs, this.findPlugin = Ms, this.log = () => {
    }, this.navigate = xs, this.performNavigation = Ss, this.createVisit = gs, this.delegateEvent = hs, this.fetchPage = ds, this.awaitAnimations = ws, this.renderPage = Ps, this.replaceContent = Ts, this.animatePageIn = Es, this.animatePageOut = bs, this.scrollToContent = ks, this.getAnchorElement = vs, this.getCurrentUrl = Le, this.resolveUrl = As, this.isSameResolvedUrl = Ds, this.options = Z({}, this.defaults, t), this.handleLinkClick = this.handleLinkClick.bind(this), this.handlePopState = this.handlePopState.bind(this), this.cache = new ps(this), this.classes = new ms(this), this.hooks = new ys(this), this.visit = this.createVisit({ to: "" }), this.currentHistoryIndex = (e = (n = window.history.state) == null ? void 0 : n.index) != null ? e : 1, this.enable();
  }
  async enable() {
    var t;
    const { linkSelector: e } = this.options;
    this.clickDelegate = this.delegateEvent(e, "click", this.handleLinkClick), window.addEventListener("popstate", this.handlePopState), this.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), this.options.native = this.options.native && !!document.startViewTransition, this.options.plugins.forEach((n) => this.use(n));
    for (const [n, i] of Object.entries(this.options.hooks)) {
      const [r, o] = this.hooks.parseName(n);
      this.hooks.on(r, i, o);
    }
    ((t = window.history.state) == null ? void 0 : t.source) !== "swup" && Oe(null, { index: this.currentHistoryIndex }), await Ki(), await this.hooks.call("enable", void 0, void 0, () => {
      const n = document.documentElement;
      n.classList.add("swup-enabled"), n.classList.toggle("swup-native", this.options.native);
    });
  }
  async destroy() {
    this.clickDelegate.destroy(), window.removeEventListener("popstate", this.handlePopState), this.cache.clear(), this.options.plugins.forEach((t) => this.unuse(t)), await this.hooks.call("disable", void 0, void 0, () => {
      const t = document.documentElement;
      t.classList.remove("swup-enabled"), t.classList.remove("swup-native");
    }), this.hooks.clear();
  }
  shouldIgnoreVisit(t, { el: e, event: n } = {}) {
    const { origin: i, url: r, hash: o } = lt.fromUrl(t);
    return i !== window.location.origin || !(!e || !this.triggerWillOpenNewWindow(e)) || !!this.options.ignoreVisit(r + o, { el: e, event: n });
  }
  handleLinkClick(t) {
    const e = t.delegateTarget, { href: n, url: i, hash: r } = lt.fromElement(e);
    if (this.shouldIgnoreVisit(n, { el: e, event: t })) return;
    if (this.navigating && i === this.visit.to.url) return void t.preventDefault();
    const o = this.createVisit({ to: i, hash: r, el: e, event: t });
    t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? this.hooks.callSync("link:newtab", o, { href: n }) : t.button === 0 && this.hooks.callSync("link:click", o, { el: e, event: t }, () => {
      var a;
      const u = (a = o.from.url) != null ? a : "";
      t.preventDefault(), i && i !== u ? this.isSameResolvedUrl(i, u) || this.performNavigation(o) : r ? this.hooks.callSync("link:anchor", o, { hash: r }, () => {
        Oe(i + r), this.scrollToContent(o);
      }) : this.hooks.callSync("link:self", o, void 0, () => {
        this.options.linkToSelf === "navigate" ? this.performNavigation(o) : (Oe(i), this.scrollToContent(o));
      });
    });
  }
  handlePopState(t) {
    var e, n, i, r;
    const o = (e = (n = t.state) == null ? void 0 : n.url) != null ? e : window.location.href;
    if (this.options.skipPopStateHandling(t) || this.isSameResolvedUrl(Le(), this.location.url)) return;
    const { url: a, hash: u } = lt.fromUrl(o), l = this.createVisit({ to: a, hash: u, event: t });
    l.history.popstate = !0;
    const c = (i = (r = t.state) == null ? void 0 : r.index) != null ? i : 0;
    c && c !== this.currentHistoryIndex && (l.history.direction = c - this.currentHistoryIndex > 0 ? "forwards" : "backwards", this.currentHistoryIndex = c), l.animation.animate = !1, l.scroll.reset = !1, l.scroll.target = !1, this.options.animateHistoryBrowsing && (l.animation.animate = !0, l.scroll.reset = !0), this.hooks.callSync("history:popstate", l, { event: t }, () => {
      this.performNavigation(l);
    });
  }
  triggerWillOpenNewWindow(t) {
    return !!t.matches('[download], [target="_blank"]');
  }
}
function Nt(s) {
  if (s === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return s;
}
function Ji(s, t) {
  s.prototype = Object.create(t.prototype), s.prototype.constructor = s, s.__proto__ = t;
}
/*!
 * GSAP 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var xt = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, Re = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, Wn, tt, V, Et = 1e8, N = 1 / Et, Mn = Math.PI * 2, Is = Mn / 4, Fs = 0, tr = Math.sqrt, zs = Math.cos, Ns = Math.sin, J = function(t) {
  return typeof t == "string";
}, W = function(t) {
  return typeof t == "function";
}, Vt = function(t) {
  return typeof t == "number";
}, Xn = function(t) {
  return typeof t > "u";
}, Rt = function(t) {
  return typeof t == "object";
}, ct = function(t) {
  return t !== !1;
}, jn = function() {
  return typeof window < "u";
}, Qe = function(t) {
  return W(t) || J(t);
}, er = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, rt = Array.isArray, qs = /random\([^)]+\)/g, Vs = /,\s*/g, Pi = /(?:-?\.?\d|\.)+/gi, nr = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, he = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, xn = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, ir = /[+-]=-?[.\d]+/, Us = /[^,'"\[\]\s]+/gi, Bs = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, $, At, An, Kn, St = {}, en = {}, rr, sr = function(t) {
  return (en = ge(t, St)) && pt;
}, Qn = function(t, e) {
  return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()");
}, Ie = function(t, e) {
  return !e && console.warn(t);
}, or = function(t, e) {
  return t && (St[t] = e) && en && (en[t] = e) || St;
}, Fe = function() {
  return 0;
}, $s = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, Ze = {
  suppressEvents: !0,
  kill: !1
}, Hs = {
  suppressEvents: !0
}, Zn = {}, Gt = [], Dn = {}, ar, gt = {}, Sn = {}, Oi = 30, Je = [], Jn = "", ti = function(t) {
  var e = t[0], n, i;
  if (Rt(e) || W(e) || (t = [t]), !(n = (e._gsap || {}).harness)) {
    for (i = Je.length; i-- && !Je[i].targetTest(e); )
      ;
    n = Je[i];
  }
  for (i = t.length; i--; )
    t[i] && (t[i]._gsap || (t[i]._gsap = new Cr(t[i], n))) || t.splice(i, 1);
  return t;
}, re = function(t) {
  return t._gsap || ti(Pt(t))[0]._gsap;
}, ur = function(t, e, n) {
  return (n = t[e]) && W(n) ? t[e]() : Xn(n) && t.getAttribute && t.getAttribute(e) || n;
}, ft = function(t, e) {
  return (t = t.split(",")).forEach(e) || t;
}, X = function(t) {
  return Math.round(t * 1e5) / 1e5 || 0;
}, B = function(t) {
  return Math.round(t * 1e7) / 1e7 || 0;
}, pe = function(t, e) {
  var n = e.charAt(0), i = parseFloat(e.substr(2));
  return t = parseFloat(t), n === "+" ? t + i : n === "-" ? t - i : n === "*" ? t * i : t / i;
}, Ys = function(t, e) {
  for (var n = e.length, i = 0; t.indexOf(e[i]) < 0 && ++i < n; )
    ;
  return i < n;
}, nn = function() {
  var t = Gt.length, e = Gt.slice(0), n, i;
  for (Dn = {}, Gt.length = 0, n = 0; n < t; n++)
    i = e[n], i && i._lazy && (i.render(i._lazy[0], i._lazy[1], !0)._lazy = 0);
}, ei = function(t) {
  return !!(t._initted || t._startAt || t.add);
}, lr = function(t, e, n, i) {
  Gt.length && !tt && nn(), t.render(e, n, !!(tt && e < 0 && ei(t))), Gt.length && !tt && nn();
}, cr = function(t) {
  var e = parseFloat(t);
  return (e || e === 0) && (t + "").match(Us).length < 2 ? e : J(t) ? t.trim() : t;
}, fr = function(t) {
  return t;
}, bt = function(t, e) {
  for (var n in e)
    n in t || (t[n] = e[n]);
  return t;
}, Gs = function(t) {
  return function(e, n) {
    for (var i in n)
      i in e || i === "duration" && t || i === "ease" || (e[i] = n[i]);
  };
}, ge = function(t, e) {
  for (var n in e)
    t[n] = e[n];
  return t;
}, Ci = function s(t, e) {
  for (var n in e)
    n !== "__proto__" && n !== "constructor" && n !== "prototype" && (t[n] = Rt(e[n]) ? s(t[n] || (t[n] = {}), e[n]) : e[n]);
  return t;
}, rn = function(t, e) {
  var n = {}, i;
  for (i in t)
    i in e || (n[i] = t[i]);
  return n;
}, Ce = function(t) {
  var e = t.parent || $, n = t.keyframes ? Gs(rt(t.keyframes)) : bt;
  if (ct(t.inherit))
    for (; e; )
      n(t, e.vars.defaults), e = e.parent || e._dp;
  return t;
}, Ws = function(t, e) {
  for (var n = t.length, i = n === e.length; i && n-- && t[n] === e[n]; )
    ;
  return n < 0;
}, hr = function(t, e, n, i, r) {
  var o = t[i], a;
  if (r)
    for (a = e[r]; o && o[r] > a; )
      o = o._prev;
  return o ? (e._next = o._next, o._next = e) : (e._next = t[n], t[n] = e), e._next ? e._next._prev = e : t[i] = e, e._prev = o, e.parent = e._dp = t, e;
}, ln = function(t, e, n, i) {
  n === void 0 && (n = "_first"), i === void 0 && (i = "_last");
  var r = e._prev, o = e._next;
  r ? r._next = o : t[n] === e && (t[n] = o), o ? o._prev = r : t[i] === e && (t[i] = r), e._next = e._prev = e.parent = null;
}, Xt = function(t, e) {
  t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0;
}, se = function(t, e) {
  if (t && (!e || e._end > t._dur || e._start < 0))
    for (var n = t; n; )
      n._dirty = 1, n = n.parent;
  return t;
}, Xs = function(t) {
  for (var e = t.parent; e && e.parent; )
    e._dirty = 1, e.totalDuration(), e = e.parent;
  return t;
}, Ln = function(t, e, n, i) {
  return t._startAt && (tt ? t._startAt.revert(Ze) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, i));
}, js = function s(t) {
  return !t || t._ts && s(t.parent);
}, Mi = function(t) {
  return t._repeat ? ye(t._tTime, t = t.duration() + t._rDelay) * t : 0;
}, ye = function(t, e) {
  var n = Math.floor(t = B(t / e));
  return t && n === t ? n - 1 : n;
}, sn = function(t, e) {
  return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur);
}, cn = function(t) {
  return t._end = B(t._start + (t._tDur / Math.abs(t._ts || t._rts || N) || 0));
}, fn = function(t, e) {
  var n = t._dp;
  return n && n.smoothChildTiming && t._ts && (t._start = B(n._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), cn(t), n._dirty || se(n, t)), t;
}, dr = function(t, e) {
  var n;
  if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (n = sn(t.rawTime(), e), (!e._dur || Ye(0, e.totalDuration(), n) - e._tTime > N) && e.render(n, !0)), se(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
    if (t._dur < t.duration())
      for (n = t; n._dp; )
        n.rawTime() >= 0 && n.totalTime(n._tTime), n = n._dp;
    t._zTime = -N;
  }
}, Dt = function(t, e, n, i) {
  return e.parent && Xt(e), e._start = B((Vt(n) ? n : n || t !== $ ? kt(t, n, e) : t._time) + e._delay), e._end = B(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), hr(t, e, "_first", "_last", t._sort ? "_start" : 0), Rn(e) || (t._recent = e), i || dr(t, e), t._ts < 0 && fn(t, t._tTime), t;
}, pr = function(t, e) {
  return (St.ScrollTrigger || Qn("scrollTrigger", e)) && St.ScrollTrigger.create(e, t);
}, _r = function(t, e, n, i, r) {
  if (ii(t, e, r), !t._initted)
    return 1;
  if (!n && t._pt && !tt && (t._dur && t.vars.lazy !== !1 || !t._dur && t.vars.lazy) && ar !== yt.frame)
    return Gt.push(t), t._lazy = [r, i], 1;
}, Ks = function s(t) {
  var e = t.parent;
  return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || s(e));
}, Rn = function(t) {
  var e = t.data;
  return e === "isFromStart" || e === "isStart";
}, Qs = function(t, e, n, i) {
  var r = t.ratio, o = e < 0 || !e && (!t._start && Ks(t) && !(!t._initted && Rn(t)) || (t._ts < 0 || t._dp._ts < 0) && !Rn(t)) ? 0 : 1, a = t._rDelay, u = 0, l, c, h;
  if (a && t._repeat && (u = Ye(0, t._tDur, e), c = ye(u, a), t._yoyo && c & 1 && (o = 1 - o), c !== ye(t._tTime, a) && (r = 1 - o, t.vars.repeatRefresh && t._initted && t.invalidate())), o !== r || tt || i || t._zTime === N || !e && t._zTime) {
    if (!t._initted && _r(t, e, i, n, u))
      return;
    for (h = t._zTime, t._zTime = e || (n ? N : 0), n || (n = e && !h), t.ratio = o, t._from && (o = 1 - o), t._time = 0, t._tTime = u, l = t._pt; l; )
      l.r(o, l.d), l = l._next;
    e < 0 && Ln(t, e, n, !0), t._onUpdate && !n && vt(t, "onUpdate"), u && t._repeat && !n && t.parent && vt(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === o && (o && Xt(t, 1), !n && !tt && (vt(t, o ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()));
  } else t._zTime || (t._zTime = e);
}, Zs = function(t, e, n) {
  var i;
  if (n > e)
    for (i = t._first; i && i._start <= n; ) {
      if (i.data === "isPause" && i._start > e)
        return i;
      i = i._next;
    }
  else
    for (i = t._last; i && i._start >= n; ) {
      if (i.data === "isPause" && i._start < e)
        return i;
      i = i._prev;
    }
}, ve = function(t, e, n, i) {
  var r = t._repeat, o = B(e) || 0, a = t._tTime / t._tDur;
  return a && !i && (t._time *= o / t._dur), t._dur = o, t._tDur = r ? r < 0 ? 1e10 : B(o * (r + 1) + t._rDelay * r) : o, a > 0 && !i && fn(t, t._tTime = t._tDur * a), t.parent && cn(t), n || se(t.parent, t), t;
}, Ai = function(t) {
  return t instanceof ut ? se(t) : ve(t, t._dur);
}, Js = {
  _start: 0,
  endTime: Fe,
  totalDuration: Fe
}, kt = function s(t, e, n) {
  var i = t.labels, r = t._recent || Js, o = t.duration() >= Et ? r.endTime(!1) : t._dur, a, u, l;
  return J(e) && (isNaN(e) || e in i) ? (u = e.charAt(0), l = e.substr(-1) === "%", a = e.indexOf("="), u === "<" || u === ">" ? (a >= 0 && (e = e.replace(/=/, "")), (u === "<" ? r._start : r.endTime(r._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (l ? (a < 0 ? r : n).totalDuration() / 100 : 1)) : a < 0 ? (e in i || (i[e] = o), i[e]) : (u = parseFloat(e.charAt(a - 1) + e.substr(a + 1)), l && n && (u = u / 100 * (rt(n) ? n[0] : n).totalDuration()), a > 1 ? s(t, e.substr(0, a - 1), n) + u : o + u)) : e == null ? o : +e;
}, Me = function(t, e, n) {
  var i = Vt(e[1]), r = (i ? 2 : 1) + (t < 2 ? 0 : 1), o = e[r], a, u;
  if (i && (o.duration = e[1]), o.parent = n, t) {
    for (a = o, u = n; u && !("immediateRender" in a); )
      a = u.vars.defaults || {}, u = ct(u.vars.inherit) && u.parent;
    o.immediateRender = ct(a.immediateRender), t < 2 ? o.runBackwards = 1 : o.startAt = e[r - 1];
  }
  return new K(e[0], o, e[r + 1]);
}, Qt = function(t, e) {
  return t || t === 0 ? e(t) : e;
}, Ye = function(t, e, n) {
  return n < t ? t : n > e ? e : n;
}, it = function(t, e) {
  return !J(t) || !(e = Bs.exec(t)) ? "" : e[1];
}, to = function(t, e, n) {
  return Qt(n, function(i) {
    return Ye(t, e, i);
  });
}, In = [].slice, mr = function(t, e) {
  return t && Rt(t) && "length" in t && (!e && !t.length || t.length - 1 in t && Rt(t[0])) && !t.nodeType && t !== At;
}, eo = function(t, e, n) {
  return n === void 0 && (n = []), t.forEach(function(i) {
    var r;
    return J(i) && !e || mr(i, 1) ? (r = n).push.apply(r, Pt(i)) : n.push(i);
  }) || n;
}, Pt = function(t, e, n) {
  return V && !e && V.selector ? V.selector(t) : J(t) && !n && (An || !we()) ? In.call((e || Kn).querySelectorAll(t), 0) : rt(t) ? eo(t, n) : mr(t) ? In.call(t, 0) : t ? [t] : [];
}, Fn = function(t) {
  return t = Pt(t)[0] || Ie("Invalid scope") || {}, function(e) {
    var n = t.current || t.nativeElement || t;
    return Pt(e, n.querySelectorAll ? n : n === t ? Ie("Invalid scope") || Kn.createElement("div") : t);
  };
}, gr = function(t) {
  return t.sort(function() {
    return 0.5 - Math.random();
  });
}, yr = function(t) {
  if (W(t))
    return t;
  var e = Rt(t) ? t : {
    each: t
  }, n = oe(e.ease), i = e.from || 0, r = parseFloat(e.base) || 0, o = {}, a = i > 0 && i < 1, u = isNaN(i) || a, l = e.axis, c = i, h = i;
  return J(i) ? c = h = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[i] || 0 : !a && u && (c = i[0], h = i[1]), function(d, p, _) {
    var f = (_ || e).length, m = o[f], g, y, v, x, w, k, S, T, b;
    if (!m) {
      if (b = e.grid === "auto" ? 0 : (e.grid || [1, Et])[1], !b) {
        for (S = -Et; S < (S = _[b++].getBoundingClientRect().left) && b < f; )
          ;
        b < f && b--;
      }
      for (m = o[f] = [], g = u ? Math.min(b, f) * c - 0.5 : i % b, y = b === Et ? 0 : u ? f * h / b - 0.5 : i / b | 0, S = 0, T = Et, k = 0; k < f; k++)
        v = k % b - g, x = y - (k / b | 0), m[k] = w = l ? Math.abs(l === "y" ? x : v) : tr(v * v + x * x), w > S && (S = w), w < T && (T = w);
      i === "random" && gr(m), m.max = S - T, m.min = T, m.v = f = (parseFloat(e.amount) || parseFloat(e.each) * (b > f ? f - 1 : l ? l === "y" ? f / b : b : Math.max(b, f / b)) || 0) * (i === "edges" ? -1 : 1), m.b = f < 0 ? r - f : r, m.u = it(e.amount || e.each) || 0, n = n && f < 0 ? _o(n) : n;
    }
    return f = (m[d] - m.min) / m.max || 0, B(m.b + (n ? n(f) : f) * m.v) + m.u;
  };
}, zn = function(t) {
  var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
  return function(n) {
    var i = B(Math.round(parseFloat(n) / t) * t * e);
    return (i - i % 1) / e + (Vt(n) ? 0 : it(n));
  };
}, vr = function(t, e) {
  var n = rt(t), i, r;
  return !n && Rt(t) && (i = n = t.radius || Et, t.values ? (t = Pt(t.values), (r = !Vt(t[0])) && (i *= i)) : t = zn(t.increment)), Qt(e, n ? W(t) ? function(o) {
    return r = t(o), Math.abs(r - o) <= i ? r : o;
  } : function(o) {
    for (var a = parseFloat(r ? o.x : o), u = parseFloat(r ? o.y : 0), l = Et, c = 0, h = t.length, d, p; h--; )
      r ? (d = t[h].x - a, p = t[h].y - u, d = d * d + p * p) : d = Math.abs(t[h] - a), d < l && (l = d, c = h);
    return c = !i || l <= i ? t[c] : o, r || c === o || Vt(o) ? c : c + it(o);
  } : zn(t));
}, wr = function(t, e, n, i) {
  return Qt(rt(t) ? !e : n === !0 ? !!(n = 0) : !i, function() {
    return rt(t) ? t[~~(Math.random() * t.length)] : (n = n || 1e-5) && (i = n < 1 ? Math.pow(10, (n + "").length - 2) : 1) && Math.floor(Math.round((t - n / 2 + Math.random() * (e - t + n * 0.99)) / n) * n * i) / i;
  });
}, no = function() {
  for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
    e[n] = arguments[n];
  return function(i) {
    return e.reduce(function(r, o) {
      return o(r);
    }, i);
  };
}, io = function(t, e) {
  return function(n) {
    return t(parseFloat(n)) + (e || it(n));
  };
}, ro = function(t, e, n) {
  return Sr(t, e, 0, 1, n);
}, xr = function(t, e, n) {
  return Qt(n, function(i) {
    return t[~~e(i)];
  });
}, so = function s(t, e, n) {
  var i = e - t;
  return rt(t) ? xr(t, s(0, t.length), e) : Qt(n, function(r) {
    return (i + (r - t) % i) % i + t;
  });
}, oo = function s(t, e, n) {
  var i = e - t, r = i * 2;
  return rt(t) ? xr(t, s(0, t.length - 1), e) : Qt(n, function(o) {
    return o = (r + (o - t) % r) % r || 0, t + (o > i ? r - o : o);
  });
}, ze = function(t) {
  return t.replace(qs, function(e) {
    var n = e.indexOf("[") + 1, i = e.substring(n || 7, n ? e.indexOf("]") : e.length - 1).split(Vs);
    return wr(n ? i : +i[0], n ? 0 : +i[1], +i[2] || 1e-5);
  });
}, Sr = function(t, e, n, i, r) {
  var o = e - t, a = i - n;
  return Qt(r, function(u) {
    return n + ((u - t) / o * a || 0);
  });
}, ao = function s(t, e, n, i) {
  var r = isNaN(t + e) ? 0 : function(p) {
    return (1 - p) * t + p * e;
  };
  if (!r) {
    var o = J(t), a = {}, u, l, c, h, d;
    if (n === !0 && (i = 1) && (n = null), o)
      t = {
        p: t
      }, e = {
        p: e
      };
    else if (rt(t) && !rt(e)) {
      for (c = [], h = t.length, d = h - 2, l = 1; l < h; l++)
        c.push(s(t[l - 1], t[l]));
      h--, r = function(_) {
        _ *= h;
        var f = Math.min(d, ~~_);
        return c[f](_ - f);
      }, n = e;
    } else i || (t = ge(rt(t) ? [] : {}, t));
    if (!c) {
      for (u in e)
        ni.call(a, t, u, "get", e[u]);
      r = function(_) {
        return oi(_, a) || (o ? t.p : t);
      };
    }
  }
  return Qt(n, r);
}, Di = function(t, e, n) {
  var i = t.labels, r = Et, o, a, u;
  for (o in i)
    a = i[o] - e, a < 0 == !!n && a && r > (a = Math.abs(a)) && (u = o, r = a);
  return u;
}, vt = function(t, e, n) {
  var i = t.vars, r = i[e], o = V, a = t._ctx, u, l, c;
  if (r)
    return u = i[e + "Params"], l = i.callbackScope || t, n && Gt.length && nn(), a && (V = a), c = u ? r.apply(l, u) : r.call(l), V = o, c;
}, ke = function(t) {
  return Xt(t), t.scrollTrigger && t.scrollTrigger.kill(!!tt), t.progress() < 1 && vt(t, "onInterrupt"), t;
}, de, br = [], Tr = function(t) {
  if (t)
    if (t = !t.name && t.default || t, jn() || t.headless) {
      var e = t.name, n = W(t), i = e && !n && t.init ? function() {
        this._props = [];
      } : t, r = {
        init: Fe,
        render: oi,
        add: ni,
        kill: ko,
        modifier: To,
        rawVars: 0
      }, o = {
        targetTest: 0,
        get: 0,
        getSetter: si,
        aliases: {},
        register: 0
      };
      if (we(), t !== i) {
        if (gt[e])
          return;
        bt(i, bt(rn(t, r), o)), ge(i.prototype, ge(r, rn(t, o))), gt[i.prop = e] = i, t.targetTest && (Je.push(i), Zn[e] = 1), e = (e === "css" ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin";
      }
      or(e, i), t.register && t.register(pt, i, ht);
    } else
      br.push(t);
}, z = 255, Ee = {
  aqua: [0, z, z],
  lime: [0, z, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, z],
  navy: [0, 0, 128],
  white: [z, z, z],
  olive: [128, 128, 0],
  yellow: [z, z, 0],
  orange: [z, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [z, 0, 0],
  pink: [z, 192, 203],
  cyan: [0, z, z],
  transparent: [z, z, z, 0]
}, bn = function(t, e, n) {
  return t += t < 0 ? 1 : t > 1 ? -1 : 0, (t * 6 < 1 ? e + (n - e) * t * 6 : t < 0.5 ? n : t * 3 < 2 ? e + (n - e) * (2 / 3 - t) * 6 : e) * z + 0.5 | 0;
}, kr = function(t, e, n) {
  var i = t ? Vt(t) ? [t >> 16, t >> 8 & z, t & z] : 0 : Ee.black, r, o, a, u, l, c, h, d, p, _;
  if (!i) {
    if (t.substr(-1) === "," && (t = t.substr(0, t.length - 1)), Ee[t])
      i = Ee[t];
    else if (t.charAt(0) === "#") {
      if (t.length < 6 && (r = t.charAt(1), o = t.charAt(2), a = t.charAt(3), t = "#" + r + r + o + o + a + a + (t.length === 5 ? t.charAt(4) + t.charAt(4) : "")), t.length === 9)
        return i = parseInt(t.substr(1, 6), 16), [i >> 16, i >> 8 & z, i & z, parseInt(t.substr(7), 16) / 255];
      t = parseInt(t.substr(1), 16), i = [t >> 16, t >> 8 & z, t & z];
    } else if (t.substr(0, 3) === "hsl") {
      if (i = _ = t.match(Pi), !e)
        u = +i[0] % 360 / 360, l = +i[1] / 100, c = +i[2] / 100, o = c <= 0.5 ? c * (l + 1) : c + l - c * l, r = c * 2 - o, i.length > 3 && (i[3] *= 1), i[0] = bn(u + 1 / 3, r, o), i[1] = bn(u, r, o), i[2] = bn(u - 1 / 3, r, o);
      else if (~t.indexOf("="))
        return i = t.match(nr), n && i.length < 4 && (i[3] = 1), i;
    } else
      i = t.match(Pi) || Ee.transparent;
    i = i.map(Number);
  }
  return e && !_ && (r = i[0] / z, o = i[1] / z, a = i[2] / z, h = Math.max(r, o, a), d = Math.min(r, o, a), c = (h + d) / 2, h === d ? u = l = 0 : (p = h - d, l = c > 0.5 ? p / (2 - h - d) : p / (h + d), u = h === r ? (o - a) / p + (o < a ? 6 : 0) : h === o ? (a - r) / p + 2 : (r - o) / p + 4, u *= 60), i[0] = ~~(u + 0.5), i[1] = ~~(l * 100 + 0.5), i[2] = ~~(c * 100 + 0.5)), n && i.length < 4 && (i[3] = 1), i;
}, Er = function(t) {
  var e = [], n = [], i = -1;
  return t.split(Wt).forEach(function(r) {
    var o = r.match(he) || [];
    e.push.apply(e, o), n.push(i += o.length + 1);
  }), e.c = n, e;
}, Li = function(t, e, n) {
  var i = "", r = (t + i).match(Wt), o = e ? "hsla(" : "rgba(", a = 0, u, l, c, h;
  if (!r)
    return t;
  if (r = r.map(function(d) {
    return (d = kr(d, e, 1)) && o + (e ? d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : d.join(",")) + ")";
  }), n && (c = Er(t), u = n.c, u.join(i) !== c.c.join(i)))
    for (l = t.replace(Wt, "1").split(he), h = l.length - 1; a < h; a++)
      i += l[a] + (~u.indexOf(a) ? r.shift() || o + "0,0,0,0)" : (c.length ? c : r.length ? r : n).shift());
  if (!l)
    for (l = t.split(Wt), h = l.length - 1; a < h; a++)
      i += l[a] + r[a];
  return i + l[h];
}, Wt = (function() {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
  for (t in Ee)
    s += "|" + t + "\\b";
  return new RegExp(s + ")", "gi");
})(), uo = /hsl[a]?\(/, Pr = function(t) {
  var e = t.join(" "), n;
  if (Wt.lastIndex = 0, Wt.test(e))
    return n = uo.test(e), t[1] = Li(t[1], n), t[0] = Li(t[0], n, Er(t[1])), !0;
}, Ne, yt = (function() {
  var s = Date.now, t = 500, e = 33, n = s(), i = n, r = 1e3 / 240, o = r, a = [], u, l, c, h, d, p, _ = function f(m) {
    var g = s() - i, y = m === !0, v, x, w, k;
    if ((g > t || g < 0) && (n += g - e), i += g, w = i - n, v = w - o, (v > 0 || y) && (k = ++h.frame, d = w - h.time * 1e3, h.time = w = w / 1e3, o += v + (v >= r ? 4 : r - v), x = 1), y || (u = l(f)), x)
      for (p = 0; p < a.length; p++)
        a[p](w, d, k, m);
  };
  return h = {
    time: 0,
    frame: 0,
    tick: function() {
      _(!0);
    },
    deltaRatio: function(m) {
      return d / (1e3 / (m || 60));
    },
    wake: function() {
      rr && (!An && jn() && (At = An = window, Kn = At.document || {}, St.gsap = pt, (At.gsapVersions || (At.gsapVersions = [])).push(pt.version), sr(en || At.GreenSockGlobals || !At.gsap && At || {}), br.forEach(Tr)), c = typeof requestAnimationFrame < "u" && requestAnimationFrame, u && h.sleep(), l = c || function(m) {
        return setTimeout(m, o - h.time * 1e3 + 1 | 0);
      }, Ne = 1, _(2));
    },
    sleep: function() {
      (c ? cancelAnimationFrame : clearTimeout)(u), Ne = 0, l = Fe;
    },
    lagSmoothing: function(m, g) {
      t = m || 1 / 0, e = Math.min(g || 33, t);
    },
    fps: function(m) {
      r = 1e3 / (m || 240), o = h.time * 1e3 + r;
    },
    add: function(m, g, y) {
      var v = g ? function(x, w, k, S) {
        m(x, w, k, S), h.remove(v);
      } : m;
      return h.remove(m), a[y ? "unshift" : "push"](v), we(), v;
    },
    remove: function(m, g) {
      ~(g = a.indexOf(m)) && a.splice(g, 1) && p >= g && p--;
    },
    _listeners: a
  }, h;
})(), we = function() {
  return !Ne && yt.wake();
}, A = {}, lo = /^[\d.\-M][\d.\-,\s]/, co = /["']/g, fo = function(t) {
  for (var e = {}, n = t.substr(1, t.length - 3).split(":"), i = n[0], r = 1, o = n.length, a, u, l; r < o; r++)
    u = n[r], a = r !== o - 1 ? u.lastIndexOf(",") : u.length, l = u.substr(0, a), e[i] = isNaN(l) ? l.replace(co, "").trim() : +l, i = u.substr(a + 1).trim();
  return e;
}, ho = function(t) {
  var e = t.indexOf("(") + 1, n = t.indexOf(")"), i = t.indexOf("(", e);
  return t.substring(e, ~i && i < n ? t.indexOf(")", n + 1) : n);
}, po = function(t) {
  var e = (t + "").split("("), n = A[e[0]];
  return n && e.length > 1 && n.config ? n.config.apply(null, ~t.indexOf("{") ? [fo(e[1])] : ho(t).split(",").map(cr)) : A._CE && lo.test(t) ? A._CE("", t) : n;
}, _o = function(t) {
  return function(e) {
    return 1 - t(1 - e);
  };
}, oe = function(t, e) {
  return t && (W(t) ? t : A[t] || po(t)) || e;
}, le = function(t, e, n, i) {
  n === void 0 && (n = function(u) {
    return 1 - e(1 - u);
  }), i === void 0 && (i = function(u) {
    return u < 0.5 ? e(u * 2) / 2 : 1 - e((1 - u) * 2) / 2;
  });
  var r = {
    easeIn: e,
    easeOut: n,
    easeInOut: i
  }, o;
  return ft(t, function(a) {
    A[a] = St[a] = r, A[o = a.toLowerCase()] = n;
    for (var u in r)
      A[o + (u === "easeIn" ? ".in" : u === "easeOut" ? ".out" : ".inOut")] = A[a + "." + u] = r[u];
  }), r;
}, Or = function(t) {
  return function(e) {
    return e < 0.5 ? (1 - t(1 - e * 2)) / 2 : 0.5 + t((e - 0.5) * 2) / 2;
  };
}, Tn = function s(t, e, n) {
  var i = e >= 1 ? e : 1, r = (n || (t ? 0.3 : 0.45)) / (e < 1 ? e : 1), o = r / Mn * (Math.asin(1 / i) || 0), a = function(c) {
    return c === 1 ? 1 : i * Math.pow(2, -10 * c) * Ns((c - o) * r) + 1;
  }, u = t === "out" ? a : t === "in" ? function(l) {
    return 1 - a(1 - l);
  } : Or(a);
  return r = Mn / r, u.config = function(l, c) {
    return s(t, l, c);
  }, u;
}, kn = function s(t, e) {
  e === void 0 && (e = 1.70158);
  var n = function(o) {
    return o ? --o * o * ((e + 1) * o + e) + 1 : 0;
  }, i = t === "out" ? n : t === "in" ? function(r) {
    return 1 - n(1 - r);
  } : Or(n);
  return i.config = function(r) {
    return s(t, r);
  }, i;
};
ft("Linear,Quad,Cubic,Quart,Quint,Strong", function(s, t) {
  var e = t < 5 ? t + 1 : t;
  le(s + ",Power" + (e - 1), t ? function(n) {
    return Math.pow(n, e);
  } : function(n) {
    return n;
  }, function(n) {
    return 1 - Math.pow(1 - n, e);
  }, function(n) {
    return n < 0.5 ? Math.pow(n * 2, e) / 2 : 1 - Math.pow((1 - n) * 2, e) / 2;
  });
});
A.Linear.easeNone = A.none = A.Linear.easeIn;
le("Elastic", Tn("in"), Tn("out"), Tn());
(function(s, t) {
  var e = 1 / t, n = 2 * e, i = 2.5 * e, r = function(a) {
    return a < e ? s * a * a : a < n ? s * Math.pow(a - 1.5 / t, 2) + 0.75 : a < i ? s * (a -= 2.25 / t) * a + 0.9375 : s * Math.pow(a - 2.625 / t, 2) + 0.984375;
  };
  le("Bounce", function(o) {
    return 1 - r(1 - o);
  }, r);
})(7.5625, 2.75);
le("Expo", function(s) {
  return Math.pow(2, 10 * (s - 1)) * s + s * s * s * s * s * s * (1 - s);
});
le("Circ", function(s) {
  return -(tr(1 - s * s) - 1);
});
le("Sine", function(s) {
  return s === 1 ? 1 : -zs(s * Is) + 1;
});
le("Back", kn("in"), kn("out"), kn());
A.SteppedEase = A.steps = St.SteppedEase = {
  config: function(t, e) {
    t === void 0 && (t = 1);
    var n = 1 / t, i = t + (e ? 0 : 1), r = e ? 1 : 0, o = 1 - N;
    return function(a) {
      return ((i * Ye(0, o, a) | 0) + r) * n;
    };
  }
};
Re.ease = A["quad.out"];
ft("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(s) {
  return Jn += s + "," + s + "Params,";
});
var Cr = function(t, e) {
  this.id = Fs++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : ur, this.set = e ? e.getSetter : si;
}, qe = /* @__PURE__ */ (function() {
  function s(e) {
    this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, ve(this, +e.duration, 1, 1), this.data = e.data, V && (this._ctx = V, V.data.push(this)), Ne || yt.wake();
  }
  var t = s.prototype;
  return t.delay = function(n) {
    return n || n === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + n - this._delay), this._delay = n, this) : this._delay;
  }, t.duration = function(n) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? n + (n + this._rDelay) * this._repeat : n) : this.totalDuration() && this._dur;
  }, t.totalDuration = function(n) {
    return arguments.length ? (this._dirty = 0, ve(this, this._repeat < 0 ? n : (n - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, t.totalTime = function(n, i) {
    if (we(), !arguments.length)
      return this._tTime;
    var r = this._dp;
    if (r && r.smoothChildTiming && this._ts) {
      for (fn(this, n), !r._dp || r.parent || dr(r, this); r && r.parent; )
        r.parent._time !== r._start + (r._ts >= 0 ? r._tTime / r._ts : (r.totalDuration() - r._tTime) / -r._ts) && r.totalTime(r._tTime, !0), r = r.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && n < this._tDur || this._ts < 0 && n > 0 || !this._tDur && !n) && Dt(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== n || !this._dur && !i || this._initted && Math.abs(this._zTime) === N || !this._initted && this._dur && n || !n && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = n), lr(this, n, i)), this;
  }, t.time = function(n, i) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), n + Mi(this)) % (this._dur + this._rDelay) || (n ? this._dur : 0), i) : this._time;
  }, t.totalProgress = function(n, i) {
    return arguments.length ? this.totalTime(this.totalDuration() * n, i) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  }, t.progress = function(n, i) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - n : n) + Mi(this), i) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, t.iteration = function(n, i) {
    var r = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (n - 1) * r, i) : this._repeat ? ye(this._tTime, r) + 1 : 1;
  }, t.timeScale = function(n, i) {
    if (!arguments.length)
      return this._rts === -N ? 0 : this._rts;
    if (this._rts === n)
      return this;
    var r = this.parent && this._ts ? sn(this.parent._time, this) : this._tTime;
    return this._rts = +n || 0, this._ts = this._ps || n === -N ? 0 : this._rts, this.totalTime(Ye(-Math.abs(this._delay), this.totalDuration(), r), i !== !1), cn(this), Xs(this);
  }, t.paused = function(n) {
    return arguments.length ? (this._ps !== n && (this._ps = n, n ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (we(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== N && (this._tTime -= N)))), this) : this._ps;
  }, t.startTime = function(n) {
    if (arguments.length) {
      this._start = B(n);
      var i = this.parent || this._dp;
      return i && (i._sort || !this.parent) && Dt(i, this, this._start - this._delay), this;
    }
    return this._start;
  }, t.endTime = function(n) {
    return this._start + (ct(n) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, t.rawTime = function(n) {
    var i = this.parent || this._dp;
    return i ? n && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? sn(i.rawTime(n), this) : this._tTime : this._tTime;
  }, t.revert = function(n) {
    n === void 0 && (n = Hs);
    var i = tt;
    return tt = n, ei(this) && (this.timeline && this.timeline.revert(n), this.totalTime(-0.01, n.suppressEvents)), this.data !== "nested" && n.kill !== !1 && this.kill(), tt = i, this;
  }, t.globalTime = function(n) {
    for (var i = this, r = arguments.length ? n : i.rawTime(); i; )
      r = i._start + r / (Math.abs(i._ts) || 1), i = i._dp;
    return !this.parent && this._sat ? this._sat.globalTime(n) : r;
  }, t.repeat = function(n) {
    return arguments.length ? (this._repeat = n === 1 / 0 ? -2 : n, Ai(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, t.repeatDelay = function(n) {
    if (arguments.length) {
      var i = this._time;
      return this._rDelay = n, Ai(this), i ? this.time(i) : this;
    }
    return this._rDelay;
  }, t.yoyo = function(n) {
    return arguments.length ? (this._yoyo = n, this) : this._yoyo;
  }, t.seek = function(n, i) {
    return this.totalTime(kt(this, n), ct(i));
  }, t.restart = function(n, i) {
    return this.play().totalTime(n ? -this._delay : 0, ct(i)), this._dur || (this._zTime = -N), this;
  }, t.play = function(n, i) {
    return n != null && this.seek(n, i), this.reversed(!1).paused(!1);
  }, t.reverse = function(n, i) {
    return n != null && this.seek(n || this.totalDuration(), i), this.reversed(!0).paused(!1);
  }, t.pause = function(n, i) {
    return n != null && this.seek(n, i), this.paused(!0);
  }, t.resume = function() {
    return this.paused(!1);
  }, t.reversed = function(n) {
    return arguments.length ? (!!n !== this.reversed() && this.timeScale(-this._rts || (n ? -N : 0)), this) : this._rts < 0;
  }, t.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -N, this;
  }, t.isActive = function() {
    var n = this.parent || this._dp, i = this._start, r;
    return !!(!n || this._ts && this._initted && n.isActive() && (r = n.rawTime(!0)) >= i && r < this.endTime(!0) - N);
  }, t.eventCallback = function(n, i, r) {
    var o = this.vars;
    return arguments.length > 1 ? (i ? (o[n] = i, r && (o[n + "Params"] = r), n === "onUpdate" && (this._onUpdate = i)) : delete o[n], this) : o[n];
  }, t.then = function(n) {
    var i = this, r = i._prom;
    return new Promise(function(o) {
      var a = W(n) ? n : fr, u = function() {
        var c = i.then;
        i.then = null, r && r(), W(a) && (a = a(i)) && (a.then || a === i) && (i.then = c), o(a), i.then = c;
      };
      i._initted && i.totalProgress() === 1 && i._ts >= 0 || !i._tTime && i._ts < 0 ? u() : i._prom = u;
    });
  }, t.kill = function() {
    ke(this);
  }, s;
})();
bt(qe.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -N,
  _prom: 0,
  _ps: !1,
  _rts: 1
});
var ut = /* @__PURE__ */ (function(s) {
  Ji(t, s);
  function t(n, i) {
    var r;
    return n === void 0 && (n = {}), r = s.call(this, n) || this, r.labels = {}, r.smoothChildTiming = !!n.smoothChildTiming, r.autoRemoveChildren = !!n.autoRemoveChildren, r._sort = ct(n.sortChildren), $ && Dt(n.parent || $, Nt(r), i), n.reversed && r.reverse(), n.paused && r.paused(!0), n.scrollTrigger && pr(Nt(r), n.scrollTrigger), r;
  }
  var e = t.prototype;
  return e.to = function(i, r, o) {
    return Me(0, arguments, this), this;
  }, e.from = function(i, r, o) {
    return Me(1, arguments, this), this;
  }, e.fromTo = function(i, r, o, a) {
    return Me(2, arguments, this), this;
  }, e.set = function(i, r, o) {
    return r.duration = 0, r.parent = this, Ce(r).repeatDelay || (r.repeat = 0), r.immediateRender = !!r.immediateRender, new K(i, r, kt(this, o), 1), this;
  }, e.call = function(i, r, o) {
    return Dt(this, K.delayedCall(0, i, r), o);
  }, e.staggerTo = function(i, r, o, a, u, l, c) {
    return o.duration = r, o.stagger = o.stagger || a, o.onComplete = l, o.onCompleteParams = c, o.parent = this, new K(i, o, kt(this, u)), this;
  }, e.staggerFrom = function(i, r, o, a, u, l, c) {
    return o.runBackwards = 1, Ce(o).immediateRender = ct(o.immediateRender), this.staggerTo(i, r, o, a, u, l, c);
  }, e.staggerFromTo = function(i, r, o, a, u, l, c, h) {
    return a.startAt = o, Ce(a).immediateRender = ct(a.immediateRender), this.staggerTo(i, r, a, u, l, c, h);
  }, e.render = function(i, r, o) {
    var a = this._time, u = this._dirty ? this.totalDuration() : this._tDur, l = this._dur, c = i <= 0 ? 0 : B(i), h = this._zTime < 0 != i < 0 && (this._initted || !l), d, p, _, f, m, g, y, v, x, w, k, S;
    if (this !== $ && c > u && i >= 0 && (c = u), c !== this._tTime || o || h) {
      if (a !== this._time && l && (c += this._time - a, i += this._time - a), d = c, x = this._start, v = this._ts, g = !v, h && (l || (a = this._zTime), (i || !r) && (this._zTime = i)), this._repeat) {
        if (k = this._yoyo, m = l + this._rDelay, this._repeat < -1 && i < 0)
          return this.totalTime(m * 100 + i, r, o);
        if (d = B(c % m), c === u ? (f = this._repeat, d = l) : (w = B(c / m), f = ~~w, f && f === w && (d = l, f--), d > l && (d = l)), w = ye(this._tTime, m), !a && this._tTime && w !== f && this._tTime - w * m - this._dur <= 0 && (w = f), k && f & 1 && (d = l - d, S = 1), f !== w && !this._lock) {
          var T = k && w & 1, b = T === (k && f & 1);
          if (f < w && (T = !T), a = T ? 0 : c % l ? l : c, this._lock = 1, this.render(a || (S ? 0 : B(f * m)), r, !l)._lock = 0, this._tTime = c, !r && this.parent && vt(this, "onRepeat"), this.vars.repeatRefresh && !S && (this.invalidate()._lock = 1, w = f), a && a !== this._time || g !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (l = this._dur, u = this._tDur, b && (this._lock = 2, a = T ? l : -1e-4, this.render(a, !0), this.vars.repeatRefresh && !S && this.invalidate()), this._lock = 0, !this._ts && !g)
            return this;
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (y = Zs(this, B(a), B(d)), y && (c -= d - (d = y._start))), this._tTime = c, this._time = d, this._act = !!v, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = i, a = 0), !a && c && l && !r && !w && (vt(this, "onStart"), this._tTime !== c))
        return this;
      if (d >= a && i >= 0)
        for (p = this._first; p; ) {
          if (_ = p._next, (p._act || d >= p._start) && p._ts && y !== p) {
            if (p.parent !== this)
              return this.render(i, r, o);
            if (p.render(p._ts > 0 ? (d - p._start) * p._ts : (p._dirty ? p.totalDuration() : p._tDur) + (d - p._start) * p._ts, r, o), d !== this._time || !this._ts && !g) {
              y = 0, _ && (c += this._zTime = -N);
              break;
            }
          }
          p = _;
        }
      else {
        p = this._last;
        for (var E = i < 0 ? i : d; p; ) {
          if (_ = p._prev, (p._act || E <= p._end) && p._ts && y !== p) {
            if (p.parent !== this)
              return this.render(i, r, o);
            if (p.render(p._ts > 0 ? (E - p._start) * p._ts : (p._dirty ? p.totalDuration() : p._tDur) + (E - p._start) * p._ts, r, o || tt && ei(p)), d !== this._time || !this._ts && !g) {
              y = 0, _ && (c += this._zTime = E ? -N : N);
              break;
            }
          }
          p = _;
        }
      }
      if (y && !r && (this.pause(), y.render(d >= a ? 0 : -N)._zTime = d >= a ? 1 : -1, this._ts))
        return this._start = x, cn(this), this.render(i, r, o);
      this._onUpdate && !r && vt(this, "onUpdate", !0), (c === u && this._tTime >= this.totalDuration() || !c && a) && (x === this._start || Math.abs(v) !== Math.abs(this._ts)) && (this._lock || ((i || !l) && (c === u && this._ts > 0 || !c && this._ts < 0) && Xt(this, 1), !r && !(i < 0 && !a) && (c || a || !u) && (vt(this, c === u && i >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(c < u && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, e.add = function(i, r) {
    var o = this;
    if (Vt(r) || (r = kt(this, r, i)), !(i instanceof qe)) {
      if (rt(i))
        return i.forEach(function(a) {
          return o.add(a, r);
        }), this;
      if (J(i))
        return this.addLabel(i, r);
      if (W(i))
        i = K.delayedCall(0, i);
      else
        return this;
    }
    return this !== i ? Dt(this, i, r) : this;
  }, e.getChildren = function(i, r, o, a) {
    i === void 0 && (i = !0), r === void 0 && (r = !0), o === void 0 && (o = !0), a === void 0 && (a = -Et);
    for (var u = [], l = this._first; l; )
      l._start >= a && (l instanceof K ? r && u.push(l) : (o && u.push(l), i && u.push.apply(u, l.getChildren(!0, r, o)))), l = l._next;
    return u;
  }, e.getById = function(i) {
    for (var r = this.getChildren(1, 1, 1), o = r.length; o--; )
      if (r[o].vars.id === i)
        return r[o];
  }, e.remove = function(i) {
    return J(i) ? this.removeLabel(i) : W(i) ? this.killTweensOf(i) : (i.parent === this && ln(this, i), i === this._recent && (this._recent = this._last), se(this));
  }, e.totalTime = function(i, r) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = B(yt.time - (this._ts > 0 ? i / this._ts : (this.totalDuration() - i) / -this._ts))), s.prototype.totalTime.call(this, i, r), this._forcing = 0, this) : this._tTime;
  }, e.addLabel = function(i, r) {
    return this.labels[i] = kt(this, r), this;
  }, e.removeLabel = function(i) {
    return delete this.labels[i], this;
  }, e.addPause = function(i, r, o) {
    var a = K.delayedCall(0, r || Fe, o);
    return a.data = "isPause", this._hasPause = 1, Dt(this, a, kt(this, i));
  }, e.removePause = function(i) {
    var r = this._first;
    for (i = kt(this, i); r; )
      r._start === i && r.data === "isPause" && Xt(r), r = r._next;
  }, e.killTweensOf = function(i, r, o) {
    for (var a = this.getTweensOf(i, o), u = a.length; u--; )
      $t !== a[u] && a[u].kill(i, r);
    return this;
  }, e.getTweensOf = function(i, r) {
    for (var o = [], a = Pt(i), u = this._first, l = Vt(r), c; u; )
      u instanceof K ? Ys(u._targets, a) && (l ? (!$t || u._initted && u._ts) && u.globalTime(0) <= r && u.globalTime(u.totalDuration()) > r : !r || u.isActive()) && o.push(u) : (c = u.getTweensOf(a, r)).length && o.push.apply(o, c), u = u._next;
    return o;
  }, e.tweenTo = function(i, r) {
    r = r || {};
    var o = this, a = kt(o, i), u = r, l = u.startAt, c = u.onStart, h = u.onStartParams, d = u.immediateRender, p, _ = K.to(o, bt({
      ease: r.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: a,
      overwrite: "auto",
      duration: r.duration || Math.abs((a - (l && "time" in l ? l.time : o._time)) / o.timeScale()) || N,
      onStart: function() {
        if (o.pause(), !p) {
          var m = r.duration || Math.abs((a - (l && "time" in l ? l.time : o._time)) / o.timeScale());
          _._dur !== m && ve(_, m, 0, 1).render(_._time, !0, !0), p = 1;
        }
        c && c.apply(_, h || []);
      }
    }, r));
    return d ? _.render(0) : _;
  }, e.tweenFromTo = function(i, r, o) {
    return this.tweenTo(r, bt({
      startAt: {
        time: kt(this, i)
      }
    }, o));
  }, e.recent = function() {
    return this._recent;
  }, e.nextLabel = function(i) {
    return i === void 0 && (i = this._time), Di(this, kt(this, i));
  }, e.previousLabel = function(i) {
    return i === void 0 && (i = this._time), Di(this, kt(this, i), 1);
  }, e.currentLabel = function(i) {
    return arguments.length ? this.seek(i, !0) : this.previousLabel(this._time + N);
  }, e.shiftChildren = function(i, r, o) {
    o === void 0 && (o = 0);
    var a = this._first, u = this.labels, l;
    for (i = B(i); a; )
      a._start >= o && (a._start += i, a._end += i), a = a._next;
    if (r)
      for (l in u)
        u[l] >= o && (u[l] += i);
    return se(this);
  }, e.invalidate = function(i) {
    var r = this._first;
    for (this._lock = 0; r; )
      r.invalidate(i), r = r._next;
    return s.prototype.invalidate.call(this, i);
  }, e.clear = function(i) {
    i === void 0 && (i = !0);
    for (var r = this._first, o; r; )
      o = r._next, this.remove(r), r = o;
    return this._dp && (this._time = this._tTime = this._pTime = 0), i && (this.labels = {}), se(this);
  }, e.totalDuration = function(i) {
    var r = 0, o = this, a = o._last, u = Et, l, c, h;
    if (arguments.length)
      return o.timeScale((o._repeat < 0 ? o.duration() : o.totalDuration()) / (o.reversed() ? -i : i));
    if (o._dirty) {
      for (h = o.parent; a; )
        l = a._prev, a._dirty && a.totalDuration(), c = a._start, c > u && o._sort && a._ts && !o._lock ? (o._lock = 1, Dt(o, a, c - a._delay, 1)._lock = 0) : u = c, c < 0 && a._ts && (r -= c, (!h && !o._dp || h && h.smoothChildTiming) && (o._start += B(c / o._ts), o._time -= c, o._tTime -= c), o.shiftChildren(-c, !1, -1 / 0), u = 0), a._end > r && a._ts && (r = a._end), a = l;
      ve(o, o === $ && o._time > r ? o._time : r, 1, 1), o._dirty = 0;
    }
    return o._tDur;
  }, t.updateRoot = function(i) {
    if ($._ts && (lr($, sn(i, $)), ar = yt.frame), yt.frame >= Oi) {
      Oi += xt.autoSleep || 120;
      var r = $._first;
      if ((!r || !r._ts) && xt.autoSleep && yt._listeners.length < 2) {
        for (; r && !r._ts; )
          r = r._next;
        r || yt.sleep();
      }
    }
  }, t;
})(qe);
bt(ut.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var mo = function(t, e, n, i, r, o, a) {
  var u = new ht(this._pt, t, e, 0, 1, Ir, null, r), l = 0, c = 0, h, d, p, _, f, m, g, y;
  for (u.b = n, u.e = i, n += "", i += "", (g = ~i.indexOf("random(")) && (i = ze(i)), o && (y = [n, i], o(y, t, e), n = y[0], i = y[1]), d = n.match(xn) || []; h = xn.exec(i); )
    _ = h[0], f = i.substring(l, h.index), p ? p = (p + 1) % 5 : f.substr(-5) === "rgba(" && (p = 1), _ !== d[c++] && (m = parseFloat(d[c - 1]) || 0, u._pt = {
      _next: u._pt,
      p: f || c === 1 ? f : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: m,
      c: _.charAt(1) === "=" ? pe(m, _) - m : parseFloat(_) - m,
      m: p && p < 4 ? Math.round : 0
    }, l = xn.lastIndex);
  return u.c = l < i.length ? i.substring(l, i.length) : "", u.fp = a, (ir.test(i) || g) && (u.e = 0), this._pt = u, u;
}, ni = function(t, e, n, i, r, o, a, u, l, c) {
  W(i) && (i = i(r || 0, t, o));
  var h = t[e], d = n !== "get" ? n : W(h) ? l ? t[e.indexOf("set") || !W(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](l) : t[e]() : h, p = W(h) ? l ? xo : Lr : ri, _;
  if (J(i) && (~i.indexOf("random(") && (i = ze(i)), i.charAt(1) === "=" && (_ = pe(d, i) + (it(d) || 0), (_ || _ === 0) && (i = _))), !c || d !== i || Nn)
    return !isNaN(d * i) && i !== "" ? (_ = new ht(this._pt, t, e, +d || 0, i - (d || 0), typeof h == "boolean" ? bo : Rr, 0, p), l && (_.fp = l), a && _.modifier(a, this, t), this._pt = _) : (!h && !(e in t) && Qn(e, i), mo.call(this, t, e, d, i, p, u || xt.stringFilter, l));
}, go = function(t, e, n, i, r) {
  if (W(t) && (t = Ae(t, r, e, n, i)), !Rt(t) || t.style && t.nodeType || rt(t) || er(t))
    return J(t) ? Ae(t, r, e, n, i) : t;
  var o = {}, a;
  for (a in t)
    o[a] = Ae(t[a], r, e, n, i);
  return o;
}, Mr = function(t, e, n, i, r, o) {
  var a, u, l, c;
  if (gt[t] && (a = new gt[t]()).init(r, a.rawVars ? e[t] : go(e[t], i, r, o, n), n, i, o) !== !1 && (n._pt = u = new ht(n._pt, r, t, 0, 1, a.render, a, 0, a.priority), n !== de))
    for (l = n._ptLookup[n._targets.indexOf(r)], c = a._props.length; c--; )
      l[a._props[c]] = u;
  return a;
}, $t, Nn, ii = function s(t, e, n) {
  var i = t.vars, r = i.ease, o = i.startAt, a = i.immediateRender, u = i.lazy, l = i.onUpdate, c = i.runBackwards, h = i.yoyoEase, d = i.keyframes, p = i.autoRevert, _ = t._dur, f = t._startAt, m = t._targets, g = t.parent, y = g && g.data === "nested" ? g.vars.targets : m, v = t._overwrite === "auto" && !Wn, x = t.timeline, w = i.easeReverse || h, k, S, T, b, E, O, C, M, D, R, I, L, G;
  if (x && (!d || !r) && (r = "none"), t._ease = oe(r, Re.ease), t._rEase = w && (oe(w) || t._ease), t._from = !x && !!i.runBackwards, t._from && (t.ratio = 1), !x || d && !i.stagger) {
    if (M = m[0] ? re(m[0]).harness : 0, L = M && i[M.prop], k = rn(i, Zn), f && (f._zTime < 0 && f.progress(1), e < 0 && c && a && !p ? f.render(-1, !0) : f.revert(c && _ ? Ze : $s), f._lazy = 0), o) {
      if (Xt(t._startAt = K.set(m, bt({
        data: "isStart",
        overwrite: !1,
        parent: g,
        immediateRender: !0,
        lazy: !f && ct(u),
        startAt: null,
        delay: 0,
        onUpdate: l && function() {
          return vt(t, "onUpdate");
        },
        stagger: 0
      }, o))), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (tt || !a && !p) && t._startAt.revert(Ze), a && _ && e <= 0 && n <= 0) {
        e && (t._zTime = e);
        return;
      }
    } else if (c && _ && !f) {
      if (e && (a = !1), T = bt({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: a && !f && ct(u),
        immediateRender: a,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: g
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, k), L && (T[M.prop] = L), Xt(t._startAt = K.set(m, T)), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (tt ? t._startAt.revert(Ze) : t._startAt.render(-1, !0)), t._zTime = e, !a)
        s(t._startAt, N, N);
      else if (!e)
        return;
    }
    for (t._pt = t._ptCache = 0, u = _ && ct(u) || u && !_, S = 0; S < m.length; S++) {
      if (E = m[S], C = E._gsap || ti(m)[S]._gsap, t._ptLookup[S] = R = {}, Dn[C.id] && Gt.length && nn(), I = y === m ? S : y.indexOf(E), M && (D = new M()).init(E, L || k, t, I, y) !== !1 && (t._pt = b = new ht(t._pt, E, D.name, 0, 1, D.render, D, 0, D.priority), D._props.forEach(function(et) {
        R[et] = b;
      }), D.priority && (O = 1)), !M || L)
        for (T in k)
          gt[T] && (D = Mr(T, k, t, I, E, y)) ? D.priority && (O = 1) : R[T] = b = ni.call(t, E, T, "get", k[T], I, y, 0, i.stringFilter);
      t._op && t._op[S] && t.kill(E, t._op[S]), v && t._pt && ($t = t, $.killTweensOf(E, R, t.globalTime(e)), G = !t.parent, $t = 0), t._pt && u && (Dn[C.id] = 1);
    }
    O && Fr(t), t._onInit && t._onInit(t);
  }
  t._onUpdate = l, t._initted = (!t._op || t._pt) && !G, d && e <= 0 && x.render(Et, !0, !0);
}, yo = function(t, e, n, i, r, o, a, u) {
  var l = (t._pt && t._ptCache || (t._ptCache = {}))[e], c, h, d, p;
  if (!l)
    for (l = t._ptCache[e] = [], d = t._ptLookup, p = t._targets.length; p--; ) {
      if (c = d[p][e], c && c.d && c.d._pt)
        for (c = c.d._pt; c && c.p !== e && c.fp !== e; )
          c = c._next;
      if (!c)
        return Nn = 1, t.vars[e] = "+=0", ii(t, a), Nn = 0, u ? Ie(e + " not eligible for reset. Try splitting into individual properties") : 1;
      l.push(c);
    }
  for (p = l.length; p--; )
    h = l[p], c = h._pt || h, c.s = (i || i === 0) && !r ? i : c.s + (i || 0) + o * c.c, c.c = n - c.s, h.e && (h.e = X(n) + it(h.e)), h.b && (h.b = c.s + it(h.b));
}, vo = function(t, e) {
  var n = t[0] ? re(t[0]).harness : 0, i = n && n.aliases, r, o, a, u;
  if (!i)
    return e;
  r = ge({}, e);
  for (o in i)
    if (o in r)
      for (u = i[o].split(","), a = u.length; a--; )
        r[u[a]] = r[o];
  return r;
}, wo = function(t, e, n, i) {
  var r = e.ease || i || "power1.inOut", o, a;
  if (rt(e))
    a = n[t] || (n[t] = []), e.forEach(function(u, l) {
      return a.push({
        t: l / (e.length - 1) * 100,
        v: u,
        e: r
      });
    });
  else
    for (o in e)
      a = n[o] || (n[o] = []), o === "ease" || a.push({
        t: parseFloat(t),
        v: e[o],
        e: r
      });
}, Ae = function(t, e, n, i, r) {
  return W(t) ? t.call(e, n, i, r) : J(t) && ~t.indexOf("random(") ? ze(t) : t;
}, Ar = Jn + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert", Dr = {};
ft(Ar + ",id,stagger,delay,duration,paused,scrollTrigger", function(s) {
  return Dr[s] = 1;
});
var K = /* @__PURE__ */ (function(s) {
  Ji(t, s);
  function t(n, i, r, o) {
    var a;
    typeof i == "number" && (r.duration = i, i = r, r = null), a = s.call(this, o ? i : Ce(i)) || this;
    var u = a.vars, l = u.duration, c = u.delay, h = u.immediateRender, d = u.stagger, p = u.overwrite, _ = u.keyframes, f = u.defaults, m = u.scrollTrigger, g = i.parent || $, y = (rt(n) || er(n) ? Vt(n[0]) : "length" in i) ? [n] : Pt(n), v, x, w, k, S, T, b, E;
    if (a._targets = y.length ? ti(y) : Ie("GSAP target " + n + " not found. https://gsap.com", !xt.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = p, _ || d || Qe(l) || Qe(c)) {
      i = a.vars;
      var O = i.easeReverse || i.yoyoEase;
      if (v = a.timeline = new ut({
        data: "nested",
        defaults: f || {},
        targets: g && g.data === "nested" ? g.vars.targets : y
      }), v.kill(), v.parent = v._dp = Nt(a), v._start = 0, d || Qe(l) || Qe(c)) {
        if (k = y.length, b = d && yr(d), Rt(d))
          for (S in d)
            ~Ar.indexOf(S) && (E || (E = {}), E[S] = d[S]);
        for (x = 0; x < k; x++)
          w = rn(i, Dr), w.stagger = 0, O && (w.easeReverse = O), E && ge(w, E), T = y[x], w.duration = +Ae(l, Nt(a), x, T, y), w.delay = (+Ae(c, Nt(a), x, T, y) || 0) - a._delay, !d && k === 1 && w.delay && (a._delay = c = w.delay, a._start += c, w.delay = 0), v.to(T, w, b ? b(x, T, y) : 0), v._ease = A.none;
        v.duration() ? l = c = 0 : a.timeline = 0;
      } else if (_) {
        Ce(bt(v.vars.defaults, {
          ease: "none"
        })), v._ease = oe(_.ease || i.ease || "none");
        var C = 0, M, D, R;
        if (rt(_))
          _.forEach(function(I) {
            return v.to(y, I, ">");
          }), v.duration();
        else {
          w = {};
          for (S in _)
            S === "ease" || S === "easeEach" || wo(S, _[S], w, _.easeEach);
          for (S in w)
            for (M = w[S].sort(function(I, L) {
              return I.t - L.t;
            }), C = 0, x = 0; x < M.length; x++)
              D = M[x], R = {
                ease: D.e,
                duration: (D.t - (x ? M[x - 1].t : 0)) / 100 * l
              }, R[S] = D.v, v.to(y, R, C), C += R.duration;
          v.duration() < l && v.to({}, {
            duration: l - v.duration()
          });
        }
      }
      l || a.duration(l = v.duration());
    } else
      a.timeline = 0;
    return p === !0 && !Wn && ($t = Nt(a), $.killTweensOf(y), $t = 0), Dt(g, Nt(a), r), i.reversed && a.reverse(), i.paused && a.paused(!0), (h || !l && !_ && a._start === B(g._time) && ct(h) && js(Nt(a)) && g.data !== "nested") && (a._tTime = -N, a.render(Math.max(0, -c) || 0)), m && pr(Nt(a), m), a;
  }
  var e = t.prototype;
  return e.render = function(i, r, o) {
    var a = this._time, u = this._tDur, l = this._dur, c = i < 0, h = i > u - N && !c ? u : i < N ? 0 : i, d, p, _, f, m, g, y, v;
    if (!l)
      Qs(this, i, r, o);
    else if (h !== this._tTime || !i || o || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== c || this._lazy) {
      if (d = h, v = this.timeline, this._repeat) {
        if (f = l + this._rDelay, this._repeat < -1 && c)
          return this.totalTime(f * 100 + i, r, o);
        if (d = B(h % f), h === u ? (_ = this._repeat, d = l) : (m = B(h / f), _ = ~~m, _ && _ === m ? (d = l, _--) : d > l && (d = l)), g = this._yoyo && _ & 1, g && (d = l - d), m = ye(this._tTime, f), d === a && !o && this._initted && _ === m)
          return this._tTime = h, this;
        _ !== m && this.vars.repeatRefresh && !g && !this._lock && d !== f && this._initted && (this._lock = o = 1, this.render(B(f * _), !0).invalidate()._lock = 0);
      }
      if (!this._initted) {
        if (_r(this, c ? i : d, o, r, h))
          return this._tTime = 0, this;
        if (a !== this._time && !(o && this.vars.repeatRefresh && _ !== m))
          return this;
        if (l !== this._dur)
          return this.render(i, r, o);
      }
      if (this._rEase) {
        var x = d < a;
        if (x !== this._inv) {
          var w = x ? a : l - a;
          this._inv = x, this._from && (this.ratio = 1 - this.ratio), this._invRatio = this.ratio, this._invTime = a, this._invRecip = w ? (x ? -1 : 1) / w : 0, this._invScale = x ? -this.ratio : 1 - this.ratio, this._invEase = x ? this._rEase : this._ease;
        }
        this.ratio = y = this._invRatio + this._invScale * this._invEase((d - this._invTime) * this._invRecip);
      } else
        this.ratio = y = this._ease(d / l);
      if (this._from && (this.ratio = y = 1 - y), this._tTime = h, this._time = d, !this._act && this._ts && (this._act = 1, this._lazy = 0), !a && h && !r && !m && (vt(this, "onStart"), this._tTime !== h))
        return this;
      for (p = this._pt; p; )
        p.r(y, p.d), p = p._next;
      v && v.render(i < 0 ? i : v._dur * v._ease(d / this._dur), r, o) || this._startAt && (this._zTime = i), this._onUpdate && !r && (c && Ln(this, i, r, o), vt(this, "onUpdate")), this._repeat && _ !== m && this.vars.onRepeat && !r && this.parent && vt(this, "onRepeat"), (h === this._tDur || !h) && this._tTime === h && (c && !this._onUpdate && Ln(this, i, !0, !0), (i || !l) && (h === this._tDur && this._ts > 0 || !h && this._ts < 0) && Xt(this, 1), !r && !(c && !a) && (h || a || g) && (vt(this, h === u ? "onComplete" : "onReverseComplete", !0), this._prom && !(h < u && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, e.targets = function() {
    return this._targets;
  }, e.invalidate = function(i) {
    return (!i || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(i), s.prototype.invalidate.call(this, i);
  }, e.resetTo = function(i, r, o, a, u) {
    Ne || yt.wake(), this._ts || this.play();
    var l = Math.min(this._dur, (this._dp._time - this._start) * this._ts), c;
    return this._initted || ii(this, l), c = this._ease(l / this._dur), yo(this, i, r, o, a, c, l, u) ? this.resetTo(i, r, o, a, 1) : (fn(this, 0), this.parent || hr(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, e.kill = function(i, r) {
    if (r === void 0 && (r = "all"), !i && (!r || r === "all"))
      return this._lazy = this._pt = 0, this.parent ? ke(this) : this.scrollTrigger && this.scrollTrigger.kill(!!tt), this;
    if (this.timeline) {
      var o = this.timeline.totalDuration();
      return this.timeline.killTweensOf(i, r, $t && $t.vars.overwrite !== !0)._first || ke(this), this.parent && o !== this.timeline.totalDuration() && ve(this, this._dur * this.timeline._tDur / o, 0, 1), this;
    }
    var a = this._targets, u = i ? Pt(i) : a, l = this._ptLookup, c = this._pt, h, d, p, _, f, m, g;
    if ((!r || r === "all") && Ws(a, u))
      return r === "all" && (this._pt = 0), ke(this);
    for (h = this._op = this._op || [], r !== "all" && (J(r) && (f = {}, ft(r, function(y) {
      return f[y] = 1;
    }), r = f), r = vo(a, r)), g = a.length; g--; )
      if (~u.indexOf(a[g])) {
        d = l[g], r === "all" ? (h[g] = r, _ = d, p = {}) : (p = h[g] = h[g] || {}, _ = r);
        for (f in _)
          m = d && d[f], m && ((!("kill" in m.d) || m.d.kill(f) === !0) && ln(this, m, "_pt"), delete d[f]), p !== "all" && (p[f] = 1);
      }
    return this._initted && !this._pt && c && ke(this), this;
  }, t.to = function(i, r) {
    return new t(i, r, arguments[2]);
  }, t.from = function(i, r) {
    return Me(1, arguments);
  }, t.delayedCall = function(i, r, o, a) {
    return new t(r, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: i,
      onComplete: r,
      onReverseComplete: r,
      onCompleteParams: o,
      onReverseCompleteParams: o,
      callbackScope: a
    });
  }, t.fromTo = function(i, r, o) {
    return Me(2, arguments);
  }, t.set = function(i, r) {
    return r.duration = 0, r.repeatDelay || (r.repeat = 0), new t(i, r);
  }, t.killTweensOf = function(i, r, o) {
    return $.killTweensOf(i, r, o);
  }, t;
})(qe);
bt(K.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
ft("staggerTo,staggerFrom,staggerFromTo", function(s) {
  K[s] = function() {
    var t = new ut(), e = In.call(arguments, 0);
    return e.splice(s === "staggerFromTo" ? 5 : 4, 0, 0), t[s].apply(t, e);
  };
});
var ri = function(t, e, n) {
  return t[e] = n;
}, Lr = function(t, e, n) {
  return t[e](n);
}, xo = function(t, e, n, i) {
  return t[e](i.fp, n);
}, So = function(t, e, n) {
  return t.setAttribute(e, n);
}, si = function(t, e) {
  return W(t[e]) ? Lr : Xn(t[e]) && t.setAttribute ? So : ri;
}, Rr = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e6) / 1e6, e);
}, bo = function(t, e) {
  return e.set(e.t, e.p, !!(e.s + e.c * t), e);
}, Ir = function(t, e) {
  var n = e._pt, i = "";
  if (!t && e.b)
    i = e.b;
  else if (t === 1 && e.e)
    i = e.e;
  else {
    for (; n; )
      i = n.p + (n.m ? n.m(n.s + n.c * t) : Math.round((n.s + n.c * t) * 1e4) / 1e4) + i, n = n._next;
    i += e.c;
  }
  e.set(e.t, e.p, i, e);
}, oi = function(t, e) {
  for (var n = e._pt; n; )
    n.r(t, n.d), n = n._next;
}, To = function(t, e, n, i) {
  for (var r = this._pt, o; r; )
    o = r._next, r.p === i && r.modifier(t, e, n), r = o;
}, ko = function(t) {
  for (var e = this._pt, n, i; e; )
    i = e._next, e.p === t && !e.op || e.op === t ? ln(this, e, "_pt") : e.dep || (n = 1), e = i;
  return !n;
}, Eo = function(t, e, n, i) {
  i.mSet(t, e, i.m.call(i.tween, n, i.mt), i);
}, Fr = function(t) {
  for (var e = t._pt, n, i, r, o; e; ) {
    for (n = e._next, i = r; i && i.pr > e.pr; )
      i = i._next;
    (e._prev = i ? i._prev : o) ? e._prev._next = e : r = e, (e._next = i) ? i._prev = e : o = e, e = n;
  }
  t._pt = r;
}, ht = /* @__PURE__ */ (function() {
  function s(e, n, i, r, o, a, u, l, c) {
    this.t = n, this.s = r, this.c = o, this.p = i, this.r = a || Rr, this.d = u || this, this.set = l || ri, this.pr = c || 0, this._next = e, e && (e._prev = this);
  }
  var t = s.prototype;
  return t.modifier = function(n, i, r) {
    this.mSet = this.mSet || this.set, this.set = Eo, this.m = n, this.mt = r, this.tween = i;
  }, s;
})();
ft(Jn + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse", function(s) {
  return Zn[s] = 1;
});
St.TweenMax = St.TweenLite = K;
St.TimelineLite = St.TimelineMax = ut;
$ = new ut({
  sortChildren: !1,
  defaults: Re,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
xt.stringFilter = Pr;
var ae = [], tn = {}, Po = [], Ri = 0, Oo = 0, En = function(t) {
  return (tn[t] || Po).map(function(e) {
    return e();
  });
}, qn = function() {
  var t = Date.now(), e = [];
  t - Ri > 2 && (En("matchMediaInit"), ae.forEach(function(n) {
    var i = n.queries, r = n.conditions, o, a, u, l;
    for (a in i)
      o = At.matchMedia(i[a]).matches, o && (u = 1), o !== r[a] && (r[a] = o, l = 1);
    l && (n.revert(), u && e.push(n));
  }), En("matchMediaRevert"), e.forEach(function(n) {
    return n.onMatch(n, function(i) {
      return n.add(null, i);
    });
  }), Ri = t, En("matchMedia"));
}, zr = /* @__PURE__ */ (function() {
  function s(e, n) {
    this.selector = n && Fn(n), this.data = [], this._r = [], this.isReverted = !1, this.id = Oo++, e && this.add(e);
  }
  var t = s.prototype;
  return t.add = function(n, i, r) {
    W(n) && (r = i, i = n, n = W);
    var o = this, a = function() {
      var l = V, c = o.selector, h;
      return l && l !== o && l.data.push(o), r && (o.selector = Fn(r)), V = o, h = i.apply(o, arguments), W(h) && o._r.push(h), V = l, o.selector = c, o.isReverted = !1, h;
    };
    return o.last = a, n === W ? a(o, function(u) {
      return o.add(null, u);
    }) : n ? o[n] = a : a;
  }, t.ignore = function(n) {
    var i = V;
    V = null, n(this), V = i;
  }, t.getTweens = function() {
    var n = [];
    return this.data.forEach(function(i) {
      return i instanceof s ? n.push.apply(n, i.getTweens()) : i instanceof K && !(i.parent && i.parent.data === "nested") && n.push(i);
    }), n;
  }, t.clear = function() {
    this._r.length = this.data.length = 0;
  }, t.kill = function(n, i) {
    var r = this;
    if (n ? (function() {
      for (var a = r.getTweens(), u = r.data.length, l; u--; )
        l = r.data[u], l.data === "isFlip" && (l.revert(), l.getChildren(!0, !0, !1).forEach(function(c) {
          return a.splice(a.indexOf(c), 1);
        }));
      for (a.map(function(c) {
        return {
          g: c._dur || c._delay || c._sat && !c._sat.vars.immediateRender ? c.globalTime(0) : -1 / 0,
          t: c
        };
      }).sort(function(c, h) {
        return h.g - c.g || -1 / 0;
      }).forEach(function(c) {
        return c.t.revert(n);
      }), u = r.data.length; u--; )
        l = r.data[u], l instanceof ut ? l.data !== "nested" && (l.scrollTrigger && l.scrollTrigger.revert(), l.kill()) : !(l instanceof K) && l.revert && l.revert(n);
      r._r.forEach(function(c) {
        return c(n, r);
      }), r.isReverted = !0;
    })() : this.data.forEach(function(a) {
      return a.kill && a.kill();
    }), this.clear(), i)
      for (var o = ae.length; o--; )
        ae[o].id === this.id && ae.splice(o, 1);
  }, t.revert = function(n) {
    this.kill(n || {});
  }, s;
})(), Co = /* @__PURE__ */ (function() {
  function s(e) {
    this.contexts = [], this.scope = e, V && V.data.push(this);
  }
  var t = s.prototype;
  return t.add = function(n, i, r) {
    Rt(n) || (n = {
      matches: n
    });
    var o = new zr(0, r || this.scope), a = o.conditions = {}, u, l, c;
    V && !o.selector && (o.selector = V.selector), this.contexts.push(o), i = o.add("onMatch", i), o.queries = n;
    for (l in n)
      l === "all" ? c = 1 : (u = At.matchMedia(n[l]), u && (ae.indexOf(o) < 0 && ae.push(o), (a[l] = u.matches) && (c = 1), u.addListener ? u.addListener(qn) : u.addEventListener("change", qn)));
    return c && i(o, function(h) {
      return o.add(null, h);
    }), this;
  }, t.revert = function(n) {
    this.kill(n || {});
  }, t.kill = function(n) {
    this.contexts.forEach(function(i) {
      return i.kill(n, !0);
    });
  }, s;
})(), on = {
  registerPlugin: function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    e.forEach(function(i) {
      return Tr(i);
    });
  },
  timeline: function(t) {
    return new ut(t);
  },
  getTweensOf: function(t, e) {
    return $.getTweensOf(t, e);
  },
  getProperty: function(t, e, n, i) {
    J(t) && (t = Pt(t)[0]);
    var r = re(t || {}).get, o = n ? fr : cr;
    return n === "native" && (n = ""), t && (e ? o((gt[e] && gt[e].get || r)(t, e, n, i)) : function(a, u, l) {
      return o((gt[a] && gt[a].get || r)(t, a, u, l));
    });
  },
  quickSetter: function(t, e, n) {
    if (t = Pt(t), t.length > 1) {
      var i = t.map(function(c) {
        return pt.quickSetter(c, e, n);
      }), r = i.length;
      return function(c) {
        for (var h = r; h--; )
          i[h](c);
      };
    }
    t = t[0] || {};
    var o = gt[e], a = re(t), u = a.harness && (a.harness.aliases || {})[e] || e, l = o ? function(c) {
      var h = new o();
      de._pt = 0, h.init(t, n ? c + n : c, de, 0, [t]), h.render(1, h), de._pt && oi(1, de);
    } : a.set(t, u);
    return o ? l : function(c) {
      return l(t, u, n ? c + n : c, a, 1);
    };
  },
  quickTo: function(t, e, n) {
    var i, r = pt.to(t, bt((i = {}, i[e] = "+=0.1", i.paused = !0, i.stagger = 0, i), n || {})), o = function(u, l, c) {
      return r.resetTo(e, u, l, c);
    };
    return o.tween = r, o;
  },
  isTweening: function(t) {
    return $.getTweensOf(t, !0).length > 0;
  },
  defaults: function(t) {
    return t && t.ease && (t.ease = oe(t.ease, Re.ease)), Ci(Re, t || {});
  },
  config: function(t) {
    return Ci(xt, t || {});
  },
  registerEffect: function(t) {
    var e = t.name, n = t.effect, i = t.plugins, r = t.defaults, o = t.extendTimeline;
    (i || "").split(",").forEach(function(a) {
      return a && !gt[a] && !St[a] && Ie(e + " effect requires " + a + " plugin.");
    }), Sn[e] = function(a, u, l) {
      return n(Pt(a), bt(u || {}, r), l);
    }, o && (ut.prototype[e] = function(a, u, l) {
      return this.add(Sn[e](a, Rt(u) ? u : (l = u) && {}, this), l);
    });
  },
  registerEase: function(t, e) {
    A[t] = oe(e);
  },
  parseEase: function(t, e) {
    return arguments.length ? oe(t, e) : A;
  },
  getById: function(t) {
    return $.getById(t);
  },
  exportRoot: function(t, e) {
    t === void 0 && (t = {});
    var n = new ut(t), i, r;
    for (n.smoothChildTiming = ct(t.smoothChildTiming), $.remove(n), n._dp = 0, n._time = n._tTime = $._time, i = $._first; i; )
      r = i._next, (e || !(!i._dur && i instanceof K && i.vars.onComplete === i._targets[0])) && Dt(n, i, i._start - i._delay), i = r;
    return Dt($, n, 0), n;
  },
  context: function(t, e) {
    return t ? new zr(t, e) : V;
  },
  matchMedia: function(t) {
    return new Co(t);
  },
  matchMediaRefresh: function() {
    return ae.forEach(function(t) {
      var e = t.conditions, n, i;
      for (i in e)
        e[i] && (e[i] = !1, n = 1);
      n && t.revert();
    }) || qn();
  },
  addEventListener: function(t, e) {
    var n = tn[t] || (tn[t] = []);
    ~n.indexOf(e) || n.push(e);
  },
  removeEventListener: function(t, e) {
    var n = tn[t], i = n && n.indexOf(e);
    i >= 0 && n.splice(i, 1);
  },
  utils: {
    wrap: so,
    wrapYoyo: oo,
    distribute: yr,
    random: wr,
    snap: vr,
    normalize: ro,
    getUnit: it,
    clamp: to,
    splitColor: kr,
    toArray: Pt,
    selector: Fn,
    mapRange: Sr,
    pipe: no,
    unitize: io,
    interpolate: ao,
    shuffle: gr
  },
  install: sr,
  effects: Sn,
  ticker: yt,
  updateRoot: ut.updateRoot,
  plugins: gt,
  globalTimeline: $,
  core: {
    PropTween: ht,
    globals: or,
    Tween: K,
    Timeline: ut,
    Animation: qe,
    getCache: re,
    _removeLinkedListItem: ln,
    reverting: function() {
      return tt;
    },
    context: function(t) {
      return t && V && (V.data.push(t), t._ctx = V), V;
    },
    suppressOverwrites: function(t) {
      return Wn = t;
    }
  }
};
ft("to,from,fromTo,delayedCall,set,killTweensOf", function(s) {
  return on[s] = K[s];
});
yt.add(ut.updateRoot);
de = on.to({}, {
  duration: 0
});
var Mo = function(t, e) {
  for (var n = t._pt; n && n.p !== e && n.op !== e && n.fp !== e; )
    n = n._next;
  return n;
}, Ao = function(t, e) {
  var n = t._targets, i, r, o;
  for (i in e)
    for (r = n.length; r--; )
      o = t._ptLookup[r][i], o && (o = o.d) && (o._pt && (o = Mo(o, i)), o && o.modifier && o.modifier(e[i], t, n[r], i));
}, Pn = function(t, e) {
  return {
    name: t,
    headless: 1,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(i, r, o) {
      o._onInit = function(a) {
        var u, l;
        if (J(r) && (u = {}, ft(r, function(c) {
          return u[c] = 1;
        }), r = u), e) {
          u = {};
          for (l in r)
            u[l] = e(r[l]);
          r = u;
        }
        Ao(a, r);
      };
    }
  };
}, pt = on.registerPlugin({
  name: "attr",
  init: function(t, e, n, i, r) {
    var o, a, u;
    this.tween = n;
    for (o in e)
      u = t.getAttribute(o) || "", a = this.add(t, "setAttribute", (u || 0) + "", e[o], i, r, 0, 0, o), a.op = o, a.b = u, this._props.push(o);
  },
  render: function(t, e) {
    for (var n = e._pt; n; )
      tt ? n.set(n.t, n.p, n.b, n) : n.r(t, n.d), n = n._next;
  }
}, {
  name: "endArray",
  headless: 1,
  init: function(t, e) {
    for (var n = e.length; n--; )
      this.add(t, n, t[n] || 0, e[n], 0, 0, 0, 0, 0, 1);
  }
}, Pn("roundProps", zn), Pn("modifiers"), Pn("snap", vr)) || on;
K.version = ut.version = pt.version = "3.15.0";
rr = 1;
jn() && we();
A.Power0;
A.Power1;
A.Power2;
A.Power3;
A.Power4;
A.Linear;
A.Quad;
A.Cubic;
A.Quart;
A.Quint;
A.Strong;
A.Elastic;
A.Back;
A.SteppedEase;
A.Bounce;
A.Sine;
A.Expo;
A.Circ;
/*!
 * CSSPlugin 3.15.0
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var Ii, Ht, _e, ai, ie, Fi, ui, Do = function() {
  return typeof window < "u";
}, Ut = {}, ne = 180 / Math.PI, me = Math.PI / 180, fe = Math.atan2, zi = 1e8, li = /([A-Z])/g, Lo = /(left|right|width|margin|padding|x)/i, Ro = /[\s,\(]\S/, Lt = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, Vn = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, Io = function(t, e) {
  return e.set(e.t, e.p, t === 1 ? e.e : Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, Fo = function(t, e) {
  return e.set(e.t, e.p, t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e);
}, zo = function(t, e) {
  return e.set(e.t, e.p, t === 1 ? e.e : t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e);
}, No = function(t, e) {
  var n = e.s + e.c * t;
  e.set(e.t, e.p, ~~(n + (n < 0 ? -0.5 : 0.5)) + e.u, e);
}, Nr = function(t, e) {
  return e.set(e.t, e.p, t ? e.e : e.b, e);
}, qr = function(t, e) {
  return e.set(e.t, e.p, t !== 1 ? e.b : e.e, e);
}, qo = function(t, e, n) {
  return t.style[e] = n;
}, Vo = function(t, e, n) {
  return t.style.setProperty(e, n);
}, Uo = function(t, e, n) {
  return t._gsap[e] = n;
}, Bo = function(t, e, n) {
  return t._gsap.scaleX = t._gsap.scaleY = n;
}, $o = function(t, e, n, i, r) {
  var o = t._gsap;
  o.scaleX = o.scaleY = n, o.renderTransform(r, o);
}, Ho = function(t, e, n, i, r) {
  var o = t._gsap;
  o[e] = n, o.renderTransform(r, o);
}, H = "transform", dt = H + "Origin", Yo = function s(t, e) {
  var n = this, i = this.target, r = i.style, o = i._gsap;
  if (t in Ut && r) {
    if (this.tfm = this.tfm || {}, t !== "transform")
      t = Lt[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(a) {
        return n.tfm[a] = qt(i, a);
      }) : this.tfm[t] = o.x ? o[t] : qt(i, t), t === dt && (this.tfm.zOrigin = o.zOrigin);
    else
      return Lt.transform.split(",").forEach(function(a) {
        return s.call(n, a, e);
      });
    if (this.props.indexOf(H) >= 0)
      return;
    o.svg && (this.svgo = i.getAttribute("data-svg-origin"), this.props.push(dt, e, "")), t = H;
  }
  (r || e) && this.props.push(t, e, r[t]);
}, Vr = function(t) {
  t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"));
}, Go = function() {
  var t = this.props, e = this.target, n = e.style, i = e._gsap, r, o;
  for (r = 0; r < t.length; r += 3)
    t[r + 1] ? t[r + 1] === 2 ? e[t[r]](t[r + 2]) : e[t[r]] = t[r + 2] : t[r + 2] ? n[t[r]] = t[r + 2] : n.removeProperty(t[r].substr(0, 2) === "--" ? t[r] : t[r].replace(li, "-$1").toLowerCase());
  if (this.tfm) {
    for (o in this.tfm)
      i[o] = this.tfm[o];
    i.svg && (i.renderTransform(), e.setAttribute("data-svg-origin", this.svgo || "")), r = ui(), (!r || !r.isStart) && !n[H] && (Vr(n), i.zOrigin && n[dt] && (n[dt] += " " + i.zOrigin + "px", i.zOrigin = 0, i.renderTransform()), i.uncache = 1);
  }
}, Ur = function(t, e) {
  var n = {
    target: t,
    props: [],
    revert: Go,
    save: Yo
  };
  return t._gsap || pt.core.getCache(t), e && t.style && t.nodeType && e.split(",").forEach(function(i) {
    return n.save(i);
  }), n;
}, Br, Un = function(t, e) {
  var n = Ht.createElementNS ? Ht.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : Ht.createElement(t);
  return n && n.style ? n : Ht.createElement(t);
}, wt = function s(t, e, n) {
  var i = getComputedStyle(t);
  return i[e] || i.getPropertyValue(e.replace(li, "-$1").toLowerCase()) || i.getPropertyValue(e) || !n && s(t, xe(e) || e, 1) || "";
}, Ni = "O,Moz,ms,Ms,Webkit".split(","), xe = function(t, e, n) {
  var i = e || ie, r = i.style, o = 5;
  if (t in r && !n)
    return t;
  for (t = t.charAt(0).toUpperCase() + t.substr(1); o-- && !(Ni[o] + t in r); )
    ;
  return o < 0 ? null : (o === 3 ? "ms" : o >= 0 ? Ni[o] : "") + t;
}, Bn = function() {
  Do() && window.document && (Ii = window, Ht = Ii.document, _e = Ht.documentElement, ie = Un("div") || {
    style: {}
  }, Un("div"), H = xe(H), dt = H + "Origin", ie.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", Br = !!xe("perspective"), ui = pt.core.reverting, ai = 1);
}, qi = function(t) {
  var e = t.ownerSVGElement, n = Un("svg", e && e.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), i = t.cloneNode(!0), r;
  i.style.display = "block", n.appendChild(i), _e.appendChild(n);
  try {
    r = i.getBBox();
  } catch {
  }
  return n.removeChild(i), _e.removeChild(n), r;
}, Vi = function(t, e) {
  for (var n = e.length; n--; )
    if (t.hasAttribute(e[n]))
      return t.getAttribute(e[n]);
}, $r = function(t) {
  var e, n;
  try {
    e = t.getBBox();
  } catch {
    e = qi(t), n = 1;
  }
  return e && (e.width || e.height) || n || (e = qi(t)), e && !e.width && !e.x && !e.y ? {
    x: +Vi(t, ["x", "cx", "x1"]) || 0,
    y: +Vi(t, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : e;
}, Hr = function(t) {
  return !!(t.getCTM && (!t.parentNode || t.ownerSVGElement) && $r(t));
}, jt = function(t, e) {
  if (e) {
    var n = t.style, i;
    e in Ut && e !== dt && (e = H), n.removeProperty ? (i = e.substr(0, 2), (i === "ms" || e.substr(0, 6) === "webkit") && (e = "-" + e), n.removeProperty(i === "--" ? e : e.replace(li, "-$1").toLowerCase())) : n.removeAttribute(e);
  }
}, Yt = function(t, e, n, i, r, o) {
  var a = new ht(t._pt, e, n, 0, 1, o ? qr : Nr);
  return t._pt = a, a.b = i, a.e = r, t._props.push(n), a;
}, Ui = {
  deg: 1,
  rad: 1,
  turn: 1
}, Wo = {
  grid: 1,
  flex: 1
}, Kt = function s(t, e, n, i) {
  var r = parseFloat(n) || 0, o = (n + "").trim().substr((r + "").length) || "px", a = ie.style, u = Lo.test(e), l = t.tagName.toLowerCase() === "svg", c = (l ? "client" : "offset") + (u ? "Width" : "Height"), h = 100, d = i === "px", p = i === "%", _, f, m, g;
  if (i === o || !r || Ui[i] || Ui[o])
    return r;
  if (o !== "px" && !d && (r = s(t, e, n, "px")), g = t.getCTM && Hr(t), (p || o === "%") && (Ut[e] || ~e.indexOf("adius")))
    return _ = g ? t.getBBox()[u ? "width" : "height"] : t[c], X(p ? r / _ * h : r / 100 * _);
  if (a[u ? "width" : "height"] = h + (d ? o : i), f = i !== "rem" && ~e.indexOf("adius") || i === "em" && t.appendChild && !l ? t : t.parentNode, g && (f = (t.ownerSVGElement || {}).parentNode), (!f || f === Ht || !f.appendChild) && (f = Ht.body), m = f._gsap, m && p && m.width && u && m.time === yt.time && !m.uncache)
    return X(r / m.width * h);
  if (p && (e === "height" || e === "width")) {
    var y = t.style[e];
    t.style[e] = h + i, _ = t[c], y ? t.style[e] = y : jt(t, e);
  } else
    (p || o === "%") && !Wo[wt(f, "display")] && (a.position = wt(t, "position")), f === t && (a.position = "static"), f.appendChild(ie), _ = ie[c], f.removeChild(ie), a.position = "absolute";
  return u && p && (m = re(f), m.time = yt.time, m.width = f[c]), X(d ? _ * r / h : _ && r ? h / _ * r : 0);
}, qt = function(t, e, n, i) {
  var r;
  return ai || Bn(), e in Lt && e !== "transform" && (e = Lt[e], ~e.indexOf(",") && (e = e.split(",")[0])), Ut[e] && e !== "transform" ? (r = Ue(t, i), r = e !== "transformOrigin" ? r[e] : r.svg ? r.origin : un(wt(t, dt)) + " " + r.zOrigin + "px") : (r = t.style[e], (!r || r === "auto" || i || ~(r + "").indexOf("calc(")) && (r = an[e] && an[e](t, e, n) || wt(t, e) || ur(t, e) || (e === "opacity" ? 1 : 0))), n && !~(r + "").trim().indexOf(" ") ? Kt(t, e, r, n) + n : r;
}, Xo = function(t, e, n, i) {
  if (!n || n === "none") {
    var r = xe(e, t, 1), o = r && wt(t, r, 1);
    o && o !== n ? (e = r, n = o) : e === "borderColor" && (n = wt(t, "borderTopColor"));
  }
  var a = new ht(this._pt, t.style, e, 0, 1, Ir), u = 0, l = 0, c, h, d, p, _, f, m, g, y, v, x, w;
  if (a.b = n, a.e = i, n += "", i += "", i.substring(0, 6) === "var(--" && (i = wt(t, i.substring(4, i.indexOf(")")))), i === "auto" && (f = t.style[e], t.style[e] = i, i = wt(t, e) || i, f ? t.style[e] = f : jt(t, e)), c = [n, i], Pr(c), n = c[0], i = c[1], d = n.match(he) || [], w = i.match(he) || [], w.length) {
    for (; h = he.exec(i); )
      m = h[0], y = i.substring(u, h.index), _ ? _ = (_ + 1) % 5 : (y.substr(-5) === "rgba(" || y.substr(-5) === "hsla(") && (_ = 1), m !== (f = d[l++] || "") && (p = parseFloat(f) || 0, x = f.substr((p + "").length), m.charAt(1) === "=" && (m = pe(p, m) + x), g = parseFloat(m), v = m.substr((g + "").length), u = he.lastIndex - v.length, v || (v = v || xt.units[e] || x, u === i.length && (i += v, a.e += v)), x !== v && (p = Kt(t, e, f, v) || 0), a._pt = {
        _next: a._pt,
        p: y || l === 1 ? y : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: p,
        c: g - p,
        m: _ && _ < 4 || e === "zIndex" ? Math.round : 0
      });
    a.c = u < i.length ? i.substring(u, i.length) : "";
  } else
    a.r = e === "display" && i === "none" ? qr : Nr;
  return ir.test(i) && (a.e = 0), this._pt = a, a;
}, Bi = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, jo = function(t) {
  var e = t.split(" "), n = e[0], i = e[1] || "50%";
  return (n === "top" || n === "bottom" || i === "left" || i === "right") && (t = n, n = i, i = t), e[0] = Bi[n] || n, e[1] = Bi[i] || i, e.join(" ");
}, Ko = function(t, e) {
  if (e.tween && e.tween._time === e.tween._dur) {
    var n = e.t, i = n.style, r = e.u, o = n._gsap, a, u, l;
    if (r === "all" || r === !0)
      i.cssText = "", u = 1;
    else
      for (r = r.split(","), l = r.length; --l > -1; )
        a = r[l], Ut[a] && (u = 1, a = a === "transformOrigin" ? dt : H), jt(n, a);
    u && (jt(n, H), o && (o.svg && n.removeAttribute("transform"), i.scale = i.rotate = i.translate = "none", Ue(n, 1), o.uncache = 1, Vr(i)));
  }
}, an = {
  clearProps: function(t, e, n, i, r) {
    if (r.data !== "isFromStart") {
      var o = t._pt = new ht(t._pt, e, n, 0, 0, Ko);
      return o.u = i, o.pr = -10, o.tween = r, t._props.push(n), 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
}, Ve = [1, 0, 0, 1, 0, 0], Yr = {}, Gr = function(t) {
  return t === "matrix(1, 0, 0, 1, 0, 0)" || t === "none" || !t;
}, $i = function(t) {
  var e = wt(t, H);
  return Gr(e) ? Ve : e.substr(7).match(nr).map(X);
}, ci = function(t, e) {
  var n = t._gsap || re(t), i = t.style, r = $i(t), o, a, u, l;
  return n.svg && t.getAttribute("transform") ? (u = t.transform.baseVal.consolidate().matrix, r = [u.a, u.b, u.c, u.d, u.e, u.f], r.join(",") === "1,0,0,1,0,0" ? Ve : r) : (r === Ve && !t.offsetParent && t !== _e && !n.svg && (u = i.display, i.display = "block", o = t.parentNode, (!o || !t.offsetParent && !t.getBoundingClientRect().width) && (l = 1, a = t.nextElementSibling, _e.appendChild(t)), r = $i(t), u ? i.display = u : jt(t, "display"), l && (a ? o.insertBefore(t, a) : o ? o.appendChild(t) : _e.removeChild(t))), e && r.length > 6 ? [r[0], r[1], r[4], r[5], r[12], r[13]] : r);
}, $n = function(t, e, n, i, r, o) {
  var a = t._gsap, u = r || ci(t, !0), l = a.xOrigin || 0, c = a.yOrigin || 0, h = a.xOffset || 0, d = a.yOffset || 0, p = u[0], _ = u[1], f = u[2], m = u[3], g = u[4], y = u[5], v = e.split(" "), x = parseFloat(v[0]) || 0, w = parseFloat(v[1]) || 0, k, S, T, b;
  n ? u !== Ve && (S = p * m - _ * f) && (T = x * (m / S) + w * (-f / S) + (f * y - m * g) / S, b = x * (-_ / S) + w * (p / S) - (p * y - _ * g) / S, x = T, w = b) : (k = $r(t), x = k.x + (~v[0].indexOf("%") ? x / 100 * k.width : x), w = k.y + (~(v[1] || v[0]).indexOf("%") ? w / 100 * k.height : w)), i || i !== !1 && a.smooth ? (g = x - l, y = w - c, a.xOffset = h + (g * p + y * f) - g, a.yOffset = d + (g * _ + y * m) - y) : a.xOffset = a.yOffset = 0, a.xOrigin = x, a.yOrigin = w, a.smooth = !!i, a.origin = e, a.originIsAbsolute = !!n, t.style[dt] = "0px 0px", o && (Yt(o, a, "xOrigin", l, x), Yt(o, a, "yOrigin", c, w), Yt(o, a, "xOffset", h, a.xOffset), Yt(o, a, "yOffset", d, a.yOffset)), t.setAttribute("data-svg-origin", x + " " + w);
}, Ue = function(t, e) {
  var n = t._gsap || new Cr(t);
  if ("x" in n && !e && !n.uncache)
    return n;
  var i = t.style, r = n.scaleX < 0, o = "px", a = "deg", u = getComputedStyle(t), l = wt(t, dt) || "0", c, h, d, p, _, f, m, g, y, v, x, w, k, S, T, b, E, O, C, M, D, R, I, L, G, et, Ot, nt, at, It, Q, _t;
  return c = h = d = f = m = g = y = v = x = 0, p = _ = 1, n.svg = !!(t.getCTM && Hr(t)), u.translate && ((u.translate !== "none" || u.scale !== "none" || u.rotate !== "none") && (i[H] = (u.translate !== "none" ? "translate3d(" + (u.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (u.rotate !== "none" ? "rotate(" + u.rotate + ") " : "") + (u.scale !== "none" ? "scale(" + u.scale.split(" ").join(",") + ") " : "") + (u[H] !== "none" ? u[H] : "")), i.scale = i.rotate = i.translate = "none"), S = ci(t, n.svg), n.svg && (n.uncache ? (G = t.getBBox(), l = n.xOrigin - G.x + "px " + (n.yOrigin - G.y) + "px", L = "") : L = !e && t.getAttribute("data-svg-origin"), $n(t, L || l, !!L || n.originIsAbsolute, n.smooth !== !1, S)), w = n.xOrigin || 0, k = n.yOrigin || 0, S !== Ve && (O = S[0], C = S[1], M = S[2], D = S[3], c = R = S[4], h = I = S[5], S.length === 6 ? (p = Math.sqrt(O * O + C * C), _ = Math.sqrt(D * D + M * M), f = O || C ? fe(C, O) * ne : 0, y = M || D ? fe(M, D) * ne + f : 0, y && (_ *= Math.abs(Math.cos(y * me))), n.svg && (c -= w - (w * O + k * M), h -= k - (w * C + k * D))) : (_t = S[6], It = S[7], Ot = S[8], nt = S[9], at = S[10], Q = S[11], c = S[12], h = S[13], d = S[14], T = fe(_t, at), m = T * ne, T && (b = Math.cos(-T), E = Math.sin(-T), L = R * b + Ot * E, G = I * b + nt * E, et = _t * b + at * E, Ot = R * -E + Ot * b, nt = I * -E + nt * b, at = _t * -E + at * b, Q = It * -E + Q * b, R = L, I = G, _t = et), T = fe(-M, at), g = T * ne, T && (b = Math.cos(-T), E = Math.sin(-T), L = O * b - Ot * E, G = C * b - nt * E, et = M * b - at * E, Q = D * E + Q * b, O = L, C = G, M = et), T = fe(C, O), f = T * ne, T && (b = Math.cos(T), E = Math.sin(T), L = O * b + C * E, G = R * b + I * E, C = C * b - O * E, I = I * b - R * E, O = L, R = G), m && Math.abs(m) + Math.abs(f) > 359.9 && (m = f = 0, g = 180 - g), p = X(Math.sqrt(O * O + C * C + M * M)), _ = X(Math.sqrt(I * I + _t * _t)), T = fe(R, I), y = Math.abs(T) > 2e-4 ? T * ne : 0, x = Q ? 1 / (Q < 0 ? -Q : Q) : 0), n.svg && (L = t.getAttribute("transform"), n.forceCSS = t.setAttribute("transform", "") || !Gr(wt(t, H)), L && t.setAttribute("transform", L))), Math.abs(y) > 90 && Math.abs(y) < 270 && (r ? (p *= -1, y += f <= 0 ? 180 : -180, f += f <= 0 ? 180 : -180) : (_ *= -1, y += y <= 0 ? 180 : -180)), e = e || n.uncache, n.x = c - ((n.xPercent = c && (!e && n.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-c) ? -50 : 0))) ? t.offsetWidth * n.xPercent / 100 : 0) + o, n.y = h - ((n.yPercent = h && (!e && n.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-h) ? -50 : 0))) ? t.offsetHeight * n.yPercent / 100 : 0) + o, n.z = d + o, n.scaleX = X(p), n.scaleY = X(_), n.rotation = X(f) + a, n.rotationX = X(m) + a, n.rotationY = X(g) + a, n.skewX = y + a, n.skewY = v + a, n.transformPerspective = x + o, (n.zOrigin = parseFloat(l.split(" ")[2]) || !e && n.zOrigin || 0) && (i[dt] = un(l)), n.xOffset = n.yOffset = 0, n.force3D = xt.force3D, n.renderTransform = n.svg ? Zo : Br ? Wr : Qo, n.uncache = 0, n;
}, un = function(t) {
  return (t = t.split(" "))[0] + " " + t[1];
}, On = function(t, e, n) {
  var i = it(e);
  return X(parseFloat(e) + parseFloat(Kt(t, "x", n + "px", i))) + i;
}, Qo = function(t, e) {
  e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, Wr(t, e);
}, te = "0deg", Te = "0px", ee = ") ", Wr = function(t, e) {
  var n = e || this, i = n.xPercent, r = n.yPercent, o = n.x, a = n.y, u = n.z, l = n.rotation, c = n.rotationY, h = n.rotationX, d = n.skewX, p = n.skewY, _ = n.scaleX, f = n.scaleY, m = n.transformPerspective, g = n.force3D, y = n.target, v = n.zOrigin, x = "", w = g === "auto" && t && t !== 1 || g === !0;
  if (v && (h !== te || c !== te)) {
    var k = parseFloat(c) * me, S = Math.sin(k), T = Math.cos(k), b;
    k = parseFloat(h) * me, b = Math.cos(k), o = On(y, o, S * b * -v), a = On(y, a, -Math.sin(k) * -v), u = On(y, u, T * b * -v + v);
  }
  m !== Te && (x += "perspective(" + m + ee), (i || r) && (x += "translate(" + i + "%, " + r + "%) "), (w || o !== Te || a !== Te || u !== Te) && (x += u !== Te || w ? "translate3d(" + o + ", " + a + ", " + u + ") " : "translate(" + o + ", " + a + ee), l !== te && (x += "rotate(" + l + ee), c !== te && (x += "rotateY(" + c + ee), h !== te && (x += "rotateX(" + h + ee), (d !== te || p !== te) && (x += "skew(" + d + ", " + p + ee), (_ !== 1 || f !== 1) && (x += "scale(" + _ + ", " + f + ee), y.style[H] = x || "translate(0, 0)";
}, Zo = function(t, e) {
  var n = e || this, i = n.xPercent, r = n.yPercent, o = n.x, a = n.y, u = n.rotation, l = n.skewX, c = n.skewY, h = n.scaleX, d = n.scaleY, p = n.target, _ = n.xOrigin, f = n.yOrigin, m = n.xOffset, g = n.yOffset, y = n.forceCSS, v = parseFloat(o), x = parseFloat(a), w, k, S, T, b;
  u = parseFloat(u), l = parseFloat(l), c = parseFloat(c), c && (c = parseFloat(c), l += c, u += c), u || l ? (u *= me, l *= me, w = Math.cos(u) * h, k = Math.sin(u) * h, S = Math.sin(u - l) * -d, T = Math.cos(u - l) * d, l && (c *= me, b = Math.tan(l - c), b = Math.sqrt(1 + b * b), S *= b, T *= b, c && (b = Math.tan(c), b = Math.sqrt(1 + b * b), w *= b, k *= b)), w = X(w), k = X(k), S = X(S), T = X(T)) : (w = h, T = d, k = S = 0), (v && !~(o + "").indexOf("px") || x && !~(a + "").indexOf("px")) && (v = Kt(p, "x", o, "px"), x = Kt(p, "y", a, "px")), (_ || f || m || g) && (v = X(v + _ - (_ * w + f * S) + m), x = X(x + f - (_ * k + f * T) + g)), (i || r) && (b = p.getBBox(), v = X(v + i / 100 * b.width), x = X(x + r / 100 * b.height)), b = "matrix(" + w + "," + k + "," + S + "," + T + "," + v + "," + x + ")", p.setAttribute("transform", b), y && (p.style[H] = b);
}, Jo = function(t, e, n, i, r) {
  var o = 360, a = J(r), u = parseFloat(r) * (a && ~r.indexOf("rad") ? ne : 1), l = u - i, c = i + l + "deg", h, d;
  return a && (h = r.split("_")[1], h === "short" && (l %= o, l !== l % (o / 2) && (l += l < 0 ? o : -o)), h === "cw" && l < 0 ? l = (l + o * zi) % o - ~~(l / o) * o : h === "ccw" && l > 0 && (l = (l - o * zi) % o - ~~(l / o) * o)), t._pt = d = new ht(t._pt, e, n, i, l, Io), d.e = c, d.u = "deg", t._props.push(n), d;
}, Hi = function(t, e) {
  for (var n in e)
    t[n] = e[n];
  return t;
}, ta = function(t, e, n) {
  var i = Hi({}, n._gsap), r = "perspective,force3D,transformOrigin,svgOrigin", o = n.style, a, u, l, c, h, d, p, _;
  i.svg ? (l = n.getAttribute("transform"), n.setAttribute("transform", ""), o[H] = e, a = Ue(n, 1), jt(n, H), n.setAttribute("transform", l)) : (l = getComputedStyle(n)[H], o[H] = e, a = Ue(n, 1), o[H] = l);
  for (u in Ut)
    l = i[u], c = a[u], l !== c && r.indexOf(u) < 0 && (p = it(l), _ = it(c), h = p !== _ ? Kt(n, u, l, _) : parseFloat(l), d = parseFloat(c), t._pt = new ht(t._pt, a, u, h, d - h, Vn), t._pt.u = _ || 0, t._props.push(u));
  Hi(a, i);
};
ft("padding,margin,Width,Radius", function(s, t) {
  var e = "Top", n = "Right", i = "Bottom", r = "Left", o = (t < 3 ? [e, n, i, r] : [e + r, e + n, i + n, i + r]).map(function(a) {
    return t < 2 ? s + a : "border" + a + s;
  });
  an[t > 1 ? "border" + s : s] = function(a, u, l, c, h) {
    var d, p;
    if (arguments.length < 4)
      return d = o.map(function(_) {
        return qt(a, _, l);
      }), p = d.join(" "), p.split(d[0]).length === 5 ? d[0] : p;
    d = (c + "").split(" "), p = {}, o.forEach(function(_, f) {
      return p[_] = d[f] = d[f] || d[(f - 1) / 2 | 0];
    }), a.init(u, p, h);
  };
});
var Xr = {
  name: "css",
  register: Bn,
  targetTest: function(t) {
    return t.style && t.nodeType;
  },
  init: function(t, e, n, i, r) {
    var o = this._props, a = t.style, u = n.vars.startAt, l, c, h, d, p, _, f, m, g, y, v, x, w, k, S, T, b;
    ai || Bn(), this.styles = this.styles || Ur(t), T = this.styles.props, this.tween = n;
    for (f in e)
      if (f !== "autoRound" && (c = e[f], !(gt[f] && Mr(f, e, n, i, t, r)))) {
        if (p = typeof c, _ = an[f], p === "function" && (c = c.call(n, i, t, r), p = typeof c), p === "string" && ~c.indexOf("random(") && (c = ze(c)), _)
          _(this, t, f, c, n) && (S = 1);
        else if (f.substr(0, 2) === "--")
          l = (getComputedStyle(t).getPropertyValue(f) + "").trim(), c += "", Wt.lastIndex = 0, Wt.test(l) || (m = it(l), g = it(c), g ? m !== g && (l = Kt(t, f, l, g) + g) : m && (c += m)), this.add(a, "setProperty", l, c, i, r, 0, 0, f), o.push(f), T.push(f, 0, a[f]);
        else if (p !== "undefined") {
          if (u && f in u ? (l = typeof u[f] == "function" ? u[f].call(n, i, t, r) : u[f], J(l) && ~l.indexOf("random(") && (l = ze(l)), it(l + "") || l === "auto" || (l += xt.units[f] || it(qt(t, f)) || ""), (l + "").charAt(1) === "=" && (l = qt(t, f))) : l = qt(t, f), d = parseFloat(l), y = p === "string" && c.charAt(1) === "=" && c.substr(0, 2), y && (c = c.substr(2)), h = parseFloat(c), f in Lt && (f === "autoAlpha" && (d === 1 && qt(t, "visibility") === "hidden" && h && (d = 0), T.push("visibility", 0, a.visibility), Yt(this, a, "visibility", d ? "inherit" : "hidden", h ? "inherit" : "hidden", !h)), f !== "scale" && f !== "transform" && (f = Lt[f], ~f.indexOf(",") && (f = f.split(",")[0]))), v = f in Ut, v) {
            if (this.styles.save(f), b = c, p === "string" && c.substring(0, 6) === "var(--") {
              if (c = wt(t, c.substring(4, c.indexOf(")"))), c.substring(0, 5) === "calc(") {
                var E = t.style.perspective;
                t.style.perspective = c, c = wt(t, "perspective"), E ? t.style.perspective = E : jt(t, "perspective");
              }
              h = parseFloat(c);
            }
            if (x || (w = t._gsap, w.renderTransform && !e.parseTransform || Ue(t, e.parseTransform), k = e.smoothOrigin !== !1 && w.smooth, x = this._pt = new ht(this._pt, a, H, 0, 1, w.renderTransform, w, 0, -1), x.dep = 1), f === "scale")
              this._pt = new ht(this._pt, w, "scaleY", w.scaleY, (y ? pe(w.scaleY, y + h) : h) - w.scaleY || 0, Vn), this._pt.u = 0, o.push("scaleY", f), f += "X";
            else if (f === "transformOrigin") {
              T.push(dt, 0, a[dt]), c = jo(c), w.svg ? $n(t, c, 0, k, 0, this) : (g = parseFloat(c.split(" ")[2]) || 0, g !== w.zOrigin && Yt(this, w, "zOrigin", w.zOrigin, g), Yt(this, a, f, un(l), un(c)));
              continue;
            } else if (f === "svgOrigin") {
              $n(t, c, 1, k, 0, this);
              continue;
            } else if (f in Yr) {
              Jo(this, w, f, d, y ? pe(d, y + c) : c);
              continue;
            } else if (f === "smoothOrigin") {
              Yt(this, w, "smooth", w.smooth, c);
              continue;
            } else if (f === "force3D") {
              w[f] = c;
              continue;
            } else if (f === "transform") {
              ta(this, c, t);
              continue;
            }
          } else f in a || (f = xe(f) || f);
          if (v || (h || h === 0) && (d || d === 0) && !Ro.test(c) && f in a)
            m = (l + "").substr((d + "").length), h || (h = 0), g = it(c) || (f in xt.units ? xt.units[f] : m), m !== g && (d = Kt(t, f, l, g)), this._pt = new ht(this._pt, v ? w : a, f, d, (y ? pe(d, y + h) : h) - d, !v && (g === "px" || f === "zIndex") && e.autoRound !== !1 ? No : Vn), this._pt.u = g || 0, v && b !== c ? (this._pt.b = l, this._pt.e = b, this._pt.r = zo) : m !== g && g !== "%" && (this._pt.b = l, this._pt.r = Fo);
          else if (f in a)
            Xo.call(this, t, f, l, y ? y + c : c);
          else if (f in t)
            this.add(t, f, l || t[f], y ? y + c : c, i, r);
          else if (f !== "parseTransform") {
            Qn(f, c);
            continue;
          }
          v || (f in a ? T.push(f, 0, a[f]) : typeof t[f] == "function" ? T.push(f, 2, t[f]()) : T.push(f, 1, l || t[f])), o.push(f);
        }
      }
    S && Fr(this);
  },
  render: function(t, e) {
    if (e.tween._time || !ui())
      for (var n = e._pt; n; )
        n.r(t, n.d), n = n._next;
    else
      e.styles.revert();
  },
  get: qt,
  aliases: Lt,
  getSetter: function(t, e, n) {
    var i = Lt[e];
    return i && i.indexOf(",") < 0 && (e = i), e in Ut && e !== dt && (t._gsap.x || qt(t, "x")) ? n && Fi === n ? e === "scale" ? Bo : Uo : (Fi = n || {}) && (e === "scale" ? $o : Ho) : t.style && !Xn(t.style[e]) ? qo : ~e.indexOf("-") ? Vo : si(t, e);
  },
  core: {
    _removeProperty: jt,
    _getMatrix: ci
  }
};
pt.utils.checkPrefix = xe;
pt.core.getStyleSaver = Ur;
(function(s, t, e, n) {
  var i = ft(s + "," + t + "," + e, function(r) {
    Ut[r] = 1;
  });
  ft(t, function(r) {
    xt.units[r] = "deg", Yr[r] = 1;
  }), Lt[i[13]] = s + "," + t, ft(n, function(r) {
    var o = r.split(":");
    Lt[o[1]] = i[o[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
ft("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(s) {
  xt.units[s] = "px";
});
pt.registerPlugin(Xr);
var F = pt.registerPlugin(Xr) || pt;
F.core.Tween;
let Yi;
function ea() {
  var a, u, l;
  document.querySelectorAll(".work-list .work-item").forEach((c, h) => {
    const d = c.querySelector("p[data-index]");
    d && (d.textContent = String(h + 1).padStart(3, "0"));
  }), clearInterval(Yi);
  const s = document.querySelectorAll('[aria-label="time"]'), t = () => {
    const c = (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !1
    });
    s.forEach((h) => h.textContent = `${c} CET`);
  };
  t(), Yi = setInterval(t, 1e3), window.innerWidth >= 992 && document.querySelectorAll(".work-item").forEach((c) => {
    const h = c.querySelector(".work-link"), d = c.querySelector(".work-media");
    if (!h || !d) return;
    const p = d.querySelector("video[data-src]"), _ = d.querySelector("img"), f = [_, p].filter(Boolean);
    F.set(f, { opacity: 0 });
    const m = (w) => F.to(w, { opacity: 1, duration: 0.6, ease: "power1.inOut", delay: 0.3 }), g = (w) => {
      F.killTweensOf(w), F.set(w, { opacity: 0 });
    };
    let y = !1, v = !1, x = !1;
    h.addEventListener("mouseenter", () => {
      x = !0, d.style.opacity = "1", _ && m(_), p && (y ? v && (m(p), p.play().catch(() => {
      })) : (y = !0, p.src = p.dataset.src, p.load(), p.addEventListener("canplay", () => {
        v = !0, x && (m(p), p.play().catch(() => {
        }));
      }, { once: !0 })));
    }), h.addEventListener("mouseleave", () => {
      x = !1, d.style.opacity = "0", g(f), p && v && p.pause();
    });
  });
  const e = [...((a = document.querySelector(".header")) == null ? void 0 : a.children) ?? []], n = [...((u = document.querySelector(".footer")) == null ? void 0 : u.children) ?? []], i = [...((l = document.querySelector(".about")) == null ? void 0 : l.children) ?? []], r = document.querySelector(".work");
  r && (i.push(...[...r.children].filter((c) => !c.classList.contains("work-wrapper"))), i.push(...r.querySelectorAll(".work-list .work-item .work-link")));
  const o = [...e, ...n, ...i];
  o.length && (F.set(o, { opacity: 0, backgroundColor: "var(--light-black)" }), F.timeline({
    onComplete() {
      o.forEach((c) => {
        c.style.transition = "background-color 600ms ease", c.style.backgroundColor = "transparent", c.style.pointerEvents = "auto";
      }), setTimeout(() => o.forEach((c) => {
        c.style.transition = "", c.style.backgroundColor = "";
      }), 650), F.to('[aria-label="freelance"]', {
        opacity: 0,
        duration: 0.6,
        ease: "none",
        repeat: -1,
        yoyo: !0
      });
    }
  }).to(e, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.04 }).to(n, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.04 }, "<").to(i, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.08 }));
}
function fi(s) {
  return typeof s == "number";
}
function Hn(s) {
  return typeof s == "string";
}
function hn(s) {
  return typeof s == "boolean";
}
function Gi(s) {
  return Object.prototype.toString.call(s) === "[object Object]";
}
function Y(s) {
  return Math.abs(s);
}
function hi(s) {
  return Math.sign(s);
}
function De(s, t) {
  return Y(s - t);
}
function na(s, t) {
  if (s === 0 || t === 0 || Y(s) <= Y(t)) return 0;
  const e = De(Y(s), Y(t));
  return Y(e / s);
}
function ia(s) {
  return Math.round(s * 100) / 100;
}
function Be(s) {
  return $e(s).map(Number);
}
function Ct(s) {
  return s[Ge(s)];
}
function Ge(s) {
  return Math.max(0, s.length - 1);
}
function di(s, t) {
  return t === Ge(s);
}
function Wi(s, t = 0) {
  return Array.from(Array(s), (e, n) => t + n);
}
function $e(s) {
  return Object.keys(s);
}
function jr(s, t) {
  return [s, t].reduce((e, n) => ($e(n).forEach((i) => {
    const r = e[i], o = n[i], a = Gi(r) && Gi(o);
    e[i] = a ? jr(r, o) : o;
  }), e), {});
}
function Yn(s, t) {
  return typeof t.MouseEvent < "u" && s instanceof t.MouseEvent;
}
function ra(s, t) {
  const e = {
    start: n,
    center: i,
    end: r
  };
  function n() {
    return 0;
  }
  function i(u) {
    return r(u) / 2;
  }
  function r(u) {
    return t - u;
  }
  function o(u, l) {
    return Hn(s) ? e[s](u) : s(t, u, l);
  }
  return {
    measure: o
  };
}
function He() {
  let s = [];
  function t(i, r, o, a = {
    passive: !0
  }) {
    let u;
    if ("addEventListener" in i)
      i.addEventListener(r, o, a), u = () => i.removeEventListener(r, o, a);
    else {
      const l = i;
      l.addListener(o), u = () => l.removeListener(o);
    }
    return s.push(u), n;
  }
  function e() {
    s = s.filter((i) => i());
  }
  const n = {
    add: t,
    clear: e
  };
  return n;
}
function sa(s, t, e, n) {
  const i = He(), r = 1e3 / 60;
  let o = null, a = 0, u = 0;
  function l() {
    i.add(s, "visibilitychange", () => {
      s.hidden && _();
    });
  }
  function c() {
    p(), i.clear();
  }
  function h(m) {
    if (!u) return;
    o || (o = m, e(), e());
    const g = m - o;
    for (o = m, a += g; a >= r; )
      e(), a -= r;
    const y = a / r;
    n(y), u && (u = t.requestAnimationFrame(h));
  }
  function d() {
    u || (u = t.requestAnimationFrame(h));
  }
  function p() {
    t.cancelAnimationFrame(u), o = null, a = 0, u = 0;
  }
  function _() {
    o = null, a = 0;
  }
  return {
    init: l,
    destroy: c,
    start: d,
    stop: p,
    update: e,
    render: n
  };
}
function oa(s, t) {
  const e = t === "rtl", n = s === "y", i = n ? "y" : "x", r = n ? "x" : "y", o = !n && e ? -1 : 1, a = c(), u = h();
  function l(_) {
    const {
      height: f,
      width: m
    } = _;
    return n ? f : m;
  }
  function c() {
    return n ? "top" : e ? "right" : "left";
  }
  function h() {
    return n ? "bottom" : e ? "left" : "right";
  }
  function d(_) {
    return _ * o;
  }
  return {
    scroll: i,
    cross: r,
    startEdge: a,
    endEdge: u,
    measureSize: l,
    direction: d
  };
}
function ue(s = 0, t = 0) {
  const e = Y(s - t);
  function n(l) {
    return l < s;
  }
  function i(l) {
    return l > t;
  }
  function r(l) {
    return n(l) || i(l);
  }
  function o(l) {
    return r(l) ? n(l) ? s : t : l;
  }
  function a(l) {
    return e ? l - e * Math.ceil((l - t) / e) : l;
  }
  return {
    length: e,
    max: t,
    min: s,
    constrain: o,
    reachedAny: r,
    reachedMax: i,
    reachedMin: n,
    removeOffset: a
  };
}
function Kr(s, t, e) {
  const {
    constrain: n
  } = ue(0, s), i = s + 1;
  let r = o(t);
  function o(d) {
    return e ? Y((i + d) % i) : n(d);
  }
  function a() {
    return r;
  }
  function u(d) {
    return r = o(d), h;
  }
  function l(d) {
    return c().set(a() + d);
  }
  function c() {
    return Kr(s, a(), e);
  }
  const h = {
    get: a,
    set: u,
    add: l,
    clone: c
  };
  return h;
}
function aa(s, t, e, n, i, r, o, a, u, l, c, h, d, p, _, f, m, g, y) {
  const {
    cross: v,
    direction: x
  } = s, w = ["INPUT", "SELECT", "TEXTAREA"], k = {
    passive: !1
  }, S = He(), T = He(), b = ue(50, 225).constrain(p.measure(20)), E = {
    mouse: 300,
    touch: 400
  }, O = {
    mouse: 500,
    touch: 600
  }, C = _ ? 43 : 25;
  let M = !1, D = 0, R = 0, I = !1, L = !1, G = !1, et = !1;
  function Ot(P) {
    if (!y) return;
    function q(ot) {
      (hn(y) || y(P, ot)) && Se(ot);
    }
    const j = t;
    S.add(j, "dragstart", (ot) => ot.preventDefault(), k).add(j, "touchmove", () => {
    }, k).add(j, "touchend", () => {
    }).add(j, "touchstart", q).add(j, "mousedown", q).add(j, "touchcancel", st).add(j, "contextmenu", st).add(j, "click", Ft, !0);
  }
  function nt() {
    S.clear(), T.clear();
  }
  function at() {
    const P = et ? e : t;
    T.add(P, "touchmove", mt, k).add(P, "touchend", st).add(P, "mousemove", mt, k).add(P, "mouseup", st);
  }
  function It(P) {
    const q = P.nodeName || "";
    return w.includes(q);
  }
  function Q() {
    return (_ ? O : E)[et ? "mouse" : "touch"];
  }
  function _t(P, q) {
    const j = h.add(hi(P) * -1), ot = c.byDistance(P, !_).distance;
    return _ || Y(P) < b ? ot : m && q ? ot * 0.5 : c.byIndex(j.get(), 0).distance;
  }
  function Se(P) {
    const q = Yn(P, n);
    et = q, G = _ && q && !P.buttons && M, M = De(i.get(), o.get()) >= 2, !(q && P.button !== 0) && (It(P.target) || (I = !0, r.pointerDown(P), l.useFriction(0).useDuration(0), i.set(o), at(), D = r.readPoint(P), R = r.readPoint(P, v), d.emit("pointerDown")));
  }
  function mt(P) {
    if (!Yn(P, n) && P.touches.length >= 2) return st(P);
    const j = r.readPoint(P), ot = r.readPoint(P, v), Mt = De(j, D), zt = De(ot, R);
    if (!L && !et && (!P.cancelable || (L = Mt > zt, !L)))
      return st(P);
    const Zt = r.pointerMove(P);
    Mt > f && (G = !0), l.useFriction(0.3).useDuration(0.75), a.start(), i.add(x(Zt)), P.preventDefault();
  }
  function st(P) {
    const j = c.byDistance(0, !1).index !== h.get(), ot = r.pointerUp(P) * Q(), Mt = _t(x(ot), j), zt = na(ot, Mt), Zt = C - 10 * zt, Bt = g + zt / 50;
    L = !1, I = !1, T.clear(), l.useDuration(Zt).useFriction(Bt), u.distance(Mt, !_), et = !1, d.emit("pointerUp");
  }
  function Ft(P) {
    G && (P.stopPropagation(), P.preventDefault(), G = !1);
  }
  function Tt() {
    return I;
  }
  return {
    init: Ot,
    destroy: nt,
    pointerDown: Tt
  };
}
function ua(s, t) {
  let n, i;
  function r(h) {
    return h.timeStamp;
  }
  function o(h, d) {
    const _ = `client${(d || s.scroll) === "x" ? "X" : "Y"}`;
    return (Yn(h, t) ? h : h.touches[0])[_];
  }
  function a(h) {
    return n = h, i = h, o(h);
  }
  function u(h) {
    const d = o(h) - o(i), p = r(h) - r(n) > 170;
    return i = h, p && (n = h), d;
  }
  function l(h) {
    if (!n || !i) return 0;
    const d = o(i) - o(n), p = r(h) - r(n), _ = r(h) - r(i) > 170, f = d / p;
    return p && !_ && Y(f) > 0.1 ? f : 0;
  }
  return {
    pointerDown: a,
    pointerMove: u,
    pointerUp: l,
    readPoint: o
  };
}
function la() {
  function s(e) {
    const {
      offsetTop: n,
      offsetLeft: i,
      offsetWidth: r,
      offsetHeight: o
    } = e;
    return {
      top: n,
      right: i + r,
      bottom: n + o,
      left: i,
      width: r,
      height: o
    };
  }
  return {
    measure: s
  };
}
function ca(s) {
  function t(n) {
    return s * (n / 100);
  }
  return {
    measure: t
  };
}
function fa(s, t, e, n, i, r, o) {
  const a = [s].concat(n);
  let u, l, c = [], h = !1;
  function d(m) {
    return i.measureSize(o.measure(m));
  }
  function p(m) {
    if (!r) return;
    l = d(s), c = n.map(d);
    function g(y) {
      for (const v of y) {
        if (h) return;
        const x = v.target === s, w = n.indexOf(v.target), k = x ? l : c[w], S = d(x ? s : n[w]);
        if (Y(S - k) >= 0.5) {
          m.reInit(), t.emit("resize");
          break;
        }
      }
    }
    u = new ResizeObserver((y) => {
      (hn(r) || r(m, y)) && g(y);
    }), e.requestAnimationFrame(() => {
      a.forEach((y) => u.observe(y));
    });
  }
  function _() {
    h = !0, u && u.disconnect();
  }
  return {
    init: p,
    destroy: _
  };
}
function ha(s, t, e, n, i, r) {
  let o = 0, a = 0, u = i, l = r, c = s.get(), h = 0;
  function d() {
    const k = n.get() - s.get(), S = !u;
    let T = 0;
    return S ? (o = 0, e.set(n), s.set(n), T = k) : (e.set(s), o += k / u, o *= l, c += o, s.add(o), T = c - h), a = hi(T), h = c, w;
  }
  function p() {
    const k = n.get() - t.get();
    return Y(k) < 1e-3;
  }
  function _() {
    return u;
  }
  function f() {
    return a;
  }
  function m() {
    return o;
  }
  function g() {
    return v(i);
  }
  function y() {
    return x(r);
  }
  function v(k) {
    return u = k, w;
  }
  function x(k) {
    return l = k, w;
  }
  const w = {
    direction: f,
    duration: _,
    velocity: m,
    seek: d,
    settled: p,
    useBaseFriction: y,
    useBaseDuration: g,
    useFriction: x,
    useDuration: v
  };
  return w;
}
function da(s, t, e, n, i) {
  const r = i.measure(10), o = i.measure(50), a = ue(0.1, 0.99);
  let u = !1;
  function l() {
    return !(u || !s.reachedAny(e.get()) || !s.reachedAny(t.get()));
  }
  function c(p) {
    if (!l()) return;
    const _ = s.reachedMin(t.get()) ? "min" : "max", f = Y(s[_] - t.get()), m = e.get() - t.get(), g = a.constrain(f / o);
    e.subtract(m * g), !p && Y(m) < r && (e.set(s.constrain(e.get())), n.useDuration(25).useBaseFriction());
  }
  function h(p) {
    u = !p;
  }
  return {
    shouldConstrain: l,
    constrain: c,
    toggleActive: h
  };
}
function pa(s, t, e, n, i) {
  const r = ue(-t + s, 0), o = h(), a = c(), u = d();
  function l(_, f) {
    return De(_, f) <= 1;
  }
  function c() {
    const _ = o[0], f = Ct(o), m = o.lastIndexOf(_), g = o.indexOf(f) + 1;
    return ue(m, g);
  }
  function h() {
    return e.map((_, f) => {
      const {
        min: m,
        max: g
      } = r, y = r.constrain(_), v = !f, x = di(e, f);
      return v ? g : x || l(m, y) ? m : l(g, y) ? g : y;
    }).map((_) => parseFloat(_.toFixed(3)));
  }
  function d() {
    if (t <= s + i) return [r.max];
    if (n === "keepSnaps") return o;
    const {
      min: _,
      max: f
    } = a;
    return o.slice(_, f);
  }
  return {
    snapsContained: u,
    scrollContainLimit: a
  };
}
function _a(s, t, e) {
  const n = t[0], i = e ? n - s : Ct(t);
  return {
    limit: ue(i, n)
  };
}
function ma(s, t, e, n) {
  const r = t.min + 0.1, o = t.max + 0.1, {
    reachedMin: a,
    reachedMax: u
  } = ue(r, o);
  function l(d) {
    return d === 1 ? u(e.get()) : d === -1 ? a(e.get()) : !1;
  }
  function c(d) {
    if (!l(d)) return;
    const p = s * (d * -1);
    n.forEach((_) => _.add(p));
  }
  return {
    loop: c
  };
}
function ga(s) {
  const {
    max: t,
    length: e
  } = s;
  function n(r) {
    const o = r - t;
    return e ? o / -e : 0;
  }
  return {
    get: n
  };
}
function ya(s, t, e, n, i) {
  const {
    startEdge: r,
    endEdge: o
  } = s, {
    groupSlides: a
  } = i, u = h().map(t.measure), l = d(), c = p();
  function h() {
    return a(n).map((f) => Ct(f)[o] - f[0][r]).map(Y);
  }
  function d() {
    return n.map((f) => e[r] - f[r]).map((f) => -Y(f));
  }
  function p() {
    return a(l).map((f) => f[0]).map((f, m) => f + u[m]);
  }
  return {
    snaps: l,
    snapsAligned: c
  };
}
function va(s, t, e, n, i, r) {
  const {
    groupSlides: o
  } = i, {
    min: a,
    max: u
  } = n, l = c();
  function c() {
    const d = o(r), p = !s || t === "keepSnaps";
    return e.length === 1 ? [r] : p ? d : d.slice(a, u).map((_, f, m) => {
      const g = !f, y = di(m, f);
      if (g) {
        const v = Ct(m[0]) + 1;
        return Wi(v);
      }
      if (y) {
        const v = Ge(r) - Ct(m)[0] + 1;
        return Wi(v, Ct(m)[0]);
      }
      return _;
    });
  }
  return {
    slideRegistry: l
  };
}
function wa(s, t, e, n, i) {
  const {
    reachedAny: r,
    removeOffset: o,
    constrain: a
  } = n;
  function u(_) {
    return _.concat().sort((f, m) => Y(f) - Y(m))[0];
  }
  function l(_) {
    const f = s ? o(_) : a(_), m = t.map((y, v) => ({
      diff: c(y - f, 0),
      index: v
    })).sort((y, v) => Y(y.diff) - Y(v.diff)), {
      index: g
    } = m[0];
    return {
      index: g,
      distance: f
    };
  }
  function c(_, f) {
    const m = [_, _ + e, _ - e];
    if (!s) return _;
    if (!f) return u(m);
    const g = m.filter((y) => hi(y) === f);
    return g.length ? u(g) : Ct(m) - e;
  }
  function h(_, f) {
    const m = t[_] - i.get(), g = c(m, f);
    return {
      index: _,
      distance: g
    };
  }
  function d(_, f) {
    const m = i.get() + _, {
      index: g,
      distance: y
    } = l(m), v = !s && r(m);
    if (!f || v) return {
      index: g,
      distance: _
    };
    const x = t[g] - y, w = _ + c(x, 0);
    return {
      index: g,
      distance: w
    };
  }
  return {
    byDistance: d,
    byIndex: h,
    shortcut: c
  };
}
function xa(s, t, e, n, i, r, o) {
  function a(h) {
    const d = h.distance, p = h.index !== t.get();
    r.add(d), d && (n.duration() ? s.start() : (s.update(), s.render(1), s.update())), p && (e.set(t.get()), t.set(h.index), o.emit("select"));
  }
  function u(h, d) {
    const p = i.byDistance(h, d);
    a(p);
  }
  function l(h, d) {
    const p = t.clone().set(h), _ = i.byIndex(p.get(), d);
    a(_);
  }
  return {
    distance: u,
    index: l
  };
}
function Sa(s, t, e, n, i, r, o, a) {
  const u = {
    passive: !0,
    capture: !0
  };
  let l = 0;
  function c(p) {
    if (!a) return;
    function _(f) {
      if ((/* @__PURE__ */ new Date()).getTime() - l > 10) return;
      o.emit("slideFocusStart"), s.scrollLeft = 0;
      const y = e.findIndex((v) => v.includes(f));
      fi(y) && (i.useDuration(0), n.index(y, 0), o.emit("slideFocus"));
    }
    r.add(document, "keydown", h, !1), t.forEach((f, m) => {
      r.add(f, "focus", (g) => {
        (hn(a) || a(p, g)) && _(m);
      }, u);
    });
  }
  function h(p) {
    p.code === "Tab" && (l = (/* @__PURE__ */ new Date()).getTime());
  }
  return {
    init: c
  };
}
function Pe(s) {
  let t = s;
  function e() {
    return t;
  }
  function n(u) {
    t = o(u);
  }
  function i(u) {
    t += o(u);
  }
  function r(u) {
    t -= o(u);
  }
  function o(u) {
    return fi(u) ? u : u.get();
  }
  return {
    get: e,
    set: n,
    add: i,
    subtract: r
  };
}
function Qr(s, t) {
  const e = s.scroll === "x" ? o : a, n = t.style;
  let i = null, r = !1;
  function o(d) {
    return `translate3d(${d}px,0px,0px)`;
  }
  function a(d) {
    return `translate3d(0px,${d}px,0px)`;
  }
  function u(d) {
    if (r) return;
    const p = ia(s.direction(d));
    p !== i && (n.transform = e(p), i = p);
  }
  function l(d) {
    r = !d;
  }
  function c() {
    r || (n.transform = "", t.getAttribute("style") || t.removeAttribute("style"));
  }
  return {
    clear: c,
    to: u,
    toggleActive: l
  };
}
function ba(s, t, e, n, i, r, o, a, u) {
  const c = Be(i), h = Be(i).reverse(), d = g().concat(y());
  function p(S, T) {
    return S.reduce((b, E) => b - i[E], T);
  }
  function _(S, T) {
    return S.reduce((b, E) => p(b, T) > 0 ? b.concat([E]) : b, []);
  }
  function f(S) {
    return r.map((T, b) => ({
      start: T - n[b] + 0.5 + S,
      end: T + t - 0.5 + S
    }));
  }
  function m(S, T, b) {
    const E = f(T);
    return S.map((O) => {
      const C = b ? 0 : -e, M = b ? e : 0, D = b ? "end" : "start", R = E[O][D];
      return {
        index: O,
        loopPoint: R,
        slideLocation: Pe(-1),
        translate: Qr(s, u[O]),
        target: () => a.get() > R ? C : M
      };
    });
  }
  function g() {
    const S = o[0], T = _(h, S);
    return m(T, e, !1);
  }
  function y() {
    const S = t - o[0] - 1, T = _(c, S);
    return m(T, -e, !0);
  }
  function v() {
    return d.every(({
      index: S
    }) => {
      const T = c.filter((b) => b !== S);
      return p(T, t) <= 0.1;
    });
  }
  function x() {
    d.forEach((S) => {
      const {
        target: T,
        translate: b,
        slideLocation: E
      } = S, O = T();
      O !== E.get() && (b.to(O), E.set(O));
    });
  }
  function w() {
    d.forEach((S) => S.translate.clear());
  }
  return {
    canLoop: v,
    clear: w,
    loop: x,
    loopPoints: d
  };
}
function Ta(s, t, e) {
  let n, i = !1;
  function r(u) {
    if (!e) return;
    function l(c) {
      for (const h of c)
        if (h.type === "childList") {
          u.reInit(), t.emit("slidesChanged");
          break;
        }
    }
    n = new MutationObserver((c) => {
      i || (hn(e) || e(u, c)) && l(c);
    }), n.observe(s, {
      childList: !0
    });
  }
  function o() {
    n && n.disconnect(), i = !0;
  }
  return {
    init: r,
    destroy: o
  };
}
function ka(s, t, e, n) {
  const i = {};
  let r = null, o = null, a, u = !1;
  function l() {
    a = new IntersectionObserver((_) => {
      u || (_.forEach((f) => {
        const m = t.indexOf(f.target);
        i[m] = f;
      }), r = null, o = null, e.emit("slidesInView"));
    }, {
      root: s.parentElement,
      threshold: n
    }), t.forEach((_) => a.observe(_));
  }
  function c() {
    a && a.disconnect(), u = !0;
  }
  function h(_) {
    return $e(i).reduce((f, m) => {
      const g = parseInt(m), {
        isIntersecting: y
      } = i[g];
      return (_ && y || !_ && !y) && f.push(g), f;
    }, []);
  }
  function d(_ = !0) {
    if (_ && r) return r;
    if (!_ && o) return o;
    const f = h(_);
    return _ && (r = f), _ || (o = f), f;
  }
  return {
    init: l,
    destroy: c,
    get: d
  };
}
function Ea(s, t, e, n, i, r) {
  const {
    measureSize: o,
    startEdge: a,
    endEdge: u
  } = s, l = e[0] && i, c = _(), h = f(), d = e.map(o), p = m();
  function _() {
    if (!l) return 0;
    const y = e[0];
    return Y(t[a] - y[a]);
  }
  function f() {
    if (!l) return 0;
    const y = r.getComputedStyle(Ct(n));
    return parseFloat(y.getPropertyValue(`margin-${u}`));
  }
  function m() {
    return e.map((y, v, x) => {
      const w = !v, k = di(x, v);
      return w ? d[v] + c : k ? d[v] + h : x[v + 1][a] - y[a];
    }).map(Y);
  }
  return {
    slideSizes: d,
    slideSizesWithGaps: p,
    startGap: c,
    endGap: h
  };
}
function Pa(s, t, e, n, i, r, o, a, u) {
  const {
    startEdge: l,
    endEdge: c,
    direction: h
  } = s, d = fi(e);
  function p(g, y) {
    return Be(g).filter((v) => v % y === 0).map((v) => g.slice(v, v + y));
  }
  function _(g) {
    return g.length ? Be(g).reduce((y, v, x) => {
      const w = Ct(y) || 0, k = w === 0, S = v === Ge(g), T = i[l] - r[w][l], b = i[l] - r[v][c], E = !n && k ? h(o) : 0, O = !n && S ? h(a) : 0, C = Y(b - O - (T + E));
      return x && C > t + u && y.push(v), S && y.push(g.length), y;
    }, []).map((y, v, x) => {
      const w = Math.max(x[v - 1] || 0);
      return g.slice(w, y);
    }) : [];
  }
  function f(g) {
    return d ? p(g, e) : _(g);
  }
  return {
    groupSlides: f
  };
}
function Oa(s, t, e, n, i, r, o) {
  const {
    align: a,
    axis: u,
    direction: l,
    startIndex: c,
    loop: h,
    duration: d,
    dragFree: p,
    dragThreshold: _,
    inViewThreshold: f,
    slidesToScroll: m,
    skipSnaps: g,
    containScroll: y,
    watchResize: v,
    watchSlides: x,
    watchDrag: w,
    watchFocus: k
  } = r, S = 2, T = la(), b = T.measure(t), E = e.map(T.measure), O = oa(u, l), C = O.measureSize(b), M = ca(C), D = ra(a, C), R = !h && !!y, I = h || !!y, {
    slideSizes: L,
    slideSizesWithGaps: G,
    startGap: et,
    endGap: Ot
  } = Ea(O, b, E, e, I, i), nt = Pa(O, C, m, h, b, E, et, Ot, S), {
    snaps: at,
    snapsAligned: It
  } = ya(O, D, b, E, nt), Q = -Ct(at) + Ct(G), {
    snapsContained: _t,
    scrollContainLimit: Se
  } = pa(C, Q, It, y, S), mt = R ? _t : It, {
    limit: st
  } = _a(Q, mt, h), Ft = Kr(Ge(mt), c, h), Tt = Ft.clone(), U = Be(e), P = ({
    dragHandler: ce,
    scrollBody: mn,
    scrollBounds: gn,
    options: {
      loop: We
    }
  }) => {
    We || gn.constrain(ce.pointerDown()), mn.seek();
  }, q = ({
    scrollBody: ce,
    translate: mn,
    location: gn,
    offsetLocation: We,
    previousLocation: es,
    scrollLooper: ns,
    slideLooper: is,
    dragHandler: rs,
    animation: ss,
    eventHandler: yi,
    scrollBounds: os,
    options: {
      loop: vi
    }
  }, wi) => {
    const xi = ce.settled(), as = !os.shouldConstrain(), Si = vi ? xi : xi && as, bi = Si && !rs.pointerDown();
    bi && ss.stop();
    const us = gn.get() * wi + es.get() * (1 - wi);
    We.set(us), vi && (ns.loop(ce.direction()), is.loop()), mn.to(We.get()), bi && yi.emit("settle"), Si || yi.emit("scroll");
  }, j = sa(n, i, () => P(_n), (ce) => q(_n, ce)), ot = 0.68, Mt = mt[Ft.get()], zt = Pe(Mt), Zt = Pe(Mt), Bt = Pe(Mt), Jt = Pe(Mt), be = ha(zt, Bt, Zt, Jt, d, ot), dn = wa(h, mt, Q, st, Jt), pn = xa(j, Ft, Tt, be, dn, Jt, o), _i = ga(st), mi = He(), Jr = ka(t, e, o, f), {
    slideRegistry: gi
  } = va(R, y, mt, Se, nt, U), ts = Sa(s, e, gi, pn, be, mi, o, k), _n = {
    ownerDocument: n,
    ownerWindow: i,
    eventHandler: o,
    containerRect: b,
    slideRects: E,
    animation: j,
    axis: O,
    dragHandler: aa(O, s, n, i, Jt, ua(O, i), zt, j, pn, be, dn, Ft, o, M, p, _, g, ot, w),
    eventStore: mi,
    percentOfView: M,
    index: Ft,
    indexPrevious: Tt,
    limit: st,
    location: zt,
    offsetLocation: Bt,
    previousLocation: Zt,
    options: r,
    resizeHandler: fa(t, o, i, e, O, v, T),
    scrollBody: be,
    scrollBounds: da(st, Bt, Jt, be, M),
    scrollLooper: ma(Q, st, Bt, [zt, Bt, Zt, Jt]),
    scrollProgress: _i,
    scrollSnapList: mt.map(_i.get),
    scrollSnaps: mt,
    scrollTarget: dn,
    scrollTo: pn,
    slideLooper: ba(O, C, Q, L, G, at, mt, Bt, e),
    slideFocus: ts,
    slidesHandler: Ta(t, o, x),
    slidesInView: Jr,
    slideIndexes: U,
    slideRegistry: gi,
    slidesToScroll: nt,
    target: Jt,
    translate: Qr(O, t)
  };
  return _n;
}
function Ca() {
  let s = {}, t;
  function e(l) {
    t = l;
  }
  function n(l) {
    return s[l] || [];
  }
  function i(l) {
    return n(l).forEach((c) => c(t, l)), u;
  }
  function r(l, c) {
    return s[l] = n(l).concat([c]), u;
  }
  function o(l, c) {
    return s[l] = n(l).filter((h) => h !== c), u;
  }
  function a() {
    s = {};
  }
  const u = {
    init: e,
    emit: i,
    off: o,
    on: r,
    clear: a
  };
  return u;
}
const Ma = {
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
function Aa(s) {
  function t(r, o) {
    return jr(r, o || {});
  }
  function e(r) {
    const o = r.breakpoints || {}, a = $e(o).filter((u) => s.matchMedia(u).matches).map((u) => o[u]).reduce((u, l) => t(u, l), {});
    return t(r, a);
  }
  function n(r) {
    return r.map((o) => $e(o.breakpoints || {})).reduce((o, a) => o.concat(a), []).map(s.matchMedia);
  }
  return {
    mergeOptions: t,
    optionsAtMedia: e,
    optionsMediaQueries: n
  };
}
function Da(s) {
  let t = [];
  function e(r, o) {
    return t = o.filter(({
      options: a
    }) => s.optionsAtMedia(a).active !== !1), t.forEach((a) => a.init(r, s)), o.reduce((a, u) => Object.assign(a, {
      [u.name]: u
    }), {});
  }
  function n() {
    t = t.filter((r) => r.destroy());
  }
  return {
    init: e,
    destroy: n
  };
}
function pi(s, t, e) {
  const n = s.ownerDocument, i = n.defaultView, r = Aa(i), o = Da(r), a = He(), u = Ca(), {
    mergeOptions: l,
    optionsAtMedia: c,
    optionsMediaQueries: h
  } = r, {
    on: d,
    off: p,
    emit: _
  } = u, f = O;
  let m = !1, g, y = l(Ma, pi.globalOptions), v = l(y), x = [], w, k, S;
  function T() {
    const {
      container: U,
      slides: P
    } = v;
    k = (Hn(U) ? s.querySelector(U) : U) || s.children[0];
    const j = Hn(P) ? k.querySelectorAll(P) : P;
    S = [].slice.call(j || k.children);
  }
  function b(U) {
    const P = Oa(s, k, S, n, i, U, u);
    if (U.loop && !P.slideLooper.canLoop()) {
      const q = Object.assign({}, U, {
        loop: !1
      });
      return b(q);
    }
    return P;
  }
  function E(U, P) {
    m || (y = l(y, U), v = c(y), x = P || x, T(), g = b(v), h([y, ...x.map(({
      options: q
    }) => q)]).forEach((q) => a.add(q, "change", O)), v.active && (g.translate.to(g.location.get()), g.animation.init(), g.slidesInView.init(), g.slideFocus.init(Tt), g.eventHandler.init(Tt), g.resizeHandler.init(Tt), g.slidesHandler.init(Tt), g.options.loop && g.slideLooper.loop(), k.offsetParent && S.length && g.dragHandler.init(Tt), w = o.init(Tt, x)));
  }
  function O(U, P) {
    const q = nt();
    C(), E(l({
      startIndex: q
    }, U), P), u.emit("reInit");
  }
  function C() {
    g.dragHandler.destroy(), g.eventStore.clear(), g.translate.clear(), g.slideLooper.clear(), g.resizeHandler.destroy(), g.slidesHandler.destroy(), g.slidesInView.destroy(), g.animation.destroy(), o.destroy(), a.clear();
  }
  function M() {
    m || (m = !0, a.clear(), C(), u.emit("destroy"), u.clear());
  }
  function D(U, P, q) {
    !v.active || m || (g.scrollBody.useBaseFriction().useDuration(P === !0 ? 0 : v.duration), g.scrollTo.index(U, q || 0));
  }
  function R(U) {
    const P = g.index.add(1).get();
    D(P, U, -1);
  }
  function I(U) {
    const P = g.index.add(-1).get();
    D(P, U, 1);
  }
  function L() {
    return g.index.add(1).get() !== nt();
  }
  function G() {
    return g.index.add(-1).get() !== nt();
  }
  function et() {
    return g.scrollSnapList;
  }
  function Ot() {
    return g.scrollProgress.get(g.offsetLocation.get());
  }
  function nt() {
    return g.index.get();
  }
  function at() {
    return g.indexPrevious.get();
  }
  function It() {
    return g.slidesInView.get();
  }
  function Q() {
    return g.slidesInView.get(!1);
  }
  function _t() {
    return w;
  }
  function Se() {
    return g;
  }
  function mt() {
    return s;
  }
  function st() {
    return k;
  }
  function Ft() {
    return S;
  }
  const Tt = {
    canScrollNext: L,
    canScrollPrev: G,
    containerNode: st,
    internalEngine: Se,
    destroy: M,
    off: p,
    on: d,
    emit: _,
    plugins: _t,
    previousScrollSnap: at,
    reInit: f,
    rootNode: mt,
    scrollNext: R,
    scrollPrev: I,
    scrollProgress: Ot,
    scrollSnapList: et,
    scrollTo: D,
    selectedScrollSnap: nt,
    slideNodes: Ft,
    slidesInView: It,
    slidesNotInView: Q
  };
  return E(t, e), setTimeout(() => u.emit("init"), 0), Tt;
}
pi.globalOptions = void 0;
function La() {
  var _;
  const s = document.querySelector(".embla"), t = document.querySelector(".header"), e = [...document.querySelectorAll(".work-list .work-item .work-link")], n = e.find((f) => f.classList.contains("w--current"));
  n && (n.closest(".work-item").style.display = "none");
  const i = e.filter((f) => !f.classList.contains("w--current")), r = [...document.querySelectorAll('[data-button="index"]')];
  document.querySelectorAll(".work-list .work-item").forEach((f, m) => {
    const g = f.querySelector("p[data-index]");
    g && (g.textContent = String(m + 1).padStart(3, "0"));
  }), window.innerWidth >= 992 && document.querySelectorAll(".work-list .work-item").forEach((f) => {
    const m = f.querySelector(".work-link"), g = f.querySelector(".work-media");
    if (!m || !g || m.classList.contains("w--current")) return;
    const y = g.querySelector("video[data-src]"), v = g.querySelector("img"), x = [v, y].filter(Boolean);
    F.set(x, { opacity: 0 });
    const w = (E) => F.to(E, { opacity: 1, duration: 0.6, ease: "power1.inOut", delay: 0.3 }), k = (E) => {
      F.killTweensOf(E), F.set(E, { opacity: 0 });
    };
    let S = !1, T = !1, b = !1;
    m.addEventListener("mouseenter", () => {
      b = !0, g.style.opacity = "1", v && w([v]), y && (S ? T && (w([y]), y.play().catch(() => {
      })) : (S = !0, y.src = y.dataset.src, y.load(), y.addEventListener("canplay", () => {
        T = !0, b && (w([y]), y.play().catch(() => {
        }));
      }, { once: !0 })));
    }), m.addEventListener("mouseleave", () => {
      b = !1, g.style.opacity = "0", k(x), y && T && y.pause();
    });
  }), F.set(i, { opacity: 0, pointerEvents: "none" });
  const o = document.querySelector(".index");
  let a = !1;
  const u = () => {
    a = !0, r.forEach((f) => f.textContent = "Close Index"), F.set(i, { backgroundColor: "var(--light-black)" }), F.timeline().to(i, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.04, pointerEvents: "auto" }).call(() => {
      i.forEach((f) => {
        f.style.transition = "background-color 600ms ease", f.style.backgroundColor = "transparent";
      }), setTimeout(() => i.forEach((f) => {
        f.style.transition = "", f.style.backgroundColor = "";
      }), 650);
    }), o && (o.style.pointerEvents = "auto"), s && F.to(s, { opacity: 0.1, duration: 0.6, ease: "power1.inOut", pointerEvents: "none" });
  }, l = () => {
    a = !1, r.forEach((f) => f.textContent = "Index"), o && (o.style.pointerEvents = "none"), F.to(i, { opacity: 0, duration: 0.6, ease: "power1.inOut", pointerEvents: "none" }), s && F.to(s, { opacity: 1, duration: 0.6, ease: "power1.inOut", pointerEvents: "auto" });
  };
  r.forEach((f) => f.addEventListener("click", () => a ? l() : u()));
  let c = null;
  if (s) {
    const f = s.querySelector(".embla__viewport"), m = s.querySelector(".embla__prev"), g = s.querySelector(".embla__next"), y = f.querySelector(".embla__container"), v = [...y.querySelectorAll(".embla__slide")];
    for (let T = v.length - 1; T > 0; T--) {
      const b = Math.floor(Math.random() * (T + 1));
      y.appendChild(v[b]), v.splice(b, 1);
    }
    const x = pi(f, { loop: !0, duration: 0, dragFree: !1 });
    m == null || m.addEventListener("click", () => x.scrollPrev()), g == null || g.addEventListener("click", () => x.scrollNext());
    const w = x.slideNodes();
    w.forEach((T) => F.set(T.querySelectorAll("img, video"), { opacity: 0 }));
    const k = (T) => {
      const b = [...T.querySelectorAll("img, video")];
      b.length && (F.to(b, { opacity: 1, duration: 0.6, ease: "power1.inOut", delay: 0.3 }), T.querySelectorAll("video").forEach((E) => E.play().catch(() => {
      })));
    }, S = (T) => {
      const b = [...T.querySelectorAll("img, video")];
      b.length && (F.killTweensOf(b), F.set(b, { opacity: 0 }), T.querySelectorAll("video").forEach((E) => E.pause()));
    };
    x.on("select", () => {
      S(w[x.previousScrollSnap()]), k(w[x.selectedScrollSnap()]);
    }), c = () => k(w[x.selectedScrollSnap()]), F.set(s, { opacity: 0, pointerEvents: "none" });
  }
  const h = [...(t == null ? void 0 : t.children) ?? []], d = [...((_ = document.querySelector(".footer")) == null ? void 0 : _.children) ?? []], p = [...h, ...d];
  if (!p.length) {
    s && F.to(s, { opacity: 1, duration: 0.6, ease: "power1.inOut", pointerEvents: "auto", onComplete: () => c == null ? void 0 : c() });
    return;
  }
  F.set(p, { opacity: 0, backgroundColor: "var(--light-black)" }), F.timeline({
    onComplete() {
      p.forEach((f) => {
        f.style.transition = "background-color 600ms ease", f.style.backgroundColor = "transparent", f.style.pointerEvents = "auto";
      }), setTimeout(() => p.forEach((f) => {
        f.style.transition = "", f.style.backgroundColor = "";
      }), 650), s && F.to(s, { opacity: 1, duration: 0.6, ease: "power1.inOut", pointerEvents: "auto", onComplete: () => c == null ? void 0 : c() });
    }
  }).to(h, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.04 }).to(d, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.04 }, "<");
}
function Zr() {
  var t;
  switch ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) {
    case "home":
      ea();
      break;
    case "details":
      La();
      break;
  }
}
let Xi;
function Ra() {
  Xi = new Rs({
    containers: ["#swup"],
    animationSelector: '[class*="transition-"]'
  }), Xi.hooks.on("page:view", () => {
    Zr();
  });
}
Ra();
Zr();
