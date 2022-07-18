import { html, LitElement, nothing } from "lit";

import { buttonStyles } from "./shared-styles.js";
import { genLSKey } from "./shared-logic.js";
import { get, set } from "./user-store.js";

const reactionTypes = ["deeep", "funny", "flags"];

export class TranslationsFooter extends LitElement {
  static properties = {
    id: { type: Number },
    _reactions: { type: Array, state: true },
  };

  static styles = [buttonStyles];

  constructor() {
    super();
  }

  render() {
    if (!this.id) return nothing;

    if (!this.reactions) {
      this._reactions = reactionTypes.filter((rType) => {
        return get(genLSKey(this.id, rType));
      });
    }
    const url = `http://${window.location.host}/#${this.id}`;
    return html`<div>
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
      <p>▶ Share: <input type="text" readonly="" size="70" value=${url} /></p>
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
