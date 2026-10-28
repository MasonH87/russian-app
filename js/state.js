// Persistent progress store (localStorage) with export/import.
import { todayKey, daysBetween } from './util.js';

const KEY = 'russkiy.progress.v1';
const listeners = new Set();

function defaults() {
  return {
    version: 1,
    createdAt: Date.now(),
    xp: 0,
    xpByDay: {},             // 'YYYY-MM-DD' -> xp earned that day
    streak: { count: 0, last: null, freezes: 1, best: 0 },
    dailyGoal: 50,
    lessons: {},             // lessonId -> { completed, best, attempts, lastAt }
    tests: {},               // testId -> { passed, best, attempts, lastAt }
    srs: {},                 // itemId -> { ef, interval, reps, due, lapses, added }
    homework: {},            // hwId -> { done, doneAt, confirmed, note }
    badges: {},              // badgeId -> timestamp
    reviews: 0,              // total review answers
    coins: 0,                // spendable rubles (₽), earned alongside XP
    coinsEarned: 0,
    shop: { owned: [], equipped: { avatar: '', title: '', theme: '' }, boosts: { doubleXP: 0 } },
    settings: { name: '', theme: 'dark', autoplay: true, keyboard: true, slowAudio: false, speakExercises: true, voice: '' },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const d = defaults(), s = JSON.parse(raw);
    const merged = { ...d, ...s, streak: { ...d.streak, ...(s.streak || {}) }, settings: { ...d.settings, ...(s.settings || {}) },
      shop: { ...d.shop, ...(s.shop || {}), equipped: { ...d.shop.equipped, ...(s.shop?.equipped || {}) }, boosts: { ...d.shop.boosts, ...(s.shop?.boosts || {}) } } };
    // Migration: rubles were added after launch; grant them retroactively for XP already earned.
    if (s.coins === undefined) { merged.coins = Math.floor((s.xp || 0) / 10); merged.coinsEarned = merged.coins; }
    return merged;
  } catch { return defaults(); }
}

export const state = load();

export function save() {
  state.lastActive = Date.now();
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach(fn => fn(state));
}
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/** Add XP, update per-day totals and the streak. Returns {xp, streakChanged, newStreak}. */
export function addXP(amount, reason = '') {
  if (!amount) return { xp: 0 };
  const today = todayKey();
  state.xp += amount;
  state.lastStudy = Date.now();
  state.xpByDay[today] = (state.xpByDay[today] || 0) + amount;
  const coins = Math.floor(amount / 10);
  state.coins += coins; state.coinsEarned += coins;
  const res = touchStreak(today);
  if (res.streakChanged && res.newStreak % 7 === 0) { state.coins += 15; state.coinsEarned += 15; res.streakBonus = 15; }
  save();
  return { xp: amount, coins: coins + (res.streakBonus || 0), ...res, reason };
}
export function addCoins(n, reason = '') {
  if (!n) return 0;
  state.coins += n; state.coinsEarned += n; save();
  return n;
}
export function spendCoins(n) {
  if (state.coins < n) return false;
  state.coins -= n; save();
  return true;
}

function touchStreak(today) {
  const st = state.streak;
  if (st.last === today) return { streakChanged: false, newStreak: st.count };
  if (!st.last) st.count = 1;
  else {
    const gap = daysBetween(st.last, today);
    if (gap === 1) st.count += 1;
    else if (gap === 2 && st.freezes > 0) { st.freezes -= 1; st.count += 1; st.frozeOn = today; }
    else st.count = 1;
  }
  st.last = today;
  if (st.count > st.best) st.best = st.count;
  if (st.count % 7 === 0 && st.freezes < 2) st.freezes += 1; // earn a freeze every 7 days
  return { streakChanged: true, newStreak: st.count };
}

/** Current streak, accounting for a missed yesterday (which breaks it unless a freeze is available). */
export function currentStreak() {
  const st = state.streak;
  if (!st.last) return 0;
  const gap = daysBetween(st.last, todayKey());
  if (gap <= 1) return st.count;
  if (gap === 2 && st.freezes > 0) return st.count;
  return 0;
}

export function xpToday() { return state.xpByDay[todayKey()] || 0; }

/** Called once at startup: after a long break, require a checkpoint quiz before any new lesson. */
export function detectBreak(breakDays, minDeck) {
  if (state.gate === 'checkpoint') return;
  if (!state.lastStudy || Object.keys(state.srs).length < minDeck) return;
  const days = daysBetween(todayKey(new Date(state.lastStudy)), todayKey());
  if (days >= breakDays) { state.gate = 'checkpoint'; state.gateDays = days; save(); }
}
export function clearGate() { state.gate = null; state.gateDays = 0; save(); }

export function exportJSON() { return JSON.stringify(state, null, 2); }
export function importJSON(text) {
  const obj = JSON.parse(text);
  if (!obj || typeof obj !== 'object' || !('xp' in obj)) throw new Error('Not a valid progress file');
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, { ...defaults(), ...obj });
  save();
}
export function resetAll() {
  const d = defaults();
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, d);
  save();
}
