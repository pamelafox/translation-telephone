import {translate, SOURCES, LANGUAGES} from './googlelang.js';

var currentLang;
var currentMessage;
var startLanguage;
var targetLangs;
var translations = [];
var userGenerated = false;
var ignoreHashChange = false;
var LS_ROUNDS = 'rounds';

function start(e) {
  e && e.preventDefault();

  if ($('#message').val().length == 0) {
    alert('Please enter something longer than that.');
    return;
  }

  // Set new globals
  $('#share').hide();
  $('#translations').empty();
  translations = [];
  currentMessage = $('#message').val();
  currentLang = -1;
  startLanguage = 'ENGLISH';

  // Try to detect non-english language
  var startLanguage = $('#languages option:selected').html();

  var allLangs = Object.keys(LANGUAGES);
  // Remove start language from possible languages
  for (var i = 0; i < allLangs.length; i++) {
    if (allLangs[i] == startLanguage) {
      allLangs.splice(i, 1);
    }
  }

  // Pick X random languages
  allLangs.sort(function() {
    return (Math.round(Math.random())-0.5);
  });
  targetLangs = allLangs.slice(0, 3);
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
  if (currentLang == (targetLangs.length-1)) {
    var startMessage = translations[0].message;
    fetch("/rounds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({translations: translations, usergen: userGenerated, message: startMessage, language: translations[0].language, endmessage: translations[translations.length-1].message})
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status !== 'success') return;
        var id = data.round.id
        $('#url').val('http://' + window.location.host + '/#' + id);
        ignoreHashChange = true;
        window.location.hash = id;
        $('#share').show();
        $('#share_original').show();
        if (supportsStorage()) {
          var rounds = localStorage.getItem('rounds');
          if (rounds) {
            rounds = JSON.parse(rounds);
          } else {
            rounds = [];
          }
          rounds.push({'id': id, 'message': startMessage, 'date': new Date().getTime()});
          localStorage.setItem(LS_ROUNDS, JSON.stringify(rounds));
          getYours(3);
        }
      });
     return;
  }
  var srcLang = LANGUAGES[targetLangs[currentLang]];
  var destLang = LANGUAGES[targetLangs[currentLang+1]];
  translate(currentMessage, srcLang, destLang, function(result) {
    if (result.status == "success") {
      var translation = {};
      translation.language = targetLangs[currentLang+1];
      translation.message = result.text;
      translation.source = result.source;
      if (translation.message == '') {
        alert('Hm, that translated to nothing in ' + translation.language + ' - please try a different, longer message!');
        translation.message = '&nbsp;';
        return;
      }
      translations.push(translation);
      addTranslation(translation);
      window.scroll(0, document.body.offsetHeight);
      currentMessage = translation.message;
      translateNextMessage();
    } else if (result.status == "error" && result.message == "Language pair not supported") {
      // Language pair not supported
      translateNextMessage();
    } else {
      alert(result.message);
    }
  });
}

function addTranslation(translation) {
  var div = $('<div class="translation"></div>');
  var language = $('<div class="language"></div>').appendTo(div).html(translation.language);
  var message = $('<div class="message"></div>').appendTo(div).html(translation.message);
  if (translation.source) {
    var sourceName = SOURCES[translation.source].name;
    var sourceUrl = SOURCES[translation.source].homepage;
    $('<a></a>').appendTo(div).attr('href', sourceUrl).text(`Translated by ${sourceName}`);

    if (translation.language != startLanguage) {
      var translateUrl = SOURCES[translation.source].generateUrl(LANGUAGES[translation.language], LANGUAGES[startLanguage], translation.message)
      var link = $('<a style="padding-left: 4px;" target="_blank" href="' + translateUrl + '">&rarr; Translate to ' + startLanguage + '</a>').appendTo(language).hide();
      div.mouseover(function() {
        link.show();
      });
      div.mouseout(function() {
        link.hide();
      });
    }
  }
  $('#translations').append(div);
}

function loadRound(id) {
  fetch(`/rounds/${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== 'success') return;
      const translations = data.round.translations;
       $('#message').val(translations[0].message);
       startLanguage = translations[0].language;
       $('#share').hide();
       $('#translations').empty();
       for (var i = 0; i < translations.length; i++) {
         addTranslation(translations[i]);
       }
       $('#share').show();
       $('#share_original').show();
       $('#url').val('http://' + window.location.host + '/#' + id);
     })
    .catch(console.error);
}

function addRound(round, parent) {
  var url = 'http://' + window.location.host + '/#' + round.id;
  var div = $('<div class="round"></div>');
  var html = '<a href="' + url + '">' + round.message + '</a>';
  if (round.views) html += '<div class="views">' + round.views + ' views</div>'
  div.html(html);
  div.click(function() {
    loadRound(round.id);
  })
  parent.append(div);
}


function getRounds(order, div, num) {
  fetch(`/rounds?order=${order}&num=${num}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== 'success') return;
      const rounds = data.rounds;
      for (var i = 0; i < rounds.length; i++) {
        rounds[i].message = rounds[i].message;
        addRound(rounds[i], div);
      }
    })
    .catch(console.error);
}


function getYours(num) {
  if (!supportsStorage) return;

  function dateSort(a, b){
    return (b.date - a.date);
  }

  var rounds = localStorage.getItem(LS_ROUNDS);
  if (rounds) {
    rounds = JSON.parse(rounds);
    rounds.sort(dateSort);
    $('#yours').empty();
    for (var i = 0; i < Math.min(num, rounds.length); i++) {
      addRound(rounds[i], $('#yours'));
    }
  }
}


function supportsStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function startOver() {
  $(window).scrollTop(0);
  $('#message').val('').focus();
}

function loadFromHash() {
  // Load round in hash
  if (!ignoreHashChange) {
     var id = window.location.hash.replace('#', '');

     if (id.indexOf('message=') > -1 ) {
       $('#message').val(id.split('=')[1]);
       start();
     } else if (id.length > 0) {
       loadRound(id);
     }
   }
   ignoreHashChange = false;
}

function initAll() {
  window.onhashchange = function() {
    loadFromHash();
  };
}

export function initMain() {
  initAll();
  loadFromHash();
  getYours(3);

  $.each(LANGUAGES, function(name, code) {
     var option = $('<option>');
     option.val(code);
     option.html(name);
     if (code == 'en') option.attr('selected', 'selected');
     $('#languages').append(option);
  });

  document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    start();
    return false;
  });
  document.getElementById('start-over-link').addEventListener('click', (e) => {
    e.preventDefault();
    startOver();
  });
  document.getElementById('message').addEventListener('keyup', () => {
   userGenerated = true;
  });
}

export function initRecent() {
  initAll();
  getRounds('recent', $('#recent'), 30);
}

export function initPopular() {
  initAll();
  getRounds('popular', $('#popular'), 30);
}

export function initYours() {
  initAll();
  getYours(1000);
}

