const veryLocalStorage = {};

function supportsStorage() {
  try {
    return "localStorage" in window && window["localStorage"] !== null;
  } catch (e) {
    return false;
  }
}

function get(key, defaultValue) {
  let value;
  if (!supportsStorage()) {
    value = veryLocalStorage[key];
  } else {
    value = localStorage.getItem(key);
  }
  return value === null || typeof value === "undefined" ? defaultValue : value;
}

function set(key, value) {
  if (!supportsStorage()) {
    veryLocalStorage[key] = value;
  } else {
    localStorage.setItem(key, value);
  }
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 =
    window.ShadowRoot &&
    (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
  e$2 = Symbol(),
  n$3 = new WeakMap();
class s$3 {
  constructor(t, n, s) {
    if (((this._$cssResult$ = !0), s !== e$2))
      throw Error(
        "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
      );
    (this.cssText = t), (this.t = n);
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (t$1 && void 0 === e) {
      const t = void 0 !== s && 1 === s.length;
      t && (e = n$3.get(s)),
        void 0 === e &&
          ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText),
          t && n$3.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
}
const o$3 = (t) => new s$3("string" == typeof t ? t : t + "", void 0, e$2),
  r$2 = (t, ...n) => {
    const o =
      1 === t.length
        ? t[0]
        : n.reduce(
            (e, n, s) =>
              e +
              ((t) => {
                if (!0 === t._$cssResult$) return t.cssText;
                if ("number" == typeof t) return t;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    t +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                );
              })(n) +
              t[s + 1],
            t[0]
          );
    return new s$3(o, t, e$2);
  },
  i$1 = (e, n) => {
    t$1
      ? (e.adoptedStyleSheets = n.map((t) =>
          t instanceof CSSStyleSheet ? t : t.styleSheet
        ))
      : n.forEach((t) => {
          const n = document.createElement("style"),
            s = window.litNonce;
          void 0 !== s && n.setAttribute("nonce", s),
            (n.textContent = t.cssText),
            e.appendChild(n);
        });
  },
  S$1 = t$1
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = "";
              for (const n of t.cssRules) e += n.cssText;
              return o$3(e);
            })(t)
          : t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var s$2;
const e$1 = window.trustedTypes,
  r$1 = e$1 ? e$1.emptyScript : "",
  h$1 = window.reactiveElementPolyfillSupport,
  o$2 = {
    toAttribute(t, i) {
      switch (i) {
        case Boolean:
          t = t ? r$1 : null;
          break;
        case Object:
        case Array:
          t = null == t ? t : JSON.stringify(t);
      }
      return t;
    },
    fromAttribute(t, i) {
      let s = t;
      switch (i) {
        case Boolean:
          s = null !== t;
          break;
        case Number:
          s = null === t ? null : Number(t);
          break;
        case Object:
        case Array:
          try {
            s = JSON.parse(t);
          } catch (t) {
            s = null;
          }
      }
      return s;
    },
  },
  n$2 = (t, i) => i !== t && (i == i || t == t),
  l$2 = {
    attribute: !0,
    type: String,
    converter: o$2,
    reflect: !1,
    hasChanged: n$2,
  };
