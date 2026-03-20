const H = /* @__PURE__ */ new WeakMap();
function N(e, t, s, i) {
  if (!e && !H.has(t))
    return !1;
  const n = H.get(t) ?? /* @__PURE__ */ new WeakMap();
  H.set(t, n);
  const o = n.get(s) ?? /* @__PURE__ */ new Set();
  n.set(s, o);
  const a = o.has(i);
  return e ? o.add(i) : o.delete(i), a && e;
}
function tt(e, t) {
  let s = e.target;
  if (s instanceof Text && (s = s.parentElement), s instanceof Element && e.currentTarget instanceof Node) {
    const i = s.closest(t);
    if (i && e.currentTarget.contains(i))
      return i;
  }
}
function et(e, t, s, i = {}) {
  const { signal: n, base: o = document } = i;
  if (n != null && n.aborted)
    return;
  const { once: a, ...l } = i, r = o instanceof Document ? o.documentElement : o, h = !!(typeof i == "object" ? i.capture : i), c = (w) => {
    const g = tt(w, String(e));
    if (g) {
      const p = Object.assign(w, { delegateTarget: g });
      s.call(r, p), a && (r.removeEventListener(t, c, l), N(!1, r, s, u));
    }
  }, u = JSON.stringify({ selector: e, type: t, capture: h });
  N(!0, r, s, u) || r.addEventListener(t, c, l), n == null || n.addEventListener("abort", () => {
    N(!1, r, s, u);
  });
}
function f() {
  return f = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var s = arguments[t];
      for (var i in s) ({}).hasOwnProperty.call(s, i) && (e[i] = s[i]);
    }
    return e;
  }, f.apply(null, arguments);
}
const F = (e, t) => String(e).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || t || "", q = ({ hash: e } = {}) => window.location.pathname + window.location.search + (e ? window.location.hash : ""), st = (e, t = {}) => {
  const s = f({ url: e = e || q({ hash: !0 }), random: Math.random(), source: "swup" }, t);
  window.history.pushState(s, "", e);
}, x = (e = null, t = {}) => {
  e = e || q({ hash: !0 });
  const s = f({}, window.history.state || {}, { url: e, random: Math.random(), source: "swup" }, t);
  window.history.replaceState(s, "", e);
}, it = (e, t, s, i) => {
  const n = new AbortController();
  return i = f({}, i, { signal: n.signal }), et(e, t, s, i), { destroy: () => n.abort() };
};
class m extends URL {
  constructor(t, s = document.baseURI) {
    super(t.toString(), s), Object.setPrototypeOf(this, m.prototype);
  }
  get url() {
    return this.pathname + this.search;
  }
  static fromElement(t) {
    const s = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
    return new m(s);
  }
  static fromUrl(t) {
    return new m(t);
  }
}
class P extends Error {
  constructor(t, s) {
    super(t), this.url = void 0, this.status = void 0, this.aborted = void 0, this.timedOut = void 0, this.name = "FetchError", this.url = s.url, this.status = s.status, this.aborted = s.aborted || !1, this.timedOut = s.timedOut || !1;
  }
}
async function nt(e, t = {}) {
  var s;
  e = m.fromUrl(e).url;
  const { visit: i = this.visit } = t, n = f({}, this.options.requestHeaders, t.headers), o = (s = t.timeout) != null ? s : this.options.timeout, a = new AbortController(), { signal: l } = a;
  t = f({}, t, { headers: n, signal: l });
  let r, h = !1, c = null;
  o && o > 0 && (c = setTimeout(() => {
    h = !0, a.abort("timeout");
  }, o));
  try {
    r = await this.hooks.call("fetch:request", i, { url: e, options: t }, (v, { url: b, options: k }) => fetch(b, k)), c && clearTimeout(c);
  } catch (v) {
    throw h ? (this.hooks.call("fetch:timeout", i, { url: e }), new P(`Request timed out: ${e}`, { url: e, timedOut: h })) : (v == null ? void 0 : v.name) === "AbortError" || l.aborted ? new P(`Request aborted: ${e}`, { url: e, aborted: !0 }) : v;
  }
  const { status: u, url: d } = r, w = await r.text();
  if (u === 500) throw this.hooks.call("fetch:error", i, { status: u, response: r, url: d }), new P(`Server error: ${d}`, { status: u, url: d });
  if (!w) throw new P(`Empty response: ${d}`, { status: u, url: d });
  const { url: g } = m.fromUrl(d), p = { url: g, html: w };
  return !i.cache.write || t.method && t.method !== "GET" || e !== g || this.cache.set(p.url, p), p;
}
class ot {
  constructor(t) {
    this.swup = void 0, this.pages = /* @__PURE__ */ new Map(), this.swup = t;
  }
  get size() {
    return this.pages.size;
  }
  get all() {
    const t = /* @__PURE__ */ new Map();
    return this.pages.forEach((s, i) => {
      t.set(i, f({}, s));
    }), t;
  }
  has(t) {
    return this.pages.has(this.resolve(t));
  }
  get(t) {
    const s = this.pages.get(this.resolve(t));
    return s && f({}, s);
  }
  set(t, s) {
    s = f({}, s, { url: t = this.resolve(t) }), this.pages.set(t, s), this.swup.hooks.callSync("cache:set", void 0, { page: s });
  }
  update(t, s) {
    t = this.resolve(t);
    const i = f({}, this.get(t), s, { url: t });
    this.pages.set(t, i);
  }
  delete(t) {
    this.pages.delete(this.resolve(t));
  }
  clear() {
    this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0, void 0);
  }
  prune(t) {
    this.pages.forEach((s, i) => {
      t(i, s) && this.delete(i);
    });
  }
  resolve(t) {
    const { url: s } = m.fromUrl(t);
    return this.swup.resolveUrl(s);
  }
}
const O = (e, t = document) => t.querySelector(e), V = (e, t = document) => Array.from(t.querySelectorAll(e)), _ = () => new Promise((e) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      e();
    });
  });
});
function K(e) {
  return !!e && (typeof e == "object" || typeof e == "function") && typeof e.then == "function";
}
function at(e, t = []) {
  return new Promise((s, i) => {
    const n = e(...t);
    K(n) ? n.then(s, i) : s(n);
  });
}
function R(e, t) {
  const s = e == null ? void 0 : e.closest(`[${t}]`);
  return s != null && s.hasAttribute(t) ? (s == null ? void 0 : s.getAttribute(t)) || !0 : void 0;
}
class rt {
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
    return this.selector.trim() ? V(this.selector) : [];
  }
  add(...t) {
    this.targets.forEach((s) => s.classList.add(...t));
  }
  remove(...t) {
    this.targets.forEach((s) => s.classList.remove(...t));
  }
  clear() {
    this.targets.forEach((t) => {
      const s = t.className.split(" ").filter((i) => this.isSwupClass(i));
      t.classList.remove(...s);
    });
  }
  isSwupClass(t) {
    return this.swupClasses.some((s) => t.startsWith(s));
  }
}
class z {
  constructor(t, s) {
    this.id = void 0, this.state = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, this.animation = void 0, this.trigger = void 0, this.cache = void 0, this.history = void 0, this.scroll = void 0, this.meta = void 0;
    const { to: i, from: n, hash: o, el: a, event: l } = s;
    this.id = Math.random(), this.state = 1, this.from = { url: n ?? t.location.url, hash: t.location.hash }, this.to = { url: i, hash: o }, this.containers = t.options.containers, this.animation = { animate: !0, wait: !1, name: void 0, native: t.options.native, scope: t.options.animationScope, selector: t.options.animationSelector }, this.trigger = { el: a, event: l }, this.cache = { read: t.options.cache, write: t.options.cache }, this.history = { action: "push", popstate: !1, direction: void 0 }, this.scroll = { reset: !0, target: void 0 }, this.meta = {};
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
function lt(e) {
  return new z(this, e);
}
class ct {
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
    const s = this.registry.get(t);
    if (s) return s;
    console.error(`Unknown hook '${t}'`);
  }
  clear() {
    this.registry.forEach((t) => t.clear());
  }
  on(t, s, i = {}) {
    const n = this.get(t);
    if (!n) return console.warn(`Hook '${t}' not found.`), () => {
    };
    const o = f({}, i, { id: n.size + 1, hook: t, handler: s });
    return n.set(s, o), () => this.off(t, s);
  }
  before(t, s, i = {}) {
    return this.on(t, s, f({}, i, { before: !0 }));
  }
  replace(t, s, i = {}) {
    return this.on(t, s, f({}, i, { replace: !0 }));
  }
  once(t, s, i = {}) {
    return this.on(t, s, f({}, i, { once: !0 }));
  }
  off(t, s) {
    const i = this.get(t);
    i && s ? i.delete(s) || console.warn(`Handler for hook '${t}' not found.`) : i && i.clear();
  }
  async call(t, s, i, n) {
    const [o, a, l] = this.parseCallArgs(t, s, i, n), { before: r, handler: h, after: c } = this.getHandlers(t, l);
    await this.run(r, o, a);
    const [u] = await this.run(h, o, a, !0);
    return await this.run(c, o, a), this.dispatchDomEvent(t, o, a), u;
  }
  callSync(t, s, i, n) {
    const [o, a, l] = this.parseCallArgs(t, s, i, n), { before: r, handler: h, after: c } = this.getHandlers(t, l);
    this.runSync(r, o, a);
    const [u] = this.runSync(h, o, a, !0);
    return this.runSync(c, o, a), this.dispatchDomEvent(t, o, a), u;
  }
  parseCallArgs(t, s, i, n) {
    return s instanceof z || typeof s != "object" && typeof i != "function" ? [s, i, n] : [void 0, s, i];
  }
  async run(t, s = this.swup.visit, i, n = !1) {
    const o = [];
    for (const { hook: a, handler: l, defaultHandler: r, once: h } of t) if (s == null || !s.done) {
      h && this.off(a, l);
      try {
        const c = await at(l, [s, i, r]);
        o.push(c);
      } catch (c) {
        if (n) throw c;
        console.error(`Error in hook '${a}':`, c);
      }
    }
    return o;
  }
  runSync(t, s = this.swup.visit, i, n = !1) {
    const o = [];
    for (const { hook: a, handler: l, defaultHandler: r, once: h } of t) if (s == null || !s.done) {
      h && this.off(a, l);
      try {
        const c = l(s, i, r);
        o.push(c), K(c) && console.warn(`Swup will not await Promises in handler for synchronous hook '${a}'.`);
      } catch (c) {
        if (n) throw c;
        console.error(`Error in hook '${a}':`, c);
      }
    }
    return o;
  }
  getHandlers(t, s) {
    const i = this.get(t);
    if (!i) return { found: !1, before: [], handler: [], after: [], replaced: !1 };
    const n = Array.from(i.values()), o = this.sortRegistrations, a = n.filter(({ before: u, replace: d }) => u && !d).sort(o), l = n.filter(({ replace: u }) => u).filter((u) => !0).sort(o), r = n.filter(({ before: u, replace: d }) => !u && !d).sort(o), h = l.length > 0;
    let c = [];
    if (s && (c = [{ id: 0, hook: t, handler: s }], h)) {
      const u = l.length - 1, { handler: d, once: w } = l[u], g = (p) => {
        const v = l[p - 1];
        return v ? (b, k) => v.handler(b, k, g(p - 1)) : s;
      };
      c = [{ id: 0, hook: t, once: w, handler: d, defaultHandler: g(u) }];
    }
    return { found: !0, before: a, handler: c, after: r, replaced: h };
  }
  sortRegistrations(t, s) {
    var i, n;
    return ((i = t.priority) != null ? i : 0) - ((n = s.priority) != null ? n : 0) || t.id - s.id || 0;
  }
  dispatchDomEvent(t, s, i) {
    if (s != null && s.done) return;
    const n = { hook: t, args: i, visit: s || this.swup.visit };
    document.dispatchEvent(new CustomEvent("swup:any", { detail: n, bubbles: !0 })), document.dispatchEvent(new CustomEvent(`swup:${t}`, { detail: n, bubbles: !0 }));
  }
  parseName(t) {
    const [s, ...i] = t.split(".");
    return [s, i.reduce((n, o) => f({}, n, { [o]: !0 }), {})];
  }
}
const ht = (e) => {
  if (e && e.charAt(0) === "#" && (e = e.substring(1)), !e) return null;
  const t = decodeURIComponent(e);
  let s = document.getElementById(e) || document.getElementById(t) || O(`a[name='${CSS.escape(e)}']`) || O(`a[name='${CSS.escape(t)}']`);
  return s || e !== "top" || (s = document.body), s;
}, A = "transition", D = "animation";
async function ut({ selector: e, elements: t }) {
  if (e === !1 && !t) return;
  let s = [];
  if (t) s = Array.from(t);
  else if (e && (s = V(e, document.body), !s.length)) return void console.warn(`[swup] No elements found matching animationSelector \`${e}\``);
  const i = s.map((n) => (function(o) {
    const { type: a, timeout: l, propCount: r } = (function(h) {
      const c = window.getComputedStyle(h), u = U(c, `${A}Delay`), d = U(c, `${A}Duration`), w = M(u, d), g = U(c, `${D}Delay`), p = U(c, `${D}Duration`), v = M(g, p), b = Math.max(w, v), k = b > 0 ? w > v ? A : D : null;
      return { type: k, timeout: b, propCount: k ? k === A ? d.length : p.length : 0 };
    })(o);
    return !(!a || !l) && new Promise((h) => {
      const c = `${a}end`, u = performance.now();
      let d = 0;
      const w = () => {
        o.removeEventListener(c, g), h();
      }, g = (p) => {
        p.target === o && ((performance.now() - u) / 1e3 < p.elapsedTime || ++d >= r && w());
      };
      setTimeout(() => {
        d < r && w();
      }, l + 1), o.addEventListener(c, g);
    });
  })(n));
  i.filter(Boolean).length > 0 ? await Promise.all(i) : e && console.warn(`[swup] No CSS animation duration defined on elements matching \`${e}\``);
}
function U(e, t) {
  return (e[t] || "").split(", ");
}
function M(e, t) {
  for (; e.length < t.length; ) e = e.concat(e);
  return Math.max(...t.map((s, i) => W(s) + W(e[i])));
}
function W(e) {
  return 1e3 * parseFloat(e);
}
function dt(e, t = {}, s = {}) {
  if (typeof e != "string") throw new Error("swup.navigate() requires a URL parameter");
  if (this.shouldIgnoreVisit(e, { el: s.el, event: s.event })) return void window.location.assign(e);
  const { url: i, hash: n } = m.fromUrl(e), o = this.createVisit(f({}, s, { to: i, hash: n }));
  this.performNavigation(o, t);
}
async function ft(e, t = {}) {
  if (this.navigating) {
    if (this.visit.state >= 6) return e.state = 2, void (this.onVisitEnd = () => this.performNavigation(e, t));
    await this.hooks.call("visit:abort", this.visit, void 0), delete this.visit.to.document, this.visit.state = 8;
  }
  this.navigating = !0, this.visit = e;
  const { el: s } = e.trigger;
  t.referrer = t.referrer || this.location.url, t.animate === !1 && (e.animation.animate = !1), e.animation.animate || this.classes.clear();
  const i = t.history || R(s, "data-swup-history");
  typeof i == "string" && ["push", "replace"].includes(i) && (e.history.action = i);
  const n = t.animation || R(s, "data-swup-animation");
  var o, a;
  typeof n == "string" && (e.animation.name = n), e.meta = t.meta || {}, typeof t.cache == "object" ? (e.cache.read = (o = t.cache.read) != null ? o : e.cache.read, e.cache.write = (a = t.cache.write) != null ? a : e.cache.write) : t.cache !== void 0 && (e.cache = { read: !!t.cache, write: !!t.cache }), delete t.cache;
  try {
    await this.hooks.call("visit:start", e, void 0), e.state = 3;
    const l = this.hooks.call("page:load", e, { options: t }, async (h, c) => {
      let u;
      return h.cache.read && (u = this.cache.get(h.to.url)), c.page = u || await this.fetchPage(h.to.url, c.options), c.cache = !!u, c.page;
    });
    l.then(({ html: h }) => {
      e.advance(5), e.to.html = h, e.to.document = new DOMParser().parseFromString(h, "text/html");
    });
    const r = e.to.url + e.to.hash;
    if (e.history.popstate || (e.history.action === "replace" || e.to.url === this.location.url ? x(r) : (this.currentHistoryIndex++, st(r, { index: this.currentHistoryIndex }))), this.location = m.fromUrl(r), e.history.popstate && this.classes.add("is-popstate"), e.animation.name && this.classes.add(`to-${F(e.animation.name)}`), e.animation.wait && await l, e.done || (await this.hooks.call("visit:transition", e, void 0, async () => {
      if (!e.animation.animate) return await this.hooks.call("animation:skip", void 0), void await this.renderPage(e, await l);
      e.advance(4), await this.animatePageOut(e), e.animation.native && document.startViewTransition ? await document.startViewTransition(async () => await this.renderPage(e, await l)).finished : await this.renderPage(e, await l), await this.animatePageIn(e);
    }), e.done)) return;
    await this.hooks.call("visit:end", e, void 0, () => this.classes.clear()), e.state = 7, this.navigating = !1, this.onVisitEnd && (this.onVisitEnd(), this.onVisitEnd = void 0);
  } catch (l) {
    if (!l || l != null && l.aborted) return void (e.state = 8);
    e.state = 9, console.error(l), this.options.skipPopStateHandling = () => (window.location.assign(e.to.url + e.to.hash), !0), window.history.back();
  } finally {
    delete e.to.document;
  }
}
const pt = async function(e) {
  await this.hooks.call("animation:out:start", e, void 0, () => {
    this.classes.add("is-changing", "is-animating", "is-leaving");
  }), await this.hooks.call("animation:out:await", e, { skip: !1 }, (t, { skip: s }) => {
    if (!s) return this.awaitAnimations({ selector: t.animation.selector });
  }), await this.hooks.call("animation:out:end", e, void 0);
}, mt = function(e) {
  var t;
  const s = e.to.document;
  if (!s) return !1;
  const i = ((t = s.querySelector("title")) == null ? void 0 : t.innerText) || "";
  document.title = i;
  const n = V('[data-swup-persist]:not([data-swup-persist=""])'), o = e.containers.map((a) => {
    const l = document.querySelector(a), r = s.querySelector(a);
    return l && r ? (l.replaceWith(r.cloneNode(!0)), !0) : (l || console.warn(`[swup] Container missing in current document: ${a}`), r || console.warn(`[swup] Container missing in incoming document: ${a}`), !1);
  }).filter(Boolean);
  return n.forEach((a) => {
    const l = a.getAttribute("data-swup-persist"), r = O(`[data-swup-persist="${l}"]`);
    r && r !== a && r.replaceWith(a);
  }), o.length === e.containers.length;
}, wt = function(e) {
  const t = { behavior: "auto" }, { target: s, reset: i } = e.scroll, n = s ?? e.to.hash;
  let o = !1;
  return n && (o = this.hooks.callSync("scroll:anchor", e, { hash: n, options: t }, (a, { hash: l, options: r }) => {
    const h = this.getAnchorElement(l);
    return h && h.scrollIntoView(r), !!h;
  })), i && !o && (o = this.hooks.callSync("scroll:top", e, { options: t }, (a, { options: l }) => (window.scrollTo(f({ top: 0, left: 0 }, l)), !0))), o;
}, gt = async function(e) {
  if (e.done) return;
  const t = this.hooks.call("animation:in:await", e, { skip: !1 }, (s, { skip: i }) => {
    if (!i) return this.awaitAnimations({ selector: s.animation.selector });
  });
  await _(), await this.hooks.call("animation:in:start", e, void 0, () => {
    this.classes.remove("is-animating");
  }), await t, await this.hooks.call("animation:in:end", e, void 0);
}, vt = async function(e, t) {
  if (e.done) return;
  e.advance(6);
  const { url: s } = t;
  this.isSameResolvedUrl(q(), s) || (x(s), this.location = m.fromUrl(s), e.to.url = this.location.url, e.to.hash = this.location.hash), await this.hooks.call("content:replace", e, { page: t }, (i, {}) => {
    if (this.classes.remove("is-leaving"), i.animation.animate && this.classes.add("is-rendering"), !this.replaceContent(i)) throw new Error("[swup] Container mismatch, aborting");
    i.animation.animate && (this.classes.add("is-changing", "is-animating", "is-rendering"), i.animation.name && this.classes.add(`to-${F(i.animation.name)}`));
  }), await this.hooks.call("content:scroll", e, void 0, () => this.scrollToContent(e)), await this.hooks.call("page:view", e, { url: this.location.url, title: document.title });
}, yt = function(e) {
  var t;
  if (t = e, !!(t != null && t.isSwupPlugin)) {
    if (e.swup = this, !e._checkRequirements || e._checkRequirements()) return e._beforeMount && e._beforeMount(), e.mount(), this.plugins.push(e), this.plugins;
  } else console.error("Not a swup plugin instance", e);
};
function kt(e) {
  const t = this.findPlugin(e);
  if (t) return t.unmount(), t._afterUnmount && t._afterUnmount(), this.plugins = this.plugins.filter((s) => s !== t), this.plugins;
  console.error("No such plugin", t);
}
function St(e) {
  return this.plugins.find((t) => t === e || t.name === e || t.name === `Swup${String(e)}`);
}
function bt(e) {
  if (typeof this.options.resolveUrl != "function") return console.warn("[swup] options.resolveUrl expects a callback function."), e;
  const t = this.options.resolveUrl(e);
  return t && typeof t == "string" ? t.startsWith("//") || t.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), e) : t : (console.warn("[swup] options.resolveUrl needs to return a url"), e);
}
function Et(e, t) {
  return this.resolveUrl(e) === this.resolveUrl(t);
}
const Ct = { animateHistoryBrowsing: !1, animationSelector: '[class*="transition-"]', animationScope: "html", cache: !0, containers: ["#swup"], hooks: {}, ignoreVisit: (e, { el: t } = {}) => !(t == null || !t.closest("[data-no-swup]")), linkSelector: "a[href]", linkToSelf: "scroll", native: !1, plugins: [], resolveUrl: (e) => e, requestHeaders: { "X-Requested-With": "swup", Accept: "text/html, application/xhtml+xml" }, skipPopStateHandling: (e) => {
  var t;
  return ((t = e.state) == null ? void 0 : t.source) !== "swup";
}, timeout: 0 };
class Lt {
  get currentPageUrl() {
    return this.location.url;
  }
  constructor(t = {}) {
    var s, i;
    this.version = "4.8.3", this.options = void 0, this.defaults = Ct, this.plugins = [], this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, this.location = m.fromUrl(window.location.href), this.currentHistoryIndex = void 0, this.clickDelegate = void 0, this.navigating = !1, this.onVisitEnd = void 0, this.use = yt, this.unuse = kt, this.findPlugin = St, this.log = () => {
    }, this.navigate = dt, this.performNavigation = ft, this.createVisit = lt, this.delegateEvent = it, this.fetchPage = nt, this.awaitAnimations = ut, this.renderPage = vt, this.replaceContent = mt, this.animatePageIn = gt, this.animatePageOut = pt, this.scrollToContent = wt, this.getAnchorElement = ht, this.getCurrentUrl = q, this.resolveUrl = bt, this.isSameResolvedUrl = Et, this.options = f({}, this.defaults, t), this.handleLinkClick = this.handleLinkClick.bind(this), this.handlePopState = this.handlePopState.bind(this), this.cache = new ot(this), this.classes = new rt(this), this.hooks = new ct(this), this.visit = this.createVisit({ to: "" }), this.currentHistoryIndex = (s = (i = window.history.state) == null ? void 0 : i.index) != null ? s : 1, this.enable();
  }
  async enable() {
    var t;
    const { linkSelector: s } = this.options;
    this.clickDelegate = this.delegateEvent(s, "click", this.handleLinkClick), window.addEventListener("popstate", this.handlePopState), this.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), this.options.native = this.options.native && !!document.startViewTransition, this.options.plugins.forEach((i) => this.use(i));
    for (const [i, n] of Object.entries(this.options.hooks)) {
      const [o, a] = this.hooks.parseName(i);
      this.hooks.on(o, n, a);
    }
    ((t = window.history.state) == null ? void 0 : t.source) !== "swup" && x(null, { index: this.currentHistoryIndex }), await _(), await this.hooks.call("enable", void 0, void 0, () => {
      const i = document.documentElement;
      i.classList.add("swup-enabled"), i.classList.toggle("swup-native", this.options.native);
    });
  }
  async destroy() {
    this.clickDelegate.destroy(), window.removeEventListener("popstate", this.handlePopState), this.cache.clear(), this.options.plugins.forEach((t) => this.unuse(t)), await this.hooks.call("disable", void 0, void 0, () => {
      const t = document.documentElement;
      t.classList.remove("swup-enabled"), t.classList.remove("swup-native");
    }), this.hooks.clear();
  }
  shouldIgnoreVisit(t, { el: s, event: i } = {}) {
    const { origin: n, url: o, hash: a } = m.fromUrl(t);
    return n !== window.location.origin || !(!s || !this.triggerWillOpenNewWindow(s)) || !!this.options.ignoreVisit(o + a, { el: s, event: i });
  }
  handleLinkClick(t) {
    const s = t.delegateTarget, { href: i, url: n, hash: o } = m.fromElement(s);
    if (this.shouldIgnoreVisit(i, { el: s, event: t })) return;
    if (this.navigating && n === this.visit.to.url) return void t.preventDefault();
    const a = this.createVisit({ to: n, hash: o, el: s, event: t });
    t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? this.hooks.callSync("link:newtab", a, { href: i }) : t.button === 0 && this.hooks.callSync("link:click", a, { el: s, event: t }, () => {
      var l;
      const r = (l = a.from.url) != null ? l : "";
      t.preventDefault(), n && n !== r ? this.isSameResolvedUrl(n, r) || this.performNavigation(a) : o ? this.hooks.callSync("link:anchor", a, { hash: o }, () => {
        x(n + o), this.scrollToContent(a);
      }) : this.hooks.callSync("link:self", a, void 0, () => {
        this.options.linkToSelf === "navigate" ? this.performNavigation(a) : (x(n), this.scrollToContent(a));
      });
    });
  }
  handlePopState(t) {
    var s, i, n, o;
    const a = (s = (i = t.state) == null ? void 0 : i.url) != null ? s : window.location.href;
    if (this.options.skipPopStateHandling(t) || this.isSameResolvedUrl(q(), this.location.url)) return;
    const { url: l, hash: r } = m.fromUrl(a), h = this.createVisit({ to: l, hash: r, event: t });
    h.history.popstate = !0;
    const c = (n = (o = t.state) == null ? void 0 : o.index) != null ? n : 0;
    c && c !== this.currentHistoryIndex && (h.history.direction = c - this.currentHistoryIndex > 0 ? "forwards" : "backwards", this.currentHistoryIndex = c), h.animation.animate = !1, h.scroll.reset = !1, h.scroll.target = !1, this.options.animateHistoryBrowsing && (h.animation.animate = !0, h.scroll.reset = !0), this.hooks.callSync("history:popstate", h, { event: t }, () => {
      this.performNavigation(h);
    });
  }
  triggerWillOpenNewWindow(t) {
    return !!t.matches('[download], [target="_blank"]');
  }
}
let Y = "/", G = "", J = "";
function xt(e) {
  Y = e;
}
function qt(e, t) {
  G = e, J = t;
}
function Pt() {
  const e = document.getElementById("backLink");
  e && (e.href = Y);
}
function X() {
  var t;
  switch ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) {
    case "home":
      break;
    case "work":
      break;
    case "info":
      break;
    case "details":
      Pt();
      break;
  }
}
let C = null;
function Z() {
  C && (C.disconnect(), C = null), document.querySelectorAll("img").forEach((e) => {
    e.complete && e.naturalWidth > 0 ? e.style.opacity = "1" : e.addEventListener("load", () => {
      e.style.opacity = "1";
    }, { once: !0 });
  }), C = new IntersectionObserver((e) => {
    e.forEach((t) => {
      t.isIntersecting ? t.target.play() : t.target.pause();
    });
  }, { threshold: 0.2 }), document.querySelectorAll("video").forEach((e) => {
    const t = () => {
      e.style.opacity = "1";
    };
    e.readyState >= 2 ? t() : e.addEventListener("loadeddata", t, { once: !0 }), C.observe(e);
  });
}
function At() {
  B(), document.querySelectorAll("[data-link]").forEach((e) => {
    e.addEventListener("click", () => B(e.dataset.link));
  });
}
function B(e) {
  var o;
  const t = document.querySelectorAll("[data-link]"), s = document.querySelector(".indicator"), i = e ?? ((o = document.querySelector("[data-swup]")) == null ? void 0 : o.dataset.swup);
  if (!i) return;
  t.forEach((a) => a.classList.remove("w--current"));
  const n = document.querySelector(`[data-link="${i}"]`);
  n && (n.classList.add("w--current"), s && (s.style.left = `${n.offsetLeft}px`, s.style.width = `${n.offsetWidth}px`));
}
let S = null, I = !1, E = null;
function Q() {
  var l;
  S && (clearInterval(S), S = null), I = !1;
  const e = document.getElementById("currentYear");
  e && (e.textContent = (/* @__PURE__ */ new Date()).getFullYear());
  const t = document.getElementById("first"), s = document.getElementById("second");
  if (!t || !s) return;
  const i = t.querySelector("p"), n = s.querySelector("p");
  if (((l = document.querySelector("[data-swup]")) == null ? void 0 : l.dataset.swup) === "details") {
    const r = document.querySelector('[data-swup="details"]'), h = G || (r == null ? void 0 : r.dataset.name) || "", c = J || (r == null ? void 0 : r.dataset.services) || "";
    i && h && (i.textContent = h, t.style.width = L(t, h) + "px"), n && c && (n.textContent = c, s.style.width = L(s, c) + "px");
    return;
  }
  E === null && (E = t.dataset.default || (i == null ? void 0 : i.textContent) || ""), i && (i.textContent = E, t.style.width = L(t, E) + "px");
  const a = T();
  n && (n.textContent = a, s.style.width = L(s, a) + "px"), S = setInterval(() => {
    !I && n && (n.textContent = T());
  }, 1e3), document.querySelectorAll("[data-name]").forEach((r) => {
    r.addEventListener("mouseenter", () => y(t, i, r.dataset.name)), r.addEventListener("mouseleave", () => y(t, i, E));
  }), document.querySelectorAll("[data-services]").forEach((r) => {
    r.addEventListener("mouseenter", () => {
      I = !0, y(s, n, r.dataset.services);
    }), r.addEventListener("mouseleave", () => {
      I = !1, y(s, n, T());
    });
  });
}
function Ut(e, t) {
  S && (clearInterval(S), S = null);
  const s = document.getElementById("first"), i = document.getElementById("second");
  if (!s || !i) return;
  const n = s.querySelector("p"), o = i.querySelector("p");
  n && e && y(s, n, e), o && t && y(i, o, t);
}
function It() {
  const e = document.getElementById("first"), t = document.getElementById("second");
  if (!e || !t) return;
  const s = e.querySelector("p"), i = t.querySelector("p"), n = e.dataset.default || E || "";
  s && n && y(e, s, n), i && y(t, i, T());
}
function y(e, t, s) {
  t.style.opacity = "0", setTimeout(() => {
    t.textContent = s, e.style.width = L(e, s) + "px", t.style.opacity = "1";
  }, 200);
}
function L(e, t) {
  const s = e.cloneNode(!0);
  Object.assign(s.style, {
    position: "absolute",
    visibility: "hidden",
    width: "auto",
    transition: "none",
    pointerEvents: "none"
  });
  const i = s.querySelector("p");
  i && (i.textContent = t), document.body.appendChild(s);
  const n = s.offsetWidth;
  return document.body.removeChild(s), n;
}
function T() {
  return (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1
  }) + " CET";
}
let $;
function $t() {
  $ = new Lt({
    containers: ["#swup"],
    animationSelector: '[class*="transition-"]'
  }), document.addEventListener("click", (e) => {
    if (!e.target.closest("a[href]")) return;
    const s = e.target.closest('[data-to="details"]');
    if (s) {
      const i = s.dataset.name ?? "", n = s.dataset.services ?? "";
      qt(i, n), Ut(i, n), document.body.classList.add("details-transition");
    } else document.body.classList.contains("on-details") && (document.body.classList.remove("on-details"), document.body.classList.add("details-transition"), It());
  }, !0), $.hooks.on("visit:start", () => {
    var t;
    ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) !== "details" && xt(window.location.pathname);
  }), $.hooks.on("animation:in:start", () => {
    var t;
    ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) === "details" ? (document.body.classList.add("on-details"), document.body.classList.remove("details-transition")) : document.body.classList.remove("on-details", "details-transition");
  }), $.hooks.on("page:view", () => {
    B(), X(), Z(), Q();
  });
}
var j;
const Tt = (j = document.querySelector("[data-swup]")) == null ? void 0 : j.dataset.swup;
document.body.classList.toggle("on-details", Tt === "details");
$t();
At();
X();
Z();
Q();
