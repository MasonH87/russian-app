// Spaced-repetition review page, review sessions, and the checkpoint quiz after a break.
import { h, shuffle, sample, navigate, todayKey } from '../util.js';
import { state, addXP, save, clearGate, addCoins } from '../state.js';
import { COINS } from '../shop.js';
import { dueItems, reviewItem, masteryCounts } from '../srs.js';
import { exerciseForItem } from '../generate.js';
import { XP, checkBadges } from '../gamify.js';
import { runSession } from '../session.js';
import { gate, GATE } from '../content.js';

const LIMIT = 20;
const CHECKPOINT_SIZE = 20;
const CHECKPOINT_PASS = 80;

export function gateCard() {
  const g = gate();
  if (!g) return null;
  if (g.type === 'checkpoint') return h('div', { class: 'card soft', style: { borderColor: 'var(--gold)' } },
    h('h3', {}, '🧭 Checkpoint quiz required'),
    h('p', { class: 'small' }, `You have been away ${g.days} days. Before any new lesson, prove the old material is still there: ${CHECKPOINT_SIZE} cards from your deck, ${CHECKPOINT_PASS}% to pass. Fail it and the cards you missed come straight back into review.`),
    h('button', { class: 'btn gold', type: 'button', onclick: openCheckpoint }, 'Take the checkpoint quiz'));
  return h('div', { class: 'card soft', style: { borderColor: 'var(--gold)' } },
    h('h3', {}, '🔒 Review before new lessons'),
    h('p', { class: 'small' }, `${g.due} cards are due. New lessons unlock once you are down to ${GATE.maxDue} or fewer. This is deliberate: new words on top of forgotten ones do not stick.`),
    h('a', { class: 'btn gold', href: '#/review' }, 'Go to review'));
}

export function render() {
  const due = dueItems();
  const words = masteryCounts(id => id.startsWith('w:'));
  const letters = masteryCounts(id => id.startsWith('l:'));
  const total = Object.keys(state.srs).length;
  const el = h('div');
  el.append(h('h1', {}, 'Review'), h('p', {}, 'Cards come back right before you would forget them. A few minutes a day keeps everything you have learned.'));
  const gc = gateCard(); if (gc) el.append(gc);
  el.append(h('div', { class: 'card accent' },
    h('div', { class: 'spread' },
      h('div', {}, h('h2', {}, due.length ? `${due.length} card${due.length === 1 ? '' : 's'} due` : 'Nothing due right now'),
        h('p', {}, due.length ? `A session covers up to ${LIMIT} cards. Missed cards repeat until you get them right.` : total ? 'Come back later, or do a quick practice round.' : 'Complete a lesson to start your deck.')),
      h('div', { style: { fontSize: '3rem' } }, '🔁')),
    h('div', { class: 'row mt' },
      h('button', { class: 'btn gold', type: 'button', disabled: !due.length, onclick: () => start(due.slice(0, LIMIT), false) }, due.length ? 'Start review' : 'No cards due'),
      h('button', { class: 'btn secondary', type: 'button', disabled: !total, onclick: () => start(sample(Object.keys(state.srs), 10), true) }, 'Practice 10 random'))));
  el.append(h('div', { class: 'card' }, h('h3', {}, 'Your deck'),
    h('div', { class: 'mastery' },
      h('div', {}, h('b', {}, words.new + letters.new), h('span', {}, 'new')),
      h('div', { style: { color: 'var(--gold)' } }, h('b', {}, words.learning + letters.learning), h('span', {}, 'learning')),
      h('div', { style: { color: 'var(--blue)' } }, h('b', {}, words.known + letters.known), h('span', {}, 'known')),
      h('div', { style: { color: 'var(--green)' } }, h('b', {}, words.mastered + letters.mastered), h('span', {}, 'mastered'))),
    h('p', { class: 'small mt' }, `${words.total} words · ${letters.total} letters. “Mastered” means a review interval of three weeks or more.`)));
  el.append(h('div', { class: 'card soft' }, h('h3', {}, 'The rules'),
    h('ul', { class: 'small', style: { color: 'var(--text-2)', lineHeight: 1.6, paddingLeft: '18px', margin: 0 } },
      h('li', {}, 'Right first time: the card moves further into the future. A typo counts as a pass with a smaller step.'),
      h('li', {}, 'Wrong: the card repeats in this session until you get it, comes back in 10 minutes, then again tomorrow.'),
      h('li', {}, `Lessons need ${GATE.lessonPass}% to count as passed. Below that, the next lesson stays locked.`),
      h('li', {}, `More than ${GATE.maxDue} cards due blocks new lessons until you review.`),
      h('li', {}, `Away ${GATE.breakDays}+ days? A checkpoint quiz on old material comes first.`))));
  return el;
}

