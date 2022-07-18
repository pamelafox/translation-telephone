const veryLocalStorage = {};

function supportsStorage() {
  try {
    return "localStorage" in window && window["localStorage"] !== null;
  } catch (e) {
    return false;
  }
}

export function get(key, defaultValue) {
  let value;
  if (!supportsStorage()) {
    value = veryLocalStorage[key];
  } else {
    value = localStorage.getItem(key);
  }
  return value === null || typeof value === "undefined" ? defaultValue : value;
}

export function set(key, value) {
  if (!supportsStorage()) {
    veryLocalStorage[key] = value;
  } else {
    localStorage.setItem(key, value);
  }
}
