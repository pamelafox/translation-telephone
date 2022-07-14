import { html, css, LitElement } from "lit";

const reactionTypes = ["deeep", "funny", "flags"];
const genLSKey = (id, rType) => `round/${id}/reactions:${rType}`;

export class TranslationsFooter extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  static properties = {
    id: { type: Number },
    _reactions: { type: Array, state: true },
  };

  constructor() {
    super();
    this._reactions = reactionTypes.filter((rType) => {
      return localStorage.getItem(genLSKey(this.id, rType));
    });
  }

  render() {
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
      <p>▶ <a @click=${this.onStartOverClick}>Try a new message</a></p>
    </div>`;
  }

  react(reactionType) {
    // first ajax
    localStorage.setItem(genLSKey(this.id, reactionType), new Date().getTime());
    this._reactions = this._reactions.concat([reactionType]);
  }

  onStartOverClick() {
    this.dispatchEvent(new CustomEvent("start-over"));
  }
}
customElements.define("translations-footer", TranslationsFooter);
