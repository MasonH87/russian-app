// Generates review exercises for spaced-repetition items.
import { WORDS, itemMeta } from './content.js';
import { LETTERS } from '../data/alphabet.js';
import { state } from './state.js';
import { mastery } from './srs.js';
import { sample, stripStress, norm } from './util.js';

const display = l => `${l.up} ${l.low}`;

function distractors(word, n = 3) {
  const pool = [...WORDS.values()].filter(w => w.id !== word.id && norm(w.en) !== norm(word.en) && norm(w.ru) !== norm(word.ru));
  const same = pool.filter(w => w.unitId === word.unitId);
  const chosen = sample(same, n);
  if (chosen.length < n) chosen.push(...sample(pool.filter(w => !chosen.includes(w)), n - chosen.length));
  return chosen;
}
function tilesFor(w, ds) {
  const extra = ds.flatMap(d => stripStress(d.ru).split(/\s+/)).filter(t => !stripStress(w.ru).split(/\s+/).some(a => norm(a) === norm(t)));
  return [...stripStress(w.ru).split(/\s+/), ...sample([...new Set(extra)], 3)];
}

function wordExercise(w) {
  const lvl = mastery(state.srs[w.id]);
  const ds = distractors(w);
  const isPhrase = /\s/.test(stripStress(w.ru));
  const r = Math.random();
  if (lvl === 'new' || lvl === 'learning') {
    return r < 0.5
      ? { type: 'mc', prompt: 'What does this mean?', big: w.ru, audio: w.ru, options: [w.en, ...ds.map(d => d.en)], answer: w.en }
      : { type: 'mc', prompt: `Which one means “${w.en}”?`, options: [w.ru, ...ds.map(d => d.ru)], answer: w.ru, speakOptions: true };
  }
  if (lvl === 'known') {
    if (isPhrase && r < 0.6) return { type: 'tiles', prompt: `Translate: ${w.en}`, answer: w.ru, tiles: tilesFor(w, ds), accept: w.accept };
    return { type: 'listen_type', audio: w.ru, answer: w.ru, hint: `Meaning: ${w.en}`, accept: w.accept };
  }
  return r < 0.6
    ? { type: 'translate', prompt: w.en, answer: w.ru, accept: w.accept, dir: 'en-ru' }
    : { type: 'listen_type', audio: w.ru, answer: w.ru, accept: w.accept };
}

function letterExercise(l) {
  const others = sample(LETTERS.filter(x => x.up !== l.up && x.sound !== l.sound), 3);
  const r = Math.random();
  if (r < 0.34) return { type: 'mc', prompt: 'What sound does this letter make?', big: display(l), options: [l.sound, ...others.map(o => o.sound)], answer: l.sound, speakAfter: l.ex };
  if (r < 0.67) return { type: 'mc', prompt: `Which letter makes the sound “${l.sound}”?`, options: [l, ...others].map(display), answer: display(l), bigOptions: true, speakAfter: l.name };
  return { type: 'mc', prompt: 'Tap the letter you hear', audio: l.name, options: [l, ...others].map(display), answer: display(l), bigOptions: true };
}

export function exerciseForItem(id) {
  const m = itemMeta(id);
  if (!m) return null;
  const ex = m.kind === 'letter' ? letterExercise(m) : wordExercise(m);
  ex.itemId = id;
  return ex;
}
