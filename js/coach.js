// Builds a compact plain-text progress report to paste into a chat with your coach.
import { state, currentStreak } from './state.js';
import { mastery, dueCount } from './srs.js';
import { levelInfo } from './gamify.js';
import { ACTIVE_UNITS, itemMeta, homeworkList } from './content.js';
import { stripStress, todayKey } from './util.js';

export function coachSummary() {
  const L = [];
  const lvl = levelInfo();
  L.push(`# Russian progress report · ${todayKey()}`);
  L.push(`Learner: ${state.settings.name || '(no name)'} · Level ${lvl.level} (${lvl.title}) · ${state.xp} XP total · streak ${currentStreak()} days (best ${state.streak.best}) · daily goal ${state.dailyGoal} XP`);

  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return state.xpByDay[todayKey(d)] || 0; }).reverse();
  L.push(`XP last 7 days (oldest→today): ${last7.join(', ')}`);

  L.push('', '## Lessons');
  for (const u of ACTIVE_UNITS) {
    const parts = u.lessons.map((l, i) => { const r = state.lessons[l.id]; return r?.completed ? `L${i + 1} ${l.title}: ${r.best}%` : null; }).filter(Boolean);
    const t = state.tests[u.test.id];
    L.push(`Unit ${u.num} ${u.title}: ${parts.length}/${u.lessons.length} lessons done${parts.length ? ' (' + parts.join('; ') + ')' : ''}; test ${t?.passed ? `passed (best ${t.best}%)` : t?.attempts ? `failed ${t.attempts}x (best ${t.best}%)` : 'not taken'}`);
  }

  const items = Object.entries(state.srs).map(([id, it]) => ({ id, it, meta: itemMeta(id) })).filter(x => x.meta);
  const words = items.filter(x => x.meta.kind === 'word'), letters = items.filter(x => x.meta.kind === 'letter');
  const count = arr => { const c = { new: 0, learning: 0, known: 0, mastered: 0 }; arr.forEach(x => c[mastery(x.it)]++); return c; };
  const wc = count(words), lc = count(letters);
  L.push('', '## Review deck');
  L.push(`Words: ${words.length} (new ${wc.new}, learning ${wc.learning}, known ${wc.known}, mastered ${wc.mastered}) · Letters: ${letters.length}/33 (solid ${lc.known + lc.mastered}) · due now: ${dueCount()} · total reviews answered: ${state.reviews}`);
  const weak = words.filter(x => x.it.lapses > 0 || x.it.ef < 2.3).sort((a, b) => (b.it.lapses - a.it.lapses) || (a.it.ef - b.it.ef)).slice(0, 12);
  if (weak.length) L.push(`Weakest words: ${weak.map(x => `${stripStress(x.meta.ru)} (${x.meta.en}; ${x.it.lapses} lapses)`).join(', ')}`);
  const weakL = letters.filter(x => x.it.lapses > 0).sort((a, b) => b.it.lapses - a.it.lapses).slice(0, 8);
  if (weakL.length) L.push(`Letters that trip me up: ${weakL.map(x => `${x.meta.up} (${x.it.lapses})`).join(', ')}`);
  const strong = words.filter(x => mastery(x.it) === 'mastered').slice(0, 15);
  if (strong.length) L.push(`Mastered: ${strong.map(x => stripStress(x.meta.ru)).join(', ')}`);

  const hw = homeworkList();
  if (hw.length) {
    L.push('', '## Homework');
    hw.forEach(x => L.push(`- ${x.status.done ? '✓' : '○'} ${x.title}${x.status.confirmed ? ' (partner confirmed)' : ''}${x.status.note ? ` — note: ${x.status.note}` : ''}`));
  }
  L.push('', 'Coach: please quiz me on my weak items, explain what I keep getting wrong, and give me a short conversation exercise at my level.');
  return L.join('\n');
}
