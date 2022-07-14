export function translate(query, srcLang, destLang, callback) {
  fetch("/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: query, from: srcLang, to: destLang }),
  })
    .then((response) => response.json())
    .then(callback)
    .catch(console.error);
}

export const SOURCES = {
 "AZURE": {"name": "Azure Cognitive Services Translator",
           "homepage": "https://docs.microsoft.com/en-us/azure/cognitive-services/translator/",
           "generateUrl": (src, dest, text) => `https://www.bing.com/translator?text=${text}&from=${src}&to=${dest}`
  }
};

// Languages supported both by Azure and Yandex APIs
export const LANGUAGES = {
    "ALBANIAN": "sq",
    "AMHARIC": "am",
    "ARABIC": "ar",
    "ARMENIAN": "hy",
    "AZERBAIJANI": "az",
    "BASQUE": "eu",
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
    "LATVIAN": "lv",
    "LITHUANIAN": "lt",
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
    "SERBIAN": "sr",
    "SLOVAK": "sk",
    "SLOVENIAN": "sl",
    "SPANISH": "es",
    "SWAHILI": "sw",
    "SWEDISH": "sv",
    "TAMIL": "ta",
    "TATAR": "tt",
    "TELUGU": "te",
    "THAI": "th",
    "TURKISH": "tr",
    "UKRAINIAN": "uk",
    "URDU": "ur",
    "UZBEK": "uz",
    "VIETNAMESE": "vi",
    "WELSH": "cy"
};
