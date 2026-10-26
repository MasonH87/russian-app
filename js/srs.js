// Spaced repetition (SM-2) over the state's srs map.
import { state, save } from './state.js';
import { DAY } from './util.js';

export function addItem(id) {
  if (state.srs[id]) return false;
  state.srs[id] = { ef: 2.5, interval: 0, reps: 0, due: Date.now(), lapses: 0, added: Date.now() };
  return true;
}
export function addItems(ids) { let n = 0; for (const id of ids) if (addItem(id)) n++; if (n) save(); return n; }

/** quality: 0-5 (5 perfect, 4 typo/hesitant, 2-0 fail) */
export function reviewItem(id, quality) {
  const it = state.srs[id]; if (!it) return;
  const now = Date.now();
  if (quality < 3) {
    it.reps = 0; it.interval = 1; it.lapses += 1;
    it.due = now + 10 * 60 * 1000; // come back in 10 minutes
  } else {
    if (it.reps === 0) it.interval = 1;
    else if (it.reps === 1) it.interval = 3;
    else it.interval = Math.round(it.interval * it.ef);
    it.reps += 1;
    it.due = now + it.interval * DAY;
  }
  it.ef = Math.max(1.3, it.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  it.last = now;
  state.reviews += 1;
}

export function dueItems(now = Date.now()) {
  return Object.entries(state.srs).filter(([, it]) => it.due <= now).map(([id]) => id);
}
export function dueCount() { return dueItems().length; }

export function mastery(it) {
  if (!it || it.reps === 0) return 'new';
  if (it.interval < 7) return 'learning';
  if (it.interval < 21) return 'known';
  return 'mastered';
}
export function masteryCounts(filterFn = () => true) {
  const c = { new: 0, learning: 0, known: 0, mastered: 0, total: 0 };
  for (const [id, it] of Object.entries(state.srs)) { if (!filterFn(id)) continue; c[mastery(it)]++; c.total++; }
  return c;
}
