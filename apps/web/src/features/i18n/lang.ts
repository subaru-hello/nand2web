import { useSyncExternalStore } from "react";

/**
 * Site-wide explanation language. Interactive UI stays English; prose in
 * the deep-dive sections switches between English and Japanese.
 */
export type Lang = "en" | "ja";

const KEY = "nand2web:lang";
const listeners = new Set<() => void>();

export function getLang(): Lang {
  try {
    return localStorage.getItem(KEY) === "ja" ? "ja" : "en";
  } catch {
    return "en";
  }
}

export function setLang(lang: Lang): void {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // private mode — preference just won't persist
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => "en");
}
