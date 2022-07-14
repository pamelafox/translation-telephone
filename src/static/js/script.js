import { translate, SOURCES, LANGUAGES } from "./translation.js";
import "./translations-footer-element.js";

let currentLang;
let currentMessage;
let startLanguage;
let targetLangs;
let translations = [];
let userGenerated = false;
let ignoreHashChange = false;
let LS_ROUNDS = "rounds";

function start(e) {
  e && e.preventDefault();
  currentMessage = document.getElementById("message").value;
  if (currentMessage.length == 0) {
    alert("Please enter something longer than that.");
    return;
  }

  // Set new globals
  document.getElementById("share").innerHTML = "";
  document.getElementById("translations").innerHTML = "";
  translations = [];
  currentLang = -1;
  startLanguage = "ENGLISH";

  // Try to detect non-english language
  var startLanguage = document.getElementById("languages").value;

  var allLangs = Object.keys(LANGUAGES);
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
  targetLangs = allLangs.slice(0, 12);
  targetLangs.unshift(startLanguage);
  targetLangs.push(startLanguage);

  var translation = {};
  translation.language = startLanguage;
  translation.message = currentMessage;
  translations.push(translation);
  addTranslation(translation);

  // Start the translation!
  translateNextMessage();
}

function translateNextMessage() {
  currentLang++;
  if (currentLang == targetLangs.length - 1) {
    var startMessage = translations[0].message;
    fetch("/rounds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        translations: translations,
        usergen: userGenerated,
        message: startMessage,
        language: translations[0].language,
        endmessage: translations[translations.length - 1].message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== "success") return;
        var id = data.round.id;
        ignoreHashChange = true;
        window.location.hash = id;
        if (supportsStorage()) {
          var rounds = localStorage.getItem("rounds");
          if (rounds) {
            rounds = JSON.parse(rounds);
          } else {
            rounds = [];
          }
          rounds.push({
            id: id,
            message: startMessage,
            date: new Date().getTime(),
          });
          localStorage.setItem(LS_ROUNDS, JSON.stringify(rounds));
          getYours(3);
        }
      });
    return;
  }
  var srcLang = LANGUAGES[targetLangs[currentLang]];
  var destLang = LANGUAGES[targetLangs[currentLang + 1]];
  translate(currentMessage, srcLang, destLang, function (result) {
    if (result.status == "success") {
      var translation = {};
      translation.language = targetLangs[currentLang + 1];
      translation.message = result.text;
      translation.source = result.source;
      if (translation.message == "") {
        alert(
          "Hm, that translated to nothing in " +
            translation.language +
            " - please try a different, longer message!"
        );
        translation.message = "&nbsp;";
        return;
      }
      translations.push(translation);
      addTranslation(translation);
      window.scroll(0, document.body.offsetHeight);
      currentMessage = translation.message;
      translateNextMessage();
    } else if (
      result.status == "error" &&
      result.message == "Language pair not supported"
    ) {
      // Language pair not supported
      translateNextMessage();
    } else {
      alert(result.message);
    }
  });
}

function addTranslation(translation) {
  const div = document.createElement("div");
  div.className = "translation";
  const language = document.createElement("div");
  language.className = "language";
  language.innerHTML = translation.language;
  div.appendChild(language);
  const message = document.createElement("message");
  message.innerHTML = translation.message;
  div.appendChild(message);

  if (translation.source) {
    var sourceName = SOURCES[translation.source].name;
    var sourceUrl = SOURCES[translation.source].homepage;
    const sourceA = document.createElement("a");
    sourceA.setAttribute("href", sourceUrl);
    sourceA.innerText = `Translated by ${sourceName}`;
    div.appendChild(sourceA);

    if (translation.language != startLanguage) {
      var translateUrl = SOURCES[translation.source].generateUrl(
        LANGUAGES[translation.language],
        LANGUAGES[startLanguage],
        translation.message
      );
      const transA = document.createElement("a");
      transA.setAttribute("href", translateUrl);
      transA.setAttribute("target", "_blank");
      transA.style.paddingLeft = "4px";
      transA.innerText = `&rarr; Translate to ${startLanguage}`;
      transA.style.display = "none";
      language.appendChild(transA);
      div.addEventListener("mouseover", () => {
        transA.style.display = "block";
      });
      div.addEventListener("mouseout", () => {
        transA.style.display = "none";
      });
    }
  }
  document.getElementById("translations").appendChild(div);
}

function loadRound(id) {
  fetch(`/rounds/${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== "success") return;
      const translations = data.round.translations;
      document.getElementById("message").value = translations[0].message;
      startLanguage = translations[0].language;
      document.getElementById("translations").innerHTML = "";
      for (var i = 0; i < translations.length; i++) {
        addTranslation(translations[i]);
      }

      const footer = document.createElement("translations-footer");
      footer.setAttribute("id", id);
      footer.addEventListener("start-over", startOver);
      document.getElementById("translations-footer").innerText = "";
      document.getElementById("translations-footer").appendChild(footer);
    })
    .catch(console.error);
}

function addRound(round, parent) {
  var url = `http://${window.location.host}/#${round.id}`;
  const div = document.createElement("div");
  div.className = "round";
  var html = `'<a href="${url}">${round.message}</a>`;
  if (round.views) html += '<div class="views">' + round.views + " views</div>";
  div.innerHTML = html;
  div.click(function () {
    loadRound(round.id);
  });
  parent.append(div);
}

function getRounds(order, div, num) {
  fetch(`/rounds?order=${order}&num=${num}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== "success") return;
      const rounds = data.rounds;
      for (var i = 0; i < rounds.length; i++) {
        addRound(rounds[i], div);
      }
    })
    .catch(console.error);
}

function getYours(num) {
  if (!supportsStorage) return;

  function dateSort(a, b) {
    return b.date - a.date;
  }

  var rounds = localStorage.getItem(LS_ROUNDS);
  if (rounds) {
    rounds = JSON.parse(rounds);
    rounds.sort(dateSort);
    document.getElementById("yours").innerHTML = "";
    for (var i = 0; i < Math.min(num, rounds.length); i++) {
      addRound(rounds[i], document.getElementById("yours"));
    }
    document.getElementById("#yours-section").style.display = "block";
  }
}

function supportsStorage() {
  try {
    return "localStorage" in window && window["localStorage"] !== null;
  } catch (e) {
    return false;
  }
}

function startOver() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  document.getElementById("message").value = "";
  document.getElementById("message").focus();
}

function loadFromHash() {
  // Load round in hash
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
  loadFromHash();
  getYours(3);

  LANGUAGES.forEach((name, code) => {
    const option = document.createElement("option");
    option.value = code;
    option.innerText = name;
    if (code == "en") option.setAttribute("selected", "selected");
    document.getElementById("languages").appendChild(option);
  });

  document.getElementById("message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    start();
    return false;
  });
  document.getElementById("message").addEventListener("keyup", () => {
    userGenerated = true;
  });
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
