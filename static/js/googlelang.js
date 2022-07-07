var yandex = window.yandex || {};

yandex.translate = function (query, srcLang, destLang, callback) {
  fetch("/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: query, from: srcLang, to: destLang }),
  })
    .then((response) => response.json())
    .then((data) => {
      let result = {};
      if (data.code === 200) {
        result.translation = data.text;
      } else {
        result.error = data.code;
      }
      callback(result);
    })
    .catch(console.error);
};

yandex.LANGUAGES = {
    "ALBANIAN": "sq",
    "AMHARIC": "am",
    "ARABIC": "ar",
    "ARMENIAN": "hy",
    "AZERBAIJANI": "az",
    "BASQUE": "eu",
    //"BELARUSIAN": "be",
    "BENGALI": "bn",
    "BULGARIAN": "bg",
    "BURMESE": "my",
    "CATALAN": "ca",
    "CHINESE": "zh",
    "CROATIAN": "hr",
    "CZECH": "cs",
    "DANISH": "da",
    "DUTCH": "nl",
    "ENGLISH": "en",
    //"ESPERANTO": "eo",
    "ESTONIAN": "et",
    "FINNISH": "fi",
    "FRENCH": "fr",
    "GALICIAN": "gl",
    "GEORGIAN": "ka",
    "GERMAN": "de",
    "GREEK": "el",
    "HAITIAN_CREOLE": "ht",
    "HINDI": "hi",
    "HUNGARIAN": "hu",
    "ICELANDIC": "is",
    "INDONESIAN": "id",
    "IRISH": "ga",
    "ITALIAN": "it",
    "JAPANESE": "ja",
    "KANNADA": "kn",
    "KAZAKH": "kk",
    "KHMER": "km",
    "KOREAN": "ko",
    "KYRGYZ": "ky",
    "LAOTHIAN": "lo",
    //"LATIN": "la",
    "LATVIAN": "lv",
    "LITHUANIAN": "lt",
    //"LUXEMBOURGISH": "lb",
    "MACEDONIAN": "mk",
    "MALAY": "ms",
    "MALAYALAM": "ml",
    "MALTESE": "mt",
    "MAORI": "mi",
    "MARATHI": "mr",
    "MONGOLIAN": "mn",
    "NEPALI": "ne",
    "NORWEGIAN": "no",
    "PERSIAN": "fa",
    "POLISH": "pl",
    "PORTUGUESE": "pt",
    "PUNJABI": "pa",
    "ROMANIAN": "ro",
    "RUSSIAN": "ru",
    //"SCOTS_GAELIC": "gd",
    "SERBIAN": "sr",
    //"SINHALESE": "si",
    "SLOVAK": "sk",
    "SLOVENIAN": "sl",
    "SPANISH": "es",
    //"SUNDANESE": "su",
    "SWAHILI": "sw",
    "SWEDISH": "sv",
    //"TAJIK": "tg",
    "TAMIL": "ta",
    //"TAGALOG": "tl",
    "TATAR": "tt",
    "TELUGU": "te",
    "THAI": "th",
    "TURKISH": "tr",
    "UKRAINIAN": "uk",
    "URDU": "ur",
    "UZBEK": "uz",
    "VIETNAMESE": "vi",
    "WELSH": "cy"
    //"YIDDISH": "yi"
};
