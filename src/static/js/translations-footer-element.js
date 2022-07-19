import { html, css, LitElement, nothing } from "lit";

import { inputStyles } from "./shared-styles.js";
import { genLSKey, genRoundURL } from "./shared-logic.js";
import { get, set } from "./user-store.js";

const reactionTypes = ["deeep", "funny", "flags"];

export class TranslationsFooter extends LitElement {
  static properties = {
    id: { type: Number },
    _reactions: { type: Array, state: true },
  };

  static styles = [
    inputStyles,
    css`
      input[type="url"] {
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
    if (!this.id) return nothing;

    if (!this.reactions) {
      this._reactions = reactionTypes.filter((rType) => {
        return get(genLSKey(this.id, rType));
      });
    }
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
      <p>
        ▶ Share: <input type="url" readonly="" value=${genRoundURL(this.id)} />
      </p>
      <p>
        ▶ <button @click=${this.onStartOverClick}>Try a new message</button>
      </p>
    </div>`;
  }

  react(reactionType) {
    fetch(`/api/rounds/${this.id}/reactions`, {
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
