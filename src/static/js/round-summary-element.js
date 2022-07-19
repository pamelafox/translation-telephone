import { html, css, nothing, LitElement } from "lit";
import { inputStyles, censoredStyle } from "./shared-styles.js";

import { genLSKey } from "./shared-logic.js";
import { get, set } from "./user-store.js";

export class RoundSummary extends LitElement {
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
    css`
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
    if (this.flagsCount >= 2) return nothing;
    this._viewerFlagged = get(genLSKey(this.id, "flags"));
    const url = `http://${window.location.host}/#${this.id}`;
    const funnyDisplay = this.funnyCount
      ? html`<div class="views">😆 x ${this.funnyCount}</div>`
      : nothing;
    const deeepDisplay = this.deeepCount
      ? html`<div class="views">🤔 x ${this.deeepCount}</div>`
      : nothing;
    const flagButton = this.showFlagButton
      ? html`<div class="views">
          <button
            class="small-button"
            @click=${this.flag}
            ?disabled=${this._viewerFlagged}
          >
            🚫 Flag
          </button>
        </div>`
      : nothing;

    return html`<div class="round">
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
