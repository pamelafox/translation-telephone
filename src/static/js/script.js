import { get, set } from "./user-store.js";
import "./translations-ui-element.js";
import "./translations-footer-element.js";
import "./message-translation-element.js";
import "./round-summary-element.js";

let ignoreHashChange = false;
let LS_ROUNDS = "rounds";

function loadRound(id) {
  fetch(`/api/rounds/${id}`)
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
  fetch(`/api/rounds?order=${order}&num=${num}`)
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
    if (document.getElementById("yours-section")) {
      document.getElementById("yours-section").style.display = "block";
    }
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

export function initMain() {
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

export function initRecent() {
  initAll();
  getRounds("recent", document.getElementById("recent"), 30);
}

export function initPopular() {
  initAll();
  getRounds("popular", document.getElementById("popular"), 30);
}

export function initYours() {
  initAll();
  getYours(1000);
}