class a$1 extends HTMLElement {
  constructor() {
    super(),
      (this._$Ei = new Map()),
      (this.isUpdatePending = !1),
      (this.hasUpdated = !1),
      (this._$El = null),
      this.u();
  }
  static addInitializer(t) {
    var i;
    (null !== (i = this.h) && void 0 !== i) || (this.h = []), this.h.push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return (
      this.elementProperties.forEach((i, s) => {
        const e = this._$Ep(s, i);
        void 0 !== e && (this._$Ev.set(e, s), t.push(e));
      }),
      t
    );
  }
  static createProperty(t, i = l$2) {
    if (
      (i.state && (i.attribute = !1),
      this.finalize(),
      this.elementProperties.set(t, i),
      !i.noAccessor && !this.prototype.hasOwnProperty(t))
    ) {
      const s = "symbol" == typeof t ? Symbol() : "__" + t,
        e = this.getPropertyDescriptor(t, s, i);
      void 0 !== e && Object.defineProperty(this.prototype, t, e);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    return {
      get() {
        return this[i];
      },
      set(e) {
        const r = this[t];
        (this[i] = e), this.requestUpdate(t, r, s);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || l$2;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized")) return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);
    if (
      (t.finalize(),
      (this.elementProperties = new Map(t.elementProperties)),
      (this._$Ev = new Map()),
      this.hasOwnProperty("properties"))
    ) {
      const t = this.properties,
        i = [
          ...Object.getOwnPropertyNames(t),
          ...Object.getOwnPropertySymbols(t),
        ];
      for (const s of i) this.createProperty(s, t[s]);
    }
    return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
  }
  static finalizeStyles(i) {
    const s = [];
    if (Array.isArray(i)) {
      const e = new Set(i.flat(1 / 0).reverse());
      for (const i of e) s.unshift(S$1(i));
    } else void 0 !== i && s.push(S$1(i));
    return s;
  }
  static _$Ep(t, i) {
    const s = i.attribute;
    return !1 === s
      ? void 0
      : "string" == typeof s
      ? s
      : "string" == typeof t
      ? t.toLowerCase()
      : void 0;
  }
  u() {
    var t;
    (this._$E_ = new Promise((t) => (this.enableUpdating = t))),
      (this._$AL = new Map()),
      this._$Eg(),
      this.requestUpdate(),
      null === (t = this.constructor.h) ||
        void 0 === t ||
        t.forEach((t) => t(this));
  }
  addController(t) {
    var i, s;
    (null !== (i = this._$ES) && void 0 !== i ? i : (this._$ES = [])).push(t),
      void 0 !== this.renderRoot &&
        this.isConnected &&
        (null === (s = t.hostConnected) || void 0 === s || s.call(t));
  }
  removeController(t) {
    var i;
    null === (i = this._$ES) ||
      void 0 === i ||
      i.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t, i) => {
      this.hasOwnProperty(i) && (this._$Ei.set(i, this[i]), delete this[i]);
    });
  }
  createRenderRoot() {
    var t;
    const s =
      null !== (t = this.shadowRoot) && void 0 !== t
        ? t
        : this.attachShadow(this.constructor.shadowRootOptions);
    return i$1(s, this.constructor.elementStyles), s;
  }
  connectedCallback() {
    var t;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      null === (t = this._$ES) ||
        void 0 === t ||
        t.forEach((t) => {
          var i;
          return null === (i = t.hostConnected) || void 0 === i
            ? void 0
            : i.call(t);
        });
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    var t;
    null === (t = this._$ES) ||
      void 0 === t ||
      t.forEach((t) => {
        var i;
        return null === (i = t.hostDisconnected) || void 0 === i
          ? void 0
          : i.call(t);
      });
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$EO(t, i, s = l$2) {
    var e, r;
    const h = this.constructor._$Ep(t, s);
    if (void 0 !== h && !0 === s.reflect) {
      const n = (
        null !==
          (r =
            null === (e = s.converter) || void 0 === e
              ? void 0
              : e.toAttribute) && void 0 !== r
          ? r
          : o$2.toAttribute
      )(i, s.type);
      (this._$El = t),
        null == n ? this.removeAttribute(h) : this.setAttribute(h, n),
        (this._$El = null);
    }
  }
  _$AK(t, i) {
    var s, e;
    const r = this.constructor,
      h = r._$Ev.get(t);
    if (void 0 !== h && this._$El !== h) {
      const t = r.getPropertyOptions(h),
        n = t.converter,
        l =
          null !==
            (e =
              null !== (s = null == n ? void 0 : n.fromAttribute) &&
              void 0 !== s
                ? s
                : "function" == typeof n
                ? n
                : null) && void 0 !== e
            ? e
            : o$2.fromAttribute;
      (this._$El = h), (this[h] = l(i, t.type)), (this._$El = null);
    }
  }
  requestUpdate(t, i, s) {
    let e = !0;
    void 0 !== t &&
      (((s = s || this.constructor.getPropertyOptions(t)).hasChanged || n$2)(
        this[t],
        i
      )
        ? (this._$AL.has(t) || this._$AL.set(t, i),
          !0 === s.reflect &&
            this._$El !== t &&
            (void 0 === this._$EC && (this._$EC = new Map()),
            this._$EC.set(t, s)))
        : (e = !1)),
      !this.isUpdatePending && e && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (t) {
      Promise.reject(t);
    }
    const t = this.scheduleUpdate();
    return null != t && (await t), !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t;
    if (!this.isUpdatePending) return;
    this.hasUpdated,
      this._$Ei &&
        (this._$Ei.forEach((t, i) => (this[i] = t)), (this._$Ei = void 0));
    let i = !1;
    const s = this._$AL;
    try {
      (i = this.shouldUpdate(s)),
        i
          ? (this.willUpdate(s),
            null === (t = this._$ES) ||
              void 0 === t ||
              t.forEach((t) => {
                var i;
                return null === (i = t.hostUpdate) || void 0 === i
                  ? void 0
                  : i.call(t);
              }),
            this.update(s))
          : this._$Ek();
    } catch (t) {
      throw ((i = !1), this._$Ek(), t);
    }
    i && this._$AE(s);
  }
  willUpdate(t) {}
  _$AE(t) {
    var i;
    null === (i = this._$ES) ||
      void 0 === i ||
      i.forEach((t) => {
        var i;
        return null === (i = t.hostUpdated) || void 0 === i
          ? void 0
          : i.call(t);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
      this.updated(t);
  }
  _$Ek() {
    (this._$AL = new Map()), (this.isUpdatePending = !1);
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    void 0 !== this._$EC &&
      (this._$EC.forEach((t, i) => this._$EO(i, this[i], t)),
      (this._$EC = void 0)),
      this._$Ek();
  }
  updated(t) {}
  firstUpdated(t) {}
}
(a$1.finalized = !0),
  (a$1.elementProperties = new Map()),
  (a$1.elementStyles = []),
  (a$1.shadowRootOptions = { mode: "open" }),
  null == h$1 || h$1({ ReactiveElement: a$1 }),
  (null !== (s$2 = globalThis.reactiveElementVersions) && void 0 !== s$2
    ? s$2
    : (globalThis.reactiveElementVersions = [])
  ).push("1.3.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;
const i = globalThis.trustedTypes,
  s$1 = i ? i.createPolicy("lit-html", { createHTML: (t) => t }) : void 0,
  e = `lit$${(Math.random() + "").slice(9)}$`,
  o$1 = "?" + e,
  n$1 = `<${o$1}>`,
  l$1 = document,
  h = (t = "") => l$1.createComment(t),
  r = (t) => null === t || ("object" != typeof t && "function" != typeof t),
  d = Array.isArray,
  u = (t) => {
    var i;
    return (
      d(t) ||
      "function" ==
        typeof (null === (i = t) || void 0 === i ? void 0 : i[Symbol.iterator])
    );
  },
  c = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  v = /-->/g,
  a = />/g,
  f =
    />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,
  _ = /'/g,
  m = /"/g,
  g = /^(?:script|style|textarea|title)$/i,
  p =
    (t) =>
    (i, ...s) => ({ _$litType$: t, strings: i, values: s }),
  $ = p(1),
  b = Symbol.for("lit-noChange"),
  w = Symbol.for("lit-nothing"),
  T = new WeakMap(),
  x = (t, i, s) => {
    var e, o;
    const n =
      null !== (e = null == s ? void 0 : s.renderBefore) && void 0 !== e
        ? e
        : i;
    let l = n._$litPart$;
    if (void 0 === l) {
      const t =
        null !== (o = null == s ? void 0 : s.renderBefore) && void 0 !== o
          ? o
          : null;
      n._$litPart$ = l = new N(
        i.insertBefore(h(), t),
        t,
        void 0,
        null != s ? s : {}
      );
    }
    return l._$AI(t), l;
  },
  A = l$1.createTreeWalker(l$1, 129, null, !1),
  C = (t, i) => {
    const o = t.length - 1,
      l = [];
    let h,
      r = 2 === i ? "<svg>" : "",
      d = c;
    for (let i = 0; i < o; i++) {
      const s = t[i];
      let o,
        u,
        p = -1,
        $ = 0;
      for (; $ < s.length && ((d.lastIndex = $), (u = d.exec(s)), null !== u); )
        ($ = d.lastIndex),
          d === c
            ? "!--" === u[1]
              ? (d = v)
              : void 0 !== u[1]
              ? (d = a)
              : void 0 !== u[2]
              ? (g.test(u[2]) && (h = RegExp("</" + u[2], "g")), (d = f))
              : void 0 !== u[3] && (d = f)
            : d === f
            ? ">" === u[0]
              ? ((d = null != h ? h : c), (p = -1))
              : void 0 === u[1]
              ? (p = -2)
              : ((p = d.lastIndex - u[2].length),
                (o = u[1]),
                (d = void 0 === u[3] ? f : '"' === u[3] ? m : _))
            : d === m || d === _
            ? (d = f)
            : d === v || d === a
            ? (d = c)
            : ((d = f), (h = void 0));
      const y = d === f && t[i + 1].startsWith("/>") ? " " : "";
      r +=
        d === c
          ? s + n$1
          : p >= 0
          ? (l.push(o), s.slice(0, p) + "$lit$" + s.slice(p) + e + y)
          : s + e + (-2 === p ? (l.push(void 0), i) : y);
    }
    const u = r + (t[o] || "<?>") + (2 === i ? "</svg>" : "");
    if (!Array.isArray(t) || !t.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return [void 0 !== s$1 ? s$1.createHTML(u) : u, l];
  };
class E {
  constructor({ strings: t, _$litType$: s }, n) {
    let l;
    this.parts = [];
    let r = 0,
      d = 0;
    const u = t.length - 1,
      c = this.parts,
      [v, a] = C(t, s);
    if (
      ((this.el = E.createElement(v, n)),
      (A.currentNode = this.el.content),
      2 === s)
    ) {
      const t = this.el.content,
        i = t.firstChild;
      i.remove(), t.append(...i.childNodes);
    }
    for (; null !== (l = A.nextNode()) && c.length < u; ) {
      if (1 === l.nodeType) {
        if (l.hasAttributes()) {
          const t = [];
          for (const i of l.getAttributeNames())
            if (i.endsWith("$lit$") || i.startsWith(e)) {
              const s = a[d++];
              if ((t.push(i), void 0 !== s)) {
                const t = l.getAttribute(s.toLowerCase() + "$lit$").split(e),
                  i = /([.?@])?(.*)/.exec(s);
                c.push({
                  type: 1,
                  index: r,
                  name: i[2],
                  strings: t,
                  ctor:
                    "." === i[1] ? M : "?" === i[1] ? H : "@" === i[1] ? I : S,
                });
              } else c.push({ type: 6, index: r });
            }
          for (const i of t) l.removeAttribute(i);
        }
        if (g.test(l.tagName)) {
          const t = l.textContent.split(e),
            s = t.length - 1;
          if (s > 0) {
            l.textContent = i ? i.emptyScript : "";
            for (let i = 0; i < s; i++)
              l.append(t[i], h()),
                A.nextNode(),
                c.push({ type: 2, index: ++r });
            l.append(t[s], h());
          }
        }
      } else if (8 === l.nodeType)
        if (l.data === o$1) c.push({ type: 2, index: r });
        else {
          let t = -1;
          for (; -1 !== (t = l.data.indexOf(e, t + 1)); )
            c.push({ type: 7, index: r }), (t += e.length - 1);
        }
      r++;
    }
  }
  static createElement(t, i) {
    const s = l$1.createElement("template");
    return (s.innerHTML = t), s;
  }
}
function P(t, i, s = t, e) {
  var o, n, l, h;
  if (i === b) return i;
  let d =
    void 0 !== e
      ? null === (o = s._$Cl) || void 0 === o
        ? void 0
        : o[e]
      : s._$Cu;
  const u = r(i) ? void 0 : i._$litDirective$;
  return (
    (null == d ? void 0 : d.constructor) !== u &&
      (null === (n = null == d ? void 0 : d._$AO) ||
        void 0 === n ||
        n.call(d, !1),
      void 0 === u ? (d = void 0) : ((d = new u(t)), d._$AT(t, s, e)),
      void 0 !== e
        ? ((null !== (l = (h = s)._$Cl) && void 0 !== l ? l : (h._$Cl = []))[
            e
          ] = d)
        : (s._$Cu = d)),
    void 0 !== d && (i = P(t, d._$AS(t, i.values), d, e)),
    i
  );
}
class V {
  constructor(t, i) {
    (this.v = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = i);
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  p(t) {
    var i;
    const {
        el: { content: s },
        parts: e,
      } = this._$AD,
      o = (
        null !== (i = null == t ? void 0 : t.creationScope) && void 0 !== i
          ? i
          : l$1
      ).importNode(s, !0);
    A.currentNode = o;
    let n = A.nextNode(),
      h = 0,
      r = 0,
      d = e[0];
    for (; void 0 !== d; ) {
      if (h === d.index) {
        let i;
        2 === d.type
          ? (i = new N(n, n.nextSibling, this, t))
          : 1 === d.type
          ? (i = new d.ctor(n, d.name, d.strings, this, t))
          : 6 === d.type && (i = new L(n, this, t)),
          this.v.push(i),
          (d = e[++r]);
      }
      h !== (null == d ? void 0 : d.index) && ((n = A.nextNode()), h++);
    }
    return o;
  }
  m(t) {
    let i = 0;
    for (const s of this.v)
      void 0 !== s &&
        (void 0 !== s.strings
          ? (s._$AI(t, s, i), (i += s.strings.length - 2))
          : s._$AI(t[i])),
        i++;
  }
}
class N {
  constructor(t, i, s, e) {
    var o;
    (this.type = 2),
      (this._$AH = w),
      (this._$AN = void 0),
      (this._$AA = t),
      (this._$AB = i),
      (this._$AM = s),
      (this.options = e),
      (this._$Cg =
        null === (o = null == e ? void 0 : e.isConnected) || void 0 === o || o);
  }
  get _$AU() {
    var t, i;
    return null !==
      (i = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) &&
      void 0 !== i
      ? i
      : this._$Cg;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return void 0 !== i && 11 === t.nodeType && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    (t = P(this, t, i)),
      r(t)
        ? t === w || null == t || "" === t
          ? (this._$AH !== w && this._$AR(), (this._$AH = w))
          : t !== this._$AH && t !== b && this.$(t)
        : void 0 !== t._$litType$
        ? this.T(t)
        : void 0 !== t.nodeType
        ? this.k(t)
        : u(t)
        ? this.S(t)
        : this.$(t);
  }
  M(t, i = this._$AB) {
    return this._$AA.parentNode.insertBefore(t, i);
  }
  k(t) {
    this._$AH !== t && (this._$AR(), (this._$AH = this.M(t)));
  }
  $(t) {
    this._$AH !== w && r(this._$AH)
      ? (this._$AA.nextSibling.data = t)
      : this.k(l$1.createTextNode(t)),
      (this._$AH = t);
  }
  T(t) {
    var i;
    const { values: s, _$litType$: e } = t,
      o =
        "number" == typeof e
          ? this._$AC(t)
          : (void 0 === e.el && (e.el = E.createElement(e.h, this.options)), e);
    if ((null === (i = this._$AH) || void 0 === i ? void 0 : i._$AD) === o)
      this._$AH.m(s);
    else {
      const t = new V(o, this),
        i = t.p(this.options);
      t.m(s), this.k(i), (this._$AH = t);
    }
  }
  _$AC(t) {
    let i = T.get(t.strings);
    return void 0 === i && T.set(t.strings, (i = new E(t))), i;
  }
  S(t) {
    d(this._$AH) || ((this._$AH = []), this._$AR());
    const i = this._$AH;
    let s,
      e = 0;
    for (const o of t)
      e === i.length
        ? i.push((s = new N(this.M(h()), this.M(h()), this, this.options)))
        : (s = i[e]),
        s._$AI(o),
        e++;
    e < i.length && (this._$AR(s && s._$AB.nextSibling, e), (i.length = e));
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var s;
    for (
      null === (s = this._$AP) || void 0 === s || s.call(this, !1, !0, i);
      t && t !== this._$AB;

    ) {
      const i = t.nextSibling;
      t.remove(), (t = i);
    }
  }
  setConnected(t) {
    var i;
    void 0 === this._$AM &&
      ((this._$Cg = t),
      null === (i = this._$AP) || void 0 === i || i.call(this, t));
  }
}
class S {
  constructor(t, i, s, e, o) {
    (this.type = 1),
      (this._$AH = w),
      (this._$AN = void 0),
      (this.element = t),
      (this.name = i),
      (this._$AM = e),
      (this.options = o),
      s.length > 2 || "" !== s[0] || "" !== s[1]
        ? ((this._$AH = Array(s.length - 1).fill(new String())),
          (this.strings = s))
        : (this._$AH = w);
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, i = this, s, e) {
    const o = this.strings;
    let n = !1;
    if (void 0 === o)
      (t = P(this, t, i, 0)),
        (n = !r(t) || (t !== this._$AH && t !== b)),
        n && (this._$AH = t);
    else {
      const e = t;
      let l, h;
      for (t = o[0], l = 0; l < o.length - 1; l++)
        (h = P(this, e[s + l], i, l)),
          h === b && (h = this._$AH[l]),
          n || (n = !r(h) || h !== this._$AH[l]),
          h === w ? (t = w) : t !== w && (t += (null != h ? h : "") + o[l + 1]),
          (this._$AH[l] = h);
    }
    n && !e && this.C(t);
  }
  C(t) {
    t === w
      ? this.element.removeAttribute(this.name)
      : this.element.setAttribute(this.name, null != t ? t : "");
  }
}
class M extends S {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  C(t) {
    this.element[this.name] = t === w ? void 0 : t;
  }
}
const k = i ? i.emptyScript : "";
class H extends S {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  C(t) {
    t && t !== w
      ? this.element.setAttribute(this.name, k)
      : this.element.removeAttribute(this.name);
  }
}
class I extends S {
  constructor(t, i, s, e, o) {
    super(t, i, s, e, o), (this.type = 5);
  }
  _$AI(t, i = this) {
    var s;
    if ((t = null !== (s = P(this, t, i, 0)) && void 0 !== s ? s : w) === b)
      return;
    const e = this._$AH,
      o =
        (t === w && e !== w) ||
        t.capture !== e.capture ||
        t.once !== e.once ||
        t.passive !== e.passive,
      n = t !== w && (e === w || o);
    o && this.element.removeEventListener(this.name, this, e),
      n && this.element.addEventListener(this.name, this, t),
      (this._$AH = t);
  }
  handleEvent(t) {
    var i, s;
    "function" == typeof this._$AH
      ? this._$AH.call(
          null !==
            (s =
              null === (i = this.options) || void 0 === i ? void 0 : i.host) &&
            void 0 !== s
            ? s
            : this.element,
          t
        )
      : this._$AH.handleEvent(t);
  }
}
class L {
  constructor(t, i, s) {
    (this.element = t),
      (this.type = 6),
      (this._$AN = void 0),
      (this._$AM = i),
      (this.options = s);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    P(this, t);
  }
}
const z = window.litHtmlPolyfillSupport;
null == z || z(E, N),
  (null !== (t = globalThis.litHtmlVersions) && void 0 !== t
    ? t
    : (globalThis.litHtmlVersions = [])
  ).push("2.2.6");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var l, o;
class s extends a$1 {
  constructor() {
    super(...arguments),
      (this.renderOptions = { host: this }),
      (this._$Do = void 0);
  }
  createRenderRoot() {
    var t, e;
    const i = super.createRenderRoot();
    return (
      (null !== (t = (e = this.renderOptions).renderBefore) && void 0 !== t) ||
        (e.renderBefore = i.firstChild),
      i
    );
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(t),
      (this._$Do = x(i, this.renderRoot, this.renderOptions));
  }
  connectedCallback() {
    var t;
    super.connectedCallback(),
      null === (t = this._$Do) || void 0 === t || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(),
      null === (t = this._$Do) || void 0 === t || t.setConnected(!1);
  }
  render() {
    return b;
  }
}
(s.finalized = !0),
  (s._$litElement$ = !0),
  null === (l = globalThis.litElementHydrateSupport) ||
    void 0 === l ||
    l.call(globalThis, { LitElement: s });
const n = globalThis.litElementPolyfillSupport;
null == n || n({ LitElement: s });
(null !== (o = globalThis.litElementVersions) && void 0 !== o
  ? o
  : (globalThis.litElementVersions = [])
).push("3.2.1");

const inputStyles = r$2`
  input, button, select {
    font-size: 18px;
  }

  input[type="text"] {
    padding: 6px 5px;
  }
`;

const censoredStyle = r$2`
  .censored {
text-rendering: optimizeLegibility;
-webkit-font-variant-ligatures: discretionary-ligatures;
font-variant-ligatures: discretionary-ligatures;
font-family: 'scunthorpeSansWeb', sans-serif;
  }`;

function translate(query, srcLang, destLang, callback) {
  fetch("/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: query, from: srcLang, to: destLang }),
  })
    .then((response) => response.json())
    .then(callback)
    .catch(console.error);
}

function genRandomLanguages(startLanguage) {
  let allLangs = Object.keys(LANGUAGES);
  // Remove start language from possible languages
  for (var i = 0; i < allLangs.length; i++) {
    if (allLangs[i] == startLanguage) {
      allLangs.splice(i, 1);
    }
  }

  // Pick X random languages
  allLangs.sort(function () {
    return Math.round(Math.random()) - 0.5;
  });
  let targetLangs = allLangs.slice(0, 12);
  targetLangs.unshift(startLanguage);
  targetLangs.push(startLanguage);
  return targetLangs;
}

const SOURCES = {
  AZURE: {
    name: "Azure Cognitive Services",
    homepage:
      "https://docs.microsoft.com/en-us/azure/cognitive-services/translator/",
    generateUrl: (src, dest, text) =>
      `https://www.bing.com/translator?text=${text}&from=${src}&to=${dest}`,
  },
};

// Languages supported both by Azure and Yandex APIs
const LANGUAGES = {
  sq: "ALBANIAN",
  am: "AMHARIC",
  ar: "ARABIC",
  hy: "ARMENIAN",
  az: "AZERBAIJANI",
  eu: "BASQUE",
  bn: "BENGALI",
  bg: "BULGARIAN",
  my: "BURMESE",
  ca: "CATALAN",
  zh: "CHINESE",
  hr: "CROATIAN",
  cs: "CZECH",
  da: "DANISH",
  nl: "DUTCH",
  en: "ENGLISH",
  et: "ESTONIAN",
  fi: "FINNISH",
  fr: "FRENCH",
  gl: "GALICIAN",
  ka: "GEORGIAN",
  de: "GERMAN",
  el: "GREEK",
  ht: "HAITIAN_CREOLE",
  hi: "HINDI",
  hu: "HUNGARIAN",
  is: "ICELANDIC",
  id: "INDONESIAN",
  ga: "IRISH",
  it: "ITALIAN",
  ja: "JAPANESE",
  kn: "KANNADA",
  kk: "KAZAKH",
  km: "KHMER",
  ko: "KOREAN",
  ky: "KYRGYZ",
  lo: "LAOTHIAN",
  lv: "LATVIAN",
  lt: "LITHUANIAN",
  mk: "MACEDONIAN",
  ms: "MALAY",
  ml: "MALAYALAM",
  mt: "MALTESE",
  mi: "MAORI",
  mr: "MARATHI",
  mn: "MONGOLIAN",
  ne: "NEPALI",
  no: "NORWEGIAN",
  fa: "PERSIAN",
  pl: "POLISH",
  pt: "PORTUGUESE",
  pa: "PUNJABI",
  ro: "ROMANIAN",
  ru: "RUSSIAN",
  sr: "SERBIAN",
  sk: "SLOVAK",
  sl: "SLOVENIAN",
  es: "SPANISH",
  sw: "SWAHILI",
  sv: "SWEDISH",
  ta: "TAMIL",
  tt: "TATAR",
  te: "TELUGU",
  th: "THAI",
  tr: "TURKISH",
  uk: "UKRAINIAN",
  ur: "URDU",
  uz: "UZBEK",
  vi: "VIETNAMESE",
  cy: "WELSH",
};

class TranslationsUI extends s {
  static styles = [
    inputStyles,
    censoredStyle,
    r$2`
      input[name="message"] {
        width: 530px;
        max-width: 100%;
        margin-bottom: 8px;
      }
    `,
  ];

  static properties = {
    startMessage: { type: String },
    startLanguage: { type: String },
    translations: { type: Array },
    id: { type: Number },
    _currentMessage: { type: String },
    _targetLanguages: { type: Array },
    _currentLanguageIndex: { type: String },
    _userGenerated: { type: Boolean, default: false },
  };

  constructor() {
    super();
    this.startMessage = "";
    this.translations = [];
  }

  render() {
    const options = Object.entries(LANGUAGES).map(([code, name]) => {
      return $`<option value=${code} ?selected=${code == "en"}>
        ${name}
      </option>`;
    });

    const msgTranslations = this.translations.map((translation) => {
      return $`<message-translation
        translation=${translation.message}
        language=${translation.language}
        source=${translation.source}
        startLanguage=${this.startLanguage}
      ></message-translation>`;
    });

    return $`
         </div>
             <form @submit=${this.onSubmit} @keyup=${() => {
      this._userGenerated = true;
    }}>
              <label for="message">Enter your message and tell us what language its in:</label>
              <br>
              <input type="text" name="message" class="censored" maxlength="250" .value="${
                this.startMessage
              }" >
              <select name="language">${options}</select>
              <button type="submit">Go!</button>
          </form>

        <div style="margin-top: 12px">
            ${msgTranslations}
        </div>

         <translations-footer id=${this.id} @start-over=${this.startOver}>
          </translations-footer>
         </div>
         `;
  }

  onSubmit(e) {
    e.preventDefault();
    this.startMessage = e.target.message.value;
    if (this.startMessage.length == 0) {
      alert("Please enter something longer than that.");
      return;
    }

    this.startLanguage = e.target.language.value;
    this.translations = [];

    // Initialize properties needed to track translation progress
    this._targetLanguages = genRandomLanguages(this.startLanguage);
    this._currentLanguageIndex = -1;
    this._currentMessage = this.startMessage;

    this.translateNextMessage();
    return false;
  }

  translateNextMessage() {
    this._currentLanguageIndex++;
    if (this._currentLanguageIndex == this._targetLanguages.length - 1) {
      fetch("/rounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          translations: this.translations,
          usergen: this._userGenerated,
          message: this.startMessage,
          language: this.startLanguage,
          endmessage: this.translations[this.translations.length - 1].message,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== "success") return;
          this.dispatchEvent(
            new CustomEvent("saved", { detail: { round: data.round } })
          );
          this.id = data.round.id;
        });
      return;
    }
    const srcLang = this._targetLanguages[this._currentLanguageIndex];
    const destLang = this._targetLanguages[this._currentLanguageIndex + 1];
    translate(this._currentMessage, srcLang, destLang, (result) => {
      if (result.status == "success") {
        const translation = {
          language: destLang,
          message: result.text,
          source: result.source,
        };
        if (translation.message === "") {
          alert(
            `Hm, that translated to nothing in ${destLang} - please try a different, longer message!`
          );
          return;
        }
        this.translations = this.translations.concat([translation]);
        window.scroll(0, document.body.offsetHeight);
        this._currentMessage = translation.message;
        this.translateNextMessage();
      } else if (
        result.status == "error" &&
        result.message == "Language pair not supported"
      ) {
        this.translateNextMessage();
      } else {
        alert(result.message);
      }
    });
  }

  startOver() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    this.startMessage = "";
    this.translations = [];
    this.id = null;
    this.shadowRoot.querySelector("input[name=message]").focus();
  }
}
customElements.define("translations-ui", TranslationsUI);

const genLSKey = (id, rType) => `round/${id}/reactions:${rType}`;

const reactionTypes = ["deeep", "funny", "flags"];

class TranslationsFooter extends s {
  static properties = {
    id: { type: Number },
    _reactions: { type: Array, state: true },
  };

  static styles = [
    inputStyles,
    r$2`
  input[type=url] {
  width: 485px;
  max-width: 80%;
  margin-bottom: 8px;
  }
  `,
  ];

  constructor() {
    super();
  }

  render() {
    if (!this.id) return w;

    if (!this.reactions) {
      this._reactions = reactionTypes.filter((rType) => {
        return get(genLSKey(this.id, rType));
      });
    }
    const url = `http://${window.location.host}/#${this.id}`;
    return $`<div>
      <p>Well, that's how the message turned out! What next?</p>
      <p>
        ▶ React:
        <button
          @click=${() => this.react("deeep")}
          ?disabled=${this._reactions.includes("deeep")}
        >
          🤔 Deeep!
        </button>
        <button
          @click=${() => this.react("funny")}
          ?disabled=${this._reactions.includes("funny")}
        >
          😆 Funny!
        </button>
        <button
          @click=${() => this.react("flags")}
          ?disabled=${this._reactions.includes("flags")}
        >
          🚫 Offensive
        </button>
      </p>
      <p>▶ Share: <input type="url" readonly="" value=${url} /></p>
      <p>
        ▶ <button @click=${this.onStartOverClick}>Try a new message</button>
      </p>
    </div>`;
  }

  react(reactionType) {
    fetch(`/rounds/${this.id}/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: reactionType }),
    }).catch(console.error);
    set(genLSKey(this.id, reactionType), new Date().getTime());
    this._reactions = this._reactions.concat([reactionType]);
  }

  onStartOverClick() {
    this.dispatchEvent(new CustomEvent("start-over"));
  }
}
customElements.define("translations-footer", TranslationsFooter);

class MessageTranslation extends s {
  static properties = {
    translation: { type: String },
    language: { type: String },
    startLanguage: { type: String },
    source: { type: String },
    _showTranslateLink: { type: Boolean, state: true, default: false },
  };

  static styles = [
    censoredStyle,
    r$2`
    .translation {
      margin-bottom: 10px;
    }
    .language {
      font-weight: bold;
    }
    .message {
      background: white;
      padding: 3px 5px;
      border-radius: 3px;
    }
    .link {
      padding-left: 4px;
    }
  `,
  ];

  constructor() {
    super();
  }

  render() {
    let translateA;
    if (this.language != this.startLanguage) {
      const translateUrl = SOURCES[this.source].generateUrl(
        this.language,
        this.startLanguage,
        this.translation
      );
      translateA = this._showTranslateLink
        ? $`<a class="link" href=${translateUrl} target="_blank">
            → Translate to ${LANGUAGES[this.startLanguage]}</a
          >`
        : w;
    }
    const sourceName = SOURCES[this.source].name;
    const sourceUrl = SOURCES[this.source].homepage;
    return $`<div
      class="translation"
      @mouseenter=${() => (this._showTranslateLink = true)}
      @mouseleave=${() => (this._showTranslateLink = false)}
    >
      <div class="language">${LANGUAGES[this.language]}${translateA}</div>
      <div class="message censored">${this.translation}</div>
      <a href="${sourceUrl}">Translated by ${sourceName}</a>
    </div>`;
  }
}

customElements.define("message-translation", MessageTranslation);

class RoundSummary extends s {
  static properties = {
    id: { type: Number },
    message: { type: String },
    funnyCount: { type: Number },
    deeepCount: { type: Number },
    flagsCount: { type: Number },
    showFlagButton: { type: Boolean },
    _viewerFlagged: { type: Boolean, state: true, default: false },
  };

  static styles = [
    inputStyles,
    censoredStyle,
    r$2`
      .round {
        border-bottom: 1px solid #ccc;
        line-height: 1.3em;
        margin-bottom: 5px;
        padding: 10px 0px;
      }
      .views {
        float: right;
        font-size: 10px;
        margin-right: 8px;
      }
      .small-button {
        font-size: 10px;
      }
    `,
  ];

  constructor() {
    super();
  }

  render() {
    if (this.flagsCount >= 2) return w;
    this._viewerFlagged = get(genLSKey(this.id, "flags"));
    const url = `http://${window.location.host}/#${this.id}`;
    const funnyDisplay = this.funnyCount
      ? $`<div class="views">😆 x ${this.funnyCount}</div>`
      : w;
    const deeepDisplay = this.deeepCount
      ? $`<div class="views">🤔 x ${this.deeepCount}</div>`
      : w;
    const flagButton = this.showFlagButton
      ? $`<div class="views">
          <button
            class="small-button"
            @click=${this.flag}
            ?disabled=${this._viewerFlagged}
          >
            🚫 Flag
          </button>
        </div>`
      : w;

    return $`<div class="round">
      <a href="${url}" class="censored">${this.message}</a>
      ${flagButton} ${funnyDisplay} ${deeepDisplay}
    </div>`;
  }

  flag() {
    if (
      window.confirm("Is this message offensive, inappropriate, or hurtful?")
    ) {
      fetch(`/rounds/${this.id}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "flags" }),
      }).catch(console.error);
      this.flagsCount += 1;
      this._viewerFlagged = true;
      set(genLSKey(this.id, "flags"), new Date().getTime());
    }
  }
}

customElements.define("round-summary", RoundSummary);

let ignoreHashChange = false;
let LS_ROUNDS = "rounds";

function loadRound(id) {
  fetch(`/rounds/${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== "success") return;

      const transUI = document.getElementsByTagName("translations-ui")[0];
      transUI.setAttribute("startMessage", data.round.message);
      transUI.setAttribute("startLanguage", data.round.language);
      transUI.setAttribute("id", data.round.id);
      transUI.setAttribute(
        "translations",
        JSON.stringify(data.round.translations)
      );
    })
    .catch(console.error);
}

function addRound(round, parent, showFlagButton) {
  const roundSummaryEl = document.createElement("round-summary");
  roundSummaryEl.setAttribute("id", round.id);
  roundSummaryEl.setAttribute("message", round.message);
  roundSummaryEl.setAttribute("funnyCount", round.funny_count);
  roundSummaryEl.setAttribute("deeepCount", round.deeep_count);
  roundSummaryEl.setAttribute("flagsCount", round.flags_count);
  if (showFlagButton)
    roundSummaryEl.setAttribute("showFlagButton", showFlagButton);
  parent.append(roundSummaryEl);
}

function getRounds(order, div, num) {
  fetch(`/rounds?order=${order}&num=${num}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== "success") return;
      const rounds = data.rounds;
      for (var i = 0; i < rounds.length; i++) {
        addRound(rounds[i], div, true);
      }
    })
    .catch(console.error);
}

function getYours(num) {
  function dateSort(a, b) {
    return b.date - a.date;
  }

  var rounds = get(LS_ROUNDS);
  if (rounds) {
    rounds = JSON.parse(rounds);
    rounds.sort(dateSort);
    document.getElementById("yours").innerHTML = "";
    for (var i = 0; i < Math.min(num, rounds.length); i++) {
      addRound(rounds[i], document.getElementById("yours"), false);
    }
    document.getElementById("yours-section").style.display = "block";
  }
}

function loadFromHash() {
  if (!ignoreHashChange) {
    var id = window.location.hash.replace("#", "");

    if (id.length > 0) {
      loadRound(id);
    }
  }
  ignoreHashChange = false;
}

function initAll() {
  window.onhashchange = function () {
    loadFromHash();
  };
}

function initMain() {
  initAll();

  getYours(3);

  const transUI = document.createElement("translations-ui");
  transUI.addEventListener("saved", (e) => {
    const round = e.detail.round;
    ignoreHashChange = true;
    window.location.hash = round.id;
    const rounds = JSON.parse(get("rounds", "[]"));
    rounds.push({
      id: round.id,
      message: round.message,
      date: new Date().getTime(),
    });
    set(LS_ROUNDS, JSON.stringify(rounds));
    getYours(3);
  });
  document.getElementById("translations-ui").appendChild(transUI);
  loadFromHash();
}

function initRecent() {
  initAll();
  getRounds("recent", document.getElementById("recent"), 30);
}

function initPopular() {
  initAll();
  getRounds("popular", document.getElementById("popular"), 30);
}

function initYours() {
  initAll();
  getYours(1000);
}

export { initMain, initPopular, initRecent, initYours };
//# sourceMappingURL=bundle.js.map
