import { html, css, nothing, LitElement } from "lit";
import { aStyles } from "./shared-styles.js";

export class RoundSummary extends LitElement {
  static properties = {
    id: { type: Number },
    message: { type: String },
    views: { type: Number },
  };

  static styles = [
    aStyles,
    css`
      .round {
        border-bottom: 1px solid #ed6511;
        line-height: 1.3em;
        margin-bottom: 5px;
      }
      .views {
        float: right;
        font-size: 10px;
      }
    `,
  ];

  constructor() {
    super();
  }

  render() {
    const url = `http://${window.location.host}/#${this.id}`;
    const viewsDisplay = this.views
      ? html`<div class="views">${this.views} views</div>`
      : nothing;
    return html`<div class="round">
      <a href="${url}">${this.message}</a>
      ${viewsDisplay}
    </div>`;
  }
}

customElements.define("round-summary", RoundSummary);
