import { html, css, LitElement } from "lit";

import { inputStyles, censoredStyle } from "./shared-styles.js";
import { genRandomLanguages, translate } from "./translation.js";

export class TranslationsUI extends LitElement {
  static styles = [
    inputStyles,
    censoredStyle,
    css`
      input[name="message"] {
        width: 530px;
        max-width: 100%;
        margin-bottom: 8px;
      }
    `,
  ];

  static properties = {
    messageOptions: { type: Array, default: [] },
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
    const msgTranslations = this.translations.map((translation) => {
      return html`<message-translation
        translation=${translation.message}
        language=${translation.language}
        source=${translation.source}
        startLanguage=${this.startLanguage}
      ></message-translation>`;
    });

    const msgOptions = this.messageOptions.map((messageOption) => {
      return html`<option>${messageOption}</option>`;
    });

    return html`
         </div>
             <form @submit=${this.onSubmit} @keyup=${() => {
      this._userGenerated = true;
    }}>
              <label for="message">Select a phrase (type a word to find matches):</label>
              <br>
              <input name="message" list="message-options" placeholder="Start typing..." .value="${
                this.startMessage
              }">
              <datalist id="message-options">
                ${msgOptions}
              </datalist>
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

    this.startLanguage = "en";
    this.translations = [];
    this.id = null;

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
      fetch("/api/rounds", {
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
