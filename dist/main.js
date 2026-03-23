const Bt = /* @__PURE__ */ new WeakMap();
function Ft(e, t, n, s) {
  if (!e && !Bt.has(t))
    return !1;
  const o = Bt.get(t) ?? /* @__PURE__ */ new WeakMap();
  Bt.set(t, o);
  const i = o.get(n) ?? /* @__PURE__ */ new Set();
  o.set(n, i);
  const r = i.has(s);
  return e ? i.add(s) : i.delete(s), r && e;
}
function qe(e, t) {
  let n = e.target;
  if (n instanceof Text && (n = n.parentElement), n instanceof Element && e.currentTarget instanceof Node) {
    const s = n.closest(t);
    if (s && e.currentTarget.contains(s))
      return s;
  }
}
function Oe(e, t, n, s = {}) {
  const { signal: o, base: i = document } = s;
  if (o != null && o.aborted)
    return;
  const { once: r, ...c } = s, a = i instanceof Document ? i.documentElement : i, l = !!(typeof s == "object" ? s.capture : s), u = (w) => {
    const f = qe(w, String(e));
    if (f) {
      const m = Object.assign(w, { delegateTarget: f });
      n.call(a, m), r && (a.removeEventListener(t, u, c), Ft(!1, a, n, d));
    }
  }, d = JSON.stringify({ selector: e, type: t, capture: l });
  Ft(!0, a, n, d) || a.addEventListener(t, u, c), o == null || o.addEventListener("abort", () => {
    Ft(!1, a, n, d);
  });
}
function q() {
  return q = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var s in n) ({}).hasOwnProperty.call(n, s) && (e[s] = n[s]);
    }
    return e;
  }, q.apply(null, arguments);
}
const ue = (e, t) => String(e).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || t || "", yt = ({ hash: e } = {}) => window.location.pathname + window.location.search + (e ? window.location.hash : ""), Ne = (e, t = {}) => {
  const n = q({ url: e = e || yt({ hash: !0 }), random: Math.random(), source: "swup" }, t);
  window.history.pushState(n, "", e);
}, vt = (e = null, t = {}) => {
  e = e || yt({ hash: !0 });
  const n = q({}, window.history.state || {}, { url: e, random: Math.random(), source: "swup" }, t);
  window.history.replaceState(n, "", e);
}, Ue = (e, t, n, s) => {
  const o = new AbortController();
  return s = q({}, s, { signal: o.signal }), Oe(e, t, n, s), { destroy: () => o.abort() };
};
class B extends URL {
  constructor(t, n = document.baseURI) {
    super(t.toString(), n), Object.setPrototypeOf(this, B.prototype);
  }
  get url() {
    return this.pathname + this.search;
  }
  static fromElement(t) {
    const n = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
    return new B(n);
  }
  static fromUrl(t) {
    return new B(t);
  }
}
class Lt extends Error {
  constructor(t, n) {
    super(t), this.url = void 0, this.status = void 0, this.aborted = void 0, this.timedOut = void 0, this.name = "FetchError", this.url = n.url, this.status = n.status, this.aborted = n.aborted || !1, this.timedOut = n.timedOut || !1;
  }
}
async function Be(e, t = {}) {
  var n;
  e = B.fromUrl(e).url;
  const { visit: s = this.visit } = t, o = q({}, this.options.requestHeaders, t.headers), i = (n = t.timeout) != null ? n : this.options.timeout, r = new AbortController(), { signal: c } = r;
  t = q({}, t, { headers: o, signal: c });
  let a, l = !1, u = null;
  i && i > 0 && (u = setTimeout(() => {
    l = !0, r.abort("timeout");
  }, i));
  try {
    a = await this.hooks.call("fetch:request", s, { url: e, options: t }, (g, { url: p, options: v }) => fetch(p, v)), u && clearTimeout(u);
  } catch (g) {
    throw l ? (this.hooks.call("fetch:timeout", s, { url: e }), new Lt(`Request timed out: ${e}`, { url: e, timedOut: l })) : (g == null ? void 0 : g.name) === "AbortError" || c.aborted ? new Lt(`Request aborted: ${e}`, { url: e, aborted: !0 }) : g;
  }
  const { status: d, url: h } = a, w = await a.text();
  if (d === 500) throw this.hooks.call("fetch:error", s, { status: d, response: a, url: h }), new Lt(`Server error: ${h}`, { status: d, url: h });
  if (!w) throw new Lt(`Empty response: ${h}`, { status: d, url: h });
  const { url: f } = B.fromUrl(h), m = { url: f, html: w };
  return !s.cache.write || t.method && t.method !== "GET" || e !== f || this.cache.set(m.url, m), m;
}
class Fe {
  constructor(t) {
    this.swup = void 0, this.pages = /* @__PURE__ */ new Map(), this.swup = t;
  }
  get size() {
    return this.pages.size;
  }
  get all() {
    const t = /* @__PURE__ */ new Map();
    return this.pages.forEach((n, s) => {
      t.set(s, q({}, n));
    }), t;
  }
  has(t) {
    return this.pages.has(this.resolve(t));
  }
  get(t) {
    const n = this.pages.get(this.resolve(t));
    return n && q({}, n);
  }
  set(t, n) {
    n = q({}, n, { url: t = this.resolve(t) }), this.pages.set(t, n), this.swup.hooks.callSync("cache:set", void 0, { page: n });
  }
  update(t, n) {
    t = this.resolve(t);
    const s = q({}, this.get(t), n, { url: t });
    this.pages.set(t, s);
  }
  delete(t) {
    this.pages.delete(this.resolve(t));
  }
  clear() {
    this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0, void 0);
  }
  prune(t) {
    this.pages.forEach((n, s) => {
      t(s, n) && this.delete(s);
    });
  }
  resolve(t) {
    const { url: n } = B.fromUrl(t);
    return this.swup.resolveUrl(n);
  }
}
const Ht = (e, t = document) => t.querySelector(e), zt = (e, t = document) => Array.from(t.querySelectorAll(e)), de = () => new Promise((e) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      e();
    });
  });
});
function fe(e) {
  return !!e && (typeof e == "object" || typeof e == "function") && typeof e.then == "function";
}
function Ve(e, t = []) {
  return new Promise((n, s) => {
    const o = e(...t);
    fe(o) ? o.then(n, s) : n(o);
  });
}
function oe(e, t) {
  const n = e == null ? void 0 : e.closest(`[${t}]`);
  return n != null && n.hasAttribute(t) ? (n == null ? void 0 : n.getAttribute(t)) || !0 : void 0;
}
class He {
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
    return this.selector.trim() ? zt(this.selector) : [];
  }
  add(...t) {
    this.targets.forEach((n) => n.classList.add(...t));
  }
  remove(...t) {
    this.targets.forEach((n) => n.classList.remove(...t));
  }
  clear() {
    this.targets.forEach((t) => {
      const n = t.className.split(" ").filter((s) => this.isSwupClass(s));
      t.classList.remove(...n);
    });
  }
  isSwupClass(t) {
    return this.swupClasses.some((n) => t.startsWith(n));
  }
}
class he {
  constructor(t, n) {
    this.id = void 0, this.state = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, this.animation = void 0, this.trigger = void 0, this.cache = void 0, this.history = void 0, this.scroll = void 0, this.meta = void 0;
    const { to: s, from: o, hash: i, el: r, event: c } = n;
    this.id = Math.random(), this.state = 1, this.from = { url: o ?? t.location.url, hash: t.location.hash }, this.to = { url: s, hash: i }, this.containers = t.options.containers, this.animation = { animate: !0, wait: !1, name: void 0, native: t.options.native, scope: t.options.animationScope, selector: t.options.animationSelector }, this.trigger = { el: r, event: c }, this.cache = { read: t.options.cache, write: t.options.cache }, this.history = { action: "push", popstate: !1, direction: void 0 }, this.scroll = { reset: !0, target: void 0 }, this.meta = {};
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
function $e(e) {
  return new he(this, e);
}
class Re {
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
    const n = this.registry.get(t);
    if (n) return n;
    console.error(`Unknown hook '${t}'`);
  }
  clear() {
    this.registry.forEach((t) => t.clear());
  }
  on(t, n, s = {}) {
    const o = this.get(t);
    if (!o) return console.warn(`Hook '${t}' not found.`), () => {
    };
    const i = q({}, s, { id: o.size + 1, hook: t, handler: n });
    return o.set(n, i), () => this.off(t, n);
  }
  before(t, n, s = {}) {
    return this.on(t, n, q({}, s, { before: !0 }));
  }
  replace(t, n, s = {}) {
    return this.on(t, n, q({}, s, { replace: !0 }));
  }
  once(t, n, s = {}) {
    return this.on(t, n, q({}, s, { once: !0 }));
  }
  off(t, n) {
    const s = this.get(t);
    s && n ? s.delete(n) || console.warn(`Handler for hook '${t}' not found.`) : s && s.clear();
  }
  async call(t, n, s, o) {
    const [i, r, c] = this.parseCallArgs(t, n, s, o), { before: a, handler: l, after: u } = this.getHandlers(t, c);
    await this.run(a, i, r);
    const [d] = await this.run(l, i, r, !0);
    return await this.run(u, i, r), this.dispatchDomEvent(t, i, r), d;
  }
  callSync(t, n, s, o) {
    const [i, r, c] = this.parseCallArgs(t, n, s, o), { before: a, handler: l, after: u } = this.getHandlers(t, c);
    this.runSync(a, i, r);
    const [d] = this.runSync(l, i, r, !0);
    return this.runSync(u, i, r), this.dispatchDomEvent(t, i, r), d;
  }
  parseCallArgs(t, n, s, o) {
    return n instanceof he || typeof n != "object" && typeof s != "function" ? [n, s, o] : [void 0, n, s];
  }
  async run(t, n = this.swup.visit, s, o = !1) {
    const i = [];
    for (const { hook: r, handler: c, defaultHandler: a, once: l } of t) if (n == null || !n.done) {
      l && this.off(r, c);
      try {
        const u = await Ve(c, [n, s, a]);
        i.push(u);
      } catch (u) {
        if (o) throw u;
        console.error(`Error in hook '${r}':`, u);
      }
    }
    return i;
  }
  runSync(t, n = this.swup.visit, s, o = !1) {
    const i = [];
    for (const { hook: r, handler: c, defaultHandler: a, once: l } of t) if (n == null || !n.done) {
      l && this.off(r, c);
      try {
        const u = c(n, s, a);
        i.push(u), fe(u) && console.warn(`Swup will not await Promises in handler for synchronous hook '${r}'.`);
      } catch (u) {
        if (o) throw u;
        console.error(`Error in hook '${r}':`, u);
      }
    }
    return i;
  }
  getHandlers(t, n) {
    const s = this.get(t);
    if (!s) return { found: !1, before: [], handler: [], after: [], replaced: !1 };
    const o = Array.from(s.values()), i = this.sortRegistrations, r = o.filter(({ before: d, replace: h }) => d && !h).sort(i), c = o.filter(({ replace: d }) => d).filter((d) => !0).sort(i), a = o.filter(({ before: d, replace: h }) => !d && !h).sort(i), l = c.length > 0;
    let u = [];
    if (n && (u = [{ id: 0, hook: t, handler: n }], l)) {
      const d = c.length - 1, { handler: h, once: w } = c[d], f = (m) => {
        const g = c[m - 1];
        return g ? (p, v) => g.handler(p, v, f(m - 1)) : n;
      };
      u = [{ id: 0, hook: t, once: w, handler: h, defaultHandler: f(d) }];
    }
    return { found: !0, before: r, handler: u, after: a, replaced: l };
  }
  sortRegistrations(t, n) {
    var s, o;
    return ((s = t.priority) != null ? s : 0) - ((o = n.priority) != null ? o : 0) || t.id - n.id || 0;
  }
  dispatchDomEvent(t, n, s) {
    if (n != null && n.done) return;
    const o = { hook: t, args: s, visit: n || this.swup.visit };
    document.dispatchEvent(new CustomEvent("swup:any", { detail: o, bubbles: !0 })), document.dispatchEvent(new CustomEvent(`swup:${t}`, { detail: o, bubbles: !0 }));
  }
  parseName(t) {
    const [n, ...s] = t.split(".");
    return [n, s.reduce((o, i) => q({}, o, { [i]: !0 }), {})];
  }
}
const je = (e) => {
  if (e && e.charAt(0) === "#" && (e = e.substring(1)), !e) return null;
  const t = decodeURIComponent(e);
  let n = document.getElementById(e) || document.getElementById(t) || Ht(`a[name='${CSS.escape(e)}']`) || Ht(`a[name='${CSS.escape(t)}']`);
  return n || e !== "top" || (n = document.body), n;
}, It = "transition", Vt = "animation";
async function ze({ selector: e, elements: t }) {
  if (e === !1 && !t) return;
  let n = [];
  if (t) n = Array.from(t);
  else if (e && (n = zt(e, document.body), !n.length)) return void console.warn(`[swup] No elements found matching animationSelector \`${e}\``);
  const s = n.map((o) => (function(i) {
    const { type: r, timeout: c, propCount: a } = (function(l) {
      const u = window.getComputedStyle(l), d = Ct(u, `${It}Delay`), h = Ct(u, `${It}Duration`), w = ie(d, h), f = Ct(u, `${Vt}Delay`), m = Ct(u, `${Vt}Duration`), g = ie(f, m), p = Math.max(w, g), v = p > 0 ? w > g ? It : Vt : null;
      return { type: v, timeout: p, propCount: v ? v === It ? h.length : m.length : 0 };
    })(i);
    return !(!r || !c) && new Promise((l) => {
      const u = `${r}end`, d = performance.now();
      let h = 0;
      const w = () => {
        i.removeEventListener(u, f), l();
      }, f = (m) => {
        m.target === i && ((performance.now() - d) / 1e3 < m.elapsedTime || ++h >= a && w());
      };
      setTimeout(() => {
        h < a && w();
      }, c + 1), i.addEventListener(u, f);
    });
  })(o));
  s.filter(Boolean).length > 0 ? await Promise.all(s) : e && console.warn(`[swup] No CSS animation duration defined on elements matching \`${e}\``);
}
function Ct(e, t) {
  return (e[t] || "").split(", ");
}
function ie(e, t) {
  for (; e.length < t.length; ) e = e.concat(e);
  return Math.max(...t.map((n, s) => re(n) + re(e[s])));
}
function re(e) {
  return 1e3 * parseFloat(e);
}
function _e(e, t = {}, n = {}) {
  if (typeof e != "string") throw new Error("swup.navigate() requires a URL parameter");
  if (this.shouldIgnoreVisit(e, { el: n.el, event: n.event })) return void window.location.assign(e);
  const { url: s, hash: o } = B.fromUrl(e), i = this.createVisit(q({}, n, { to: s, hash: o }));
  this.performNavigation(i, t);
}
async function Ge(e, t = {}) {
  if (this.navigating) {
    if (this.visit.state >= 6) return e.state = 2, void (this.onVisitEnd = () => this.performNavigation(e, t));
    await this.hooks.call("visit:abort", this.visit, void 0), delete this.visit.to.document, this.visit.state = 8;
  }
  this.navigating = !0, this.visit = e;
  const { el: n } = e.trigger;
  t.referrer = t.referrer || this.location.url, t.animate === !1 && (e.animation.animate = !1), e.animation.animate || this.classes.clear();
  const s = t.history || oe(n, "data-swup-history");
  typeof s == "string" && ["push", "replace"].includes(s) && (e.history.action = s);
  const o = t.animation || oe(n, "data-swup-animation");
  var i, r;
  typeof o == "string" && (e.animation.name = o), e.meta = t.meta || {}, typeof t.cache == "object" ? (e.cache.read = (i = t.cache.read) != null ? i : e.cache.read, e.cache.write = (r = t.cache.write) != null ? r : e.cache.write) : t.cache !== void 0 && (e.cache = { read: !!t.cache, write: !!t.cache }), delete t.cache;
  try {
    await this.hooks.call("visit:start", e, void 0), e.state = 3;
    const c = this.hooks.call("page:load", e, { options: t }, async (l, u) => {
      let d;
      return l.cache.read && (d = this.cache.get(l.to.url)), u.page = d || await this.fetchPage(l.to.url, u.options), u.cache = !!d, u.page;
    });
    c.then(({ html: l }) => {
      e.advance(5), e.to.html = l, e.to.document = new DOMParser().parseFromString(l, "text/html");
    });
    const a = e.to.url + e.to.hash;
    if (e.history.popstate || (e.history.action === "replace" || e.to.url === this.location.url ? vt(a) : (this.currentHistoryIndex++, Ne(a, { index: this.currentHistoryIndex }))), this.location = B.fromUrl(a), e.history.popstate && this.classes.add("is-popstate"), e.animation.name && this.classes.add(`to-${ue(e.animation.name)}`), e.animation.wait && await c, e.done || (await this.hooks.call("visit:transition", e, void 0, async () => {
      if (!e.animation.animate) return await this.hooks.call("animation:skip", void 0), void await this.renderPage(e, await c);
      e.advance(4), await this.animatePageOut(e), e.animation.native && document.startViewTransition ? await document.startViewTransition(async () => await this.renderPage(e, await c)).finished : await this.renderPage(e, await c), await this.animatePageIn(e);
    }), e.done)) return;
    await this.hooks.call("visit:end", e, void 0, () => this.classes.clear()), e.state = 7, this.navigating = !1, this.onVisitEnd && (this.onVisitEnd(), this.onVisitEnd = void 0);
  } catch (c) {
    if (!c || c != null && c.aborted) return void (e.state = 8);
    e.state = 9, console.error(c), this.options.skipPopStateHandling = () => (window.location.assign(e.to.url + e.to.hash), !0), window.history.back();
  } finally {
    delete e.to.document;
  }
}
const We = async function(e) {
  await this.hooks.call("animation:out:start", e, void 0, () => {
    this.classes.add("is-changing", "is-animating", "is-leaving");
  }), await this.hooks.call("animation:out:await", e, { skip: !1 }, (t, { skip: n }) => {
    if (!n) return this.awaitAnimations({ selector: t.animation.selector });
  }), await this.hooks.call("animation:out:end", e, void 0);
}, Ke = function(e) {
  var t;
  const n = e.to.document;
  if (!n) return !1;
  const s = ((t = n.querySelector("title")) == null ? void 0 : t.innerText) || "";
  document.title = s;
  const o = zt('[data-swup-persist]:not([data-swup-persist=""])'), i = e.containers.map((r) => {
    const c = document.querySelector(r), a = n.querySelector(r);
    return c && a ? (c.replaceWith(a.cloneNode(!0)), !0) : (c || console.warn(`[swup] Container missing in current document: ${r}`), a || console.warn(`[swup] Container missing in incoming document: ${r}`), !1);
  }).filter(Boolean);
  return o.forEach((r) => {
    const c = r.getAttribute("data-swup-persist"), a = Ht(`[data-swup-persist="${c}"]`);
    a && a !== r && a.replaceWith(r);
  }), i.length === e.containers.length;
}, Qe = function(e) {
  const t = { behavior: "auto" }, { target: n, reset: s } = e.scroll, o = n ?? e.to.hash;
  let i = !1;
  return o && (i = this.hooks.callSync("scroll:anchor", e, { hash: o, options: t }, (r, { hash: c, options: a }) => {
    const l = this.getAnchorElement(c);
    return l && l.scrollIntoView(a), !!l;
  })), s && !i && (i = this.hooks.callSync("scroll:top", e, { options: t }, (r, { options: c }) => (window.scrollTo(q({ top: 0, left: 0 }, c)), !0))), i;
}, Xe = async function(e) {
  if (e.done) return;
  const t = this.hooks.call("animation:in:await", e, { skip: !1 }, (n, { skip: s }) => {
    if (!s) return this.awaitAnimations({ selector: n.animation.selector });
  });
  await de(), await this.hooks.call("animation:in:start", e, void 0, () => {
    this.classes.remove("is-animating");
  }), await t, await this.hooks.call("animation:in:end", e, void 0);
}, Ye = async function(e, t) {
  if (e.done) return;
  e.advance(6);
  const { url: n } = t;
  this.isSameResolvedUrl(yt(), n) || (vt(n), this.location = B.fromUrl(n), e.to.url = this.location.url, e.to.hash = this.location.hash), await this.hooks.call("content:replace", e, { page: t }, (s, {}) => {
    if (this.classes.remove("is-leaving"), s.animation.animate && this.classes.add("is-rendering"), !this.replaceContent(s)) throw new Error("[swup] Container mismatch, aborting");
    s.animation.animate && (this.classes.add("is-changing", "is-animating", "is-rendering"), s.animation.name && this.classes.add(`to-${ue(s.animation.name)}`));
  }), await this.hooks.call("content:scroll", e, void 0, () => this.scrollToContent(e)), await this.hooks.call("page:view", e, { url: this.location.url, title: document.title });
}, Je = function(e) {
  var t;
  if (t = e, !!(t != null && t.isSwupPlugin)) {
    if (e.swup = this, !e._checkRequirements || e._checkRequirements()) return e._beforeMount && e._beforeMount(), e.mount(), this.plugins.push(e), this.plugins;
  } else console.error("Not a swup plugin instance", e);
};
function Ze(e) {
  const t = this.findPlugin(e);
  if (t) return t.unmount(), t._afterUnmount && t._afterUnmount(), this.plugins = this.plugins.filter((n) => n !== t), this.plugins;
  console.error("No such plugin", t);
}
function tn(e) {
  return this.plugins.find((t) => t === e || t.name === e || t.name === `Swup${String(e)}`);
}
function en(e) {
  if (typeof this.options.resolveUrl != "function") return console.warn("[swup] options.resolveUrl expects a callback function."), e;
  const t = this.options.resolveUrl(e);
  return t && typeof t == "string" ? t.startsWith("//") || t.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), e) : t : (console.warn("[swup] options.resolveUrl needs to return a url"), e);
}
function nn(e, t) {
  return this.resolveUrl(e) === this.resolveUrl(t);
}
const sn = { animateHistoryBrowsing: !1, animationSelector: '[class*="transition-"]', animationScope: "html", cache: !0, containers: ["#swup"], hooks: {}, ignoreVisit: (e, { el: t } = {}) => !(t == null || !t.closest("[data-no-swup]")), linkSelector: "a[href]", linkToSelf: "scroll", native: !1, plugins: [], resolveUrl: (e) => e, requestHeaders: { "X-Requested-With": "swup", Accept: "text/html, application/xhtml+xml" }, skipPopStateHandling: (e) => {
  var t;
  return ((t = e.state) == null ? void 0 : t.source) !== "swup";
}, timeout: 0 };
class on {
  get currentPageUrl() {
    return this.location.url;
  }
  constructor(t = {}) {
    var n, s;
    this.version = "4.8.3", this.options = void 0, this.defaults = sn, this.plugins = [], this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, this.location = B.fromUrl(window.location.href), this.currentHistoryIndex = void 0, this.clickDelegate = void 0, this.navigating = !1, this.onVisitEnd = void 0, this.use = Je, this.unuse = Ze, this.findPlugin = tn, this.log = () => {
    }, this.navigate = _e, this.performNavigation = Ge, this.createVisit = $e, this.delegateEvent = Ue, this.fetchPage = Be, this.awaitAnimations = ze, this.renderPage = Ye, this.replaceContent = Ke, this.animatePageIn = Xe, this.animatePageOut = We, this.scrollToContent = Qe, this.getAnchorElement = je, this.getCurrentUrl = yt, this.resolveUrl = en, this.isSameResolvedUrl = nn, this.options = q({}, this.defaults, t), this.handleLinkClick = this.handleLinkClick.bind(this), this.handlePopState = this.handlePopState.bind(this), this.cache = new Fe(this), this.classes = new He(this), this.hooks = new Re(this), this.visit = this.createVisit({ to: "" }), this.currentHistoryIndex = (n = (s = window.history.state) == null ? void 0 : s.index) != null ? n : 1, this.enable();
  }
  async enable() {
    var t;
    const { linkSelector: n } = this.options;
    this.clickDelegate = this.delegateEvent(n, "click", this.handleLinkClick), window.addEventListener("popstate", this.handlePopState), this.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), this.options.native = this.options.native && !!document.startViewTransition, this.options.plugins.forEach((s) => this.use(s));
    for (const [s, o] of Object.entries(this.options.hooks)) {
      const [i, r] = this.hooks.parseName(s);
      this.hooks.on(i, o, r);
    }
    ((t = window.history.state) == null ? void 0 : t.source) !== "swup" && vt(null, { index: this.currentHistoryIndex }), await de(), await this.hooks.call("enable", void 0, void 0, () => {
      const s = document.documentElement;
      s.classList.add("swup-enabled"), s.classList.toggle("swup-native", this.options.native);
    });
  }
  async destroy() {
    this.clickDelegate.destroy(), window.removeEventListener("popstate", this.handlePopState), this.cache.clear(), this.options.plugins.forEach((t) => this.unuse(t)), await this.hooks.call("disable", void 0, void 0, () => {
      const t = document.documentElement;
      t.classList.remove("swup-enabled"), t.classList.remove("swup-native");
    }), this.hooks.clear();
  }
  shouldIgnoreVisit(t, { el: n, event: s } = {}) {
    const { origin: o, url: i, hash: r } = B.fromUrl(t);
    return o !== window.location.origin || !(!n || !this.triggerWillOpenNewWindow(n)) || !!this.options.ignoreVisit(i + r, { el: n, event: s });
  }
  handleLinkClick(t) {
    const n = t.delegateTarget, { href: s, url: o, hash: i } = B.fromElement(n);
    if (this.shouldIgnoreVisit(s, { el: n, event: t })) return;
    if (this.navigating && o === this.visit.to.url) return void t.preventDefault();
    const r = this.createVisit({ to: o, hash: i, el: n, event: t });
    t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? this.hooks.callSync("link:newtab", r, { href: s }) : t.button === 0 && this.hooks.callSync("link:click", r, { el: n, event: t }, () => {
      var c;
      const a = (c = r.from.url) != null ? c : "";
      t.preventDefault(), o && o !== a ? this.isSameResolvedUrl(o, a) || this.performNavigation(r) : i ? this.hooks.callSync("link:anchor", r, { hash: i }, () => {
        vt(o + i), this.scrollToContent(r);
      }) : this.hooks.callSync("link:self", r, void 0, () => {
        this.options.linkToSelf === "navigate" ? this.performNavigation(r) : (vt(o), this.scrollToContent(r));
      });
    });
  }
  handlePopState(t) {
    var n, s, o, i;
    const r = (n = (s = t.state) == null ? void 0 : s.url) != null ? n : window.location.href;
    if (this.options.skipPopStateHandling(t) || this.isSameResolvedUrl(yt(), this.location.url)) return;
    const { url: c, hash: a } = B.fromUrl(r), l = this.createVisit({ to: c, hash: a, event: t });
    l.history.popstate = !0;
    const u = (o = (i = t.state) == null ? void 0 : i.index) != null ? o : 0;
    u && u !== this.currentHistoryIndex && (l.history.direction = u - this.currentHistoryIndex > 0 ? "forwards" : "backwards", this.currentHistoryIndex = u), l.animation.animate = !1, l.scroll.reset = !1, l.scroll.target = !1, this.options.animateHistoryBrowsing && (l.animation.animate = !0, l.scroll.reset = !0), this.hooks.callSync("history:popstate", l, { event: t }, () => {
      this.performNavigation(l);
    });
  }
  triggerWillOpenNewWindow(t) {
    return !!t.matches('[download], [target="_blank"]');
  }
}
function rn() {
  const e = document.getElementById("projectsCounter");
  if (!e) return;
  const t = document.querySelectorAll(".work-list .work-item").length;
  e.textContent = `(${t})`;
}
function _t(e) {
  return typeof e == "number";
}
function $t(e) {
  return typeof e == "string";
}
function Dt(e) {
  return typeof e == "boolean";
}
function ae(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function P(e) {
  return Math.abs(e);
}
function Gt(e) {
  return Math.sign(e);
}
function wt(e, t) {
  return P(e - t);
}
function an(e, t) {
  if (e === 0 || t === 0 || P(e) <= P(t)) return 0;
  const n = wt(P(e), P(t));
  return P(n / e);
}
function cn(e) {
  return Math.round(e * 100) / 100;
}
function St(e) {
  return bt(e).map(Number);
}
function H(e) {
  return e[kt(e)];
}
function kt(e) {
  return Math.max(0, e.length - 1);
}
function Wt(e, t) {
  return t === kt(e);
}
function ce(e, t = 0) {
  return Array.from(Array(e), (n, s) => t + s);
}
function bt(e) {
  return Object.keys(e);
}
function pe(e, t) {
  return [e, t].reduce((n, s) => (bt(s).forEach((o) => {
    const i = n[o], r = s[o], c = ae(i) && ae(r);
    n[o] = c ? pe(i, r) : r;
  }), n), {});
}
function Rt(e, t) {
  return typeof t.MouseEvent < "u" && e instanceof t.MouseEvent;
}
function ln(e, t) {
  const n = {
    start: s,
    center: o,
    end: i
  };
  function s() {
    return 0;
  }
  function o(a) {
    return i(a) / 2;
  }
  function i(a) {
    return t - a;
  }
  function r(a, l) {
    return $t(e) ? n[e](a) : e(t, a, l);
  }
  return {
    measure: r
  };
}
function Et() {
  let e = [];
  function t(o, i, r, c = {
    passive: !0
  }) {
    let a;
    if ("addEventListener" in o)
      o.addEventListener(i, r, c), a = () => o.removeEventListener(i, r, c);
    else {
      const l = o;
      l.addListener(r), a = () => l.removeListener(r);
    }
    return e.push(a), s;
  }
  function n() {
    e = e.filter((o) => o());
  }
  const s = {
    add: t,
    clear: n
  };
  return s;
}
function un(e, t, n, s) {
  const o = Et(), i = 1e3 / 60;
  let r = null, c = 0, a = 0;
  function l() {
    o.add(e, "visibilitychange", () => {
      e.hidden && f();
    });
  }
  function u() {
    w(), o.clear();
  }
  function d(g) {
    if (!a) return;
    r || (r = g, n(), n());
    const p = g - r;
    for (r = g, c += p; c >= i; )
      n(), c -= i;
    const v = c / i;
    s(v), a && (a = t.requestAnimationFrame(d));
  }
  function h() {
    a || (a = t.requestAnimationFrame(d));
  }
  function w() {
    t.cancelAnimationFrame(a), r = null, c = 0, a = 0;
  }
  function f() {
    r = null, c = 0;
  }
  return {
    init: l,
    destroy: u,
    start: h,
    stop: w,
    update: n,
    render: s
  };
}
function dn(e, t) {
  const n = t === "rtl", s = e === "y", o = s ? "y" : "x", i = s ? "x" : "y", r = !s && n ? -1 : 1, c = u(), a = d();
  function l(f) {
    const {
      height: m,
      width: g
    } = f;
    return s ? m : g;
  }
  function u() {
    return s ? "top" : n ? "right" : "left";
  }
  function d() {
    return s ? "bottom" : n ? "left" : "right";
  }
  function h(f) {
    return f * r;
  }
  return {
    scroll: o,
    cross: i,
    startEdge: c,
    endEdge: a,
    measureSize: l,
    direction: h
  };
}
function ot(e = 0, t = 0) {
  const n = P(e - t);
  function s(l) {
    return l < e;
  }
  function o(l) {
    return l > t;
  }
  function i(l) {
    return s(l) || o(l);
  }
  function r(l) {
    return i(l) ? s(l) ? e : t : l;
  }
  function c(l) {
    return n ? l - n * Math.ceil((l - t) / n) : l;
  }
  return {
    length: n,
    max: t,
    min: e,
    constrain: r,
    reachedAny: i,
    reachedMax: o,
    reachedMin: s,
    removeOffset: c
  };
}
function me(e, t, n) {
  const {
    constrain: s
  } = ot(0, e), o = e + 1;
  let i = r(t);
  function r(h) {
    return n ? P((o + h) % o) : s(h);
  }
  function c() {
    return i;
  }
  function a(h) {
    return i = r(h), d;
  }
  function l(h) {
    return u().set(c() + h);
  }
  function u() {
    return me(e, c(), n);
  }
  const d = {
    get: c,
    set: a,
    add: l,
    clone: u
  };
  return d;
}
function fn(e, t, n, s, o, i, r, c, a, l, u, d, h, w, f, m, g, p, v) {
  const {
    cross: S,
    direction: k
  } = e, T = ["INPUT", "SELECT", "TEXTAREA"], x = {
    passive: !1
  }, b = Et(), E = Et(), L = ot(50, 225).constrain(w.measure(20)), D = {
    mouse: 300,
    touch: 400
  }, I = {
    mouse: 500,
    touch: 600
  }, U = f ? 43 : 25;
  let $ = !1, R = 0, j = 0, Z = !1, Y = !1, G = !1, W = !1;
  function dt(y) {
    if (!v) return;
    function C(N) {
      (Dt(v) || v(y, N)) && ht(N);
    }
    const M = t;
    b.add(M, "dragstart", (N) => N.preventDefault(), x).add(M, "touchmove", () => {
    }, x).add(M, "touchend", () => {
    }).add(M, "touchstart", C).add(M, "mousedown", C).add(M, "touchcancel", O).add(M, "contextmenu", O).add(M, "click", Q, !0);
  }
  function z() {
    b.clear(), E.clear();
  }
  function it() {
    const y = W ? n : t;
    E.add(y, "touchmove", F, x).add(y, "touchend", O).add(y, "mousemove", F, x).add(y, "mouseup", O);
  }
  function rt(y) {
    const C = y.nodeName || "";
    return T.includes(C);
  }
  function K() {
    return (f ? I : D)[W ? "mouse" : "touch"];
  }
  function ft(y, C) {
    const M = d.add(Gt(y) * -1), N = u.byDistance(y, !f).distance;
    return f || P(y) < L ? N : g && C ? N * 0.5 : u.byIndex(M.get(), 0).distance;
  }
  function ht(y) {
    const C = Rt(y, s);
    W = C, G = f && C && !y.buttons && $, $ = wt(o.get(), r.get()) >= 2, !(C && y.button !== 0) && (rt(y.target) || (Z = !0, i.pointerDown(y), l.useFriction(0).useDuration(0), o.set(r), it(), R = i.readPoint(y), j = i.readPoint(y, S), h.emit("pointerDown")));
  }
  function F(y) {
    if (!Rt(y, s) && y.touches.length >= 2) return O(y);
    const M = i.readPoint(y), N = i.readPoint(y, S), _ = wt(M, R), X = wt(N, j);
    if (!Y && !W && (!y.cancelable || (Y = _ > X, !Y)))
      return O(y);
    const tt = i.pointerMove(y);
    _ > m && (G = !0), l.useFriction(0.3).useDuration(0.75), c.start(), o.add(k(tt)), y.preventDefault();
  }
  function O(y) {
    const M = u.byDistance(0, !1).index !== d.get(), N = i.pointerUp(y) * K(), _ = ft(k(N), M), X = an(N, _), tt = U - 10 * X, J = p + X / 50;
    Y = !1, Z = !1, E.clear(), l.useDuration(tt).useFriction(J), a.distance(_, !f), W = !1, h.emit("pointerUp");
  }
  function Q(y) {
    G && (y.stopPropagation(), y.preventDefault(), G = !1);
  }
  function V() {
    return Z;
  }
  return {
    init: dt,
    destroy: z,
    pointerDown: V
  };
}
function hn(e, t) {
  let s, o;
  function i(d) {
    return d.timeStamp;
  }
  function r(d, h) {
    const f = `client${(h || e.scroll) === "x" ? "X" : "Y"}`;
    return (Rt(d, t) ? d : d.touches[0])[f];
  }
  function c(d) {
    return s = d, o = d, r(d);
  }
  function a(d) {
    const h = r(d) - r(o), w = i(d) - i(s) > 170;
    return o = d, w && (s = d), h;
  }
  function l(d) {
    if (!s || !o) return 0;
    const h = r(o) - r(s), w = i(d) - i(s), f = i(d) - i(o) > 170, m = h / w;
    return w && !f && P(m) > 0.1 ? m : 0;
  }
  return {
    pointerDown: c,
    pointerMove: a,
    pointerUp: l,
    readPoint: r
  };
}
function pn() {
  function e(n) {
    const {
      offsetTop: s,
      offsetLeft: o,
      offsetWidth: i,
      offsetHeight: r
    } = n;
    return {
      top: s,
      right: o + i,
      bottom: s + r,
      left: o,
      width: i,
      height: r
    };
  }
  return {
    measure: e
  };
}
function mn(e) {
  function t(s) {
    return e * (s / 100);
  }
  return {
    measure: t
  };
}
function gn(e, t, n, s, o, i, r) {
  const c = [e].concat(s);
  let a, l, u = [], d = !1;
  function h(g) {
    return o.measureSize(r.measure(g));
  }
  function w(g) {
    if (!i) return;
    l = h(e), u = s.map(h);
    function p(v) {
      for (const S of v) {
        if (d) return;
        const k = S.target === e, T = s.indexOf(S.target), x = k ? l : u[T], b = h(k ? e : s[T]);
        if (P(b - x) >= 0.5) {
          g.reInit(), t.emit("resize");
          break;
        }
      }
    }
    a = new ResizeObserver((v) => {
      (Dt(i) || i(g, v)) && p(v);
    }), n.requestAnimationFrame(() => {
      c.forEach((v) => a.observe(v));
    });
  }
  function f() {
    d = !0, a && a.disconnect();
  }
  return {
    init: w,
    destroy: f
  };
}
function vn(e, t, n, s, o, i) {
  let r = 0, c = 0, a = o, l = i, u = e.get(), d = 0;
  function h() {
    const x = s.get() - e.get(), b = !a;
    let E = 0;
    return b ? (r = 0, n.set(s), e.set(s), E = x) : (n.set(e), r += x / a, r *= l, u += r, e.add(r), E = u - d), c = Gt(E), d = u, T;
  }
  function w() {
    const x = s.get() - t.get();
    return P(x) < 1e-3;
  }
  function f() {
    return a;
  }
  function m() {
    return c;
  }
  function g() {
    return r;
  }
  function p() {
    return S(o);
  }
  function v() {
    return k(i);
  }
  function S(x) {
    return a = x, T;
  }
  function k(x) {
    return l = x, T;
  }
  const T = {
    direction: m,
    duration: f,
    velocity: g,
    seek: h,
    settled: w,
    useBaseFriction: v,
    useBaseDuration: p,
    useFriction: k,
    useDuration: S
  };
  return T;
}
function wn(e, t, n, s, o) {
  const i = o.measure(10), r = o.measure(50), c = ot(0.1, 0.99);
  let a = !1;
  function l() {
    return !(a || !e.reachedAny(n.get()) || !e.reachedAny(t.get()));
  }
  function u(w) {
    if (!l()) return;
    const f = e.reachedMin(t.get()) ? "min" : "max", m = P(e[f] - t.get()), g = n.get() - t.get(), p = c.constrain(m / r);
    n.subtract(g * p), !w && P(g) < i && (n.set(e.constrain(n.get())), s.useDuration(25).useBaseFriction());
  }
  function d(w) {
    a = !w;
  }
  return {
    shouldConstrain: l,
    constrain: u,
    toggleActive: d
  };
}
function yn(e, t, n, s, o) {
  const i = ot(-t + e, 0), r = d(), c = u(), a = h();
  function l(f, m) {
    return wt(f, m) <= 1;
  }
  function u() {
    const f = r[0], m = H(r), g = r.lastIndexOf(f), p = r.indexOf(m) + 1;
    return ot(g, p);
  }
  function d() {
    return n.map((f, m) => {
      const {
        min: g,
        max: p
      } = i, v = i.constrain(f), S = !m, k = Wt(n, m);
      return S ? p : k || l(g, v) ? g : l(p, v) ? p : v;
    }).map((f) => parseFloat(f.toFixed(3)));
  }
  function h() {
    if (t <= e + o) return [i.max];
    if (s === "keepSnaps") return r;
    const {
      min: f,
      max: m
    } = c;
    return r.slice(f, m);
  }
  return {
    snapsContained: a,
    scrollContainLimit: c
  };
}
function Sn(e, t, n) {
  const s = t[0], o = n ? s - e : H(t);
  return {
    limit: ot(o, s)
  };
}
function bn(e, t, n, s) {
  const i = t.min + 0.1, r = t.max + 0.1, {
    reachedMin: c,
    reachedMax: a
  } = ot(i, r);
  function l(h) {
    return h === 1 ? a(n.get()) : h === -1 ? c(n.get()) : !1;
  }
  function u(h) {
    if (!l(h)) return;
    const w = e * (h * -1);
    s.forEach((f) => f.add(w));
  }
  return {
    loop: u
  };
}
function En(e) {
  const {
    max: t,
    length: n
  } = e;
  function s(i) {
    const r = i - t;
    return n ? r / -n : 0;
  }
  return {
    get: s
  };
}
function kn(e, t, n, s, o) {
  const {
    startEdge: i,
    endEdge: r
  } = e, {
    groupSlides: c
  } = o, a = d().map(t.measure), l = h(), u = w();
  function d() {
    return c(s).map((m) => H(m)[r] - m[0][i]).map(P);
  }
  function h() {
    return s.map((m) => n[i] - m[i]).map((m) => -P(m));
  }
  function w() {
    return c(l).map((m) => m[0]).map((m, g) => m + a[g]);
  }
  return {
    snaps: l,
    snapsAligned: u
  };
}
function xn(e, t, n, s, o, i) {
  const {
    groupSlides: r
  } = o, {
    min: c,
    max: a
  } = s, l = u();
  function u() {
    const h = r(i), w = !e || t === "keepSnaps";
    return n.length === 1 ? [i] : w ? h : h.slice(c, a).map((f, m, g) => {
      const p = !m, v = Wt(g, m);
      if (p) {
        const S = H(g[0]) + 1;
        return ce(S);
      }
      if (v) {
        const S = kt(i) - H(g)[0] + 1;
        return ce(S, H(g)[0]);
      }
      return f;
    });
  }
  return {
    slideRegistry: l
  };
}
function Ln(e, t, n, s, o) {
  const {
    reachedAny: i,
    removeOffset: r,
    constrain: c
  } = s;
  function a(f) {
    return f.concat().sort((m, g) => P(m) - P(g))[0];
  }
  function l(f) {
    const m = e ? r(f) : c(f), g = t.map((v, S) => ({
      diff: u(v - m, 0),
      index: S
    })).sort((v, S) => P(v.diff) - P(S.diff)), {
      index: p
    } = g[0];
    return {
      index: p,
      distance: m
    };
  }
  function u(f, m) {
    const g = [f, f + n, f - n];
    if (!e) return f;
    if (!m) return a(g);
    const p = g.filter((v) => Gt(v) === m);
    return p.length ? a(p) : H(g) - n;
  }
  function d(f, m) {
    const g = t[f] - o.get(), p = u(g, m);
    return {
      index: f,
      distance: p
    };
  }
  function h(f, m) {
    const g = o.get() + f, {
      index: p,
      distance: v
    } = l(g), S = !e && i(g);
    if (!m || S) return {
      index: p,
      distance: f
    };
    const k = t[p] - v, T = f + u(k, 0);
    return {
      index: p,
      distance: T
    };
  }
  return {
    byDistance: h,
    byIndex: d,
    shortcut: u
  };
}
function In(e, t, n, s, o, i, r) {
  function c(d) {
    const h = d.distance, w = d.index !== t.get();
    i.add(h), h && (s.duration() ? e.start() : (e.update(), e.render(1), e.update())), w && (n.set(t.get()), t.set(d.index), r.emit("select"));
  }
  function a(d, h) {
    const w = o.byDistance(d, h);
    c(w);
  }
  function l(d, h) {
    const w = t.clone().set(d), f = o.byIndex(w.get(), h);
    c(f);
  }
  return {
    distance: a,
    index: l
  };
}
function Cn(e, t, n, s, o, i, r, c) {
  const a = {
    passive: !0,
    capture: !0
  };
  let l = 0;
  function u(w) {
    if (!c) return;
    function f(m) {
      if ((/* @__PURE__ */ new Date()).getTime() - l > 10) return;
      r.emit("slideFocusStart"), e.scrollLeft = 0;
      const v = n.findIndex((S) => S.includes(m));
      _t(v) && (o.useDuration(0), s.index(v, 0), r.emit("slideFocus"));
    }
    i.add(document, "keydown", d, !1), t.forEach((m, g) => {
      i.add(m, "focus", (p) => {
        (Dt(c) || c(w, p)) && f(g);
      }, a);
    });
  }
  function d(w) {
    w.code === "Tab" && (l = (/* @__PURE__ */ new Date()).getTime());
  }
  return {
    init: u
  };
}
function gt(e) {
  let t = e;
  function n() {
    return t;
  }
  function s(a) {
    t = r(a);
  }
  function o(a) {
    t += r(a);
  }
  function i(a) {
    t -= r(a);
  }
  function r(a) {
    return _t(a) ? a : a.get();
  }
  return {
    get: n,
    set: s,
    add: o,
    subtract: i
  };
}
function ge(e, t) {
  const n = e.scroll === "x" ? r : c, s = t.style;
  let o = null, i = !1;
  function r(h) {
    return `translate3d(${h}px,0px,0px)`;
  }
  function c(h) {
    return `translate3d(0px,${h}px,0px)`;
  }
  function a(h) {
    if (i) return;
    const w = cn(e.direction(h));
    w !== o && (s.transform = n(w), o = w);
  }
  function l(h) {
    i = !h;
  }
  function u() {
    i || (s.transform = "", t.getAttribute("style") || t.removeAttribute("style"));
  }
  return {
    clear: u,
    to: a,
    toggleActive: l
  };
}
function Tn(e, t, n, s, o, i, r, c, a) {
  const u = St(o), d = St(o).reverse(), h = p().concat(v());
  function w(b, E) {
    return b.reduce((L, D) => L - o[D], E);
  }
  function f(b, E) {
    return b.reduce((L, D) => w(L, E) > 0 ? L.concat([D]) : L, []);
  }
  function m(b) {
    return i.map((E, L) => ({
      start: E - s[L] + 0.5 + b,
      end: E + t - 0.5 + b
    }));
  }
  function g(b, E, L) {
    const D = m(E);
    return b.map((I) => {
      const U = L ? 0 : -n, $ = L ? n : 0, R = L ? "end" : "start", j = D[I][R];
      return {
        index: I,
        loopPoint: j,
        slideLocation: gt(-1),
        translate: ge(e, a[I]),
        target: () => c.get() > j ? U : $
      };
    });
  }
  function p() {
    const b = r[0], E = f(d, b);
    return g(E, n, !1);
  }
  function v() {
    const b = t - r[0] - 1, E = f(u, b);
    return g(E, -n, !0);
  }
  function S() {
    return h.every(({
      index: b
    }) => {
      const E = u.filter((L) => L !== b);
      return w(E, t) <= 0.1;
    });
  }
  function k() {
    h.forEach((b) => {
      const {
        target: E,
        translate: L,
        slideLocation: D
      } = b, I = E();
      I !== D.get() && (L.to(I), D.set(I));
    });
  }
  function T() {
    h.forEach((b) => b.translate.clear());
  }
  return {
    canLoop: S,
    clear: T,
    loop: k,
    loopPoints: h
  };
}
function An(e, t, n) {
  let s, o = !1;
  function i(a) {
    if (!n) return;
    function l(u) {
      for (const d of u)
        if (d.type === "childList") {
          a.reInit(), t.emit("slidesChanged");
          break;
        }
    }
    s = new MutationObserver((u) => {
      o || (Dt(n) || n(a, u)) && l(u);
    }), s.observe(e, {
      childList: !0
    });
  }
  function r() {
    s && s.disconnect(), o = !0;
  }
  return {
    init: i,
    destroy: r
  };
}
function Pn(e, t, n, s) {
  const o = {};
  let i = null, r = null, c, a = !1;
  function l() {
    c = new IntersectionObserver((f) => {
      a || (f.forEach((m) => {
        const g = t.indexOf(m.target);
        o[g] = m;
      }), i = null, r = null, n.emit("slidesInView"));
    }, {
      root: e.parentElement,
      threshold: s
    }), t.forEach((f) => c.observe(f));
  }
  function u() {
    c && c.disconnect(), a = !0;
  }
  function d(f) {
    return bt(o).reduce((m, g) => {
      const p = parseInt(g), {
        isIntersecting: v
      } = o[p];
      return (f && v || !f && !v) && m.push(p), m;
    }, []);
  }
  function h(f = !0) {
    if (f && i) return i;
    if (!f && r) return r;
    const m = d(f);
    return f && (i = m), f || (r = m), m;
  }
  return {
    init: l,
    destroy: u,
    get: h
  };
}
function Dn(e, t, n, s, o, i) {
  const {
    measureSize: r,
    startEdge: c,
    endEdge: a
  } = e, l = n[0] && o, u = f(), d = m(), h = n.map(r), w = g();
  function f() {
    if (!l) return 0;
    const v = n[0];
    return P(t[c] - v[c]);
  }
  function m() {
    if (!l) return 0;
    const v = i.getComputedStyle(H(s));
    return parseFloat(v.getPropertyValue(`margin-${a}`));
  }
  function g() {
    return n.map((v, S, k) => {
      const T = !S, x = Wt(k, S);
      return T ? h[S] + u : x ? h[S] + d : k[S + 1][c] - v[c];
    }).map(P);
  }
  return {
    slideSizes: h,
    slideSizesWithGaps: w,
    startGap: u,
    endGap: d
  };
}
function Mn(e, t, n, s, o, i, r, c, a) {
  const {
    startEdge: l,
    endEdge: u,
    direction: d
  } = e, h = _t(n);
  function w(p, v) {
    return St(p).filter((S) => S % v === 0).map((S) => p.slice(S, S + v));
  }
  function f(p) {
    return p.length ? St(p).reduce((v, S, k) => {
      const T = H(v) || 0, x = T === 0, b = S === kt(p), E = o[l] - i[T][l], L = o[l] - i[S][u], D = !s && x ? d(r) : 0, I = !s && b ? d(c) : 0, U = P(L - I - (E + D));
      return k && U > t + a && v.push(S), b && v.push(p.length), v;
    }, []).map((v, S, k) => {
      const T = Math.max(k[S - 1] || 0);
      return p.slice(T, v);
    }) : [];
  }
  function m(p) {
    return h ? w(p, n) : f(p);
  }
  return {
    groupSlides: m
  };
}
function qn(e, t, n, s, o, i, r) {
  const {
    align: c,
    axis: a,
    direction: l,
    startIndex: u,
    loop: d,
    duration: h,
    dragFree: w,
    dragThreshold: f,
    inViewThreshold: m,
    slidesToScroll: g,
    skipSnaps: p,
    containScroll: v,
    watchResize: S,
    watchSlides: k,
    watchDrag: T,
    watchFocus: x
  } = i, b = 2, E = pn(), L = E.measure(t), D = n.map(E.measure), I = dn(a, l), U = I.measureSize(L), $ = mn(U), R = ln(c, U), j = !d && !!v, Z = d || !!v, {
    slideSizes: Y,
    slideSizesWithGaps: G,
    startGap: W,
    endGap: dt
  } = Dn(I, L, D, n, Z, o), z = Mn(I, U, g, d, L, D, W, dt, b), {
    snaps: it,
    snapsAligned: rt
  } = kn(I, R, L, D, z), K = -H(it) + H(G), {
    snapsContained: ft,
    scrollContainLimit: ht
  } = yn(U, K, rt, v, b), F = j ? ft : rt, {
    limit: O
  } = Sn(K, F, d), Q = me(kt(F), u, d), V = Q.clone(), A = St(n), y = ({
    dragHandler: at,
    scrollBody: Nt,
    scrollBounds: Ut,
    options: {
      loop: xt
    }
  }) => {
    xt || Ut.constrain(at.pointerDown()), Nt.seek();
  }, C = ({
    scrollBody: at,
    translate: Nt,
    location: Ut,
    offsetLocation: xt,
    previousLocation: Le,
    scrollLooper: Ie,
    slideLooper: Ce,
    dragHandler: Te,
    animation: Ae,
    eventHandler: Jt,
    scrollBounds: Pe,
    options: {
      loop: Zt
    }
  }, te) => {
    const ee = at.settled(), De = !Pe.shouldConstrain(), ne = Zt ? ee : ee && De, se = ne && !Te.pointerDown();
    se && Ae.stop();
    const Me = Ut.get() * te + Le.get() * (1 - te);
    xt.set(Me), Zt && (Ie.loop(at.direction()), Ce.loop()), Nt.to(xt.get()), se && Jt.emit("settle"), ne || Jt.emit("scroll");
  }, M = un(s, o, () => y(Ot), (at) => C(Ot, at)), N = 0.68, _ = F[Q.get()], X = gt(_), tt = gt(_), J = gt(_), et = gt(_), pt = vn(X, J, tt, et, h, N), Mt = Ln(d, F, K, O, et), qt = In(M, Q, V, pt, Mt, et, r), Qt = En(O), Xt = Et(), ke = Pn(t, n, r, m), {
    slideRegistry: Yt
  } = xn(j, v, F, ht, z, A), xe = Cn(e, n, Yt, qt, pt, Xt, r, x), Ot = {
    ownerDocument: s,
    ownerWindow: o,
    eventHandler: r,
    containerRect: L,
    slideRects: D,
    animation: M,
    axis: I,
    dragHandler: fn(I, e, s, o, et, hn(I, o), X, M, qt, pt, Mt, Q, r, $, w, f, p, N, T),
    eventStore: Xt,
    percentOfView: $,
    index: Q,
    indexPrevious: V,
    limit: O,
    location: X,
    offsetLocation: J,
    previousLocation: tt,
    options: i,
    resizeHandler: gn(t, r, o, n, I, S, E),
    scrollBody: pt,
    scrollBounds: wn(O, J, et, pt, $),
    scrollLooper: bn(K, O, J, [X, J, tt, et]),
    scrollProgress: Qt,
    scrollSnapList: F.map(Qt.get),
    scrollSnaps: F,
    scrollTarget: Mt,
    scrollTo: qt,
    slideLooper: Tn(I, U, K, Y, G, it, F, J, n),
    slideFocus: xe,
    slidesHandler: An(t, r, k),
    slidesInView: ke,
    slideIndexes: A,
    slideRegistry: Yt,
    slidesToScroll: z,
    target: et,
    translate: ge(I, t)
  };
  return Ot;
}
function On() {
  let e = {}, t;
  function n(l) {
    t = l;
  }
  function s(l) {
    return e[l] || [];
  }
  function o(l) {
    return s(l).forEach((u) => u(t, l)), a;
  }
  function i(l, u) {
    return e[l] = s(l).concat([u]), a;
  }
  function r(l, u) {
    return e[l] = s(l).filter((d) => d !== u), a;
  }
  function c() {
    e = {};
  }
  const a = {
    init: n,
    emit: o,
    off: r,
    on: i,
    clear: c
  };
  return a;
}
const Nn = {
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
function Un(e) {
  function t(i, r) {
    return pe(i, r || {});
  }
  function n(i) {
    const r = i.breakpoints || {}, c = bt(r).filter((a) => e.matchMedia(a).matches).map((a) => r[a]).reduce((a, l) => t(a, l), {});
    return t(i, c);
  }
  function s(i) {
    return i.map((r) => bt(r.breakpoints || {})).reduce((r, c) => r.concat(c), []).map(e.matchMedia);
  }
  return {
    mergeOptions: t,
    optionsAtMedia: n,
    optionsMediaQueries: s
  };
}
function Bn(e) {
  let t = [];
  function n(i, r) {
    return t = r.filter(({
      options: c
    }) => e.optionsAtMedia(c).active !== !1), t.forEach((c) => c.init(i, e)), r.reduce((c, a) => Object.assign(c, {
      [a.name]: a
    }), {});
  }
  function s() {
    t = t.filter((i) => i.destroy());
  }
  return {
    init: n,
    destroy: s
  };
}
function Kt(e, t, n) {
  const s = e.ownerDocument, o = s.defaultView, i = Un(o), r = Bn(i), c = Et(), a = On(), {
    mergeOptions: l,
    optionsAtMedia: u,
    optionsMediaQueries: d
  } = i, {
    on: h,
    off: w,
    emit: f
  } = a, m = I;
  let g = !1, p, v = l(Nn, Kt.globalOptions), S = l(v), k = [], T, x, b;
  function E() {
    const {
      container: A,
      slides: y
    } = S;
    x = ($t(A) ? e.querySelector(A) : A) || e.children[0];
    const M = $t(y) ? x.querySelectorAll(y) : y;
    b = [].slice.call(M || x.children);
  }
  function L(A) {
    const y = qn(e, x, b, s, o, A, a);
    if (A.loop && !y.slideLooper.canLoop()) {
      const C = Object.assign({}, A, {
        loop: !1
      });
      return L(C);
    }
    return y;
  }
  function D(A, y) {
    g || (v = l(v, A), S = u(v), k = y || k, E(), p = L(S), d([v, ...k.map(({
      options: C
    }) => C)]).forEach((C) => c.add(C, "change", I)), S.active && (p.translate.to(p.location.get()), p.animation.init(), p.slidesInView.init(), p.slideFocus.init(V), p.eventHandler.init(V), p.resizeHandler.init(V), p.slidesHandler.init(V), p.options.loop && p.slideLooper.loop(), x.offsetParent && b.length && p.dragHandler.init(V), T = r.init(V, k)));
  }
  function I(A, y) {
    const C = z();
    U(), D(l({
      startIndex: C
    }, A), y), a.emit("reInit");
  }
  function U() {
    p.dragHandler.destroy(), p.eventStore.clear(), p.translate.clear(), p.slideLooper.clear(), p.resizeHandler.destroy(), p.slidesHandler.destroy(), p.slidesInView.destroy(), p.animation.destroy(), r.destroy(), c.clear();
  }
  function $() {
    g || (g = !0, c.clear(), U(), a.emit("destroy"), a.clear());
  }
  function R(A, y, C) {
    !S.active || g || (p.scrollBody.useBaseFriction().useDuration(y === !0 ? 0 : S.duration), p.scrollTo.index(A, C || 0));
  }
  function j(A) {
    const y = p.index.add(1).get();
    R(y, A, -1);
  }
  function Z(A) {
    const y = p.index.add(-1).get();
    R(y, A, 1);
  }
  function Y() {
    return p.index.add(1).get() !== z();
  }
  function G() {
    return p.index.add(-1).get() !== z();
  }
  function W() {
    return p.scrollSnapList;
  }
  function dt() {
    return p.scrollProgress.get(p.offsetLocation.get());
  }
  function z() {
    return p.index.get();
  }
  function it() {
    return p.indexPrevious.get();
  }
  function rt() {
    return p.slidesInView.get();
  }
  function K() {
    return p.slidesInView.get(!1);
  }
  function ft() {
    return T;
  }
  function ht() {
    return p;
  }
  function F() {
    return e;
  }
  function O() {
    return x;
  }
  function Q() {
    return b;
  }
  const V = {
    canScrollNext: Y,
    canScrollPrev: G,
    containerNode: O,
    internalEngine: ht,
    destroy: $,
    off: w,
    on: h,
    emit: f,
    plugins: ft,
    previousScrollSnap: it,
    reInit: m,
    rootNode: F,
    scrollNext: j,
    scrollPrev: Z,
    scrollProgress: dt,
    scrollSnapList: W,
    scrollTo: R,
    selectedScrollSnap: z,
    slideNodes: Q,
    slidesInView: rt,
    slidesNotInView: K
  };
  return D(t, n), setTimeout(() => a.emit("init"), 0), V;
}
Kt.globalOptions = void 0;
let ve = "/", we = "", ye = "";
function Fn(e) {
  ve = e;
}
function Vn(e, t) {
  we = e, ye = t;
}
function Hn() {
  const e = document.getElementById("backLink");
  e && (e.href = ve), $n();
}
function $n() {
  const e = document.querySelector(".embla"), t = document.querySelector(".embla__viewport");
  if (!e || !t) return;
  const n = t.querySelector(".embla__container") || t.firstElementChild;
  if (n) {
    const a = [...n.children];
    for (let l = a.length - 1; l > 0; l--) {
      const u = Math.floor(Math.random() * (l + 1));
      n.appendChild(a[u]), a.splice(u, 1);
    }
  }
  const s = Kt(t, { loop: !0, align: "center" }), o = e.querySelector(".embla__prev"), i = e.querySelector(".embla__next");
  o && o.addEventListener("click", () => s.scrollPrev()), i && i.addEventListener("click", () => s.scrollNext());
  const r = s.slideNodes(), c = () => {
    const a = s.selectedScrollSnap();
    r.forEach((l, u) => l.classList.toggle("active", u === a));
  };
  s.on("select", c), c();
}
function Se() {
  var t;
  switch ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) {
    case "home":
      break;
    case "work":
      rn();
      break;
    case "info":
      break;
    case "details":
      Hn();
      break;
  }
}
let mt = null;
function be() {
  mt && (mt.disconnect(), mt = null), document.querySelectorAll("img").forEach((e) => {
    e.complete && e.naturalWidth > 0 ? e.style.opacity = "1" : e.addEventListener("load", () => {
      e.style.opacity = "1";
    }, { once: !0 });
  }), mt = new IntersectionObserver((e) => {
    e.forEach((t) => {
      t.isIntersecting ? t.target.play() : t.target.pause();
    });
  }, { threshold: 0.2 }), document.querySelectorAll("video").forEach((e) => {
    const t = () => {
      e.style.opacity = "1";
    };
    e.readyState >= 2 ? t() : e.addEventListener("loadeddata", t, { once: !0 }), mt.observe(e);
  });
}
function Rn() {
  jt(), document.querySelectorAll("[data-link]").forEach((e) => {
    e.addEventListener("click", () => jt(e.dataset.link));
  });
}
function jt(e) {
  var i;
  const t = document.querySelectorAll("[data-link]"), n = document.querySelector(".indicator"), s = e ?? ((i = document.querySelector("[data-swup]")) == null ? void 0 : i.dataset.swup);
  if (!s) return;
  t.forEach((r) => r.classList.remove("w--current"));
  const o = document.querySelector(`[data-link="${s}"]`);
  o && (o.classList.add("w--current"), n && (n.style.left = `${o.offsetLeft}px`, n.style.width = `${o.offsetWidth}px`));
}
let nt = null, Tt = !1, ct = null, lt = !1;
function Ee() {
  var c;
  nt && (clearInterval(nt), nt = null), Tt = !1, lt = !1;
  const e = document.getElementById("currentYear");
  e && (e.textContent = (/* @__PURE__ */ new Date()).getFullYear());
  const t = document.getElementById("first"), n = document.getElementById("second");
  if (!t || !n) return;
  const s = t.querySelector("p"), o = n.querySelector("p");
  if (((c = document.querySelector("[data-swup]")) == null ? void 0 : c.dataset.swup) === "details") {
    const a = document.querySelector('[data-swup="details"]'), l = we || (a == null ? void 0 : a.dataset.name) || "", u = ye || (a == null ? void 0 : a.dataset.services) || "";
    s && l && (s.textContent = l, t.style.width = st(t, l) + "px"), o && u && (o.textContent = u, n.style.width = st(n, u) + "px");
    return;
  }
  ct === null && (ct = t.dataset.default || (s == null ? void 0 : s.textContent) || ""), s && (s.textContent = ct, t.style.width = st(t, ct) + "px");
  const r = Pt();
  o && (o.textContent = r, n.style.width = st(n, r) + "px"), nt = setInterval(() => {
    !Tt && o && (o.textContent = Pt());
  }, 1e3), document.querySelectorAll("[data-name]").forEach((a) => {
    a.addEventListener("mouseenter", () => {
      lt || ut(t, s, a.dataset.name);
    }), a.addEventListener("mouseleave", () => {
      lt || ut(t, s, ct);
    });
  }), document.querySelectorAll("[data-services]").forEach((a) => {
    a.addEventListener("mouseenter", () => {
      lt || (Tt = !0, ut(n, o, a.dataset.services));
    }), a.addEventListener("mouseleave", () => {
      lt || (Tt = !1, ut(n, o, Pt()));
    });
  });
}
function jn(e, t) {
  lt = !0, nt && (clearInterval(nt), nt = null);
  const n = document.getElementById("first"), s = document.getElementById("second");
  if (!n || !s) return;
  const o = n.querySelector("p"), i = s.querySelector("p");
  o && e && (o.textContent = e, n.style.width = st(n, e) + "px"), i && t && (i.textContent = t, s.style.width = st(s, t) + "px");
}
function zn() {
  const e = document.getElementById("first"), t = document.getElementById("second");
  if (!e || !t) return;
  const n = e.querySelector("p"), s = t.querySelector("p"), o = e.dataset.default || ct || "";
  n && o && ut(e, n, o), s && ut(t, s, Pt());
}
function ut(e, t, n) {
  t.style.opacity = "0", setTimeout(() => {
    t.textContent = n, e.style.width = st(e, n) + "px", t.style.opacity = "1";
  }, 200);
}
function st(e, t) {
  const n = e.cloneNode(!0);
  Object.assign(n.style, {
    position: "absolute",
    visibility: "hidden",
    width: "auto",
    transition: "none",
    pointerEvents: "none"
  });
  const s = n.querySelector("p");
  s && (s.textContent = t), document.body.appendChild(n);
  const o = n.offsetWidth;
  return document.body.removeChild(n), o;
}
function Pt() {
  return (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1
  }) + " CET";
}
let At;
function _n() {
  At = new on({
    containers: ["#swup"],
    animationSelector: '[class*="transition-"]'
  }), document.addEventListener("click", (e) => {
    const t = e.target.closest("a[href]");
    if (!t) return;
    const n = e.target.closest('[data-to="details"]');
    if (n) {
      const s = n.dataset.name ?? "", o = n.dataset.services ?? "";
      Vn(s, o), jn(s, o), document.body.classList.add("details-transition");
    } else document.body.classList.contains("on-details") && t.target !== "_blank" && (document.body.classList.remove("on-details"), document.body.classList.add("details-transition"), zn());
  }, !0), At.hooks.on("visit:start", () => {
    var t;
    ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) !== "details" && Fn(window.location.pathname);
  }), At.hooks.on("animation:in:start", () => {
    var t;
    ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) === "details" ? (document.body.classList.add("on-details"), document.body.classList.remove("details-transition")) : document.body.classList.remove("on-details", "details-transition");
  }), At.hooks.on("page:view", () => {
    jt(), Se(), be(), Ee();
  });
}
var le;
const Gn = (le = document.querySelector("[data-swup]")) == null ? void 0 : le.dataset.swup;
document.body.classList.toggle("on-details", Gn === "details");
_n();
Rn();
Se();
be();
Ee();
