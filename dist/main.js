const Nt = /* @__PURE__ */ new WeakMap();
function Ut(e, t, n, o) {
  if (!e && !Nt.has(t))
    return !1;
  const s = Nt.get(t) ?? /* @__PURE__ */ new WeakMap();
  Nt.set(t, s);
  const i = s.get(n) ?? /* @__PURE__ */ new Set();
  s.set(n, i);
  const r = i.has(o);
  return e ? i.add(o) : i.delete(o), r && e;
}
function qe(e, t) {
  let n = e.target;
  if (n instanceof Text && (n = n.parentElement), n instanceof Element && e.currentTarget instanceof Node) {
    const o = n.closest(t);
    if (o && e.currentTarget.contains(o))
      return o;
  }
}
function Be(e, t, n, o = {}) {
  const { signal: s, base: i = document } = o;
  if (s != null && s.aborted)
    return;
  const { once: r, ...c } = o, a = i instanceof Document ? i.documentElement : i, l = !!(typeof o == "object" ? o.capture : o), d = (w) => {
    const h = qe(w, String(e));
    if (h) {
      const m = Object.assign(w, { delegateTarget: h });
      n.call(a, m), r && (a.removeEventListener(t, d, c), Ut(!1, a, n, u));
    }
  }, u = JSON.stringify({ selector: e, type: t, capture: l });
  Ut(!0, a, n, u) || a.addEventListener(t, d, c), s == null || s.addEventListener("abort", () => {
    Ut(!1, a, n, u);
  });
}
function q() {
  return q = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var o in n) ({}).hasOwnProperty.call(n, o) && (e[o] = n[o]);
    }
    return e;
  }, q.apply(null, arguments);
}
const de = (e, t) => String(e).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || t || "", yt = ({ hash: e } = {}) => window.location.pathname + window.location.search + (e ? window.location.hash : ""), Fe = (e, t = {}) => {
  const n = q({ url: e = e || yt({ hash: !0 }), random: Math.random(), source: "swup" }, t);
  window.history.pushState(n, "", e);
}, vt = (e = null, t = {}) => {
  e = e || yt({ hash: !0 });
  const n = q({}, window.history.state || {}, { url: e, random: Math.random(), source: "swup" }, t);
  window.history.replaceState(n, "", e);
}, Ne = (e, t, n, o) => {
  const s = new AbortController();
  return o = q({}, o, { signal: s.signal }), Be(e, t, n, o), { destroy: () => s.abort() };
};
class R extends URL {
  constructor(t, n = document.baseURI) {
    super(t.toString(), n), Object.setPrototypeOf(this, R.prototype);
  }
  get url() {
    return this.pathname + this.search;
  }
  static fromElement(t) {
    const n = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
    return new R(n);
  }
  static fromUrl(t) {
    return new R(t);
  }
}
class Lt extends Error {
  constructor(t, n) {
    super(t), this.url = void 0, this.status = void 0, this.aborted = void 0, this.timedOut = void 0, this.name = "FetchError", this.url = n.url, this.status = n.status, this.aborted = n.aborted || !1, this.timedOut = n.timedOut || !1;
  }
}
async function Ue(e, t = {}) {
  var n;
  e = R.fromUrl(e).url;
  const { visit: o = this.visit } = t, s = q({}, this.options.requestHeaders, t.headers), i = (n = t.timeout) != null ? n : this.options.timeout, r = new AbortController(), { signal: c } = r;
  t = q({}, t, { headers: s, signal: c });
  let a, l = !1, d = null;
  i && i > 0 && (d = setTimeout(() => {
    l = !0, r.abort("timeout");
  }, i));
  try {
    a = await this.hooks.call("fetch:request", o, { url: e, options: t }, (g, { url: p, options: v }) => fetch(p, v)), d && clearTimeout(d);
  } catch (g) {
    throw l ? (this.hooks.call("fetch:timeout", o, { url: e }), new Lt(`Request timed out: ${e}`, { url: e, timedOut: l })) : (g == null ? void 0 : g.name) === "AbortError" || c.aborted ? new Lt(`Request aborted: ${e}`, { url: e, aborted: !0 }) : g;
  }
  const { status: u, url: f } = a, w = await a.text();
  if (u === 500) throw this.hooks.call("fetch:error", o, { status: u, response: a, url: f }), new Lt(`Server error: ${f}`, { status: u, url: f });
  if (!w) throw new Lt(`Empty response: ${f}`, { status: u, url: f });
  const { url: h } = R.fromUrl(f), m = { url: h, html: w };
  return !o.cache.write || t.method && t.method !== "GET" || e !== h || this.cache.set(m.url, m), m;
}
class Ve {
  constructor(t) {
    this.swup = void 0, this.pages = /* @__PURE__ */ new Map(), this.swup = t;
  }
  get size() {
    return this.pages.size;
  }
  get all() {
    const t = /* @__PURE__ */ new Map();
    return this.pages.forEach((n, o) => {
      t.set(o, q({}, n));
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
    const o = q({}, this.get(t), n, { url: t });
    this.pages.set(t, o);
  }
  delete(t) {
    this.pages.delete(this.resolve(t));
  }
  clear() {
    this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0, void 0);
  }
  prune(t) {
    this.pages.forEach((n, o) => {
      t(o, n) && this.delete(o);
    });
  }
  resolve(t) {
    const { url: n } = R.fromUrl(t);
    return this.swup.resolveUrl(n);
  }
}
const Ht = (e, t = document) => t.querySelector(e), zt = (e, t = document) => Array.from(t.querySelectorAll(e)), fe = () => new Promise((e) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      e();
    });
  });
});
function he(e) {
  return !!e && (typeof e == "object" || typeof e == "function") && typeof e.then == "function";
}
function He(e, t = []) {
  return new Promise((n, o) => {
    const s = e(...t);
    he(s) ? s.then(n, o) : n(s);
  });
}
function ie(e, t) {
  const n = e == null ? void 0 : e.closest(`[${t}]`);
  return n != null && n.hasAttribute(t) ? (n == null ? void 0 : n.getAttribute(t)) || !0 : void 0;
}
class $e {
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
      const n = t.className.split(" ").filter((o) => this.isSwupClass(o));
      t.classList.remove(...n);
    });
  }
  isSwupClass(t) {
    return this.swupClasses.some((n) => t.startsWith(n));
  }
}
class pe {
  constructor(t, n) {
    this.id = void 0, this.state = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, this.animation = void 0, this.trigger = void 0, this.cache = void 0, this.history = void 0, this.scroll = void 0, this.meta = void 0;
    const { to: o, from: s, hash: i, el: r, event: c } = n;
    this.id = Math.random(), this.state = 1, this.from = { url: s ?? t.location.url, hash: t.location.hash }, this.to = { url: o, hash: i }, this.containers = t.options.containers, this.animation = { animate: !0, wait: !1, name: void 0, native: t.options.native, scope: t.options.animationScope, selector: t.options.animationSelector }, this.trigger = { el: r, event: c }, this.cache = { read: t.options.cache, write: t.options.cache }, this.history = { action: "push", popstate: !1, direction: void 0 }, this.scroll = { reset: !0, target: void 0 }, this.meta = {};
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
function Re(e) {
  return new pe(this, e);
}
class je {
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
  on(t, n, o = {}) {
    const s = this.get(t);
    if (!s) return console.warn(`Hook '${t}' not found.`), () => {
    };
    const i = q({}, o, { id: s.size + 1, hook: t, handler: n });
    return s.set(n, i), () => this.off(t, n);
  }
  before(t, n, o = {}) {
    return this.on(t, n, q({}, o, { before: !0 }));
  }
  replace(t, n, o = {}) {
    return this.on(t, n, q({}, o, { replace: !0 }));
  }
  once(t, n, o = {}) {
    return this.on(t, n, q({}, o, { once: !0 }));
  }
  off(t, n) {
    const o = this.get(t);
    o && n ? o.delete(n) || console.warn(`Handler for hook '${t}' not found.`) : o && o.clear();
  }
  async call(t, n, o, s) {
    const [i, r, c] = this.parseCallArgs(t, n, o, s), { before: a, handler: l, after: d } = this.getHandlers(t, c);
    await this.run(a, i, r);
    const [u] = await this.run(l, i, r, !0);
    return await this.run(d, i, r), this.dispatchDomEvent(t, i, r), u;
  }
  callSync(t, n, o, s) {
    const [i, r, c] = this.parseCallArgs(t, n, o, s), { before: a, handler: l, after: d } = this.getHandlers(t, c);
    this.runSync(a, i, r);
    const [u] = this.runSync(l, i, r, !0);
    return this.runSync(d, i, r), this.dispatchDomEvent(t, i, r), u;
  }
  parseCallArgs(t, n, o, s) {
    return n instanceof pe || typeof n != "object" && typeof o != "function" ? [n, o, s] : [void 0, n, o];
  }
  async run(t, n = this.swup.visit, o, s = !1) {
    const i = [];
    for (const { hook: r, handler: c, defaultHandler: a, once: l } of t) if (n == null || !n.done) {
      l && this.off(r, c);
      try {
        const d = await He(c, [n, o, a]);
        i.push(d);
      } catch (d) {
        if (s) throw d;
        console.error(`Error in hook '${r}':`, d);
      }
    }
    return i;
  }
  runSync(t, n = this.swup.visit, o, s = !1) {
    const i = [];
    for (const { hook: r, handler: c, defaultHandler: a, once: l } of t) if (n == null || !n.done) {
      l && this.off(r, c);
      try {
        const d = c(n, o, a);
        i.push(d), he(d) && console.warn(`Swup will not await Promises in handler for synchronous hook '${r}'.`);
      } catch (d) {
        if (s) throw d;
        console.error(`Error in hook '${r}':`, d);
      }
    }
    return i;
  }
  getHandlers(t, n) {
    const o = this.get(t);
    if (!o) return { found: !1, before: [], handler: [], after: [], replaced: !1 };
    const s = Array.from(o.values()), i = this.sortRegistrations, r = s.filter(({ before: u, replace: f }) => u && !f).sort(i), c = s.filter(({ replace: u }) => u).filter((u) => !0).sort(i), a = s.filter(({ before: u, replace: f }) => !u && !f).sort(i), l = c.length > 0;
    let d = [];
    if (n && (d = [{ id: 0, hook: t, handler: n }], l)) {
      const u = c.length - 1, { handler: f, once: w } = c[u], h = (m) => {
        const g = c[m - 1];
        return g ? (p, v) => g.handler(p, v, h(m - 1)) : n;
      };
      d = [{ id: 0, hook: t, once: w, handler: f, defaultHandler: h(u) }];
    }
    return { found: !0, before: r, handler: d, after: a, replaced: l };
  }
  sortRegistrations(t, n) {
    var o, s;
    return ((o = t.priority) != null ? o : 0) - ((s = n.priority) != null ? s : 0) || t.id - n.id || 0;
  }
  dispatchDomEvent(t, n, o) {
    if (n != null && n.done) return;
    const s = { hook: t, args: o, visit: n || this.swup.visit };
    document.dispatchEvent(new CustomEvent("swup:any", { detail: s, bubbles: !0 })), document.dispatchEvent(new CustomEvent(`swup:${t}`, { detail: s, bubbles: !0 }));
  }
  parseName(t) {
    const [n, ...o] = t.split(".");
    return [n, o.reduce((s, i) => q({}, s, { [i]: !0 }), {})];
  }
}
const ze = (e) => {
  if (e && e.charAt(0) === "#" && (e = e.substring(1)), !e) return null;
  const t = decodeURIComponent(e);
  let n = document.getElementById(e) || document.getElementById(t) || Ht(`a[name='${CSS.escape(e)}']`) || Ht(`a[name='${CSS.escape(t)}']`);
  return n || e !== "top" || (n = document.body), n;
}, It = "transition", Vt = "animation";
async function We({ selector: e, elements: t }) {
  if (e === !1 && !t) return;
  let n = [];
  if (t) n = Array.from(t);
  else if (e && (n = zt(e, document.body), !n.length)) return void console.warn(`[swup] No elements found matching animationSelector \`${e}\``);
  const o = n.map((s) => (function(i) {
    const { type: r, timeout: c, propCount: a } = (function(l) {
      const d = window.getComputedStyle(l), u = At(d, `${It}Delay`), f = At(d, `${It}Duration`), w = re(u, f), h = At(d, `${Vt}Delay`), m = At(d, `${Vt}Duration`), g = re(h, m), p = Math.max(w, g), v = p > 0 ? w > g ? It : Vt : null;
      return { type: v, timeout: p, propCount: v ? v === It ? f.length : m.length : 0 };
    })(i);
    return !(!r || !c) && new Promise((l) => {
      const d = `${r}end`, u = performance.now();
      let f = 0;
      const w = () => {
        i.removeEventListener(d, h), l();
      }, h = (m) => {
        m.target === i && ((performance.now() - u) / 1e3 < m.elapsedTime || ++f >= a && w());
      };
      setTimeout(() => {
        f < a && w();
      }, c + 1), i.addEventListener(d, h);
    });
  })(s));
  o.filter(Boolean).length > 0 ? await Promise.all(o) : e && console.warn(`[swup] No CSS animation duration defined on elements matching \`${e}\``);
}
function At(e, t) {
  return (e[t] || "").split(", ");
}
function re(e, t) {
  for (; e.length < t.length; ) e = e.concat(e);
  return Math.max(...t.map((n, o) => ae(n) + ae(e[o])));
}
function ae(e) {
  return 1e3 * parseFloat(e);
}
function Ge(e, t = {}, n = {}) {
  if (typeof e != "string") throw new Error("swup.navigate() requires a URL parameter");
  if (this.shouldIgnoreVisit(e, { el: n.el, event: n.event })) return void window.location.assign(e);
  const { url: o, hash: s } = R.fromUrl(e), i = this.createVisit(q({}, n, { to: o, hash: s }));
  this.performNavigation(i, t);
}
async function _e(e, t = {}) {
  if (this.navigating) {
    if (this.visit.state >= 6) return e.state = 2, void (this.onVisitEnd = () => this.performNavigation(e, t));
    await this.hooks.call("visit:abort", this.visit, void 0), delete this.visit.to.document, this.visit.state = 8;
  }
  this.navigating = !0, this.visit = e;
  const { el: n } = e.trigger;
  t.referrer = t.referrer || this.location.url, t.animate === !1 && (e.animation.animate = !1), e.animation.animate || this.classes.clear();
  const o = t.history || ie(n, "data-swup-history");
  typeof o == "string" && ["push", "replace"].includes(o) && (e.history.action = o);
  const s = t.animation || ie(n, "data-swup-animation");
  var i, r;
  typeof s == "string" && (e.animation.name = s), e.meta = t.meta || {}, typeof t.cache == "object" ? (e.cache.read = (i = t.cache.read) != null ? i : e.cache.read, e.cache.write = (r = t.cache.write) != null ? r : e.cache.write) : t.cache !== void 0 && (e.cache = { read: !!t.cache, write: !!t.cache }), delete t.cache;
  try {
    await this.hooks.call("visit:start", e, void 0), e.state = 3;
    const c = this.hooks.call("page:load", e, { options: t }, async (l, d) => {
      let u;
      return l.cache.read && (u = this.cache.get(l.to.url)), d.page = u || await this.fetchPage(l.to.url, d.options), d.cache = !!u, d.page;
    });
    c.then(({ html: l }) => {
      e.advance(5), e.to.html = l, e.to.document = new DOMParser().parseFromString(l, "text/html");
    });
    const a = e.to.url + e.to.hash;
    if (e.history.popstate || (e.history.action === "replace" || e.to.url === this.location.url ? vt(a) : (this.currentHistoryIndex++, Fe(a, { index: this.currentHistoryIndex }))), this.location = R.fromUrl(a), e.history.popstate && this.classes.add("is-popstate"), e.animation.name && this.classes.add(`to-${de(e.animation.name)}`), e.animation.wait && await c, e.done || (await this.hooks.call("visit:transition", e, void 0, async () => {
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
const Ke = async function(e) {
  await this.hooks.call("animation:out:start", e, void 0, () => {
    this.classes.add("is-changing", "is-animating", "is-leaving");
  }), await this.hooks.call("animation:out:await", e, { skip: !1 }, (t, { skip: n }) => {
    if (!n) return this.awaitAnimations({ selector: t.animation.selector });
  }), await this.hooks.call("animation:out:end", e, void 0);
}, Qe = function(e) {
  var t;
  const n = e.to.document;
  if (!n) return !1;
  const o = ((t = n.querySelector("title")) == null ? void 0 : t.innerText) || "";
  document.title = o;
  const s = zt('[data-swup-persist]:not([data-swup-persist=""])'), i = e.containers.map((r) => {
    const c = document.querySelector(r), a = n.querySelector(r);
    return c && a ? (c.replaceWith(a.cloneNode(!0)), !0) : (c || console.warn(`[swup] Container missing in current document: ${r}`), a || console.warn(`[swup] Container missing in incoming document: ${r}`), !1);
  }).filter(Boolean);
  return s.forEach((r) => {
    const c = r.getAttribute("data-swup-persist"), a = Ht(`[data-swup-persist="${c}"]`);
    a && a !== r && a.replaceWith(r);
  }), i.length === e.containers.length;
}, Xe = function(e) {
  const t = { behavior: "auto" }, { target: n, reset: o } = e.scroll, s = n ?? e.to.hash;
  let i = !1;
  return s && (i = this.hooks.callSync("scroll:anchor", e, { hash: s, options: t }, (r, { hash: c, options: a }) => {
    const l = this.getAnchorElement(c);
    return l && l.scrollIntoView(a), !!l;
  })), o && !i && (i = this.hooks.callSync("scroll:top", e, { options: t }, (r, { options: c }) => (window.scrollTo(q({ top: 0, left: 0 }, c)), !0))), i;
}, Ye = async function(e) {
  if (e.done) return;
  const t = this.hooks.call("animation:in:await", e, { skip: !1 }, (n, { skip: o }) => {
    if (!o) return this.awaitAnimations({ selector: n.animation.selector });
  });
  await fe(), await this.hooks.call("animation:in:start", e, void 0, () => {
    this.classes.remove("is-animating");
  }), await t, await this.hooks.call("animation:in:end", e, void 0);
}, Je = async function(e, t) {
  if (e.done) return;
  e.advance(6);
  const { url: n } = t;
  this.isSameResolvedUrl(yt(), n) || (vt(n), this.location = R.fromUrl(n), e.to.url = this.location.url, e.to.hash = this.location.hash), await this.hooks.call("content:replace", e, { page: t }, (o, {}) => {
    if (this.classes.remove("is-leaving"), o.animation.animate && this.classes.add("is-rendering"), !this.replaceContent(o)) throw new Error("[swup] Container mismatch, aborting");
    o.animation.animate && (this.classes.add("is-changing", "is-animating", "is-rendering"), o.animation.name && this.classes.add(`to-${de(o.animation.name)}`));
  }), await this.hooks.call("content:scroll", e, void 0, () => this.scrollToContent(e)), await this.hooks.call("page:view", e, { url: this.location.url, title: document.title });
}, Ze = function(e) {
  var t;
  if (t = e, !!(t != null && t.isSwupPlugin)) {
    if (e.swup = this, !e._checkRequirements || e._checkRequirements()) return e._beforeMount && e._beforeMount(), e.mount(), this.plugins.push(e), this.plugins;
  } else console.error("Not a swup plugin instance", e);
};
function tn(e) {
  const t = this.findPlugin(e);
  if (t) return t.unmount(), t._afterUnmount && t._afterUnmount(), this.plugins = this.plugins.filter((n) => n !== t), this.plugins;
  console.error("No such plugin", t);
}
function en(e) {
  return this.plugins.find((t) => t === e || t.name === e || t.name === `Swup${String(e)}`);
}
function nn(e) {
  if (typeof this.options.resolveUrl != "function") return console.warn("[swup] options.resolveUrl expects a callback function."), e;
  const t = this.options.resolveUrl(e);
  return t && typeof t == "string" ? t.startsWith("//") || t.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), e) : t : (console.warn("[swup] options.resolveUrl needs to return a url"), e);
}
function on(e, t) {
  return this.resolveUrl(e) === this.resolveUrl(t);
}
const sn = { animateHistoryBrowsing: !1, animationSelector: '[class*="transition-"]', animationScope: "html", cache: !0, containers: ["#swup"], hooks: {}, ignoreVisit: (e, { el: t } = {}) => !(t == null || !t.closest("[data-no-swup]")), linkSelector: "a[href]", linkToSelf: "scroll", native: !1, plugins: [], resolveUrl: (e) => e, requestHeaders: { "X-Requested-With": "swup", Accept: "text/html, application/xhtml+xml" }, skipPopStateHandling: (e) => {
  var t;
  return ((t = e.state) == null ? void 0 : t.source) !== "swup";
}, timeout: 0 };
class rn {
  get currentPageUrl() {
    return this.location.url;
  }
  constructor(t = {}) {
    var n, o;
    this.version = "4.8.3", this.options = void 0, this.defaults = sn, this.plugins = [], this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, this.location = R.fromUrl(window.location.href), this.currentHistoryIndex = void 0, this.clickDelegate = void 0, this.navigating = !1, this.onVisitEnd = void 0, this.use = Ze, this.unuse = tn, this.findPlugin = en, this.log = () => {
    }, this.navigate = Ge, this.performNavigation = _e, this.createVisit = Re, this.delegateEvent = Ne, this.fetchPage = Ue, this.awaitAnimations = We, this.renderPage = Je, this.replaceContent = Qe, this.animatePageIn = Ye, this.animatePageOut = Ke, this.scrollToContent = Xe, this.getAnchorElement = ze, this.getCurrentUrl = yt, this.resolveUrl = nn, this.isSameResolvedUrl = on, this.options = q({}, this.defaults, t), this.handleLinkClick = this.handleLinkClick.bind(this), this.handlePopState = this.handlePopState.bind(this), this.cache = new Ve(this), this.classes = new $e(this), this.hooks = new je(this), this.visit = this.createVisit({ to: "" }), this.currentHistoryIndex = (n = (o = window.history.state) == null ? void 0 : o.index) != null ? n : 1, this.enable();
  }
  async enable() {
    var t;
    const { linkSelector: n } = this.options;
    this.clickDelegate = this.delegateEvent(n, "click", this.handleLinkClick), window.addEventListener("popstate", this.handlePopState), this.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), this.options.native = this.options.native && !!document.startViewTransition, this.options.plugins.forEach((o) => this.use(o));
    for (const [o, s] of Object.entries(this.options.hooks)) {
      const [i, r] = this.hooks.parseName(o);
      this.hooks.on(i, s, r);
    }
    ((t = window.history.state) == null ? void 0 : t.source) !== "swup" && vt(null, { index: this.currentHistoryIndex }), await fe(), await this.hooks.call("enable", void 0, void 0, () => {
      const o = document.documentElement;
      o.classList.add("swup-enabled"), o.classList.toggle("swup-native", this.options.native);
    });
  }
  async destroy() {
    this.clickDelegate.destroy(), window.removeEventListener("popstate", this.handlePopState), this.cache.clear(), this.options.plugins.forEach((t) => this.unuse(t)), await this.hooks.call("disable", void 0, void 0, () => {
      const t = document.documentElement;
      t.classList.remove("swup-enabled"), t.classList.remove("swup-native");
    }), this.hooks.clear();
  }
  shouldIgnoreVisit(t, { el: n, event: o } = {}) {
    const { origin: s, url: i, hash: r } = R.fromUrl(t);
    return s !== window.location.origin || !(!n || !this.triggerWillOpenNewWindow(n)) || !!this.options.ignoreVisit(i + r, { el: n, event: o });
  }
  handleLinkClick(t) {
    const n = t.delegateTarget, { href: o, url: s, hash: i } = R.fromElement(n);
    if (this.shouldIgnoreVisit(o, { el: n, event: t })) return;
    if (this.navigating && s === this.visit.to.url) return void t.preventDefault();
    const r = this.createVisit({ to: s, hash: i, el: n, event: t });
    t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? this.hooks.callSync("link:newtab", r, { href: o }) : t.button === 0 && this.hooks.callSync("link:click", r, { el: n, event: t }, () => {
      var c;
      const a = (c = r.from.url) != null ? c : "";
      t.preventDefault(), s && s !== a ? this.isSameResolvedUrl(s, a) || this.performNavigation(r) : i ? this.hooks.callSync("link:anchor", r, { hash: i }, () => {
        vt(s + i), this.scrollToContent(r);
      }) : this.hooks.callSync("link:self", r, void 0, () => {
        this.options.linkToSelf === "navigate" ? this.performNavigation(r) : (vt(s), this.scrollToContent(r));
      });
    });
  }
  handlePopState(t) {
    var n, o, s, i;
    const r = (n = (o = t.state) == null ? void 0 : o.url) != null ? n : window.location.href;
    if (this.options.skipPopStateHandling(t) || this.isSameResolvedUrl(yt(), this.location.url)) return;
    const { url: c, hash: a } = R.fromUrl(r), l = this.createVisit({ to: c, hash: a, event: t });
    l.history.popstate = !0;
    const d = (s = (i = t.state) == null ? void 0 : i.index) != null ? s : 0;
    d && d !== this.currentHistoryIndex && (l.history.direction = d - this.currentHistoryIndex > 0 ? "forwards" : "backwards", this.currentHistoryIndex = d), l.animation.animate = !1, l.scroll.reset = !1, l.scroll.target = !1, this.options.animateHistoryBrowsing && (l.animation.animate = !0, l.scroll.reset = !0), this.hooks.callSync("history:popstate", l, { event: t }, () => {
      this.performNavigation(l);
    });
  }
  triggerWillOpenNewWindow(t) {
    return !!t.matches('[download], [target="_blank"]');
  }
}
function an() {
  const e = document.querySelector(".work-list"), t = e ? [...e.querySelectorAll(".work-item")] : [];
  for (let o = t.length - 1; o > 0; o--) {
    const s = Math.floor(Math.random() * (o + 1));
    [t[o], t[s]] = [t[s], t[o]];
  }
  t.forEach((o) => e.appendChild(o));
  const n = document.getElementById("projectsCounter");
  n && (n.textContent = `(${t.length})`);
}
function Wt(e) {
  return typeof e == "number";
}
function $t(e) {
  return typeof e == "string";
}
function Pt(e) {
  return typeof e == "boolean";
}
function ce(e) {
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
function cn(e, t) {
  if (e === 0 || t === 0 || P(e) <= P(t)) return 0;
  const n = wt(P(e), P(t));
  return P(n / e);
}
function ln(e) {
  return Math.round(e * 100) / 100;
}
function St(e) {
  return bt(e).map(Number);
}
function J(e) {
  return e[kt(e)];
}
function kt(e) {
  return Math.max(0, e.length - 1);
}
function _t(e, t) {
  return t === kt(e);
}
function le(e, t = 0) {
  return Array.from(Array(e), (n, o) => t + o);
}
function bt(e) {
  return Object.keys(e);
}
function me(e, t) {
  return [e, t].reduce((n, o) => (bt(o).forEach((s) => {
    const i = n[s], r = o[s], c = ce(i) && ce(r);
    n[s] = c ? me(i, r) : r;
  }), n), {});
}
function Rt(e, t) {
  return typeof t.MouseEvent < "u" && e instanceof t.MouseEvent;
}
function un(e, t) {
  const n = {
    start: o,
    center: s,
    end: i
  };
  function o() {
    return 0;
  }
  function s(a) {
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
  function t(s, i, r, c = {
    passive: !0
  }) {
    let a;
    if ("addEventListener" in s)
      s.addEventListener(i, r, c), a = () => s.removeEventListener(i, r, c);
    else {
      const l = s;
      l.addListener(r), a = () => l.removeListener(r);
    }
    return e.push(a), o;
  }
  function n() {
    e = e.filter((s) => s());
  }
  const o = {
    add: t,
    clear: n
  };
  return o;
}
function dn(e, t, n, o) {
  const s = Et(), i = 1e3 / 60;
  let r = null, c = 0, a = 0;
  function l() {
    s.add(e, "visibilitychange", () => {
      e.hidden && h();
    });
  }
  function d() {
    w(), s.clear();
  }
  function u(g) {
    if (!a) return;
    r || (r = g, n(), n());
    const p = g - r;
    for (r = g, c += p; c >= i; )
      n(), c -= i;
    const v = c / i;
    o(v), a && (a = t.requestAnimationFrame(u));
  }
  function f() {
    a || (a = t.requestAnimationFrame(u));
  }
  function w() {
    t.cancelAnimationFrame(a), r = null, c = 0, a = 0;
  }
  function h() {
    r = null, c = 0;
  }
  return {
    init: l,
    destroy: d,
    start: f,
    stop: w,
    update: n,
    render: o
  };
}
function fn(e, t) {
  const n = t === "rtl", o = e === "y", s = o ? "y" : "x", i = o ? "x" : "y", r = !o && n ? -1 : 1, c = d(), a = u();
  function l(h) {
    const {
      height: m,
      width: g
    } = h;
    return o ? m : g;
  }
  function d() {
    return o ? "top" : n ? "right" : "left";
  }
  function u() {
    return o ? "bottom" : n ? "left" : "right";
  }
  function f(h) {
    return h * r;
  }
  return {
    scroll: s,
    cross: i,
    startEdge: c,
    endEdge: a,
    measureSize: l,
    direction: f
  };
}
function lt(e = 0, t = 0) {
  const n = P(e - t);
  function o(l) {
    return l < e;
  }
  function s(l) {
    return l > t;
  }
  function i(l) {
    return o(l) || s(l);
  }
  function r(l) {
    return i(l) ? o(l) ? e : t : l;
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
    reachedMax: s,
    reachedMin: o,
    removeOffset: c
  };
}
function ge(e, t, n) {
  const {
    constrain: o
  } = lt(0, e), s = e + 1;
  let i = r(t);
  function r(f) {
    return n ? P((s + f) % s) : o(f);
  }
  function c() {
    return i;
  }
  function a(f) {
    return i = r(f), u;
  }
  function l(f) {
    return d().set(c() + f);
  }
  function d() {
    return ge(e, c(), n);
  }
  const u = {
    get: c,
    set: a,
    add: l,
    clone: d
  };
  return u;
}
function hn(e, t, n, o, s, i, r, c, a, l, d, u, f, w, h, m, g, p, v) {
  const {
    cross: S,
    direction: L
  } = e, C = ["INPUT", "SELECT", "TEXTAREA"], I = {
    passive: !1
  }, E = Et(), k = Et(), b = lt(50, 225).constrain(w.measure(20)), x = {
    mouse: 300,
    touch: 400
  }, A = {
    mouse: 500,
    touch: 600
  }, M = h ? 43 : 25;
  let U = !1, $ = 0, B = 0, W = !1, j = !1, K = !1, Q = !1;
  function st(y) {
    if (!v) return;
    function T(H) {
      (Pt(v) || v(y, H)) && nt(H);
    }
    const O = t;
    E.add(O, "dragstart", (H) => H.preventDefault(), I).add(O, "touchmove", () => {
    }, I).add(O, "touchend", () => {
    }).add(O, "touchstart", T).add(O, "mousedown", T).add(O, "touchcancel", F).add(O, "contextmenu", F).add(O, "click", z, !0);
  }
  function G() {
    E.clear(), k.clear();
  }
  function X() {
    const y = Q ? n : t;
    k.add(y, "touchmove", N, I).add(y, "touchend", F).add(y, "mousemove", N, I).add(y, "mouseup", F);
  }
  function Y(y) {
    const T = y.nodeName || "";
    return C.includes(T);
  }
  function _() {
    return (h ? A : x)[Q ? "mouse" : "touch"];
  }
  function tt(y, T) {
    const O = u.add(Gt(y) * -1), H = d.byDistance(y, !h).distance;
    return h || P(y) < b ? H : g && T ? H * 0.5 : d.byIndex(O.get(), 0).distance;
  }
  function nt(y) {
    const T = Rt(y, o);
    Q = T, K = h && T && !y.buttons && U, U = wt(s.get(), r.get()) >= 2, !(T && y.button !== 0) && (Y(y.target) || (W = !0, i.pointerDown(y), l.useFriction(0).useDuration(0), s.set(r), X(), $ = i.readPoint(y), B = i.readPoint(y, S), f.emit("pointerDown")));
  }
  function N(y) {
    if (!Rt(y, o) && y.touches.length >= 2) return F(y);
    const O = i.readPoint(y), H = i.readPoint(y, S), Z = wt(O, $), et = wt(H, B);
    if (!j && !Q && (!y.cancelable || (j = Z > et, !j)))
      return F(y);
    const it = i.pointerMove(y);
    Z > m && (K = !0), l.useFriction(0.3).useDuration(0.75), c.start(), s.add(L(it)), y.preventDefault();
  }
  function F(y) {
    const O = d.byDistance(0, !1).index !== u.get(), H = i.pointerUp(y) * _(), Z = tt(L(H), O), et = cn(H, Z), it = M - 10 * et, ot = p + et / 50;
    j = !1, W = !1, k.clear(), l.useDuration(it).useFriction(ot), a.distance(Z, !h), Q = !1, f.emit("pointerUp");
  }
  function z(y) {
    K && (y.stopPropagation(), y.preventDefault(), K = !1);
  }
  function V() {
    return W;
  }
  return {
    init: st,
    destroy: G,
    pointerDown: V
  };
}
function pn(e, t) {
  let o, s;
  function i(u) {
    return u.timeStamp;
  }
  function r(u, f) {
    const h = `client${(f || e.scroll) === "x" ? "X" : "Y"}`;
    return (Rt(u, t) ? u : u.touches[0])[h];
  }
  function c(u) {
    return o = u, s = u, r(u);
  }
  function a(u) {
    const f = r(u) - r(s), w = i(u) - i(o) > 170;
    return s = u, w && (o = u), f;
  }
  function l(u) {
    if (!o || !s) return 0;
    const f = r(s) - r(o), w = i(u) - i(o), h = i(u) - i(s) > 170, m = f / w;
    return w && !h && P(m) > 0.1 ? m : 0;
  }
  return {
    pointerDown: c,
    pointerMove: a,
    pointerUp: l,
    readPoint: r
  };
}
function mn() {
  function e(n) {
    const {
      offsetTop: o,
      offsetLeft: s,
      offsetWidth: i,
      offsetHeight: r
    } = n;
    return {
      top: o,
      right: s + i,
      bottom: o + r,
      left: s,
      width: i,
      height: r
    };
  }
  return {
    measure: e
  };
}
function gn(e) {
  function t(o) {
    return e * (o / 100);
  }
  return {
    measure: t
  };
}
function vn(e, t, n, o, s, i, r) {
  const c = [e].concat(o);
  let a, l, d = [], u = !1;
  function f(g) {
    return s.measureSize(r.measure(g));
  }
  function w(g) {
    if (!i) return;
    l = f(e), d = o.map(f);
    function p(v) {
      for (const S of v) {
        if (u) return;
        const L = S.target === e, C = o.indexOf(S.target), I = L ? l : d[C], E = f(L ? e : o[C]);
        if (P(E - I) >= 0.5) {
          g.reInit(), t.emit("resize");
          break;
        }
      }
    }
    a = new ResizeObserver((v) => {
      (Pt(i) || i(g, v)) && p(v);
    }), n.requestAnimationFrame(() => {
      c.forEach((v) => a.observe(v));
    });
  }
  function h() {
    u = !0, a && a.disconnect();
  }
  return {
    init: w,
    destroy: h
  };
}
function wn(e, t, n, o, s, i) {
  let r = 0, c = 0, a = s, l = i, d = e.get(), u = 0;
  function f() {
    const I = o.get() - e.get(), E = !a;
    let k = 0;
    return E ? (r = 0, n.set(o), e.set(o), k = I) : (n.set(e), r += I / a, r *= l, d += r, e.add(r), k = d - u), c = Gt(k), u = d, C;
  }
  function w() {
    const I = o.get() - t.get();
    return P(I) < 1e-3;
  }
  function h() {
    return a;
  }
  function m() {
    return c;
  }
  function g() {
    return r;
  }
  function p() {
    return S(s);
  }
  function v() {
    return L(i);
  }
  function S(I) {
    return a = I, C;
  }
  function L(I) {
    return l = I, C;
  }
  const C = {
    direction: m,
    duration: h,
    velocity: g,
    seek: f,
    settled: w,
    useBaseFriction: v,
    useBaseDuration: p,
    useFriction: L,
    useDuration: S
  };
  return C;
}
function yn(e, t, n, o, s) {
  const i = s.measure(10), r = s.measure(50), c = lt(0.1, 0.99);
  let a = !1;
  function l() {
    return !(a || !e.reachedAny(n.get()) || !e.reachedAny(t.get()));
  }
  function d(w) {
    if (!l()) return;
    const h = e.reachedMin(t.get()) ? "min" : "max", m = P(e[h] - t.get()), g = n.get() - t.get(), p = c.constrain(m / r);
    n.subtract(g * p), !w && P(g) < i && (n.set(e.constrain(n.get())), o.useDuration(25).useBaseFriction());
  }
  function u(w) {
    a = !w;
  }
  return {
    shouldConstrain: l,
    constrain: d,
    toggleActive: u
  };
}
function Sn(e, t, n, o, s) {
  const i = lt(-t + e, 0), r = u(), c = d(), a = f();
  function l(h, m) {
    return wt(h, m) <= 1;
  }
  function d() {
    const h = r[0], m = J(r), g = r.lastIndexOf(h), p = r.indexOf(m) + 1;
    return lt(g, p);
  }
  function u() {
    return n.map((h, m) => {
      const {
        min: g,
        max: p
      } = i, v = i.constrain(h), S = !m, L = _t(n, m);
      return S ? p : L || l(g, v) ? g : l(p, v) ? p : v;
    }).map((h) => parseFloat(h.toFixed(3)));
  }
  function f() {
    if (t <= e + s) return [i.max];
    if (o === "keepSnaps") return r;
    const {
      min: h,
      max: m
    } = c;
    return r.slice(h, m);
  }
  return {
    snapsContained: a,
    scrollContainLimit: c
  };
}
function bn(e, t, n) {
  const o = t[0], s = n ? o - e : J(t);
  return {
    limit: lt(s, o)
  };
}
function En(e, t, n, o) {
  const i = t.min + 0.1, r = t.max + 0.1, {
    reachedMin: c,
    reachedMax: a
  } = lt(i, r);
  function l(f) {
    return f === 1 ? a(n.get()) : f === -1 ? c(n.get()) : !1;
  }
  function d(f) {
    if (!l(f)) return;
    const w = e * (f * -1);
    o.forEach((h) => h.add(w));
  }
  return {
    loop: d
  };
}
function kn(e) {
  const {
    max: t,
    length: n
  } = e;
  function o(i) {
    const r = i - t;
    return n ? r / -n : 0;
  }
  return {
    get: o
  };
}
function xn(e, t, n, o, s) {
  const {
    startEdge: i,
    endEdge: r
  } = e, {
    groupSlides: c
  } = s, a = u().map(t.measure), l = f(), d = w();
  function u() {
    return c(o).map((m) => J(m)[r] - m[0][i]).map(P);
  }
  function f() {
    return o.map((m) => n[i] - m[i]).map((m) => -P(m));
  }
  function w() {
    return c(l).map((m) => m[0]).map((m, g) => m + a[g]);
  }
  return {
    snaps: l,
    snapsAligned: d
  };
}
function Ln(e, t, n, o, s, i) {
  const {
    groupSlides: r
  } = s, {
    min: c,
    max: a
  } = o, l = d();
  function d() {
    const f = r(i), w = !e || t === "keepSnaps";
    return n.length === 1 ? [i] : w ? f : f.slice(c, a).map((h, m, g) => {
      const p = !m, v = _t(g, m);
      if (p) {
        const S = J(g[0]) + 1;
        return le(S);
      }
      if (v) {
        const S = kt(i) - J(g)[0] + 1;
        return le(S, J(g)[0]);
      }
      return h;
    });
  }
  return {
    slideRegistry: l
  };
}
function In(e, t, n, o, s) {
  const {
    reachedAny: i,
    removeOffset: r,
    constrain: c
  } = o;
  function a(h) {
    return h.concat().sort((m, g) => P(m) - P(g))[0];
  }
  function l(h) {
    const m = e ? r(h) : c(h), g = t.map((v, S) => ({
      diff: d(v - m, 0),
      index: S
    })).sort((v, S) => P(v.diff) - P(S.diff)), {
      index: p
    } = g[0];
    return {
      index: p,
      distance: m
    };
  }
  function d(h, m) {
    const g = [h, h + n, h - n];
    if (!e) return h;
    if (!m) return a(g);
    const p = g.filter((v) => Gt(v) === m);
    return p.length ? a(p) : J(g) - n;
  }
  function u(h, m) {
    const g = t[h] - s.get(), p = d(g, m);
    return {
      index: h,
      distance: p
    };
  }
  function f(h, m) {
    const g = s.get() + h, {
      index: p,
      distance: v
    } = l(g), S = !e && i(g);
    if (!m || S) return {
      index: p,
      distance: h
    };
    const L = t[p] - v, C = h + d(L, 0);
    return {
      index: p,
      distance: C
    };
  }
  return {
    byDistance: f,
    byIndex: u,
    shortcut: d
  };
}
function An(e, t, n, o, s, i, r) {
  function c(u) {
    const f = u.distance, w = u.index !== t.get();
    i.add(f), f && (o.duration() ? e.start() : (e.update(), e.render(1), e.update())), w && (n.set(t.get()), t.set(u.index), r.emit("select"));
  }
  function a(u, f) {
    const w = s.byDistance(u, f);
    c(w);
  }
  function l(u, f) {
    const w = t.clone().set(u), h = s.byIndex(w.get(), f);
    c(h);
  }
  return {
    distance: a,
    index: l
  };
}
function Tn(e, t, n, o, s, i, r, c) {
  const a = {
    passive: !0,
    capture: !0
  };
  let l = 0;
  function d(w) {
    if (!c) return;
    function h(m) {
      if ((/* @__PURE__ */ new Date()).getTime() - l > 10) return;
      r.emit("slideFocusStart"), e.scrollLeft = 0;
      const v = n.findIndex((S) => S.includes(m));
      Wt(v) && (s.useDuration(0), o.index(v, 0), r.emit("slideFocus"));
    }
    i.add(document, "keydown", u, !1), t.forEach((m, g) => {
      i.add(m, "focus", (p) => {
        (Pt(c) || c(w, p)) && h(g);
      }, a);
    });
  }
  function u(w) {
    w.code === "Tab" && (l = (/* @__PURE__ */ new Date()).getTime());
  }
  return {
    init: d
  };
}
function gt(e) {
  let t = e;
  function n() {
    return t;
  }
  function o(a) {
    t = r(a);
  }
  function s(a) {
    t += r(a);
  }
  function i(a) {
    t -= r(a);
  }
  function r(a) {
    return Wt(a) ? a : a.get();
  }
  return {
    get: n,
    set: o,
    add: s,
    subtract: i
  };
}
function ve(e, t) {
  const n = e.scroll === "x" ? r : c, o = t.style;
  let s = null, i = !1;
  function r(f) {
    return `translate3d(${f}px,0px,0px)`;
  }
  function c(f) {
    return `translate3d(0px,${f}px,0px)`;
  }
  function a(f) {
    if (i) return;
    const w = ln(e.direction(f));
    w !== s && (o.transform = n(w), s = w);
  }
  function l(f) {
    i = !f;
  }
  function d() {
    i || (o.transform = "", t.getAttribute("style") || t.removeAttribute("style"));
  }
  return {
    clear: d,
    to: a,
    toggleActive: l
  };
}
function Cn(e, t, n, o, s, i, r, c, a) {
  const d = St(s), u = St(s).reverse(), f = p().concat(v());
  function w(E, k) {
    return E.reduce((b, x) => b - s[x], k);
  }
  function h(E, k) {
    return E.reduce((b, x) => w(b, k) > 0 ? b.concat([x]) : b, []);
  }
  function m(E) {
    return i.map((k, b) => ({
      start: k - o[b] + 0.5 + E,
      end: k + t - 0.5 + E
    }));
  }
  function g(E, k, b) {
    const x = m(k);
    return E.map((A) => {
      const M = b ? 0 : -n, U = b ? n : 0, $ = b ? "end" : "start", B = x[A][$];
      return {
        index: A,
        loopPoint: B,
        slideLocation: gt(-1),
        translate: ve(e, a[A]),
        target: () => c.get() > B ? M : U
      };
    });
  }
  function p() {
    const E = r[0], k = h(u, E);
    return g(k, n, !1);
  }
  function v() {
    const E = t - r[0] - 1, k = h(d, E);
    return g(k, -n, !0);
  }
  function S() {
    return f.every(({
      index: E
    }) => {
      const k = d.filter((b) => b !== E);
      return w(k, t) <= 0.1;
    });
  }
  function L() {
    f.forEach((E) => {
      const {
        target: k,
        translate: b,
        slideLocation: x
      } = E, A = k();
      A !== x.get() && (b.to(A), x.set(A));
    });
  }
  function C() {
    f.forEach((E) => E.translate.clear());
  }
  return {
    canLoop: S,
    clear: C,
    loop: L,
    loopPoints: f
  };
}
function Dn(e, t, n) {
  let o, s = !1;
  function i(a) {
    if (!n) return;
    function l(d) {
      for (const u of d)
        if (u.type === "childList") {
          a.reInit(), t.emit("slidesChanged");
          break;
        }
    }
    o = new MutationObserver((d) => {
      s || (Pt(n) || n(a, d)) && l(d);
    }), o.observe(e, {
      childList: !0
    });
  }
  function r() {
    o && o.disconnect(), s = !0;
  }
  return {
    init: i,
    destroy: r
  };
}
function Pn(e, t, n, o) {
  const s = {};
  let i = null, r = null, c, a = !1;
  function l() {
    c = new IntersectionObserver((h) => {
      a || (h.forEach((m) => {
        const g = t.indexOf(m.target);
        s[g] = m;
      }), i = null, r = null, n.emit("slidesInView"));
    }, {
      root: e.parentElement,
      threshold: o
    }), t.forEach((h) => c.observe(h));
  }
  function d() {
    c && c.disconnect(), a = !0;
  }
  function u(h) {
    return bt(s).reduce((m, g) => {
      const p = parseInt(g), {
        isIntersecting: v
      } = s[p];
      return (h && v || !h && !v) && m.push(p), m;
    }, []);
  }
  function f(h = !0) {
    if (h && i) return i;
    if (!h && r) return r;
    const m = u(h);
    return h && (i = m), h || (r = m), m;
  }
  return {
    init: l,
    destroy: d,
    get: f
  };
}
function On(e, t, n, o, s, i) {
  const {
    measureSize: r,
    startEdge: c,
    endEdge: a
  } = e, l = n[0] && s, d = h(), u = m(), f = n.map(r), w = g();
  function h() {
    if (!l) return 0;
    const v = n[0];
    return P(t[c] - v[c]);
  }
  function m() {
    if (!l) return 0;
    const v = i.getComputedStyle(J(o));
    return parseFloat(v.getPropertyValue(`margin-${a}`));
  }
  function g() {
    return n.map((v, S, L) => {
      const C = !S, I = _t(L, S);
      return C ? f[S] + d : I ? f[S] + u : L[S + 1][c] - v[c];
    }).map(P);
  }
  return {
    slideSizes: f,
    slideSizesWithGaps: w,
    startGap: d,
    endGap: u
  };
}
function Mn(e, t, n, o, s, i, r, c, a) {
  const {
    startEdge: l,
    endEdge: d,
    direction: u
  } = e, f = Wt(n);
  function w(p, v) {
    return St(p).filter((S) => S % v === 0).map((S) => p.slice(S, S + v));
  }
  function h(p) {
    return p.length ? St(p).reduce((v, S, L) => {
      const C = J(v) || 0, I = C === 0, E = S === kt(p), k = s[l] - i[C][l], b = s[l] - i[S][d], x = !o && I ? u(r) : 0, A = !o && E ? u(c) : 0, M = P(b - A - (k + x));
      return L && M > t + a && v.push(S), E && v.push(p.length), v;
    }, []).map((v, S, L) => {
      const C = Math.max(L[S - 1] || 0);
      return p.slice(C, v);
    }) : [];
  }
  function m(p) {
    return f ? w(p, n) : h(p);
  }
  return {
    groupSlides: m
  };
}
function qn(e, t, n, o, s, i, r) {
  const {
    align: c,
    axis: a,
    direction: l,
    startIndex: d,
    loop: u,
    duration: f,
    dragFree: w,
    dragThreshold: h,
    inViewThreshold: m,
    slidesToScroll: g,
    skipSnaps: p,
    containScroll: v,
    watchResize: S,
    watchSlides: L,
    watchDrag: C,
    watchFocus: I
  } = i, E = 2, k = mn(), b = k.measure(t), x = n.map(k.measure), A = fn(a, l), M = A.measureSize(b), U = gn(M), $ = un(c, M), B = !u && !!v, W = u || !!v, {
    slideSizes: j,
    slideSizesWithGaps: K,
    startGap: Q,
    endGap: st
  } = On(A, b, x, n, W, s), G = Mn(A, M, g, u, b, x, Q, st, E), {
    snaps: X,
    snapsAligned: Y
  } = xn(A, $, b, x, G), _ = -J(X) + J(K), {
    snapsContained: tt,
    scrollContainLimit: nt
  } = Sn(M, _, Y, v, E), N = B ? tt : Y, {
    limit: F
  } = bn(_, N, u), z = ge(kt(N), d, u), V = z.clone(), D = St(n), y = ({
    dragHandler: ut,
    scrollBody: Bt,
    scrollBounds: Ft,
    options: {
      loop: xt
    }
  }) => {
    xt || Ft.constrain(ut.pointerDown()), Bt.seek();
  }, T = ({
    scrollBody: ut,
    translate: Bt,
    location: Ft,
    offsetLocation: xt,
    previousLocation: Ie,
    scrollLooper: Ae,
    slideLooper: Te,
    dragHandler: Ce,
    animation: De,
    eventHandler: Zt,
    scrollBounds: Pe,
    options: {
      loop: te
    }
  }, ee) => {
    const ne = ut.settled(), Oe = !Pe.shouldConstrain(), oe = te ? ne : ne && Oe, se = oe && !Ce.pointerDown();
    se && De.stop();
    const Me = Ft.get() * ee + Ie.get() * (1 - ee);
    xt.set(Me), te && (Ae.loop(ut.direction()), Te.loop()), Bt.to(xt.get()), se && Zt.emit("settle"), oe || Zt.emit("scroll");
  }, O = dn(o, s, () => y(qt), (ut) => T(qt, ut)), H = 0.68, Z = N[z.get()], et = gt(Z), it = gt(Z), ot = gt(Z), rt = gt(Z), pt = wn(et, ot, it, rt, f, H), Ot = In(u, N, _, F, rt), Mt = An(O, z, V, pt, Ot, rt, r), Xt = kn(F), Yt = Et(), xe = Pn(t, n, r, m), {
    slideRegistry: Jt
  } = Ln(B, v, N, nt, G, D), Le = Tn(e, n, Jt, Mt, pt, Yt, r, I), qt = {
    ownerDocument: o,
    ownerWindow: s,
    eventHandler: r,
    containerRect: b,
    slideRects: x,
    animation: O,
    axis: A,
    dragHandler: hn(A, e, o, s, rt, pn(A, s), et, O, Mt, pt, Ot, z, r, U, w, h, p, H, C),
    eventStore: Yt,
    percentOfView: U,
    index: z,
    indexPrevious: V,
    limit: F,
    location: et,
    offsetLocation: ot,
    previousLocation: it,
    options: i,
    resizeHandler: vn(t, r, s, n, A, S, k),
    scrollBody: pt,
    scrollBounds: yn(F, ot, rt, pt, U),
    scrollLooper: En(_, F, ot, [et, ot, it, rt]),
    scrollProgress: Xt,
    scrollSnapList: N.map(Xt.get),
    scrollSnaps: N,
    scrollTarget: Ot,
    scrollTo: Mt,
    slideLooper: Cn(A, M, _, j, K, X, N, ot, n),
    slideFocus: Le,
    slidesHandler: Dn(t, r, L),
    slidesInView: xe,
    slideIndexes: D,
    slideRegistry: Jt,
    slidesToScroll: G,
    target: rt,
    translate: ve(A, t)
  };
  return qt;
}
function Bn() {
  let e = {}, t;
  function n(l) {
    t = l;
  }
  function o(l) {
    return e[l] || [];
  }
  function s(l) {
    return o(l).forEach((d) => d(t, l)), a;
  }
  function i(l, d) {
    return e[l] = o(l).concat([d]), a;
  }
  function r(l, d) {
    return e[l] = o(l).filter((u) => u !== d), a;
  }
  function c() {
    e = {};
  }
  const a = {
    init: n,
    emit: s,
    off: r,
    on: i,
    clear: c
  };
  return a;
}
const Fn = {
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
function Nn(e) {
  function t(i, r) {
    return me(i, r || {});
  }
  function n(i) {
    const r = i.breakpoints || {}, c = bt(r).filter((a) => e.matchMedia(a).matches).map((a) => r[a]).reduce((a, l) => t(a, l), {});
    return t(i, c);
  }
  function o(i) {
    return i.map((r) => bt(r.breakpoints || {})).reduce((r, c) => r.concat(c), []).map(e.matchMedia);
  }
  return {
    mergeOptions: t,
    optionsAtMedia: n,
    optionsMediaQueries: o
  };
}
function Un(e) {
  let t = [];
  function n(i, r) {
    return t = r.filter(({
      options: c
    }) => e.optionsAtMedia(c).active !== !1), t.forEach((c) => c.init(i, e)), r.reduce((c, a) => Object.assign(c, {
      [a.name]: a
    }), {});
  }
  function o() {
    t = t.filter((i) => i.destroy());
  }
  return {
    init: n,
    destroy: o
  };
}
function Kt(e, t, n) {
  const o = e.ownerDocument, s = o.defaultView, i = Nn(s), r = Un(i), c = Et(), a = Bn(), {
    mergeOptions: l,
    optionsAtMedia: d,
    optionsMediaQueries: u
  } = i, {
    on: f,
    off: w,
    emit: h
  } = a, m = A;
  let g = !1, p, v = l(Fn, Kt.globalOptions), S = l(v), L = [], C, I, E;
  function k() {
    const {
      container: D,
      slides: y
    } = S;
    I = ($t(D) ? e.querySelector(D) : D) || e.children[0];
    const O = $t(y) ? I.querySelectorAll(y) : y;
    E = [].slice.call(O || I.children);
  }
  function b(D) {
    const y = qn(e, I, E, o, s, D, a);
    if (D.loop && !y.slideLooper.canLoop()) {
      const T = Object.assign({}, D, {
        loop: !1
      });
      return b(T);
    }
    return y;
  }
  function x(D, y) {
    g || (v = l(v, D), S = d(v), L = y || L, k(), p = b(S), u([v, ...L.map(({
      options: T
    }) => T)]).forEach((T) => c.add(T, "change", A)), S.active && (p.translate.to(p.location.get()), p.animation.init(), p.slidesInView.init(), p.slideFocus.init(V), p.eventHandler.init(V), p.resizeHandler.init(V), p.slidesHandler.init(V), p.options.loop && p.slideLooper.loop(), I.offsetParent && E.length && p.dragHandler.init(V), C = r.init(V, L)));
  }
  function A(D, y) {
    const T = G();
    M(), x(l({
      startIndex: T
    }, D), y), a.emit("reInit");
  }
  function M() {
    p.dragHandler.destroy(), p.eventStore.clear(), p.translate.clear(), p.slideLooper.clear(), p.resizeHandler.destroy(), p.slidesHandler.destroy(), p.slidesInView.destroy(), p.animation.destroy(), r.destroy(), c.clear();
  }
  function U() {
    g || (g = !0, c.clear(), M(), a.emit("destroy"), a.clear());
  }
  function $(D, y, T) {
    !S.active || g || (p.scrollBody.useBaseFriction().useDuration(y === !0 ? 0 : S.duration), p.scrollTo.index(D, T || 0));
  }
  function B(D) {
    const y = p.index.add(1).get();
    $(y, D, -1);
  }
  function W(D) {
    const y = p.index.add(-1).get();
    $(y, D, 1);
  }
  function j() {
    return p.index.add(1).get() !== G();
  }
  function K() {
    return p.index.add(-1).get() !== G();
  }
  function Q() {
    return p.scrollSnapList;
  }
  function st() {
    return p.scrollProgress.get(p.offsetLocation.get());
  }
  function G() {
    return p.index.get();
  }
  function X() {
    return p.indexPrevious.get();
  }
  function Y() {
    return p.slidesInView.get();
  }
  function _() {
    return p.slidesInView.get(!1);
  }
  function tt() {
    return C;
  }
  function nt() {
    return p;
  }
  function N() {
    return e;
  }
  function F() {
    return I;
  }
  function z() {
    return E;
  }
  const V = {
    canScrollNext: j,
    canScrollPrev: K,
    containerNode: F,
    internalEngine: nt,
    destroy: U,
    off: w,
    on: f,
    emit: h,
    plugins: tt,
    previousScrollSnap: X,
    reInit: m,
    rootNode: N,
    scrollNext: B,
    scrollPrev: W,
    scrollProgress: st,
    scrollSnapList: Q,
    scrollTo: $,
    selectedScrollSnap: G,
    slideNodes: z,
    slidesInView: Y,
    slidesNotInView: _
  };
  return x(t, n), setTimeout(() => a.emit("init"), 0), V;
}
Kt.globalOptions = void 0;
const Vn = {
  direction: "forward",
  speed: 2,
  startDelay: 1e3,
  active: !0,
  breakpoints: {},
  playOnInit: !0,
  stopOnFocusIn: !0,
  stopOnInteraction: !0,
  stopOnMouseEnter: !1,
  rootNode: null
};
function Hn(e, t) {
  const n = e.rootNode();
  return t && t(n) || n;
}
function Qt(e = {}) {
  let t, n, o, s, i = 0, r = !1, c = !1, a;
  function l(b, x) {
    n = b;
    const {
      mergeOptions: A,
      optionsAtMedia: M
    } = x, U = A(Vn, Qt.globalOptions), $ = A(U, e);
    if (t = M($), n.scrollSnapList().length <= 1) return;
    s = t.startDelay, o = !1, a = n.internalEngine().scrollBody;
    const {
      eventStore: B
    } = n.internalEngine(), W = !!n.internalEngine().options.watchDrag, j = Hn(n, t.rootNode);
    W && n.on("pointerDown", h), W && !t.stopOnInteraction && n.on("pointerUp", m), t.stopOnMouseEnter && B.add(j, "mouseenter", g), t.stopOnMouseEnter && !t.stopOnInteraction && B.add(j, "mouseleave", p), t.stopOnFocusIn && n.on("slideFocusStart", f), t.stopOnFocusIn && !t.stopOnInteraction && B.add(n.containerNode(), "focusout", u), t.playOnInit && u();
  }
  function d() {
    n.off("pointerDown", h).off("pointerUp", m).off("slideFocusStart", f).off("settle", v), f(), o = !0, r = !1;
  }
  function u() {
    if (o || r) return;
    n.emit("autoScroll:play");
    const b = n.internalEngine(), {
      ownerWindow: x
    } = b;
    i = x.setTimeout(() => {
      b.scrollBody = w(b), b.animation.start();
    }, s), r = !0;
  }
  function f() {
    if (o || !r) return;
    n.emit("autoScroll:stop");
    const b = n.internalEngine(), {
      ownerWindow: x
    } = b;
    b.scrollBody = a, x.clearTimeout(i), i = 0, r = !1;
  }
  function w(b) {
    const {
      location: x,
      previousLocation: A,
      offsetLocation: M,
      target: U,
      scrollTarget: $,
      index: B,
      indexPrevious: W,
      limit: {
        reachedMin: j,
        reachedMax: K,
        constrain: Q
      },
      options: {
        loop: st
      }
    } = b, G = t.direction === "forward" ? -1 : 1, X = () => z;
    let Y = 0, _ = 0, tt = x.get(), nt = 0, N = !1;
    function F() {
      let V = 0;
      A.set(x), Y = G * t.speed, tt += Y, x.add(Y), U.set(x), V = tt - nt, _ = Math.sign(V), nt = tt;
      const D = $.byDistance(0, !1).index;
      B.get() !== D && (W.set(B.get()), B.set(D), n.emit("select"));
      const y = t.direction === "forward" ? j(M.get()) : K(M.get());
      if (!st && y) {
        N = !0;
        const T = Q(x.get());
        x.set(T), U.set(x), f();
      }
      return z;
    }
    const z = {
      direction: () => _,
      duration: () => -1,
      velocity: () => Y,
      settled: () => N,
      seek: F,
      useBaseFriction: X,
      useBaseDuration: X,
      useFriction: X,
      useDuration: X
    };
    return z;
  }
  function h() {
    c || f();
  }
  function m() {
    c || S();
  }
  function g() {
    c = !0, f();
  }
  function p() {
    c = !1, u();
  }
  function v() {
    n.off("settle", v), u();
  }
  function S() {
    n.on("settle", v);
  }
  function L(b) {
    typeof b < "u" && (s = b), u();
  }
  function C() {
    r && f();
  }
  function I() {
    r && (f(), S());
  }
  function E() {
    return r;
  }
  return {
    name: "autoScroll",
    options: e,
    init: l,
    destroy: d,
    play: L,
    stop: C,
    reset: I,
    isPlaying: E
  };
}
Qt.globalOptions = void 0;
let we = "/", ye = "", Se = "";
function $n(e) {
  we = e;
}
function Rn(e, t) {
  ye = e, Se = t;
}
function jn() {
  const e = document.getElementById("backLink");
  e && (e.href = we), zn();
}
function zn() {
  const e = document.querySelector(".embla"), t = document.querySelector(".embla__viewport");
  if (!e || !t) return;
  const n = t.querySelector(".embla__container") || t.firstElementChild;
  if (n) {
    const s = [...n.children];
    for (let i = s.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      n.appendChild(s[r]), s.splice(r, 1);
    }
  }
  const o = Kt(t, { loop: !0, dragFree: !0 }, [Qt({ speed: 0.5, startDelay: 300, stopOnInteraction: !0 })]);
  o.on("pointerUp", () => {
    let s = null;
    const i = () => {
      clearTimeout(s), s = setTimeout(() => {
        o.off("scroll", i), o.plugins().autoScroll.play();
      }, 50);
    };
    o.on("scroll", i);
  });
}
function be() {
  var t;
  switch ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) {
    case "home":
      break;
    case "work":
      an();
      break;
    case "info":
      break;
    case "details":
      jn();
      break;
  }
}
let mt = null;
function Ee() {
  mt && (mt.disconnect(), mt = null), document.querySelectorAll("img").forEach((e) => {
    e.complete && e.naturalWidth > 0 ? e.style.opacity = "1" : e.addEventListener("load", () => {
      e.style.opacity = "1";
    }, { once: !0 });
  }), mt = new IntersectionObserver((e) => {
    e.forEach((t) => {
      const n = t.target;
      t.isIntersecting ? (n.dataset.src && !n.src && (n.src = n.dataset.src, n.load()), n.play()) : n.pause();
    });
  }, { threshold: 0 }), document.querySelectorAll("video").forEach((e) => {
    const t = () => {
      e.style.opacity = "1";
    };
    e.readyState >= 2 ? t() : e.addEventListener("loadeddata", t, { once: !0 }), mt.observe(e);
  });
}
function Wn() {
  jt(), document.querySelectorAll("[data-link]").forEach((e) => {
    e.addEventListener("click", () => jt(e.dataset.link));
  });
}
function jt(e) {
  var i;
  const t = document.querySelectorAll("[data-link]"), n = document.querySelector(".indicator"), o = e ?? ((i = document.querySelector("[data-swup]")) == null ? void 0 : i.dataset.swup);
  if (!o) return;
  t.forEach((r) => r.classList.remove("w--current"));
  const s = document.querySelector(`[data-link="${o}"]`);
  s && (s.classList.add("w--current"), n && (n.style.left = `${s.offsetLeft}px`, n.style.width = `${s.offsetWidth}px`));
}
let at = null, Tt = !1, dt = null, ft = !1;
function ke() {
  var c;
  at && (clearInterval(at), at = null), Tt = !1, ft = !1;
  const e = document.getElementById("currentYear");
  e && (e.textContent = (/* @__PURE__ */ new Date()).getFullYear());
  const t = document.getElementById("first"), n = document.getElementById("second");
  if (!t || !n) return;
  const o = t.querySelector("p"), s = n.querySelector("p");
  if (((c = document.querySelector("[data-swup]")) == null ? void 0 : c.dataset.swup) === "details") {
    const a = document.querySelector('[data-swup="details"]'), l = ye || (a == null ? void 0 : a.dataset.name) || "", d = Se || (a == null ? void 0 : a.dataset.services) || "";
    o && l && (o.textContent = l, t.style.width = ct(t, l) + "px"), s && d && (s.textContent = d, n.style.width = ct(n, d) + "px");
    return;
  }
  dt === null && (dt = t.dataset.default || (o == null ? void 0 : o.textContent) || ""), o && (o.textContent = dt, t.style.width = ct(t, dt) + "px");
  const r = Dt();
  s && (s.textContent = r, n.style.width = ct(n, r) + "px"), at = setInterval(() => {
    !Tt && s && (s.textContent = Dt());
  }, 1e3), window.matchMedia("(hover: hover)").matches && (document.querySelectorAll("[data-name]").forEach((a) => {
    a.addEventListener("mouseenter", () => {
      ft || ht(t, o, a.dataset.name);
    }), a.addEventListener("mouseleave", () => {
      ft || ht(t, o, dt);
    });
  }), document.querySelectorAll("[data-services]").forEach((a) => {
    a.addEventListener("mouseenter", () => {
      ft || (Tt = !0, ht(n, s, a.dataset.services));
    }), a.addEventListener("mouseleave", () => {
      ft || (Tt = !1, ht(n, s, Dt()));
    });
  }));
}
function Gn(e, t) {
  ft = !0, at && (clearInterval(at), at = null);
  const n = document.getElementById("first"), o = document.getElementById("second");
  if (!n || !o) return;
  const s = n.querySelector("p"), i = o.querySelector("p");
  s && e && (s.textContent = e, n.style.width = ct(n, e) + "px"), i && t && (i.textContent = t, o.style.width = ct(o, t) + "px");
}
function _n() {
  const e = document.getElementById("first"), t = document.getElementById("second");
  if (!e || !t) return;
  const n = e.querySelector("p"), o = t.querySelector("p"), s = e.dataset.default || dt || "";
  n && s && ht(e, n, s), o && ht(t, o, Dt());
}
function ht(e, t, n) {
  t.style.opacity = "0", setTimeout(() => {
    t.textContent = n, e.style.width = ct(e, n) + "px", t.style.opacity = "1";
  }, 200);
}
function ct(e, t) {
  const n = e.cloneNode(!0);
  Object.assign(n.style, {
    position: "absolute",
    visibility: "hidden",
    width: "auto",
    transition: "none",
    pointerEvents: "none"
  });
  const o = n.querySelector("p");
  o && (o.textContent = t), document.body.appendChild(n);
  const s = n.offsetWidth;
  return document.body.removeChild(n), s;
}
function Dt() {
  return (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1
  }) + " CET";
}
let Ct;
function Kn() {
  Ct = new rn({
    containers: ["#swup"],
    animationSelector: '[class*="transition-"]'
  }), document.addEventListener("click", (e) => {
    const t = e.target.closest("a[href]");
    if (!t) return;
    const n = e.target.closest('[data-to="details"]');
    if (n) {
      const o = n.dataset.name ?? "", s = n.dataset.services ?? "";
      Rn(o, s), Gn(o, s), document.body.classList.add("details-transition");
    } else document.body.classList.contains("on-details") && t.target !== "_blank" && (document.body.classList.remove("on-details"), document.body.classList.add("details-transition"), _n());
  }, !0), Ct.hooks.on("visit:start", () => {
    var t;
    ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) !== "details" && $n(window.location.pathname);
  }), Ct.hooks.on("animation:in:start", () => {
    var t;
    ((t = document.querySelector("[data-swup]")) == null ? void 0 : t.dataset.swup) === "details" ? (document.body.classList.add("on-details"), document.body.classList.remove("details-transition")) : document.body.classList.remove("on-details", "details-transition");
  }), Ct.hooks.on("page:view", () => {
    jt(), be(), Ee(), ke();
  });
}
var ue;
const Qn = (ue = document.querySelector("[data-swup]")) == null ? void 0 : ue.dataset.swup;
document.body.classList.toggle("on-details", Qn === "details");
Kn();
Wn();
be();
Ee();
ke();
