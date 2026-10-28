// Opens lessons and unit tests in the session runner and awards progress.
import { h, sample, shuffle, navigate, toast } from '../util.js';
import { state, addXP, save } from '../state.js';
import { addItems } from '../srs.js';
import { XP, checkBadges } from '../gamify.js';
import { getLesson, getUnit, lessonItemIds, ACTIVE_UNITS, unitUnlocked, GATE } from '../content.js';
import { COINS, useDoubleXP } from '../shop.js';
import { addCoins } from '../state.js';
import { runSession } from '../session.js';
import { audioBtn } from '../exercises.js';
import { speak } from '../audio.js';

function filterSpeak(exs) { return state.settings.speakExercises ? exs : exs.filter(e => e.type !== 'speak'); }

export function openLesson(id) {
  const found = getLesson(id);
  if (!found) return toast('Lesson not found');
  const { unit, lesson } = found;
  const exercises = filterSpeak((lesson.build ? lesson.build() : lesson.exercises).map(e => ({ ...e })));
  runSession({
    lecture: lesson.lecture || [],
    exercises,
    requeue: true,
    xpPerCorrect: XP.correct,
    onFinish: (stats, close) => lessonResults(unit, lesson, stats, close),
  });
}

function lessonResults(unit, lesson, stats, close) {
  const perfect = stats.accuracy === 100;
  const pass = stats.accuracy >= GATE.lessonPass;
  const doubled = pass && useDoubleXP();
  const xp = (stats.xp + (perfect ? XP.perfectBonus : 0)) * (doubled ? 2 : 1);
  const rec = state.lessons[lesson.id] || { attempts: 0, best: 0, completed: false, passed: false };
  const first = !rec.completed;
  const firstPass = pass && !rec.passed;
  rec.completed = true; rec.passed = rec.passed || pass; rec.attempts += 1; rec.best = Math.max(rec.best || 0, stats.accuracy); rec.lastAt = Date.now();
  state.lessons[lesson.id] = rec;
  const newItems = addItems(lessonItemIds(lesson));
  const r = addXP(xp, 'lesson');
  const bonusCoins = (firstPass ? COINS.firstPass : 0) + (perfect ? COINS.perfectLesson : 0);
  addCoins(bonusCoins);
  const coins = (r.coins || 0) + bonusCoins;
  const badges = checkBadges();

  const el = h('div', { class: 'results popin' },
    h('div', { class: 'big-emoji' }, perfect ? '🏆' : pass ? '🎉' : '💪'),
    h('h1', {}, perfect ? 'Отлично! Perfect lesson!' : pass ? 'Молодец! Lesson passed' : 'Not yet'),
    h('p', {}, pass ? `${unit.title} · ${lesson.title}` : `You scored ${stats.accuracy}%. You need ${GATE.lessonPass}% to move on, so the next lesson stays locked. Your cards were saved: do a review, then try this lesson again.`),
    h('div', { class: 'result-stats' },
      h('div', { class: 'rs gold' }, h('b', {}, `+${xp}`), h('span', {}, doubled ? 'XP (doubled ⚡)' : 'XP')),
      h('div', { class: 'rs green' }, h('b', {}, `${stats.accuracy}%`), h('span', {}, 'accuracy')),
      h('div', { class: 'rs gold' }, h('b', {}, `+${coins}`), h('span', {}, 'rubles ₽')),
      h('div', { class: 'rs' }, h('b', {}, newItems), h('span', {}, 'new cards')),
    ),
  );
  if (perfect) el.append(h('div', { class: 'pill gold' }, `+${XP.perfectBonus} XP · +₽${COINS.perfectLesson} perfect bonus`));
  if (r.streakChanged) el.append(h('p', { class: 'mt' }, `🔥 Streak: ${r.newStreak} day${r.newStreak === 1 ? '' : 's'}`));
  if (lesson.vocab?.length) {
    el.append(h('h3', { class: 'mt' }, first ? 'Added to your review deck' : 'Words in this lesson'));
    el.append(h('div', { class: 'new-words' }, lesson.vocab.slice(0, 12).map(v => h('button', { class: 'pill accent', type: 'button', lang: 'ru', onclick: () => speak(v.ru) }, '🔊 ', v.ru))));
  }
  if (badges.length) el.append(h('div', { class: 'mt' }, badges.map(b => h('div', { class: 'badge-pop' }, b.ico, ` Badge earned: ${b.name}`))));
  if (lesson.homework && firstPass) {
    el.append(h('div', { class: 'card soft mt', style: { textAlign: 'left' } },
      h('h3', {}, '📝 Homework assigned'), h('b', {}, lesson.homework.title), h('p', {}, lesson.homework.text),
      h('a', { class: 'btn secondary sm', href: '#/homework', onclick: close }, 'Open homework')));
  }
  el.append(h('div', { class: 'row mt', style: { justifyContent: 'center' } },
    h('button', { class: 'btn', type: 'button', onclick: () => { close(); navigate('#/learn'); } }, 'Continue'),
    h('button', { class: 'btn secondary', type: 'button', onclick: () => { close(); openLesson(lesson.id); } }, 'Practice again')));
  return el;
}

