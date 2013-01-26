var google = window.google || {};

/* http://javascriptweblog.wordpress.com/2010/11/29/json-and-jsonp/ */
google.jsonp = {
  callbackCounter: 0,

  fetch: function(url, callback) {
    var fn = 'JSONPCallback_' + this.callbackCounter++;
    window[fn] = this.evalJSONP(callback);
    url = url.replace('=JSONPCallback', '=' + fn);

    var scriptTag = document.createElement('SCRIPT');
    scriptTag.src = url;
    document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
  },

  evalJSONP: function(callback) {
    return function(data) {
      var validJSON = false;
      if (typeof data == 'object') {
        validJSON = data;
      } else if (typeof data == "string") {
        try {
          validJSON = JSON.parse(data);
        } catch (e) {
           /*invalid JSON*/
        }
      }
      if (validJSON) {
        callback(validJSON);
      } else {
        throw("JSONP call returned invalid or empty JSON");
      }
    }
  }
};

google.language = {};
google.language.translate = function (query, srcLang, destLang, callback) {
  function processJSON(json) {
    var result = {};
    if (json.data && json.data.translations && json.data.translations.length) {
      result.translation = json.data.translations[0].translatedText;
    } else {
      result.error = 'Error';
    }
    callback(result);
  }

  var url = 'https://script.google.com/macros/s/AKfycbzP0VUUuEYhQkepxstteW7rhOfchCqGCf29dbNzHAf4fAQlwFg/exec?key=' + google.API_KEY + '&source=' + srcLang + '&target=' + destLang + '&callback=JSONPCallback&q=' + encodeURIComponent(query);
  google.jsonp.fetch(url, processJSON);
};

google.language.detect = function(query, callback) {
  function processJSON(json) {
    var result = {};
    if (json.data && json.data.detections && json.data.detections.length) {
      result.language = json.data.detections[0].language;
    } else {
      result.error = 'Error';
    }
    callback(result);
  }

  var url = 'https://www.googleapis.com/language/translate/v2/detect?key=' + google.API_KEY + '&callback=JSONPCallback&q=' + query;
  google.jsonp.fetch(url, processJSON);
};

google.language.Languages = {
    "AFRIKAANS": "af",
    "ALBANIAN": "sq",
    "AMHARIC": "am",
    "ARABIC": "ar",
    "ARMENIAN": "hy",
    "AZERBAIJANI": "az",
    "BASQUE": "eu",
    "BELARUSIAN": "be",
    "BENGALI": "bn",
    "BIHARI": "bh",
    "BULGARIAN": "bg",
    "BURMESE": "my",
    "BRETON": "br",
    "CATALAN": "ca",
    "CHEROKEE": "chr",
    "CHINESE": "zh",
    "CHINESE_SIMPLIFIED": "zh-CN",
    "CHINESE_TRADITIONAL": "zh-TW",
    "CORSICAN": "co",
    "CROATIAN": "hr",
    "CZECH": "cs",
    "DANISH": "da",
    "DHIVEHI": "dv",
    "DUTCH": "nl",
    "ENGLISH": "en",
    "ESPERANTO": "eo",
    "ESTONIAN": "et",
    "FAROESE": "fo",
    "FILIPINO": "tl",
    "FINNISH": "fi",
    "FRENCH": "fr",
    "FRISIAN": "fy",
    "GALICIAN": "gl",
    "GEORGIAN": "ka",
    "GERMAN": "de",
    "GREEK": "el",
    "GUJARATI": "gu",
    "HAITIAN_CREOLE": "ht",
    "HEBREW": "iw",
    "HINDI": "hi",
    "HUNGARIAN": "hu",
    "ICELANDIC": "is",
    "INDONESIAN": "id",
    "INUKTITUT": "iu",
    "IRISH": "ga",
    "ITALIAN": "it",
    "JAPANESE": "ja",
    "JAVANESE": "jw",
    "KANNADA": "kn",
    "KAZAKH": "kk",
    "KHMER": "km",
    "KOREAN": "ko",
    "KURDISH": "ku",
    "KYRGYZ": "ky",
    "LAO": "lo",
    "LAOTHIAN": "lo",
    "LATIN": "la",
    "LATVIAN": "lv",
    "LITHUANIAN": "lt",
    "LUXEMBOURGISH": "lb",
    "MACEDONIAN": "mk",
    "MALAY": "ms",
    "MALAYALAM": "ml",
    "MALTESE": "mt",
    "MAORI": "mi",
    "MARATHI": "mr",
    "MONGOLIAN": "mn",
    "NEPALI": "ne",
    "NORWEGIAN": "no",
    "OCCITAN": "oc",
    "ORIYA": "or",
    "PASHTO": "ps",
    "PERSIAN": "fa",
    "POLISH": "pl",
    "PORTUGUESE": "pt",
    "PORTUGUESE_PORTUGAL": "pt-PT",
    "PUNJABI": "pa",
    "QUECHUA": "qu",
    "ROMANIAN": "ro",
    "RUSSIAN": "ru",
    "SANSKRIT": "sa",
    "SCOTS_GAELIC": "gd",
    "SERBIAN": "sr",
    "SINDHI": "sd",
    "SINHALESE": "si",
    "SLOVAK": "sk",
    "SLOVENIAN": "sl",
    "SPANISH": "es",
    "SUNDANESE": "su",
    "SWAHILI": "sw",
    "SWEDISH": "sv",
    "SYRIAC": "syr",
    "TAJIK": "tg",
    "TAMIL": "ta",
    "TAGALOG": "tl",
    "TATAR": "tt",
    "TELUGU": "te",
    "THAI": "th",
    "TIBETAN": "bo",
    "TONGA": "to",
    "TURKISH": "tr",
    "UKRAINIAN": "uk",
    "URDU": "ur",
    "UZBEK": "uz",
    "UIGHUR": "ug",
    "VIETNAMESE": "vi",
    "WELSH": "cy",
    "YIDDISH": "yi",
    "YORUBA": "yo",
    "UNKNOWN": ""
};
