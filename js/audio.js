// Text-to-speech (Russian) and speech recognition wrappers.
import { stripStress } from './util.js';
import { state } from './state.js';

let voices = [];
function refresh() { try { voices = speechSynthesis.getVoices(); } catch { voices = []; } }
if ('speechSynthesis' in window) { refresh(); speechSynthesis.onvoiceschanged = refresh; }

export function russianVoices() { return voices.filter(v => /^ru([-_]|$)/i.test(v.lang)); }
export function hasRussianVoice() { return russianVoices().length > 0; }
export function ttsSupported() { return 'speechSynthesis' in window; }

function bestVoice() {
  const ru = russianVoices();
  if (!ru.length) return null;
  const pref = state.settings.voice && ru.find(v => v.name === state.settings.voice);
  return pref || ru.find(v => /google|natural|online/i.test(v.name)) || ru.find(v => v.default) || ru[0];
}

/* Online fallback: used when the device has no Russian voice (e.g. a fresh Windows install). */
let onlineAudio = null;
function speakOnline(clean, slow) {
  return new Promise(resolve => {
    try {
      if (onlineAudio) { onlineAudio.pause(); onlineAudio = null; }
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ru&client=tw-ob&ttsspeed=${slow ? 0.3 : 1}&q=${encodeURIComponent(clean.slice(0, 180))}`;
      const a = new Audio(url);
      onlineAudio = a;
      a.onended = () => resolve(true);
      a.onerror = () => resolve(false);
      a.play().catch(() => resolve(false));
      setTimeout(() => resolve(true), 10000);
    } catch { resolve(false); }
  });
}
export function usingOnlineVoice() { return !hasRussianVoice() && state.settings.onlineAudio !== false && navigator.onLine; }

/** Speak Russian text. Returns a promise resolved when done (or immediately if unsupported). */
export async function speak(text, { slow = false } = {}) {
  if (!text) return;
  const clean = stripStress(text).replace(/\s*\(.*?\)\s*/g, ' ').trim();
  if (usingOnlineVoice()) {
    if (ttsSupported()) speechSynthesis.cancel();
    const ok = await speakOnline(clean, slow);
    if (ok) return;
  }
  return speakLocal(clean, slow);
}
function speakLocal(clean, slow) {
  return new Promise(resolve => {
    if (!ttsSupported()) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'ru-RU';
    const v = bestVoice(); if (v) u.voice = v;
    u.rate = slow ? 0.6 : (state.settings.slowAudio ? 0.8 : 0.92);
    u.pitch = 1;
    u.onend = () => resolve(); u.onerror = () => resolve();
    speechSynthesis.speak(u);
    setTimeout(resolve, 8000); // safety
  });
}
export function stopSpeaking() { if (ttsSupported()) speechSynthesis.cancel(); if (onlineAudio) { onlineAudio.pause(); onlineAudio = null; } }

/* Speech recognition */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export function canListen() { return !!SR; }
/** Resolve with transcript (string) or reject on error/no speech. onStart optional. */
export function listen({ onStart } = {}) {
  return new Promise((resolve, reject) => {
    if (!SR) return reject(new Error('unsupported'));
    const r = new SR();
    r.lang = 'ru-RU'; r.interimResults = false; r.maxAlternatives = 3;
    let done = false;
    r.onstart = () => onStart && onStart();
    r.onresult = e => { done = true; const alts = [...e.results[0]].map(a => a.transcript); resolve(alts); };
    r.onerror = e => { if (!done) reject(new Error(e.error || 'error')); };
    r.onend = () => { if (!done) reject(new Error('no-speech')); };
    try { r.start(); } catch (err) { reject(err); }
  });
}