function resultsEl(stats, title, note, close, extra = [], coins = Math.floor(stats.xp / 10)) {
  const el = h('div', { class: 'results popin' },
    h('div', { class: 'big-emoji' }, stats.accuracy >= 90 ? '🧠' : '🔁'),
    h('h1', {}, title), h('p', {}, note),
    h('div', { class: 'result-stats' },
      h('div', { class: 'rs gold' }, h('b', {}, `+${stats.xp}`), h('span', {}, 'XP')),
      h('div', { class: 'rs green' }, h('b', {}, `${stats.correct}/${stats.total}`), h('span', {}, 'first try')),
      h('div', { class: 'rs gold' }, h('b', {}, `+${coins}`), h('span', {}, 'rubles ₽')),
      h('div', { class: 'rs' }, h('b', {}, dueItems().length), h('span', {}, 'still due'))),
    ...extra,
    h('div', { class: 'row mt', style: { justifyContent: 'center' } },
      h('button', { class: 'btn', type: 'button', onclick: () => { close(); navigate('#/review'); } }, 'Done'),
      h('button', { class: 'btn secondary', type: 'button', onclick: () => { close(); navigate('#/learn'); } }, 'Lessons')));
  return el;
}

function start(ids, practice) {
  const exercises = shuffle(ids.map(exerciseForItem).filter(Boolean));
  if (!exercises.length) return;
  runSession({
    exercises,
    requeue: true,
    xpPerCorrect: XP.review,
    onAnswer(ex, result, firstTry) { if (!practice && ex.itemId && firstTry) reviewItem(ex.itemId, result.correct ? (result.typo ? 4 : 5) : 2); },
    onFinish(stats, close) {
      save();
      const r = addXP(stats.xp, practice ? 'practice' : 'review');
      let coins = r.coins || 0;
      const extra = [];
      if (stats.accuracy === 100 && stats.total >= COINS.minReviewForPerfect) { addCoins(coins * (COINS.perfectMultiplier - 1)); coins *= COINS.perfectMultiplier; extra.push(h('div', { class: 'pill gold' }, `Perfect session! Rubles ×${COINS.perfectMultiplier}`)); }
      if (!practice && dueItems().length === 0 && state.lastClearDay !== todayKey()) { state.lastClearDay = todayKey(); addCoins(COINS.clearQueue); coins += COINS.clearQueue; extra.push(h('div', { class: 'pill green' }, `Queue cleared! +₽${COINS.clearQueue} (once a day)`)); }
      const badges = checkBadges();
      if (r.streakChanged) extra.push(h('p', {}, `🔥 Streak: ${r.newStreak} day${r.newStreak === 1 ? '' : 's'}`));
      if (badges.length) extra.push(h('div', { class: 'mt' }, badges.map(b => h('div', { class: 'badge-pop' }, b.ico, ` Badge earned: ${b.name}`))));
      return resultsEl(stats, practice ? 'Practice complete' : 'Review complete', practice ? 'Practice rounds do not change your card schedule.' : 'Your cards have been rescheduled.', close, extra, coins);
    },
  });
}

export function openCheckpoint() {
  const ids = Object.keys(state.srs);
  const due = dueItems();
  const pool = [...new Set([...sample(due, Math.min(CHECKPOINT_SIZE, due.length)), ...sample(ids, CHECKPOINT_SIZE)])].slice(0, CHECKPOINT_SIZE);
  const exercises = shuffle(pool.map(exerciseForItem).filter(Boolean));
  if (!exercises.length) { clearGate(); return navigate('#/learn'); }
  runSession({
    lecture: [{ title: '🧭 Checkpoint quiz', html: `<p>Welcome back. ${exercises.length} cards from everything you have learned so far. You need <b>${CHECKPOINT_PASS}%</b> to reopen lessons.</p><div class="callout"><p>Anything you miss is marked as forgotten and goes back to the front of your review queue, exactly like Anki would.</p></div>` }],
    exercises,
    requeue: false,
    xpPerCorrect: XP.review,
    onAnswer(ex, result) { if (ex.itemId) reviewItem(ex.itemId, result.correct ? (result.typo ? 4 : 5) : 1); },
    onFinish(stats, close) {
      save();
      const pass = stats.accuracy >= CHECKPOINT_PASS;
      if (pass) clearGate();
      addXP(stats.xp + (pass ? XP.testPass : 0), 'checkpoint');
      checkBadges();
      return resultsEl(stats, pass ? 'Checkpoint passed' : 'Not yet',
        pass ? 'Lessons are unlocked again. Missed cards are back in your review queue.' : `You scored ${stats.accuracy}%, needed ${CHECKPOINT_PASS}%. Review the cards you missed, then retake the checkpoint from the Review or Learn tab.`, close);
    },
  });
}