function buildTest(unit) {
  if (unit.test.build) return unit.test.build();
  const pool = unit.lessons.flatMap(l => (l.exercises || []).filter(e => !['match', 'speak'].includes(e.type)));
  return sample(pool, Math.min(20, pool.length));
}

export function openTest(unitId) {
  const unit = getUnit(unitId);
  if (!unit || !unit.test) return toast('Test not found');
  const exercises = filterSpeak(shuffle(buildTest(unit)).map(e => ({ ...e })));
  runSession({
    lecture: [{ title: `🏆 ${unit.test.title}`, html: `<p>${unit.test.desc || ''}</p><div class="callout"><p>Pass mark: <b>${unit.test.passMark}%</b>. No second chances inside the test, so take your time. You can retake it any time.</p></div>` }],
    exercises,
    requeue: false,
    xpPerCorrect: XP.correct,
    onFinish: (stats, close) => testResults(unit, stats, close),
  });
}

function testResults(unit, stats, close) {
  const pass = stats.accuracy >= unit.test.passMark;
  const doubled = pass && useDoubleXP();
  const xp = (stats.xp + (pass ? XP.testPass : 0)) * (doubled ? 2 : 1);
  const rec = state.tests[unit.test.id] || { attempts: 0, best: 0, passed: false };
  const firstPass = pass && !rec.passed;
  rec.attempts += 1; rec.best = Math.max(rec.best || 0, stats.accuracy); rec.passed = rec.passed || pass; rec.lastAt = Date.now();
  state.tests[unit.test.id] = rec;
  const r = addXP(xp, 'test');
  const coins = (r.coins || 0) + (firstPass ? addCoins(COINS.testPass) : 0);
  const badges = checkBadges();
  const idx = ACTIVE_UNITS.indexOf(unit);
  const nextUnit = ACTIVE_UNITS[idx + 1];

  const el = h('div', { class: 'results popin' },
    h('div', { class: 'big-emoji' }, pass ? '🎓' : '📚'),
    h('h1', {}, pass ? 'Passed!' : 'Not yet'),
    h('p', {}, pass ? `You passed the ${unit.test.title} with ${stats.accuracy}%.` : `You scored ${stats.accuracy}%. You need ${unit.test.passMark}%. Review the weak spots and try again.`),
    h('div', { class: 'result-stats' },
      h('div', { class: 'rs gold' }, h('b', {}, `+${xp}`), h('span', {}, doubled ? 'XP (doubled ⚡)' : 'XP')),
      h('div', { class: 'rs green' }, h('b', {}, `${stats.correct}/${stats.total}`), h('span', {}, 'correct')),
      h('div', { class: 'rs gold' }, h('b', {}, `+${coins}`), h('span', {}, 'rubles ₽')),
      h('div', { class: 'rs' }, h('b', {}, rec.attempts), h('span', {}, 'attempts')),
    ));
  if (firstPass && nextUnit && unitUnlocked(nextUnit)) el.append(h('div', { class: 'pill green' }, `🔓 ${nextUnit.title} unlocked`));
  if (firstPass && !nextUnit) el.append(h('p', {}, 'You have finished everything that exists so far. More units are on the way.'));
  if (badges.length) el.append(h('div', { class: 'mt' }, badges.map(b => h('div', { class: 'badge-pop' }, b.ico, ` Badge earned: ${b.name}`))));
  const wrong = stats.answers.filter(a => !a.correct);
  if (wrong.length) {
    el.append(h('h3', { class: 'mt' }, 'To review'));
    el.append(h('div', { class: 'list', style: { textAlign: 'left' } }, wrong.slice(0, 8).map(a => {
      const ans = a.ex.answer || a.ex.text || '';
      return h('div', { class: 'item' }, audioBtn(ans, { cls: 'inline' }), h('div', { class: 'body' }, h('b', { lang: 'ru' }, ans), h('span', {}, a.ex.prompt || a.ex.translation || a.ex.big || '')));
    })));
  }
  el.append(h('div', { class: 'row mt', style: { justifyContent: 'center' } },
    h('button', { class: 'btn', type: 'button', onclick: () => { close(); navigate('#/learn'); } }, 'Continue'),
    !pass ? h('button', { class: 'btn secondary', type: 'button', onclick: () => { close(); openTest(unit.id); } }, 'Retake') : null));
  return el;
}
