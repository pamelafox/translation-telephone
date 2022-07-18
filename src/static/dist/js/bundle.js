const t={};function e(){try{return"localStorage"in window&&null!==window.localStorage}catch(t){return!1}}function s(s,i){let n;return n=e()?localStorage.getItem(s):t[s],null==n?i:n}function i(s,i){e()?localStorage.setItem(s,i):t[s]=i}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;class a{constructor(t,e,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(n&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}}const l=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new a(s,t,r)},h=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,r))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var d;const u=window.trustedTypes,c=u?u.emptyScript:"",p=window.reactiveElementPolyfillSupport,g={toAttribute(t,e){switch(e){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>e!==t&&(e==e||t==t),$={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:v};class m extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;null!==(e=this.h)&&void 0!==e||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,s)=>{const i=this._$Ep(s,e);void 0!==i&&(this._$Ev.set(i,s),t.push(i))})),t}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const n=this[t];this[e]=i,this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||$}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of e)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Ep(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,s;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{n?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const s=document.createElement("style"),i=window.litNonce;void 0!==i&&s.setAttribute("nonce",i),s.textContent=e.cssText,t.appendChild(s)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EO(t,e,s=$){var i,n;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const o=(null!==(n=null===(i=s.converter)||void 0===i?void 0:i.toAttribute)&&void 0!==n?n:g.toAttribute)(e,s.type);this._$El=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$El=null}}_$AK(t,e){var s,i;const n=this.constructor,r=n._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=n.getPropertyOptions(r),o=t.converter,a=null!==(i=null!==(s=null==o?void 0:o.fromAttribute)&&void 0!==s?s:"function"==typeof o?o:null)&&void 0!==i?i:g.fromAttribute;this._$El=r,this[r]=a(e,t.type),this._$El=null}}requestUpdate(t,e,s){let i=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(s)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var f;m.finalized=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},null==p||p({ReactiveElement:m}),(null!==(d=globalThis.reactiveElementVersions)&&void 0!==d?d:globalThis.reactiveElementVersions=[]).push("1.3.3");const A=globalThis.trustedTypes,_=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,y=`lit$${(Math.random()+"").slice(9)}$`,b="?"+y,E=`<${b}>`,S=document,w=(t="")=>S.createComment(t),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,x=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,T=/>/g,L=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,M=/'/g,O=/"/g,H=/^(?:script|style|textarea|title)$/i,U=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),R=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),P=new WeakMap,B=S.createTreeWalker(S,129,null,!1),D=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":"",o=x;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,d=0;for(;d<s.length&&(o.lastIndex=d,l=o.exec(s),null!==l);)d=o.lastIndex,o===x?"!--"===l[1]?o=I:void 0!==l[1]?o=T:void 0!==l[2]?(H.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=L):void 0!==l[3]&&(o=L):o===L?">"===l[0]?(o=null!=n?n:x,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?L:'"'===l[3]?O:M):o===O||o===M?o=L:o===I||o===T?o=x:(o=L,n=void 0);const u=o===L&&t[e+1].startsWith("/>")?" ":"";r+=o===x?s+E:h>=0?(i.push(a),s.slice(0,h)+"$lit$"+s.slice(h)+y+u):s+y+(-2===h?(i.push(void 0),e):u)}const a=r+(t[s]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==_?_.createHTML(a):a,i]};class z{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[l,h]=D(t,e);if(this.el=z.createElement(l,s),B.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(i=B.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes()){const t=[];for(const e of i.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(y)){const s=h[r++];if(t.push(e),void 0!==s){const t=i.getAttribute(s.toLowerCase()+"$lit$").split(y),e=/([.?@])?(.*)/.exec(s);a.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?W:"?"===e[1]?V:"@"===e[1]?Z:K})}else a.push({type:6,index:n})}for(const e of t)i.removeAttribute(e)}if(H.test(i.tagName)){const t=i.textContent.split(y),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],w()),B.nextNode(),a.push({type:2,index:++n});i.append(t[e],w())}}}else if(8===i.nodeType)if(i.data===b)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(y,t+1));)a.push({type:7,index:n}),t+=y.length-1}n++}}static createElement(t,e){const s=S.createElement("template");return s.innerHTML=t,s}}function j(t,e,s=t,i){var n,r,o,a;if(e===R)return e;let l=void 0!==i?null===(n=s._$Cl)||void 0===n?void 0:n[i]:s._$Cu;const h=N(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==h&&(null===(r=null==l?void 0:l._$AO)||void 0===r||r.call(l,!1),void 0===h?l=void 0:(l=new h(t),l._$AT(t,s,i)),void 0!==i?(null!==(o=(a=s)._$Cl)&&void 0!==o?o:a._$Cl=[])[i]=l:s._$Cu=l),void 0!==l&&(e=j(t,l._$AS(t,e.values),l,i)),e}class G{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:s},parts:i}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:S).importNode(s,!0);B.currentNode=n;let r=B.nextNode(),o=0,a=0,l=i[0];for(;void 0!==l;){if(o===l.index){let e;2===l.type?e=new J(r,r.nextSibling,this,t):1===l.type?e=new l.ctor(r,l.name,l.strings,this,t):6===l.type&&(e=new q(r,this,t)),this.v.push(e),l=i[++a]}o!==(null==l?void 0:l.index)&&(r=B.nextNode(),o++)}return n}m(t){let e=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class J{constructor(t,e,s,i){var n;this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cg=null===(n=null==i?void 0:i.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=j(this,t,e),N(t)?t===k||null==t||""===t?(this._$AH!==k&&this._$AR(),this._$AH=k):t!==this._$AH&&t!==R&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):(t=>{var e;return C(t)||"function"==typeof(null===(e=t)||void 0===e?void 0:e[Symbol.iterator])})(t)?this.S(t):this.$(t)}M(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==k&&N(this._$AH)?this._$AA.nextSibling.data=t:this.k(S.createTextNode(t)),this._$AH=t}T(t){var e;const{values:s,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=z.createElement(i.h,this.options)),i);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.m(s);else{const t=new G(n,this),e=t.p(this.options);t.m(s),this.k(e),this._$AH=t}}_$AC(t){let e=P.get(t.strings);return void 0===e&&P.set(t.strings,e=new z(t)),e}S(t){C(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new J(this.M(w()),this.M(w()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cg=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class K{constructor(t,e,s,i,n){this.type=1,this._$AH=k,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=k}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=j(this,t,e,0),r=!N(t)||t!==this._$AH&&t!==R,r&&(this._$AH=t);else{const i=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=j(this,i[s+o],e,o),a===R&&(a=this._$AH[o]),r||(r=!N(a)||a!==this._$AH[o]),a===k?t=k:t!==k&&(t+=(null!=a?a:"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.C(t)}C(t){t===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class W extends K{constructor(){super(...arguments),this.type=3}C(t){this.element[this.name]=t===k?void 0:t}}const F=A?A.emptyScript:"";class V extends K{constructor(){super(...arguments),this.type=4}C(t){t&&t!==k?this.element.setAttribute(this.name,F):this.element.removeAttribute(this.name)}}class Z extends K{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){var s;if((t=null!==(s=j(this,t,e,0))&&void 0!==s?s:k)===R)return;const i=this._$AH,n=t===k&&i!==k||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==k&&(i===k||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class q{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){j(this,t)}}const Y=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Q,X;null==Y||Y(z,J),(null!==(f=globalThis.litHtmlVersions)&&void 0!==f?f:globalThis.litHtmlVersions=[]).push("2.2.6");class tt extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const s=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=s.firstChild),s}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{var i,n;const r=null!==(i=null==s?void 0:s.renderBefore)&&void 0!==i?i:e;let o=r._$litPart$;if(void 0===o){const t=null!==(n=null==s?void 0:s.renderBefore)&&void 0!==n?n:null;r._$litPart$=o=new J(e.insertBefore(w(),t),t,void 0,null!=s?s:{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return R}}tt.finalized=!0,tt._$litElement$=!0,null===(Q=globalThis.litElementHydrateSupport)||void 0===Q||Q.call(globalThis,{LitElement:tt});const et=globalThis.litElementPolyfillSupport;null==et||et({LitElement:tt}),(null!==(X=globalThis.litElementVersions)&&void 0!==X?X:globalThis.litElementVersions=[]).push("3.2.1");const st=l`
    a {
        color: #C20A0A;
        text-decoration: none;
        font-weight: bold;
    }

    a:visited {
        color: #9e0101;
    }

    a:hover {
        text-shadow: 1px 1px 2px #9C9C9C;
        text-decoration: none;
    }
}`,it=l`
  button {
    background: #ed9111;
    font-size: 20px;
    cursor: pointer;
    vertical-align: middle;
    border-radius: 3px;
    border-color: #ed2311;
  }
`,nt=l`
  input[type="text"] {
    background: white;
    border: 1px solid #ed6511;
    padding: 6px 5px;
    font-size: 1em;
    font-family: Helvetica, sans-serif;
    box-shadow: inset -1px 1px 1px rgba(255, 255, 255, 0.65);
  }

  input[type="text"]:hover,
  input[type="text"]:focus {
    text-shadow: 1px 1px 0 #eae7e7;
  }
`;const rt={AZURE:{name:"Azure Cognitive Services",homepage:"https://docs.microsoft.com/en-us/azure/cognitive-services/translator/",generateUrl:(t,e,s)=>`https://www.bing.com/translator?text=${s}&from=${t}&to=${e}`}},ot={sq:"ALBANIAN",am:"AMHARIC",ar:"ARABIC",hy:"ARMENIAN",az:"AZERBAIJANI",eu:"BASQUE",bn:"BENGALI",bg:"BULGARIAN",my:"BURMESE",ca:"CATALAN",zh:"CHINESE",hr:"CROATIAN",cs:"CZECH",da:"DANISH",nl:"DUTCH",en:"ENGLISH",et:"ESTONIAN",fi:"FINNISH",fr:"FRENCH",gl:"GALICIAN",ka:"GEORGIAN",de:"GERMAN",el:"GREEK",ht:"HAITIAN_CREOLE",hi:"HINDI",hu:"HUNGARIAN",is:"ICELANDIC",id:"INDONESIAN",ga:"IRISH",it:"ITALIAN",ja:"JAPANESE",kn:"KANNADA",kk:"KAZAKH",km:"KHMER",ko:"KOREAN",ky:"KYRGYZ",lo:"LAOTHIAN",lv:"LATVIAN",lt:"LITHUANIAN",mk:"MACEDONIAN",ms:"MALAY",ml:"MALAYALAM",mt:"MALTESE",mi:"MAORI",mr:"MARATHI",mn:"MONGOLIAN",ne:"NEPALI",no:"NORWEGIAN",fa:"PERSIAN",pl:"POLISH",pt:"PORTUGUESE",pa:"PUNJABI",ro:"ROMANIAN",ru:"RUSSIAN",sr:"SERBIAN",sk:"SLOVAK",sl:"SLOVENIAN",es:"SPANISH",sw:"SWAHILI",sv:"SWEDISH",ta:"TAMIL",tt:"TATAR",te:"TELUGU",th:"THAI",tr:"TURKISH",uk:"UKRAINIAN",ur:"URDU",uz:"UZBEK",vi:"VIETNAMESE",cy:"WELSH"};class at extends tt{static styles=[it,nt,l`
      input[name="message"] {
        width: 530px;
        margin-bottom: 8px;
      }
    `];static properties={startMessage:{type:String},startLanguage:{type:String},translations:{type:Array},id:{type:Number},_currentMessage:{type:String},_targetLanguages:{type:Array},_currentLanguageIndex:{type:String},_userGenerated:{type:Boolean,default:!1}};constructor(){super(),this.startMessage="",this.translations=[]}render(){const t=Object.entries(ot).map((([t,e])=>U`<option value=${t} ?selected=${"en"==t}>
        ${e}
      </option>`)),e=this.translations.map((t=>U`<message-translation
        translation=${t.message}
        language=${t.message}
        source=${t.source}
        startLanguage=${this.startLanguage}
      ></message-translation>`));return U`
         </div>
             <form @submit=${this.onSubmit} @keyup=${()=>{this._userGenerated=!0}}>
              <label for="message">Enter your message and tell us what language its in:</label>
              <br>
              <input type="text" name="message" .value="${this.startMessage}" maxlength="250">
              <select name="language">${t}</select>
              <button type="submit">Go!</button>
          </form>

        <div style="margin-top: 12px">
            ${e}
        </div>

         <translations-footer id=${this.id} @start-over=${this.startOver}>
          </translations-footer>
         </div>
         `}onSubmit(t){if(t.preventDefault(),this.startMessage=t.target.message.value,0!=this.startMessage.length)return this.startLanguage=t.target.language.value,this.translations=[],this._targetLanguages=function(t){let e=Object.keys(ot);for(var s=0;s<e.length;s++)e[s]==t&&e.splice(s,1);e.sort((function(){return Math.round(Math.random())-.5}));let i=e.slice(0,12);return i.unshift(t),i.push(t),i}(this.startLanguage),this._currentLanguageIndex=-1,this._currentMessage=this.startMessage,this.translateNextMessage(),!1;alert("Please enter something longer than that.")}translateNextMessage(){if(this._currentLanguageIndex++,this._currentLanguageIndex==this._targetLanguages.length-1)return void fetch("/rounds",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({translations:this.translations,usergen:this._userGenerated,message:this.startMessage,language:this.startLanguage,endmessage:this.translations[this.translations.length-1].message})}).then((t=>t.json())).then((t=>{"success"===t.status&&(this.dispatchEvent(new CustomEvent("saved",{detail:{round:t.round}})),this.id=t.round.id)}));const t=this._targetLanguages[this._currentLanguageIndex],e=this._targetLanguages[this._currentLanguageIndex+1];!function(t,e,s,i){fetch("/translate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:t,from:e,to:s})}).then((t=>t.json())).then(i).catch(console.error)}(this._currentMessage,t,e,(t=>{if("success"==t.status){const s={language:e,message:t.text,source:t.source};if(""===s.message)return void alert(`Hm, that translated to nothing in ${e} - please try a different, longer message!`);this.translations=this.translations.concat([s]),window.scroll(0,document.body.offsetHeight),this._currentMessage=s.message,this.translateNextMessage()}else"error"==t.status&&"Language pair not supported"==t.message?this.translateNextMessage():alert(t.message)}))}startOver(){window.scrollTo({top:0,behavior:"smooth"}),this.startMessage="",this.translations=[],this.id=null,this.shadowRoot.querySelector("input[name=message]").focus()}}customElements.define("translations-ui",at);const lt=(t,e)=>`round/${t}/reactions:${e}`,ht=["deeep","funny","flags"];customElements.define("translations-footer",class extends tt{static properties={id:{type:Number},_reactions:{type:Array,state:!0}};static styles=[it];constructor(){super()}render(){if(!this.id)return k;this.reactions||(this._reactions=ht.filter((t=>s(lt(this.id,t)))));const t=`http://${window.location.host}/#${this.id}`;return U`<div>
      <p>Well, that's how the message turned out! What next?</p>
      <p>
        ▶ React:
        <button
          @click=${()=>this.react("deeep")}
          ?disabled=${this._reactions.includes("deeep")}
        >
          🤔 Deeep!
        </button>
        <button
          @click=${()=>this.react("funny")}
          ?disabled=${this._reactions.includes("funny")}
        >
          😆 Funny!
        </button>
        <button
          @click=${()=>this.react("flags")}
          ?disabled=${this._reactions.includes("flags")}
        >
          🚫 Offensive
        </button>
      </p>
      <p>▶ Share: <input type="text" readonly="" size="70" value=${t} /></p>
      <p>
        ▶ <button @click=${this.onStartOverClick}>Try a new message</button>
      </p>
    </div>`}react(t){fetch(`/rounds/${this.id}/reactions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:t})}).catch(console.error),i(lt(this.id,t),(new Date).getTime()),this._reactions=this._reactions.concat([t])}onStartOverClick(){this.dispatchEvent(new CustomEvent("start-over"))}});class dt extends tt{static properties={translation:{type:String},language:{type:String},startLanguage:{type:String},source:{type:String},_showTranslateLink:{type:Boolean,state:!0,default:!1}};static styles=l`
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
  `;constructor(){super()}render(){let t;if(this.language!=this.startLanguage){const e=rt[this.source].generateUrl(this.language,this.startLanguage,this.translation);t=this._showTranslateLink?U`<a class="link" href=${e} target="_blank">
            → Translate to ${this.startLanguage}</a
          >`:k}const e=rt[this.source].name,s=rt[this.source].homepage;return U`<div
      class="translation"
      @mouseover=${this.showLink}
      @mouseout=${this.hideLink}
    >
      <div class="language">${ot[this.language]}${t}</div>
      <div class="message">${this.translation}</div>
      <a href="${s}">Translated by ${e}</a>
    </div>`}}customElements.define("message-translation",dt);class ut extends tt{static properties={id:{type:Number},message:{type:String},funnyCount:{type:Number},deeepCount:{type:Number},flagsCount:{type:Number},showFlagButton:{type:Boolean},_viewerFlagged:{type:Boolean,state:!0,default:!1}};static styles=[st,it,l`
      .round {
        border-bottom: 1px solid #ed6511;
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
    `];constructor(){super()}render(){if(this.flagsCount>=2)return k;this._viewerFlagged=s(lt(this.id,"flags"));const t=`http://${window.location.host}/#${this.id}`,e=this.funnyCount?U`<div class="views">😆 x ${this.funnyCount}</div>`:k,i=this.deeepCount?U`<div class="views">🤔 x ${this.deeepCount}</div>`:k,n=this.showFlagButton?U`<div class="views">
          <button
            class="small-button"
            @click=${this.flag}
            ?disabled=${this._viewerFlagged}
          >
            🚫 Flag
          </button>
        </div>`:k;return U`<div class="round">
      <a href="${t}">${this.message}</a>
      ${n} ${e} ${i}
    </div>`}flag(){window.confirm("Is this message offensive, inappropriate, or hurtful?")&&(fetch(`/rounds/${this.id}/reactions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"flags"})}).catch(console.error),this.flagsCount+=1,this._viewerFlagged=!0,i(lt(this.id,"flags"),(new Date).getTime()))}}customElements.define("round-summary",ut);let ct=!1;function pt(t,e,s){const i=document.createElement("round-summary");i.setAttribute("id",t.id),i.setAttribute("message",t.message),i.setAttribute("funnyCount",t.funny_count),i.setAttribute("deeepCount",t.deeep_count),i.setAttribute("flagsCount",t.flags_count),s&&i.setAttribute("showFlagButton",s),e.append(i)}function gt(t,e,s){fetch(`/rounds?order=${t}&num=${s}`).then((t=>t.json())).then((t=>{if("success"!==t.status)return;const s=t.rounds;for(var i=0;i<s.length;i++)pt(s[i],e,!0)})).catch(console.error)}function vt(t){var e=s("rounds");if(e){(e=JSON.parse(e)).sort((function(t,e){return e.date-t.date})),document.getElementById("yours").innerHTML="";for(var i=0;i<Math.min(t,e.length);i++)pt(e[i],document.getElementById("yours"),!1);document.getElementById("yours-section").style.display="block"}}function $t(){if(!ct){var t=window.location.hash.replace("#","");t.length>0&&function(t){fetch(`/rounds/${t}`).then((t=>t.json())).then((t=>{if("success"!==t.status)return;const e=document.getElementsByTagName("translations-ui")[0];e.setAttribute("startMessage",t.round.message),e.setAttribute("startLanguage",t.round.language),e.setAttribute("id",t.round.id),e.setAttribute("translations",JSON.stringify(t.round.translations))})).catch(console.error)}(t)}ct=!1}function mt(){window.onhashchange=function(){$t()}}function ft(){mt(),vt(3);const t=document.createElement("translations-ui");t.addEventListener("saved",(t=>{const e=t.detail.round;ct=!0,window.location.hash=e.id;const n=JSON.parse(s("rounds","[]"));n.push({id:e.id,message:e.message,date:(new Date).getTime()}),i("rounds",JSON.stringify(n)),vt(3)})),document.getElementById("translations-ui").appendChild(t),$t()}function At(){mt(),gt("recent",document.getElementById("recent"),30)}function _t(){mt(),gt("popular",document.getElementById("popular"),30)}function yt(){mt(),vt(1e3)}export{ft as initMain,_t as initPopular,At as initRecent,yt as initYours};
//# sourceMappingURL=bundle.js.map
