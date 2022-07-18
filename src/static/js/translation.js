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

export function genRandomLanguages(startLanguage) {
  let allLangs = Object.keys(LANGUAGES);
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
  let targetLangs = allLangs.slice(0, 12);
  targetLangs.unshift(startLanguage);
  targetLangs.push(startLanguage);
  return targetLangs;
}

export const SOURCES = {
  AZURE: {
    name: "Azure Cognitive Services",
    homepage:
      "https://docs.microsoft.com/en-us/azure/cognitive-services/translator/",
    generateUrl: (src, dest, text) =>
      `https://www.bing.com/translator?text=${text}&from=${src}&to=${dest}`,
  },
};

// Languages supported both by Azure and Yandex APIs
export const LANGUAGES = {
  sq: "ALBANIAN",
  am: "AMHARIC",
  ar: "ARABIC",
  hy: "ARMENIAN",
  az: "AZERBAIJANI",
  eu: "BASQUE",
  bn: "BENGALI",
  bg: "BULGARIAN",
  my: "BURMESE",
  ca: "CATALAN",
  zh: "CHINESE",
  hr: "CROATIAN",
  cs: "CZECH",
  da: "DANISH",
  nl: "DUTCH",
  en: "ENGLISH",
  et: "ESTONIAN",
  fi: "FINNISH",
  fr: "FRENCH",
  gl: "GALICIAN",
  ka: "GEORGIAN",
  de: "GERMAN",
  el: "GREEK",
  ht: "HAITIAN_CREOLE",
  hi: "HINDI",
  hu: "HUNGARIAN",
  is: "ICELANDIC",
  id: "INDONESIAN",
  ga: "IRISH",
  it: "ITALIAN",
  ja: "JAPANESE",
  kn: "KANNADA",
  kk: "KAZAKH",
  km: "KHMER",
  ko: "KOREAN",
  ky: "KYRGYZ",
  lo: "LAOTHIAN",
  lv: "LATVIAN",
  lt: "LITHUANIAN",
  mk: "MACEDONIAN",
  ms: "MALAY",
  ml: "MALAYALAM",
  mt: "MALTESE",
  mi: "MAORI",
  mr: "MARATHI",
  mn: "MONGOLIAN",
  ne: "NEPALI",
  no: "NORWEGIAN",
  fa: "PERSIAN",
  pl: "POLISH",
  pt: "PORTUGUESE",
  pa: "PUNJABI",
  ro: "ROMANIAN",
  ru: "RUSSIAN",
  sr: "SERBIAN",
  sk: "SLOVAK",
  sl: "SLOVENIAN",
  es: "SPANISH",
  sw: "SWAHILI",
  sv: "SWEDISH",
  ta: "TAMIL",
  tt: "TATAR",
  te: "TELUGU",
  th: "THAI",
  tr: "TURKISH",
  uk: "UKRAINIAN",
  ur: "URDU",
  uz: "UZBEK",
  vi: "VIETNAMESE",
  cy: "WELSH",
};
