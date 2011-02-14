google.load("language", "1");

// Valid languages for translation pairs
var allLangs = [
'AFRIKAANS',
'ALBANIAN',
'ARABIC',
'BELARUSIAN',
'BULGARIAN',
'CATALAN', 
'CHINESE',
'CROATIAN',
'CZECH',
'DANISH',
'DUTCH',
'ENGLISH',
'FILIPINO',
'FINNISH',
'FRENCH',
'GALICIAN',
'GERMAN',
'GREEK',
'HAITIAN_CREOLE',
'HEBREW',
'HINDI',
'HUNGARIAN',
'ICELANDIC',
'INDONESIAN',
'IRISH',
'ITALIAN',
'JAPANESE',
'KOREAN',
'LATVIAN',
'LITHUANIAN',
'MACEDONIAN',
'MALAY',
'MALTESE',
'NORWEGIAN',
'PERSIAN',
'POLISH',
'PORTUGUESE',
'ROMANIAN',
'RUSSIAN',
'SERBIAN',
'SLOVAK',
'SLOVENIAN',
'SPANISH',
'SWAHILI',
'SWEDISH',
'THAI',
'TURKISH',
'UKRAINIAN',
'VIETNAMESE',
'WELSH',
'YIDDISH'
];

var randomMessages = [
  "The massive monster ate 100 hot dogs and then puked orange junk all over his wife.",
  "Let us go then, you and I,	when the evening is spread out against the sky, like a patient etherised upon a table.",
  "I like 'em round, and big, and when I'm throwin' a gig I just can't help myself, I'm actin' like an animal."
]
var currentLang;
var currentMessage;
var startLanguage;
var targetLangs;
var translations = [];
var userGenerated = false;

function start() {
  $('#share').hide();
  $('#translations').empty();
  translations = [];
  // Set new globals
  currentMessage = document.getElementById('message').value;
  currentLang = 0;
  
  startLanguage = 'ENGLISH';
  
  // Try to detect non-english language
  google.language.detect(currentMessage, function(result) {
    if (!result.error) {
      for (l in google.language.Languages) {
        if (google.language.Languages[l] == result.language) {
          startLanguage = l;
          break;
        }
      }
    }
  
    
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
    targetLangs = allLangs.slice(0, 20);
    targetLangs.push(startLanguage);
    
    var translation = {};
    translation.language = startLanguage;
    translation.message = currentMessage;
    translations.push(translation);
    addTranslation(translation);
    
    // Start the translation!
    translateNextMessage();
  });
}

function translateNextMessage() {
  currentLang++;
  if (currentLang == (targetLangs.length-1)) {
    $.ajax({
      url: 'round',
      data: {translations: JSON.stringify(translations), usergen: userGenerated, message: translations[0].message}, 
      dataType: 'text',
      type: 'post', 
      success: function(response) {
        var id = response;
        $('#url').val('http://' + window.location.host + '/#' + id);
        window.location.hash = id;
        $('#share').show();
      }
     })
     return;
  }
  
  var srcLang = google.language.Languages[targetLangs[currentLang]];
  var destLang = google.language.Languages[targetLangs[currentLang+1]];
  google.language.translate(currentMessage, srcLang, destLang, function(result) {
    if (!result.error) {
      var translation = {};
      translation.language = targetLangs[currentLang+1];
      translation.message = result.translation;
      translations.push(translation);
      addTranslation(translation);
      window.scroll(0, document.body.offsetHeight);
      currentMessage = translation.message;
    } 
    translateNextMessage();
  });
}

function addTranslation(translation) {
  var div = $('<div class="translation"></div>');
  var language = $('<div class="language"></div>').appendTo(div).html(translation.language);
  var message = $('<div class="message"></div>').appendTo(div).html(translation.message);
  
  if (translation.language != startLanguage) {
    var url = 'http://translate.google.com/#' + google.language.Languages[translation.language] + '|' + google.language.Languages[startLanguage] + '|' + translation.message;
    var link = $('<a style="padding-left: 4px;" target="_blank" href="' + url + '">&rarr; Translate to ' + startLanguage + '</a>').appendTo(language).hide();
    div.mouseover(function() {
      link.show();
    });
    div.mouseout(function() {
      link.hide();
    });
  }
  $('#translations').append(div);
}

function useRandom() {
  userGenerated = false;
  $('#message').val(randomMessages[Math.floor(Math.random()*randomMessages.length)]);
  start();
}

function loadRound(id) {
  $.ajax({
     url: 'round?id=' + id,
     dataType: 'json',
     type: 'get', 
     success: function(translations) {
       $('#message').val(translations[0].message);
       startLanguage = translations[0].language;
       $('#share').hide();
       $('#translations').empty();
       for (var i = 0; i < translations.length; i++) {
         addTranslation(translations[i]);
       }
     },
     error: function(xhr, status) {
     }
  });
}

function addRound(round, parent) {
  var url = 'http://' + window.location.host + '/#' + round.id;
  var div = $('<div class="round"></div>');
  div.html('<a href="' + url + '">' + round.message + '</a>');
  div.click(function() {
    loadRound(round.id);
  })
  parent.append(div);
}


function getRounds(order, div, num) {
  $.ajax({
    url: 'rounds?order=' + order + '&num=' + num,
    dataType: 'json',
    type: 'get', 
    success: function(rounds) {
      for (var i = 0; i < rounds.length; i++) {
        addRound(rounds[i], div);
      }
    },
    error: function(xhr, status) {
    }
   });
}

function initMain() {
   // Load round in hash
   var id = window.location.hash.replace('#', '');
   if (id.length > 0) {
     loadRound(id);
   }
   
   google.language.getBranding('branding');
   
   getRounds('-date', $('#recent'), 3);
   getRounds('-views', $('#popular'), 3);
   $('#message').keyup(function() {
     userGenerated = true;
   })   
}

function initRecent() {
  getRounds('-date', $('#recent'), 30);
}

function initPopular() {
  getRounds('-views', $('#popular'), 30);
}

