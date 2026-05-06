const qe = /* @__PURE__ */ new WeakMap();
function Ue(o, t, e, i) {
  if (!o && !qe.has(t))
    return !1;
  const r = qe.get(t) ?? /* @__PURE__ */ new WeakMap();
  qe.set(t, r);
  const n = r.get(e) ?? /* @__PURE__ */ new Set();
  r.set(e, n);
  const s = n.has(i);
  return o ? n.add(i) : n.delete(i), s && o;
}
function en(o, t) {
  let e = o.target;
  if (e instanceof Text && (e = e.parentElement), e instanceof Element && o.currentTarget instanceof Node) {
    const i = e.closest(t);
    if (i && o.currentTarget.contains(i))
      return i;
  }
}
function rn(o, t, e, i = {}) {
  const { signal: r, base: n = document } = i;
  if (r != null && r.aborted)
    return;
  const { once: s, ...a } = i, l = n instanceof Document ? n.documentElement : n, u = !!(typeof i == "object" ? i.capture : i), h = (_) => {
    const p = en(_, String(o));
    if (p) {
      const c = Object.assign(_, { delegateTarget: p });
      e.call(l, c), s && (l.removeEventListener(t, h, a), Ue(!1, l, e, f));
    }
  }, f = JSON.stringify({ selector: o, type: t, capture: u });
  Ue(!0, l, e, f) || l.addEventListener(t, h, a), r == null || r.addEventListener("abort", () => {
    Ue(!1, l, e, f);
  });
}
function W() {
  return W = Object.assign ? Object.assign.bind() : function(o) {
    for (var t = 1; t < arguments.length; t++) {
      var e = arguments[t];
      for (var i in e) ({}).hasOwnProperty.call(e, i) && (o[i] = e[i]);
    }
    return o;
  }, W.apply(null, arguments);
}
const Ji = (o, t) => String(o).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || t || "", ce = ({ hash: o } = {}) => window.location.pathname + window.location.search + (o ? window.location.hash : ""), nn = (o, t = {}) => {
  const e = W({ url: o = o || ce({ hash: !0 }), random: Math.random(), source: "swup" }, t);
  window.history.pushState(e, "", o);
}, ae = (o = null, t = {}) => {
  o = o || ce({ hash: !0 });
  const e = W({}, window.history.state || {}, { url: o, random: Math.random(), source: "swup" }, t);
  window.history.replaceState(e, "", o);
}, sn = (o, t, e, i) => {
  const r = new AbortController();
  return i = W({}, i, { signal: r.signal }), rn(o, t, e, i), { destroy: () => r.abort() };
};
class Q extends URL {
  constructor(t, e = document.baseURI) {
    super(t.toString(), e), Object.setPrototypeOf(this, Q.prototype);
  }
  get url() {
    return this.pathname + this.search;
  }
  static fromElement(t) {
    const e = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
    return new Q(e);
  }
  static fromUrl(t) {
    return new Q(t);
  }
}
class xe extends Error {
  constructor(t, e) {
    super(t), this.url = void 0, this.status = void 0, this.aborted = void 0, this.timedOut = void 0, this.name = "FetchError", this.url = e.url, this.status = e.status, this.aborted = e.aborted || !1, this.timedOut = e.timedOut || !1;
  }
}
async function on(o, t = {}) {
  var e;
  o = Q.fromUrl(o).url;
  const { visit: i = this.visit } = t, r = W({}, this.options.requestHeaders, t.headers), n = (e = t.timeout) != null ? e : this.options.timeout, s = new AbortController(), { signal: a } = s;
  t = W({}, t, { headers: r, signal: a });
  let l, u = !1, h = null;
  n && n > 0 && (h = setTimeout(() => {
    u = !0, s.abort("timeout");
  }, n));
  try {
    l = await this.hooks.call("fetch:request", i, { url: o, options: t }, (m, { url: g, options: v }) => fetch(g, v)), h && clearTimeout(h);
  } catch (m) {
    throw u ? (this.hooks.call("fetch:timeout", i, { url: o }), new xe(`Request timed out: ${o}`, { url: o, timedOut: u })) : (m == null ? void 0 : m.name) === "AbortError" || a.aborted ? new xe(`Request aborted: ${o}`, { url: o, aborted: !0 }) : m;
  }
  const { status: f, url: d } = l, _ = await l.text();
  if (f === 500) throw this.hooks.call("fetch:error", i, { status: f, response: l, url: d }), new xe(`Server error: ${d}`, { status: f, url: d });
  if (!_) throw new xe(`Empty response: ${d}`, { status: f, url: d });
  const { url: p } = Q.fromUrl(d), c = { url: p, html: _ };
  return !i.cache.write || t.method && t.method !== "GET" || o !== p || this.cache.set(c.url, c), c;
}
class an {
  constructor(t) {
    this.swup = void 0, this.pages = /* @__PURE__ */ new Map(), this.swup = t;
  }
  get size() {
    return this.pages.size;
  }
  get all() {
    const t = /* @__PURE__ */ new Map();
    return this.pages.forEach((e, i) => {
      t.set(i, W({}, e));
    }), t;
  }
  has(t) {
    return this.pages.has(this.resolve(t));
  }
  get(t) {
    const e = this.pages.get(this.resolve(t));
    return e && W({}, e);
  }
  set(t, e) {
    e = W({}, e, { url: t = this.resolve(t) }), this.pages.set(t, e), this.swup.hooks.callSync("cache:set", void 0, { page: e });
  }
  update(t, e) {
    t = this.resolve(t);
    const i = W({}, this.get(t), e, { url: t });
    this.pages.set(t, i);
  }
  delete(t) {
    this.pages.delete(this.resolve(t));
  }
  clear() {
    this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0, void 0);
  }
  prune(t) {
    this.pages.forEach((e, i) => {
      t(i, e) && this.delete(i);
    });
  }
  resolve(t) {
    const { url: e } = Q.fromUrl(t);
    return this.swup.resolveUrl(e);
  }
}
const je = (o, t = document) => t.querySelector(o), hi = (o, t = document) => Array.from(t.querySelectorAll(o)), tr = () => new Promise((o) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      o();
    });
  });
});
function er(o) {
  return !!o && (typeof o == "object" || typeof o == "function") && typeof o.then == "function";
}
function ln(o, t = []) {
  return new Promise((e, i) => {
    const r = o(...t);
    er(r) ? r.then(e, i) : e(r);
  });
}
function Mi(o, t) {
  const e = o == null ? void 0 : o.closest(`[${t}]`);
  return e != null && e.hasAttribute(t) ? (e == null ? void 0 : e.getAttribute(t)) || !0 : void 0;
}
class un {
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
    return this.selector.trim() ? hi(this.selector) : [];
  }
  add(...t) {
    this.targets.forEach((e) => e.classList.add(...t));
  }
  remove(...t) {
    this.targets.forEach((e) => e.classList.remove(...t));
  }
  clear() {
    this.targets.forEach((t) => {
      const e = t.className.split(" ").filter((i) => this.isSwupClass(i));
      t.classList.remove(...e);
    });
  }
  isSwupClass(t) {
    return this.swupClasses.some((e) => t.startsWith(e));
  }
}
class ir {
  constructor(t, e) {
    this.id = void 0, this.state = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, this.animation = void 0, this.trigger = void 0, this.cache = void 0, this.history = void 0, this.scroll = void 0, this.meta = void 0;
    const { to: i, from: r, hash: n, el: s, event: a } = e;
    this.id = Math.random(), this.state = 1, this.from = { url: r ?? t.location.url, hash: t.location.hash }, this.to = { url: i, hash: n }, this.containers = t.options.containers, this.animation = { animate: !0, wait: !1, name: void 0, native: t.options.native, scope: t.options.animationScope, selector: t.options.animationSelector }, this.trigger = { el: s, event: a }, this.cache = { read: t.options.cache, write: t.options.cache }, this.history = { action: "push", popstate: !1, direction: void 0 }, this.scroll = { reset: !0, target: void 0 }, this.meta = {};
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
function hn(o) {
  return new ir(this, o);
}
class cn {
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
  on(t, e, i = {}) {
    const r = this.get(t);
    if (!r) return console.warn(`Hook '${t}' not found.`), () => {
    };
    const n = W({}, i, { id: r.size + 1, hook: t, handler: e });
    return r.set(e, n), () => this.off(t, e);
  }
  before(t, e, i = {}) {
    return this.on(t, e, W({}, i, { before: !0 }));
  }
  replace(t, e, i = {}) {
    return this.on(t, e, W({}, i, { replace: !0 }));
  }
  once(t, e, i = {}) {
    return this.on(t, e, W({}, i, { once: !0 }));
  }
  off(t, e) {
    const i = this.get(t);
    i && e ? i.delete(e) || console.warn(`Handler for hook '${t}' not found.`) : i && i.clear();
  }
  async call(t, e, i, r) {
    const [n, s, a] = this.parseCallArgs(t, e, i, r), { before: l, handler: u, after: h } = this.getHandlers(t, a);
    await this.run(l, n, s);
    const [f] = await this.run(u, n, s, !0);
    return await this.run(h, n, s), this.dispatchDomEvent(t, n, s), f;
  }
  callSync(t, e, i, r) {
    const [n, s, a] = this.parseCallArgs(t, e, i, r), { before: l, handler: u, after: h } = this.getHandlers(t, a);
    this.runSync(l, n, s);
    const [f] = this.runSync(u, n, s, !0);
    return this.runSync(h, n, s), this.dispatchDomEvent(t, n, s), f;
  }
  parseCallArgs(t, e, i, r) {
    return e instanceof ir || typeof e != "object" && typeof i != "function" ? [e, i, r] : [void 0, e, i];
  }
  async run(t, e = this.swup.visit, i, r = !1) {
    const n = [];
    for (const { hook: s, handler: a, defaultHandler: l, once: u } of t) if (e == null || !e.done) {
      u && this.off(s, a);
      try {
        const h = await ln(a, [e, i, l]);
        n.push(h);
      } catch (h) {
        if (r) throw h;
        console.error(`Error in hook '${s}':`, h);
      }
    }
    return n;
  }
  runSync(t, e = this.swup.visit, i, r = !1) {
    const n = [];
    for (const { hook: s, handler: a, defaultHandler: l, once: u } of t) if (e == null || !e.done) {
      u && this.off(s, a);
      try {
        const h = a(e, i, l);
        n.push(h), er(h) && console.warn(`Swup will not await Promises in handler for synchronous hook '${s}'.`);
      } catch (h) {
        if (r) throw h;
        console.error(`Error in hook '${s}':`, h);
      }
    }
    return n;
  }
  getHandlers(t, e) {
    const i = this.get(t);
    if (!i) return { found: !1, before: [], handler: [], after: [], replaced: !1 };
    const r = Array.from(i.values()), n = this.sortRegistrations, s = r.filter(({ before: f, replace: d }) => f && !d).sort(n), a = r.filter(({ replace: f }) => f).filter((f) => !0).sort(n), l = r.filter(({ before: f, replace: d }) => !f && !d).sort(n), u = a.length > 0;
    let h = [];
    if (e && (h = [{ id: 0, hook: t, handler: e }], u)) {
      const f = a.length - 1, { handler: d, once: _ } = a[f], p = (c) => {
        const m = a[c - 1];
        return m ? (g, v) => m.handler(g, v, p(c - 1)) : e;
      };
      h = [{ id: 0, hook: t, once: _, handler: d, defaultHandler: p(f) }];
    }
    return { found: !0, before: s, handler: h, after: l, replaced: u };
  }
  sortRegistrations(t, e) {
    var i, r;
    return ((i = t.priority) != null ? i : 0) - ((r = e.priority) != null ? r : 0) || t.id - e.id || 0;
  }
  dispatchDomEvent(t, e, i) {
    if (e != null && e.done) return;
    const r = { hook: t, args: i, visit: e || this.swup.visit };
    document.dispatchEvent(new CustomEvent("swup:any", { detail: r, bubbles: !0 })), document.dispatchEvent(new CustomEvent(`swup:${t}`, { detail: r, bubbles: !0 }));
  }
  parseName(t) {
    const [e, ...i] = t.split(".");
    return [e, i.reduce((r, n) => W({}, r, { [n]: !0 }), {})];
  }
}
const fn = (o) => {
  if (o && o.charAt(0) === "#" && (o = o.substring(1)), !o) return null;
  const t = decodeURIComponent(o);
  let e = document.getElementById(o) || document.getElementById(t) || je(`a[name='${CSS.escape(o)}']`) || je(`a[name='${CSS.escape(t)}']`);
  return e || o !== "top" || (e = document.body), e;
}, be = "transition", Ne = "animation";
async function dn({ selector: o, elements: t }) {
  if (o === !1 && !t) return;
  let e = [];
  if (t) e = Array.from(t);
  else if (o && (e = hi(o, document.body), !e.length)) return void console.warn(`[swup] No elements found matching animationSelector \`${o}\``);
  const i = e.map((r) => (function(n) {
    const { type: s, timeout: a, propCount: l } = (function(u) {
      const h = window.getComputedStyle(u), f = ke(h, `${be}Delay`), d = ke(h, `${be}Duration`), _ = Ai(f, d), p = ke(h, `${Ne}Delay`), c = ke(h, `${Ne}Duration`), m = Ai(p, c), g = Math.max(_, m), v = g > 0 ? _ > m ? be : Ne : null;
      return { type: v, timeout: g, propCount: v ? v === be ? d.length : c.length : 0 };
    })(n);
    return !(!s || !a) && new Promise((u) => {
      const h = `${s}end`, f = performance.now();
      let d = 0;
      const _ = () => {
        n.removeEventListener(h, p), u();
      }, p = (c) => {
        c.target === n && ((performance.now() - f) / 1e3 < c.elapsedTime || ++d >= l && _());
      };
      setTimeout(() => {
        d < l && _();
      }, a + 1), n.addEventListener(h, p);
    });
  })(r));
  i.filter(Boolean).length > 0 ? await Promise.all(i) : o && console.warn(`[swup] No CSS animation duration defined on elements matching \`${o}\``);
}
function ke(o, t) {
  return (o[t] || "").split(", ");
}
function Ai(o, t) {
  for (; o.length < t.length; ) o = o.concat(o);
  return Math.max(...t.map((e, i) => Di(e) + Di(o[i])));
}
function Di(o) {
  return 1e3 * parseFloat(o);
}
function _n(o, t = {}, e = {}) {
  if (typeof o != "string") throw new Error("swup.navigate() requires a URL parameter");
  if (this.shouldIgnoreVisit(o, { el: e.el, event: e.event })) return void window.location.assign(o);
  const { url: i, hash: r } = Q.fromUrl(o), n = this.createVisit(W({}, e, { to: i, hash: r }));
  this.performNavigation(n, t);
}
async function pn(o, t = {}) {
  if (this.navigating) {
    if (this.visit.state >= 6) return o.state = 2, void (this.onVisitEnd = () => this.performNavigation(o, t));
    await this.hooks.call("visit:abort", this.visit, void 0), delete this.visit.to.document, this.visit.state = 8;
  }
  this.navigating = !0, this.visit = o;
  const { el: e } = o.trigger;
  t.referrer = t.referrer || this.location.url, t.animate === !1 && (o.animation.animate = !1), o.animation.animate || this.classes.clear();
  const i = t.history || Mi(e, "data-swup-history");
  typeof i == "string" && ["push", "replace"].includes(i) && (o.history.action = i);
  const r = t.animation || Mi(e, "data-swup-animation");
  var n, s;
  typeof r == "string" && (o.animation.name = r), o.meta = t.meta || {}, typeof t.cache == "object" ? (o.cache.read = (n = t.cache.read) != null ? n : o.cache.read, o.cache.write = (s = t.cache.write) != null ? s : o.cache.write) : t.cache !== void 0 && (o.cache = { read: !!t.cache, write: !!t.cache }), delete t.cache;
  try {
    await this.hooks.call("visit:start", o, void 0), o.state = 3;
    const a = this.hooks.call("page:load", o, { options: t }, async (u, h) => {
      let f;
      return u.cache.read && (f = this.cache.get(u.to.url)), h.page = f || await this.fetchPage(u.to.url, h.options), h.cache = !!f, h.page;
    });
    a.then(({ html: u }) => {
      o.advance(5), o.to.html = u, o.to.document = new DOMParser().parseFromString(u, "text/html");
    });
    const l = o.to.url + o.to.hash;
    if (o.history.popstate || (o.history.action === "replace" || o.to.url === this.location.url ? ae(l) : (this.currentHistoryIndex++, nn(l, { index: this.currentHistoryIndex }))), this.location = Q.fromUrl(l), o.history.popstate && this.classes.add("is-popstate"), o.animation.name && this.classes.add(`to-${Ji(o.animation.name)}`), o.animation.wait && await a, o.done || (await this.hooks.call("visit:transition", o, void 0, async () => {
      if (!o.animation.animate) return await this.hooks.call("animation:skip", void 0), void await this.renderPage(o, await a);
      o.advance(4), await this.animatePageOut(o), o.animation.native && document.startViewTransition ? await document.startViewTransition(async () => await this.renderPage(o, await a)).finished : await this.renderPage(o, await a), await this.animatePageIn(o);
    }), o.done)) return;
    await this.hooks.call("visit:end", o, void 0, () => this.classes.clear()), o.state = 7, this.navigating = !1, this.onVisitEnd && (this.onVisitEnd(), this.onVisitEnd = void 0);
  } catch (a) {
    if (!a || a != null && a.aborted) return void (o.state = 8);
    o.state = 9, console.error(a), this.options.skipPopStateHandling = () => (window.location.assign(o.to.url + o.to.hash), !0), window.history.back();
  } finally {
    delete o.to.document;
  }
}
const mn = async function(o) {
  await this.hooks.call("animation:out:start", o, void 0, () => {
    this.classes.add("is-changing", "is-animating", "is-leaving");
  }), await this.hooks.call("animation:out:await", o, { skip: !1 }, (t, { skip: e }) => {
    if (!e) return this.awaitAnimations({ selector: t.animation.selector });
  }), await this.hooks.call("animation:out:end", o, void 0);
}, gn = function(o) {
  var t;
  const e = o.to.document;
  if (!e) return !1;
  const i = ((t = e.querySelector("title")) == null ? void 0 : t.innerText) || "";
  document.title = i;
  const r = hi('[data-swup-persist]:not([data-swup-persist=""])'), n = o.containers.map((s) => {
    const a = document.querySelector(s), l = e.querySelector(s);
    return a && l ? (a.replaceWith(l.cloneNode(!0)), !0) : (a || console.warn(`[swup] Container missing in current document: ${s}`), l || console.warn(`[swup] Container missing in incoming document: ${s}`), !1);
  }).filter(Boolean);
  return r.forEach((s) => {
    const a = s.getAttribute("data-swup-persist"), l = je(`[data-swup-persist="${a}"]`);
    l && l !== s && l.replaceWith(s);
  }), n.length === o.containers.length;
}, vn = function(o) {
  const t = { behavior: "auto" }, { target: e, reset: i } = o.scroll, r = e ?? o.to.hash;
  let n = !1;
  return r && (n = this.hooks.callSync("scroll:anchor", o, { hash: r, options: t }, (s, { hash: a, options: l }) => {
    const u = this.getAnchorElement(a);
    return u && u.scrollIntoView(l), !!u;
  })), i && !n && (n = this.hooks.callSync("scroll:top", o, { options: t }, (s, { options: a }) => (window.scrollTo(W({ top: 0, left: 0 }, a)), !0))), n;
}, yn = async function(o) {
  if (o.done) return;
  const t = this.hooks.call("animation:in:await", o, { skip: !1 }, (e, { skip: i }) => {
    if (!i) return this.awaitAnimations({ selector: e.animation.selector });
  });
  await tr(), await this.hooks.call("animation:in:start", o, void 0, () => {
    this.classes.remove("is-animating");
  }), await t, await this.hooks.call("animation:in:end", o, void 0);
}, wn = async function(o, t) {
  if (o.done) return;
  o.advance(6);
  const { url: e } = t;
  this.isSameResolvedUrl(ce(), e) || (ae(e), this.location = Q.fromUrl(e), o.to.url = this.location.url, o.to.hash = this.location.hash), await this.hooks.call("content:replace", o, { page: t }, (i, {}) => {
    if (this.classes.remove("is-leaving"), i.animation.animate && this.classes.add("is-rendering"), !this.replaceContent(i)) throw new Error("[swup] Container mismatch, aborting");
    i.animation.animate && (this.classes.add("is-changing", "is-animating", "is-rendering"), i.animation.name && this.classes.add(`to-${Ji(i.animation.name)}`));
  }), await this.hooks.call("content:scroll", o, void 0, () => this.scrollToContent(o)), await this.hooks.call("page:view", o, { url: this.location.url, title: document.title });
}, xn = function(o) {
  var t;
  if (t = o, !!(t != null && t.isSwupPlugin)) {
    if (o.swup = this, !o._checkRequirements || o._checkRequirements()) return o._beforeMount && o._beforeMount(), o.mount(), this.plugins.push(o), this.plugins;
  } else console.error("Not a swup plugin instance", o);
};
function bn(o) {
  const t = this.findPlugin(o);
  if (t) return t.unmount(), t._afterUnmount && t._afterUnmount(), this.plugins = this.plugins.filter((e) => e !== t), this.plugins;
  console.error("No such plugin", t);
}
function kn(o) {
  return this.plugins.find((t) => t === o || t.name === o || t.name === `Swup${String(o)}`);
}
function Tn(o) {
  if (typeof this.options.resolveUrl != "function") return console.warn("[swup] options.resolveUrl expects a callback function."), o;
  const t = this.options.resolveUrl(o);
  return t && typeof t == "string" ? t.startsWith("//") || t.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), o) : t : (console.warn("[swup] options.resolveUrl needs to return a url"), o);
}
function Sn(o, t) {
  return this.resolveUrl(o) === this.resolveUrl(t);
}
const Pn = { animateHistoryBrowsing: !1, animationSelector: '[class*="transition-"]', animationScope: "html", cache: !0, containers: ["#swup"], hooks: {}, ignoreVisit: (o, { el: t } = {}) => !(t == null || !t.closest("[data-no-swup]")), linkSelector: "a[href]", linkToSelf: "scroll", native: !1, plugins: [], resolveUrl: (o) => o, requestHeaders: { "X-Requested-With": "swup", Accept: "text/html, application/xhtml+xml" }, skipPopStateHandling: (o) => {
  var t;
  return ((t = o.state) == null ? void 0 : t.source) !== "swup";
}, timeout: 0 };
class Cn {
  get currentPageUrl() {
    return this.location.url;
  }
  constructor(t = {}) {
    var e, i;
    this.version = "4.8.3", this.options = void 0, this.defaults = Pn, this.plugins = [], this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, this.location = Q.fromUrl(window.location.href), this.currentHistoryIndex = void 0, this.clickDelegate = void 0, this.navigating = !1, this.onVisitEnd = void 0, this.use = xn, this.unuse = bn, this.findPlugin = kn, this.log = () => {
    }, this.navigate = _n, this.performNavigation = pn, this.createVisit = hn, this.delegateEvent = sn, this.fetchPage = on, this.awaitAnimations = dn, this.renderPage = wn, this.replaceContent = gn, this.animatePageIn = yn, this.animatePageOut = mn, this.scrollToContent = vn, this.getAnchorElement = fn, this.getCurrentUrl = ce, this.resolveUrl = Tn, this.isSameResolvedUrl = Sn, this.options = W({}, this.defaults, t), this.handleLinkClick = this.handleLinkClick.bind(this), this.handlePopState = this.handlePopState.bind(this), this.cache = new an(this), this.classes = new un(this), this.hooks = new cn(this), this.visit = this.createVisit({ to: "" }), this.currentHistoryIndex = (e = (i = window.history.state) == null ? void 0 : i.index) != null ? e : 1, this.enable();
  }
  async enable() {
    var t;
    const { linkSelector: e } = this.options;
    this.clickDelegate = this.delegateEvent(e, "click", this.handleLinkClick), window.addEventListener("popstate", this.handlePopState), this.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), this.options.native = this.options.native && !!document.startViewTransition, this.options.plugins.forEach((i) => this.use(i));
    for (const [i, r] of Object.entries(this.options.hooks)) {
      const [n, s] = this.hooks.parseName(i);
      this.hooks.on(n, r, s);
    }
    ((t = window.history.state) == null ? void 0 : t.source) !== "swup" && ae(null, { index: this.currentHistoryIndex }), await tr(), await this.hooks.call("enable", void 0, void 0, () => {
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
  shouldIgnoreVisit(t, { el: e, event: i } = {}) {
    const { origin: r, url: n, hash: s } = Q.fromUrl(t);
    return r !== window.location.origin || !(!e || !this.triggerWillOpenNewWindow(e)) || !!this.options.ignoreVisit(n + s, { el: e, event: i });
  }
  handleLinkClick(t) {
    const e = t.delegateTarget, { href: i, url: r, hash: n } = Q.fromElement(e);
    if (this.shouldIgnoreVisit(i, { el: e, event: t })) return;
    if (this.navigating && r === this.visit.to.url) return void t.preventDefault();
    const s = this.createVisit({ to: r, hash: n, el: e, event: t });
    t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? this.hooks.callSync("link:newtab", s, { href: i }) : t.button === 0 && this.hooks.callSync("link:click", s, { el: e, event: t }, () => {
      var a;
      const l = (a = s.from.url) != null ? a : "";
      t.preventDefault(), r && r !== l ? this.isSameResolvedUrl(r, l) || this.performNavigation(s) : n ? this.hooks.callSync("link:anchor", s, { hash: n }, () => {
        ae(r + n), this.scrollToContent(s);
      }) : this.hooks.callSync("link:self", s, void 0, () => {
        this.options.linkToSelf === "navigate" ? this.performNavigation(s) : (ae(r), this.scrollToContent(s));
      });
    });
  }
  handlePopState(t) {
    var e, i, r, n;
    const s = (e = (i = t.state) == null ? void 0 : i.url) != null ? e : window.location.href;
    if (this.options.skipPopStateHandling(t) || this.isSameResolvedUrl(ce(), this.location.url)) return;
    const { url: a, hash: l } = Q.fromUrl(s), u = this.createVisit({ to: a, hash: l, event: t });
    u.history.popstate = !0;
    const h = (r = (n = t.state) == null ? void 0 : n.index) != null ? r : 0;
    h && h !== this.currentHistoryIndex && (u.history.direction = h - this.currentHistoryIndex > 0 ? "forwards" : "backwards", this.currentHistoryIndex = h), u.animation.animate = !1, u.scroll.reset = !1, u.scroll.target = !1, this.options.animateHistoryBrowsing && (u.animation.animate = !0, u.scroll.reset = !0), this.hooks.callSync("history:popstate", u, { event: t }, () => {
      this.performNavigation(u);
    });
  }
  triggerWillOpenNewWindow(t) {
    return !!t.matches('[download], [target="_blank"]');
  }
}
function yt(o) {
  if (o === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return o;
}
function rr(o, t) {
  o.prototype = Object.create(t.prototype), o.prototype.constructor = o, o.__proto__ = t;
}
/*!
 * GSAP 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var at = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, fe = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, ci, H, A, ft = 1e8, E = 1 / ft, Ke = Math.PI * 2, On = Ke / 4, En = 0, nr = Math.sqrt, Mn = Math.cos, An = Math.sin, X = function(t) {
  return typeof t == "string";
}, q = function(t) {
  return typeof t == "function";
}, xt = function(t) {
  return typeof t == "number";
}, fi = function(t) {
  return typeof t > "u";
}, gt = function(t) {
  return typeof t == "object";
}, Z = function(t) {
  return t !== !1;
}, di = function() {
  return typeof window < "u";
}, Te = function(t) {
  return q(t) || X(t);
}, sr = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, j = Array.isArray, Dn = /random\([^)]+\)/g, Rn = /,\s*/g, Ri = /(?:-?\.?\d|\.)+/gi, or = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, Yt = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, Ve = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, ar = /[+-]=-?[.\d]+/, Ln = /[^,'"\[\]\s]+/gi, zn = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, R, _t, Qe, _i, lt = {}, Oe = {}, lr, ur = function(t) {
  return (Oe = Kt(t, lt)) && it;
}, pi = function(t, e) {
  return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()");
}, de = function(t, e) {
  return !e && console.warn(t);
}, hr = function(t, e) {
  return t && (lt[t] = e) && Oe && (Oe[t] = e) || lt;
}, _e = function() {
  return 0;
}, Fn = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, Se = {
  suppressEvents: !0,
  kill: !1
}, In = {
  suppressEvents: !0
}, mi = {}, Pt = [], Ze = {}, cr, rt = {}, Be = {}, Li = 30, Pe = [], gi = "", vi = function(t) {
  var e = t[0], i, r;
  if (gt(e) || q(e) || (t = [t]), !(i = (e._gsap || {}).harness)) {
    for (r = Pe.length; r-- && !Pe[r].targetTest(e); )
      ;
    i = Pe[r];
  }
  for (r = t.length; r--; )
    t[r] && (t[r]._gsap || (t[r]._gsap = new Rr(t[r], i))) || t.splice(r, 1);
  return t;
}, qt = function(t) {
  return t._gsap || vi(dt(t))[0]._gsap;
}, fr = function(t, e, i) {
  return (i = t[e]) && q(i) ? t[e]() : fi(i) && t.getAttribute && t.getAttribute(e) || i;
}, J = function(t, e) {
  return (t = t.split(",")).forEach(e) || t;
}, V = function(t) {
  return Math.round(t * 1e5) / 1e5 || 0;
}, D = function(t) {
  return Math.round(t * 1e7) / 1e7 || 0;
}, Ht = function(t, e) {
  var i = e.charAt(0), r = parseFloat(e.substr(2));
  return t = parseFloat(t), i === "+" ? t + r : i === "-" ? t - r : i === "*" ? t * r : t / r;
}, qn = function(t, e) {
  for (var i = e.length, r = 0; t.indexOf(e[r]) < 0 && ++r < i; )
    ;
  return r < i;
}, Ee = function() {
  var t = Pt.length, e = Pt.slice(0), i, r;
  for (Ze = {}, Pt.length = 0, i = 0; i < t; i++)
    r = e[i], r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
}, yi = function(t) {
  return !!(t._initted || t._startAt || t.add);
}, dr = function(t, e, i, r) {
  Pt.length && !H && Ee(), t.render(e, i, !!(H && e < 0 && yi(t))), Pt.length && !H && Ee();
}, _r = function(t) {
  var e = parseFloat(t);
  return (e || e === 0) && (t + "").match(Ln).length < 2 ? e : X(t) ? t.trim() : t;
}, pr = function(t) {
  return t;
}, ut = function(t, e) {
  for (var i in e)
    i in t || (t[i] = e[i]);
  return t;
}, Un = function(t) {
  return function(e, i) {
    for (var r in i)
      r in e || r === "duration" && t || r === "ease" || (e[r] = i[r]);
  };
}, Kt = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, zi = function o(t, e) {
  for (var i in e)
    i !== "__proto__" && i !== "constructor" && i !== "prototype" && (t[i] = gt(e[i]) ? o(t[i] || (t[i] = {}), e[i]) : e[i]);
  return t;
}, Me = function(t, e) {
  var i = {}, r;
  for (r in t)
    r in e || (i[r] = t[r]);
  return i;
}, le = function(t) {
  var e = t.parent || R, i = t.keyframes ? Un(j(t.keyframes)) : ut;
  if (Z(t.inherit))
    for (; e; )
      i(t, e.vars.defaults), e = e.parent || e._dp;
  return t;
}, Nn = function(t, e) {
  for (var i = t.length, r = i === e.length; r && i-- && t[i] === e[i]; )
    ;
  return i < 0;
}, mr = function(t, e, i, r, n) {
  var s = t[r], a;
  if (n)
    for (a = e[n]; s && s[n] > a; )
      s = s._prev;
  return s ? (e._next = s._next, s._next = e) : (e._next = t[i], t[i] = e), e._next ? e._next._prev = e : t[r] = e, e._prev = s, e.parent = e._dp = t, e;
}, ze = function(t, e, i, r) {
  i === void 0 && (i = "_first"), r === void 0 && (r = "_last");
  var n = e._prev, s = e._next;
  n ? n._next = s : t[i] === e && (t[i] = s), s ? s._prev = n : t[r] === e && (t[r] = n), e._next = e._prev = e.parent = null;
}, Ot = function(t, e) {
  t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0;
}, Ut = function(t, e) {
  if (t && (!e || e._end > t._dur || e._start < 0))
    for (var i = t; i; )
      i._dirty = 1, i = i.parent;
  return t;
}, Vn = function(t) {
  for (var e = t.parent; e && e.parent; )
    e._dirty = 1, e.totalDuration(), e = e.parent;
  return t;
}, Je = function(t, e, i, r) {
  return t._startAt && (H ? t._startAt.revert(Se) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, r));
}, Bn = function o(t) {
  return !t || t._ts && o(t.parent);
}, Fi = function(t) {
  return t._repeat ? Qt(t._tTime, t = t.duration() + t._rDelay) * t : 0;
}, Qt = function(t, e) {
  var i = Math.floor(t = D(t / e));
  return t && i === t ? i - 1 : i;
}, Ae = function(t, e) {
  return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur);
}, Fe = function(t) {
  return t._end = D(t._start + (t._tDur / Math.abs(t._ts || t._rts || E) || 0));
}, Ie = function(t, e) {
  var i = t._dp;
  return i && i.smoothChildTiming && t._ts && (t._start = D(i._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), Fe(t), i._dirty || Ut(i, t)), t;
}, gr = function(t, e) {
  var i;
  if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (i = Ae(t.rawTime(), e), (!e._dur || we(0, e.totalDuration(), i) - e._tTime > E) && e.render(i, !0)), Ut(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
    if (t._dur < t.duration())
      for (i = t; i._dp; )
        i.rawTime() >= 0 && i.totalTime(i._tTime), i = i._dp;
    t._zTime = -E;
  }
}, pt = function(t, e, i, r) {
  return e.parent && Ot(e), e._start = D((xt(i) ? i : i || t !== R ? ct(t, i, e) : t._time) + e._delay), e._end = D(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), mr(t, e, "_first", "_last", t._sort ? "_start" : 0), ti(e) || (t._recent = e), r || gr(t, e), t._ts < 0 && Ie(t, t._tTime), t;
}, vr = function(t, e) {
  return (lt.ScrollTrigger || pi("scrollTrigger", e)) && lt.ScrollTrigger.create(e, t);
}, yr = function(t, e, i, r, n) {
  if (xi(t, e, n), !t._initted)
    return 1;
  if (!i && t._pt && !H && (t._dur && t.vars.lazy !== !1 || !t._dur && t.vars.lazy) && cr !== nt.frame)
    return Pt.push(t), t._lazy = [n, r], 1;
}, $n = function o(t) {
  var e = t.parent;
  return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || o(e));
}, ti = function(t) {
  var e = t.data;
  return e === "isFromStart" || e === "isStart";
}, Wn = function(t, e, i, r) {
  var n = t.ratio, s = e < 0 || !e && (!t._start && $n(t) && !(!t._initted && ti(t)) || (t._ts < 0 || t._dp._ts < 0) && !ti(t)) ? 0 : 1, a = t._rDelay, l = 0, u, h, f;
  if (a && t._repeat && (l = we(0, t._tDur, e), h = Qt(l, a), t._yoyo && h & 1 && (s = 1 - s), h !== Qt(t._tTime, a) && (n = 1 - s, t.vars.repeatRefresh && t._initted && t.invalidate())), s !== n || H || r || t._zTime === E || !e && t._zTime) {
    if (!t._initted && yr(t, e, r, i, l))
      return;
    for (f = t._zTime, t._zTime = e || (i ? E : 0), i || (i = e && !f), t.ratio = s, t._from && (s = 1 - s), t._time = 0, t._tTime = l, u = t._pt; u; )
      u.r(s, u.d), u = u._next;
    e < 0 && Je(t, e, i, !0), t._onUpdate && !i && st(t, "onUpdate"), l && t._repeat && !i && t.parent && st(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === s && (s && Ot(t, 1), !i && !H && (st(t, s ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()));
  } else t._zTime || (t._zTime = e);
}, Yn = function(t, e, i) {
  var r;
  if (i > e)
    for (r = t._first; r && r._start <= i; ) {
      if (r.data === "isPause" && r._start > e)
        return r;
      r = r._next;
    }
  else
    for (r = t._last; r && r._start >= i; ) {
      if (r.data === "isPause" && r._start < e)
        return r;
      r = r._prev;
    }
}, Zt = function(t, e, i, r) {
  var n = t._repeat, s = D(e) || 0, a = t._tTime / t._tDur;
  return a && !r && (t._time *= s / t._dur), t._dur = s, t._tDur = n ? n < 0 ? 1e10 : D(s * (n + 1) + t._rDelay * n) : s, a > 0 && !r && Ie(t, t._tTime = t._tDur * a), t.parent && Fe(t), i || Ut(t.parent, t), t;
}, Ii = function(t) {
  return t instanceof K ? Ut(t) : Zt(t, t._dur);
}, Xn = {
  _start: 0,
  endTime: _e,
  totalDuration: _e
}, ct = function o(t, e, i) {
  var r = t.labels, n = t._recent || Xn, s = t.duration() >= ft ? n.endTime(!1) : t._dur, a, l, u;
  return X(e) && (isNaN(e) || e in r) ? (l = e.charAt(0), u = e.substr(-1) === "%", a = e.indexOf("="), l === "<" || l === ">" ? (a >= 0 && (e = e.replace(/=/, "")), (l === "<" ? n._start : n.endTime(n._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (u ? (a < 0 ? n : i).totalDuration() / 100 : 1)) : a < 0 ? (e in r || (r[e] = s), r[e]) : (l = parseFloat(e.charAt(a - 1) + e.substr(a + 1)), u && i && (l = l / 100 * (j(i) ? i[0] : i).totalDuration()), a > 1 ? o(t, e.substr(0, a - 1), i) + l : s + l)) : e == null ? s : +e;
}, ue = function(t, e, i) {
  var r = xt(e[1]), n = (r ? 2 : 1) + (t < 2 ? 0 : 1), s = e[n], a, l;
  if (r && (s.duration = e[1]), s.parent = i, t) {
    for (a = s, l = i; l && !("immediateRender" in a); )
      a = l.vars.defaults || {}, l = Z(l.vars.inherit) && l.parent;
    s.immediateRender = Z(a.immediateRender), t < 2 ? s.runBackwards = 1 : s.startAt = e[n - 1];
  }
  return new B(e[0], s, e[n + 1]);
}, At = function(t, e) {
  return t || t === 0 ? e(t) : e;
}, we = function(t, e, i) {
  return i < t ? t : i > e ? e : i;
}, G = function(t, e) {
  return !X(t) || !(e = zn.exec(t)) ? "" : e[1];
}, Hn = function(t, e, i) {
  return At(i, function(r) {
    return we(t, e, r);
  });
}, ei = [].slice, wr = function(t, e) {
  return t && gt(t) && "length" in t && (!e && !t.length || t.length - 1 in t && gt(t[0])) && !t.nodeType && t !== _t;
}, Gn = function(t, e, i) {
  return i === void 0 && (i = []), t.forEach(function(r) {
    var n;
    return X(r) && !e || wr(r, 1) ? (n = i).push.apply(n, dt(r)) : i.push(r);
  }) || i;
}, dt = function(t, e, i) {
  return A && !e && A.selector ? A.selector(t) : X(t) && !i && (Qe || !Jt()) ? ei.call((e || _i).querySelectorAll(t), 0) : j(t) ? Gn(t, i) : wr(t) ? ei.call(t, 0) : t ? [t] : [];
}, ii = function(t) {
  return t = dt(t)[0] || de("Invalid scope") || {}, function(e) {
    var i = t.current || t.nativeElement || t;
    return dt(e, i.querySelectorAll ? i : i === t ? de("Invalid scope") || _i.createElement("div") : t);
  };
}, xr = function(t) {
  return t.sort(function() {
    return 0.5 - Math.random();
  });
}, br = function(t) {
  if (q(t))
    return t;
  var e = gt(t) ? t : {
    each: t
  }, i = Nt(e.ease), r = e.from || 0, n = parseFloat(e.base) || 0, s = {}, a = r > 0 && r < 1, l = isNaN(r) || a, u = e.axis, h = r, f = r;
  return X(r) ? h = f = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[r] || 0 : !a && l && (h = r[0], f = r[1]), function(d, _, p) {
    var c = (p || e).length, m = s[c], g, v, w, x, y, S, b, T, k;
    if (!m) {
      if (k = e.grid === "auto" ? 0 : (e.grid || [1, ft])[1], !k) {
        for (b = -ft; b < (b = p[k++].getBoundingClientRect().left) && k < c; )
          ;
        k < c && k--;
      }
      for (m = s[c] = [], g = l ? Math.min(k, c) * h - 0.5 : r % k, v = k === ft ? 0 : l ? c * f / k - 0.5 : r / k | 0, b = 0, T = ft, S = 0; S < c; S++)
        w = S % k - g, x = v - (S / k | 0), m[S] = y = u ? Math.abs(u === "y" ? x : w) : nr(w * w + x * x), y > b && (b = y), y < T && (T = y);
      r === "random" && xr(m), m.max = b - T, m.min = T, m.v = c = (parseFloat(e.amount) || parseFloat(e.each) * (k > c ? c - 1 : u ? u === "y" ? c / k : k : Math.max(k, c / k)) || 0) * (r === "edges" ? -1 : 1), m.b = c < 0 ? n - c : n, m.u = G(e.amount || e.each) || 0, i = i && c < 0 ? as(i) : i;
    }
    return c = (m[d] - m.min) / m.max || 0, D(m.b + (i ? i(c) : c) * m.v) + m.u;
  };
}, ri = function(t) {
  var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
  return function(i) {
    var r = D(Math.round(parseFloat(i) / t) * t * e);
    return (r - r % 1) / e + (xt(i) ? 0 : G(i));
  };
}, kr = function(t, e) {
  var i = j(t), r, n;
  return !i && gt(t) && (r = i = t.radius || ft, t.values ? (t = dt(t.values), (n = !xt(t[0])) && (r *= r)) : t = ri(t.increment)), At(e, i ? q(t) ? function(s) {
    return n = t(s), Math.abs(n - s) <= r ? n : s;
  } : function(s) {
    for (var a = parseFloat(n ? s.x : s), l = parseFloat(n ? s.y : 0), u = ft, h = 0, f = t.length, d, _; f--; )
      n ? (d = t[f].x - a, _ = t[f].y - l, d = d * d + _ * _) : d = Math.abs(t[f] - a), d < u && (u = d, h = f);
    return h = !r || u <= r ? t[h] : s, n || h === s || xt(s) ? h : h + G(s);
  } : ri(t));
}, Tr = function(t, e, i, r) {
  return At(j(t) ? !e : i === !0 ? !!(i = 0) : !r, function() {
    return j(t) ? t[~~(Math.random() * t.length)] : (i = i || 1e-5) && (r = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) && Math.floor(Math.round((t - i / 2 + Math.random() * (e - t + i * 0.99)) / i) * i * r) / r;
  });
}, jn = function() {
  for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
    e[i] = arguments[i];
  return function(r) {
    return e.reduce(function(n, s) {
      return s(n);
    }, r);
  };
}, Kn = function(t, e) {
  return function(i) {
    return t(parseFloat(i)) + (e || G(i));
  };
}, Qn = function(t, e, i) {
  return Pr(t, e, 0, 1, i);
}, Sr = function(t, e, i) {
  return At(i, function(r) {
    return t[~~e(r)];
  });
}, Zn = function o(t, e, i) {
  var r = e - t;
  return j(t) ? Sr(t, o(0, t.length), e) : At(i, function(n) {
    return (r + (n - t) % r) % r + t;
  });
}, Jn = function o(t, e, i) {
  var r = e - t, n = r * 2;
  return j(t) ? Sr(t, o(0, t.length - 1), e) : At(i, function(s) {
    return s = (n + (s - t) % n) % n || 0, t + (s > r ? n - s : s);
  });
}, pe = function(t) {
  return t.replace(Dn, function(e) {
    var i = e.indexOf("[") + 1, r = e.substring(i || 7, i ? e.indexOf("]") : e.length - 1).split(Rn);
    return Tr(i ? r : +r[0], i ? 0 : +r[1], +r[2] || 1e-5);
  });
}, Pr = function(t, e, i, r, n) {
  var s = e - t, a = r - i;
  return At(n, function(l) {
    return i + ((l - t) / s * a || 0);
  });
}, ts = function o(t, e, i, r) {
  var n = isNaN(t + e) ? 0 : function(_) {
    return (1 - _) * t + _ * e;
  };
  if (!n) {
    var s = X(t), a = {}, l, u, h, f, d;
    if (i === !0 && (r = 1) && (i = null), s)
      t = {
        p: t
      }, e = {
        p: e
      };
    else if (j(t) && !j(e)) {
      for (h = [], f = t.length, d = f - 2, u = 1; u < f; u++)
        h.push(o(t[u - 1], t[u]));
      f--, n = function(p) {
        p *= f;
        var c = Math.min(d, ~~p);
        return h[c](p - c);
      }, i = e;
    } else r || (t = Kt(j(t) ? [] : {}, t));
    if (!h) {
      for (l in e)
        wi.call(a, t, l, "get", e[l]);
      n = function(p) {
        return Ti(p, a) || (s ? t.p : t);
      };
    }
  }
  return At(i, n);
}, qi = function(t, e, i) {
  var r = t.labels, n = ft, s, a, l;
  for (s in r)
    a = r[s] - e, a < 0 == !!i && a && n > (a = Math.abs(a)) && (l = s, n = a);
  return l;
}, st = function(t, e, i) {
  var r = t.vars, n = r[e], s = A, a = t._ctx, l, u, h;
  if (n)
    return l = r[e + "Params"], u = r.callbackScope || t, i && Pt.length && Ee(), a && (A = a), h = l ? n.apply(u, l) : n.call(u), A = s, h;
}, ne = function(t) {
  return Ot(t), t.scrollTrigger && t.scrollTrigger.kill(!!H), t.progress() < 1 && st(t, "onInterrupt"), t;
}, Xt, Cr = [], Or = function(t) {
  if (t)
    if (t = !t.name && t.default || t, di() || t.headless) {
      var e = t.name, i = q(t), r = e && !i && t.init ? function() {
        this._props = [];
      } : t, n = {
        init: _e,
        render: Ti,
        add: wi,
        kill: gs,
        modifier: ms,
        rawVars: 0
      }, s = {
        targetTest: 0,
        get: 0,
        getSetter: ki,
        aliases: {},
        register: 0
      };
      if (Jt(), t !== r) {
        if (rt[e])
          return;
        ut(r, ut(Me(t, n), s)), Kt(r.prototype, Kt(n, Me(t, s))), rt[r.prop = e] = r, t.targetTest && (Pe.push(r), mi[e] = 1), e = (e === "css" ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin";
      }
      hr(e, r), t.register && t.register(it, r, tt);
    } else
      Cr.push(t);
}, O = 255, se = {
  aqua: [0, O, O],
  lime: [0, O, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, O],
  navy: [0, 0, 128],
  white: [O, O, O],
  olive: [128, 128, 0],
  yellow: [O, O, 0],
  orange: [O, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [O, 0, 0],
  pink: [O, 192, 203],
  cyan: [0, O, O],
  transparent: [O, O, O, 0]
}, $e = function(t, e, i) {
  return t += t < 0 ? 1 : t > 1 ? -1 : 0, (t * 6 < 1 ? e + (i - e) * t * 6 : t < 0.5 ? i : t * 3 < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) * O + 0.5 | 0;
}, Er = function(t, e, i) {
  var r = t ? xt(t) ? [t >> 16, t >> 8 & O, t & O] : 0 : se.black, n, s, a, l, u, h, f, d, _, p;
  if (!r) {
    if (t.substr(-1) === "," && (t = t.substr(0, t.length - 1)), se[t])
      r = se[t];
    else if (t.charAt(0) === "#") {
      if (t.length < 6 && (n = t.charAt(1), s = t.charAt(2), a = t.charAt(3), t = "#" + n + n + s + s + a + a + (t.length === 5 ? t.charAt(4) + t.charAt(4) : "")), t.length === 9)
        return r = parseInt(t.substr(1, 6), 16), [r >> 16, r >> 8 & O, r & O, parseInt(t.substr(7), 16) / 255];
      t = parseInt(t.substr(1), 16), r = [t >> 16, t >> 8 & O, t & O];
    } else if (t.substr(0, 3) === "hsl") {
      if (r = p = t.match(Ri), !e)
        l = +r[0] % 360 / 360, u = +r[1] / 100, h = +r[2] / 100, s = h <= 0.5 ? h * (u + 1) : h + u - h * u, n = h * 2 - s, r.length > 3 && (r[3] *= 1), r[0] = $e(l + 1 / 3, n, s), r[1] = $e(l, n, s), r[2] = $e(l - 1 / 3, n, s);
      else if (~t.indexOf("="))
        return r = t.match(or), i && r.length < 4 && (r[3] = 1), r;
    } else
      r = t.match(Ri) || se.transparent;
    r = r.map(Number);
  }
  return e && !p && (n = r[0] / O, s = r[1] / O, a = r[2] / O, f = Math.max(n, s, a), d = Math.min(n, s, a), h = (f + d) / 2, f === d ? l = u = 0 : (_ = f - d, u = h > 0.5 ? _ / (2 - f - d) : _ / (f + d), l = f === n ? (s - a) / _ + (s < a ? 6 : 0) : f === s ? (a - n) / _ + 2 : (n - s) / _ + 4, l *= 60), r[0] = ~~(l + 0.5), r[1] = ~~(u * 100 + 0.5), r[2] = ~~(h * 100 + 0.5)), i && r.length < 4 && (r[3] = 1), r;
}, Mr = function(t) {
  var e = [], i = [], r = -1;
  return t.split(Ct).forEach(function(n) {
    var s = n.match(Yt) || [];
    e.push.apply(e, s), i.push(r += s.length + 1);
  }), e.c = i, e;
}, Ui = function(t, e, i) {
  var r = "", n = (t + r).match(Ct), s = e ? "hsla(" : "rgba(", a = 0, l, u, h, f;
  if (!n)
    return t;
  if (n = n.map(function(d) {
    return (d = Er(d, e, 1)) && s + (e ? d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : d.join(",")) + ")";
  }), i && (h = Mr(t), l = i.c, l.join(r) !== h.c.join(r)))
    for (u = t.replace(Ct, "1").split(Yt), f = u.length - 1; a < f; a++)
      r += u[a] + (~l.indexOf(a) ? n.shift() || s + "0,0,0,0)" : (h.length ? h : n.length ? n : i).shift());
  if (!u)
    for (u = t.split(Ct), f = u.length - 1; a < f; a++)
      r += u[a] + n[a];
  return r + u[f];
}, Ct = (function() {
  var o = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
  for (t in se)
    o += "|" + t + "\\b";
  return new RegExp(o + ")", "gi");
})(), es = /hsl[a]?\(/, Ar = function(t) {
  var e = t.join(" "), i;
  if (Ct.lastIndex = 0, Ct.test(e))
    return i = es.test(e), t[1] = Ui(t[1], i), t[0] = Ui(t[0], i, Mr(t[1])), !0;
}, me, nt = (function() {
  var o = Date.now, t = 500, e = 33, i = o(), r = i, n = 1e3 / 240, s = n, a = [], l, u, h, f, d, _, p = function c(m) {
    var g = o() - r, v = m === !0, w, x, y, S;
    if ((g > t || g < 0) && (i += g - e), r += g, y = r - i, w = y - s, (w > 0 || v) && (S = ++f.frame, d = y - f.time * 1e3, f.time = y = y / 1e3, s += w + (w >= n ? 4 : n - w), x = 1), v || (l = u(c)), x)
      for (_ = 0; _ < a.length; _++)
        a[_](y, d, S, m);
  };
  return f = {
    time: 0,
    frame: 0,
    tick: function() {
      p(!0);
    },
    deltaRatio: function(m) {
      return d / (1e3 / (m || 60));
    },
    wake: function() {
      lr && (!Qe && di() && (_t = Qe = window, _i = _t.document || {}, lt.gsap = it, (_t.gsapVersions || (_t.gsapVersions = [])).push(it.version), ur(Oe || _t.GreenSockGlobals || !_t.gsap && _t || {}), Cr.forEach(Or)), h = typeof requestAnimationFrame < "u" && requestAnimationFrame, l && f.sleep(), u = h || function(m) {
        return setTimeout(m, s - f.time * 1e3 + 1 | 0);
      }, me = 1, p(2));
    },
    sleep: function() {
      (h ? cancelAnimationFrame : clearTimeout)(l), me = 0, u = _e;
    },
    lagSmoothing: function(m, g) {
      t = m || 1 / 0, e = Math.min(g || 33, t);
    },
    fps: function(m) {
      n = 1e3 / (m || 240), s = f.time * 1e3 + n;
    },
    add: function(m, g, v) {
      var w = g ? function(x, y, S, b) {
        m(x, y, S, b), f.remove(w);
      } : m;
      return f.remove(m), a[v ? "unshift" : "push"](w), Jt(), w;
    },
    remove: function(m, g) {
      ~(g = a.indexOf(m)) && a.splice(g, 1) && _ >= g && _--;
    },
    _listeners: a
  }, f;
})(), Jt = function() {
  return !me && nt.wake();
}, C = {}, is = /^[\d.\-M][\d.\-,\s]/, rs = /["']/g, ns = function(t) {
  for (var e = {}, i = t.substr(1, t.length - 3).split(":"), r = i[0], n = 1, s = i.length, a, l, u; n < s; n++)
    l = i[n], a = n !== s - 1 ? l.lastIndexOf(",") : l.length, u = l.substr(0, a), e[r] = isNaN(u) ? u.replace(rs, "").trim() : +u, r = l.substr(a + 1).trim();
  return e;
}, ss = function(t) {
  var e = t.indexOf("(") + 1, i = t.indexOf(")"), r = t.indexOf("(", e);
  return t.substring(e, ~r && r < i ? t.indexOf(")", i + 1) : i);
}, os = function(t) {
  var e = (t + "").split("("), i = C[e[0]];
  return i && e.length > 1 && i.config ? i.config.apply(null, ~t.indexOf("{") ? [ns(e[1])] : ss(t).split(",").map(_r)) : C._CE && is.test(t) ? C._CE("", t) : i;
}, as = function(t) {
  return function(e) {
    return 1 - t(1 - e);
  };
}, Nt = function(t, e) {
  return t && (q(t) ? t : C[t] || os(t)) || e;
}, Bt = function(t, e, i, r) {
  i === void 0 && (i = function(l) {
    return 1 - e(1 - l);
  }), r === void 0 && (r = function(l) {
    return l < 0.5 ? e(l * 2) / 2 : 1 - e((1 - l) * 2) / 2;
  });
  var n = {
    easeIn: e,
    easeOut: i,
    easeInOut: r
  }, s;
  return J(t, function(a) {
    C[a] = lt[a] = n, C[s = a.toLowerCase()] = i;
    for (var l in n)
      C[s + (l === "easeIn" ? ".in" : l === "easeOut" ? ".out" : ".inOut")] = C[a + "." + l] = n[l];
  }), n;
}, Dr = function(t) {
  return function(e) {
    return e < 0.5 ? (1 - t(1 - e * 2)) / 2 : 0.5 + t((e - 0.5) * 2) / 2;
  };
}, We = function o(t, e, i) {
  var r = e >= 1 ? e : 1, n = (i || (t ? 0.3 : 0.45)) / (e < 1 ? e : 1), s = n / Ke * (Math.asin(1 / r) || 0), a = function(h) {
    return h === 1 ? 1 : r * Math.pow(2, -10 * h) * An((h - s) * n) + 1;
  }, l = t === "out" ? a : t === "in" ? function(u) {
    return 1 - a(1 - u);
  } : Dr(a);
  return n = Ke / n, l.config = function(u, h) {
    return o(t, u, h);
  }, l;
}, Ye = function o(t, e) {
  e === void 0 && (e = 1.70158);
  var i = function(s) {
    return s ? --s * s * ((e + 1) * s + e) + 1 : 0;
  }, r = t === "out" ? i : t === "in" ? function(n) {
    return 1 - i(1 - n);
  } : Dr(i);
  return r.config = function(n) {
    return o(t, n);
  }, r;
};
J("Linear,Quad,Cubic,Quart,Quint,Strong", function(o, t) {
  var e = t < 5 ? t + 1 : t;
  Bt(o + ",Power" + (e - 1), t ? function(i) {
    return Math.pow(i, e);
  } : function(i) {
    return i;
  }, function(i) {
    return 1 - Math.pow(1 - i, e);
  }, function(i) {
    return i < 0.5 ? Math.pow(i * 2, e) / 2 : 1 - Math.pow((1 - i) * 2, e) / 2;
  });
});
C.Linear.easeNone = C.none = C.Linear.easeIn;
Bt("Elastic", We("in"), We("out"), We());
(function(o, t) {
  var e = 1 / t, i = 2 * e, r = 2.5 * e, n = function(a) {
    return a < e ? o * a * a : a < i ? o * Math.pow(a - 1.5 / t, 2) + 0.75 : a < r ? o * (a -= 2.25 / t) * a + 0.9375 : o * Math.pow(a - 2.625 / t, 2) + 0.984375;
  };
  Bt("Bounce", function(s) {
    return 1 - n(1 - s);
  }, n);
})(7.5625, 2.75);
Bt("Expo", function(o) {
  return Math.pow(2, 10 * (o - 1)) * o + o * o * o * o * o * o * (1 - o);
});
Bt("Circ", function(o) {
  return -(nr(1 - o * o) - 1);
});
Bt("Sine", function(o) {
  return o === 1 ? 1 : -Mn(o * On) + 1;
});
Bt("Back", Ye("in"), Ye("out"), Ye());
C.SteppedEase = C.steps = lt.SteppedEase = {
  config: function(t, e) {
    t === void 0 && (t = 1);
    var i = 1 / t, r = t + (e ? 0 : 1), n = e ? 1 : 0, s = 1 - E;
    return function(a) {
      return ((r * we(0, s, a) | 0) + n) * i;
    };
  }
};
fe.ease = C["quad.out"];
J("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(o) {
  return gi += o + "," + o + "Params,";
});
var Rr = function(t, e) {
  this.id = En++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : fr, this.set = e ? e.getSetter : ki;
}, ge = /* @__PURE__ */ (function() {
  function o(e) {
    this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, Zt(this, +e.duration, 1, 1), this.data = e.data, A && (this._ctx = A, A.data.push(this)), me || nt.wake();
  }
  var t = o.prototype;
  return t.delay = function(i) {
    return i || i === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + i - this._delay), this._delay = i, this) : this._delay;
  }, t.duration = function(i) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? i + (i + this._rDelay) * this._repeat : i) : this.totalDuration() && this._dur;
  }, t.totalDuration = function(i) {
    return arguments.length ? (this._dirty = 0, Zt(this, this._repeat < 0 ? i : (i - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, t.totalTime = function(i, r) {
    if (Jt(), !arguments.length)
      return this._tTime;
    var n = this._dp;
    if (n && n.smoothChildTiming && this._ts) {
      for (Ie(this, i), !n._dp || n.parent || gr(n, this); n && n.parent; )
        n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && i < this._tDur || this._ts < 0 && i > 0 || !this._tDur && !i) && pt(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== i || !this._dur && !r || this._initted && Math.abs(this._zTime) === E || !this._initted && this._dur && i || !i && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = i), dr(this, i, r)), this;
  }, t.time = function(i, r) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), i + Fi(this)) % (this._dur + this._rDelay) || (i ? this._dur : 0), r) : this._time;
  }, t.totalProgress = function(i, r) {
    return arguments.length ? this.totalTime(this.totalDuration() * i, r) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  }, t.progress = function(i, r) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - i : i) + Fi(this), r) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, t.iteration = function(i, r) {
    var n = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (i - 1) * n, r) : this._repeat ? Qt(this._tTime, n) + 1 : 1;
  }, t.timeScale = function(i, r) {
    if (!arguments.length)
      return this._rts === -E ? 0 : this._rts;
    if (this._rts === i)
      return this;
    var n = this.parent && this._ts ? Ae(this.parent._time, this) : this._tTime;
    return this._rts = +i || 0, this._ts = this._ps || i === -E ? 0 : this._rts, this.totalTime(we(-Math.abs(this._delay), this.totalDuration(), n), r !== !1), Fe(this), Vn(this);
  }, t.paused = function(i) {
    return arguments.length ? (this._ps !== i && (this._ps = i, i ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Jt(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== E && (this._tTime -= E)))), this) : this._ps;
  }, t.startTime = function(i) {
    if (arguments.length) {
      this._start = D(i);
      var r = this.parent || this._dp;
      return r && (r._sort || !this.parent) && pt(r, this, this._start - this._delay), this;
    }
    return this._start;
  }, t.endTime = function(i) {
    return this._start + (Z(i) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, t.rawTime = function(i) {
    var r = this.parent || this._dp;
    return r ? i && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Ae(r.rawTime(i), this) : this._tTime : this._tTime;
  }, t.revert = function(i) {
    i === void 0 && (i = In);
    var r = H;
    return H = i, yi(this) && (this.timeline && this.timeline.revert(i), this.totalTime(-0.01, i.suppressEvents)), this.data !== "nested" && i.kill !== !1 && this.kill(), H = r, this;
  }, t.globalTime = function(i) {
    for (var r = this, n = arguments.length ? i : r.rawTime(); r; )
      n = r._start + n / (Math.abs(r._ts) || 1), r = r._dp;
    return !this.parent && this._sat ? this._sat.globalTime(i) : n;
  }, t.repeat = function(i) {
    return arguments.length ? (this._repeat = i === 1 / 0 ? -2 : i, Ii(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, t.repeatDelay = function(i) {
    if (arguments.length) {
      var r = this._time;
      return this._rDelay = i, Ii(this), r ? this.time(r) : this;
    }
    return this._rDelay;
  }, t.yoyo = function(i) {
    return arguments.length ? (this._yoyo = i, this) : this._yoyo;
  }, t.seek = function(i, r) {
    return this.totalTime(ct(this, i), Z(r));
  }, t.restart = function(i, r) {
    return this.play().totalTime(i ? -this._delay : 0, Z(r)), this._dur || (this._zTime = -E), this;
  }, t.play = function(i, r) {
    return i != null && this.seek(i, r), this.reversed(!1).paused(!1);
  }, t.reverse = function(i, r) {
    return i != null && this.seek(i || this.totalDuration(), r), this.reversed(!0).paused(!1);
  }, t.pause = function(i, r) {
    return i != null && this.seek(i, r), this.paused(!0);
  }, t.resume = function() {
    return this.paused(!1);
  }, t.reversed = function(i) {
    return arguments.length ? (!!i !== this.reversed() && this.timeScale(-this._rts || (i ? -E : 0)), this) : this._rts < 0;
  }, t.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -E, this;
  }, t.isActive = function() {
    var i = this.parent || this._dp, r = this._start, n;
    return !!(!i || this._ts && this._initted && i.isActive() && (n = i.rawTime(!0)) >= r && n < this.endTime(!0) - E);
  }, t.eventCallback = function(i, r, n) {
    var s = this.vars;
    return arguments.length > 1 ? (r ? (s[i] = r, n && (s[i + "Params"] = n), i === "onUpdate" && (this._onUpdate = r)) : delete s[i], this) : s[i];
  }, t.then = function(i) {
    var r = this, n = r._prom;
    return new Promise(function(s) {
      var a = q(i) ? i : pr, l = function() {
        var h = r.then;
        r.then = null, n && n(), q(a) && (a = a(r)) && (a.then || a === r) && (r.then = h), s(a), r.then = h;
      };
      r._initted && r.totalProgress() === 1 && r._ts >= 0 || !r._tTime && r._ts < 0 ? l() : r._prom = l;
    });
  }, t.kill = function() {
    ne(this);
  }, o;
})();
ut(ge.prototype, {
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
  _zTime: -E,
  _prom: 0,
  _ps: !1,
  _rts: 1
});
var K = /* @__PURE__ */ (function(o) {
  rr(t, o);
  function t(i, r) {
    var n;
    return i === void 0 && (i = {}), n = o.call(this, i) || this, n.labels = {}, n.smoothChildTiming = !!i.smoothChildTiming, n.autoRemoveChildren = !!i.autoRemoveChildren, n._sort = Z(i.sortChildren), R && pt(i.parent || R, yt(n), r), i.reversed && n.reverse(), i.paused && n.paused(!0), i.scrollTrigger && vr(yt(n), i.scrollTrigger), n;
  }
  var e = t.prototype;
  return e.to = function(r, n, s) {
    return ue(0, arguments, this), this;
  }, e.from = function(r, n, s) {
    return ue(1, arguments, this), this;
  }, e.fromTo = function(r, n, s, a) {
    return ue(2, arguments, this), this;
  }, e.set = function(r, n, s) {
    return n.duration = 0, n.parent = this, le(n).repeatDelay || (n.repeat = 0), n.immediateRender = !!n.immediateRender, new B(r, n, ct(this, s), 1), this;
  }, e.call = function(r, n, s) {
    return pt(this, B.delayedCall(0, r, n), s);
  }, e.staggerTo = function(r, n, s, a, l, u, h) {
    return s.duration = n, s.stagger = s.stagger || a, s.onComplete = u, s.onCompleteParams = h, s.parent = this, new B(r, s, ct(this, l)), this;
  }, e.staggerFrom = function(r, n, s, a, l, u, h) {
    return s.runBackwards = 1, le(s).immediateRender = Z(s.immediateRender), this.staggerTo(r, n, s, a, l, u, h);
  }, e.staggerFromTo = function(r, n, s, a, l, u, h, f) {
    return a.startAt = s, le(a).immediateRender = Z(a.immediateRender), this.staggerTo(r, n, a, l, u, h, f);
  }, e.render = function(r, n, s) {
    var a = this._time, l = this._dirty ? this.totalDuration() : this._tDur, u = this._dur, h = r <= 0 ? 0 : D(r), f = this._zTime < 0 != r < 0 && (this._initted || !u), d, _, p, c, m, g, v, w, x, y, S, b;
    if (this !== R && h > l && r >= 0 && (h = l), h !== this._tTime || s || f) {
      if (a !== this._time && u && (h += this._time - a, r += this._time - a), d = h, x = this._start, w = this._ts, g = !w, f && (u || (a = this._zTime), (r || !n) && (this._zTime = r)), this._repeat) {
        if (S = this._yoyo, m = u + this._rDelay, this._repeat < -1 && r < 0)
          return this.totalTime(m * 100 + r, n, s);
        if (d = D(h % m), h === l ? (c = this._repeat, d = u) : (y = D(h / m), c = ~~y, c && c === y && (d = u, c--), d > u && (d = u)), y = Qt(this._tTime, m), !a && this._tTime && y !== c && this._tTime - y * m - this._dur <= 0 && (y = c), S && c & 1 && (d = u - d, b = 1), c !== y && !this._lock) {
          var T = S && y & 1, k = T === (S && c & 1);
          if (c < y && (T = !T), a = T ? 0 : h % u ? u : h, this._lock = 1, this.render(a || (b ? 0 : D(c * m)), n, !u)._lock = 0, this._tTime = h, !n && this.parent && st(this, "onRepeat"), this.vars.repeatRefresh && !b && (this.invalidate()._lock = 1, y = c), a && a !== this._time || g !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (u = this._dur, l = this._tDur, k && (this._lock = 2, a = T ? u : -1e-4, this.render(a, !0), this.vars.repeatRefresh && !b && this.invalidate()), this._lock = 0, !this._ts && !g)
            return this;
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (v = Yn(this, D(a), D(d)), v && (h -= d - (d = v._start))), this._tTime = h, this._time = d, this._act = !!w, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = r, a = 0), !a && h && u && !n && !y && (st(this, "onStart"), this._tTime !== h))
        return this;
      if (d >= a && r >= 0)
        for (_ = this._first; _; ) {
          if (p = _._next, (_._act || d >= _._start) && _._ts && v !== _) {
            if (_.parent !== this)
              return this.render(r, n, s);
            if (_.render(_._ts > 0 ? (d - _._start) * _._ts : (_._dirty ? _.totalDuration() : _._tDur) + (d - _._start) * _._ts, n, s), d !== this._time || !this._ts && !g) {
              v = 0, p && (h += this._zTime = -E);
              break;
            }
          }
          _ = p;
        }
      else {
        _ = this._last;
        for (var P = r < 0 ? r : d; _; ) {
          if (p = _._prev, (_._act || P <= _._end) && _._ts && v !== _) {
            if (_.parent !== this)
              return this.render(r, n, s);
            if (_.render(_._ts > 0 ? (P - _._start) * _._ts : (_._dirty ? _.totalDuration() : _._tDur) + (P - _._start) * _._ts, n, s || H && yi(_)), d !== this._time || !this._ts && !g) {
              v = 0, p && (h += this._zTime = P ? -E : E);
              break;
            }
          }
          _ = p;
        }
      }
      if (v && !n && (this.pause(), v.render(d >= a ? 0 : -E)._zTime = d >= a ? 1 : -1, this._ts))
        return this._start = x, Fe(this), this.render(r, n, s);
      this._onUpdate && !n && st(this, "onUpdate", !0), (h === l && this._tTime >= this.totalDuration() || !h && a) && (x === this._start || Math.abs(w) !== Math.abs(this._ts)) && (this._lock || ((r || !u) && (h === l && this._ts > 0 || !h && this._ts < 0) && Ot(this, 1), !n && !(r < 0 && !a) && (h || a || !l) && (st(this, h === l && r >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(h < l && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, e.add = function(r, n) {
    var s = this;
    if (xt(n) || (n = ct(this, n, r)), !(r instanceof ge)) {
      if (j(r))
        return r.forEach(function(a) {
          return s.add(a, n);
        }), this;
      if (X(r))
        return this.addLabel(r, n);
      if (q(r))
        r = B.delayedCall(0, r);
      else
        return this;
    }
    return this !== r ? pt(this, r, n) : this;
  }, e.getChildren = function(r, n, s, a) {
    r === void 0 && (r = !0), n === void 0 && (n = !0), s === void 0 && (s = !0), a === void 0 && (a = -ft);
    for (var l = [], u = this._first; u; )
      u._start >= a && (u instanceof B ? n && l.push(u) : (s && l.push(u), r && l.push.apply(l, u.getChildren(!0, n, s)))), u = u._next;
    return l;
  }, e.getById = function(r) {
    for (var n = this.getChildren(1, 1, 1), s = n.length; s--; )
      if (n[s].vars.id === r)
        return n[s];
  }, e.remove = function(r) {
    return X(r) ? this.removeLabel(r) : q(r) ? this.killTweensOf(r) : (r.parent === this && ze(this, r), r === this._recent && (this._recent = this._last), Ut(this));
  }, e.totalTime = function(r, n) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = D(nt.time - (this._ts > 0 ? r / this._ts : (this.totalDuration() - r) / -this._ts))), o.prototype.totalTime.call(this, r, n), this._forcing = 0, this) : this._tTime;
  }, e.addLabel = function(r, n) {
    return this.labels[r] = ct(this, n), this;
  }, e.removeLabel = function(r) {
    return delete this.labels[r], this;
  }, e.addPause = function(r, n, s) {
    var a = B.delayedCall(0, n || _e, s);
    return a.data = "isPause", this._hasPause = 1, pt(this, a, ct(this, r));
  }, e.removePause = function(r) {
    var n = this._first;
    for (r = ct(this, r); n; )
      n._start === r && n.data === "isPause" && Ot(n), n = n._next;
  }, e.killTweensOf = function(r, n, s) {
    for (var a = this.getTweensOf(r, s), l = a.length; l--; )
      kt !== a[l] && a[l].kill(r, n);
    return this;
  }, e.getTweensOf = function(r, n) {
    for (var s = [], a = dt(r), l = this._first, u = xt(n), h; l; )
      l instanceof B ? qn(l._targets, a) && (u ? (!kt || l._initted && l._ts) && l.globalTime(0) <= n && l.globalTime(l.totalDuration()) > n : !n || l.isActive()) && s.push(l) : (h = l.getTweensOf(a, n)).length && s.push.apply(s, h), l = l._next;
    return s;
  }, e.tweenTo = function(r, n) {
    n = n || {};
    var s = this, a = ct(s, r), l = n, u = l.startAt, h = l.onStart, f = l.onStartParams, d = l.immediateRender, _, p = B.to(s, ut({
      ease: n.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: a,
      overwrite: "auto",
      duration: n.duration || Math.abs((a - (u && "time" in u ? u.time : s._time)) / s.timeScale()) || E,
      onStart: function() {
        if (s.pause(), !_) {
          var m = n.duration || Math.abs((a - (u && "time" in u ? u.time : s._time)) / s.timeScale());
          p._dur !== m && Zt(p, m, 0, 1).render(p._time, !0, !0), _ = 1;
        }
        h && h.apply(p, f || []);
      }
    }, n));
    return d ? p.render(0) : p;
  }, e.tweenFromTo = function(r, n, s) {
    return this.tweenTo(n, ut({
      startAt: {
        time: ct(this, r)
      }
    }, s));
  }, e.recent = function() {
    return this._recent;
  }, e.nextLabel = function(r) {
    return r === void 0 && (r = this._time), qi(this, ct(this, r));
  }, e.previousLabel = function(r) {
    return r === void 0 && (r = this._time), qi(this, ct(this, r), 1);
  }, e.currentLabel = function(r) {
    return arguments.length ? this.seek(r, !0) : this.previousLabel(this._time + E);
  }, e.shiftChildren = function(r, n, s) {
    s === void 0 && (s = 0);
    var a = this._first, l = this.labels, u;
    for (r = D(r); a; )
      a._start >= s && (a._start += r, a._end += r), a = a._next;
    if (n)
      for (u in l)
        l[u] >= s && (l[u] += r);
    return Ut(this);
  }, e.invalidate = function(r) {
    var n = this._first;
    for (this._lock = 0; n; )
      n.invalidate(r), n = n._next;
    return o.prototype.invalidate.call(this, r);
  }, e.clear = function(r) {
    r === void 0 && (r = !0);
    for (var n = this._first, s; n; )
      s = n._next, this.remove(n), n = s;
    return this._dp && (this._time = this._tTime = this._pTime = 0), r && (this.labels = {}), Ut(this);
  }, e.totalDuration = function(r) {
    var n = 0, s = this, a = s._last, l = ft, u, h, f;
    if (arguments.length)
      return s.timeScale((s._repeat < 0 ? s.duration() : s.totalDuration()) / (s.reversed() ? -r : r));
    if (s._dirty) {
      for (f = s.parent; a; )
        u = a._prev, a._dirty && a.totalDuration(), h = a._start, h > l && s._sort && a._ts && !s._lock ? (s._lock = 1, pt(s, a, h - a._delay, 1)._lock = 0) : l = h, h < 0 && a._ts && (n -= h, (!f && !s._dp || f && f.smoothChildTiming) && (s._start += D(h / s._ts), s._time -= h, s._tTime -= h), s.shiftChildren(-h, !1, -1 / 0), l = 0), a._end > n && a._ts && (n = a._end), a = u;
      Zt(s, s === R && s._time > n ? s._time : n, 1, 1), s._dirty = 0;
    }
    return s._tDur;
  }, t.updateRoot = function(r) {
    if (R._ts && (dr(R, Ae(r, R)), cr = nt.frame), nt.frame >= Li) {
      Li += at.autoSleep || 120;
      var n = R._first;
      if ((!n || !n._ts) && at.autoSleep && nt._listeners.length < 2) {
        for (; n && !n._ts; )
          n = n._next;
        n || nt.sleep();
      }
    }
  }, t;
})(ge);
ut(K.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var ls = function(t, e, i, r, n, s, a) {
  var l = new tt(this._pt, t, e, 0, 1, Ur, null, n), u = 0, h = 0, f, d, _, p, c, m, g, v;
  for (l.b = i, l.e = r, i += "", r += "", (g = ~r.indexOf("random(")) && (r = pe(r)), s && (v = [i, r], s(v, t, e), i = v[0], r = v[1]), d = i.match(Ve) || []; f = Ve.exec(r); )
    p = f[0], c = r.substring(u, f.index), _ ? _ = (_ + 1) % 5 : c.substr(-5) === "rgba(" && (_ = 1), p !== d[h++] && (m = parseFloat(d[h - 1]) || 0, l._pt = {
      _next: l._pt,
      p: c || h === 1 ? c : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: m,
      c: p.charAt(1) === "=" ? Ht(m, p) - m : parseFloat(p) - m,
      m: _ && _ < 4 ? Math.round : 0
    }, u = Ve.lastIndex);
  return l.c = u < r.length ? r.substring(u, r.length) : "", l.fp = a, (ar.test(r) || g) && (l.e = 0), this._pt = l, l;
}, wi = function(t, e, i, r, n, s, a, l, u, h) {
  q(r) && (r = r(n || 0, t, s));
  var f = t[e], d = i !== "get" ? i : q(f) ? u ? t[e.indexOf("set") || !q(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](u) : t[e]() : f, _ = q(f) ? u ? ds : Ir : bi, p;
  if (X(r) && (~r.indexOf("random(") && (r = pe(r)), r.charAt(1) === "=" && (p = Ht(d, r) + (G(d) || 0), (p || p === 0) && (r = p))), !h || d !== r || ni)
    return !isNaN(d * r) && r !== "" ? (p = new tt(this._pt, t, e, +d || 0, r - (d || 0), typeof f == "boolean" ? ps : qr, 0, _), u && (p.fp = u), a && p.modifier(a, this, t), this._pt = p) : (!f && !(e in t) && pi(e, r), ls.call(this, t, e, d, r, _, l || at.stringFilter, u));
}, us = function(t, e, i, r, n) {
  if (q(t) && (t = he(t, n, e, i, r)), !gt(t) || t.style && t.nodeType || j(t) || sr(t))
    return X(t) ? he(t, n, e, i, r) : t;
  var s = {}, a;
  for (a in t)
    s[a] = he(t[a], n, e, i, r);
  return s;
}, Lr = function(t, e, i, r, n, s) {
  var a, l, u, h;
  if (rt[t] && (a = new rt[t]()).init(n, a.rawVars ? e[t] : us(e[t], r, n, s, i), i, r, s) !== !1 && (i._pt = l = new tt(i._pt, n, t, 0, 1, a.render, a, 0, a.priority), i !== Xt))
    for (u = i._ptLookup[i._targets.indexOf(n)], h = a._props.length; h--; )
      u[a._props[h]] = l;
  return a;
}, kt, ni, xi = function o(t, e, i) {
  var r = t.vars, n = r.ease, s = r.startAt, a = r.immediateRender, l = r.lazy, u = r.onUpdate, h = r.runBackwards, f = r.yoyoEase, d = r.keyframes, _ = r.autoRevert, p = t._dur, c = t._startAt, m = t._targets, g = t.parent, v = g && g.data === "nested" ? g.vars.targets : m, w = t._overwrite === "auto" && !ci, x = t.timeline, y = r.easeReverse || f, S, b, T, k, P, U, z, M, F, Y, $, N, ht;
  if (x && (!d || !n) && (n = "none"), t._ease = Nt(n, fe.ease), t._rEase = y && (Nt(y) || t._ease), t._from = !x && !!r.runBackwards, t._from && (t.ratio = 1), !x || d && !r.stagger) {
    if (M = m[0] ? qt(m[0]).harness : 0, N = M && r[M.prop], S = Me(r, mi), c && (c._zTime < 0 && c.progress(1), e < 0 && h && a && !_ ? c.render(-1, !0) : c.revert(h && p ? Se : Fn), c._lazy = 0), s) {
      if (Ot(t._startAt = B.set(m, ut({
        data: "isStart",
        overwrite: !1,
        parent: g,
        immediateRender: !0,
        lazy: !c && Z(l),
        startAt: null,
        delay: 0,
        onUpdate: u && function() {
          return st(t, "onUpdate");
        },
        stagger: 0
      }, s))), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (H || !a && !_) && t._startAt.revert(Se), a && p && e <= 0 && i <= 0) {
        e && (t._zTime = e);
        return;
      }
    } else if (h && p && !c) {
      if (e && (a = !1), T = ut({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: a && !c && Z(l),
        immediateRender: a,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: g
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, S), N && (T[M.prop] = N), Ot(t._startAt = B.set(m, T)), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (H ? t._startAt.revert(Se) : t._startAt.render(-1, !0)), t._zTime = e, !a)
        o(t._startAt, E, E);
      else if (!e)
        return;
    }
    for (t._pt = t._ptCache = 0, l = p && Z(l) || l && !p, b = 0; b < m.length; b++) {
      if (P = m[b], z = P._gsap || vi(m)[b]._gsap, t._ptLookup[b] = Y = {}, Ze[z.id] && Pt.length && Ee(), $ = v === m ? b : v.indexOf(P), M && (F = new M()).init(P, N || S, t, $, v) !== !1 && (t._pt = k = new tt(t._pt, P, F.name, 0, 1, F.render, F, 0, F.priority), F._props.forEach(function($t) {
        Y[$t] = k;
      }), F.priority && (U = 1)), !M || N)
        for (T in S)
          rt[T] && (F = Lr(T, S, t, $, P, v)) ? F.priority && (U = 1) : Y[T] = k = wi.call(t, P, T, "get", S[T], $, v, 0, r.stringFilter);
      t._op && t._op[b] && t.kill(P, t._op[b]), w && t._pt && (kt = t, R.killTweensOf(P, Y, t.globalTime(e)), ht = !t.parent, kt = 0), t._pt && l && (Ze[z.id] = 1);
    }
    U && Nr(t), t._onInit && t._onInit(t);
  }
  t._onUpdate = u, t._initted = (!t._op || t._pt) && !ht, d && e <= 0 && x.render(ft, !0, !0);
}, hs = function(t, e, i, r, n, s, a, l) {
  var u = (t._pt && t._ptCache || (t._ptCache = {}))[e], h, f, d, _;
  if (!u)
    for (u = t._ptCache[e] = [], d = t._ptLookup, _ = t._targets.length; _--; ) {
      if (h = d[_][e], h && h.d && h.d._pt)
        for (h = h.d._pt; h && h.p !== e && h.fp !== e; )
          h = h._next;
      if (!h)
        return ni = 1, t.vars[e] = "+=0", xi(t, a), ni = 0, l ? de(e + " not eligible for reset. Try splitting into individual properties") : 1;
      u.push(h);
    }
  for (_ = u.length; _--; )
    f = u[_], h = f._pt || f, h.s = (r || r === 0) && !n ? r : h.s + (r || 0) + s * h.c, h.c = i - h.s, f.e && (f.e = V(i) + G(f.e)), f.b && (f.b = h.s + G(f.b));
}, cs = function(t, e) {
  var i = t[0] ? qt(t[0]).harness : 0, r = i && i.aliases, n, s, a, l;
  if (!r)
    return e;
  n = Kt({}, e);
  for (s in r)
    if (s in n)
      for (l = r[s].split(","), a = l.length; a--; )
        n[l[a]] = n[s];
  return n;
}, fs = function(t, e, i, r) {
  var n = e.ease || r || "power1.inOut", s, a;
  if (j(e))
    a = i[t] || (i[t] = []), e.forEach(function(l, u) {
      return a.push({
        t: u / (e.length - 1) * 100,
        v: l,
        e: n
      });
    });
  else
    for (s in e)
      a = i[s] || (i[s] = []), s === "ease" || a.push({
        t: parseFloat(t),
        v: e[s],
        e: n
      });
}, he = function(t, e, i, r, n) {
  return q(t) ? t.call(e, i, r, n) : X(t) && ~t.indexOf("random(") ? pe(t) : t;
}, zr = gi + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert", Fr = {};
J(zr + ",id,stagger,delay,duration,paused,scrollTrigger", function(o) {
  return Fr[o] = 1;
});
var B = /* @__PURE__ */ (function(o) {
  rr(t, o);
  function t(i, r, n, s) {
    var a;
    typeof r == "number" && (n.duration = r, r = n, n = null), a = o.call(this, s ? r : le(r)) || this;
    var l = a.vars, u = l.duration, h = l.delay, f = l.immediateRender, d = l.stagger, _ = l.overwrite, p = l.keyframes, c = l.defaults, m = l.scrollTrigger, g = r.parent || R, v = (j(i) || sr(i) ? xt(i[0]) : "length" in r) ? [i] : dt(i), w, x, y, S, b, T, k, P;
    if (a._targets = v.length ? vi(v) : de("GSAP target " + i + " not found. https://gsap.com", !at.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = _, p || d || Te(u) || Te(h)) {
      r = a.vars;
      var U = r.easeReverse || r.yoyoEase;
      if (w = a.timeline = new K({
        data: "nested",
        defaults: c || {},
        targets: g && g.data === "nested" ? g.vars.targets : v
      }), w.kill(), w.parent = w._dp = yt(a), w._start = 0, d || Te(u) || Te(h)) {
        if (S = v.length, k = d && br(d), gt(d))
          for (b in d)
            ~zr.indexOf(b) && (P || (P = {}), P[b] = d[b]);
        for (x = 0; x < S; x++)
          y = Me(r, Fr), y.stagger = 0, U && (y.easeReverse = U), P && Kt(y, P), T = v[x], y.duration = +he(u, yt(a), x, T, v), y.delay = (+he(h, yt(a), x, T, v) || 0) - a._delay, !d && S === 1 && y.delay && (a._delay = h = y.delay, a._start += h, y.delay = 0), w.to(T, y, k ? k(x, T, v) : 0), w._ease = C.none;
        w.duration() ? u = h = 0 : a.timeline = 0;
      } else if (p) {
        le(ut(w.vars.defaults, {
          ease: "none"
        })), w._ease = Nt(p.ease || r.ease || "none");
        var z = 0, M, F, Y;
        if (j(p))
          p.forEach(function($) {
            return w.to(v, $, ">");
          }), w.duration();
        else {
          y = {};
          for (b in p)
            b === "ease" || b === "easeEach" || fs(b, p[b], y, p.easeEach);
          for (b in y)
            for (M = y[b].sort(function($, N) {
              return $.t - N.t;
            }), z = 0, x = 0; x < M.length; x++)
              F = M[x], Y = {
                ease: F.e,
                duration: (F.t - (x ? M[x - 1].t : 0)) / 100 * u
              }, Y[b] = F.v, w.to(v, Y, z), z += Y.duration;
          w.duration() < u && w.to({}, {
            duration: u - w.duration()
          });
        }
      }
      u || a.duration(u = w.duration());
    } else
      a.timeline = 0;
    return _ === !0 && !ci && (kt = yt(a), R.killTweensOf(v), kt = 0), pt(g, yt(a), n), r.reversed && a.reverse(), r.paused && a.paused(!0), (f || !u && !p && a._start === D(g._time) && Z(f) && Bn(yt(a)) && g.data !== "nested") && (a._tTime = -E, a.render(Math.max(0, -h) || 0)), m && vr(yt(a), m), a;
  }
  var e = t.prototype;
  return e.render = function(r, n, s) {
    var a = this._time, l = this._tDur, u = this._dur, h = r < 0, f = r > l - E && !h ? l : r < E ? 0 : r, d, _, p, c, m, g, v, w;
    if (!u)
      Wn(this, r, n, s);
    else if (f !== this._tTime || !r || s || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== h || this._lazy) {
      if (d = f, w = this.timeline, this._repeat) {
        if (c = u + this._rDelay, this._repeat < -1 && h)
          return this.totalTime(c * 100 + r, n, s);
        if (d = D(f % c), f === l ? (p = this._repeat, d = u) : (m = D(f / c), p = ~~m, p && p === m ? (d = u, p--) : d > u && (d = u)), g = this._yoyo && p & 1, g && (d = u - d), m = Qt(this._tTime, c), d === a && !s && this._initted && p === m)
          return this._tTime = f, this;
        p !== m && this.vars.repeatRefresh && !g && !this._lock && d !== c && this._initted && (this._lock = s = 1, this.render(D(c * p), !0).invalidate()._lock = 0);
      }
      if (!this._initted) {
        if (yr(this, h ? r : d, s, n, f))
          return this._tTime = 0, this;
        if (a !== this._time && !(s && this.vars.repeatRefresh && p !== m))
          return this;
        if (u !== this._dur)
          return this.render(r, n, s);
      }
      if (this._rEase) {
        var x = d < a;
        if (x !== this._inv) {
          var y = x ? a : u - a;
          this._inv = x, this._from && (this.ratio = 1 - this.ratio), this._invRatio = this.ratio, this._invTime = a, this._invRecip = y ? (x ? -1 : 1) / y : 0, this._invScale = x ? -this.ratio : 1 - this.ratio, this._invEase = x ? this._rEase : this._ease;
        }
        this.ratio = v = this._invRatio + this._invScale * this._invEase((d - this._invTime) * this._invRecip);
      } else
        this.ratio = v = this._ease(d / u);
      if (this._from && (this.ratio = v = 1 - v), this._tTime = f, this._time = d, !this._act && this._ts && (this._act = 1, this._lazy = 0), !a && f && !n && !m && (st(this, "onStart"), this._tTime !== f))
        return this;
      for (_ = this._pt; _; )
        _.r(v, _.d), _ = _._next;
      w && w.render(r < 0 ? r : w._dur * w._ease(d / this._dur), n, s) || this._startAt && (this._zTime = r), this._onUpdate && !n && (h && Je(this, r, n, s), st(this, "onUpdate")), this._repeat && p !== m && this.vars.onRepeat && !n && this.parent && st(this, "onRepeat"), (f === this._tDur || !f) && this._tTime === f && (h && !this._onUpdate && Je(this, r, !0, !0), (r || !u) && (f === this._tDur && this._ts > 0 || !f && this._ts < 0) && Ot(this, 1), !n && !(h && !a) && (f || a || g) && (st(this, f === l ? "onComplete" : "onReverseComplete", !0), this._prom && !(f < l && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, e.targets = function() {
    return this._targets;
  }, e.invalidate = function(r) {
    return (!r || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(r), o.prototype.invalidate.call(this, r);
  }, e.resetTo = function(r, n, s, a, l) {
    me || nt.wake(), this._ts || this.play();
    var u = Math.min(this._dur, (this._dp._time - this._start) * this._ts), h;
    return this._initted || xi(this, u), h = this._ease(u / this._dur), hs(this, r, n, s, a, h, u, l) ? this.resetTo(r, n, s, a, 1) : (Ie(this, 0), this.parent || mr(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, e.kill = function(r, n) {
    if (n === void 0 && (n = "all"), !r && (!n || n === "all"))
      return this._lazy = this._pt = 0, this.parent ? ne(this) : this.scrollTrigger && this.scrollTrigger.kill(!!H), this;
    if (this.timeline) {
      var s = this.timeline.totalDuration();
      return this.timeline.killTweensOf(r, n, kt && kt.vars.overwrite !== !0)._first || ne(this), this.parent && s !== this.timeline.totalDuration() && Zt(this, this._dur * this.timeline._tDur / s, 0, 1), this;
    }
    var a = this._targets, l = r ? dt(r) : a, u = this._ptLookup, h = this._pt, f, d, _, p, c, m, g;
    if ((!n || n === "all") && Nn(a, l))
      return n === "all" && (this._pt = 0), ne(this);
    for (f = this._op = this._op || [], n !== "all" && (X(n) && (c = {}, J(n, function(v) {
      return c[v] = 1;
    }), n = c), n = cs(a, n)), g = a.length; g--; )
      if (~l.indexOf(a[g])) {
        d = u[g], n === "all" ? (f[g] = n, p = d, _ = {}) : (_ = f[g] = f[g] || {}, p = n);
        for (c in p)
          m = d && d[c], m && ((!("kill" in m.d) || m.d.kill(c) === !0) && ze(this, m, "_pt"), delete d[c]), _ !== "all" && (_[c] = 1);
      }
    return this._initted && !this._pt && h && ne(this), this;
  }, t.to = function(r, n) {
    return new t(r, n, arguments[2]);
  }, t.from = function(r, n) {
    return ue(1, arguments);
  }, t.delayedCall = function(r, n, s, a) {
    return new t(n, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: r,
      onComplete: n,
      onReverseComplete: n,
      onCompleteParams: s,
      onReverseCompleteParams: s,
      callbackScope: a
    });
  }, t.fromTo = function(r, n, s) {
    return ue(2, arguments);
  }, t.set = function(r, n) {
    return n.duration = 0, n.repeatDelay || (n.repeat = 0), new t(r, n);
  }, t.killTweensOf = function(r, n, s) {
    return R.killTweensOf(r, n, s);
  }, t;
})(ge);
ut(B.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
J("staggerTo,staggerFrom,staggerFromTo", function(o) {
  B[o] = function() {
    var t = new K(), e = ei.call(arguments, 0);
    return e.splice(o === "staggerFromTo" ? 5 : 4, 0, 0), t[o].apply(t, e);
  };
});
var bi = function(t, e, i) {
  return t[e] = i;
}, Ir = function(t, e, i) {
  return t[e](i);
}, ds = function(t, e, i, r) {
  return t[e](r.fp, i);
}, _s = function(t, e, i) {
  return t.setAttribute(e, i);
}, ki = function(t, e) {
  return q(t[e]) ? Ir : fi(t[e]) && t.setAttribute ? _s : bi;
}, qr = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e6) / 1e6, e);
}, ps = function(t, e) {
  return e.set(e.t, e.p, !!(e.s + e.c * t), e);
}, Ur = function(t, e) {
  var i = e._pt, r = "";
  if (!t && e.b)
    r = e.b;
  else if (t === 1 && e.e)
    r = e.e;
  else {
    for (; i; )
      r = i.p + (i.m ? i.m(i.s + i.c * t) : Math.round((i.s + i.c * t) * 1e4) / 1e4) + r, i = i._next;
    r += e.c;
  }
  e.set(e.t, e.p, r, e);
}, Ti = function(t, e) {
  for (var i = e._pt; i; )
    i.r(t, i.d), i = i._next;
}, ms = function(t, e, i, r) {
  for (var n = this._pt, s; n; )
    s = n._next, n.p === r && n.modifier(t, e, i), n = s;
}, gs = function(t) {
  for (var e = this._pt, i, r; e; )
    r = e._next, e.p === t && !e.op || e.op === t ? ze(this, e, "_pt") : e.dep || (i = 1), e = r;
  return !i;
}, vs = function(t, e, i, r) {
  r.mSet(t, e, r.m.call(r.tween, i, r.mt), r);
}, Nr = function(t) {
  for (var e = t._pt, i, r, n, s; e; ) {
    for (i = e._next, r = n; r && r.pr > e.pr; )
      r = r._next;
    (e._prev = r ? r._prev : s) ? e._prev._next = e : n = e, (e._next = r) ? r._prev = e : s = e, e = i;
  }
  t._pt = n;
}, tt = /* @__PURE__ */ (function() {
  function o(e, i, r, n, s, a, l, u, h) {
    this.t = i, this.s = n, this.c = s, this.p = r, this.r = a || qr, this.d = l || this, this.set = u || bi, this.pr = h || 0, this._next = e, e && (e._prev = this);
  }
  var t = o.prototype;
  return t.modifier = function(i, r, n) {
    this.mSet = this.mSet || this.set, this.set = vs, this.m = i, this.mt = n, this.tween = r;
  }, o;
})();
J(gi + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse", function(o) {
  return mi[o] = 1;
});
lt.TweenMax = lt.TweenLite = B;
lt.TimelineLite = lt.TimelineMax = K;
R = new K({
  sortChildren: !1,
  defaults: fe,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
at.stringFilter = Ar;
var Vt = [], Ce = {}, ys = [], Ni = 0, ws = 0, Xe = function(t) {
  return (Ce[t] || ys).map(function(e) {
    return e();
  });
}, si = function() {
  var t = Date.now(), e = [];
  t - Ni > 2 && (Xe("matchMediaInit"), Vt.forEach(function(i) {
    var r = i.queries, n = i.conditions, s, a, l, u;
    for (a in r)
      s = _t.matchMedia(r[a]).matches, s && (l = 1), s !== n[a] && (n[a] = s, u = 1);
    u && (i.revert(), l && e.push(i));
  }), Xe("matchMediaRevert"), e.forEach(function(i) {
    return i.onMatch(i, function(r) {
      return i.add(null, r);
    });
  }), Ni = t, Xe("matchMedia"));
}, Vr = /* @__PURE__ */ (function() {
  function o(e, i) {
    this.selector = i && ii(i), this.data = [], this._r = [], this.isReverted = !1, this.id = ws++, e && this.add(e);
  }
  var t = o.prototype;
  return t.add = function(i, r, n) {
    q(i) && (n = r, r = i, i = q);
    var s = this, a = function() {
      var u = A, h = s.selector, f;
      return u && u !== s && u.data.push(s), n && (s.selector = ii(n)), A = s, f = r.apply(s, arguments), q(f) && s._r.push(f), A = u, s.selector = h, s.isReverted = !1, f;
    };
    return s.last = a, i === q ? a(s, function(l) {
      return s.add(null, l);
    }) : i ? s[i] = a : a;
  }, t.ignore = function(i) {
    var r = A;
    A = null, i(this), A = r;
  }, t.getTweens = function() {
    var i = [];
    return this.data.forEach(function(r) {
      return r instanceof o ? i.push.apply(i, r.getTweens()) : r instanceof B && !(r.parent && r.parent.data === "nested") && i.push(r);
    }), i;
  }, t.clear = function() {
    this._r.length = this.data.length = 0;
  }, t.kill = function(i, r) {
    var n = this;
    if (i ? (function() {
      for (var a = n.getTweens(), l = n.data.length, u; l--; )
        u = n.data[l], u.data === "isFlip" && (u.revert(), u.getChildren(!0, !0, !1).forEach(function(h) {
          return a.splice(a.indexOf(h), 1);
        }));
      for (a.map(function(h) {
        return {
          g: h._dur || h._delay || h._sat && !h._sat.vars.immediateRender ? h.globalTime(0) : -1 / 0,
          t: h
        };
      }).sort(function(h, f) {
        return f.g - h.g || -1 / 0;
      }).forEach(function(h) {
        return h.t.revert(i);
      }), l = n.data.length; l--; )
        u = n.data[l], u instanceof K ? u.data !== "nested" && (u.scrollTrigger && u.scrollTrigger.revert(), u.kill()) : !(u instanceof B) && u.revert && u.revert(i);
      n._r.forEach(function(h) {
        return h(i, n);
      }), n.isReverted = !0;
    })() : this.data.forEach(function(a) {
      return a.kill && a.kill();
    }), this.clear(), r)
      for (var s = Vt.length; s--; )
        Vt[s].id === this.id && Vt.splice(s, 1);
  }, t.revert = function(i) {
    this.kill(i || {});
  }, o;
})(), xs = /* @__PURE__ */ (function() {
  function o(e) {
    this.contexts = [], this.scope = e, A && A.data.push(this);
  }
  var t = o.prototype;
  return t.add = function(i, r, n) {
    gt(i) || (i = {
      matches: i
    });
    var s = new Vr(0, n || this.scope), a = s.conditions = {}, l, u, h;
    A && !s.selector && (s.selector = A.selector), this.contexts.push(s), r = s.add("onMatch", r), s.queries = i;
    for (u in i)
      u === "all" ? h = 1 : (l = _t.matchMedia(i[u]), l && (Vt.indexOf(s) < 0 && Vt.push(s), (a[u] = l.matches) && (h = 1), l.addListener ? l.addListener(si) : l.addEventListener("change", si)));
    return h && r(s, function(f) {
      return s.add(null, f);
    }), this;
  }, t.revert = function(i) {
    this.kill(i || {});
  }, t.kill = function(i) {
    this.contexts.forEach(function(r) {
      return r.kill(i, !0);
    });
  }, o;
})(), De = {
  registerPlugin: function() {
    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
      e[i] = arguments[i];
    e.forEach(function(r) {
      return Or(r);
    });
  },
  timeline: function(t) {
    return new K(t);
  },
  getTweensOf: function(t, e) {
    return R.getTweensOf(t, e);
  },
  getProperty: function(t, e, i, r) {
    X(t) && (t = dt(t)[0]);
    var n = qt(t || {}).get, s = i ? pr : _r;
    return i === "native" && (i = ""), t && (e ? s((rt[e] && rt[e].get || n)(t, e, i, r)) : function(a, l, u) {
      return s((rt[a] && rt[a].get || n)(t, a, l, u));
    });
  },
  quickSetter: function(t, e, i) {
    if (t = dt(t), t.length > 1) {
      var r = t.map(function(h) {
        return it.quickSetter(h, e, i);
      }), n = r.length;
      return function(h) {
        for (var f = n; f--; )
          r[f](h);
      };
    }
    t = t[0] || {};
    var s = rt[e], a = qt(t), l = a.harness && (a.harness.aliases || {})[e] || e, u = s ? function(h) {
      var f = new s();
      Xt._pt = 0, f.init(t, i ? h + i : h, Xt, 0, [t]), f.render(1, f), Xt._pt && Ti(1, Xt);
    } : a.set(t, l);
    return s ? u : function(h) {
      return u(t, l, i ? h + i : h, a, 1);
    };
  },
  quickTo: function(t, e, i) {
    var r, n = it.to(t, ut((r = {}, r[e] = "+=0.1", r.paused = !0, r.stagger = 0, r), i || {})), s = function(l, u, h) {
      return n.resetTo(e, l, u, h);
    };
    return s.tween = n, s;
  },
  isTweening: function(t) {
    return R.getTweensOf(t, !0).length > 0;
  },
  defaults: function(t) {
    return t && t.ease && (t.ease = Nt(t.ease, fe.ease)), zi(fe, t || {});
  },
  config: function(t) {
    return zi(at, t || {});
  },
  registerEffect: function(t) {
    var e = t.name, i = t.effect, r = t.plugins, n = t.defaults, s = t.extendTimeline;
    (r || "").split(",").forEach(function(a) {
      return a && !rt[a] && !lt[a] && de(e + " effect requires " + a + " plugin.");
    }), Be[e] = function(a, l, u) {
      return i(dt(a), ut(l || {}, n), u);
    }, s && (K.prototype[e] = function(a, l, u) {
      return this.add(Be[e](a, gt(l) ? l : (u = l) && {}, this), u);
    });
  },
  registerEase: function(t, e) {
    C[t] = Nt(e);
  },
  parseEase: function(t, e) {
    return arguments.length ? Nt(t, e) : C;
  },
  getById: function(t) {
    return R.getById(t);
  },
  exportRoot: function(t, e) {
    t === void 0 && (t = {});
    var i = new K(t), r, n;
    for (i.smoothChildTiming = Z(t.smoothChildTiming), R.remove(i), i._dp = 0, i._time = i._tTime = R._time, r = R._first; r; )
      n = r._next, (e || !(!r._dur && r instanceof B && r.vars.onComplete === r._targets[0])) && pt(i, r, r._start - r._delay), r = n;
    return pt(R, i, 0), i;
  },
  context: function(t, e) {
    return t ? new Vr(t, e) : A;
  },
  matchMedia: function(t) {
    return new xs(t);
  },
  matchMediaRefresh: function() {
    return Vt.forEach(function(t) {
      var e = t.conditions, i, r;
      for (r in e)
        e[r] && (e[r] = !1, i = 1);
      i && t.revert();
    }) || si();
  },
  addEventListener: function(t, e) {
    var i = Ce[t] || (Ce[t] = []);
    ~i.indexOf(e) || i.push(e);
  },
  removeEventListener: function(t, e) {
    var i = Ce[t], r = i && i.indexOf(e);
    r >= 0 && i.splice(r, 1);
  },
  utils: {
    wrap: Zn,
    wrapYoyo: Jn,
    distribute: br,
    random: Tr,
    snap: kr,
    normalize: Qn,
    getUnit: G,
    clamp: Hn,
    splitColor: Er,
    toArray: dt,
    selector: ii,
    mapRange: Pr,
    pipe: jn,
    unitize: Kn,
    interpolate: ts,
    shuffle: xr
  },
  install: ur,
  effects: Be,
  ticker: nt,
  updateRoot: K.updateRoot,
  plugins: rt,
  globalTimeline: R,
  core: {
    PropTween: tt,
    globals: hr,
    Tween: B,
    Timeline: K,
    Animation: ge,
    getCache: qt,
    _removeLinkedListItem: ze,
    reverting: function() {
      return H;
    },
    context: function(t) {
      return t && A && (A.data.push(t), t._ctx = A), A;
    },
    suppressOverwrites: function(t) {
      return ci = t;
    }
  }
};
J("to,from,fromTo,delayedCall,set,killTweensOf", function(o) {
  return De[o] = B[o];
});
nt.add(K.updateRoot);
Xt = De.to({}, {
  duration: 0
});
var bs = function(t, e) {
  for (var i = t._pt; i && i.p !== e && i.op !== e && i.fp !== e; )
    i = i._next;
  return i;
}, ks = function(t, e) {
  var i = t._targets, r, n, s;
  for (r in e)
    for (n = i.length; n--; )
      s = t._ptLookup[n][r], s && (s = s.d) && (s._pt && (s = bs(s, r)), s && s.modifier && s.modifier(e[r], t, i[n], r));
}, He = function(t, e) {
  return {
    name: t,
    headless: 1,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(r, n, s) {
      s._onInit = function(a) {
        var l, u;
        if (X(n) && (l = {}, J(n, function(h) {
          return l[h] = 1;
        }), n = l), e) {
          l = {};
          for (u in n)
            l[u] = e(n[u]);
          n = l;
        }
        ks(a, n);
      };
    }
  };
}, it = De.registerPlugin({
  name: "attr",
  init: function(t, e, i, r, n) {
    var s, a, l;
    this.tween = i;
    for (s in e)
      l = t.getAttribute(s) || "", a = this.add(t, "setAttribute", (l || 0) + "", e[s], r, n, 0, 0, s), a.op = s, a.b = l, this._props.push(s);
  },
  render: function(t, e) {
    for (var i = e._pt; i; )
      H ? i.set(i.t, i.p, i.b, i) : i.r(t, i.d), i = i._next;
  }
}, {
  name: "endArray",
  headless: 1,
  init: function(t, e) {
    for (var i = e.length; i--; )
      this.add(t, i, t[i] || 0, e[i], 0, 0, 0, 0, 0, 1);
  }
}, He("roundProps", ri), He("modifiers"), He("snap", kr)) || De;
B.version = K.version = it.version = "3.15.0";
lr = 1;
di() && Jt();
C.Power0;
C.Power1;
C.Power2;
C.Power3;
C.Power4;
C.Linear;
C.Quad;
C.Cubic;
C.Quart;
C.Quint;
C.Strong;
C.Elastic;
C.Back;
C.SteppedEase;
C.Bounce;
C.Sine;
C.Expo;
C.Circ;
/*!
 * CSSPlugin 3.15.0
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var Vi, Tt, Gt, Si, It, Bi, Pi, Ts = function() {
  return typeof window < "u";
}, bt = {}, Ft = 180 / Math.PI, jt = Math.PI / 180, Wt = Math.atan2, $i = 1e8, Ci = /([A-Z])/g, Ss = /(left|right|width|margin|padding|x)/i, Ps = /[\s,\(]\S/, mt = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, oi = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, Cs = function(t, e) {
  return e.set(e.t, e.p, t === 1 ? e.e : Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, Os = function(t, e) {
  return e.set(e.t, e.p, t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e);
}, Es = function(t, e) {
  return e.set(e.t, e.p, t === 1 ? e.e : t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e);
}, Ms = function(t, e) {
  var i = e.s + e.c * t;
  e.set(e.t, e.p, ~~(i + (i < 0 ? -0.5 : 0.5)) + e.u, e);
}, Br = function(t, e) {
  return e.set(e.t, e.p, t ? e.e : e.b, e);
}, $r = function(t, e) {
  return e.set(e.t, e.p, t !== 1 ? e.b : e.e, e);
}, As = function(t, e, i) {
  return t.style[e] = i;
}, Ds = function(t, e, i) {
  return t.style.setProperty(e, i);
}, Rs = function(t, e, i) {
  return t._gsap[e] = i;
}, Ls = function(t, e, i) {
  return t._gsap.scaleX = t._gsap.scaleY = i;
}, zs = function(t, e, i, r, n) {
  var s = t._gsap;
  s.scaleX = s.scaleY = i, s.renderTransform(n, s);
}, Fs = function(t, e, i, r, n) {
  var s = t._gsap;
  s[e] = i, s.renderTransform(n, s);
}, L = "transform", et = L + "Origin", Is = function o(t, e) {
  var i = this, r = this.target, n = r.style, s = r._gsap;
  if (t in bt && n) {
    if (this.tfm = this.tfm || {}, t !== "transform")
      t = mt[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(a) {
        return i.tfm[a] = wt(r, a);
      }) : this.tfm[t] = s.x ? s[t] : wt(r, t), t === et && (this.tfm.zOrigin = s.zOrigin);
    else
      return mt.transform.split(",").forEach(function(a) {
        return o.call(i, a, e);
      });
    if (this.props.indexOf(L) >= 0)
      return;
    s.svg && (this.svgo = r.getAttribute("data-svg-origin"), this.props.push(et, e, "")), t = L;
  }
  (n || e) && this.props.push(t, e, n[t]);
}, Wr = function(t) {
  t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"));
}, qs = function() {
  var t = this.props, e = this.target, i = e.style, r = e._gsap, n, s;
  for (n = 0; n < t.length; n += 3)
    t[n + 1] ? t[n + 1] === 2 ? e[t[n]](t[n + 2]) : e[t[n]] = t[n + 2] : t[n + 2] ? i[t[n]] = t[n + 2] : i.removeProperty(t[n].substr(0, 2) === "--" ? t[n] : t[n].replace(Ci, "-$1").toLowerCase());
  if (this.tfm) {
    for (s in this.tfm)
      r[s] = this.tfm[s];
    r.svg && (r.renderTransform(), e.setAttribute("data-svg-origin", this.svgo || "")), n = Pi(), (!n || !n.isStart) && !i[L] && (Wr(i), r.zOrigin && i[et] && (i[et] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1);
  }
}, Yr = function(t, e) {
  var i = {
    target: t,
    props: [],
    revert: qs,
    save: Is
  };
  return t._gsap || it.core.getCache(t), e && t.style && t.nodeType && e.split(",").forEach(function(r) {
    return i.save(r);
  }), i;
}, Xr, ai = function(t, e) {
  var i = Tt.createElementNS ? Tt.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : Tt.createElement(t);
  return i && i.style ? i : Tt.createElement(t);
}, ot = function o(t, e, i) {
  var r = getComputedStyle(t);
  return r[e] || r.getPropertyValue(e.replace(Ci, "-$1").toLowerCase()) || r.getPropertyValue(e) || !i && o(t, te(e) || e, 1) || "";
}, Wi = "O,Moz,ms,Ms,Webkit".split(","), te = function(t, e, i) {
  var r = e || It, n = r.style, s = 5;
  if (t in n && !i)
    return t;
  for (t = t.charAt(0).toUpperCase() + t.substr(1); s-- && !(Wi[s] + t in n); )
    ;
  return s < 0 ? null : (s === 3 ? "ms" : s >= 0 ? Wi[s] : "") + t;
}, li = function() {
  Ts() && window.document && (Vi = window, Tt = Vi.document, Gt = Tt.documentElement, It = ai("div") || {
    style: {}
  }, ai("div"), L = te(L), et = L + "Origin", It.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", Xr = !!te("perspective"), Pi = it.core.reverting, Si = 1);
}, Yi = function(t) {
  var e = t.ownerSVGElement, i = ai("svg", e && e.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), r = t.cloneNode(!0), n;
  r.style.display = "block", i.appendChild(r), Gt.appendChild(i);
  try {
    n = r.getBBox();
  } catch {
  }
  return i.removeChild(r), Gt.removeChild(i), n;
}, Xi = function(t, e) {
  for (var i = e.length; i--; )
    if (t.hasAttribute(e[i]))
      return t.getAttribute(e[i]);
}, Hr = function(t) {
  var e, i;
  try {
    e = t.getBBox();
  } catch {
    e = Yi(t), i = 1;
  }
  return e && (e.width || e.height) || i || (e = Yi(t)), e && !e.width && !e.x && !e.y ? {
    x: +Xi(t, ["x", "cx", "x1"]) || 0,
    y: +Xi(t, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : e;
}, Gr = function(t) {
  return !!(t.getCTM && (!t.parentNode || t.ownerSVGElement) && Hr(t));
}, Et = function(t, e) {
  if (e) {
    var i = t.style, r;
    e in bt && e !== et && (e = L), i.removeProperty ? (r = e.substr(0, 2), (r === "ms" || e.substr(0, 6) === "webkit") && (e = "-" + e), i.removeProperty(r === "--" ? e : e.replace(Ci, "-$1").toLowerCase())) : i.removeAttribute(e);
  }
}, St = function(t, e, i, r, n, s) {
  var a = new tt(t._pt, e, i, 0, 1, s ? $r : Br);
  return t._pt = a, a.b = r, a.e = n, t._props.push(i), a;
}, Hi = {
  deg: 1,
  rad: 1,
  turn: 1
}, Us = {
  grid: 1,
  flex: 1
}, Mt = function o(t, e, i, r) {
  var n = parseFloat(i) || 0, s = (i + "").trim().substr((n + "").length) || "px", a = It.style, l = Ss.test(e), u = t.tagName.toLowerCase() === "svg", h = (u ? "client" : "offset") + (l ? "Width" : "Height"), f = 100, d = r === "px", _ = r === "%", p, c, m, g;
  if (r === s || !n || Hi[r] || Hi[s])
    return n;
  if (s !== "px" && !d && (n = o(t, e, i, "px")), g = t.getCTM && Gr(t), (_ || s === "%") && (bt[e] || ~e.indexOf("adius")))
    return p = g ? t.getBBox()[l ? "width" : "height"] : t[h], V(_ ? n / p * f : n / 100 * p);
  if (a[l ? "width" : "height"] = f + (d ? s : r), c = r !== "rem" && ~e.indexOf("adius") || r === "em" && t.appendChild && !u ? t : t.parentNode, g && (c = (t.ownerSVGElement || {}).parentNode), (!c || c === Tt || !c.appendChild) && (c = Tt.body), m = c._gsap, m && _ && m.width && l && m.time === nt.time && !m.uncache)
    return V(n / m.width * f);
  if (_ && (e === "height" || e === "width")) {
    var v = t.style[e];
    t.style[e] = f + r, p = t[h], v ? t.style[e] = v : Et(t, e);
  } else
    (_ || s === "%") && !Us[ot(c, "display")] && (a.position = ot(t, "position")), c === t && (a.position = "static"), c.appendChild(It), p = It[h], c.removeChild(It), a.position = "absolute";
  return l && _ && (m = qt(c), m.time = nt.time, m.width = c[h]), V(d ? p * n / f : p && n ? f / p * n : 0);
}, wt = function(t, e, i, r) {
  var n;
  return Si || li(), e in mt && e !== "transform" && (e = mt[e], ~e.indexOf(",") && (e = e.split(",")[0])), bt[e] && e !== "transform" ? (n = ye(t, r), n = e !== "transformOrigin" ? n[e] : n.svg ? n.origin : Le(ot(t, et)) + " " + n.zOrigin + "px") : (n = t.style[e], (!n || n === "auto" || r || ~(n + "").indexOf("calc(")) && (n = Re[e] && Re[e](t, e, i) || ot(t, e) || fr(t, e) || (e === "opacity" ? 1 : 0))), i && !~(n + "").trim().indexOf(" ") ? Mt(t, e, n, i) + i : n;
}, Ns = function(t, e, i, r) {
  if (!i || i === "none") {
    var n = te(e, t, 1), s = n && ot(t, n, 1);
    s && s !== i ? (e = n, i = s) : e === "borderColor" && (i = ot(t, "borderTopColor"));
  }
  var a = new tt(this._pt, t.style, e, 0, 1, Ur), l = 0, u = 0, h, f, d, _, p, c, m, g, v, w, x, y;
  if (a.b = i, a.e = r, i += "", r += "", r.substring(0, 6) === "var(--" && (r = ot(t, r.substring(4, r.indexOf(")")))), r === "auto" && (c = t.style[e], t.style[e] = r, r = ot(t, e) || r, c ? t.style[e] = c : Et(t, e)), h = [i, r], Ar(h), i = h[0], r = h[1], d = i.match(Yt) || [], y = r.match(Yt) || [], y.length) {
    for (; f = Yt.exec(r); )
      m = f[0], v = r.substring(l, f.index), p ? p = (p + 1) % 5 : (v.substr(-5) === "rgba(" || v.substr(-5) === "hsla(") && (p = 1), m !== (c = d[u++] || "") && (_ = parseFloat(c) || 0, x = c.substr((_ + "").length), m.charAt(1) === "=" && (m = Ht(_, m) + x), g = parseFloat(m), w = m.substr((g + "").length), l = Yt.lastIndex - w.length, w || (w = w || at.units[e] || x, l === r.length && (r += w, a.e += w)), x !== w && (_ = Mt(t, e, c, w) || 0), a._pt = {
        _next: a._pt,
        p: v || u === 1 ? v : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: _,
        c: g - _,
        m: p && p < 4 || e === "zIndex" ? Math.round : 0
      });
    a.c = l < r.length ? r.substring(l, r.length) : "";
  } else
    a.r = e === "display" && r === "none" ? $r : Br;
  return ar.test(r) && (a.e = 0), this._pt = a, a;
}, Gi = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, Vs = function(t) {
  var e = t.split(" "), i = e[0], r = e[1] || "50%";
  return (i === "top" || i === "bottom" || r === "left" || r === "right") && (t = i, i = r, r = t), e[0] = Gi[i] || i, e[1] = Gi[r] || r, e.join(" ");
}, Bs = function(t, e) {
  if (e.tween && e.tween._time === e.tween._dur) {
    var i = e.t, r = i.style, n = e.u, s = i._gsap, a, l, u;
    if (n === "all" || n === !0)
      r.cssText = "", l = 1;
    else
      for (n = n.split(","), u = n.length; --u > -1; )
        a = n[u], bt[a] && (l = 1, a = a === "transformOrigin" ? et : L), Et(i, a);
    l && (Et(i, L), s && (s.svg && i.removeAttribute("transform"), r.scale = r.rotate = r.translate = "none", ye(i, 1), s.uncache = 1, Wr(r)));
  }
}, Re = {
  clearProps: function(t, e, i, r, n) {
    if (n.data !== "isFromStart") {
      var s = t._pt = new tt(t._pt, e, i, 0, 0, Bs);
      return s.u = r, s.pr = -10, s.tween = n, t._props.push(i), 1;
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
}, ve = [1, 0, 0, 1, 0, 0], jr = {}, Kr = function(t) {
  return t === "matrix(1, 0, 0, 1, 0, 0)" || t === "none" || !t;
}, ji = function(t) {
  var e = ot(t, L);
  return Kr(e) ? ve : e.substr(7).match(or).map(V);
}, Oi = function(t, e) {
  var i = t._gsap || qt(t), r = t.style, n = ji(t), s, a, l, u;
  return i.svg && t.getAttribute("transform") ? (l = t.transform.baseVal.consolidate().matrix, n = [l.a, l.b, l.c, l.d, l.e, l.f], n.join(",") === "1,0,0,1,0,0" ? ve : n) : (n === ve && !t.offsetParent && t !== Gt && !i.svg && (l = r.display, r.display = "block", s = t.parentNode, (!s || !t.offsetParent && !t.getBoundingClientRect().width) && (u = 1, a = t.nextElementSibling, Gt.appendChild(t)), n = ji(t), l ? r.display = l : Et(t, "display"), u && (a ? s.insertBefore(t, a) : s ? s.appendChild(t) : Gt.removeChild(t))), e && n.length > 6 ? [n[0], n[1], n[4], n[5], n[12], n[13]] : n);
}, ui = function(t, e, i, r, n, s) {
  var a = t._gsap, l = n || Oi(t, !0), u = a.xOrigin || 0, h = a.yOrigin || 0, f = a.xOffset || 0, d = a.yOffset || 0, _ = l[0], p = l[1], c = l[2], m = l[3], g = l[4], v = l[5], w = e.split(" "), x = parseFloat(w[0]) || 0, y = parseFloat(w[1]) || 0, S, b, T, k;
  i ? l !== ve && (b = _ * m - p * c) && (T = x * (m / b) + y * (-c / b) + (c * v - m * g) / b, k = x * (-p / b) + y * (_ / b) - (_ * v - p * g) / b, x = T, y = k) : (S = Hr(t), x = S.x + (~w[0].indexOf("%") ? x / 100 * S.width : x), y = S.y + (~(w[1] || w[0]).indexOf("%") ? y / 100 * S.height : y)), r || r !== !1 && a.smooth ? (g = x - u, v = y - h, a.xOffset = f + (g * _ + v * c) - g, a.yOffset = d + (g * p + v * m) - v) : a.xOffset = a.yOffset = 0, a.xOrigin = x, a.yOrigin = y, a.smooth = !!r, a.origin = e, a.originIsAbsolute = !!i, t.style[et] = "0px 0px", s && (St(s, a, "xOrigin", u, x), St(s, a, "yOrigin", h, y), St(s, a, "xOffset", f, a.xOffset), St(s, a, "yOffset", d, a.yOffset)), t.setAttribute("data-svg-origin", x + " " + y);
}, ye = function(t, e) {
  var i = t._gsap || new Rr(t);
  if ("x" in i && !e && !i.uncache)
    return i;
  var r = t.style, n = i.scaleX < 0, s = "px", a = "deg", l = getComputedStyle(t), u = ot(t, et) || "0", h, f, d, _, p, c, m, g, v, w, x, y, S, b, T, k, P, U, z, M, F, Y, $, N, ht, $t, ee, ie, Dt, Ei, vt, Rt;
  return h = f = d = c = m = g = v = w = x = 0, _ = p = 1, i.svg = !!(t.getCTM && Gr(t)), l.translate && ((l.translate !== "none" || l.scale !== "none" || l.rotate !== "none") && (r[L] = (l.translate !== "none" ? "translate3d(" + (l.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (l.rotate !== "none" ? "rotate(" + l.rotate + ") " : "") + (l.scale !== "none" ? "scale(" + l.scale.split(" ").join(",") + ") " : "") + (l[L] !== "none" ? l[L] : "")), r.scale = r.rotate = r.translate = "none"), b = Oi(t, i.svg), i.svg && (i.uncache ? (ht = t.getBBox(), u = i.xOrigin - ht.x + "px " + (i.yOrigin - ht.y) + "px", N = "") : N = !e && t.getAttribute("data-svg-origin"), ui(t, N || u, !!N || i.originIsAbsolute, i.smooth !== !1, b)), y = i.xOrigin || 0, S = i.yOrigin || 0, b !== ve && (U = b[0], z = b[1], M = b[2], F = b[3], h = Y = b[4], f = $ = b[5], b.length === 6 ? (_ = Math.sqrt(U * U + z * z), p = Math.sqrt(F * F + M * M), c = U || z ? Wt(z, U) * Ft : 0, v = M || F ? Wt(M, F) * Ft + c : 0, v && (p *= Math.abs(Math.cos(v * jt))), i.svg && (h -= y - (y * U + S * M), f -= S - (y * z + S * F))) : (Rt = b[6], Ei = b[7], ee = b[8], ie = b[9], Dt = b[10], vt = b[11], h = b[12], f = b[13], d = b[14], T = Wt(Rt, Dt), m = T * Ft, T && (k = Math.cos(-T), P = Math.sin(-T), N = Y * k + ee * P, ht = $ * k + ie * P, $t = Rt * k + Dt * P, ee = Y * -P + ee * k, ie = $ * -P + ie * k, Dt = Rt * -P + Dt * k, vt = Ei * -P + vt * k, Y = N, $ = ht, Rt = $t), T = Wt(-M, Dt), g = T * Ft, T && (k = Math.cos(-T), P = Math.sin(-T), N = U * k - ee * P, ht = z * k - ie * P, $t = M * k - Dt * P, vt = F * P + vt * k, U = N, z = ht, M = $t), T = Wt(z, U), c = T * Ft, T && (k = Math.cos(T), P = Math.sin(T), N = U * k + z * P, ht = Y * k + $ * P, z = z * k - U * P, $ = $ * k - Y * P, U = N, Y = ht), m && Math.abs(m) + Math.abs(c) > 359.9 && (m = c = 0, g = 180 - g), _ = V(Math.sqrt(U * U + z * z + M * M)), p = V(Math.sqrt($ * $ + Rt * Rt)), T = Wt(Y, $), v = Math.abs(T) > 2e-4 ? T * Ft : 0, x = vt ? 1 / (vt < 0 ? -vt : vt) : 0), i.svg && (N = t.getAttribute("transform"), i.forceCSS = t.setAttribute("transform", "") || !Kr(ot(t, L)), N && t.setAttribute("transform", N))), Math.abs(v) > 90 && Math.abs(v) < 270 && (n ? (_ *= -1, v += c <= 0 ? 180 : -180, c += c <= 0 ? 180 : -180) : (p *= -1, v += v <= 0 ? 180 : -180)), e = e || i.uncache, i.x = h - ((i.xPercent = h && (!e && i.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-h) ? -50 : 0))) ? t.offsetWidth * i.xPercent / 100 : 0) + s, i.y = f - ((i.yPercent = f && (!e && i.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-f) ? -50 : 0))) ? t.offsetHeight * i.yPercent / 100 : 0) + s, i.z = d + s, i.scaleX = V(_), i.scaleY = V(p), i.rotation = V(c) + a, i.rotationX = V(m) + a, i.rotationY = V(g) + a, i.skewX = v + a, i.skewY = w + a, i.transformPerspective = x + s, (i.zOrigin = parseFloat(u.split(" ")[2]) || !e && i.zOrigin || 0) && (r[et] = Le(u)), i.xOffset = i.yOffset = 0, i.force3D = at.force3D, i.renderTransform = i.svg ? Ws : Xr ? Qr : $s, i.uncache = 0, i;
}, Le = function(t) {
  return (t = t.split(" "))[0] + " " + t[1];
}, Ge = function(t, e, i) {
  var r = G(e);
  return V(parseFloat(e) + parseFloat(Mt(t, "x", i + "px", r))) + r;
}, $s = function(t, e) {
  e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, Qr(t, e);
}, Lt = "0deg", re = "0px", zt = ") ", Qr = function(t, e) {
  var i = e || this, r = i.xPercent, n = i.yPercent, s = i.x, a = i.y, l = i.z, u = i.rotation, h = i.rotationY, f = i.rotationX, d = i.skewX, _ = i.skewY, p = i.scaleX, c = i.scaleY, m = i.transformPerspective, g = i.force3D, v = i.target, w = i.zOrigin, x = "", y = g === "auto" && t && t !== 1 || g === !0;
  if (w && (f !== Lt || h !== Lt)) {
    var S = parseFloat(h) * jt, b = Math.sin(S), T = Math.cos(S), k;
    S = parseFloat(f) * jt, k = Math.cos(S), s = Ge(v, s, b * k * -w), a = Ge(v, a, -Math.sin(S) * -w), l = Ge(v, l, T * k * -w + w);
  }
  m !== re && (x += "perspective(" + m + zt), (r || n) && (x += "translate(" + r + "%, " + n + "%) "), (y || s !== re || a !== re || l !== re) && (x += l !== re || y ? "translate3d(" + s + ", " + a + ", " + l + ") " : "translate(" + s + ", " + a + zt), u !== Lt && (x += "rotate(" + u + zt), h !== Lt && (x += "rotateY(" + h + zt), f !== Lt && (x += "rotateX(" + f + zt), (d !== Lt || _ !== Lt) && (x += "skew(" + d + ", " + _ + zt), (p !== 1 || c !== 1) && (x += "scale(" + p + ", " + c + zt), v.style[L] = x || "translate(0, 0)";
}, Ws = function(t, e) {
  var i = e || this, r = i.xPercent, n = i.yPercent, s = i.x, a = i.y, l = i.rotation, u = i.skewX, h = i.skewY, f = i.scaleX, d = i.scaleY, _ = i.target, p = i.xOrigin, c = i.yOrigin, m = i.xOffset, g = i.yOffset, v = i.forceCSS, w = parseFloat(s), x = parseFloat(a), y, S, b, T, k;
  l = parseFloat(l), u = parseFloat(u), h = parseFloat(h), h && (h = parseFloat(h), u += h, l += h), l || u ? (l *= jt, u *= jt, y = Math.cos(l) * f, S = Math.sin(l) * f, b = Math.sin(l - u) * -d, T = Math.cos(l - u) * d, u && (h *= jt, k = Math.tan(u - h), k = Math.sqrt(1 + k * k), b *= k, T *= k, h && (k = Math.tan(h), k = Math.sqrt(1 + k * k), y *= k, S *= k)), y = V(y), S = V(S), b = V(b), T = V(T)) : (y = f, T = d, S = b = 0), (w && !~(s + "").indexOf("px") || x && !~(a + "").indexOf("px")) && (w = Mt(_, "x", s, "px"), x = Mt(_, "y", a, "px")), (p || c || m || g) && (w = V(w + p - (p * y + c * b) + m), x = V(x + c - (p * S + c * T) + g)), (r || n) && (k = _.getBBox(), w = V(w + r / 100 * k.width), x = V(x + n / 100 * k.height)), k = "matrix(" + y + "," + S + "," + b + "," + T + "," + w + "," + x + ")", _.setAttribute("transform", k), v && (_.style[L] = k);
}, Ys = function(t, e, i, r, n) {
  var s = 360, a = X(n), l = parseFloat(n) * (a && ~n.indexOf("rad") ? Ft : 1), u = l - r, h = r + u + "deg", f, d;
  return a && (f = n.split("_")[1], f === "short" && (u %= s, u !== u % (s / 2) && (u += u < 0 ? s : -s)), f === "cw" && u < 0 ? u = (u + s * $i) % s - ~~(u / s) * s : f === "ccw" && u > 0 && (u = (u - s * $i) % s - ~~(u / s) * s)), t._pt = d = new tt(t._pt, e, i, r, u, Cs), d.e = h, d.u = "deg", t._props.push(i), d;
}, Ki = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, Xs = function(t, e, i) {
  var r = Ki({}, i._gsap), n = "perspective,force3D,transformOrigin,svgOrigin", s = i.style, a, l, u, h, f, d, _, p;
  r.svg ? (u = i.getAttribute("transform"), i.setAttribute("transform", ""), s[L] = e, a = ye(i, 1), Et(i, L), i.setAttribute("transform", u)) : (u = getComputedStyle(i)[L], s[L] = e, a = ye(i, 1), s[L] = u);
  for (l in bt)
    u = r[l], h = a[l], u !== h && n.indexOf(l) < 0 && (_ = G(u), p = G(h), f = _ !== p ? Mt(i, l, u, p) : parseFloat(u), d = parseFloat(h), t._pt = new tt(t._pt, a, l, f, d - f, oi), t._pt.u = p || 0, t._props.push(l));
  Ki(a, r);
};
J("padding,margin,Width,Radius", function(o, t) {
  var e = "Top", i = "Right", r = "Bottom", n = "Left", s = (t < 3 ? [e, i, r, n] : [e + n, e + i, r + i, r + n]).map(function(a) {
    return t < 2 ? o + a : "border" + a + o;
  });
  Re[t > 1 ? "border" + o : o] = function(a, l, u, h, f) {
    var d, _;
    if (arguments.length < 4)
      return d = s.map(function(p) {
        return wt(a, p, u);
      }), _ = d.join(" "), _.split(d[0]).length === 5 ? d[0] : _;
    d = (h + "").split(" "), _ = {}, s.forEach(function(p, c) {
      return _[p] = d[c] = d[c] || d[(c - 1) / 2 | 0];
    }), a.init(l, _, f);
  };
});
var Zr = {
  name: "css",
  register: li,
  targetTest: function(t) {
    return t.style && t.nodeType;
  },
  init: function(t, e, i, r, n) {
    var s = this._props, a = t.style, l = i.vars.startAt, u, h, f, d, _, p, c, m, g, v, w, x, y, S, b, T, k;
    Si || li(), this.styles = this.styles || Yr(t), T = this.styles.props, this.tween = i;
    for (c in e)
      if (c !== "autoRound" && (h = e[c], !(rt[c] && Lr(c, e, i, r, t, n)))) {
        if (_ = typeof h, p = Re[c], _ === "function" && (h = h.call(i, r, t, n), _ = typeof h), _ === "string" && ~h.indexOf("random(") && (h = pe(h)), p)
          p(this, t, c, h, i) && (b = 1);
        else if (c.substr(0, 2) === "--")
          u = (getComputedStyle(t).getPropertyValue(c) + "").trim(), h += "", Ct.lastIndex = 0, Ct.test(u) || (m = G(u), g = G(h), g ? m !== g && (u = Mt(t, c, u, g) + g) : m && (h += m)), this.add(a, "setProperty", u, h, r, n, 0, 0, c), s.push(c), T.push(c, 0, a[c]);
        else if (_ !== "undefined") {
          if (l && c in l ? (u = typeof l[c] == "function" ? l[c].call(i, r, t, n) : l[c], X(u) && ~u.indexOf("random(") && (u = pe(u)), G(u + "") || u === "auto" || (u += at.units[c] || G(wt(t, c)) || ""), (u + "").charAt(1) === "=" && (u = wt(t, c))) : u = wt(t, c), d = parseFloat(u), v = _ === "string" && h.charAt(1) === "=" && h.substr(0, 2), v && (h = h.substr(2)), f = parseFloat(h), c in mt && (c === "autoAlpha" && (d === 1 && wt(t, "visibility") === "hidden" && f && (d = 0), T.push("visibility", 0, a.visibility), St(this, a, "visibility", d ? "inherit" : "hidden", f ? "inherit" : "hidden", !f)), c !== "scale" && c !== "transform" && (c = mt[c], ~c.indexOf(",") && (c = c.split(",")[0]))), w = c in bt, w) {
            if (this.styles.save(c), k = h, _ === "string" && h.substring(0, 6) === "var(--") {
              if (h = ot(t, h.substring(4, h.indexOf(")"))), h.substring(0, 5) === "calc(") {
                var P = t.style.perspective;
                t.style.perspective = h, h = ot(t, "perspective"), P ? t.style.perspective = P : Et(t, "perspective");
              }
              f = parseFloat(h);
            }
            if (x || (y = t._gsap, y.renderTransform && !e.parseTransform || ye(t, e.parseTransform), S = e.smoothOrigin !== !1 && y.smooth, x = this._pt = new tt(this._pt, a, L, 0, 1, y.renderTransform, y, 0, -1), x.dep = 1), c === "scale")
              this._pt = new tt(this._pt, y, "scaleY", y.scaleY, (v ? Ht(y.scaleY, v + f) : f) - y.scaleY || 0, oi), this._pt.u = 0, s.push("scaleY", c), c += "X";
            else if (c === "transformOrigin") {
              T.push(et, 0, a[et]), h = Vs(h), y.svg ? ui(t, h, 0, S, 0, this) : (g = parseFloat(h.split(" ")[2]) || 0, g !== y.zOrigin && St(this, y, "zOrigin", y.zOrigin, g), St(this, a, c, Le(u), Le(h)));
              continue;
            } else if (c === "svgOrigin") {
              ui(t, h, 1, S, 0, this);
              continue;
            } else if (c in jr) {
              Ys(this, y, c, d, v ? Ht(d, v + h) : h);
              continue;
            } else if (c === "smoothOrigin") {
              St(this, y, "smooth", y.smooth, h);
              continue;
            } else if (c === "force3D") {
              y[c] = h;
              continue;
            } else if (c === "transform") {
              Xs(this, h, t);
              continue;
            }
          } else c in a || (c = te(c) || c);
          if (w || (f || f === 0) && (d || d === 0) && !Ps.test(h) && c in a)
            m = (u + "").substr((d + "").length), f || (f = 0), g = G(h) || (c in at.units ? at.units[c] : m), m !== g && (d = Mt(t, c, u, g)), this._pt = new tt(this._pt, w ? y : a, c, d, (v ? Ht(d, v + f) : f) - d, !w && (g === "px" || c === "zIndex") && e.autoRound !== !1 ? Ms : oi), this._pt.u = g || 0, w && k !== h ? (this._pt.b = u, this._pt.e = k, this._pt.r = Es) : m !== g && g !== "%" && (this._pt.b = u, this._pt.r = Os);
          else if (c in a)
            Ns.call(this, t, c, u, v ? v + h : h);
          else if (c in t)
            this.add(t, c, u || t[c], v ? v + h : h, r, n);
          else if (c !== "parseTransform") {
            pi(c, h);
            continue;
          }
          w || (c in a ? T.push(c, 0, a[c]) : typeof t[c] == "function" ? T.push(c, 2, t[c]()) : T.push(c, 1, u || t[c])), s.push(c);
        }
      }
    b && Nr(this);
  },
  render: function(t, e) {
    if (e.tween._time || !Pi())
      for (var i = e._pt; i; )
        i.r(t, i.d), i = i._next;
    else
      e.styles.revert();
  },
  get: wt,
  aliases: mt,
  getSetter: function(t, e, i) {
    var r = mt[e];
    return r && r.indexOf(",") < 0 && (e = r), e in bt && e !== et && (t._gsap.x || wt(t, "x")) ? i && Bi === i ? e === "scale" ? Ls : Rs : (Bi = i || {}) && (e === "scale" ? zs : Fs) : t.style && !fi(t.style[e]) ? As : ~e.indexOf("-") ? Ds : ki(t, e);
  },
  core: {
    _removeProperty: Et,
    _getMatrix: Oi
  }
};
it.utils.checkPrefix = te;
it.core.getStyleSaver = Yr;
(function(o, t, e, i) {
  var r = J(o + "," + t + "," + e, function(n) {
    bt[n] = 1;
  });
  J(t, function(n) {
    at.units[n] = "deg", jr[n] = 1;
  }), mt[r[13]] = o + "," + t, J(i, function(n) {
    var s = n.split(":");
    mt[s[1]] = r[s[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
J("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(o) {
  at.units[o] = "px";
});
it.registerPlugin(Zr);
var I = it.registerPlugin(Zr) || it;
I.core.Tween;
let Qi;
function Jr() {
  clearInterval(Qi);
  const o = document.querySelectorAll('[aria-label="time"]');
  if (!o.length) return;
  const t = () => {
    const e = (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !1
    });
    o.forEach((i) => i.textContent = `${e} CET`);
  };
  t(), Qi = setInterval(t, 1e3);
}
function oe() {
  const o = document.querySelectorAll('[aria-label="freelance"]');
  o.length && (I.killTweensOf(o), I.set(o, { opacity: 1 }), I.to(o, { opacity: 0, duration: 0.6, ease: "none", repeat: -1, yoyo: !0 }));
}
function Hs() {
  var a, l;
  document.querySelectorAll(".work-list .work-item").forEach((u, h) => {
    const f = u.querySelector("p[data-index]");
    f && (f.textContent = String(h + 1).padStart(3, "0"));
  }), Jr(), window.innerWidth >= 992 && document.querySelectorAll(".work-item").forEach((u) => {
    const h = u.querySelector(".work-link"), f = u.querySelector(".work-media");
    if (!h || !f) return;
    const d = f.querySelector("video[data-src]"), _ = f.querySelector("img"), p = [_, d].filter(Boolean);
    I.set(p, { opacity: 0 });
    const c = (x) => I.to(x, { opacity: 1, duration: 0.6, ease: "power1.inOut", delay: 0.3 }), m = (x) => {
      I.killTweensOf(x), I.set(x, { opacity: 0 });
    };
    let g = !1, v = !1, w = !1;
    h.addEventListener("mouseenter", () => {
      w = !0, f.style.opacity = "1", _ && c(_), d && (g ? v && (c(d), d.play().catch(() => {
      })) : (g = !0, d.src = d.dataset.src, d.load(), d.addEventListener("canplay", () => {
        v = !0, w && (c(d), d.play().catch(() => {
        }));
      }, { once: !0 })));
    }), h.addEventListener("mouseleave", () => {
      w = !1, f.style.opacity = "0", m(p), d && v && d.pause();
    });
  });
  const o = [...((a = document.querySelector(".header")) == null ? void 0 : a.children) ?? []], t = document.querySelector(".footer"), e = !!(t != null && t.dataset.animated), i = e ? [] : [...(t == null ? void 0 : t.children) ?? []], r = [...((l = document.querySelector(".about")) == null ? void 0 : l.children) ?? []], n = document.querySelector(".work");
  n && (r.push(...[...n.children].filter((u) => !u.classList.contains("work-wrapper"))), r.push(...n.querySelectorAll(".work-list .work-item .work-link")));
  const s = [...o, ...i, ...r];
  s.length && (I.set(s, { opacity: 0, backgroundColor: "var(--light-black)" }), I.timeline({
    onComplete() {
      s.forEach((u) => {
        u.style.transition = "background-color 600ms ease", u.style.backgroundColor = "transparent", u.style.pointerEvents = "auto";
      }), setTimeout(() => s.forEach((u) => {
        u.style.transition = "", u.style.backgroundColor = "";
      }), 650), !e && t && (t.dataset.animated = "true"), oe();
    }
  }).to(o, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.04 }).to(i, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.04 }, "<").to(r, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.08 }));
}
function Gs() {
  var f, d;
  Jr();
  const o = document.querySelector(".work-list .work-item .work-link.w--current");
  o && (o.closest(".work-item").style.display = "none");
  const t = document.querySelector(".media");
  if (t) {
    const _ = [...t.querySelectorAll(".media-item")];
    for (let g = _.length - 1; g > 0; g--) {
      const v = Math.floor(Math.random() * (g + 1));
      [_[g], _[v]] = [_[v], _[g]];
    }
    _.forEach((g) => t.appendChild(g));
    const p = window.innerWidth, c = p < 768 ? [100] : p < 992 ? [50, 52.5, 55, 57.5, 60, 62.5, 65, 67.5, 70, 72.5, 75] : [40, 42.5, 45, 47.5, 50, 52.5, 55, 57.5, 60], m = String(_.length).padStart(3, "0");
    _.forEach((g, v) => {
      const w = g.querySelector(".media-video, .media-img-inner");
      w && (w.style.width = c[Math.floor(Math.random() * c.length)] + "%");
      const x = g.querySelector("p[media-index]");
      x && (x.textContent = `${String(v + 1).padStart(3, "0")} / ${m}`);
    });
  }
  document.querySelectorAll(".work-list .work-item").forEach((_, p) => {
    const c = _.querySelector("p[data-index]");
    c && (c.textContent = String(p + 1).padStart(3, "0"));
  }), document.querySelectorAll(".media-item").forEach((_) => {
    const p = _.querySelector("img"), c = _.querySelector("video");
    if (p) {
      I.set(p, { opacity: 0 });
      const m = () => I.to(p, { opacity: 1, duration: 0.6, ease: "power1.inOut", delay: 0.3 });
      p.complete && p.naturalWidth ? m() : p.addEventListener("load", m, { once: !0 });
    }
    c && (I.set(c, { opacity: 0 }), c.addEventListener("canplay", () => {
      I.to(c, { opacity: 1, duration: 0.6, ease: "power1.inOut", delay: 0.3 }), c.play().catch(() => {
      });
    }, { once: !0 }));
  });
  const e = [...((f = document.querySelector(".header")) == null ? void 0 : f.children) ?? []], i = document.querySelector(".footer"), r = !!(i != null && i.dataset.animated), n = r ? [] : [...(i == null ? void 0 : i.children) ?? []], s = [...e, ...n], a = document.querySelector(".media"), l = [...((d = document.querySelector(".about")) == null ? void 0 : d.children) ?? []], u = document.querySelector(".work");
  u && (l.push(...[...u.children].filter((_) => !_.classList.contains("work-wrapper"))), l.push(...u.querySelectorAll(".work-list .work-item .work-link"))), a && I.set(a, { opacity: 0 }), l.length && I.set(l, { opacity: 0, backgroundColor: "var(--light-black)" });
  const h = (_) => {
    _.forEach((p) => {
      p.style.transition = "background-color 600ms ease", p.style.backgroundColor = "transparent", p.style.pointerEvents = "auto";
    }), setTimeout(() => _.forEach((p) => {
      p.style.transition = "", p.style.backgroundColor = "";
    }), 650);
  };
  if (!s.length) {
    a && I.to(a, { opacity: 1, duration: 0.6, ease: "power1.inOut", pointerEvents: "auto" });
    return;
  }
  I.set(s, { opacity: 0, backgroundColor: "var(--light-black)" }), I.timeline({
    onComplete() {
      h(s), !r && i && (i.dataset.animated = "true"), a ? I.to(a, {
        opacity: 1,
        duration: 0.6,
        ease: "power1.inOut",
        pointerEvents: "auto",
        onComplete() {
          l.length ? I.timeline({ onComplete: () => {
            h(l), oe();
          } }).to(l, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.08 }) : oe();
        }
      }) : l.length ? I.timeline({ onComplete: () => {
        h(l), oe();
      } }).to(l, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.08 }) : oe();
    }
  }).to(e, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.04 }).to(n, { opacity: 1, duration: 0.6, ease: "power1.inOut", stagger: 0.04 }, "<");
}
function tn() {
  var t;
  switch ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) {
    case "home":
      Hs();
      break;
    case "details":
      Gs();
      break;
  }
}
let Zi;
function js() {
  Zi = new Cn({
    containers: ["#swup"],
    animationSelector: '[class*="transition-"]'
  }), Zi.hooks.on("page:view", () => {
    tn();
  });
}
js();
tn();
