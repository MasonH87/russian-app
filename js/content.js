// Content registry: units, lessons, vocabulary items, unlock rules, homework.
import { UNITS } from '../data/units/index.js';
import { LETTERS } from '../data/alphabet.js';
import { norm } from './util.js';
import { state, save } from './state.js';
import { dueCount } from './srs.js';
import { ALL_ITEMS } from './shop.js';

export const wordId = ru => 'w:' + norm(ru);
export const letterId = up => 'l:' + up;

export const ACTIVE_UNITS = UNITS.filter(u => !u.planned);
export const PLANNED_UNITS = UNITS.filter(u => u.planned);

export const WORDS = new Map();
for (const u of ACTIVE_UNITS) for (const les of u.lessons) for (const v of (les.vocab || [])) {
  const id = wordId(v.ru);
  if (!WORDS.has(id)) WORDS.set(id, { ...v, id, unitId: u.id, lessonId: les.id });
}
// Shop and mystery-box items are real Russian words; they join the vocabulary when owned.
for (const it of ALL_ITEMS) {
  const ru = it.ru || it.name; if (!ru) continue;
  const id = wordId(ru);
  if (!WORDS.has(id)) WORDS.set(id, { ru, en: it.en.replace(/\s*\(.*\)/, ''), id, unitId: 'shop', lessonId: 'shop', accept: [] });
}
export const LETTER_MAP = new Map(LETTERS.map(l => [letterId(l.up), l]));

// Drop review cards whose word no longer exists in the content (keeps the queue honest after content edits).
let orphans = 0;
for (const id of Object.keys(state.srs)) if (!(id.startsWith('l:') ? LETTER_MAP.has(id) : WORDS.has(id))) { delete state.srs[id]; orphans++; }
if (orphans) save();

export function itemMeta(id) {
  if (id.startsWith('l:')) { const l = LETTER_MAP.get(id); return l ? { kind: 'letter', id, ...l } : null; }
  const w = WORDS.get(id); return w ? { kind: 'word', ...w } : null;
}

export function getUnit(id) { return UNITS.find(u => u.id === id); }
export function getLesson(id) {
  for (const u of ACTIVE_UNITS) { const i = u.lessons.findIndex(l => l.id === id); if (i >= 0) return { unit: u, lesson: u.lessons[i], index: i }; }
  return null;
}
export function lessonItemIds(lesson) {
  const ids = (lesson.vocab || []).map(v => wordId(v.ru));
  (lesson.letters || []).forEach(up => ids.push(letterId(up)));
  return ids;
}

/* ── Unlock rules ── */
export function unitUnlocked(u) {
  if (u.planned) return false;
  const i = ACTIVE_UNITS.indexOf(u);
  if (i <= 0) return true;
  return !!state.tests[ACTIVE_UNITS[i - 1].test.id]?.passed;
}
/** Mastery gate: new material is blocked while reviews pile up or after a long break. */
export const GATE = { maxDue: 8, breakDays: 5, minDeck: 10, lessonPass: 80 };
export function gate() {
  if (state.gate === 'checkpoint') return { type: 'checkpoint', days: state.gateDays || GATE.breakDays };
  const due = dueCount();
  if (due > GATE.maxDue) return { type: 'review', due };
  return null;
}
const passed = id => !!state.lessons[id]?.passed;
export function lessonStatus(u, idx) {
  if (!unitUnlocked(u)) return 'locked';
  const l = u.lessons[idx];
  if (passed(l.id)) return 'done';
  if (idx === 0 || passed(u.lessons[idx - 1].id)) return gate() ? 'gated' : 'available';
  return 'locked';
}
export function testStatus(u) {
  if (!unitUnlocked(u)) return 'locked';
  if (state.tests[u.test.id]?.passed) return 'done';
  if (!u.lessons.every(l => passed(l.id))) return 'locked';
  return gate() ? 'gated' : 'available';
}
export function unitProgress(u) {
  const done = u.lessons.filter(l => state.lessons[l.id]?.passed).length + (state.tests[u.test.id]?.passed ? 1 : 0);
  return { done, total: u.lessons.length + 1, pct: Math.round(done / (u.lessons.length + 1) * 100) };
}
export function unitsPassed() { return ACTIVE_UNITS.filter(u => state.tests[u.test.id]?.passed).length; }

/** The next thing to do on the map: a lesson or a test, or null if everything is done. */
export function nextStep() {
  for (const u of ACTIVE_UNITS) {
    for (let i = 0; i < u.lessons.length; i++) { const s = lessonStatus(u, i); if (s === 'available' || s === 'gated') return { type: 'lesson', unit: u, lesson: u.lessons[i], gated: s === 'gated' }; }
    const ts = testStatus(u);
    if (ts === 'available' || ts === 'gated') return { type: 'test', unit: u, gated: ts === 'gated' };
  }
  return null;
}

/* ── Homework ── */
export function homeworkList() {
  const list = [];
  for (const u of ACTIVE_UNITS) for (const les of u.lessons) {
    if (!les.homework || !state.lessons[les.id]?.passed) continue;
    const id = 'hw:' + les.id;
    list.push({ id, lessonId: les.id, lessonTitle: les.title, unitTitle: u.title, ...les.homework, status: state.homework[id] || {} });
  }
  return list;
}
export function pendingHomework() { return homeworkList().filter(hw => !hw.status.done); }
