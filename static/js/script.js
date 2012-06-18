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
  "I like 'em round, and big, and when I'm throwin' a gig I just can't help myself, I'm actin' like an animal.",
  "To be or not to be, that is the question.",
  "You may say that I'm a dreamer, But I'm not the only one, I hope someday you'll join us, And the world will be as one."
];

var currentLang;
var currentMessage;
var startLanguage;
var targetLangs;
var translations = [];
var userGenerated = false;
var LS_ROUNDS = 'rounds';

function start() {
  
  if ($('#message').val().length == 0) {
    alert('Please enter something longer than that.');
    return;
  }
  
  // Set new globals
  $('#share').hide();
  $('#translations').empty();
  translations = [];
  currentMessage = $('#message').val();
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
    var startMessage = translations[0].message;
    $.ajax({
      url: 'round',
      data: {translations: JSON.stringify(translations), usergen: userGenerated, message: startMessage, language: translations[0].language, endmessage: translations[translations.length-1].message}, 
      dataType: 'text',
      type: 'post', 
      success: function(response) {
        var id = response;
        $('#url').val('http://' + window.location.host + '/#' + id);
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
      }
     });
     return;
  }
  
  var srcLang = google.language.Languages[targetLangs[currentLang]];
  var destLang = google.language.Languages[targetLangs[currentLang+1]];
  google.language.translate(currentMessage, srcLang, destLang, function(result) {
    if (!result.error) {
      var translation = {};
      translation.language = targetLangs[currentLang+1];
      translation.message = result.translation;
      if (translation.message == '') {
        alert('Woah, crazy! That translated to nothing in ' + translation.language + ' - please try a different, longer message!');
        translation.message = '&nbsp;';
        return;
      }
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
    /*
    var url = 'http://translate.google.com/#' + google.language.Languages[translation.language] + '|' + google.language.Languages[startLanguage] + '|' + translation.message;
    var link = $('<a style="padding-left: 4px;" target="_blank" href="' + url + '">&rarr; Translate to ' + startLanguage + '</a>').appendTo(language).hide();
    div.mouseover(function() {
      link.show();
    });
    div.mouseout(function() {
      link.hide();
    });
    */
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
       $('#share').show();
       $('#share_original').show();
       $('#url').val('http://' + window.location.host + '/#' + id);
     },
     error: function(xhr, status) {
     }
  });
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

function filterText(txt) {
  
  function repeatString(str, num) {
    return new Array(num + 1).join(str);
  }
  // 7 Dirty Words
  var filter = ['shit', 'piss', 'fuck', 'cunt', 'cocksucker', 'motherfucker', 'tits'];
  
  for(var i=0; i<filter.length; i++) {
    var pattern = new RegExp('\\b' + filter[i] + '\\b', 'g');
    var replacement = repeatString('*', filter[i].length);
    txt = txt.replace(pattern, replacement);
  }

  return txt;
}


function getRounds(order, div, num) {
  $.ajax({
    url: 'rounds?order=' + order + '&num=' + num,
    dataType: 'json',
    type: 'get', 
    success: function(rounds) {
      for (var i = 0; i < rounds.length; i++) {
        rounds[i].message = filterText(rounds[i].message);
        addRound(rounds[i], div);
      }
    },
    error: function(xhr, status) {
    }
   });
}


function getYours(num) {
  if (!supportsStorage) return;
  
  function dateSort(a, b){
    //Compare "a" and "b" in some fashion, and return -1, 0, or 1
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
    $('#yours_section').show();
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

function shareBuzz() {
  var message = 'Check out the translation I got from Translation Telephone!';
  var url = 'http://www.google.com/buzz/post?' +
    'message=' + message.replace(' ', '%20')  + 
    '&url=' + encodeURIComponent(window.location.href);
  window.open(url,
    '_blank', 'resizable=0,scrollbars=0,width=690,height=415');
}

function shareTwitter() {
  var tweetUrl = 'http://www.translation-telephone.com/#4249';
  var url = 'http://www.twitter.com/share' +
    '?url=' + tweetUrl.replace('#', '%23');
    //'&text=Check+out+this+funny+translation';
  //replace('#', '%23');
  console.log(url);
  window.open(url,
    '_blank', 'resizable=0,scrollbars=0,width=690,height=415');
}

function shareFacebook() {
  var url = 'http://www.facebook.com/sharer.php?' +
    't=Check+out+this+funny+translation';
  window.open(url,
    '_blank', 'resizable=0,scrollbars=0,width=690,height=415');
}

function showOriginal() {
  window.scroll(0, 0);
  $('#share_original').hide();
  $('.translation').each(function(i) {
    var language = $(this).find('.language').first().text();
    var message = $(this).find('.message').first().text();
    var srcLang = google.language.Languages[language];
    var destLang = google.language.Languages[startLanguage];
    var parent = this;
    google.language.translate(message, srcLang, destLang, function(result) {
      if (!result.error) {
        $(parent).append('<div class="message_original">' + result.translation + '</div>');
      }
    });
  });
}

function initMain() {
   // Load round in hash
   var id = window.location.hash.replace('#', '');
   if (id.indexOf('message=') > -1 ) {
     $('#message').val(id.split('=')[1]);
     start();
   } else if (id.length > 0) {
     loadRound(id);
   }
   
   google.language.getBranding('branding');
   
   getRounds('-date', $('#recent'), 3);
   getRounds('-views', $('#popular'), 3);
   getYours(3);
   $('#message').keyup(function() {
     userGenerated = true;
   });
   
   if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && $('#chromepromo').attr('data-installed') != 'true') {
     $('#chromepromo').show();
   }
}

function initRecent() {
  getRounds('-date', $('#recent'), 30);
}

function initPopular() {
  getRounds('-views', $('#popular'), 30);
}

function initYours() {
  getYours(1000);
}

